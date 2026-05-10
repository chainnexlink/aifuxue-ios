<template>
  <view class="mistake-detail-page">
    <!-- 新建模式：AI处理中 -->
    <view v-if="mode === 'create' && processing" class="processing-card">
      <view class="proc-spinner"></view>
      <text class="proc-title">AI 正在分析错题...</text>
      <view class="proc-steps">
        <view class="proc-step" :class="{ active: step >= 1, done: step > 1 }">
          <view class="step-dot"></view>
          <text>OCR 识别</text>
        </view>
        <view class="proc-line" :class="{ done: step > 1 }"></view>
        <view class="proc-step" :class="{ active: step >= 2, done: step > 2 }">
          <view class="step-dot"></view>
          <text>知识点提取</text>
        </view>
        <view class="proc-line" :class="{ done: step > 2 }"></view>
        <view class="proc-step" :class="{ active: step >= 3 }">
          <view class="step-dot"></view>
          <text>错因诊断</text>
        </view>
      </view>
    </view>

    <!-- 错题详情 -->
    <view v-if="mistake" class="detail-area">
      <!-- 原题展示 -->
      <view class="section-card">
        <view class="sc-header">
          <view class="sc-icon-wrap sc-icon-doc">
            <image src="/static/icons/document.svg" class="sc-icon-img" mode="aspectFit" />
          </view>
          <text class="sc-title">原题内容</text>
        </view>
        <text class="original-text">{{ mistake.ocrText }}</text>
        <view v-if="mistake.imageUrls?.length" class="image-row">
          <image v-for="(url, idx) in mistake.imageUrls" :key="idx" :src="url" mode="aspectFit" class="mistake-img" @tap="previewImg(idx)" />
        </view>
      </view>

      <!-- AI诊断卡片 -->
      <view class="section-card diagnosis-card">
        <view class="sc-header">
          <view class="sc-icon-wrap sc-icon-ai">
            <image src="/static/icons/brain.svg" class="sc-icon-img" mode="aspectFit" />
          </view>
          <text class="sc-title">AI 诊断</text>
        </view>
        <view class="diag-items">
          <view class="diag-item">
            <text class="diag-label">知识点</text>
            <view class="diag-tag tag-knowledge">
              <text>{{ mistake.knowledgePoint }}</text>
            </view>
          </view>
          <view class="diag-item">
            <text class="diag-label">错因判断</text>
            <view class="diag-tag tag-error">
              <text>{{ mistake.errorType || '待分析' }}</text>
            </view>
          </view>
          <view class="diag-item full">
            <text class="diag-label">错因分析</text>
            <text class="diag-reason">{{ mistake.errorReason }}</text>
          </view>
          <view class="diag-item full">
            <text class="diag-label">避坑提示</text>
            <text class="diag-tip">{{ mistake.avoidTip || '注意审题，分步骤检查计算过程，不遗漏任何解。' }}</text>
          </view>
        </view>
      </view>

      <!-- 同类题区域 -->
      <view class="section-card">
        <view class="sc-header">
          <view class="sc-icon-wrap sc-icon-practice">
            <image src="/static/icons/target.svg" class="sc-icon-img" mode="aspectFit" />
          </view>
          <text class="sc-title">同类变式题</text>
        </view>
        <view v-if="similarQuestions.length > 0" class="similar-list">
          <view v-for="(q, idx) in similarQuestions" :key="idx" class="similar-item">
            <text class="similar-num">{{ idx + 1 }}</text>
            <text class="similar-text">{{ q.question }}</text>
          </view>
          <view class="similar-action" @tap="startSimilarPractice">
            <text>开始练习</text>
          </view>
        </view>
        <view v-else class="similar-empty">
          <text class="se-text">AI 可生成 2-3 道同类变式题帮助巩固</text>
          <view class="se-btn" @tap="generateSimilar">
            <text>生成同类题</text>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="action-bar safe-bottom">
        <view class="ab-btn ab-outline" @tap="generateSimilar">
          <text>再做一次同类题</text>
        </view>
        <view class="ab-btn ab-fill" @tap="viewAnswer">
          <text>查看答案</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import { hasFreeQuota, consumeFreeQuota } from '@/utils/daily-limit';

const userStore = useUserStore();
const mode = ref('view');
const processing = ref(false);
const step = ref(0);
const mistake = ref<any>(null);
const similarQuestions = ref<any[]>([]);

