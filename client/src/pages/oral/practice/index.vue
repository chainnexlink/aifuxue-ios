<template>
  <view class="practice-page">
    <!-- 顶部进度 -->
    <view class="progress-bar">
      <view class="pb-fill" :style="{ width: progressPercent + '%' }"></view>
    </view>
    <view class="progress-info">
      <text class="pi-text">第 {{ currentIndex + 1 }} 个 / 共 {{ words.length }} 个</text>
      <text class="pi-mode">{{ mode === 'single' ? '逐词模式' : '连续模式' }}</text>
    </view>

    <!-- 中央大字区 -->
    <view class="word-area">
      <text class="word-text">{{ currentWord }}</text>
      <text class="word-phonetic">{{ currentPhonetic }}</text>
      <text class="word-meaning">{{ currentMeaning }}</text>
    </view>

    <!-- 播放 AI 朗读 -->
    <view class="play-section">
      <view class="play-btn" :class="{ playing: isPlaying }" @tap="playAudio">
        <image src="/static/icons/speaker-white.svg" class="play-icon" mode="aspectFit" />
      </view>
      <text class="play-hint">{{ isPlaying ? '正在播放...' : '点击听AI朗读' }}</text>
      <view class="accent-tag">
        <text class="at-text">{{ accent === 'us' ? '美式' : '英式' }} {{ speed === 'slow' ? '· 慢速' : '' }}</text>
      </view>
    </view>

    <!-- 录音区 -->
    <view class="record-section">
      <view
        class="record-btn"
        :class="{ recording: isRecording, disabled: !hasPlayed }"
        @touchstart.prevent="startRecord"
        @touchend.prevent="stopRecord"
        @tap="tapRecord"
      >
        <image src="/static/icons/mic.svg" class="rec-icon" mode="aspectFit" v-if="!isRecording" />
        <view class="rec-wave" v-else>
          <view v-for="i in 5" :key="i" class="wave-bar" :class="'wb-' + i"></view>
        </view>
      </view>
      <text class="record-hint" v-if="!hasPlayed">请先听一遍AI朗读</text>
      <text class="record-hint" v-else-if="isRecording">松开结束录音</text>
      <text class="record-hint" v-else-if="hasRecorded">录音完成</text>
      <text class="record-hint" v-else>按住录音</text>
      <text class="record-duration" v-if="isRecording">{{ recordDuration }}s</text>
    </view>

    <!-- 跳过 -->
    <view class="bottom-actions">
      <view class="skip-btn" @tap="skipWord" v-if="!isRecording">
        <text class="skip-text">跳过</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const words = ref<string[]>([]);
const accent = ref('us');
const speed = ref('normal');
const mode = ref('single');
const currentIndex = ref(0);

const isPlaying = ref(false);
const hasPlayed = ref(false);
const isRecording = ref(false);
const hasRecorded = ref(false);
const recordDuration = ref(0);

let recordTimer: ReturnType<typeof setInterval> | null = null;

const currentWord = computed(() => words.value[currentIndex.value] || '');
const currentPhonetic = computed(() => {
  // 音标数据将从后端 AI 服务获取
  return `/${currentWord.value}/`;
});
const currentMeaning = computed(() => {
  return '';
});
const progressPercent = computed(() => {
  if (words.value.length === 0) return 0;
  return ((currentIndex.value + 1) / words.value.length) * 100;
});

onLoad((options) => {
  if (options?.words) {
    try {
      words.value = JSON.parse(decodeURIComponent(options.words));
    } catch {}
  }
  if (options?.accent) accent.value = options.accent;
  if (options?.speed) speed.value = options.speed;
  if (options?.mode) mode.value = options.mode;
});

function playAudio() {
  if (isPlaying.value || isRecording.value) return;
  isPlaying.value = true;
  // 模拟 AI 朗读播放
  const duration = speed.value === 'slow' ? 2500 : 1500;
  setTimeout(() => {
    isPlaying.value = false;
    hasPlayed.value = true;
  }, duration);
}

function tapRecord() {
  // 非触屏设备的fallback
  if (!hasPlayed.value) {
    uni.showToast({ title: '请先听一遍AI朗读', icon: 'none' });
    return;
  }
  if (!isRecording.value) {
    doStartRecord();
  } else {
    doStopRecord();
  }
}

function startRecord() {
  if (!hasPlayed.value) {
    uni.showToast({ title: '请先听一遍AI朗读', icon: 'none' });
    return;
  }
  doStartRecord();
}

function stopRecord() {
  if (!isRecording.value) return;
  doStopRecord();
}

