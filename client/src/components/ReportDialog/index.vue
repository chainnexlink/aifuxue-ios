<template>
  <view v-if="visible" class="report-mask" @tap="close">
    <view class="report-panel" @tap.stop>
      <text class="panel-title">举报内容</text>
      <text class="panel-desc">请选择举报原因，我们会尽快处理</text>

      <view class="reason-list">
        <view
          v-for="item in reasons"
          :key="item"
          class="reason-item"
          :class="{ active: selected === item }"
          @tap="selected = item"
        >
          <view class="radio" :class="{ checked: selected === item }"></view>
          <text class="reason-text">{{ item }}</text>
        </view>
      </view>

      <view class="btn-row">
        <view class="btn cancel-btn" @tap="close"><text>取消</text></view>
        <view class="btn submit-btn" @tap="handleSubmit"><text>提交举报</text></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  visible: boolean;
  targetId?: string;
  targetType?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submitted'): void;
}>();

const reasons = [
  '色情低俗内容',
  '暴力违法内容',
  '广告垃圾信息',
  '侵犯知识产权',
  '人身攻击/骚扰',
  '虚假不实信息',
  '其他违规内容',
];

const selected = ref('');

function close() {
  selected.value = '';
  emit('close');
}

function handleSubmit() {
  if (!selected.value) {
    uni.showToast({ title: '请选择举报原因', icon: 'none' });
    return;
  }
  // 提交举报（存储到本地，后续接入后端API）
  const report = {
    targetId: props.targetId || '',
    targetType: props.targetType || '',
    reason: selected.value,
    time: new Date().toISOString(),
  };
  const reports = JSON.parse(uni.getStorageSync('user_reports') || '[]');
  reports.push(report);
  uni.setStorageSync('user_reports', JSON.stringify(reports));

  uni.showToast({ title: '举报已提交，感谢您的反馈', icon: 'none', duration: 2000 });
  selected.value = '';
  emit('submitted');
  emit('close');
}
</script>

<style scoped>
.report-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: flex-end; justify-content: center; }
.report-panel { width: 100%; background: #1A1D2E; border-radius: 32rpx 32rpx 0 0; padding: 48rpx 40rpx; padding-bottom: 80rpx; }
.panel-title { font-size: 34rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 8rpx; }
.panel-desc { font-size: 24rpx; color: #4D5466; display: block; margin-bottom: 32rpx; }
.reason-list { margin-bottom: 40rpx; }
.reason-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.reason-item:last-child { border-bottom: none; }
.radio { width: 36rpx; height: 36rpx; border-radius: 50%; border: 3rpx solid #4D5466; margin-right: 20rpx; flex-shrink: 0; }
.radio.checked { border-color: #5B7BFF; background: #5B7BFF; }
.reason-text { font-size: 28rpx; color: #C8CDD8; }
.reason-item.active .reason-text { color: #E8ECF4; }
.btn-row { display: flex; gap: 24rpx; }
.btn { flex: 1; padding: 28rpx 0; border-radius: 16rpx; text-align: center; font-size: 30rpx; font-weight: 600; }
.cancel-btn { background: #242838; color: #8B92A5; }
.submit-btn { background: #5B7BFF; color: #FFF; }
</style>
