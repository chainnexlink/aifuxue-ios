<template>
  <scroll-view scroll-y class="page">
    <!-- 选择班级 -->
    <view class="form-card">
      <text class="form-title">发布作业</text>
      <view class="form-group">
        <text class="form-label">选择班级</text>
        <view class="class-select">
          <view v-for="cls in classes" :key="cls.id" class="class-chip" :class="{ active: selectedClasses.includes(cls.id) }" @tap="toggleClass(cls.id)">
            <text>{{ cls.name }}</text>
          </view>
        </view>
      </view>

      <!-- 作业类型 -->
      <view class="form-group">
        <text class="form-label">作业类型</text>
        <view class="type-selector">
          <view class="type-card" :class="{ active: form.type === 'online' }" @tap="form.type = 'online'">
            <text class="type-emoji">📝</text>
            <text class="type-name">线上作业</text>
            <text class="type-desc">AI识别题目，在线作答</text>
          </view>
          <view class="type-card" :class="{ active: form.type === 'offline' }" @tap="form.type = 'offline'">
            <text class="type-emoji">📎</text>
            <text class="type-name">线下作业</text>
            <text class="type-desc">学生拍照/录音提交</text>
          </view>
        </view>
      </view>

      <!-- 作业名称 -->
      <view class="form-group">
        <text class="form-label">作业名称</text>
        <input class="form-input" :value="form.name" @input="form.name = ($event as any).detail.value" placeholder="如：第三章导数练习" placeholder-style="color: #4D5466;" :adjust-position="true" />
      </view>

      <!-- 线上作业：上传题目 -->
      <view v-if="form.type === 'online'" class="form-group">
        <text class="form-label">题目内容</text>
        <view class="upload-area" @tap="uploadQuestions">
          <text class="upload-emoji">📷</text>
          <text class="upload-text">拍照/上传题目</text>
          <text class="upload-hint">AI自动识别题目</text>
        </view>
      </view>

      <!-- 线下作业：提交要求 -->
      <view v-if="form.type === 'offline'" class="form-group">
        <text class="form-label">提交要求</text>
        <view class="require-list">
          <view v-for="r in submitRequirements" :key="r.value" class="require-chip" :class="{ active: form.requirements.includes(r.value) }" @tap="toggleRequire(r.value)">
            <text>{{ r.label }}</text>
          </view>
        </view>
      </view>

      <!-- 截止时间 -->
      <view class="form-group">
        <text class="form-label">截止时间</text>
        <picker mode="date" @change="form.deadline = $event.detail.value">
          <view class="form-picker">
            <text :class="{ placeholder: !form.deadline }">{{ form.deadline || '请选择截止日期' }}</text>
            <text class="picker-arrow">▾</text>
          </view>
        </picker>
      </view>

      <!-- 催交提醒 -->
      <view class="form-group">
        <text class="form-label">催交提醒</text>
        <view class="remind-section">
          <view class="remind-row">
            <text class="remind-label">截止前提醒</text>
            <view class="remind-chips">
              <view v-for="h in beforeDeadlineOptions" :key="h" class="remind-chip" :class="{ active: form.remindBefore.includes(h) }" @tap="toggleRemindBefore(h)">
                <text>{{ h }}小时</text>
              </view>
            </view>
          </view>
          <view class="remind-row">
            <text class="remind-label">截止时提醒</text>
            <switch :checked="form.remindOnDeadline" @change="form.remindOnDeadline = ($event as any).detail.value" color="#5B7BFF" style="transform: scale(0.8);" />
          </view>
          <view class="remind-row">
            <text class="remind-label">超时催交</text>
            <switch :checked="form.remindAfter" @change="form.remindAfter = ($event as any).detail.value" color="#5B7BFF" style="transform: scale(0.8);" />
          </view>
        </view>
        <view class="remind-link" @tap="goReminderSettings">
          <text class="remind-link-text">修改默认提醒规则 ▸</text>
        </view>
      </view>
    </view>

    <view class="submit-btn" @tap="handlePublish">
      <text class="submit-text">发布作业</text>
    </view>
    <view style="height: 60rpx;"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const classes = ref([
  { id: '1', name: '高一2班数学' },
  { id: '2', name: '高一1班数学' },
]);
const selectedClasses = ref<string[]>([]);
const submitRequirements = [
  { label: '拍照提交', value: 'photo' },
  { label: '录音提交', value: 'audio' },
  { label: '家长签字', value: 'sign' },
];
const form = ref({
  type: 'online' as 'online' | 'offline',
  name: '',
  deadline: '',
  requirements: [] as string[],
  remindBefore: [2] as number[],
  remindOnDeadline: true,
  remindAfter: false,
});

