<template>
  <view class="page">
    <view class="auth-card">
      <text class="auth-title">教师认证</text>
      <text class="auth-desc">提交认证资料，审核通过后可使用教师端功能</text>

      <view class="form-group">
        <text class="form-label">真实姓名</text>
        <input class="form-input" v-model="form.name" placeholder="请输入您的真实姓名" />
      </view>
      <view class="form-group">
        <text class="form-label">任教学校</text>
        <input class="form-input" v-model="form.school" placeholder="请输入学校全称" />
      </view>
      <view class="form-group">
        <text class="form-label">任教科目</text>
        <picker :range="subjects" @change="form.subject = subjects[$event.detail.value]">
          <view class="form-picker">
            <text :class="{ placeholder: !form.subject }">{{ form.subject || '请选择科目' }}</text>
            <text class="picker-arrow">▾</text>
          </view>
        </picker>
      </view>
      <view class="form-group">
        <text class="form-label">教师资格证照片</text>
        <view class="upload-area" @tap="uploadCert">
          <text v-if="!certImage" class="upload-emoji">📷</text>
          <text v-if="!certImage" class="upload-text">点击上传</text>
          <text v-else class="upload-done">已上传</text>
        </view>
      </view>
    </view>

    <view class="submit-btn" @tap="handleSubmit">
      <text class="submit-text">提交认证</text>
    </view>

    <view class="tip-text">
      <text>审核一般在1-3个工作日内完成</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理', '其他'];
const certImage = ref('');
const form = ref({ name: '', school: '', subject: '' });

function uploadCert() {
  uni.chooseImage({
    count: 1, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => { certImage.value = res.tempFilePaths[0]; },
  });
}

function handleSubmit() {
  if (!form.value.name || !form.value.school || !form.value.subject) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' }); return;
  }
  if (!certImage.value) {
    uni.showToast({ title: '请上传教师资格证', icon: 'none' }); return;
  }
  uni.showModal({
    title: '提交成功',
    content: '您的认证资料已提交，审核通过后将自动切换为教师端界面',
    showCancel: false,
    success: () => uni.navigateBack(),
  });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.auth-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.auth-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.auth-desc { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 28rpx; }
.form-group { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.form-input { background: #242838; border-radius: 14rpx; padding: 24rpx; font-size: 28rpx; color: var(--c-t1); width: 100%; box-sizing: border-box; }
.form-picker { background: #242838; border-radius: 14rpx; padding: 24rpx; display: flex; justify-content: space-between; font-size: 28rpx; color: var(--c-t1); }
.placeholder { color: var(--c-t3); }
.picker-arrow { color: var(--c-t3); }
.upload-area { background: #242838; border: 2rpx dashed var(--c-border); border-radius: 16rpx; padding: 48rpx; text-align: center; }
.upload-emoji { font-size: 48rpx; display: block; margin-bottom: 12rpx; }
.upload-text { font-size: 26rpx; color: var(--c-t3); }
.upload-done { font-size: 28rpx; color: #34D399; font-weight: 600; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; margin-bottom: 20rpx; }
.submit-text { font-size: 32rpx; font-weight: 700; color: #FFF; }
.tip-text { text-align: center; }
.tip-text text { font-size: 24rpx; color: var(--c-t3); }
</style>
