<template>
  <view class="page-wrap">
    <!-- 学生端：练习中心 -->
    <view v-if="!userStore.isTeacherView" class="practice-page">
      <!-- 顶部子Tab -->
      <view class="sub-tabs">
        <view class="sub-tab" :class="{ active: activeTab === 'target' }" @tap="activeTab = 'target'">
          <text>靶向练习</text>
        </view>
        <view class="sub-tab" :class="{ active: activeTab === 'mock' }" @tap="activeTab = 'mock'">
          <text>模拟考试</text>
        </view>
        <view class="sub-tab" :class="{ active: activeTab === 'oral' }" @tap="activeTab = 'oral'">
          <text>口语练习</text>
        </view>
        <view class="tab-indicator" :style="tabIndicatorStyle"></view>
      </view>

      <!-- 靶向练习 -->
      <view v-if="activeTab === 'target'" class="tab-content">
        <view class="entry-card" @tap="startTargetPractice">
          <text class="entry-emoji">🎯</text>
          <view class="entry-info">
            <text class="entry-title">开始靶向练习</text>
            <text class="entry-desc">选择一份笔记，AI 生成专属练习题</text>
          </view>
          <view class="entry-arrow"><view class="arrow-chevron"></view></view>
        </view>
        <view class="section">
          <text class="section-title">练习记录</text>
          <view v-if="targetHistory.length === 0" class="empty-hint"><text class="empty-text">还没有练习记录</text></view>
          <view v-for="item in targetHistory" :key="item.id" class="history-card" @tap="goExerciseResult(item.id)">
            <view class="history-left"><view class="history-indicator" :class="scoreClass(item.score)"></view></view>
            <view class="history-content">
              <text class="history-title">{{ item.sourceNote }}</text>
              <view class="history-meta">
                <text class="history-score">{{ item.score }}分</text>
                <text class="history-count">{{ item.correctCount }}/{{ item.totalCount }}题</text>
                <text class="history-time">{{ formatTime(item.createdAt) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 模拟考试 -->
      <view v-if="activeTab === 'mock'" class="tab-content">
        <view class="entry-card" @tap="startMockExam">
          <text class="entry-emoji">📋</text>
          <view class="entry-info">
            <text class="entry-title">开始模拟考试</text>
            <text class="entry-desc">选择学段 / 地区 / 考试类型，全真模拟</text>
          </view>
          <view class="entry-arrow"><view class="arrow-chevron"></view></view>
        </view>
        <view class="section">
          <text class="section-title">考试记录</text>
          <view v-if="mockHistory.length === 0" class="empty-hint"><text class="empty-text">还没有考试记录</text></view>
          <view v-for="item in mockHistory" :key="item.id" class="history-card" @tap="goExerciseResult(item.id)">
            <view class="history-left"><view class="history-indicator" :class="scoreClass(item.score)"></view></view>
            <view class="history-content">
              <text class="history-title">{{ item.examName }}</text>
              <view class="history-meta">
                <text class="history-score">{{ item.score }}分</text>
                <text class="history-count">用时{{ item.duration }}分钟</text>
                <text class="history-time">{{ formatTime(item.createdAt) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 口语练习 -->
      <view v-if="activeTab === 'oral'" class="tab-content">
        <view class="entry-card" @tap="goOralEntry">
          <text class="entry-emoji">🗣️</text>
          <view class="entry-info">
            <text class="entry-title">开始口语练习</text>
            <text class="entry-desc">拍照识别英文，AI教你标准发音</text>
          </view>
          <view class="entry-arrow"><view class="arrow-chevron"></view></view>
        </view>
        <view class="section">
          <view class="section-header">
            <text class="section-title" style="margin-bottom:0">口语错题本</text>
            <text class="more-link" @tap="goOralMistakes">查看全部</text>
          </view>
          <view v-if="oralMistakes.length === 0" class="empty-hint"><text class="empty-text">暂无读错的单词</text></view>
          <view v-for="item in oralMistakes" :key="item.word" class="history-card" @tap="practiceOralWord(item)">
            <view class="history-left"><view class="history-indicator" :class="scoreClass(item.bestScore)"></view></view>
            <view class="history-content">
              <text class="history-title">{{ item.word }}</text>
              <view class="history-meta">
                <text class="history-score">最高{{ item.bestScore }}分</text>
                <text class="history-count">错{{ item.errorCount }}次</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 140rpx;"></view>
    </view>

    <!-- 教师端：作业管理 -->
    <TeacherHomework v-else />

    <CustomTabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import CustomTabBar from '@/components/CustomTabBar/index.vue';
import TeacherHomework from '@/components/teacher/TeacherHomework.vue';

const userStore = useUserStore();
const activeTab = ref<'target' | 'mock' | 'oral'>('target');
const oralMistakes = ref<any[]>([]);

const tabIndicatorStyle = computed(() => {
  const tabs = ['target', 'mock', 'oral'];
  const idx = tabs.indexOf(activeTab.value);
  const percent = (idx / 3) * 100;
  return { left: `calc(${percent}% + 20rpx)`, width: `calc(${100 / 3}% - 40rpx)` };
});
const targetHistory = ref<any[]>([]);
const mockHistory = ref<any[]>([]);

onShow(() => {
  targetHistory.value = [
    { id: '1', sourceNote: '高一数学 · 导数与极值', score: 85, correctCount: 12, totalCount: 15, createdAt: new Date().toISOString() },
    { id: '2', sourceNote: '高一英语 · 虚拟语气', score: 60, correctCount: 9, totalCount: 15, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ];
  mockHistory.value = [
    { id: '3', examName: '2025年高考数学模拟卷（全国甲卷）', score: 92, duration: 110, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];
  oralMistakes.value = [
    { word: 'entrepreneur', bestScore: 45, errorCount: 8 },
    { word: 'necessary', bestScore: 58, errorCount: 5 },
    { word: 'environment', bestScore: 52, errorCount: 4 },
  ];
});

function startTargetPractice() { uni.switchTab({ url: '/pages/notes/index' }); }
function startMockExam() { uni.navigateTo({ url: '/pages/mock-exam/index?type=exam' }); }
function goOralEntry() { uni.navigateTo({ url: '/pages/oral/index' }); }
function goOralMistakes() { uni.navigateTo({ url: '/pages/oral/mistakes/index' }); }
function practiceOralWord(item: any) {
  const words = encodeURIComponent(JSON.stringify([item.word]));
  uni.navigateTo({ url: `/pages/oral/settings/index?words=${words}` });
}
function goExerciseResult(id: string) { uni.navigateTo({ url: `/pages/exercise/result/index?id=${id}` }); }
function scoreClass(score: number) { if (score >= 80) return 'good'; if (score >= 60) return 'mid'; return 'bad'; }
function formatTime(dateStr: string) {
  const d = new Date(dateStr); const now = new Date(); const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return '今天'; if (diff < 172800000) return '昨天';
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; }
.practice-page {
  --c-primary: #5B7BFF; --c-primary-bg: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466;
  --c-success: #34D399; --c-warning: #FFBA4A; --c-danger: #FF6B6B;
  --c-card: #1A1D2E; --c-border: #2A2E3F;
  background: #0F1118; min-height: 100vh;
}
.sub-tabs { display: flex; background: var(--c-card); position: relative; padding: 0 24rpx; padding-top: 88rpx; border-bottom: 1rpx solid var(--c-border); }
.sub-tab { flex: 1; text-align: center; padding: 28rpx 0; font-size: 28rpx; color: var(--c-t3); font-weight: 500; position: relative; z-index: 1; }
.sub-tab.active { color: var(--c-primary); font-weight: 700; }
.tab-indicator { position: absolute; bottom: 0; height: 6rpx; background: var(--c-primary); border-radius: 3rpx; transition: left 0.3s ease; }
.tab-content { padding: 24rpx 32rpx; }
.entry-card { background: var(--c-card); border-radius: 24rpx; padding: 36rpx 28rpx; display: flex; align-items: center; gap: 24rpx; border: 1rpx solid var(--c-border); margin-bottom: 32rpx; }
.entry-emoji { font-size: 48rpx; }
.entry-info { flex: 1; }
.entry-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.entry-desc { font-size: 24rpx; color: var(--c-t3); display: block; }
.entry-arrow { flex-shrink: 0; }
.arrow-chevron { width: 16rpx; height: 16rpx; border-right: 3rpx solid var(--c-t3); border-top: 3rpx solid var(--c-t3); transform: rotate(45deg); }
.section { margin-bottom: 32rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.more-link { font-size: 24rpx; color: var(--c-primary); }
.section-title { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }
.empty-hint { padding: 60rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }
.history-card { background: var(--c-card); border-radius: 20rpx; padding: 28rpx 24rpx; margin-bottom: 16rpx; display: flex; align-items: center; gap: 20rpx; border: 1rpx solid var(--c-border); }
.history-left { flex-shrink: 0; }
.history-indicator { width: 8rpx; height: 52rpx; border-radius: 4rpx; background: var(--c-t3); }
.history-indicator.good { background: var(--c-success); }
.history-indicator.mid { background: var(--c-warning); }
.history-indicator.bad { background: var(--c-danger); }
.history-content { flex: 1; min-width: 0; }
.history-title { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 10rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.history-meta { display: flex; align-items: center; gap: 16rpx; }
.history-score { font-size: 24rpx; color: var(--c-primary); font-weight: 600; }
.history-count, .history-time { font-size: 22rpx; color: var(--c-t3); }
</style>
