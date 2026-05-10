<template>
  <view class="page">
    <view class="form-card">
      <text class="form-title">AI智能出卷</text>
      <text class="form-desc">基于教材版本和教学进度，AI生成三套不同难度试卷</text>

      <view class="info-bar">
        <view class="info-chip"><text>📚 人教版</text></view>
        <view class="info-chip"><text>📍 北京</text></view>
        <view class="info-chip"><text>📐 初三数学</text></view>
        <view class="info-chip edit" @tap="goTeachingInfo"><text>✏️ 修改</text></view>
      </view>

      <view class="form-group">
        <text class="form-label">出卷范围</text>
        <view class="range-card">
          <text class="range-text">当前进度：第三章 一元二次方程</text>
          <text class="range-hint">可微调出卷范围</text>
        </view>
        <view class="chip-row" style="margin-top:12rpx;">
          <view v-for="ch in chapterRange" :key="ch" class="chip" :class="{ active: selectedChapters.includes(ch) }" @tap="toggleChapter(ch)">
            <text>{{ ch }}</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">试卷类型</text>
        <view class="chip-row">
          <view v-for="t in examTypes" :key="t" class="chip" :class="{ active: form.examType === t }" @tap="form.examType = t">
            <text>{{ t }}</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">题型选择</text>
        <view class="chip-row">
          <view v-for="q in questionTypes" :key="q" class="chip" :class="{ active: form.selectedTypes.includes(q) }" @tap="toggleQType(q)">
            <text>{{ q }}</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">题量</text>
        <view class="stepper-row">
          <view class="stepper-btn" @tap="form.count = Math.max(5, form.count - 5)"><text>-</text></view>
          <text class="stepper-val">{{ form.count }} 题</text>
          <view class="stepper-btn" @tap="form.count = Math.min(50, form.count + 5)"><text>+</text></view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">难度分布</text>
        <view class="diff-row">
          <view class="diff-item">
            <text class="diff-label">基础</text>
            <view class="diff-bar" style="background:#34D399;"><text>{{ form.diffBasic }}%</text></view>
          </view>
          <view class="diff-item">
            <text class="diff-label">中等</text>
            <view class="diff-bar" style="background:#FFBA4A;"><text>{{ form.diffMedium }}%</text></view>
          </view>
          <view class="diff-item">
            <text class="diff-label">拔高</text>
            <view class="diff-bar" style="background:#FF6B6B;"><text>{{ form.diffHard }}%</text></view>
          </view>
        </view>
        <view class="diff-presets">
          <view class="preset-btn" @tap="setDiff(70,20,10)"><text>基础巩固</text></view>
          <view class="preset-btn" @tap="setDiff(40,40,20)"><text>均衡配置</text></view>
          <view class="preset-btn" @tap="setDiff(30,40,30)"><text>拔高挑战</text></view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">总分</text>
        <view class="chip-row">
          <view v-for="s in totalScores" :key="s" class="chip" :class="{ active: form.totalScore === s }" @tap="form.totalScore = s">
            <text>{{ s }}分</text>
          </view>
        </view>
      </view>
    </view>

    <view class="gen-btn" @tap="handleGenerate">
      <text class="gen-text">🤖 AI生成三套试卷</text>
    </view>

    <view class="gen-note">
      <text>AI将生成3套不同侧重的试卷：A卷基础巩固 / B卷能力提升 / C卷综合运用</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward'

const examTypes = ['课时练习', '单元测试', '期中模拟', '期末模拟']
const questionTypes = ['选择题', '填空题', '计算题', '应用题', '证明题', '综合题']
const totalScores = [100, 120, 150]
const chapterRange = ['第一章', '第二章', '第三章', '第四章']

const selectedChapters = ref(['第三章'])
const form = ref({
  examType: '单元测试',
  selectedTypes: ['选择题', '填空题', '计算题'],
  count: 20,
  diffBasic: 40, diffMedium: 40, diffHard: 20,
  totalScore: 100,
})

