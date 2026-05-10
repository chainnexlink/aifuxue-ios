import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动附加 token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器 - 统一处理错误
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          ElMessage.error('登录已过期，请重新登录');
          router.push('/login');
          break;
        case 403:
          ElMessage.error(data?.message || '无权限访问');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器内部错误');
          break;
        default:
          ElMessage.error(data?.message || '请求失败');
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请重试');
    } else {
      ElMessage.error('网络异常，请检查网络连接');
    }
    return Promise.reject(error);
  },
);

// 封装请求方法
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return http.get(url, { params, ...config }) as Promise<T>;
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return http.post(url, data, config) as Promise<T>;
}

export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return http.put(url, data, config) as Promise<T>;
}

export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return http.delete(url, config) as Promise<T>;
}

// ============ API 模块 ============

// 认证
export const authApi = {
  login: (data: { username: string; password: string }) =>
    post<{ token: string; user: any }>('/auth/admin/login', data),
};

// 用户管理
export const userApi = {
  list: (params?: { page?: number; pageSize?: number; keyword?: string }) =>
    get('/users', params),
  getById: (id: string) => get(`/users/${id}`),
  updateRole: (id: string, role: string) => put(`/users/${id}/role`, { role }),
  ban: (id: string) => put(`/users/${id}/ban`),
};

// 教师管理
export const teacherApi = {
  list: (params?: any) => get('/users/teachers', params),
  approve: (id: string) => put(`/users/teachers/${id}/approve`),
  reject: (id: string, reason: string) => put(`/users/teachers/${id}/reject`, { reason }),
};

// 笔记管理
export const notesApi = {
  list: (params?: any) => get('/notes/admin/list', params),
  delete: (id: string) => del(`/notes/admin/${id}`),
};

// 练习题管理
export const exercisesApi = {
  list: (params?: any) => get('/exercises/admin/list', params),
};

// 错题管理
export const mistakesApi = {
  list: (params?: any) => get('/mistakes/admin/list', params),
};

// 班级管理
export const classApi = {
  list: (params?: any) => get('/classes', params),
  create: (data: any) => post('/classes', data),
  update: (id: string, data: any) => put(`/classes/${id}`, data),
  delete: (id: string) => del(`/classes/${id}`),
};

// 官网内容
export const websiteApi = {
  getAll: () => get('/website/admin/all'),
  upsert: (data: any) => post('/website/admin/upsert', data),
  batch: (section: string, items: any[]) => post(`/website/admin/batch/${section}`, { items }),
  delete: (id: string) => del(`/website/admin/${id}`),
  toggle: (id: string) => put(`/website/admin/${id}/toggle`),
  init: () => post('/website/admin/init'),
};

// 邀请码
export const inviteApi = {
  list: (params?: any) => get('/invite/admin/list', params),
  generate: (data: any) => post('/invite/admin/generate', data),
  stats: () => get('/invite/admin/stats'),
};

// 系统管理
export const systemApi = {
  getConfig: () => get('/system/config'),
  updateConfig: (data: any) => put('/system/config', data),
  getLogs: (params?: any) => get('/system/logs', params),
};

export default http;