const beforeDeadlineOptions = [1, 2, 3, 6];

function toggleClass(id: string) {
  const idx = selectedClasses.value.indexOf(id);
  if (idx >= 0) selectedClasses.value.splice(idx, 1);
  else selectedClasses.value.push(id);
}

function toggleRequire(val: string) {
  const idx = form.value.requirements.indexOf(val);
  if (idx >= 0) form.value.requirements.splice(idx, 1);
  else form.value.requirements.push(val);
}

function uploadQuestions() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: () => { uni.showToast({ title: 'AI识别中...', icon: 'loading', duration: 2000 }); },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: () => { uni.showToast({ title: 'AI识别中...', icon: 'loading', duration: 2000 }); },
    fail: (err: any) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
}

function toggleRemindBefore(h: number) {
  const idx = form.value.remindBefore.indexOf(h);
  if (idx >= 0) form.value.remindBefore.splice(idx, 1);
  else form.value.remindBefore.push(h);
}

function goReminderSettings() {
  uni.navigateTo({ url: '/pages/teacher/reminder-settings/index' });
}

function handlePublish() {
  if (selectedClasses.value.length === 0) { uni.showToast({ title: '请选择班级', icon: 'none' }); return; }
  if (!form.value.name) { uni.showToast({ title: '请填写作业名称', icon: 'none' }); return; }
  uni.showModal({ title: '发布成功', content: '作业已发布给选中班级的学生', showCancel: false, success: () => uni.navigateBack() });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); height: 100vh; box-sizing: border-box; }
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 28rpx; }
.form-group { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.form-input { background: #242838; border-radius: 14rpx; padding: 0 24rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; color: var(--c-t1); width: 100%; box-sizing: border-box; border: 2rpx solid var(--c-border); }
.form-picker { background: #242838; border-radius: 14rpx; padding: 24rpx; display: flex; justify-content: space-between; font-size: 28rpx; color: var(--c-t1); }
.placeholder { color: var(--c-t3); }
.picker-arrow { color: var(--c-t3); }

.class-select { display: flex; flex-wrap: wrap; gap: 12rpx; }
.class-chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.class-chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }

.type-selector { display: flex; gap: 16rpx; }
.type-card { flex: 1; padding: 24rpx; border-radius: 16rpx; background: #242838; border: 2rpx solid var(--c-border); text-align: center; }
.type-card.active { border-color: var(--c-primary); background: rgba(91,123,255,0.1); }
.type-emoji { font-size: 40rpx; display: block; margin-bottom: 8rpx; }
.type-name { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.type-desc { font-size: 22rpx; color: var(--c-t3); }

.upload-area { background: #242838; border: 2rpx dashed var(--c-border); border-radius: 16rpx; padding: 40rpx; text-align: center; }
.upload-emoji { font-size: 48rpx; display: block; margin-bottom: 12rpx; }
.upload-text { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.upload-hint { font-size: 24rpx; color: var(--c-t3); }

.require-list { display: flex; flex-wrap: wrap; gap: 12rpx; }
.require-chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.require-chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); }

.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; }
.submit-text { font-size: 32rpx; font-weight: 700; color: #FFF; }

.remind-section { background: #242838; border-radius: 14rpx; padding: 20rpx 24rpx; }
.remind-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; border-bottom: 1rpx solid var(--c-border); }
.remind-row:last-child { border-bottom: none; }
.remind-label { font-size: 26rpx; color: var(--c-t1); }
.remind-chips { display: flex; gap: 12rpx; }
.remind-chip { padding: 8rpx 20rpx; border-radius: 12rpx; background: #1A1D2E; border: 2rpx solid var(--c-border); font-size: 22rpx; color: var(--c-t3); }
.remind-chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); }
.remind-link { margin-top: 12rpx; }
.remind-link-text { font-size: 24rpx; color: var(--c-primary); }
</style>
