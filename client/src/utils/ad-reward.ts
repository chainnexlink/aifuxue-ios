/**
 * 激励视频广告 & VIP购买引导工具
 * App端：VIP用户直接使用，免费用户引导购买或看广告
 * 小程序端：保留原激励视频逻辑
 */
import { useUserStore } from '@/store/user';

// 广告单元ID映射（发布前需替换为微信小程序后台的真实广告单元ID）
export const AD_UNIT_IDS = {
  NOTE_EXPORT: '',         // 笔记导出
  TARGET_PRACTICE: '',     // 靶向练习生成
  SIMILAR_QUESTION: '',    // 错题同类题生成
  MOCK_EXAM: '',           // 模拟考试
  EXAM_SPRINT: '',         // 考前冲刺
  MISTAKE_EXPORT: '',      // 错题巩固卷导出
  KNOWLEDGE_MAP: '',       // 知识图谱
  MULTI_CHILD: '',         // 多娃管理
  DATA_EXPORT: '',         // 数据导出
  AI_GRADE: '',            // 教师AI批改
  AI_EXAM_GEN: '',         // AI智能出卷
} as const;

type AdUnitId = typeof AD_UNIT_IDS[keyof typeof AD_UNIT_IDS];

// 广告实例缓存
const adInstanceCache = new Map<string, any>();

/**
 * 播放激励视频广告
 * @param adUnitId 广告单元ID
 * @returns Promise - resolve 表示广告完整看完，reject 表示未看完或加载失败
 */
export function playRewardedAd(adUnitId: AdUnitId): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    try {
      let videoAd = adInstanceCache.get(adUnitId);

      if (!videoAd) {
        videoAd = wx.createRewardedVideoAd({ adUnitId });
        adInstanceCache.set(adUnitId, videoAd);
      }

      // 监听关闭事件
      const onClose = (res: { isEnded: boolean }) => {
        videoAd!.offClose(onClose);
        if (res && res.isEnded) {
          resolve();
        } else {
          reject(new Error('AD_NOT_COMPLETED'));
        }
      };

      // 监听错误事件
      const onError = (err: { errMsg: string; errCode: number }) => {
        videoAd!.offError(onError);
        videoAd!.offClose(onClose);
        reject(new Error('AD_LOAD_FAILED'));
      };

      videoAd.onClose(onClose);
      videoAd.onError(onError);

      // 加载并展示广告
      videoAd.show().catch(() => {
        // show失败则尝试重新加载
        videoAd!.load().then(() => videoAd!.show()).catch(() => {
          videoAd!.offClose(onClose);
          videoAd!.offError(onError);
          reject(new Error('AD_LOAD_FAILED'));
        });
      });
    } catch {
      reject(new Error('AD_NOT_SUPPORTED'));
    }
    // #endif

    // #ifndef MP-WEIXIN
    // 非微信小程序环境（App），直接通过
    resolve();
    // #endif
  });
}

/**
 * 尝试使用高级功能
 * 逻辑优先级：VIP直接通过 > 免费用户弹窗引导购买（App）/播放广告（小程序）
 * @param adUnitId 广告单元ID
 * @param featureName 功能名称（用于提示文案）
 * @returns Promise<boolean> - true 表示可以继续使用功能
 */
export async function tryPlayAd(adUnitId: AdUnitId, featureName: string): Promise<boolean> {
  const userStore = useUserStore();

  // VIP用户直接通过，无需广告或付费
  if (userStore.isVip) {
    return true;
  }

  // [测试模式] 开发/测试期间，跳过所有广告和VIP限制，直接放行
  return true;

  // #ifdef MP-WEIXIN
  // 小程序：播放激励视频广告
  try {
    await playRewardedAd(adUnitId);
    return true;
  } catch (err: any) {
    if (err.message === 'AD_NOT_COMPLETED') {
      uni.showToast({ title: '需完整观看广告才能使用此功能', icon: 'none', duration: 2000 });
    } else {
      uni.showToast({ title: '广告暂时不可用，请稍后再试', icon: 'none', duration: 2000 });
    }
    return false;
  }
  // #endif

  // #ifndef MP-WEIXIN
  // App端：引导购买VIP
  return new Promise((resolve) => {
    uni.showModal({
      title: `${featureName} · 会员专属`,
      content: '开通VIP会员即可无限使用所有高级功能，无广告打扰',
      confirmText: '开通VIP',
      cancelText: '暂不需要',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/membership/index' });
        }
        resolve(false);
      },
    });
  });
  // #endif
}
