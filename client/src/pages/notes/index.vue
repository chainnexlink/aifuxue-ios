<template>
  <view class="page-wrap">
    <!-- 学生端：笔记列表 -->
    <view v-if="!userStore.isTeacherView" class="notes-page">
      <view class="page-header">
        <text class="page-title">我的笔记</text>
      </view>
      <view class="filter-bar">
        <scroll-view scroll-x class="filter-scroll">
          <view class="filter-tags">
            <view v-for="s in subjects" :key="s" class="filter-tag" :class="{ active: activeSubject === s }" @tap="activeSubject = s">
              <text>{{ s }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="list-area">
        <view v-if="filteredNotes.length === 0 && !loading" class="empty-state">
          <text class="empty-icon">📒</text>
          <text class="empty-title">还没有笔记</text>
          <text class="empty-desc">拍张照片开始整理笔记吧</text>
        </view>
        <view v-for="note in filteredNotes" :key="note.id" class="note-card" @tap="goDetail(note.id)">
          <view class="nc-left">
            <view class="nc-indicator" :class="{ processing: note.status === 'processing' }"></view>
          </view>
          <view class="nc-content">
            <view class="nc-header">
              <text v-if="note.subject" class="nc-subject">{{ note.subject }}</text>
              <text class="nc-time">{{ formatTime(note.createdAt) }}</text>
            </view>
            <text class="nc-title">{{ note.title }}</text>
            <view class="nc-footer">
              <text v-if="note.canExport" class="nc-export-tag">可导出</text>
              <text v-if="note.status === 'processing'" class="nc-status">整理中...</text>
            </view>
          </view>
          <view class="nc-arrow"><view class="arrow-shape"></view></view>
        </view>
      </view>
      <view class="fab" @tap="takePhoto">
        <text class="fab-icon">📷</text>
      </view>
      <view style="height: 140rpx;"></view>
    </view>

    <!-- 教师端：班级管理 -->
    <TeacherClass v-else />

    <CustomTabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import CustomTabBar from '@/components/CustomTabBar/index.vue';
import TeacherClass from '@/components/teacher/TeacherClass.vue';

const userStore = useUserStore();
const activeSubject = ref('全部');
const subjects = ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '其他'];
const notes = ref<any[]>([]);
const loading = ref(false);
const mockNotes = [
  { id: '1', title: '高一数学 · 导数与极值课堂笔记', subject: '数学', status: 'done', canExport: true, createdAt: new Date().toISOString() },
  { id: '2', title: '英语语法 · 虚拟语气专题', subject: '英语', status: 'done', canExport: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: '物理力学 · 自由落体运动', subject: '物理', status: 'processing', canExport: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', title: '化学有机 · 烃的衍生物', subject: '化学', status: 'done', canExport: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
];
const filteredNotes = computed(() => {
  if (activeSubject.value === '全部') return notes.value;
  return notes.value.filter(n => n.subject === activeSubject.value);
});
onShow(() => { notes.value = mockNotes; });
function goDetail(id: string) { uni.navigateTo({ url: `/pages/notes/detail/index?id=${id}` }); }
function takePhoto() {
  uni.chooseImage({ count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => { const paths = encodeURIComponent(JSON.stringify(res.tempFilePaths)); uni.navigateTo({ url: `/pages/notes/preview/index?images=${paths}` }); },
  });
}
function formatTime(dateStr: string) {
  const d = new Date(dateStr); const now = new Date(); const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return '今天'; if (diff < 172800000) return '昨天';
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; }
.notes-page {
  --c-bg: #0F1118; --c-card: #1A1D2E; --c-card2: #242838;
  --c-primary: #5B7BFF; --c-primary-dim: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466;
  --c-warning: #FFBA4A; --c-border: #2A2E3F;
  background: var(--c-bg); min-height: 100vh; padding-bottom: 120rpx;
}
.page-header { padding: 88rpx 32rpx 16rpx; }
.page-title { font-size: 36rpx; font-weight: 800; color: var(--c-t1); }
.filter-bar { background: var(--c-card); padding: 20rpx 0; border-bottom: 1rpx solid var(--c-border); }
.filter-scroll { white-space: nowrap; }
.filter-tags { display: inline-flex; gap: 16rpx; padding: 0 32rpx; }
.filter-tag { display: inline-flex; padding: 14rpx 32rpx; border-radius: 32rpx; background: var(--c-card2); font-size: 26rpx; color: var(--c-t2); flex-shrink: 0; }
.filter-tag.active { background: var(--c-primary); color: #FFF; font-weight: 600; box-shadow: 0 4rpx 12rpx rgba(91,123,255,0.35); }
.list-area { padding: 24rpx 32rpx; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding-top: 160rpx; }
.empty-icon { font-size: 80rpx; margin-bottom: 20rpx; }
.empty-title { font-size: 32rpx; font-weight: 600; color: var(--c-t1); margin-bottom: 10rpx; }
.empty-desc { font-size: 26rpx; color: var(--c-t3); }
.note-card { background: var(--c-card); border-radius: 20rpx; padding: 28rpx 24rpx; margin-bottom: 16rpx; display: flex; align-items: center; gap: 16rpx; border: 1rpx solid var(--c-border); }
.nc-left { flex-shrink: 0; padding-top: 4rpx; }
.nc-indicator { width: 8rpx; height: 52rpx; background: var(--c-primary); border-radius: 4rpx; }
.nc-indicator.processing { background: var(--c-warning); }
.nc-content { flex: 1; min-width: 0; }
.nc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rpx; }
.nc-subject { font-size: 22rpx; color: var(--c-primary); background: var(--c-primary-dim); padding: 4rpx 16rpx; border-radius: 10rpx; font-weight: 500; }
.nc-time { font-size: 22rpx; color: var(--c-t3); }
.nc-title { font-size: 30rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 10rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nc-footer { display: flex; gap: 12rpx; }
.nc-export-tag { font-size: 20rpx; color: #34D399; background: rgba(52,211,153,0.15); padding: 4rpx 14rpx; border-radius: 8rpx; }
.nc-status { font-size: 22rpx; color: var(--c-warning); }
.nc-arrow { flex-shrink: 0; }
.arrow-shape { width: 14rpx; height: 14rpx; border-right: 3rpx solid var(--c-t3); border-top: 3rpx solid var(--c-t3); transform: rotate(45deg); }
.fab { position: fixed; right: 40rpx; bottom: 180rpx; width: 100rpx; height: 100rpx; background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8rpx 28rpx rgba(91,123,255,0.45); z-index: 10; }
.fab-icon { font-size: 44rpx; }

/* iPad适配 */
@media screen and (min-width: 768px) {
  .notes-page { padding-bottom: 90px; }
  .page-header { padding: 56px 24px 12px; }
  .page-title { font-size: 22px; }
  .filter-bar { padding: 12px 0; }
  .filter-tags { gap: 10px; padding: 0 24px; }
  .filter-tag { padding: 8px 20px; font-size: 14px; }
  .list-area { padding: 14px 24px; }
  .note-card { border-radius: 14px; padding: 18px 16px; margin-bottom: 12px; gap: 12px; }
  .nc-subject { font-size: 12px; padding: 3px 10px; }
  .nc-time { font-size: 12px; }
  .nc-title { font-size: 16px; margin-bottom: 6px; }
  .nc-footer { gap: 8px; }
  .nc-export-tag { font-size: 11px; padding: 2px 8px; }
  .fab { right: 24px; bottom: 100px; width: 52px; height: 52px; }
  .fab-icon { font-size: 24px; }
}
</style>
