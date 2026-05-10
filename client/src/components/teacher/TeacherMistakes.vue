<template>
  <view class="teacher-mistakes">
    <view class="header-row">
      <text class="page-title">教研错题库</text>
      <view class="add-btn" @tap="takePhoto">
        <text class="add-text">📷 拍照收集</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view scroll-x class="tag-scroll">
      <view class="tag-list">
        <view class="tag-chip" :class="{ active: activeTag === 'all' }" @tap="activeTag = 'all'">
          <text>全部</text>
        </view>
        <view v-for="tag in tags" :key="tag" class="tag-chip" :class="{ active: activeTag === tag }" @tap="activeTag = tag">
          <text>{{ tag }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 错题列表 -->
    <view v-for="item in filteredItems" :key="item.id" class="mistake-card">
      <view class="mk-header">
        <view class="mk-tags">
          <view class="mk-tag subject">
            <text>{{ item.subject }}</text>
          </view>
          <view class="mk-tag kp">
            <text>{{ item.knowledgePoint }}</text>
          </view>
        </view>
        <view class="mk-type">
          <text>{{ item.type }}</text>
        </view>
      </view>
      <text class="mk-content">{{ item.question }}</text>
      <view class="mk-bottom">
        <text class="mk-source">来源: {{ item.source }}</text>
        <text class="mk-date">{{ item.date }}</text>
      </view>
    </view>

    <view v-if="filteredItems.length === 0" class="empty-hint">
      <text class="empty-text">暂无收集的题目</text>
    </view>

    <view style="height: 140rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const activeTag = ref('all');
const tags = ['数学', '英语', '语文', '物理', '化学', '函数', '导数', '概率'];

const items = ref([
  { id: '1', subject: '数学', knowledgePoint: '导数应用', type: '解答题', question: '已知函数f(x)=x³-3ax²+3x+1，若f(x)在R上为增函数...', source: '2025高考模拟卷', date: '05-01' },
  { id: '2', subject: '数学', knowledgePoint: '概率统计', type: '选择题', question: '某校随机抽取100名学生的身高数据，得到频率分布直方图...', source: '期中考试', date: '04-28' },
  { id: '3', subject: '英语', knowledgePoint: '虚拟语气', type: '填空题', question: 'If I ___ (be) you, I would have taken the opportunity.', source: '课堂测验', date: '04-25' },
  { id: '4', subject: '物理', knowledgePoint: '力学', type: '计算题', question: '一质量为m的物体从高h处自由下落...', source: '教研组资料', date: '04-22' },
]);

const filteredItems = computed(() => {
  if (activeTag.value === 'all') return items.value;
  return items.value.filter(i =>
    i.subject === activeTag.value || i.knowledgePoint === activeTag.value
  );
});

function takePhoto() {
  uni.chooseImage({
    count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: () => {
      uni.showToast({ title: 'AI识别中...', icon: 'loading', duration: 2000 });
    },
  });
}
</script>

<style scoped>
.teacher-mistakes {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  padding-top: 88rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.page-title { font-size: 36rpx; font-weight: 800; color: var(--c-t1); }
.add-btn { background: var(--c-primary); padding: 12rpx 24rpx; border-radius: 16rpx; }
.add-text { font-size: 26rpx; font-weight: 600; color: #FFF; }

.tag-scroll { white-space: nowrap; margin-bottom: 24rpx; }
.tag-list { display: inline-flex; gap: 12rpx; }
.tag-chip {
  display: inline-block; padding: 10rpx 24rpx; border-radius: 20rpx;
  background: var(--c-card); border: 1rpx solid var(--c-border);
  font-size: 24rpx; color: var(--c-t3);
}
.tag-chip.active { background: var(--c-primary); border-color: var(--c-primary); color: #FFF; }

.mistake-card {
  background: var(--c-card); border-radius: 20rpx; padding: 24rpx;
  margin-bottom: 16rpx; border: 1rpx solid var(--c-border);
}
.mk-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
.mk-tags { display: flex; gap: 8rpx; }
.mk-tag { padding: 4rpx 12rpx; border-radius: 8rpx; font-size: 22rpx; }
.mk-tag.subject { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.mk-tag.kp { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.mk-type { font-size: 22rpx; color: var(--c-t3); }
.mk-content {
  font-size: 28rpx; color: var(--c-t1); line-height: 1.5; display: block; margin-bottom: 12rpx;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.mk-bottom { display: flex; justify-content: space-between; }
.mk-source { font-size: 22rpx; color: var(--c-t3); }
.mk-date { font-size: 22rpx; color: var(--c-t3); }
.empty-hint { padding: 80rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }
</style>
