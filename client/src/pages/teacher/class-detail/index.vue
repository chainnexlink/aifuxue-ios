<template>
  <view class="page">
    <!-- 班级信息 -->
    <view class="info-card">
      <view class="info-row">
        <text class="info-name">{{ cls.name }}</text>
        <view class="info-badge"><text>{{ cls.grade }}</text></view>
      </view>
      <text class="info-subject">{{ cls.subject }} · {{ cls.studentCount }}人</text>
    </view>

    <!-- 邀请码区域 -->
    <view class="code-card">
      <text class="code-label">班级邀请码</text>
      <text class="code-value">{{ cls.inviteCode }}</text>
      <view class="code-actions">
        <view class="code-btn" @tap="copyCode"><text>复制</text></view>
        <view class="code-btn share" @tap="shareCode"><text>分享</text></view>
      </view>
    </view>

    <!-- 班级学情概览（错题同步数据） -->
    <view class="section-card">
      <text class="section-title">班级学情概览</text>
      <view class="stats-grid">
        <view class="stat-block">
          <text class="stat-num" style="color:#FF6B6B;">{{ classStats.totalMistakes }}</text>
          <text class="stat-label">累计错题</text>
        </view>
        <view class="stat-block">
          <text class="stat-num" style="color:#FFBA4A;">{{ classStats.weakPoints }}</text>
          <text class="stat-label">薄弱知识点</text>
        </view>
        <view class="stat-block">
          <text class="stat-num" style="color:#5B7BFF;">{{ classStats.avgAccuracy }}%</text>
          <text class="stat-label">平均正确率</text>
        </view>
      </view>
      <view class="weak-list">
        <text class="weak-title">高频错误知识点</text>
        <view v-for="w in classStats.topWeakPoints" :key="w.name" class="weak-row">
          <text class="weak-name">{{ w.name }}</text>
          <view class="weak-bar-bg">
            <view class="weak-bar-fill" :style="{ width: w.rate + '%' }"></view>
          </view>
          <text class="weak-rate">{{ w.rate }}%错误率</text>
        </view>
      </view>
    </view>

    <!-- 学生列表（含错题统计） -->
    <view class="section-card">
      <text class="section-title">学生列表（{{ students.length }}人）</text>
      <view v-for="s in students" :key="s.id" class="student-item" @tap="goStudentMistakes(s)">
        <view class="s-avatar"><text>{{ s.name.charAt(0) }}</text></view>
        <view class="s-info">
          <text class="s-name">{{ s.name }}</text>
          <text class="s-meta">完成率 {{ s.completeRate }}% · 错题 {{ s.mistakeCount }}题</text>
        </view>
        <view class="s-weak" v-if="s.weakSubject">
          <text class="s-weak-text">薄弱: {{ s.weakSubject }}</text>
        </view>
        <view class="s-arrow"></view>
      </view>
    </view>

    <!-- 发布作业 -->
    <view class="fab-btn" @tap="goPublish">
      <text class="fab-text">发布作业到此班</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cls = ref({
  id: '1', name: '高一2班数学', grade: '高一', subject: '数学',
  studentCount: 45, inviteCode: 'CLASS-A8K2M9',
});

const classStats = ref({
  totalMistakes: 156,
  weakPoints: 8,
  avgAccuracy: 72,
  topWeakPoints: [
    { name: '导数应用', rate: 45 },
    { name: '概率统计', rate: 38 },
    { name: '三角函数', rate: 32 },
  ],
});

const students = ref([
  { id: '1', name: '张三', completeRate: 92, mistakeCount: 12, weakSubject: '导数' },
  { id: '2', name: '李四', completeRate: 88, mistakeCount: 8, weakSubject: '' },
  { id: '3', name: '王五', completeRate: 76, mistakeCount: 18, weakSubject: '概率' },
  { id: '4', name: '赵六', completeRate: 95, mistakeCount: 5, weakSubject: '' },
  { id: '5', name: '钱七', completeRate: 60, mistakeCount: 24, weakSubject: '三角函数' },
  { id: '6', name: '孙八', completeRate: 85, mistakeCount: 10, weakSubject: '导数' },
  { id: '7', name: '周九', completeRate: 78, mistakeCount: 15, weakSubject: '' },
  { id: '8', name: '吴十', completeRate: 90, mistakeCount: 7, weakSubject: '' },
]);

