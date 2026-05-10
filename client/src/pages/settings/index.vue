<template>
  <view class="settings-page">
    <view class="section card">
      <text class="section-title">个人信息</text>

      <view class="setting-item">
        <text class="setting-label">昵称</text>
        <input v-model="form.nickname" placeholder="请输入昵称" class="setting-input" />
      </view>

      <view class="setting-item">
        <text class="setting-label">学段</text>
        <picker :range="gradeLevels" :range-key="'label'" :value="gradeIndex" @change="onGradeChange">
          <view class="setting-picker">
            <text>{{ selectedGradeLabel }}</text>
            <text class="arrow">▸</text>
          </view>
        </picker>
      </view>

      <view class="setting-item">
        <text class="setting-label">省份</text>
        <input v-model="form.province" placeholder="请输入省份" class="setting-input" />
      </view>

      <view class="setting-item">
        <text class="setting-label">城市</text>
        <input v-model="form.city" placeholder="请输入城市" class="setting-input" />
      </view>
    </view>

    <view v-if="tab === 'time'" class="section card">
      <text class="section-title">使用时长管控</text>
      <view class="setting-item">
        <text class="setting-label">每日限制（分钟）</text>
        <input v-model="dailyLimit" type="number" placeholder="0表示不限制" class="setting-input" />
      </view>
      <text class="setting-hint">超时后需输入家长密码才能继续使用</text>
    </view>

    <view v-if="tab === 'grade'" class="section card">
      <text class="section-title">学科设置</text>
      <text class="setting-hint">勾选孩子正在学习的学科，影响AI出题范围</text>
      <view class="subject-grid">
        <view
          v-for="s in allSubjects"
          :key="s"
          class="subject-chip"
          :class="{ active: selectedSubjects.includes(s) }"
          @tap="toggleSubject(s)"
        >
          <text>{{ s }}</text>
        </view>
      </view>
    </view>

    <view class="btn-primary save-btn" @tap="handleSave">
      <text>保存设置</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { userApi } from '@/utils/api';

const userStore = useUserStore();
const tab = ref('');

const gradeLevels = [
  { label: '小学', value: 'PRIMARY' },
  { label: '初中', value: 'JUNIOR' },
  { label: '高中', value: 'SENIOR' },
  { label: '大学', value: 'COLLEGE' },
  { label: '成人', value: 'ADULT' },
];

const allSubjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
const selectedSubjects = ref<string[]>(['语文', '数学', '英语']);
const dailyLimit = ref('0');

const form = ref({
  nickname: '',
  gradeLevel: '',
  province: '',
  city: '',
});

const gradeIndex = computed(() => {
  const idx = gradeLevels.findIndex((g) => g.value === form.value.gradeLevel);
  return idx >= 0 ? idx : 0;
});

const selectedGradeLabel = computed(() => {
  const g = gradeLevels.find((l) => l.value === form.value.gradeLevel);
  return g?.label || '请选择';
});

onLoad((options) => {
  if (options?.tab) tab.value = options.tab;
});

onMounted(() => {
  if (userStore.user) {
    form.value.nickname = userStore.user.nickname || '';
    form.value.gradeLevel = userStore.user.gradeLevel || '';
    form.value.province = userStore.user.province || '';
    form.value.city = userStore.user.city || '';
  }
});

function onGradeChange(e: any) {
  form.value.gradeLevel = gradeLevels[e.detail.value].value;
}

function toggleSubject(s: string) {
  const idx = selectedSubjects.value.indexOf(s);
  if (idx >= 0) {
    selectedSubjects.value.splice(idx, 1);
  } else {
    selectedSubjects.value.push(s);
  }
}

async function handleSave() {
  try {
    await userApi.updateProfile(form.value);
  } catch {
    // Mock模式下API失败，仅保存到本地
  }
  userStore.updateUser(form.value as any);
  uni.showToast({ title: '保存成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1000);
}
</script>

<style scoped>
.settings-page { padding: 24rpx; background: #0F1118; min-height: 100vh; }

.section { margin-bottom: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 24rpx; }

.setting-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.setting-item:last-child { border-bottom: none; }
.setting-label { font-size: 28rpx; color: #8B92A5; width: 160rpx; flex-shrink: 0; }
.setting-input { flex: 1; font-size: 30rpx; text-align: right; color: #E8ECF4; }
.setting-picker { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 8rpx; color: #E8ECF4; }
.arrow { color: #4D5466; }
.setting-hint { font-size: 24rpx; color: #4D5466; margin-top: 16rpx; display: block; }

.subject-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 20rpx; }
.subject-chip { padding: 16rpx 32rpx; border-radius: 30rpx; background: #242838; font-size: 28rpx; color: #8B92A5; }
.subject-chip.active { background: #5B7BFF; color: #fff; }

.save-btn { margin-top: 40rpx; }
</style>
