import { request } from './request';

// ========== 认证 ==========
export const authApi = {
  sendCode: (phone: string) =>
    request({ url: `/auth/send-code?phone=${phone}` }),

  register: (data: {
    phone: string;
    code: string;
    nickname: string;
    gradeLevel: string;
    province: string;
    city: string;
    role?: string;
    inviteCode?: string;
  }) => request({ url: '/auth/register', method: 'POST', data }),

  login: (data: { phone: string; code: string }) =>
    request({ url: '/auth/login', method: 'POST', data }),
};

// ========== 用户 ==========
export const userApi = {
  getProfile: () => request({ url: '/user/profile' }),

  updateProfile: (data: Record<string, any>) =>
    request({ url: '/user/profile', method: 'PUT', data }),

  getStats: () => request<{ noteCount: number; exerciseCount: number; mistakeKilled: number; streakDays: number }>({ url: '/user/stats' }),

  getBadges: () => request<{ id: string; name: string; desc: string; icon: string; color: string; earned: boolean }[]>({ url: '/user/badges' }),

  getTodayStats: () => request<{ notes: number; exercises: number; mistakes: number }>({ url: '/user/today-stats' }),
};

// ========== 笔记 ==========
export const notesApi = {
  list: (params?: { page?: number; pageSize?: number; subject?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.subject) query.set('subject', params.subject);
    return request({ url: `/notes?${query.toString()}` });
  },

  getById: (id: string) => request({ url: `/notes/${id}` }),

  unlock: (id: string) =>
    request({ url: `/notes/${id}/unlock`, method: 'POST' }),

  delete: (id: string) =>
    request({ url: `/notes/${id}`, method: 'DELETE' }),
};

// ========== 家长 ==========
export const parentApi = {
  hasPassword: () => request({ url: '/parent/has-password' }),

  setPassword: (password: string) =>
    request({ url: '/parent/set-password', method: 'POST', data: { password } }),

  verifyPassword: (password: string) =>
    request({
      url: '/parent/verify-password',
      method: 'POST',
      data: { password },
    }),
};

// ========== 积分 ==========
export const creditsApi = {
  /** 获取积分余额 */
  getBalance: () => request<{ credits: number }>({ url: '/credits/balance' }),

  /** 获取积分概览 */
  getOverview: () => request<{
    balance: number;
    totalEarned: number;
    totalSpent: number;
    referralCount: number;
  }>({ url: '/credits/overview' }),

  /** 获取积分明细 */
  getHistory: (params?: { type?: string; page?: number; pageSize?: number }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    return request<{
      total: number;
      page: number;
      pageSize: number;
      records: Array<{
        id: string;
        amount: number;
        type: string;
        description: string;
        createdAt: string;
      }>;
    }>({ url: `/credits/history?${query.toString()}` });
  },

  /** 积分抵扣会员 */
  useForMembership: (creditsToUse: number, planId: string) =>
    request({ url: '/credits/use/membership', method: 'POST', data: { creditsToUse, planId } }),

  /** 积分抵扣消耗次数 */
  useForQuota: (creditsToUse: number) =>
    request({ url: '/credits/use/quota', method: 'POST', data: { creditsToUse } }),
};
