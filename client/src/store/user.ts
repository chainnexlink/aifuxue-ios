import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'student' | 'parent' | 'teacher';

interface UserInfo {
  id: string;
  phone: string;
  nickname: string;
  gradeLevel: string;
  province: string;
  city: string;
  membershipType: 'FREE' | 'VIP';
  vipExpireAt?: string;
  avatar?: string;
  role: UserRole;
  /** teacher only */
  teacherName?: string;
  school?: string;
  subject?: string;
  teacherVerified?: boolean;
  /** invite code redeemed */
  inviteCodeUsed?: boolean;
  /** classes joined (student) */
  classIds?: string[];
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const user = ref<UserInfo | null>(null);
  /** teacher can temporarily preview student view */
  const viewMode = ref<'default' | 'student-preview'>('default');

  const isLoggedIn = computed(() => !!token.value);

  /** 是否为VIP会员（未过期） */
  const isVip = computed(() => {
    if (!user.value) return false;
    if (user.value.membershipType !== 'VIP') return false;
    if (!user.value.vipExpireAt) return false;
    return new Date(user.value.vipExpireAt) > new Date();
  });

  /** true when should show teacher UI */
  const isTeacherView = computed(() => {
    if (!user.value) return false;
    if (user.value.role !== 'teacher') return false;
    if (!user.value.teacherVerified) return false;
    return viewMode.value !== 'student-preview';
  });

  const isTeacher = computed(() => {
    return user.value?.role === 'teacher' && user.value?.teacherVerified === true;
  });

  function setLogin(tokenStr: string, userInfo: UserInfo) {
    token.value = tokenStr;
    user.value = userInfo;
    viewMode.value = 'default';
    uni.setStorageSync('token', tokenStr);
    uni.setStorageSync('user', JSON.stringify(userInfo));
  }

  function logout() {
    token.value = '';
    user.value = null;
    viewMode.value = 'default';
    uni.removeStorageSync('token');
    uni.removeStorageSync('user');
    uni.reLaunch({ url: '/pages/login/index' });
  }

  function loadFromStorage() {
    const savedToken = uni.getStorageSync('token');
    const savedUser = uni.getStorageSync('user');
    if (savedToken) {
      token.value = savedToken;
    }
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch {}
    }
  }

  function updateUser(partial: Partial<UserInfo>) {
    if (user.value) {
      user.value = { ...user.value, ...partial };
      uni.setStorageSync('user', JSON.stringify(user.value));
    }
  }

  function toggleViewMode() {
    if (viewMode.value === 'default') {
      viewMode.value = 'student-preview';
    } else {
      viewMode.value = 'default';
    }
    uni.reLaunch({ url: '/pages/home/index' });
  }

  return {
    token,
    user,
    viewMode,
    isLoggedIn,
    isVip,
    isTeacher,
    isTeacherView,
    setLogin,
    logout,
    loadFromStorage,
    updateUser,
    toggleViewMode,
  };
});
