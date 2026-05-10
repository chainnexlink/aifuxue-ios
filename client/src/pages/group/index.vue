<template>
  <view class="group-page">
    <view class="header">
      <text class="title">小组学习</text>
      <view class="header-actions">
        <view class="btn-small" @tap="createGroup"><text>创建小组</text></view>
        <view class="btn-small outline" @tap="joinGroup"><text>加入小组</text></view>
      </view>
    </view>

    <!-- 我的小组 -->
    <view v-if="groups.length === 0" class="empty-state">
      <view class="empty-icon-wrap">
        <image src="/static/icons/people.svg" class="empty-icon-img" mode="aspectFit" />
      </view>
      <text class="empty-text">还没有加入任何小组</text>
      <text class="empty-hint">创建或加入一个学习小组，和同学一起刷题PK</text>
    </view>

    <view v-for="group in groups" :key="group.id" class="group-card" @tap="goGroupDetail(group)">
      <view class="group-avatar">
        <text class="group-avatar-text">{{ group.name.charAt(0) }}</text>
      </view>
      <view class="group-info">
        <text class="group-name">{{ group.name }}</text>
        <text class="group-meta">{{ group.memberCount }}人 · 邀请码 {{ group.inviteCode }}</text>
      </view>
      <view class="group-arrow"></view>
    </view>

    <!-- 排行榜预览 -->
    <view v-if="groups.length > 0" class="section">
      <text class="section-title">本周PK排行</text>
      <view class="rank-list">
        <view v-for="(member, idx) in leaderboard" :key="idx" class="rank-item">
          <view class="rank-medal" :class="{ gold: idx === 0, silver: idx === 1, bronze: idx === 2 }">
            <text class="rank-num">{{ idx + 1 }}</text>
          </view>
          <text class="rank-name">{{ member.name }}</text>
          <text class="rank-score">{{ member.score }}题</text>
        </view>
      </view>
    </view>

    <view class="back-btn" @tap="goHome">
      <text>返回首页</text>
    </view>

    <!-- 创建小组弹窗 -->
    <view v-if="showCreateModal" class="modal-mask" @tap="showCreateModal = false">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">创建学习小组</text>
        <view class="input-group">
          <text class="input-label">小组名称</text>
          <input v-model="newGroupName" placeholder="给小组取个名字" class="input-field" />
        </view>
        <view class="modal-btn" @tap="confirmCreate">
          <text>创建</text>
        </view>
      </view>
    </view>

    <!-- 加入小组弹窗 -->
    <view v-if="showJoinModal" class="modal-mask" @tap="showJoinModal = false">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">加入小组</text>
        <view class="input-group">
          <text class="input-label">邀请码</text>
          <input v-model="joinCode" placeholder="请输入邀请码" class="input-field" />
        </view>
        <view class="modal-btn" @tap="confirmJoin">
          <text>加入</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const groups = ref([
  { id: '1', name: '高三冲刺小分队', memberCount: 5, inviteCode: 'ABC123' },
]);

const leaderboard = ref([
  { name: '学霸小明', score: 128 },
  { name: '努力的小红', score: 96 },
  { name: '我', score: 72 },
  { name: '小华', score: 45 },
]);

const showCreateModal = ref(false);
const showJoinModal = ref(false);
const newGroupName = ref('');
const joinCode = ref('');

function createGroup() { showCreateModal.value = true; }
function joinGroup() { showJoinModal.value = true; }

function confirmCreate() {
  if (!newGroupName.value.trim()) {
    uni.showToast({ title: '请输入小组名称', icon: 'none' });
    return;
  }
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  groups.value.push({ id: Date.now().toString(), name: newGroupName.value, memberCount: 1, inviteCode: code });
  showCreateModal.value = false;
  newGroupName.value = '';
  uni.showToast({ title: `创建成功，邀请码: ${code}`, icon: 'none' });
}

