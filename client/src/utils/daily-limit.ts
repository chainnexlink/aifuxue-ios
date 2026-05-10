/**
 * 每日免费次数限制工具
 * 使用本地存储记录当天已使用次数
 */

// 每日免费次数配置
export const DAILY_FREE_LIMITS: Record<string, number> = {
  NOTE_EXPORT: 3,         // 笔记导出 每日3次
  TARGET_PRACTICE: 2,     // 靶向练习生成 每日2次
  SIMILAR_QUESTION: 5,    // 错题同类题生成 每日5题
  AI_GRADE_ONLINE: 50,    // 教师AI批改（线上） 每日50次
  AI_GRADE_OFFLINE: 50,   // 教师AI辅助（线下） 每日50次
};

function getTodayKey(featureKey: string): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `daily_limit_${featureKey}_${today}`;
}

/**
 * 获取今日已使用次数
 */
export function getUsedCount(featureKey: string): number {
  const key = getTodayKey(featureKey);
  const val = uni.getStorageSync(key);
  return val ? parseInt(val, 10) : 0;
}

/**
 * 获取今日剩余免费次数
 */
export function getRemainingCount(featureKey: string): number {
  const limit = DAILY_FREE_LIMITS[featureKey] || 0;
  const used = getUsedCount(featureKey);
  return Math.max(0, limit - used);
}

/**
 * 检查是否还有免费次数
 */
export function hasFreeQuota(featureKey: string): boolean {
  return getRemainingCount(featureKey) > 0;
}

/**
 * 消耗一次免费次数（使用后调用）
 */
export function consumeFreeQuota(featureKey: string): void {
  const key = getTodayKey(featureKey);
  const used = getUsedCount(featureKey);
  uni.setStorageSync(key, String(used + 1));
}

/**
 * 获取免费额度显示文本
 */
export function getQuotaText(featureKey: string): string {
  const remaining = getRemainingCount(featureKey);
  const limit = DAILY_FREE_LIMITS[featureKey] || 0;
  return `今日剩余 ${remaining}/${limit} 次`;
}

/**
 * 清理过期的每日限制存储（可选，在 app 启动时调用）
 */
export function cleanExpiredStorage(): void {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = uni.getStorageInfoSync();
    res.keys.forEach((key: string) => {
      if (key.startsWith('daily_limit_') && !key.endsWith(today)) {
        uni.removeStorageSync(key);
      }
    });
  } catch {
    // 忽略清理错误
  }
}
