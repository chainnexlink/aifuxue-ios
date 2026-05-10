<template>
  <view class="analysis-page">
    <!-- 题目 -->
    <view class="question-card">
      <text class="q-subject" v-if="question.subject">{{ question.subject }}</text>
      <text class="q-text">{{ question.question }}</text>
    </view>

    <!-- 选项回顾 -->
    <view class="options-card">
      <text class="card-title">作答回顾</text>
      <view v-for="(opt, idx) in question.options" :key="idx" class="opt-item" :class="optClass(idx)">
        <view class="opt-badge" :class="optClass(idx)">
          <text class="opt-letter">{{ ['A','B','C','D'][idx] }}</text>
        </view>
        <text class="opt-text">{{ opt }}</text>
        <text class="opt-tag correct" v-if="idx === question.correctIndex">正确答案</text>
        <text class="opt-tag wrong" v-if="idx === answer.selected && idx !== question.correctIndex">你的选择</text>
      </view>
    </view>

    <!-- 解析 -->
    <view class="analysis-card">
      <text class="card-title">详细解析</text>
      <text class="analysis-text">{{ explanation }}</text>
    </view>

    <!-- 知识点 -->
    <view class="knowledge-card">
      <text class="card-title">涉及知识点</text>
      <view class="knowledge-tags">
        <view v-for="tag in knowledgeTags" :key="tag" class="k-tag">
          <text class="k-tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 易错提醒 -->
    <view class="tips-card" v-if="!answer.isCorrect">
      <text class="tips-title">易错提醒</text>
      <text class="tips-text">{{ tipText }}</text>
    </view>

    <!-- 相关练习 -->
    <view class="related-card">
      <text class="card-title">相关练习</text>
      <view v-for="(r, idx) in relatedExercises" :key="idx" class="related-item" @tap="goRelated(r)">
        <view class="ri-info">
          <text class="ri-title">{{ r.title }}</text>
          <text class="ri-desc">{{ r.desc }}</text>
        </view>
        <view class="ri-arrow"></view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="btn-primary back-btn" @tap="goBack">
        <text>返回</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const question = ref<any>({});
const answer = ref<any>({});
const source = ref('');

onLoad((options) => {
  if (options?.data) {
    try {
      const parsed = JSON.parse(decodeURIComponent(options.data));
      question.value = parsed.question || {};
      answer.value = parsed.answer || {};
      source.value = parsed.source || '';
    } catch {}
  }
});

const explanation = computed(() => {
  const q = question.value.question || '';
  if (q.includes('极大值')) return '对 f(x) 求导得 f\'(x) = 3x² - 3 = 3(x+1)(x-1)。令 f\'(x)=0 得 x=-1 或 x=1。当 x=-1 时，f\'(x) 由正变负，为极大值点。f(-1) = -1 + 3 + 1 = 3。';
  if (q.includes('公差')) return '由等差数列性质，a₃ = a₁ + 2d = 7，S₇ = 7a₁ + 21d = 49，即 a₁ + 3d = 7。联立方程 a₁ + 2d = 7 与 a₁ + 3d = 7，解得 d = 0... 请核实题目数据。常见解法：利用 S₇ = 7a₄ 的性质。';
  if (q.includes('定义域')) return '函数 y=ln(x-1) 的定义域要求真数 x-1 > 0，即 x > 1，所以定义域为 (1,+∞)。';
  if (q.includes('向量')) return '两向量垂直时点积为0：a·b = 1×x + 2×1 = x + 2 = 0，解得 x = -2。';
  return '本题考查基础运算和公式应用。解题关键是审清题意，找准对应公式，代入计算要仔细。建议回顾课本对应章节的例题。';
});

const knowledgeTags = computed(() => {
  const q = question.value.question || '';
  if (q.includes('极大值') || q.includes('导数')) return ['导数', '极值', '单调性'];
  if (q.includes('等差')) return ['等差数列', '前n项和', '通项公式'];
  if (q.includes('定义域')) return ['对数函数', '定义域', '函数基础'];
  if (q.includes('向量')) return ['平面向量', '向量垂直', '数量积'];
  if (q.includes('△ABC')) return ['正弦定理', '余弦定理', '三角函数'];
  return ['基础运算', '公式应用'];
});

