<template>
  <view class="page-wrap">
    <!-- 学生端：错题本 -->
    <view v-if="!userStore.isTeacherView" class="mistakes-page">
      <view class="page-header">
        <text class="page-title">错题本</text>
      </view>
      <!-- 筛选栏 -->
      <view class="filter-bar">
        <scroll-view scroll-x class="filter-scroll">
          <view class="filter-tags">
            <view class="filter-tag" :class="{ active: activeFilter === 'all' }" @tap="setFilter('all')"><text>全部</text></view>
            <view class="filter-tag" :class="{ active: activeFilter === 'subject' }" @tap="setFilter('subject')"><text>按学科</text></view>
            <view class="filter-tag" :class="{ active: activeFilter === 'calc' }" @tap="setFilter('calc')"><text>计算错误</text></view>
            <view class="filter-tag" :class="{ active: activeFilter === 'concept' }" @tap="setFilter('concept')"><text>概念不清</text></view>
            <view class="filter-tag" :class="{ active: activeFilter === 'read' }" @tap="setFilter('read')"><text>审题偏差</text></view>
            <view class="filter-tag" :class="{ active: activeFilter === 'unknown' }" @tap="setFilter('unknown')"><text>完全不会</text></view>
          </view>
        </scroll-view>
      </view>
      <view v-if="activeFilter === 'subject'" class="subject-bar">
        <view v-for="s in subjects" :key="s" class="subject-tag" :class="{ active: activeSubject === s }" @tap="activeSubject = s"><text>{{ s }}</text></view>
      </view>

      <view v-if="filteredMistakes.length === 0 && !loading" class="empty-state">
        <text class="empty-icon">📕</text>
        <text class="empty-title">错题本是空的</text>
        <text class="empty-desc">拍下做错的题目，AI 帮你分析错因</text>
      </view>

      <view class="list-area">
        <view v-for="item in filteredMistakes" :key="item.id" class="mistake-card" @tap="goDetail(item.id)">
          <view class="mc-left"><view class="mc-indicator" :class="errorTypeClass(item.errorType)"></view></view>
          <view class="mc-content">
            <text class="mc-text">{{ truncate(item.ocrText, 60) }}</text>
            <view class="mc-tags">
              <text v-if="item.subject" class="mc-tag tag-subject">{{ item.subject }}</text>
              <text v-if="item.knowledgePoint" class="mc-tag tag-knowledge">{{ item.knowledgePoint }}</text>
              <text v-if="item.errorType" class="mc-tag tag-error">{{ item.errorType }}</text>
            </view>
            <text class="mc-time">{{ formatTime(item.createdAt) }}</text>
          </view>
          <view class="mc-arrow"><view class="arrow-shape"></view></view>
        </view>
      </view>

      <!-- 底部操作区 -->
      <view class="bottom-bar safe-bottom">
        <view class="bottom-btn btn-outline" @tap="addMistake">
          <text>📷 拍照录错题</text>
        </view>
        <view class="bottom-btn btn-fill" @tap="generateConsolidation">
          <text>📄 生成巩固卷</text>
        </view>
      </view>
    </view>

    <!-- 教师端：教研错题库 -->
    <TeacherMistakes v-else />

    <CustomTabBar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import CustomTabBar from '@/components/CustomTabBar/index.vue';
import TeacherMistakes from '@/components/teacher/TeacherMistakes.vue';

const userStore = useUserStore();
const mistakes = ref<any[]>([]);
const loading = ref(false);
const activeFilter = ref('all');
const activeSubject = ref('全部');
const subjects = ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '其他'];

