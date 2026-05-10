<template>
  <view class="confirm-page">
    <!-- 原图缩略 -->
    <view class="image-preview" @tap="previewImg">
      <image v-if="imagePath" :src="imagePath" mode="aspectFit" class="preview-thumb" />
      <text class="preview-hint">点击查看原图</text>
    </view>

    <!-- OCR识别结果 -->
    <view v-if="processing" class="processing">
      <view class="proc-spinner"></view>
      <text class="proc-text">AI正在识别英文内容...</text>
    </view>

    <view v-else class="content-area">
      <view class="select-header">
        <text class="select-title">识别到 {{ items.length }} 个英文内容</text>
        <view class="select-actions">
          <text class="sa-btn" @tap="selectAll">全选</text>
          <text class="sa-btn" @tap="deselectAll">取消</text>
        </view>
      </view>

      <view class="item-list">
        <view v-for="(item, idx) in items" :key="idx" class="content-item" @tap="toggleItem(idx)">
          <view class="ci-check" :class="{ checked: item.selected }">
            <text v-if="item.selected" class="ci-tick">&#10003;</text>
          </view>
          <view class="ci-body">
            <text class="ci-text">{{ item.text }}</text>
            <text v-if="item.translation" class="ci-trans">{{ item.translation }}</text>
          </view>
        </view>
      </view>

      <!-- 手动添加 -->
      <view class="add-area">
        <input v-model="customText" placeholder="手动输入英文内容" class="add-input" />
        <view class="add-btn" @tap="addCustom">
          <text>添加</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view v-if="!processing" class="bottom-bar safe-bottom">
      <view class="btn-primary start-btn" @tap="startPractice">
        <text>开始练习（{{ selectedCount }}个）</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const imagePath = ref('');
const processing = ref(true);
const customText = ref('');
const items = ref<{ text: string; translation?: string; selected: boolean }[]>([]);

const selectedCount = computed(() => items.value.filter(i => i.selected).length);

onLoad((options) => {
  if (options?.images) {
    try {
      const imgs = JSON.parse(decodeURIComponent(options.images));
      imagePath.value = imgs[0] || '';
    } catch {}
  }
  if (options?.words) {
    try {
      const words = JSON.parse(decodeURIComponent(options.words));
      items.value = words.map((w: string) => ({ text: w, selected: true }));
      processing.value = false;
      return;
    } catch {}
  }
  // 模拟OCR识别
  setTimeout(() => {
    items.value = [
      { text: 'experience', translation: '经历；经验', selected: true },
      { text: 'necessary', translation: '必要的；必需的', selected: true },
      { text: 'environment', translation: '环境', selected: true },
      { text: 'entrepreneur', translation: '企业家', selected: true },
      { text: 'The experience of studying abroad is very valuable.', translation: '出国留学的经历非常有价值。', selected: true },
      { text: 'It is necessary to protect the environment.', translation: '保护环境是必要的。', selected: true },
      { text: 'communication', translation: '交流；通讯', selected: true },
      { text: 'technology', translation: '技术', selected: true },
      { text: 'international', translation: '国际的', selected: true },
      { text: 'opportunity', translation: '机会', selected: true },
    ];
    processing.value = false;
  }, 2000);
});

function previewImg() {
  if (imagePath.value) {
    uni.previewImage({ current: 0, urls: [imagePath.value] });
  }
}

function toggleItem(idx: number) {
  items.value[idx].selected = !items.value[idx].selected;
}

function selectAll() {
  items.value.forEach(i => i.selected = true);
}

function deselectAll() {
  items.value.forEach(i => i.selected = false);
}

function addCustom() {
  const t = customText.value.trim();
  if (!t) return;
  items.value.push({ text: t, selected: true });
  customText.value = '';
}

function startPractice() {
  const selected = items.value.filter(i => i.selected).map(i => i.text);
  if (selected.length === 0) {
    uni.showToast({ title: '请至少选择一个内容', icon: 'none' });
    return;
  }
  const words = encodeURIComponent(JSON.stringify(selected));
  uni.navigateTo({ url: `/pages/oral/settings/index?words=${words}` });
}
</script>

<style scoped>
.confirm-page {
  background: #0F1118;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

.image-preview {
  background: #1A1D2E;
  padding: 20rpx;
  display: flex; align-items: center; gap: 16rpx;
  border-bottom: 1rpx solid #2A2E3F;
}
.preview-thumb { width: 120rpx; height: 80rpx; border-radius: 8rpx; background: #242838; }
.preview-hint { font-size: 24rpx; color: #5B7BFF; }

.processing {
  display: flex; flex-direction: column;
  align-items: center; padding-top: 200rpx; gap: 20rpx;
}
.proc-spinner {
  width: 56rpx; height: 56rpx;
  border: 4rpx solid #2A2E3F;
  border-top-color: #5B7BFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.proc-text { font-size: 30rpx; color: #8B92A5; }

.content-area { padding: 24rpx 32rpx; }

.select-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20rpx;
}
.select-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; }
.select-actions { display: flex; gap: 20rpx; }
.sa-btn { font-size: 26rpx; color: #5B7BFF; }

.item-list { margin-bottom: 24rpx; }
.content-item {
  display: flex; align-items: flex-start; gap: 16rpx;
  padding: 24rpx 20rpx;
  background: #1A1D2E;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid #2A2E3F;
}
.ci-check {
  width: 40rpx; height: 40rpx;
  border-radius: 10rpx;
  border: 2rpx solid #4D5466;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 4rpx;
}
.ci-check.checked {
  background: #5B7BFF;
  border-color: #5B7BFF;
}
.ci-tick { font-size: 24rpx; color: #FFF; }
.ci-body { flex: 1; }
.ci-text { font-size: 30rpx; color: #E8ECF4; display: block; line-height: 1.5; }
.ci-trans { font-size: 24rpx; color: #4D5466; display: block; margin-top: 6rpx; }

.add-area {
  display: flex; gap: 16rpx; align-items: center;
}
.add-input {
  flex: 1; background: #242838; border-radius: 12rpx;
  padding: 20rpx; font-size: 28rpx; color: #E8ECF4;
}
.add-btn {
  background: #5B7BFF; color: #FFF;
  padding: 20rpx 32rpx; border-radius: 12rpx;
  font-size: 28rpx; font-weight: 600; flex-shrink: 0;
}

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #1A1D2E;
  padding: 20rpx 32rpx;
  border-top: 1rpx solid #2A2E3F;
}
.start-btn { padding: 28rpx 0; }
</style>
