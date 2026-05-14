<template>
  <view class="page">
    <!-- 筛选Tab -->
    <view class="filter-tabs">
      <view class="tab" :class="{ active: currentTab === 'all' }" @tap="currentTab = 'all'">
        <text class="tab-text">全部</text>
      </view>
      <view class="tab" :class="{ active: currentTab === 'REFERRAL' }" @tap="currentTab = 'REFERRAL'">
        <text class="tab-text">获得</text>
      </view>
      <view class="tab" :class="{ active: currentTab === 'spent' }" @tap="currentTab = 'spent'">
        <text class="tab-text">消费</text>
      </view>
    </view>

    <!-- 明细列表 -->
    <view class="list-wrap">
      <view v-if="records.length === 0 && !loading" class="empty">
        <text class="empty-text">暂无积分记录</text>
      </view>
      <view v-for="item in records" :key="item.id" class="record-item">
        <view class="record-left">
          <text class="record-icon">{{ item.amount > 0 ? '📈' : '📉' }}</text>
          <view class="record-info">
            <text class="record-desc">{{ item.description || typeLabel(item.type) }}</text>
            <text class="record-time">{{ formatTime(item.createdAt) }}</text>
          </view>
        </view>
        <text class="record-amount" :class="{ positive: item.amount > 0 }">
          {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
        </text>
      </view>

      <view v-if="hasMore" class="load-more" @tap="loadMore">
        <text class="load-more-text">{{ loading ? '加载中...' : '加载更多' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { creditsApi } from '@/utils/api';

const currentTab = ref<'all' | 'REFERRAL' | 'spent'>('all');
const records = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const hasMore = ref(false);

onShow(() => {
  refresh();
});

watch(currentTab, () => {
  refresh();
});

async function refresh() {
  page.value = 1;
  records.value = [];
  await loadData();
}

async function loadMore() {
  if (loading.value) return;
  page.value++;
  await loadData();
}

async function loadData() {
  loading.value = true;
  try {
    let typeFilter: string | undefined;
    if (currentTab.value === 'REFERRAL') {
      typeFilter = 'REFERRAL';
    }
    // 'spent' tab 需要获取所有 deduction 类型
    const res = await creditsApi.getHistory({
      type: typeFilter,
      page: page.value,
      pageSize: 20,
    });
    const filtered = currentTab.value === 'spent'
      ? res.records.filter(r => r.amount < 0)
      : res.records;
    if (page.value === 1) {
      records.value = filtered;
    } else {
      records.value.push(...filtered);
    }
    total.value = res.total;
    hasMore.value = records.value.length < res.total;
  } catch {} finally {
    loading.value = false;
  }
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    REFERRAL: '学生注册奖励',
    MEMBERSHIP_DEDUCTION: '抵扣会员购买',
    QUOTA_DEDUCTION: '抵扣消耗次数',
  };
  return map[type] || type;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}
</script>

<style scoped>
.page {
  --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF;
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F;
  background: var(--c-bg); min-height: 100vh; box-sizing: border-box;
}

.filter-tabs {
  display: flex; padding: 24rpx 32rpx; gap: 16rpx;
}
.tab {
  flex: 1; text-align: center; padding: 16rpx 0;
  background: var(--c-card); border-radius: 12rpx; border: 1rpx solid var(--c-border);
}
.tab-text { font-size: 28rpx; color: var(--c-t2); }
.tab.active { border-color: var(--c-primary); background: rgba(91,123,255,0.1); }
.tab.active .tab-text { color: var(--c-primary); font-weight: 600; }

.list-wrap { padding: 0 32rpx; }
.empty { text-align: center; padding: 80rpx 0; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }

.record-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28rpx 24rpx; background: var(--c-card); border-radius: 16rpx;
  margin-bottom: 16rpx; border: 1rpx solid var(--c-border);
}
.record-left { display: flex; align-items: center; gap: 16rpx; flex: 1; }
.record-icon { font-size: 32rpx; }
.record-info { display: flex; flex-direction: column; gap: 6rpx; }
.record-desc { font-size: 28rpx; color: var(--c-t1); }
.record-time { font-size: 22rpx; color: var(--c-t3); }
.record-amount { font-size: 32rpx; font-weight: 700; color: #FF6B6B; }
.record-amount.positive { color: #34D399; }

.load-more { text-align: center; padding: 32rpx 0; }
.load-more-text { font-size: 26rpx; color: var(--c-primary); }
</style>