const mockMistakes = [
  { id: '1', subject: '数学', ocrText: '已知函数f(x)=x^3-3x+1，求f(x)的极值点。我的解答：f\'(x)=3x^2-3=0，x=1，所以极值点为x=1。', knowledgePoint: '导数与极值', errorType: '计算错误', createdAt: new Date().toISOString() },
  { id: '2', subject: '英语', ocrText: 'The teacher suggested that he _____ harder. 我选的是 studies，正确答案是 study。', knowledgePoint: '虚拟语气', errorType: '概念不清', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', subject: '物理', ocrText: '一个质量为2kg的物体从10m高处自由落下，求落地速度。', knowledgePoint: '自由落体', errorType: '审题偏差', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', subject: '数学', ocrText: '证明：对任意正整数n，n^3-n能被6整除。', knowledgePoint: '数学归纳法', errorType: '完全不会', createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const errorTypeMap: Record<string, string> = { calc: '计算错误', concept: '概念不清', read: '审题偏差', unknown: '完全不会' };

const filteredMistakes = computed(() => {
  let list = mistakes.value;
  if (activeFilter.value === 'subject') {
    if (activeSubject.value !== '全部') list = list.filter(m => m.subject === activeSubject.value);
  } else if (activeFilter.value !== 'all') {
    const typeName = errorTypeMap[activeFilter.value];
    if (typeName) list = list.filter(m => m.errorType === typeName);
  }
  return list;
});

onShow(() => { mistakes.value = mockMistakes; });
function setFilter(f: string) { activeFilter.value = f; }
function errorTypeClass(type: string) {
  const map: Record<string, string> = { '计算错误': 'type-calc', '概念不清': 'type-concept', '审题偏差': 'type-read', '完全不会': 'type-unknown' };
  return map[type] || '';
}
function addMistake() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: (res) => {
      const paths = res.tempFiles.map((f: any) => f.tempFilePath);
      const encoded = encodeURIComponent(JSON.stringify(paths));
      uni.navigateTo({ url: `/pages/mistakes/detail/index?images=${encoded}&mode=create` });
    },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFilePaths));
      uni.navigateTo({ url: `/pages/mistakes/detail/index?images=${paths}&mode=create` });
    },
    fail: (err: any) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
}
function goDetail(id: string) { uni.navigateTo({ url: `/pages/mistakes/detail/index?id=${id}` }); }
function generateConsolidation() { uni.navigateTo({ url: '/pages/mistakes/consolidation/index' }); }
function truncate(str: string | null, len: number) { if (!str) return ''; return str.length > len ? str.slice(0, len) + '...' : str; }
function formatTime(dateStr: string) {
  const d = new Date(dateStr); const now = new Date(); const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return '今天'; if (diff < 172800000) return '昨天';
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; }
.mistakes-page {
  --c-primary: #5B7BFF; --c-primary-bg: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466;
  --c-danger: #FF6B6B; --c-warning: #FFBA4A; --c-success: #34D399; --c-purple: #A78BFA;
  --c-card: #1A1D2E; --c-card2: #242838; --c-border: #2A2E3F;
  background: #0F1118; min-height: 100vh; padding-bottom: 160rpx;
}
.page-header { padding: 88rpx 32rpx 16rpx; }
.page-title { font-size: 36rpx; font-weight: 800; color: var(--c-t1); }
.filter-bar { background: var(--c-card); padding: 20rpx 0; border-bottom: 1rpx solid var(--c-border); }
.filter-scroll { white-space: nowrap; }
.filter-tags { display: inline-flex; gap: 16rpx; padding: 0 32rpx; }
.filter-tag { display: inline-flex; padding: 14rpx 28rpx; border-radius: 32rpx; background: var(--c-card2); font-size: 26rpx; color: var(--c-t2); flex-shrink: 0; }
.filter-tag.active { background: var(--c-primary); color: #FFF; font-weight: 600; }
.subject-bar { display: flex; flex-wrap: wrap; gap: 12rpx; padding: 16rpx 32rpx; background: var(--c-card); }
.subject-tag { padding: 10rpx 24rpx; border-radius: 24rpx; background: var(--c-card2); font-size: 24rpx; color: var(--c-t2); }
.subject-tag.active { background: var(--c-primary-bg); color: var(--c-primary); font-weight: 600; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding-top: 160rpx; }
.empty-icon { font-size: 80rpx; margin-bottom: 20rpx; }
.empty-title { font-size: 32rpx; font-weight: 600; color: var(--c-t1); margin-bottom: 10rpx; }
.empty-desc { font-size: 26rpx; color: var(--c-t3); }
.list-area { padding: 20rpx 32rpx; }
.mistake-card { background: var(--c-card); border-radius: 20rpx; padding: 28rpx 24rpx; margin-bottom: 16rpx; display: flex; align-items: center; gap: 16rpx; border: 1rpx solid var(--c-border); }
.mc-left { flex-shrink: 0; }
.mc-indicator { width: 8rpx; height: 52rpx; border-radius: 4rpx; background: var(--c-t3); }
.mc-indicator.type-calc { background: var(--c-warning); }
.mc-indicator.type-concept { background: var(--c-danger); }
.mc-indicator.type-read { background: var(--c-purple); }
.mc-indicator.type-unknown { background: #6B7280; }
.mc-content { flex: 1; min-width: 0; }
.mc-text { font-size: 28rpx; color: var(--c-t1); line-height: 1.5; display: block; margin-bottom: 12rpx; }
.mc-tags { display: flex; flex-wrap: wrap; gap: 8rpx; margin-bottom: 8rpx; }
.mc-tag { font-size: 22rpx; padding: 4rpx 14rpx; border-radius: 10rpx; }
.tag-subject { background: var(--c-primary-bg); color: var(--c-primary); }
.tag-knowledge { background: rgba(52,211,153,0.15); color: var(--c-success); }
.tag-error { background: rgba(255,107,107,0.15); color: var(--c-danger); }
.mc-time { font-size: 22rpx; color: var(--c-t3); }
.mc-arrow { flex-shrink: 0; }
.arrow-shape { width: 14rpx; height: 14rpx; border-right: 3rpx solid var(--c-t3); border-top: 3rpx solid var(--c-t3); transform: rotate(45deg); }
.bottom-bar { position: fixed; bottom: 120rpx; left: 0; right: 0; background: var(--c-card); padding: 20rpx 32rpx; display: flex; gap: 20rpx; border-top: 1rpx solid var(--c-border); }
.bottom-btn { flex: 1; height: 92rpx; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; gap: 12rpx; font-size: 28rpx; font-weight: 600; }
.btn-outline { background: transparent; border: 2rpx solid var(--c-primary); color: var(--c-primary); }
.btn-fill { background: linear-gradient(145deg, #3D56C6, #5B7BFF); color: #FFF; }
</style>