function doStartRecord() {
  if (isRecording.value) return;
  isRecording.value = true;
  hasRecorded.value = false;
  recordDuration.value = 0;
  recordTimer = setInterval(() => {
    recordDuration.value = Math.round((recordDuration.value + 0.1) * 10) / 10;
  }, 100);
}

function doStopRecord() {
  isRecording.value = false;
  hasRecorded.value = true;
  if (recordTimer) {
    clearInterval(recordTimer);
    recordTimer = null;
  }
  // 录音完成，短暂提示后自动下一个
  setTimeout(() => {
    goNext();
  }, 800);
}

function skipWord() {
  goNext();
}

function goNext() {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++;
    hasPlayed.value = false;
    hasRecorded.value = false;
    isPlaying.value = false;
    isRecording.value = false;
    recordDuration.value = 0;
  } else {
    // 全部完成
    uni.showToast({ title: '练习完成！', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
}
</script>

<style scoped>
.practice-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 0 32rpx 60rpx;
  display: flex;
  flex-direction: column;
}

/* Progress */
.progress-bar {
  height: 6rpx;
  background: #2A2E3F;
  border-radius: 3rpx;
  margin-top: 20rpx;
  overflow: hidden;
}
.pb-fill {
  height: 100%;
  background: linear-gradient(90deg, #3D56C6, #5B7BFF);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12rpx 0 40rpx;
}
.pi-text { font-size: 24rpx; color: #8B92A5; }
.pi-mode { font-size: 22rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 4rpx 16rpx; border-radius: 8rpx; }

/* Word Area */
.word-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}
.word-text {
  font-size: 72rpx;
  font-weight: 800;
  color: #E8ECF4;
  text-align: center;
  margin-bottom: 16rpx;
  letter-spacing: 2rpx;
}
.word-phonetic {
  font-size: 30rpx;
  color: #8B92A5;
  margin-bottom: 12rpx;
}
.word-meaning {
  font-size: 26rpx;
  color: #4D5466;
}

/* Play Section */
.play-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}
.play-btn {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.35);
  transition: transform 0.2s;
}
.play-btn.playing {
  transform: scale(1.1);
  animation: pulse 1s infinite;
}
.play-icon {
  width: 44rpx;
  height: 44rpx;
}
.play-hint {
  font-size: 24rpx;
  color: #8B92A5;
  margin-bottom: 8rpx;
}
.accent-tag {
  background: rgba(91,123,255,0.1);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}
.at-text { font-size: 22rpx; color: #5B7BFF; }

/* Record Section */
.record-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}
.record-btn {
  width: 120rpx;
  height: 120rpx;
  background: #1A1D2E;
  border: 4rpx solid #2A2E3F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  transition: all 0.2s;
}
.record-btn.disabled {
  opacity: 0.3;
}
.record-btn.recording {
  background: rgba(255,107,107,0.15);
  border-color: #FF6B6B;
  transform: scale(1.1);
  animation: recordPulse 1.5s infinite;
}
.rec-icon {
  width: 48rpx;
  height: 48rpx;
}

/* Wave Animation */
.rec-wave {
  display: flex;
  align-items: center;
  gap: 6rpx;
  height: 48rpx;
}
.wave-bar {
  width: 6rpx;
  border-radius: 3rpx;
  background: #FF6B6B;
  animation: waveAnim 0.8s ease-in-out infinite;
}
.wb-1 { height: 16rpx; animation-delay: 0s; }
.wb-2 { height: 32rpx; animation-delay: 0.15s; }
.wb-3 { height: 48rpx; animation-delay: 0.3s; }
.wb-4 { height: 32rpx; animation-delay: 0.45s; }
.wb-5 { height: 16rpx; animation-delay: 0.6s; }

.record-hint {
  font-size: 26rpx;
  color: #8B92A5;
}
.record-duration {
  font-size: 36rpx;
  font-weight: 700;
  color: #FF6B6B;
  margin-top: 8rpx;
}

/* Bottom Actions */
.bottom-actions {
  display: flex;
  justify-content: center;
  padding-bottom: 40rpx;
}
.skip-btn {
  padding: 16rpx 48rpx;
  background: rgba(77,84,102,0.2);
  border-radius: 12rpx;
}
.skip-text {
  font-size: 26rpx;
  color: #4D5466;
}

/* Animations */
@keyframes pulse {
  0%, 100% { box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.35); }
  50% { box-shadow: 0 8rpx 40rpx rgba(91,123,255,0.6); }
}
@keyframes recordPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.3); }
  50% { box-shadow: 0 0 0 20rpx rgba(255,107,107,0); }
}
@keyframes waveAnim {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
</style>
