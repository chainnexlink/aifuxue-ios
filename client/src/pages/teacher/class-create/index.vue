<template>
  <view class="page">
    <view class="form-card">
      <text class="form-title">创建新班级</text>
      <view class="form-group">
        <text class="form-label">班级名称</text>
        <input class="form-input" v-model="form.name" placeholder="如：三年级2班数学" />
      </view>
      <view class="form-group">
        <text class="form-label">年级</text>
        <picker :range="grades" @change="form.grade = grades[$event.detail.value]">
          <view class="form-picker">
            <text :class="{ placeholder: !form.grade }">{{ form.grade || '请选择年级' }}</text>
            <text class="picker-arrow">▾</text>
          </view>
        </picker>
      </view>
      <view class="form-group">
        <text class="form-label">学科</text>
        <picker :range="subjects" @change="form.subject = subjects[$event.detail.value]">
          <view class="form-picker">
            <text :class="{ placeholder: !form.subject }">{{ form.subject || '请选择学科' }}</text>
            <text class="picker-arrow">▾</text>
          </view>
        </picker>
      </view>
    </view>

    <view class="tip-card">
      <text class="tip-title">创建后将自动生成班级邀请码</text>
      <text class="tip-desc">邀请码格式：CLASS-XXXXXX，分享给学生即可加入</text>
    </view>

    <view class="submit-btn" @tap="handleCreate">
      <text class="submit-text">创建班级</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const grades = ['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级', '初一', '初二', '初三', '高一', '高二', '高三'];
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'];
const form = ref({ name: '', grade: '', subject: '' });

function handleCreate() {
  if (!form.value.name || !form.value.grade || !form.value.subject) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  const code = 'CLASS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  uni.showModal({
    title: '班级创建成功',
    content: `班级邀请码：${code}\n请分享给学生加入`,
    showCancel: false,
    success: () => { uni.navigateBack(); },
  });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 28rpx; }
.form-group { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.form-input { background: #242838; border-radius: 14rpx; padding: 24rpx; font-size: 28rpx; color: var(--c-t1); width: 100%; box-sizing: border-box; }
.form-picker { background: #242838; border-radius: 14rpx; padding: 24rpx; display: flex; justify-content: space-between; align-items: center; font-size: 28rpx; color: var(--c-t1); }
.placeholder { color: var(--c-t3); }
.picker-arrow { color: var(--c-t3); }
.tip-card { background: rgba(91,123,255,0.1); border-radius: 16rpx; padding: 24rpx; margin-bottom: 32rpx; }
.tip-title { font-size: 26rpx; font-weight: 600; color: var(--c-primary); display: block; margin-bottom: 6rpx; }
.tip-desc { font-size: 24rpx; color: var(--c-t3); }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; }
.submit-text { font-size: 32rpx; font-weight: 700; color: #FFF; }
</style>
