// API 基础地址配置
// 开发环境: http://localhost:3000/api (需手动修改)
// 生产环境: https://aifuxue.cn/api
const BASE_URL = 'http://127.0.0.1:3000/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;
}

function getToken(): string | null {
  return uni.getStorageSync('token') || null;
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header = {}, showLoading = false } = options;

  if (showLoading) {
    uni.showLoading({ title: '加载中...' });
  }

  const token = getToken();
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res) => {
        if (showLoading) uni.hideLoading();

        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data as T);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.removeStorageSync('user');
          uni.reLaunch({ url: '/pages/login/index' });
          reject(new Error('登录已过期'));
        } else {
          const msg = (res.data as any)?.message || '请求失败';
          uni.showToast({ title: msg, icon: 'none' });
          reject(new Error(msg));
        }
      },
      fail: (err) => {
        if (showLoading) uni.hideLoading();
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

// 上传文件
export function uploadFile(filePath: string, formData?: Record<string, any>): Promise<any> {
  const token = getToken();
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/notes/upload`,
      filePath,
      name: 'images',
      formData,
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(res.data));
        } else {
          reject(new Error('上传失败'));
        }
      },
      fail: reject,
    });
  });
}