onLoad((options) => {
  if (options?.mode === 'create') {
    mode.value = 'create';
    startProcessing();
  } else if (options?.id) {
    loadMistake(options.id);
  }
});

function startProcessing() {
  processing.value = true;
  step.value = 1;
  setTimeout(() => { step.value = 2; }, 1200);
  setTimeout(() => { step.value = 3; }, 2400);
  setTimeout(() => {
    processing.value = false;
    mistake.value = {
      id: Date.now().toString(),
      ocrText: '已知函数f(x)=x^3-3x+1，求f(x)的极值点。',
      knowledgePoint: '导数与极值',
      errorType: '计算错误',
      errorReason: '求导后解方程时遗漏了负根 x=-1，只找到了 x=1。应当将 f\'(x)=3x^2-3=0 分解为 3(x+1)(x-1)=0，得到 x=1 和 x=-1 两个极值点。',
      avoidTip: '解方程时务必考虑所有根，尤其是二次方程有正负两个解。建议使用因式分解法检验。',
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };
    // 模拟生成同类题
    similarQuestions.value = [
      { question: '已知函数g(x)=2x^3-6x+3，求g(x)的所有极值点。' },
      { question: '若f(x)=x^4-8x^2+2，求f(x)取得极值时x的值。' },
    ];
  }, 3600);
}

function loadMistake(id: string) {
  mistake.value = {
    id,
    ocrText: id === '1'
      ? '已知函数f(x)=x^3-3x+1，求f(x)的极值点。我的解答：f\'(x)=3x^2-3=0，x=1，所以极值点为x=1。'
      : 'The teacher suggested that he _____ harder. 我选的是 studies，正确答案是 study。',
    knowledgePoint: id === '1' ? '导数与极值' : '虚拟语气',
    errorType: id === '1' ? '计算错误' : '概念不清',
    errorReason: id === '1' ? '求导后解方程时遗漏了负根 x=-1' : '虚拟语气中 suggest 后接 should + 动词原形，should 可省略',
    avoidTip: id === '1' ? '解方程注意正负两个根' : '记住suggest/recommend/insist等动词后用虚拟语气',
    subject: id === '1' ? '数学' : '英语',
    imageUrls: [],
    createdAt: new Date().toISOString(),
  };
  similarQuestions.value = [
    { question: id === '1' ? '已知f(x)=x^3-12x，求极大值和极小值。' : 'The doctor recommended that she _____ more water. (drink/drinks)' },
    { question: id === '1' ? '求函数y=3x-x^3在区间[-2,2]上的最大值。' : 'It is essential that every student _____ on time. (arrive/arrives)' },
  ];
}

function previewImg(idx: number) {
  if (mistake.value?.imageUrls) {
    uni.previewImage({ current: idx, urls: mistake.value.imageUrls });
  }
}

async function generateSimilar() {
  if (hasFreeQuota('SIMILAR_QUESTION')) {
    consumeFreeQuota('SIMILAR_QUESTION');
    uni.navigateTo({ url: `/pages/mistakes/similar/index?mistakeId=${mistake.value?.id}` });
  } else {
    const ok = await tryPlayAd(AD_UNIT_IDS.SIMILAR_QUESTION, '同类题生成');
    if (ok) uni.navigateTo({ url: `/pages/mistakes/similar/index?mistakeId=${mistake.value?.id}` });
  }
}

async function startSimilarPractice() {
  if (hasFreeQuota('SIMILAR_QUESTION')) {
    consumeFreeQuota('SIMILAR_QUESTION');
    uni.navigateTo({ url: `/pages/mistakes/similar/index?mistakeId=${mistake.value?.id}` });
  } else {
    const ok = await tryPlayAd(AD_UNIT_IDS.SIMILAR_QUESTION, '同类题生成');
    if (ok) uni.navigateTo({ url: `/pages/mistakes/similar/index?mistakeId=${mistake.value?.id}` });
  }
}

function viewAnswer() {
  // 需要家长密码验证
  uni.navigateTo({ url: `/pages/exercise/result/index?mistakeId=${mistake.value?.id}` });
}
</script>

