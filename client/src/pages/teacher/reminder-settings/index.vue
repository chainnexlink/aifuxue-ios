<template>
  <view class="page">
    <view class="form-card">
      <text class="form-title">默认提醒规则</text>
      <text class="form-desc">设置后将应用于所有新发布的作业</text>

      <view class="form-group">
        <text class="form-label">截止前提醒</text>
        <view class="chip-row">
          <view v-for="h in beforeOptions" :key="h" class="chip" :class="{ active: form.beforeHours.includes(h) }" @tap="toggleBefore(h)">
            <text>提前{{ h }}小时</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">截止时提醒</text>
        <view class="switch-row">
          <text class="switch-label">截止时间到时推送</text>
          <switch :checked="form.onDeadline" @change="form.onDeadline = ($event as any).detail.value" color="#5B7BFF" />
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">截止后持续提醒</text>
        <view class="switch-row">
          <text class="switch-label">开启截止后提醒</text>
          <switch :checked="form.afterEnabled" @change="form.afterEnabled = ($event as any).detail.value" color="#5B7BFF" />
        </view>
        <view v-if="form.afterEnabled" style="margin-top:16rpx;">
          <view class="chip-row" style="margin-bottom:12rpx;">
            <view v-for="interval in afterIntervals" :key="interval" class="chip" :class="{ active: form.afterInterval === interval }" @tap="form.afterInterval = interval">
              <text>每{{ interval }}小时</text>
            </view>
          </view>
          <view class="sub-setting">
            <text class="sub-label">最多提醒次数</text>
            <view class="stepper-row">
              <view class="stepper-btn" @tap="form.afterMaxCount = Math.max(1, form.afterMaxCount - 1)"><text>-</text></view>
              <text class="stepper-val">{{ form.afterMaxCount }}次</text>
              <view class="stepper-btn" @tap="form.afterMaxCount = Math.min(5, form.afterMaxCount + 1)"><text>+</text></view>
            </view>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">推送内容预览</text>
        <view class="preview-card">
          <text class="preview-icon">📚</text>
          <text class="preview-text">《XX作业》还有2小时截止，请尽快完成！</text>
        </view>
      </view>
    </view>

    <view class="submit-btn" @tap="handleSave">
      <text class="submit-text">保存默认规则</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const beforeOptions = [1, 2, 3, 6]
const afterIntervals = [12, 24, 48]

const form = ref({
  beforeHours: [2] as number[],
  onDeadline: true,
  afterEnabled: true,
  afterInterval: 24,
  afterMaxCount: 3,
})

function toggleBefore(h: number) {
  const idx = form.value.beforeHours.indexOf(h)
  if (idx >= 0) form.value.beforeHours.splice(idx, 1)
  else form.value.beforeHours.push(h)
}

function handleSave() {
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.form-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 28rpx; }
.form-group { margin-bottom: 28rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; font-weight: 600; }
.chip-row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }
.switch-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; }
.switch-label { font-size: 28rpx; color: var(--c-t1); }
.sub-setting { display: flex; justify-content: space-between; align-items: center; }
.sub-label { font-size: 26rpx; color: var(--c-t2); }
.stepper-row { display: flex; align-items: center; gap: 16rpx; }
.stepper-btn { width: 56rpx; height: 56rpx; border-radius: 14rpx; background: #242838; border: 1rpx solid var(--c-border); display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: var(--c-t1); }
.stepper-val { font-size: 28rpx; font-weight: 700; color: var(--c-primary); min-width: 60rpx; text-align: center; }
.preview-card { background: #242838; border-radius: 14rpx; padding: 24rpx; display: flex; align-items: center; gap: 16rpx; }
.preview-icon { font-size: 36rpx; }
.preview-text { font-size: 26rpx; color: var(--c-t1); flex: 1; line-height: 1.5; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; }
.submit-text { font-size: 32rpx; font-weight: 700; color: #FFF; }
</style>