const tipText = computed(() => {
  const q = question.value.question || '';
  if (q.includes('极大值')) return '注意区分极大值与最大值：极大值是局部最大，不一定是全局最大。求极值时，先求导令导数为零，再用导数符号变化判断极值类型。';
  if (q.includes('定义域')) return '对数函数的真数必须大于0（不包括0），这是一个容易忽略的易错点。遇到复合函数时要对内层函数设定约束。';
  return '做选择题时，可以用代入验证法快速排除错误选项，提高效率。';
});

const relatedExercises = ref([
  { id: '1', title: '同类型练习', desc: '系统推荐的同知识点题目' },
  { id: '2', title: '查看错题本', desc: '查看此知识点相关的全部错题' },
]);

function optClass(idx: number) {
  if (idx === question.value.correctIndex) return 'correct';
  if (idx === answer.value.selected && idx !== question.value.correctIndex) return 'wrong';
  return '';
}

function goRelated(r: any) {
  if (r.id === '2') {
    uni.switchTab({ url: '/pages/mistakes/index' });
  } else {
    uni.navigateTo({ url: `/pages/exercise/index?noteId=analysis` });
  }
}

function goBack() {
  uni.navigateBack();
}
</script>

<style scoped>
.analysis-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 140rpx;
}

.question-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.q-subject { font-size: 22rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 4rpx 16rpx; border-radius: 8rpx; display: inline-block; margin-bottom: 12rpx; }
.q-text { font-size: 30rpx; font-weight: 600; color: #E8ECF4; display: block; line-height: 1.6; }

.options-card, .analysis-card, .knowledge-card, .tips-card, .related-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.card-title { font-size: 28rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 16rpx; }

.opt-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 16rpx 12rpx; border-radius: 12rpx; margin-bottom: 8rpx;
  background: #242838;
}
.opt-item.correct { background: rgba(52,211,153,0.08); }
.opt-item.wrong { background: rgba(255,107,107,0.08); }
.opt-badge {
  width: 40rpx; height: 40rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #2A2E3F; flex-shrink: 0;
}
.opt-badge.correct { background: #34D399; }
.opt-badge.wrong { background: #FF6B6B; }
.opt-letter { font-size: 22rpx; font-weight: 700; color: #8B92A5; }
.opt-badge.correct .opt-letter, .opt-badge.wrong .opt-letter { color: #FFF; }
.opt-text { font-size: 26rpx; color: #E8ECF4; flex: 1; }
.opt-tag { font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 6rpx; flex-shrink: 0; }
.opt-tag.correct { color: #34D399; background: rgba(52,211,153,0.15); }
.opt-tag.wrong { color: #FF6B6B; background: rgba(255,107,107,0.15); }

.analysis-text { font-size: 26rpx; color: #8B92A5; line-height: 1.8; }

.knowledge-tags { display: flex; flex-wrap: wrap; gap: 12rpx; }
.k-tag { background: rgba(167,139,250,0.12); padding: 8rpx 20rpx; border-radius: 12rpx; }
.k-tag-text { font-size: 24rpx; color: #A78BFA; }

.tips-card { border-color: rgba(255,186,74,0.2); background: rgba(255,186,74,0.05); }
.tips-title { font-size: 28rpx; font-weight: 700; color: #FFBA4A; display: block; margin-bottom: 12rpx; }
.tips-text { font-size: 26rpx; color: #8B92A5; line-height: 1.8; }

.related-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 18rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.related-item:last-child { border-bottom: none; }
.ri-info { flex: 1; }
.ri-title { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; }
.ri-desc { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.ri-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 20rpx 32rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: linear-gradient(transparent, #0F1118 30%);
}
.back-btn { padding: 28rpx 0; }
</style>
