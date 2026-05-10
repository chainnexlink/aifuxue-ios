<template>
  <view class="page">
    <view v-if="homeworkList.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-title">暂无作业</text>
      <text class="empty-desc">老师发布作业后会显示在这里</text>
    </view>

    <view v-for="hw in homeworkList" :key="hw.id" class="hw-card" @tap="goDetail(hw.id)">
      <view class="hw-top">
        <view class="hw-type" :class="hw.type"><text>{{ hw.type === 'online' ? '线上' : '线下' }}</text></view>
        <view class="hw-status" :class="hw.myStatus"><text>{{ statusLabel(hw.myStatus) }}</text></view>
      </view>
      <text class="hw-name">{{ hw.name }}</text>
      <text class="hw-class">{{ hw.className }} · {{ hw.teacherName }}</text>
      <view class="hw-bottom">
        <text class="hw-deadline" :class="{ urgent: hw.urgent }">截止 {{ hw.deadline }}</text>
        <text v-if="hw.myStatus === 'graded'" class="hw-score">得分: {{ hw.score }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const homeworkList = ref([
  { id: '1', name: '第三章导数练习', className: '高一2班数学', teacherName: '王老师', type: 'online', myStatus: 'pending', deadline: '明天 23:59', urgent: true, score: null },
  { id: '2', name: '古诗词默写', className: '高一1班语文', teacherName: '张老师', type: 'offline', myStatus: 'pending', deadline: '05-06 18:00', urgent: false, score: null },
  { id: '3', name: '虚拟语气专项', className: '高一2班英语', teacherName: '李老师', type: 'online', myStatus: 'graded', deadline: '05-02 23:59', urgent: false, score: 85 },
]);

function statusLabel(s: string) {
  const m: Record<string, string> = { pending: '待完成', submitted: '已提交', graded: '已批改' };
  return m[s] || s;
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/class/homework-detail/index?id=${id}` });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.empty-state { text-align: center; padding-top: 200rpx; }
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.empty-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 10rpx; }
.empty-desc { font-size: 26rpx; color: var(--c-t3); }
.hw-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 16rpx; border: 1rpx solid var(--c-border); }
.hw-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rpx; }
.hw-type { padding: 4rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.hw-type.online { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-type.offline { background: rgba(167,139,250,0.15); color: #A78BFA; }
.hw-status { padding: 4rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.hw-status.pending { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.hw-status.submitted { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-status.graded { background: rgba(52,211,153,0.15); color: #34D399; }
.hw-name { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.hw-class { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 12rpx; }
.hw-bottom { display: flex; justify-content: space-between; }
.hw-deadline { font-size: 24rpx; color: var(--c-t3); }
.hw-deadline.urgent { color: #FF6B6B; font-weight: 600; }
.hw-score { font-size: 26rpx; color: var(--c-primary); font-weight: 700; }
</style>
