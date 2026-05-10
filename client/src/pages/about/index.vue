<template>
  <view class="about-page">
    <view class="hero">
      <view class="hero-icon-wrap">
        <text class="hero-letter">爱</text>
      </view>
      <text class="hero-title">爱辅学 完整版</text>
      <text class="hero-desc">全方位AI学习助手，助力高效学习</text>
    </view>

    <view class="feature-list">
      <view class="feature-item">
        <view class="fi-icon fi-blue">
          <image src="/static/icons/notes.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">无限笔记整理</text>
          <text class="feature-desc">无广告、无次数限制，拍照即得结构化笔记</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-red">
          <image src="/static/icons/target.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">靶向练习 · 无限次</text>
          <text class="feature-desc">基于笔记AI出题，举一反三巩固薄弱点</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-indigo">
          <image src="/static/icons/document.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">模拟考试</text>
          <text class="feature-desc">匹配本地真题模板，生成完整模拟试卷</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-orange">
          <image src="/static/icons/check-doc.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">错题巩固卷 · 考前急救</text>
          <text class="feature-desc">勾选错题一键生成强化卷，高频易错集中突破</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-purple">
          <image src="/static/icons/lightning.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">考前冲刺三件套</text>
          <text class="feature-desc">押题卷、背诵卡、备考计划，考前高效复习</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-teal">
          <image src="/static/icons/speaker.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">英语口语练习</text>
          <text class="feature-desc">拍照识别英文，AI标准发音教读，智能评分纠错，口语错题本反复练习</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-teal">
          <image src="/static/icons/people.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">小组学习</text>
          <text class="feature-desc">创建学习小组，限时PK刷题，共享笔记墙</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-green">
          <image src="/static/icons/grid.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">知识图谱 · 学习周报</text>
          <text class="feature-desc">个人知识点雷达图，家长可查看学习数据报告</text>
        </view>
      </view>

      <view class="feature-item">
        <view class="fi-icon fi-sky">
          <image src="/static/icons/download.svg" class="fi-img" mode="aspectFit" />
        </view>
        <view class="feature-info">
          <text class="feature-title">数据云同步 · 导出</text>
          <text class="feature-desc">多设备同步，一键导出全部笔记和错题PDF</text>
        </view>
      </view>
    </view>

    <view class="footer-text">
      <text>以上完整学习工具，可在应用商店搜索「爱辅学」下载App后使用。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about-page {
  padding: 0 30rpx 60rpx;
  background: #0F1118;
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 80rpx 0 50rpx;
}
.hero-icon-wrap {
  width: 108rpx;
  height: 108rpx;
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 28rpx;
  margin: 0 auto 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.3);
}
.hero-letter {
  font-size: 52rpx;
  font-weight: 800;
  color: #FFF;
}
.hero-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 12rpx;
}
.hero-desc {
  font-size: 28rpx;
  color: #4D5466;
}

.feature-list { margin-top: 20rpx; }
.feature-item {
  display: flex;
  gap: 24rpx;
  background: #1A1D2E;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #2A2E3F;
  align-items: center;
}
.fi-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fi-img {
  width: 34rpx;
  height: 34rpx;
}
.fi-blue { background: rgba(91,123,255,0.15); }
.fi-red { background: rgba(255,107,107,0.15); }
.fi-indigo { background: rgba(91,123,255,0.15); }
.fi-orange { background: rgba(255,186,74,0.15); }
.fi-purple { background: rgba(167,139,250,0.15); }
.fi-teal { background: rgba(52,211,153,0.15); }
.fi-green { background: rgba(52,211,153,0.15); }
.fi-sky { background: rgba(91,123,255,0.15); }

.feature-info { flex: 1; }
.feature-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #E8ECF4;
  display: block;
  margin-bottom: 8rpx;
}
.feature-desc {
  font-size: 26rpx;
  color: #8B92A5;
  line-height: 1.5;
}

.footer-text {
  margin-top: 60rpx;
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #4D5466;
  line-height: 1.8;
}
</style>
