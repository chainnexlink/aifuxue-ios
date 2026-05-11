<template>
  <view class="page">
    <!-- 如何获取积分 -->
    <view class="section-card">
      <text class="section-title">如何获取积分</text>
      <view class="rule-list">
        <view class="rule-item">
          <view class="rule-icon-wrap green">
            <text class="rule-icon">👥</text>
          </view>
          <view class="rule-info">
            <text class="rule-name">邀请学生注册</text>
            <text class="rule-desc">学生通过您的邀请码注册成功，即获得1积分</text>
            <text class="rule-reward">+1 积分/人</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 积分使用规则 -->
    <view class="section-card">
      <text class="section-title">积分使用规则</text>
      <view class="rule-list">
        <view class="rule-item">
          <view class="rule-icon-wrap blue">
            <text class="rule-icon">👑</text>
          </view>
          <view class="rule-info">
            <text class="rule-name">抵扣会员购买</text>
            <text class="rule-desc">购买VIP会员时可使用积分抵扣</text>
            <view class="rule-tags">
              <text class="rule-tag">1积分=1元</text>
              <text class="rule-tag warn">最多抵扣50%</text>
            </view>
          </view>
        </view>
        <view class="rule-item">
          <view class="rule-icon-wrap purple">
            <text class="rule-icon">⚡</text>
          </view>
          <view class="rule-info">
            <text class="rule-name">兑换使用次数</text>
            <text class="rule-desc">积分可直接兑换AI批改、出卷等使用次数</text>
            <view class="rule-tags">
              <text class="rule-tag">1积分=1元=2次</text>
              <text class="rule-tag good">无使用上限</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 注意事项 -->
    <view class="section-card">
      <text class="section-title">注意事项</text>
      <view class="notice-list">
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">积分仅限教师账户使用</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">每位学生仅首次注册可为教师贡献积分</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">积分无有效期限制，长期有效</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">积分不可转让、不可提现</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">抵扣会员时，最多使用会员价格50%的积分</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">·</text>
          <text class="notice-text">兑换使用次数无数量限制</text>
        </view>
      </view>
    </view>

    <!-- 示例 -->
    <view class="section-card">
      <text class="section-title">使用示例</text>
      <view class="example-list">
        <view class="example-item">
          <text class="example-title">示例1：抵扣月度会员</text>
          <text class="example-text">月度订阅¥30，最多抵扣15积分（50%），实付¥15</text>
        </view>
        <view class="example-item">
          <text class="example-title">示例2：兑换使用次数</text>
          <text class="example-text">使用10积分，可兑换20次AI批改/出卷额度</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page {
  --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF;
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F;
  padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box;
}

.section-card {
  background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx;
  margin-bottom: 24rpx; border: 1rpx solid var(--c-border);
}
.section-title { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.rule-list { display: flex; flex-direction: column; gap: 24rpx; }
.rule-item { display: flex; gap: 16rpx; }
.rule-icon-wrap {
  width: 72rpx; height: 72rpx; border-radius: 18rpx;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rule-icon-wrap.green { background: rgba(52,211,153,0.15); }
.rule-icon-wrap.blue { background: rgba(91,123,255,0.15); }
.rule-icon-wrap.purple { background: rgba(167,139,250,0.15); }
.rule-icon { font-size: 32rpx; }
.rule-info { flex: 1; }
.rule-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.rule-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 8rpx; }
.rule-reward { font-size: 26rpx; font-weight: 700; color: #34D399; }
.rule-tags { display: flex; gap: 12rpx; }
.rule-tag {
  font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 8rpx;
  background: rgba(91,123,255,0.1); color: var(--c-primary);
}
.rule-tag.warn { background: rgba(255,186,74,0.1); color: #FFBA4A; }
.rule-tag.good { background: rgba(52,211,153,0.1); color: #34D399; }

.notice-list { display: flex; flex-direction: column; gap: 16rpx; }
.notice-item { display: flex; gap: 12rpx; align-items: flex-start; }
.notice-dot { font-size: 28rpx; color: var(--c-t3); line-height: 1.6; }
.notice-text { font-size: 26rpx; color: var(--c-t2); line-height: 1.6; }

.example-list { display: flex; flex-direction: column; gap: 20rpx; }
.example-item { background: #242838; border-radius: 14rpx; padding: 20rpx; }
.example-title { font-size: 26rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.example-text { font-size: 24rpx; color: var(--c-t3); display: block; }
</style>
