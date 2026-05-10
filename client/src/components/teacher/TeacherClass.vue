<template>
  <view class="teacher-class">
    <!-- 顶部 -->
    <view class="header-row">
      <text class="page-title">我的班级</text>
      <view class="create-btn" @tap="goCreateClass">
        <text class="create-text">+ 创建班级</text>
      </view>
    </view>

    <!-- 班级列表 -->
    <view v-if="classes.length === 0" class="empty-state">
      <text class="empty-icon">🏫</text>
      <text class="empty-title">还没有班级</text>
      <text class="empty-desc">创建一个班级，开始线上教学</text>
      <view class="empty-btn" @tap="goCreateClass">
        <text class="empty-btn-text">创建班级</text>
      </view>
    </view>

    <view v-for="cls in classes" :key="cls.id" class="class-card" @tap="goClassDetail(cls.id)">
      <view class="class-info">
        <view class="class-name-row">
          <text class="class-name">{{ cls.name }}</text>
          <view class="class-badge">
            <text class="badge-text">{{ cls.grade }}</text>
          </view>
        </view>
        <text class="class-meta">{{ cls.subject }} · {{ cls.studentCount }}人</text>
      </view>
      <view class="class-code-area">
        <text class="code-label">邀请码</text>
        <text class="code-value">{{ cls.inviteCode }}</text>
        <view class="copy-btn" @tap.stop="copyCode(cls.inviteCode)">
          <text class="copy-text">复制</text>
        </view>
      </view>
      <view class="class-actions">
        <view class="action-btn" @tap.stop="goPublishTo(cls.id)">
          <text class="action-text">发布作业</text>
        </view>
        <view class="action-btn secondary" @tap.stop="goClassDetail(cls.id)">
          <text class="action-text secondary">查看详情</text>
        </view>
      </view>
    </view>

    <view style="height: 140rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const classes = ref([
  { id: '1', name: '高一2班数学', grade: '高一', subject: '数学', studentCount: 45, inviteCode: 'CLASS-A8K2M9' },
  { id: '2', name: '高一1班数学', grade: '高一', subject: '数学', studentCount: 42, inviteCode: 'CLASS-B3N7P1' },
]);

function goCreateClass() {
  uni.navigateTo({ url: '/pages/teacher/class-create/index' });
}

function goClassDetail(id: string) {
  uni.navigateTo({ url: `/pages/teacher/class-detail/index?id=${id}` });
}

function goPublishTo(classId: string) {
  uni.navigateTo({ url: `/pages/teacher/homework-publish/index?classId=${classId}` });
}

function copyCode(code: string) {
  uni.setClipboardData({
    data: code,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  });
}
</script>

<style scoped>
.teacher-class {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32rpx; }
.page-title { font-size: 36rpx; font-weight: 800; color: var(--c-t1); }
.create-btn { background: var(--c-primary); padding: 12rpx 28rpx; border-radius: 16rpx; }
.create-text { font-size: 26rpx; font-weight: 600; color: #FFF; }

.class-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid var(--c-border);
}
.class-name-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.class-name { font-size: 32rpx; font-weight: 700; color: var(--c-t1); }
.class-badge { background: rgba(91,123,255,0.15); padding: 4rpx 14rpx; border-radius: 8rpx; }
.badge-text { font-size: 22rpx; color: var(--c-primary); }
.class-meta { font-size: 24rpx; color: var(--c-t3); margin-bottom: 20rpx; }

.class-code-area {
  display: flex; align-items: center; gap: 12rpx;
  background: #242838; border-radius: 12rpx; padding: 16rpx 20rpx; margin-bottom: 20rpx;
}
.code-label { font-size: 22rpx; color: var(--c-t3); }
.code-value { font-size: 28rpx; font-weight: 700; color: var(--c-primary); flex: 1; letter-spacing: 2rpx; }
.copy-btn { background: rgba(91,123,255,0.15); padding: 8rpx 20rpx; border-radius: 10rpx; }
.copy-text { font-size: 22rpx; color: var(--c-primary); font-weight: 600; }

.class-actions { display: flex; gap: 16rpx; }
.action-btn { flex: 1; text-align: center; padding: 18rpx 0; border-radius: 14rpx; background: var(--c-primary); }
.action-btn.secondary { background: rgba(91,123,255,0.15); }
.action-text { font-size: 26rpx; font-weight: 600; color: #FFF; }
.action-text.secondary { color: var(--c-primary); }

.empty-state { text-align: center; padding: 120rpx 0; }
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 20rpx; }
.empty-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 10rpx; }
.empty-desc { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 32rpx; }
.empty-btn { display: inline-block; background: var(--c-primary); padding: 20rpx 48rpx; border-radius: 16rpx; }
.empty-btn-text { font-size: 28rpx; font-weight: 600; color: #FFF; }
</style>
