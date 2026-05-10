<template>
  <view class="export-page">
    <view class="header-card">
      <text class="hc-title">数据导出中心</text>
      <text class="hc-desc">将你的学习数据导出为文件，方便打印和分享</text>
    </view>

    <!-- 导出选项 -->
    <view class="export-section">
      <text class="section-title">选择导出内容</text>

      <view class="export-item" @tap="selectExport('notes')">
        <view class="ei-icon" style="background:rgba(91,123,255,0.15)">
          <image src="/static/icons/notes.svg" class="ei-icon-img" mode="aspectFit" />
        </view>
        <view class="ei-info">
          <text class="ei-title">全部笔记</text>
          <text class="ei-desc">导出 {{ counts.notes }} 份笔记为 PDF 文档</text>
        </view>
        <view class="ei-check" :class="{ checked: selected.notes }"></view>
      </view>

      <view class="export-item" @tap="selectExport('mistakes')">
        <view class="ei-icon" style="background:rgba(255,107,107,0.15)">
          <image src="/static/icons/pen-white.svg" class="ei-icon-img" mode="aspectFit" />
        </view>
        <view class="ei-info">
          <text class="ei-title">全部错题</text>
          <text class="ei-desc">导出 {{ counts.mistakes }} 道错题及详细解析</text>
        </view>
        <view class="ei-check" :class="{ checked: selected.mistakes }"></view>
      </view>

      <view class="export-item" @tap="selectExport('exercises')">
        <view class="ei-icon" style="background:rgba(52,211,153,0.15)">
          <image src="/static/icons/target.svg" class="ei-icon-img" mode="aspectFit" />
        </view>
        <view class="ei-info">
          <text class="ei-title">练习记录</text>
          <text class="ei-desc">导出 {{ counts.exercises }} 次练习的答题报告</text>
        </view>
        <view class="ei-check" :class="{ checked: selected.exercises }"></view>
      </view>

      <view class="export-item" @tap="selectExport('report')">
        <view class="ei-icon" style="background:rgba(167,139,250,0.15)">
          <image src="/static/icons/grid.svg" class="ei-icon-img" mode="aspectFit" />
        </view>
        <view class="ei-info">
          <text class="ei-title">学习周报</text>
          <text class="ei-desc">导出最近4周的学习数据报告</text>
        </view>
        <view class="ei-check" :class="{ checked: selected.report }"></view>
      </view>
    </view>

    <!-- 导出格式 -->
    <view class="format-card">
      <text class="section-title">导出格式</text>
      <view class="format-options">
        <view class="fmt-item" :class="{ active: format === 'pdf' }" @tap="format = 'pdf'">
          <text class="fmt-text">PDF</text>
        </view>
        <view class="fmt-item" :class="{ active: format === 'image' }" @tap="format = 'image'">
          <text class="fmt-text">图片</text>
        </view>
        <view class="fmt-item" :class="{ active: format === 'word' }" @tap="format = 'word'">
          <text class="fmt-text">Word</text>
        </view>
      </view>
    </view>

    <!-- 导出预览 -->
    <view class="preview-card" v-if="selectedCount > 0">
      <text class="pv-text">已选择 {{ selectedCount }} 项内容，预计生成 {{ estimatePages }} 页{{ format.toUpperCase() }}文件</text>
    </view>

    <!-- 导出按钮 -->
    <view class="btn-primary export-btn" :class="{ disabled: selectedCount === 0 }" @tap="doExport">
      <text>开始导出</text>
    </view>

    <!-- 导出历史 -->
    <view class="history-section" v-if="exportHistory.length > 0">
      <text class="section-title">导出历史</text>
      <view v-for="h in exportHistory" :key="h.id" class="history-item">
        <view class="hi-info">
          <text class="hi-title">{{ h.title }}</text>
          <text class="hi-time">{{ h.time }}</text>
        </view>
        <text class="hi-status" :class="h.status">{{ h.statusText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const counts = ref({ notes: 24, mistakes: 38, exercises: 56, report: 4 });
const selected = ref({ notes: true, mistakes: false, exercises: false, report: false });
const format = ref('pdf');
const exportHistory = ref([
  { id: '1', title: '全部笔记 · PDF', time: '2025-04-30', status: 'done', statusText: '已完成' },
  { id: '2', title: '错题集 · PDF', time: '2025-04-25', status: 'done', statusText: '已完成' },
]);

const selectedCount = computed(() => {
  return Object.values(selected.value).filter(Boolean).length;
});
const estimatePages = computed(() => {
  let pages = 0;
  if (selected.value.notes) pages += counts.value.notes * 2;
  if (selected.value.mistakes) pages += counts.value.mistakes;
  if (selected.value.exercises) pages += counts.value.exercises;
  if (selected.value.report) pages += 8;
  return pages;
});

function selectExport(key: string) {
  (selected.value as any)[key] = !(selected.value as any)[key];
}

function doExport() {
  if (selectedCount.value === 0) {
    uni.showToast({ title: '请至少选择一项内容', icon: 'none' });
    return;
  }
  uni.showLoading({ title: '正在生成...' });
  setTimeout(() => {
    uni.hideLoading();
    exportHistory.value.unshift({
      id: Date.now().toString(),
      title: `导出${selectedCount.value}项 · ${format.value.toUpperCase()}`,
      time: '刚刚',
      status: 'done',
      statusText: '已完成',
    });
    uni.showToast({ title: '导出成功', icon: 'success' });
  }, 2000);
}
</script>

<style scoped>
.export-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.header-card {
  background: linear-gradient(145deg, #1A2744, #1A1D2E);
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.hc-title { font-size: 34rpx; font-weight: 800; color: #E8ECF4; display: block; margin-bottom: 8rpx; }
.hc-desc { font-size: 26rpx; color: #4D5466; }

.export-section, .format-card, .history-section {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.section-title { font-size: 28rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 16rpx; }

.export-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 20rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.export-item:last-child { border-bottom: none; }
.ei-icon {
  width: 64rpx; height: 64rpx; border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ei-icon-img { width: 32rpx; height: 32rpx; }
.ei-info { flex: 1; }
.ei-title { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; }
.ei-desc { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.ei-check {
  width: 36rpx; height: 36rpx; border-radius: 50%;
  border: 2rpx solid #4D5466; flex-shrink: 0;
}
.ei-check.checked { background: #5B7BFF; border-color: #5B7BFF; }

.format-options { display: flex; gap: 12rpx; }
.fmt-item {
  flex: 1; padding: 20rpx 0; text-align: center;
  background: #242838; border-radius: 12rpx; border: 2rpx solid transparent;
}
.fmt-item.active { background: rgba(91,123,255,0.15); border-color: #5B7BFF; }
.fmt-text { font-size: 28rpx; color: #8B92A5; }
.fmt-item.active .fmt-text { color: #5B7BFF; font-weight: 600; }

.preview-card {
  background: rgba(91,123,255,0.08);
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  margin-bottom: 20rpx;
}
.pv-text { font-size: 24rpx; color: #5B7BFF; }

.export-btn { padding: 28rpx 0; margin-bottom: 24rpx; }
.export-btn.disabled { opacity: 0.4; }

.history-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.history-item:last-child { border-bottom: none; }
.hi-title { font-size: 26rpx; color: #E8ECF4; display: block; }
.hi-time { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.hi-status { font-size: 24rpx; }
.hi-status.done { color: #34D399; }
</style>