function toggleChapter(ch: string) {
  const idx = selectedChapters.value.indexOf(ch)
  if (idx >= 0) selectedChapters.value.splice(idx, 1)
  else selectedChapters.value.push(ch)
}

function toggleQType(q: string) {
  const idx = form.value.selectedTypes.indexOf(q)
  if (idx >= 0) form.value.selectedTypes.splice(idx, 1)
  else form.value.selectedTypes.push(q)
}

function setDiff(b: number, m: number, h: number) {
  form.value.diffBasic = b; form.value.diffMedium = m; form.value.diffHard = h
}

function goTeachingInfo() {
  uni.navigateTo({ url: '/pages/teacher/teaching-info/index' })
}

async function handleGenerate() {
  if (selectedChapters.value.length === 0) { uni.showToast({ title: '请选择出卷范围', icon: 'none' }); return }
  if (form.value.selectedTypes.length === 0) { uni.showToast({ title: '请选择题型', icon: 'none' }); return }
  const ok = await tryPlayAd(AD_UNIT_IDS.AI_EXAM_GEN, 'AI智能出卷')
  if (!ok) return
  uni.showLoading({ title: 'AI出卷中...' })
  setTimeout(() => {
    uni.hideLoading()
    const cfg = encodeURIComponent(JSON.stringify({
      examType: form.value.examType,
      selectedTypes: [...form.value.selectedTypes],
      count: form.value.count,
      totalScore: form.value.totalScore,
      selectedChapters: [...selectedChapters.value],
    }))
    uni.navigateTo({ url: `/pages/teacher/exam-gen/preview?config=${cfg}` })
  }, 2000)
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.form-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 20rpx; }
.info-bar { display: flex; flex-wrap: wrap; gap: 10rpx; margin-bottom: 24rpx; }
.info-chip { padding: 8rpx 18rpx; background: #242838; border-radius: 10rpx; font-size: 24rpx; color: var(--c-t2); }
.info-chip.edit { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.form-group { margin-bottom: 28rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; font-weight: 600; }
.range-card { background: #242838; border-radius: 14rpx; padding: 20rpx; }
.range-text { font-size: 28rpx; color: var(--c-t1); display: block; margin-bottom: 4rpx; }
.range-hint { font-size: 22rpx; color: var(--c-t3); }
.chip-row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }
.stepper-row { display: flex; align-items: center; gap: 24rpx; }
.stepper-btn { width: 64rpx; height: 64rpx; border-radius: 16rpx; background: #242838; border: 2rpx solid var(--c-border); display: flex; align-items: center; justify-content: center; font-size: 36rpx; color: var(--c-t1); }
.stepper-val { font-size: 32rpx; font-weight: 700; color: var(--c-primary); min-width: 100rpx; text-align: center; }
.diff-row { display: flex; gap: 12rpx; margin-bottom: 16rpx; }
.diff-item { flex: 1; text-align: center; }
.diff-label { font-size: 22rpx; color: var(--c-t3); display: block; margin-bottom: 8rpx; }
.diff-bar { border-radius: 10rpx; padding: 14rpx 0; font-size: 28rpx; font-weight: 700; color: #FFF; text-align: center; }
.diff-presets { display: flex; gap: 12rpx; }
.preset-btn { flex: 1; text-align: center; padding: 12rpx; background: #242838; border-radius: 10rpx; border: 1rpx solid var(--c-border); font-size: 24rpx; color: var(--c-t2); }
.gen-btn { background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 20rpx; padding: 32rpx; text-align: center; box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.3); margin-bottom: 16rpx; }
.gen-text { font-size: 32rpx; font-weight: 700; color: #FFF; }
.gen-note { text-align: center; padding: 0 20rpx; }
.gen-note text { font-size: 22rpx; color: var(--c-t3); line-height: 1.6; }
</style>
