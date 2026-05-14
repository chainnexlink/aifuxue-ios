import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditTransactionType } from '@prisma/client';
import * as crypto from 'crypto';
import { APPLE_ROOT_CA_G3_PEM } from './apple-root-ca';

const BUNDLE_ID = 'cn.aifuxue';

const SUBSCRIPTION_PRODUCTS = new Set([
  'cn.aifuxue.vip.monthly',
  'cn.aifuxue.vip.yearly',
  'cn.aifuxue.teacher.monthly',
]);

const CONSUMABLE_PRODUCTS = new Set([
  'cn.aifuxue.teacher.peruse',
]);

interface DecodedTransaction {
  transactionId: string;
  originalTransactionId: string;
  bundleId: string;
  productId: string;
  purchaseDate: number;
  expiresDate?: number;
  type: string;
  environment: string;
  revocationDate?: number;
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  async verifyAndProcessTransaction(userId: string, signedTransaction: string) {
    const decoded = this.verifyJWS(signedTransaction);

    if (decoded.bundleId !== BUNDLE_ID) {
      throw new BadRequestException('Invalid bundle ID');
    }

    const existing = await this.prisma.appleTransaction.findUnique({
      where: { transactionId: decoded.transactionId },
    });
    if (existing) {
      return { success: true, message: 'Transaction already processed', productId: decoded.productId };
    }

    await this.prisma.appleTransaction.create({
      data: {
        userId,
        transactionId: decoded.transactionId,
        originalTransactionId: decoded.originalTransactionId,
        productId: decoded.productId,
        type: decoded.type === 'Auto-Renewable Subscription' ? 'autoRenewable' : 'consumable',
        purchaseDate: new Date(decoded.purchaseDate),
        expiresDate: decoded.expiresDate ? new Date(decoded.expiresDate) : null,
        revocationDate: decoded.revocationDate ? new Date(decoded.revocationDate) : null,
        environment: decoded.environment || 'Production',
      },
    });

    if (decoded.revocationDate) {
      await this.handleRevocation(userId);
      return { success: true, message: 'Transaction revoked', productId: decoded.productId };
    }

    if (SUBSCRIPTION_PRODUCTS.has(decoded.productId)) {
      await this.processSubscription(userId, decoded);
    } else if (CONSUMABLE_PRODUCTS.has(decoded.productId)) {
      await this.processConsumable(userId, decoded);
    } else {
      throw new BadRequestException(`Unknown product: ${decoded.productId}`);
    }

    return { success: true, message: 'Transaction verified', productId: decoded.productId };
  }

  async getSubscriptionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        membershipType: true,
        vipExpireAt: true,
        credits: true,
        role: true,
      },
    });
    if (!user) throw new BadRequestException('User not found');

    const isActive =
      user.membershipType === 'VIP' &&
      user.vipExpireAt &&
      new Date(user.vipExpireAt) > new Date();

    const lastTx = await this.prisma.appleTransaction.findFirst({
      where: { userId, type: 'autoRenewable' },
      orderBy: { createdAt: 'desc' },
      select: { productId: true },
    });

    return {
      membershipType: user.membershipType,
      vipExpireAt: user.vipExpireAt,
      isActive,
      productId: lastTx?.productId || null,
      credits: user.role === 'teacher' ? user.credits : undefined,
    };
  }

  private async processSubscription(userId: string, decoded: DecodedTransaction) {
    if (!decoded.expiresDate) return;

    const newExpiry = new Date(decoded.expiresDate);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { vipExpireAt: true },
    });

    if (user?.vipExpireAt && new Date(user.vipExpireAt) > newExpiry) {
      return;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        membershipType: 'VIP',
        vipExpireAt: newExpiry,
      },
    });
  }

  private async processConsumable(userId: string, decoded: DecodedTransaction) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'teacher') {
      throw new BadRequestException('Per-use product is for teachers only');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { increment: 2 } },
      });

      await tx.creditTransaction.create({
        data: {
          teacherId: userId,
          amount: 2,
          type: CreditTransactionType.IAP_PURCHASE,
          description: 'App Store purchase: 2 uses',
        },
      });
    });
  }

  private async handleRevocation(userId: string) {
    const activeSubscription = await this.prisma.appleTransaction.findFirst({
      where: {
        userId,
        type: 'autoRenewable',
        revocationDate: null,
        expiresDate: { gt: new Date() },
      },
    });

    if (!activeSubscription) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { membershipType: 'FREE', vipExpireAt: null },
      });
    }
  }

  private verifyJWS(jws: string): DecodedTransaction {
    const parts = jws.split('.');
    if (parts.length !== 3) {
      throw new BadRequestException('Invalid JWS format');
    }

    const headerJson = Buffer.from(parts[0], 'base64url').toString('utf8');
    const header = JSON.parse(headerJson);

    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    if (!header.x5c || !Array.isArray(header.x5c) || header.x5c.length < 2) {
      throw new BadRequestException('Missing x5c certificate chain');
    }

    this.verifyCertificateChain(header.x5c);

    const leafCertPem = this.derToPem(header.x5c[0]);
    const signatureValid = this.verifySignature(
      `${parts[0]}.${parts[1]}`,
      parts[2],
      leafCertPem,
    );

    if (!signatureValid) {
      throw new BadRequestException('Invalid JWS signature');
    }

    return payload as DecodedTransaction;
  }

  private verifyCertificateChain(x5c: string[]): void {
    try {
      const rootCert = new crypto.X509Certificate(APPLE_ROOT_CA_G3_PEM);

      const certs = x5c.map((certB64) => {
        const pem = this.derToPem(certB64);
        return new crypto.X509Certificate(pem);
      });

      for (let i = 0; i < certs.length - 1; i++) {
        const issuerCert = i + 1 < certs.length ? certs[i + 1] : rootCert;
        if (!certs[i].checkIssued(issuerCert)) {
          throw new Error(`Certificate at index ${i} not issued by next cert in chain`);
        }
      }

      const topCert = certs[certs.length - 1];
      if (!topCert.checkIssued(rootCert)) {
        throw new Error('Top certificate not issued by Apple Root CA G3');
      }
    } catch (err) {
      this.logger.error('Certificate chain verification failed', err);
      throw new BadRequestException('Certificate chain verification failed');
    }
  }

  private verifySignature(data: string, signatureB64url: string, certPem: string): boolean {
    try {
      const cert = new crypto.X509Certificate(certPem);
      const publicKey = cert.publicKey;
      const signature = Buffer.from(signatureB64url, 'base64url');
      const verify = crypto.createVerify('SHA256');
      verify.update(data);
      return verify.verify(publicKey, signature);
    } catch (err) {
      this.logger.error('Signature verification failed', err);
      return false;
    }
  }

  private derToPem(derB64: string): string {
    const lines = derB64.match(/.{1,64}/g) || [];
    return `-----BEGIN CERTIFICATE-----\n${lines.join('\n')}\n-----END CERTIFICATE-----`;
  }
}