function copyCode() {
  uni.setClipboardData({ data: cls.value.inviteCode, success: () => uni.showToast({ title: '已复制', icon: 'success' }) });
}
function shareCode() { uni.showToast({ title: '分享功能开发中', icon: 'none' }); }
function goPublish() {
  uni.navigateTo({ url: `/pages/teacher/homework-publish/index?classId=${cls.value.id}` });
}
function goStudentMistakes(s: any) {
  uni.navigateTo({ url: `/pages/teacher/class-mistakes/detail?studentId=${s.id}&name=${s.name}` });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; padding-bottom: 140rpx; }
.info-card { background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 24rpx; padding: 36rpx; margin-bottom: 20rpx; }
.info-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.info-name { font-size: 36rpx; font-weight: 700; color: #FFF; }
.info-badge { background: rgba(255,255,255,0.25); padding: 4rpx 14rpx; border-radius: 10rpx; }
.info-badge text { font-size: 22rpx; color: #FFF; }
.info-subject { font-size: 26rpx; color: rgba(255,255,255,0.7); }

.code-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); text-align: center; }
.code-label { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 12rpx; }
.code-value { font-size: 48rpx; font-weight: 800; color: var(--c-primary); letter-spacing: 4rpx; display: block; margin-bottom: 20rpx; }
.code-actions { display: flex; gap: 16rpx; justify-content: center; }
.code-btn { padding: 14rpx 36rpx; border-radius: 14rpx; background: rgba(91,123,255,0.15); }
.code-btn text { font-size: 26rpx; color: var(--c-primary); font-weight: 600; }
.code-btn.share { background: var(--c-primary); }
.code-btn.share text { color: #FFF; }

.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; border: 1rpx solid var(--c-border); margin-bottom: 20rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.stats-grid { display: flex; gap: 16rpx; margin-bottom: 24rpx; }
.stat-block { flex: 1; text-align: center; background: #242838; border-radius: 14rpx; padding: 20rpx 0; }
.stat-num { font-size: 40rpx; font-weight: 800; display: block; margin-bottom: 4rpx; }
.stat-label { font-size: 22rpx; color: var(--c-t3); }

.weak-list { margin-top: 8rpx; }
.weak-title { font-size: 24rpx; color: var(--c-t2); display: block; margin-bottom: 16rpx; }
.weak-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 14rpx; }
.weak-name { font-size: 26rpx; color: var(--c-t1); width: 140rpx; flex-shrink: 0; }
.weak-bar-bg { flex: 1; height: 12rpx; background: #242838; border-radius: 6rpx; overflow: hidden; }
.weak-bar-fill { height: 100%; background: #FF6B6B; border-radius: 6rpx; }
.weak-rate { font-size: 22rpx; color: #FF6B6B; width: 140rpx; text-align: right; flex-shrink: 0; }

.student-item { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid var(--c-border); }
.student-item:last-child { border-bottom: none; }
.s-avatar { width: 64rpx; height: 64rpx; background: rgba(91,123,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s-avatar text { font-size: 28rpx; font-weight: 700; color: var(--c-primary); }
.s-info { flex: 1; }
.s-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 4rpx; }
.s-meta { font-size: 22rpx; color: var(--c-t3); }
.s-weak { background: rgba(255,107,107,0.1); padding: 4rpx 12rpx; border-radius: 8rpx; margin-right: 8rpx; }
.s-weak-text { font-size: 20rpx; color: #FF6B6B; }
.s-arrow { width: 14rpx; height: 14rpx; border-right: 2.5rpx solid var(--c-t3); border-top: 2.5rpx solid var(--c-t3); transform: rotate(45deg); flex-shrink: 0; }

.fab-btn { position: fixed; bottom: 40rpx; left: 32rpx; right: 32rpx; background: var(--c-primary); padding: 28rpx; border-radius: 20rpx; text-align: center; box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.4); z-index: 10; }
.fab-text { font-size: 30rpx; font-weight: 700; color: #FFF; }
</style>
