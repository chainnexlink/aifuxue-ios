<template>
  <view class="page">
    <text class="page-title">班级错题集</text>

    <!-- 筛选 -->
    <view class="filter-bar">
      <picker mode="selector" :range="classNames" @change="filterClass = classNames[$event.detail.value]">
        <view class="filter-chip"><text>{{ filterClass || '全部班级' }} ▾</text></view>
      </picker>
      <picker mode="selector" :range="subjects" @change="filterSubject = subjects[$event.detail.value]">
        <view class="filter-chip"><text>{{ filterSubject || '全部学科' }} ▾</text></view>
      </picker>
    </view>

    <!-- 错题汇总卡片 -->
    <view v-for="item in mistakeCards" :key="item.id" class="mistake-card" @tap="goDetail(item.id)">
      <view class="mc-header">
        <text class="mc-name">{{ item.hwName }}</text>
        <view class="mc-badge"><text>{{ item.errorRate }}% 错误率</text></view>
      </view>
      <text class="mc-class">{{ item.className }} · {{ item.date }}</text>
      <view class="mc-stats">
        <view class="mc-stat"><text class="mc-s-num" style="color:#FF6B6B;">{{ item.errorCount }}</text><text class="mc-s-label">错题数</text></view>
        <view class="mc-stat"><text class="mc-s-num" style="color:#FFBA4A;">{{ item.hotCount }}</text><text class="mc-s-label">高频错题</text></view>
        <view class="mc-stat"><text class="mc-s-num" style="color:#5B7BFF;">{{ item.studentCount }}</text><text class="mc-s-label">涉及学生</text></view>
      </view>
      <view class="mc-tags">
        <view v-for="kp in item.knowledgePoints" :key="kp" class="kp-tag"><text>{{ kp }}</text></view>
      </view>
    </view>

    <view v-if="mistakeCards.length === 0" class="empty-hint">
      <text class="empty-text">暂无班级错题数据</text>
      <text class="empty-sub">学生自主录入错题与AI批改错题将自动汇总到此处</text>
    </view>

    <!-- 数据来源说明 -->
    <view v-if="mistakeCards.length > 0" class="source-hint">
      <text class="source-text">数据来源：AI批改识别 + 学生错题本自主录入</text>
    </view>

    <view style="height: 40rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const classNames = ['全部班级', '高一2班数学', '高一1班数学', '高一2班英语']
const subjects = ['全部学科', '数学', '英语', '语文']
const filterClass = ref('')
const filterSubject = ref('')

const mistakeCards = ref([
  { id: '1', hwName: '第三章导数练习', className: '高一2班数学', date: '2025-05-03', errorRate: 35, errorCount: 12, hotCount: 4, studentCount: 18, knowledgePoints: ['导数定义', '求导法则', '极值'] },
  { id: '2', hwName: '虚拟语气专项', className: '高一2班英语', date: '2025-05-02', errorRate: 42, errorCount: 8, hotCount: 3, studentCount: 22, knowledgePoints: ['虚拟语气', '条件从句', 'wish用法'] },
  { id: '3', hwName: '一元二次方程测验', className: '高一1班数学', date: '2025-04-28', errorRate: 28, errorCount: 15, hotCount: 5, studentCount: 16, knowledgePoints: ['根的判别式', '韦达定理', '实际应用'] },
])

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/teacher/class-mistakes/detail?id=${id}` })
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.page-title { font-size: 36rpx; font-weight: 800; color: var(--c-t1); display: block; margin-bottom: 24rpx; }
.filter-bar { display: flex; gap: 12rpx; margin-bottom: 24rpx; }
.filter-chip { padding: 12rpx 24rpx; background: var(--c-card); border-radius: 14rpx; border: 1rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.mistake-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 16rpx; border: 1rpx solid var(--c-border); }
.mc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.mc-name { font-size: 30rpx; font-weight: 700; color: var(--c-t1); }
.mc-badge { padding: 4rpx 14rpx; border-radius: 8rpx; background: rgba(255,107,107,0.15); }
.mc-badge text { font-size: 22rpx; color: #FF6B6B; font-weight: 600; }
.mc-class { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 16rpx; }
.mc-stats { display: flex; gap: 24rpx; margin-bottom: 16rpx; }
.mc-stat { text-align: center; }
.mc-s-num { font-size: 36rpx; font-weight: 700; display: block; line-height: 1; margin-bottom: 4rpx; }
.mc-s-label { font-size: 20rpx; color: var(--c-t3); }
.mc-tags { display: flex; gap: 8rpx; flex-wrap: wrap; }
.kp-tag { padding: 6rpx 14rpx; background: rgba(91,123,255,0.1); border-radius: 8rpx; font-size: 22rpx; color: var(--c-primary); }
.empty-hint { text-align: center; padding: 80rpx 0; }
.empty-text { font-size: 28rpx; color: var(--c-t3); display: block; margin-bottom: 8rpx; }
.empty-sub { font-size: 24rpx; color: var(--c-t3); opacity: 0.7; }
.source-hint { text-align: center; padding: 16rpx 0; }
.source-text { font-size: 22rpx; color: var(--c-t3); opacity: 0.7; }
</style>
