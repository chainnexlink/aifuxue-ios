<template>
  <view class="page">
    <view class="join-card">
      <text class="join-icon">🏫</text>
      <text class="join-title">加入班级</text>
      <text class="join-desc">输入老师分享的班级邀请码</text>

      <view class="code-input-area">
        <text class="code-prefix">CLASS-</text>
        <input class="code-input" v-model="code" placeholder="XXXXXX" maxlength="6" />
      </view>

      <view class="submit-btn" :class="{ disabled: code.length < 6 }" @tap="handleJoin">
        <text class="submit-text">验证并加入</text>
      </view>
    </view>

    <!-- 已加入的班级 -->
    <view v-if="joinedClasses.length > 0" class="section-card">
      <text class="section-title">已加入的班级</text>
      <view v-for="cls in joinedClasses" :key="cls.id" class="class-item">
        <view class="cls-info">
          <text class="cls-name">{{ cls.name }}</text>
          <text class="cls-meta">{{ cls.teacher }} · {{ cls.studentCount }}人</text>
        </view>
        <view class="cls-badge"><text>{{ cls.grade }}</text></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code = ref('');
const joinedClasses = ref([
  { id: '1', name: '高一2班数学', teacher: '王老师', grade: '高一', studentCount: 45 },
]);

function handleJoin() {
  if (code.value.length < 6) return;
  uni.showLoading({ title: '验证中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showModal({
      title: '验证成功',
      content: '确认加入「高一1班英语」（李老师）？',
      success: (res) => {
        if (res.confirm) {
          joinedClasses.value.push({ id: '2', name: '高一1班英语', teacher: '李老师', grade: '高一', studentCount: 38 });
          code.value = '';
          uni.showToast({ title: '加入成功', icon: 'success' });
        }
      },
    });
  }, 1000);
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.join-card { background: var(--c-card); border-radius: 24rpx; padding: 48rpx 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); text-align: center; }
.join-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.join-title { font-size: 36rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 10rpx; }
.join-desc { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 40rpx; }
.code-input-area { display: flex; align-items: center; justify-content: center; gap: 8rpx; background: #242838; border-radius: 16rpx; padding: 24rpx 32rpx; margin-bottom: 32rpx; }
.code-prefix { font-size: 36rpx; font-weight: 800; color: var(--c-primary); letter-spacing: 2rpx; }
.code-input { font-size: 36rpx; font-weight: 800; color: var(--c-t1); letter-spacing: 4rpx; width: 240rpx; text-align: center; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 24rpx; }
.submit-btn.disabled { opacity: 0.4; }
.submit-text { font-size: 30rpx; font-weight: 700; color: #FFF; }
.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; border: 1rpx solid var(--c-border); }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 16rpx; }
.class-item { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 0; border-bottom: 1rpx solid var(--c-border); }
.class-item:last-child { border-bottom: none; }
.cls-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 4rpx; }
.cls-meta { font-size: 22rpx; color: var(--c-t3); }
.cls-badge { background: rgba(91,123,255,0.15); padding: 6rpx 16rpx; border-radius: 8rpx; }
.cls-badge text { font-size: 22rpx; color: var(--c-primary); }
</style>
