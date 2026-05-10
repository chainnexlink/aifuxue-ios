<template>
  <view class="detail-page">
    <!-- 小组信息卡 -->
    <view class="group-card">
      <view class="gc-header">
        <view class="gc-avatar">
          <text class="gc-letter">{{ group.name?.charAt(0) }}</text>
        </view>
        <view class="gc-info">
          <text class="gc-name">{{ group.name }}</text>
          <text class="gc-meta">{{ group.memberCount }}人 · 创建于{{ group.createTime }}</text>
        </view>
      </view>
      <text class="gc-desc">{{ group.description }}</text>
      <view class="gc-stats">
        <view class="gs-item">
          <text class="gs-num">{{ group.totalPk }}</text>
          <text class="gs-label">累计PK</text>
        </view>
        <view class="gs-divider"></view>
        <view class="gs-item">
          <text class="gs-num">{{ group.weekActive }}</text>
          <text class="gs-label">本周活跃</text>
        </view>
        <view class="gs-divider"></view>
        <view class="gs-item">
          <text class="gs-num">{{ group.sharedNotes }}</text>
          <text class="gs-label">共享笔记</text>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="action-row">
      <view class="action-btn primary" @tap="startPk">
        <text class="ab-text">发起PK</text>
      </view>
      <view class="action-btn secondary" @tap="shareNote">
        <text class="ab-text">分享笔记</text>
      </view>
    </view>

    <!-- 成员列表 -->
    <view class="section">
      <text class="section-title">成员 ({{ members.length }})</text>
      <view v-for="(m, idx) in members" :key="idx" class="member-item">
        <view class="mi-rank">
          <text class="mi-rank-num" :class="{ top: idx < 3 }">{{ idx + 1 }}</text>
        </view>
        <view class="mi-avatar">
          <text class="mi-letter">{{ m.name.charAt(0) }}</text>
        </view>
        <view class="mi-info">
          <text class="mi-name">{{ m.name }}</text>
          <text class="mi-role" v-if="m.isOwner">组长</text>
        </view>
        <view class="mi-score">
          <text class="mi-score-num">{{ m.weekScore }}分</text>
          <text class="mi-score-label">本周得分</text>
        </view>
      </view>
    </view>

    <!-- PK历史 -->
    <view class="section">
      <text class="section-title">PK记录</text>
      <view v-if="pkHistory.length === 0" class="empty-hint">
        <text class="empty-text">还没有PK记录</text>
      </view>
      <view v-for="pk in pkHistory" :key="pk.id" class="pk-item" @tap="viewPkResult(pk)">
        <view class="pk-left">
          <text class="pk-subject">{{ pk.subject }}</text>
          <text class="pk-time">{{ pk.time }}</text>
        </view>
        <view class="pk-right">
          <text class="pk-result" :class="pk.won ? 'win' : 'lose'">{{ pk.won ? '胜' : '负' }}</text>
          <text class="pk-score">{{ pk.myScore }}/{{ pk.totalScore }}</text>
        </view>
        <view class="pk-arrow"></view>
      </view>
    </view>

    <!-- 共享笔记墙 -->
    <view class="section">
      <text class="section-title">共享笔记墙</text>
      <view v-for="note in sharedNotes" :key="note.id" class="shared-note" @tap="viewSharedNote(note)">
        <view class="sn-info">
          <text class="sn-title">{{ note.title }}</text>
          <text class="sn-meta">{{ note.author }} · {{ note.time }}</text>
        </view>
        <view class="sn-arrow"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const groupId = ref('');
const group = ref<any>({});
const members = ref<any[]>([]);
const pkHistory = ref<any[]>([]);
const sharedNotes = ref<any[]>([]);

onLoad((options) => {
  groupId.value = options?.id || '';
  loadGroupData();
});

function loadGroupData() {
  group.value = {
    name: '高一数学冲刺组',
    description: '一起备战期末考，每日PK刷题！',
    memberCount: 6,
    createTime: '2025-03',
    totalPk: 48,
    weekActive: 5,
    sharedNotes: 12,
  };
  members.value = [
    { name: '张三', weekScore: 920, isOwner: true },
    { name: '李四', weekScore: 880, isOwner: false },
    { name: '王五', weekScore: 810, isOwner: false },
    { name: '赵六', weekScore: 750, isOwner: false },
    { name: '孙七', weekScore: 680, isOwner: false },
    { name: '周八', weekScore: 620, isOwner: false },
  ];
  pkHistory.value = [
    { id: '1', subject: '数学 · 函数与极值', time: '今天', won: true, myScore: 85, totalScore: 100 },
    { id: '2', subject: '数学 · 概率统计', time: '昨天', won: false, myScore: 60, totalScore: 100 },
    { id: '3', subject: '英语 · 语法填空', time: '3天前', won: true, myScore: 90, totalScore: 100 },
  ];
  sharedNotes.value = [
    { id: 'n1', title: '导数求极值方法总结', author: '张三', time: '今天' },
    { id: 'n2', title: '虚拟语气用法速记', author: '李四', time: '昨天' },
  ];
}

