<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useUserStore } from './store/user';

onLaunch(() => {
  const userStore = useUserStore();
  userStore.loadFromStorage();
});
</script>

<style>
page {
  background-color: #0F1118;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #E8ECF4;
}

.container {
  padding: 30rpx;
}

/* 通用按钮 */
.btn-primary {
  background: linear-gradient(135deg, #3D56C6, #5B7BFF);
  color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
}

.btn-primary:active {
  opacity: 0.85;
}

.btn-secondary {
  background: rgba(91,123,255,0.15);
  color: #5B7BFF;
  border-radius: 16rpx;
  padding: 24rpx 0;
  text-align: center;
  font-size: 32rpx;
}

/* 卡片 */
.card {
  background: #1A1D2E;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid #2A2E3F;
}

/* 安全区域 */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>