<style scoped>
.mistake-detail-page {
  --c-primary: #5B7BFF;
  --c-primary-bg: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-danger: #FF6B6B;
  --c-success: #34D399;
  --c-warning: #FFBA4A;
  --c-card: #1A1D2E;
  --c-border: #2A2E3F;
  padding: 24rpx 32rpx;
  padding-bottom: 160rpx;
  background: #0F1118;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Processing */
.processing-card {
  background: var(--c-card);
  border-radius: 20rpx;
  padding: 60rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1rpx solid var(--c-border);
}

.proc-spinner {
  width: 56rpx; height: 56rpx;
  border: 4rpx solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24rpx;
}

@keyframes spin { to { transform: rotate(360deg); } }

.proc-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--c-t1);
  margin-bottom: 40rpx;
}

.proc-steps {
  display: flex;
  align-items: center;
  gap: 0;
}

.proc-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--c-t3);
}

.proc-step.active { color: var(--c-primary); }
.proc-step.done { color: var(--c-success); }

.step-dot {
  width: 16rpx; height: 16rpx;
  border-radius: 50%;
  background: var(--c-border);
}

.proc-step.active .step-dot { background: var(--c-primary); }
.proc-step.done .step-dot { background: var(--c-success); }

.proc-line {
  width: 60rpx; height: 3rpx;
  background: var(--c-border);
  margin: 0 8rpx;
  margin-bottom: 28rpx;
}

.proc-line.done { background: var(--c-success); }

/* Section Card */
.section-card {
  background: var(--c-card);
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid var(--c-border);
}

.sc-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.sc-icon-wrap {
  width: 44rpx; height: 44rpx;
  border-radius: 12rpx;
  display: flex; align-items: center; justify-content: center;
}

.sc-icon-doc { background: var(--c-primary-bg); }
.sc-icon-ai { background: rgba(255,186,74,0.15); }
.sc-icon-practice { background: rgba(255,107,107,0.15); }

.sc-icon-img {
  width: 26rpx;
  height: 26rpx;
}

.sc-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--c-t1);
}

.original-text {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.7;
}

.image-row { display: flex; gap: 12rpx; margin-top: 16rpx; }
.mistake-img { width: 200rpx; height: 200rpx; border-radius: 8rpx; background: #242838; }

/* Diagnosis */
.diagnosis-card {
  border-left: 6rpx solid var(--c-warning);
}

.diag-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.diag-item {
  width: calc(50% - 10rpx);
}

.diag-item.full { width: 100%; }

.diag-label {
  font-size: 22rpx;
  color: var(--c-t3);
  display: block;
  margin-bottom: 8rpx;
}

.diag-tag {
  display: inline-flex;
  padding: 6rpx 18rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.tag-knowledge { background: rgba(52,211,153,0.15); color: var(--c-success); }
.tag-error { background: rgba(255,107,107,0.15); color: var(--c-danger); }

.diag-reason {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.6;
}

.diag-tip {
  font-size: 26rpx;
  color: var(--c-primary);
  line-height: 1.6;
  background: var(--c-primary-bg);
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
}

/* Similar Questions */
.similar-list { }

.similar-item {
  display: flex;
  gap: 12rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--c-border);
}

.similar-item:last-of-type { border-bottom: none; }

.similar-num {
  width: 40rpx; height: 40rpx;
  background: var(--c-primary-bg);
  color: var(--c-primary);
  font-size: 24rpx; font-weight: 700;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  line-height: 40rpx; text-align: center;
}

.similar-text {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.6;
  flex: 1;
}

.similar-action {
  margin-top: 16rpx;
  background: var(--c-primary-bg);
  color: var(--c-primary);
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.similar-empty {
  text-align: center;
  padding: 20rpx 0;
}

.se-text { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 16rpx; }

.se-btn {
  display: inline-flex;
  background: var(--c-primary);
  color: #FFF;
  padding: 16rpx 48rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
}

/* Action Bar */
.action-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--c-card);
  padding: 20rpx 32rpx;
  display: flex; gap: 20rpx;
  border-top: 1rpx solid var(--c-border);
}

.ab-btn {
  flex: 1; height: 88rpx;
  border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 28rpx; font-weight: 600;
}

.ab-outline {
  border: 2rpx solid var(--c-primary);
  color: var(--c-primary);
  background: transparent;
}

.ab-fill {
  background: linear-gradient(135deg, #3D56C6, #5B7BFF);
  color: #FFF;
}
</style>