function startPk() {
  uni.navigateTo({ url: `/pages/group/pk/index?groupId=${groupId.value}` });
}

function shareNote() {
  uni.switchTab({ url: '/pages/notes/index' });
  uni.showToast({ title: '请选择要分享的笔记', icon: 'none' });
}

function viewPkResult(pk: any) {
  const data = encodeURIComponent(JSON.stringify(pk));
  uni.navigateTo({ url: `/pages/group/pk-result/index?data=${data}&groupId=${groupId.value}` });
}

function viewSharedNote(note: any) {
  uni.navigateTo({ url: `/pages/notes/detail/index?id=${note.id}` });
}
</script>

<style scoped>
.detail-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.group-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.gc-header { display: flex; align-items: center; gap: 20rpx; margin-bottom: 16rpx; }
.gc-avatar {
  width: 80rpx; height: 80rpx; border-radius: 20rpx;
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  display: flex; align-items: center; justify-content: center;
}
.gc-letter { font-size: 36rpx; font-weight: 800; color: #FFF; }
.gc-info { flex: 1; }
.gc-name { font-size: 34rpx; font-weight: 700; color: #E8ECF4; display: block; }
.gc-meta { font-size: 24rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.gc-desc { font-size: 26rpx; color: #8B92A5; margin-bottom: 20rpx; line-height: 1.5; }
.gc-stats { display: flex; align-items: center; justify-content: space-around; background: #242838; border-radius: 16rpx; padding: 20rpx 0; }
.gs-item { text-align: center; }
.gs-num { font-size: 36rpx; font-weight: 800; color: #5B7BFF; display: block; }
.gs-label { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.gs-divider { width: 1rpx; height: 40rpx; background: #2A2E3F; }

.action-row { display: flex; gap: 16rpx; margin-bottom: 24rpx; }
.action-btn { flex: 1; padding: 24rpx 0; border-radius: 16rpx; text-align: center; }
.action-btn.primary { background: linear-gradient(135deg, #3D56C6, #5B7BFF); }
.action-btn.secondary { background: rgba(91,123,255,0.15); }
.action-btn.primary .ab-text { color: #FFF; font-size: 30rpx; font-weight: 600; }
.action-btn.secondary .ab-text { color: #5B7BFF; font-size: 30rpx; font-weight: 600; }

.section {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }
.empty-hint { padding: 40rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: #4D5466; }

.member-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.member-item:last-child { border-bottom: none; }
.mi-rank { width: 40rpx; text-align: center; }
.mi-rank-num { font-size: 26rpx; color: #4D5466; font-weight: 600; }
.mi-rank-num.top { color: #FFBA4A; }
.mi-avatar {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  background: #242838; display: flex; align-items: center; justify-content: center;
}
.mi-letter { font-size: 24rpx; font-weight: 700; color: #8B92A5; }
.mi-info { flex: 1; }
.mi-name { font-size: 28rpx; font-weight: 600; color: #E8ECF4; }
.mi-role { font-size: 20rpx; color: #FFBA4A; background: rgba(255,186,74,0.15); padding: 2rpx 12rpx; border-radius: 6rpx; margin-left: 8rpx; }
.mi-score { text-align: right; }
.mi-score-num { font-size: 28rpx; font-weight: 700; color: #5B7BFF; display: block; }
.mi-score-label { font-size: 20rpx; color: #4D5466; }

.pk-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 18rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.pk-item:last-child { border-bottom: none; }
.pk-left { flex: 1; }
.pk-subject { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; }
.pk-time { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.pk-right { text-align: right; }
.pk-result { font-size: 26rpx; font-weight: 700; display: block; }
.pk-result.win { color: #34D399; }
.pk-result.lose { color: #FF6B6B; }
.pk-score { font-size: 22rpx; color: #4D5466; }
.pk-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.shared-note {
  display: flex; align-items: center; gap: 16rpx;
  padding: 18rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.shared-note:last-child { border-bottom: none; }
.sn-info { flex: 1; }
.sn-title { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; }
.sn-meta { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.sn-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }
</style>
