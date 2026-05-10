<template>
  <view class="page-wrap">
    <!-- 学生端：我的 -->
    <view v-if="!userStore.isTeacherView" class="profile-page">
      <!-- 用户卡片 -->
      <view class="user-card" @tap="goSettings">
        <view class="avatar">
          <text class="avatar-text">{{ avatarChar }}</text>
        </view>
        <view class="user-info">
          <view class="name-row">
            <text class="nickname">{{ userStore.user?.nickname || '未登录' }}</text>
          </view>
          <view class="user-tags">
            <text class="grade-tag">{{ gradeLabel }}</text>
            <text v-if="userStore.isVip" class="vip-tag">VIP会员</text>
            <text v-else class="free-tag">免费版</text>
          </view>
        </view>
      </view>

      <!-- 学习数据 -->
      <view class="stats-card">
        <view class="stats-row">
          <view class="stat-item" @tap="goNotes"><text class="stat-num">{{ stats.noteCount }}</text><text class="stat-label">累计笔记</text></view>
          <view class="stat-sep"></view>
          <view class="stat-item" @tap="goPractice"><text class="stat-num">{{ stats.exerciseCount }}</text><text class="stat-label">练习次数</text></view>
          <view class="stat-sep"></view>
          <view class="stat-item" @tap="goMistakes"><text class="stat-num">{{ stats.mistakeKilled }}</text><text class="stat-label">消灭错题</text></view>
          <view class="stat-sep"></view>
          <view class="stat-item"><text class="stat-num">{{ stats.streakDays }}</text><text class="stat-label">连续天数</text></view>
        </view>
      </view>

      <!-- 成就徽章 -->
      <view class="section-card">
        <text class="section-title">成就徽章</text>
        <view class="badge-grid">
          <view v-for="badge in badges" :key="badge.id" class="badge-item" :class="{ locked: !badge.earned }">
            <view class="badge-icon-wrap" :class="badge.color"><text class="badge-icon-text">{{ badge.icon }}</text></view>
            <text class="badge-name">{{ badge.name }}</text>
            <text class="badge-desc">{{ badge.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 加入班级 -->
      <view class="section-card">
        <text class="section-title">班级</text>
        <view class="menu-list">
          <view class="menu-item" @tap="goJoinClass">
            <text class="mi-icon">🏫</text>
            <text class="mi-label">加入班级</text>
            <text class="mi-hint">输入班级邀请码</text>
            <view class="mi-arrow"></view>
          </view>
          <view class="menu-item" @tap="goClassHomework">
            <text class="mi-icon">📋</text>
            <text class="mi-label">班级作业</text>
            <view v-if="pendingHomework > 0" class="mi-badge"><text>{{ pendingHomework }}</text></view>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- VIP会员 -->
      <view v-if="!userStore.isVip" class="vip-card" @tap="goMembership">
        <view class="vip-card-left">
          <text class="vip-card-icon">👑</text>
          <view class="vip-card-info">
            <text class="vip-card-title">开通VIP会员</text>
            <text class="vip-card-desc">解锁全部功能，无广告畅学</text>
          </view>
        </view>
        <view class="mi-arrow"></view>
      </view>

      <!-- 兑换邀请码 -->
      <view v-if="!userStore.user?.inviteCodeUsed" class="section-card">
        <view class="menu-list">
          <view class="menu-item" @tap="goRedeemCode">
            <text class="mi-icon">🎁</text>
            <text class="mi-label">兑换邀请码</text>
            <text class="mi-hint">获取体验时长</text>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- 家长中心 -->
      <view class="section-card">
        <text class="section-title">家长中心</text>
        <view class="menu-list">
          <view class="menu-item" @tap="goParent">
            <text class="mi-icon">👨‍👩‍👧</text>
            <text class="mi-label">设置密码 / 查看周报</text>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- 数据中心 -->
      <view class="section-card">
        <text class="section-title">数据中心</text>
        <view class="menu-list">
          <view class="menu-item" @tap="goKnowledgeMap">
            <text class="mi-icon">🗺️</text>
            <text class="mi-label">知识图谱</text>
            <view class="mi-arrow"></view>
          </view>
          <view class="menu-item" @tap="exportData">
            <text class="mi-icon">📤</text>
            <text class="mi-label">一键导出所有数据</text>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- 其他 -->
      <view class="section-card">
        <view class="menu-list">
          <view class="menu-item" @tap="goAbout">
            <text class="mi-icon">ℹ️</text>
            <text class="mi-label">了解完整版功能</text>
            <view class="mi-arrow"></view>
          </view>
          <view v-if="userStore.isTeacher" class="menu-item" @tap="toggleView">
            <text class="mi-icon">👀</text>
            <text class="mi-label">切换身份视图</text>
            <text class="mi-hint">切换到教师端</text>
            <view class="mi-arrow"></view>
          </view>
          <view class="menu-item" @tap="goSettings">
            <text class="mi-icon">⚙️</text>
            <text class="mi-label">设置</text>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- 法律信息 -->
      <view class="section-card">
        <text class="section-title">法律信息</text>
        <view class="menu-list">
          <view class="menu-item" @tap="openPrivacy">
            <text class="mi-icon">📜</text>
            <text class="mi-label">隐私政策</text>
            <view class="mi-arrow"></view>
          </view>
          <view class="menu-item" @tap="openAgreement">
            <text class="mi-icon">📋</text>
            <text class="mi-label">用户协议</text>
            <view class="mi-arrow"></view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-btn" @tap="handleLogout"><text>退出登录</text></view>
      <view style="height: 160rpx;"></view>
    </view>

    <!-- 教师端：我的 -->
    <TeacherProfile v-else />

    <CustomTabBar :current="4" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { userApi } from '@/utils/api';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import CustomTabBar from '@/components/CustomTabBar/index.vue';
import TeacherProfile from '@/components/teacher/TeacherProfile.vue';

const userStore = useUserStore();
const stats = ref({ noteCount: 0, exerciseCount: 0, mistakeKilled: 0, streakDays: 0 });
const pendingHomework = ref(0);

const badges = ref<{ id: string; name: string; desc: string; icon: string; color: string; earned: boolean }[]>([
  { id: 'first_note', name: '初来乍到', desc: '完成首次笔记', icon: '📝', color: 'bg-blue', earned: false },
  { id: 'streak_7', name: '打卡7天', desc: '连续使用7天', icon: '7️⃣', color: 'bg-green', earned: false },
  { id: 'mistake_killer', name: '错题杀手', desc: '消灭100道错题', icon: '💀', color: 'bg-red', earned: false },
  { id: 'exam_master', name: '模考达人', desc: '模拟考试3次', icon: '🏆', color: 'bg-purple', earned: false },
  { id: 'streak_30', name: '打卡30天', desc: '连续使用30天', icon: '🔥', color: 'bg-orange', earned: false },
  { id: 'top_scorer', name: '学霸认证', desc: '模考得分90+', icon: '⭐', color: 'bg-gold', earned: false },
]);

const avatarChar = computed(() => (userStore.user?.nickname || '').charAt(0) || '?');
const gradeLabel = computed(() => {
  const map: Record<string, string> = { PRIMARY: '小学', JUNIOR: '初中', SENIOR: '高中', COLLEGE: '大学', ADULT: '成人' };
  return map[userStore.user?.gradeLevel || ''] || '未设置';
});

onShow(() => {
  loadStats();
  loadBadges();
});

async function loadStats() {
  // 测试账户使用本地数据，不请求后端
  if (userStore.token?.startsWith('test-token-')) {
    stats.value = { noteCount: 0, exerciseCount: 0, mistakeKilled: 0, streakDays: 0 };
    return;
  }
  try {
    const res = await userApi.getStats();
    stats.value = res;
  } catch {}
}

async function loadBadges() {
  // 测试账户使用默认徽章数据
  if (userStore.token?.startsWith('test-token-')) return;
  try {
    const res = await userApi.getBadges();
    badges.value = res;
  } catch {}
}

function goJoinClass() { uni.navigateTo({ url: '/pages/class/join/index' }); }
function goClassHomework() { uni.navigateTo({ url: '/pages/class/homework/index' }); }
function goRedeemCode() { uni.navigateTo({ url: '/pages/invite/redeem/index' }); }
function goMembership() { uni.navigateTo({ url: '/pages/membership/index' }); }
function goParent() { uni.navigateTo({ url: '/pages/parent/index' }); }
function goSettings() { uni.navigateTo({ url: '/pages/settings/index' }); }
function goAbout() { uni.navigateTo({ url: '/pages/about/index' }); }
function goNotes() { uni.switchTab({ url: '/pages/notes/index' }); }
function goPractice() { uni.switchTab({ url: '/pages/practice/index' }); }
function goMistakes() { uni.switchTab({ url: '/pages/mistakes/index' }); }
async function goKnowledgeMap() {
  const ok = await tryPlayAd(AD_UNIT_IDS.KNOWLEDGE_MAP, '知识图谱');
  if (ok) uni.navigateTo({ url: '/pages/profile/knowledge-map/index' });
}
async function exportData() {
  const ok = await tryPlayAd(AD_UNIT_IDS.DATA_EXPORT, '数据导出');
  if (ok) uni.navigateTo({ url: '/pages/profile/export/index' });
}
function toggleView() { userStore.toggleViewMode(); }
function handleLogout() {
  uni.showModal({ title: '确认退出', content: '确定要退出登录吗？',
    success: (res) => { if (res.confirm) userStore.logout(); },
  });
}
function openPrivacy() {
  uni.navigateTo({ url: '/pages/legal/privacy' });
}
function openAgreement() {
  uni.navigateTo({ url: '/pages/legal/agreement' });
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; }
.profile-page {
  --c-primary: #5B7BFF; --c-primary-bg: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-card: #1A1D2E; --c-border: #2A2E3F;
  padding: 24rpx 32rpx; padding-top: 88rpx; background: #0F1118; min-height: 100vh; box-sizing: border-box;
}
.user-card { background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 28rpx; padding: 48rpx 36rpx; display: flex; align-items: center; gap: 28rpx; margin-bottom: 20rpx; box-shadow: 0 8rpx 28rpx rgba(91,123,255,0.3); }
.avatar { width: 100rpx; height: 100rpx; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar-text { font-size: 44rpx; color: #FFF; font-weight: 700; }
.name-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 10rpx; }
.nickname { font-size: 36rpx; font-weight: 700; color: #FFF; }
.user-tags { display: flex; gap: 12rpx; }
.grade-tag { font-size: 22rpx; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.2); padding: 4rpx 16rpx; border-radius: 10rpx; }
.free-tag { font-size: 22rpx; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.15); padding: 4rpx 16rpx; border-radius: 10rpx; }

.stats-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx 0; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.stats-row { display: flex; align-items: center; }
.stat-item { flex: 1; text-align: center; }
.stat-num { font-size: 42rpx; font-weight: 800; color: var(--c-primary); display: block; line-height: 1; margin-bottom: 8rpx; }
.stat-label { font-size: 22rpx; color: var(--c-t3); }
.stat-sep { width: 1rpx; height: 52rpx; background: var(--c-border); }

.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.badge-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.badge-item { width: calc(33.33% - 12rpx); text-align: center; padding: 16rpx 0; }
.badge-item.locked { opacity: 0.3; }
.badge-icon-wrap { width: 76rpx; height: 76rpx; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; margin: 0 auto 10rpx; }
.badge-icon-text { font-size: 32rpx; }
.bg-blue { background: var(--c-primary-bg); }
.bg-green { background: rgba(52,211,153,0.15); }
.bg-red { background: rgba(255,107,107,0.15); }
.bg-purple { background: rgba(167,139,250,0.15); }
.bg-orange { background: rgba(255,186,74,0.15); }
.bg-gold { background: rgba(255,215,0,0.15); }
.badge-name { font-size: 24rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 4rpx; }
.badge-desc { font-size: 20rpx; color: var(--c-t3); display: block; }

.menu-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid var(--c-border); }
.menu-item:last-child { border-bottom: none; }
.mi-icon { font-size: 36rpx; margin-right: 16rpx; }
.mi-label { flex: 1; font-size: 30rpx; color: var(--c-t1); }
.mi-hint { font-size: 24rpx; color: var(--c-t3); margin-right: 12rpx; }
.mi-badge { background: #FF6B6B; min-width: 36rpx; height: 36rpx; border-radius: 18rpx; display: flex; align-items: center; justify-content: center; padding: 0 8rpx; margin-right: 12rpx; }
.mi-badge text { font-size: 20rpx; color: #FFF; font-weight: 800; }
.mi-arrow { width: 14rpx; height: 14rpx; border-right: 2.5rpx solid var(--c-t3); border-top: 2.5rpx solid var(--c-t3); transform: rotate(45deg); flex-shrink: 0; }

.logout-btn { text-align: center; padding: 30rpx; color: #FF6B6B; font-size: 30rpx; background: var(--c-card); border-radius: 24rpx; margin-top: 20rpx; border: 1rpx solid var(--c-border); }

.vip-tag { font-size: 22rpx; color: #FFD700; background: rgba(255,215,0,0.15); padding: 4rpx 16rpx; border-radius: 10rpx; font-weight: 600; }
.vip-card { background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.08)); border: 1rpx solid rgba(255,215,0,0.3); border-radius: 24rpx; padding: 28rpx 24rpx; margin-bottom: 20rpx; display: flex; align-items: center; justify-content: space-between; }
.vip-card-left { display: flex; align-items: center; gap: 16rpx; }
.vip-card-icon { font-size: 40rpx; }
.vip-card-info { display: flex; flex-direction: column; gap: 4rpx; }
.vip-card-title { font-size: 30rpx; font-weight: 700; color: #FFD700; }
.vip-card-desc { font-size: 24rpx; color: var(--c-t3); }

/* iPad适配 */
@media screen and (min-width: 768px) {
  .profile-page {
    padding: 24px 24px;
    padding-top: 60px;
  }
  .user-card { border-radius: 16px; padding: 28px 24px; gap: 18px; }
  .avatar { width: 56px; height: 56px; }
  .avatar-text { font-size: 26px; }
  .nickname { font-size: 20px; }
  .grade-tag, .free-tag { font-size: 12px; padding: 3px 10px; }
  .stats-card { border-radius: 14px; padding: 20px 0; }
  .stat-num { font-size: 24px; }
  .stat-label { font-size: 12px; }
  .section-card { border-radius: 14px; padding: 18px 16px; }
  .section-title { font-size: 16px; }
  .badge-icon-wrap { width: 44px; height: 44px; border-radius: 12px; }
  .badge-icon-text { font-size: 20px; }
  .badge-name { font-size: 13px; }
  .badge-desc { font-size: 11px; }
  .menu-item { padding: 14px 0; }
  .mi-icon { font-size: 20px; }
  .mi-label { font-size: 16px; }
  .mi-hint { font-size: 13px; }
  .logout-btn { padding: 16px; font-size: 16px; border-radius: 14px; }
}
</style>