function confirmJoin() {
  if (!joinCode.value.trim()) {
    uni.showToast({ title: '请输入邀请码', icon: 'none' });
    return;
  }
  showJoinModal.value = false;
  joinCode.value = '';
  uni.showToast({ title: '加入成功', icon: 'success' });
}

function goGroupDetail(group: any) {
  uni.navigateTo({ url: `/pages/group/detail/index?id=${group.id}` });
}

function goHome() { uni.switchTab({ url: '/pages/home/index' }); }
</script>

<style scoped>
.group-page {
  padding: 24rpx 32rpx;
  background: #0F1118;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}
.title {
  font-size: 38rpx;
  font-weight: 700;
  color: #E8ECF4;
}
.header-actions { display: flex; gap: 12rpx; }
.btn-small {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  color: #fff;
  padding: 14rpx 28rpx;
  border-radius: 14rpx;
  font-size: 24rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(91,123,255,0.3);
}
.btn-small.outline {
  background: transparent;
  color: #5B7BFF;
  border: 2rpx solid #5B7BFF;
  box-shadow: none;
}

.empty-state {
  text-align: center;
  padding: 80rpx 0;
  background: #1A1D2E;
  border-radius: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 24rpx;
}
.empty-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  background: rgba(167,139,250,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
}
.empty-icon-img {
  width: 56rpx;
  height: 56rpx;
  opacity: 0.5;
}
.empty-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #E8ECF4;
  display: block;
  margin-bottom: 10rpx;
}
.empty-hint {
  font-size: 26rpx;
  color: #4D5466;
}

.group-card {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  border: 1rpx solid #2A2E3F;
  gap: 20rpx;
}
.group-avatar {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(145deg, #8B5CF6, #A78BFA);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.group-avatar-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFF;
}
.group-info { flex: 1; }
.group-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #E8ECF4;
  display: block;
  margin-bottom: 6rpx;
}
.group-meta {
  font-size: 24rpx;
  color: #4D5466;
}
.group-arrow {
  width: 16rpx;
  height: 16rpx;
  border-right: 3rpx solid #4D5466;
  border-top: 3rpx solid #4D5466;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.section {
  margin-top: 28rpx;
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx;
  border: 1rpx solid #2A2E3F;
}
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 20rpx;
}
.rank-item {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #2A2E3F;
}
.rank-item:last-child { border-bottom: none; }
.rank-medal {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #242838;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.rank-medal.gold { background: rgba(255,186,74,0.2); }
.rank-medal.silver { background: #242838; }
.rank-medal.bronze { background: rgba(255,107,107,0.15); }
.rank-num {
  font-size: 24rpx;
  font-weight: 700;
  color: #4D5466;
}
.rank-medal.gold .rank-num { color: #FFBA4A; }
.rank-medal.silver .rank-num { color: #8B92A5; }
.rank-medal.bronze .rank-num { color: #FF6B6B; }
.rank-name {
  flex: 1;
  font-size: 28rpx;
  color: #E8ECF4;
}
.rank-score {
  font-size: 28rpx;
  color: #5B7BFF;
  font-weight: 600;
}

.back-btn {
  text-align: center;
  padding: 28rpx;
  color: #5B7BFF;
  font-size: 30rpx;
  background: #1A1D2E;
  border-radius: 20rpx;
  margin-top: 28rpx;
  border: 1rpx solid #2A2E3F;
}

/* Modal */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  width: 80%;
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 48rpx 36rpx;
  border: 1rpx solid #2A2E3F;
}
.modal-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 32rpx;
  text-align: center;
}
.input-group { margin-bottom: 32rpx; }
.input-label {
  font-size: 28rpx;
  color: #8B92A5;
  display: block;
  margin-bottom: 12rpx;
}
.input-field {
  background: #242838;
  border-radius: 14rpx;
  padding: 24rpx;
  font-size: 30rpx;
  color: #E8ECF4;
}
.modal-btn {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  color: #FFF;
  text-align: center;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(91,123,255,0.3);
}
</style>
