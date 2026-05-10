<template>
  <view class="preview-page">
    <!-- 图片预览 -->
    <view class="images-area">
      <scroll-view scroll-x class="images-scroll">
        <view class="images-row">
          <image
            v-for="(img, idx) in images"
            :key="idx"
            :src="img"
            mode="aspectFit"
            class="preview-img"
            @tap="previewImage(idx)"
          />
        </view>
      </scroll-view>
      <text class="img-count">{{ images.length }}张图片</text>
    </view>

    <!-- 选项 -->
    <view class="options card">
      <view class="option-row">
        <text class="option-label">笔记标题</text>
        <input v-model="title" placeholder="可选，AI会自动生成" class="option-input" />
      </view>
      <view class="option-row">
        <text class="option-label">学科</text>
        <picker :range="subjects" @change="onSubjectChange">
          <view class="option-picker">
            <text>{{ subject || '选择学科（可选）' }}</text>
            <text class="arrow">▸</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 处理状态 -->
    <view v-if="processing" class="processing-area card">
      <view class="processing-steps">
        <view class="step" :class="{ active: step >= 1, done: step > 1 }">
          <view class="step-dot" />
          <text>图片增强</text>
        </view>
        <view class="step" :class="{ active: step >= 2, done: step > 2 }">
          <view class="step-dot" />
          <text>OCR识别</text>
        </view>
        <view class="step" :class="{ active: step >= 3, done: step > 3 }">
          <view class="step-dot" />
          <text>AI整理</text>
        </view>
      </view>
      <text class="processing-text">正在处理中，请稍候...</text>
    </view>

    <!-- 提交按钮 -->
    <view v-if="!processing" class="btn-primary submit-btn" @tap="handleSubmit">
      <text>开始整理笔记</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { uploadFile } from '@/utils/request';

const images = ref<string[]>([]);
const title = ref('');
const subject = ref('');
const processing = ref(false);
const step = ref(0);

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '其他'];

onLoad((options) => {
  if (options?.images) {
    try {
      images.value = JSON.parse(decodeURIComponent(options.images));
    } catch {}
  }
});

function previewImage(idx: number) {
  uni.previewImage({
    current: idx,
    urls: images.value,
  });
}

function onSubjectChange(e: any) {
  subject.value = subjects[e.detail.value];
}

async function handleSubmit() {
  if (images.value.length === 0) {
    uni.showToast({ title: '请先选择图片', icon: 'none' });
    return;
  }

  processing.value = true;
  step.value = 1;

  try {
    step.value = 2; // 上传中

    // 逐个上传（小程序uploadFile只支持单文件）
    const formData: Record<string, any> = {};
    if (title.value) formData.title = title.value;
    if (subject.value) formData.subject = subject.value;

    step.value = 3; // AI 处理中
    const res = await uploadFile(images.value[0], formData);

    step.value = 4; // 完成
    uni.showToast({ title: '笔记创建成功', icon: 'success' });

    setTimeout(() => {
      if (res.id) {
        uni.redirectTo({ url: `/pages/notes/detail/index?id=${res.id}` });
      } else {
        uni.switchTab({ url: '/pages/notes/index' });
      }
    }, 1000);
  } catch {
    processing.value = false;
    step.value = 0;
    uni.showToast({ title: '处理失败，请重试', icon: 'none' });
  }
}
</script>

<style scoped>
.preview-page { padding: 30rpx; background: #0F1118; min-height: 100vh; }

.images-area { margin-bottom: 30rpx; }
.images-scroll { white-space: nowrap; }
.images-row { display: flex; gap: 16rpx; }
.preview-img { width: 240rpx; height: 320rpx; border-radius: 12rpx; background: #242838; flex-shrink: 0; }
.img-count { font-size: 24rpx; color: #4D5466; margin-top: 12rpx; display: block; }

.options { margin-bottom: 30rpx; }
.option-row { padding: 20rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.option-row:last-child { border-bottom: none; }
.option-label { font-size: 28rpx; color: #8B92A5; display: block; margin-bottom: 12rpx; }
.option-input { font-size: 30rpx; padding: 8rpx 0; color: #E8ECF4; }
.option-picker { display: flex; justify-content: space-between; align-items: center; padding: 8rpx 0; color: #E8ECF4; }
.arrow { color: #4D5466; }

.processing-area { text-align: center; padding: 60rpx 40rpx; }

.processing-steps { display: flex; justify-content: center; gap: 60rpx; margin-bottom: 40rpx; }
.step { display: flex; flex-direction: column; align-items: center; gap: 12rpx; color: #4D5466; font-size: 26rpx; }
.step.active { color: #5B7BFF; }
.step.done { color: #34D399; }
.step-dot { width: 24rpx; height: 24rpx; border-radius: 50%; background: #2A2E3F; }
.step.active .step-dot { background: #5B7BFF; }
.step.done .step-dot { background: #34D399; }

.processing-text { font-size: 28rpx; color: #4D5466; }

.submit-btn { margin-top: 40rpx; }
</style>
