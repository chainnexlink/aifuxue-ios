<template>
  <view class="custom-tab-bar safe-bottom">
    <view
      v-for="(tab, idx) in currentTabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: currentIndex === idx }"
      @tap="switchTab(idx)"
    >
      <view class="tab-icon">
        <text class="tab-icon-text">{{ currentIndex === idx ? tab.activeIcon : tab.icon }}</text>
      </view>
      <text class="tab-label">{{ tab.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const props = defineProps<{ current: number }>();
const userStore = useUserStore();

const studentTabs = [
  { path: '/pages/home/index', text: '首页', icon: '🏠', activeIcon: '🏠' },
  { path: '/pages/notes/index', text: '笔记', icon: '📒', activeIcon: '📒' },
  { path: '/pages/practice/index', text: '练习', icon: '✏️', activeIcon: '✏️' },
  { path: '/pages/mistakes/index', text: '错题本', icon: '📕', activeIcon: '📕' },
  { path: '/pages/profile/index', text: '我的', icon: '👤', activeIcon: '👤' },
];

const teacherTabs = [
  { path: '/pages/home/index', text: '教学', icon: '📊', activeIcon: '📊' },
  { path: '/pages/notes/index', text: '班级', icon: '🏫', activeIcon: '🏫' },
  { path: '/pages/practice/index', text: '作业', icon: '📋', activeIcon: '📋' },
  { path: '/pages/mistakes/index', text: '错题本', icon: '📕', activeIcon: '📕' },
  { path: '/pages/profile/index', text: '我的', icon: '👤', activeIcon: '👤' },
];

const currentTabs = computed(() => {
  return userStore.isTeacherView ? teacherTabs : studentTabs;
});

const currentIndex = computed(() => props.current);

function switchTab(idx: number) {
  if (idx === currentIndex.value) return;
  const tab = currentTabs.value[idx];
  uni.switchTab({ url: tab.path });
}
</script>

<style scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #141722;
  border-top: 1rpx solid #2A2E3F;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: 8rpx 0;
}

.tab-icon-text {
  font-size: 40rpx;
  line-height: 1;
}

.tab-label {
  font-size: 20rpx;
  color: #4D5466;
  font-weight: 500;
}

.tab-item.active .tab-label {
  color: #5B7BFF;
  font-weight: 600;
}
</style>
