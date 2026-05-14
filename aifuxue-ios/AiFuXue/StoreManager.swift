import StoreKit

// MARK: - Data Structures

struct IAPProductInfo {
    let productId: String
    let displayName: String
    let displayPrice: String
    let description: String
    let type: String // "autoRenewable" or "consumable"
}

struct IAPRestoreInfo {
    let productId: String
    let signedTransaction: String
    let expiresDate: Date?
}

// MARK: - Delegate Protocol

protocol StoreManagerDelegate: AnyObject {
    func didLoadProducts(_ products: [IAPProductInfo])
    func didCompletePurchase(productId: String, jwsTransaction: String)
    func didFailPurchase(productId: String, error: String, message: String)
    func didRestorePurchases(_ transactions: [IAPRestoreInfo])
    func didReceiveTransactionUpdate(jwsTransaction: String)
}

// MARK: - StoreManager

@available(iOS 15.0, *)
class StoreManager {

    static let productIds: Set<String> = [
        "cn.aifuxue.vip.monthly",
        "cn.aifuxue.vip.yearly",
        "cn.aifuxue.teacher.monthly",
        "cn.aifuxue.teacher.peruse"
    ]

    weak var delegate: StoreManagerDelegate?

    private var products: [String: Product] = [:]
    private var updateListenerTask: Task<Void, Error>?
    private var pendingFinishTransactions: [String: Transaction] = [:]

    init() {
        updateListenerTask = listenForTransactions()
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // MARK: - Load Products

    func loadProducts() {
        Task {
            do {
                let storeProducts = try await Product.products(for: StoreManager.productIds)
                var infos: [IAPProductInfo] = []
                for product in storeProducts {
                    products[product.id] = product
                    let typeStr: String
                    switch product.type {
                    case .autoRenewable: typeStr = "autoRenewable"
                    case .consumable: typeStr = "consumable"
                    default: typeStr = "unknown"
                    }
                    infos.append(IAPProductInfo(
                        productId: product.id,
                        displayName: product.displayName,
                        displayPrice: product.displayPrice,
                        description: product.description,
                        type: typeStr
                    ))
                }
                await MainActor.run {
                    delegate?.didLoadProducts(infos)
                }
            } catch {
                print("[StoreManager] Failed to load products: \(error)")
                await MainActor.run {
                    delegate?.didLoadProducts([])
                }
            }
        }
    }

    // MARK: - Purchase

    func purchase(_ productId: String) {
        Task {
            guard let product = products[productId] else {
                await MainActor.run {
                    delegate?.didFailPurchase(
                        productId: productId,
                        error: "productNotFound",
                        message: "Product not loaded"
                    )
                }
                return
            }

            do {
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    let transaction = try checkVerified(verification)
                    let jwsString = verification.jwsRepresentation

                    // Store transaction for later finishing (after server confirms)
                    pendingFinishTransactions[transaction.id.description] = transaction

                    await MainActor.run {
                        delegate?.didCompletePurchase(
                            productId: productId,
                            jwsTransaction: jwsString
                        )
                    }

                    // For auto-renewable, finish immediately (server will verify)
                    if product.type == .autoRenewable {
                        await transaction.finish()
                        pendingFinishTransactions.removeValue(forKey: transaction.id.description)
                    }

                case .userCancelled:
                    await MainActor.run {
                        delegate?.didFailPurchase(
                            productId: productId,
                            error: "userCancelled",
                            message: "Purchase cancelled"
                        )
                    }

                case .pending:
                    await MainActor.run {
                        delegate?.didFailPurchase(
                            productId: productId,
                            error: "purchasePending",
                            message: "Purchase pending approval"
                        )
                    }

                @unknown default:
                    await MainActor.run {
                        delegate?.didFailPurchase(
                            productId: productId,
                            error: "unknown",
                            message: "Unknown purchase result"
                        )
                    }
                }
            } catch {
                await MainActor.run {
                    delegate?.didFailPurchase(
                        productId: productId,
                        error: "failed",
                        message: error.localizedDescription
                    )
                }
            }
        }
    }

    // Call this after server confirms consumable was processed
    func finishTransaction(transactionId: String) {
        Task {
            if let transaction = pendingFinishTransactions[transactionId] {
                await transaction.finish()
                pendingFinishTransactions.removeValue(forKey: transactionId)
            }
        }
    }

    // MARK: - Restore Purchases

    func restorePurchases() {
        Task {
            var restored: [IAPRestoreInfo] = []

            for await verification in Transaction.currentEntitlements {
                if let transaction = try? checkVerified(verification) {
                    let jwsString = verification.jwsRepresentation
                    restored.append(IAPRestoreInfo(
                        productId: transaction.productID,
                        signedTransaction: jwsString,
                        expiresDate: transaction.expirationDate
                    ))
                }
            }

            await MainActor.run {
                delegate?.didRestorePurchases(restored)
            }
        }
    }

    // MARK: - Transaction Updates Listener

    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached { [weak self] in
            for await verification in Transaction.updates {
                guard let self = self else { return }
                if let transaction = try? self.checkVerified(verification) {
                    let jwsString = verification.jwsRepresentation
                    await transaction.finish()
                    await MainActor.run {
                        self.delegate?.didReceiveTransactionUpdate(jwsTransaction: jwsString)
                    }
                }
            }
        }
    }

    // MARK: - Helpers

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let value):
            return value
        }
    }
}
