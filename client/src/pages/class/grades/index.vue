<template>
  <view class="page">
    <view v-if="gradeList.length === 0" class="empty-state">
      <text class="empty-icon">📊</text>
      <text class="empty-title">暂无成绩</text>
      <text class="empty-desc">老师发布成绩后会显示在这里</text>
    </view>

    <view v-for="g in gradeList" :key="g.id" class="grade-card">
      <view class="gc-top">
        <text class="gc-exam">{{ g.examName }}</text>
        <text class="gc-date">{{ g.date }}</text>
      </view>
      <view class="gc-score-area">
        <text class="gc-score">{{ g.score }}</text>
        <text class="gc-full">/{{ g.fullScore }}</text>
      </view>
      <view class="gc-bottom">
        <text class="gc-subject">{{ g.subject }}</text>
        <text class="gc-class">{{ g.className }}</text>
        <view class="gc-rank" v-if="g.rank">
          <text>班级排名 {{ g.rank }}/{{ g.totalStudents }}</text>
        </view>
      </view>
      <view v-if="g.comment" class="gc-comment">
        <text class="gc-comment-label">老师评语：</text>
        <text class="gc-comment-text">{{ g.comment }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const gradeList = ref([
  {
    id: '1',
    examName: '期中考试',
    subject: '数学',
    className: '高一2班',
    score: 85,
    fullScore: 100,
    rank: 12,
    totalStudents: 45,
    date: '05-08',
    comment: '导数部分掌握较好，概率需加强练习。',
  },
  {
    id: '2',
    examName: '第三章单元测验',
    subject: '数学',
    className: '高一2班',
    score: 92,
    fullScore: 100,
    rank: 5,
    totalStudents: 45,
    date: '04-28',
    comment: '',
  },
  {
    id: '3',
    examName: '虚拟语气专项测试',
    subject: '英语',
    className: '高一2班',
    score: 78,
    fullScore: 100,
    rank: 18,
    totalStudents: 45,
    date: '04-25',
    comment: '语法部分还需巩固，建议多做相关练习。',
  },
]);
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.empty-state { text-align: center; padding-top: 200rpx; }
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.empty-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 10rpx; }
.empty-desc { font-size: 26rpx; color: var(--c-t3); }

.grade-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 16rpx; border: 1rpx solid var(--c-border); }
.gc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.gc-exam { font-size: 30rpx; font-weight: 700; color: var(--c-t1); }
.gc-date { font-size: 24rpx; color: var(--c-t3); }

.gc-score-area { display: flex; align-items: baseline; margin-bottom: 16rpx; }
.gc-score { font-size: 56rpx; font-weight: 800; color: var(--c-primary); }
.gc-full { font-size: 28rpx; color: var(--c-t3); margin-left: 4rpx; }

.gc-bottom { display: flex; align-items: center; gap: 16rpx; }
.gc-subject { font-size: 24rpx; color: var(--c-primary); background: rgba(91,123,255,0.15); padding: 4rpx 14rpx; border-radius: 8rpx; }
.gc-class { font-size: 24rpx; color: var(--c-t3); }
.gc-rank { margin-left: auto; }
.gc-rank text { font-size: 24rpx; color: #FFBA4A; }

.gc-comment { margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid var(--c-border); }
.gc-comment-label { font-size: 24rpx; color: var(--c-t3); }
.gc-comment-text { font-size: 26rpx; color: var(--c-t2); line-height: 1.6; }
</style>
