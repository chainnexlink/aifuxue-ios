<template>
  <view class="teacher-hw">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: filter === 'all' }" @tap="filter = 'all'">
        <text>全部</text>
      </view>
      <view class="filter-item" :class="{ active: filter === 'collecting' }" @tap="filter = 'collecting'">
        <text>收集中</text>
      </view>
      <view class="filter-item" :class="{ active: filter === 'grading' }" @tap="filter = 'grading'">
        <text>批改中</text>
      </view>
      <view class="filter-item" :class="{ active: filter === 'done' }" @tap="filter = 'done'">
        <text>已完成</text>
      </view>
    </view>

    <!-- 作业列表 -->
    <view v-if="filteredList.length === 0" class="empty-hint">
      <text class="empty-text">暂无作业</text>
    </view>

    <view v-for="hw in filteredList" :key="hw.id" class="hw-card" @tap="goDetail(hw.id)">
      <view class="hw-top">
        <view class="hw-type-tag" :class="hw.type">
          <text>{{ hw.type === 'online' ? '线上' : '线下' }}</text>
        </view>
        <view class="hw-status-tag" :class="hw.status">
          <text>{{ statusText(hw.status) }}</text>
        </view>
      </view>
      <text class="hw-name">{{ hw.name }}</text>
      <text class="hw-class">{{ hw.className }}</text>
      <view class="hw-bottom">
        <view class="progress-area">
          <view class="progress-bar-bg">
            <view class="progress-bar-fill" :style="{ width: (hw.submitCount / hw.totalCount * 100) + '%' }"></view>
          </view>
          <text class="progress-text">{{ hw.submitCount }}/{{ hw.totalCount }}人提交</text>
        </view>
        <text class="hw-deadline">截止 {{ hw.deadline }}</text>
      </view>
    </view>

    <!-- 底部按钮组 -->
    <view class="fab-group">
      <view class="fab-btn secondary" @tap="goExamGen">
        <text class="fab-text">📄 AI智能出卷</text>
      </view>
      <view class="fab-btn" @tap="goPublish">
        <text class="fab-text">+ 发布作业</text>
      </view>
    </view>

    <view style="height: 280rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const filter = ref('all');

const homeworkList = ref([
  { id: '1', name: '第三章导数练习', className: '高一2班数学', type: 'online', status: 'grading', submitCount: 32, totalCount: 45, deadline: '05-04 23:59' },
  { id: '2', name: '虚拟语气专项', className: '高一2班英语', type: 'online', status: 'done', submitCount: 45, totalCount: 45, deadline: '05-02 23:59' },
  { id: '3', name: '古诗词默写', className: '高一1班语文', type: 'offline', status: 'collecting', submitCount: 28, totalCount: 42, deadline: '05-06 18:00' },
  { id: '4', name: '物理实验报告', className: '高一1班物理', type: 'offline', status: 'collecting', submitCount: 15, totalCount: 42, deadline: '05-07 18:00' },
  { id: '5', name: '化学方程式', className: '高一2班化学', type: 'online', status: 'done', submitCount: 44, totalCount: 45, deadline: '05-01 23:59' },
]);

const filteredList = computed(() => {
  if (filter.value === 'all') return homeworkList.value;
  return homeworkList.value.filter(h => h.status === filter.value);
});

function statusText(s: string) {
  const m: Record<string, string> = { collecting: '收集中', grading: '批改中', done: '已完成' };
  return m[s] || s;
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/teacher/homework-detail/index?id=${id}` });
}

function goPublish() {
  uni.navigateTo({ url: '/pages/teacher/homework-publish/index' });
}

function goExamGen() {
  uni.navigateTo({ url: '/pages/teacher/exam-gen/index' });
}
</script>

<style scoped>
.teacher-hw {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  padding-top: 88rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}

.filter-bar { display: flex; gap: 16rpx; margin-bottom: 24rpx; }
.filter-item {
  padding: 12rpx 28rpx; border-radius: 24rpx;
  background: var(--c-card); border: 1rpx solid var(--c-border);
  font-size: 26rpx; color: var(--c-t3);
}
.filter-item.active { background: var(--c-primary); border-color: var(--c-primary); color: #FFF; }

.hw-card {
  background: var(--c-card); border-radius: 24rpx; padding: 28rpx;
  margin-bottom: 16rpx; border: 1rpx solid var(--c-border);
}
.hw-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
.hw-type-tag { padding: 4rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.hw-type-tag.online { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-type-tag.offline { background: rgba(167,139,250,0.15); color: #A78BFA; }
.hw-status-tag { padding: 4rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.hw-status-tag.collecting { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-status-tag.grading { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.hw-status-tag.done { background: rgba(52,211,153,0.15); color: #34D399; }

.hw-name { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.hw-class { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 16rpx; }

.hw-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.progress-area { flex: 1; margin-right: 20rpx; }
.progress-bar-bg { height: 8rpx; background: #242838; border-radius: 4rpx; overflow: hidden; margin-bottom: 6rpx; }
.progress-bar-fill { height: 100%; background: var(--c-primary); border-radius: 4rpx; }
.progress-text { font-size: 22rpx; color: var(--c-t3); }
.hw-deadline { font-size: 22rpx; color: var(--c-t3); flex-shrink: 0; }

.fab-group {
  position: fixed; bottom: 200rpx; right: 32rpx;
  display: flex; flex-direction: column; gap: 16rpx; z-index: 10;
}
.fab-btn {
  background: var(--c-primary); padding: 24rpx 36rpx; border-radius: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.4); text-align: center;
}
.fab-btn.secondary {
  background: #1A1D2E; border: 2rpx solid var(--c-primary);
  box-shadow: 0 4rpx 16rpx rgba(91,123,255,0.2);
}
.fab-text { font-size: 28rpx; font-weight: 700; color: #FFF; }

.empty-hint { padding: 80rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }
</style>
