<template>
  <view class="page">
    <!-- 三套Tab -->
    <view class="tab-bar">
      <view v-for="(t, i) in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
        <text class="tab-label">{{ t.label }}</text>
        <text class="tab-desc">{{ t.desc }}</text>
      </view>
    </view>

    <!-- 试卷概要 -->
    <view class="summary-card">
      <view class="summary-row"><text class="s-label">试卷类型</text><text class="s-val">{{ currentPaper.type }}</text></view>
      <view class="summary-row"><text class="s-label">题量</text><text class="s-val">{{ currentPaper.count }}题</text></view>
      <view class="summary-row"><text class="s-label">总分</text><text class="s-val">{{ currentPaper.totalScore }}分</text></view>
      <view class="summary-row"><text class="s-label">难度分布</text><text class="s-val">基础{{ currentPaper.diffBasic }}% / 中等{{ currentPaper.diffMedium }}% / 拔高{{ currentPaper.diffHard }}%</text></view>
    </view>

    <!-- 导出格式选择 -->
    <view class="export-card">
      <text class="section-title">导出格式</text>
      <view class="export-options">
        <view class="export-item" @tap="handleExportWord">
          <view class="export-icon-wrap word"><text class="export-icon">W</text></view>
          <text class="export-name">Word版本</text>
          <text class="export-desc">可编辑修改</text>
          <view class="export-price"><text>¥1/2次</text></view>
        </view>
        <view class="export-item" @tap="handleExportPdf">
          <view class="export-icon-wrap pdf"><text class="export-icon">PDF</text></view>
          <text class="export-name">PDF版本</text>
          <text class="export-desc">直接打印使用</text>
          <view class="export-tag free"><text>VIP免费</text></view>
        </view>
      </view>
    </view>

    <!-- 题目详情列表 -->
    <view class="section-card">
      <text class="section-title">题目预览（点击查看答案与解析）</text>
      <view v-for="(q, idx) in currentPaper.questions" :key="idx" class="question-card" @tap="toggleDetail(idx)">
        <view class="q-header">
          <text class="q-num">{{ idx + 1 }}.</text>
          <view class="q-tags">
            <view class="q-tag"><text>{{ q.type }}</text></view>
            <view class="q-tag score"><text>{{ q.score }}分</text></view>
            <view class="q-tag diff" :class="q.difficulty"><text>{{ diffLabel(q.difficulty) }}</text></view>
          </view>
          <text class="q-expand">{{ q._showDetail ? '▲' : '▼' }}</text>
        </view>
        <text class="q-content">{{ q.content }}</text>
        <view v-if="q.options && q.options.length" class="q-options">
          <text v-for="(opt, oi) in q.options" :key="oi" class="q-option">{{ labels[oi] }}. {{ opt }}</text>
        </view>

        <!-- 展开详情：答案 + 解析 -->
        <view v-if="q._showDetail" class="q-detail">
          <view class="q-answer">
            <text class="detail-label">正确答案</text>
            <text class="detail-value answer-text">{{ formatAnswer(q) }}</text>
          </view>
          <view class="q-analysis">
            <text class="detail-label">解析</text>
            <text class="detail-value">{{ q.analysis }}</text>
          </view>
        </view>

        <view class="q-actions">
          <view class="q-act-btn keep" :class="{ selected: q.keep }" @tap.stop="q.keep = true"><text>保留</text></view>
          <view class="q-act-btn" @tap.stop="replaceQuestion(idx)"><text>换题</text></view>
          <view class="q-act-btn" @tap.stop="editQuestion(idx)"><text>编辑</text></view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-actions">
        <view class="action-btn share" @tap="handleShare"><text class="action-icon">📤</text><text class="action-label">分享</text></view>
        <view class="action-btn print" @tap="handlePrint"><text class="action-icon">🖨</text><text class="action-label">打印</text></view>
        <view class="use-btn" @tap="handleUse"><text class="use-text">选用此卷 → 发布到班级</text></view>
      </view>
    </view>

    <view style="height: 180rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { showShareActionSheet } from '@/utils/share'
import { onLoad } from '@dcloudio/uni-app'

const userStore = useUserStore()

const activeTab = ref('A')
const tabs = [
  { key: 'A', label: 'A卷', desc: '基础巩固' },
  { key: 'B', label: 'B卷', desc: '能力提升' },
  { key: 'C', label: 'C卷', desc: '综合运用' },
]

const labels = ['A', 'B', 'C', 'D', 'E', 'F']

interface Question {
  type: string; content: string; options?: string[]; answer?: string | string[]; analysis: string;
  score: number; difficulty: 'easy' | 'medium' | 'hard'; keep: boolean; _showDetail?: boolean;
}

// 从上一页传入的配置
const config = ref({
  examType: '单元测试',
  selectedTypes: ['选择题', '填空题', '计算题'] as string[],
  count: 20,
  totalScore: 100,
  selectedChapters: [] as string[],
})

onLoad((options: any) => {
  if (options?.config) {
    try { config.value = JSON.parse(decodeURIComponent(options.config)) }
    catch { /* 使用默认值 */ }
  }
})

const papers = ref<Record<string, { type: string; count: number; totalScore: number; diffBasic: number; diffMedium: number; diffHard: number; questions: Question[] }>>({
  A: { type: '单元测试', count: 20, totalScore: 100, diffBasic: 70, diffMedium: 20, diffHard: 10, questions: [] },
  B: { type: '单元测试', count: 20, totalScore: 100, diffBasic: 40, diffMedium: 40, diffHard: 20, questions: [] },
  C: { type: '单元测试', count: 20, totalScore: 100, diffBasic: 30, diffMedium: 40, diffHard: 30, questions: [] },
})

// 初始化三套试卷的题目
function initPapers() {
  papers.value.A.questions = buildQuestions(70, 20, 10)
  papers.value.B.questions = buildQuestions(40, 40, 20)
  papers.value.C.questions = buildQuestions(30, 40, 30)
}
initPapers()

const currentPaper = computed(() => papers.value[activeTab.value as 'A' | 'B' | 'C'])

function diffLabel(d: string): string {
  return d === 'easy' ? '基础' : d === 'medium' ? '中等' : '拔高'
}

function formatAnswer(q: Question): string {
  if (!q.answer) return '（无）'
  if (Array.isArray(q.answer)) return q.answer.join(', ')
  return q.answer
}

function toggleDetail(idx: number) {
  const q = currentPaper.value.questions[idx]
  q._showDetail = !q._showDetail
}

// ====== 题目生成引擎 ======

const questionBank = {
  easy: [
    { content: '一元二次方程 x² - 5x + 6 = 0 的两个根是（  ）', options: ['x=1, x=6', 'x=2, x=3', 'x=2, x=-3', 'x=-2, x=-3'], answer: 'B', analysis: '因式分解得 (x-2)(x-3)=0，所以 x=2 或 x=3。' },
    { content: '下列各式中，是二次函数的是（  ）', options: ['y = 2x + 1', 'y = x² + 3x - 1', 'y = 1/x', 'y = √x'], answer: 'B', analysis: '二次函数的标准形式为 y = ax² + bx + c (a≠0)，只有B选项符合。' },
    { content: '计算 (a²)³ 的结果是（  ）', options: ['a⁵', 'a⁶', 'a⁸', 'a⁹'], answer: 'B', analysis: '幂的乘方运算：(a²)³ = a^(2×3) = a⁶' },
    { content: '不等式 2x - 3 > 5 的解集是（  ）', options: ['x > 1', 'x > 4', 'x < 4', 'x > -1'], answer: 'B', analysis: '2x - 3 > 5，移项得 2x > 8，两边同时除以2得 x > 4。' },
    { content: '在平面直角坐标系中，点 P(3, -2) 关于 x 轴对称的点的坐标是（  ）', options: ['(-3, -2)', '(3, 2)', '(-3, 2)', '(3, -2)'], answer: 'B', analysis: '关于 x 轴对称，(x, y) → (x, -y)，所以 P(3, -2) → (3, 2)。' },
    { content: '函数 y = √(x - 2) 的自变量 x 的取值范围是（  ）', options: ['x > 2', 'x ≥ 2', 'x ≥ 0', 'x > 0'], answer: 'B', analysis: '二次根式有意义的条件：被开方数 ≥ 0，即 x - 2 ≥ 0，解得 x ≥ 2。' },
    { content: '计算：(-3) + 8 - 5 =（  ）', options: ['0', '10', '-16', '-6'], answer: 'A', analysis: '(-3) + 8 - 5 = 5 - 5 = 0。' },
  ],
  medium: [
    { content: '已知二次函数 y = ax² + bx + c 的图象开口向上，对称轴为 x = 2，且经过点 (1, 0)，则下列选项正确的是（  ）', options: ['a > 0, b = -4a', 'a < 0, b = 4a', 'a > 0, b = 4a', 'a < 0, b = -4a'], answer: 'A', analysis: '开口向上说明 a>0。对称轴 x = -b/(2a) = 2，所以 b = -4a。' },
    { content: '关于 x 的一元二次方程 kx² - (2k+1)x + k + 1 = 0 有两个不相等的实数根，则 k 的取值范围是（  ）', options: ['k > -1/4 且 k ≠ 0', 'k ≥ -1/4', 'k > -1/4', 'k < -1/4'], answer: 'A', analysis: 'Δ = (2k+1)² - 4k(k+1) = 4k²+4k+1-4k²-4k = 1 > 0，恒成立。但 k ≠ 0 保证是二次方程。' },
    { content: '如图，在 △ABC 中，DE∥BC，AD=3，DB=6，AE=2，则 EC 等于（  ）', options: ['3', '4', '5', '6'], answer: 'B', analysis: '由平行线分线段成比例：AD/DB = AE/EC，即 3/6 = 2/EC，EC = 4。' },
    { content: '若 x² + y² - 6x + 4y + 13 = 0，则 (x+y)² 的值为（  ）', options: ['-1', '1', '0', '25'], answer: 'B', analysis: '配方：(x-3)² + (y+2)² = 0，所以 x=3, y=-2。则 (x+y)² = 1² = 1。' },
    { content: '已知等腰三角形一腰上的高与底边的夹角为 45°，则这个等腰三角形的顶角为（  ）', options: ['45°', '60°', '90°', '120°'], answer: 'C', analysis: '设顶角为 θ，则底角为 (180°-θ)/2。腰上的高与底边夹角为45°，推出 θ=90°。' },
  ],
  hard: [
    { content: '已知函数 f(x) = x³ - 3x² + 2，若关于 x 的方程 f(x) = m 有三个不相等的实数根，则 m 的取值范围是（  ）', options: ['-2 < m < 2', '-2 ≤ m ≤ 2', 'm > 2', 'm < -2'], answer: 'A', analysis: '求导 f\'(x) = 3x²-6x = 3x(x-2)，极值点 x=0 (极大值2) 和 x=2 (极小值-2)。方程有三个根当且仅当 m 在极小值和极大值之间。' },
    { content: '若数列 {an} 满足 a₁ = 1，且 an+1 - an = 2n，则 a₂₀ 的值为（  ）', options: ['380', '381', '400', '420'], answer: 'B', analysis: 'a₂₀ = a₁ + Σ(2n)[n=1 to 19] = 1 + 2·(19·20/2) = 1 + 380 = 381。' },
    { content: '在 △ABC 中，∠A=60°，BC=6，AB+AC=10，则 △ABC 的面积为（  ）', options: ['6√3', '8√3', '4√3', '5√3'], answer: 'B', analysis: '由余弦定理和已知条件可解出 AB=4, AC=6（或交换），面积 S = (1/2)·AB·AC·sin60° = (1/2)·4·6·√3/2 = 8√3?' },
  ],
}

const banks = {
  '选择题': questionBank,
  '填空题': [
    { easy: [{ content: '一元二次方程 x² - 6x + 8 = 0 的根的判别式 Δ = __。', answer: '4', analysis: 'Δ = b² - 4ac = 36 - 32 = 4。' }] },
    { medium: [{ content: '若二次函数 y = ax² + bx + c 过点(0, 3)、点(2, 3)，则其对称轴为直线 x = __。', answer: '1', analysis: '两点纵坐标相同，对称轴在两点的中点处，x = (0+2)/2 = 1。' }] },
    { hard: [{ content: '数列 {an} 的前 n 项和 Sn = n² + n，则 a₅ = __。', answer: '10', analysis: 'a₅ = S₅ - S₄ = (25+5) - (16+4) = 30 - 20 = 10。' }] },
  ],
  '计算题': [
    { easy: [{ content: '解方程：x² - 3x - 4 = 0', answer: 'x₁=-1, x₂=4', analysis: '(x+1)(x-4)=0，所以 x=-1 或 x=4。' }] },
    { medium: [{ content: '解不等式组：{ 2x - 1 > 3, x + 4 ≤ 10 }，求 x 的整数解。', answer: 'x=3,4,5,6', analysis: '2x-1>3 → 2x>4 → x>2；x+4≤10 → x≤6。所以 2<x≤6，整数解为 3,4,5,6。' }] },
    { hard: [{ content: '已知抛物线 y = x² + bx + c 与 x 轴交于点 A(-1, 0) 和 B(3, 0)，求抛物线的表达式。', answer: 'y = x² - 2x - 3', analysis: '设 y = (x+1)(x-3) = x² - 2x - 3。' }] },
  ],
}

function pickDifficulty(base: number, med: number): 'easy' | 'medium' | 'hard' {
  const r = Math.random() * 100
  if (r < base) return 'easy'
  if (r < base + med) return 'medium'
  return 'hard'
}

function buildQuestions(easyPct: number, medPct: number, hardPct: number): Question[] {
  const questions: Question[] = []
  const types = config.value.selectedTypes.length ? config.value.selectedTypes : ['选择题', '填空题', '计算题']

  // 按百分比计算各类题目数量
  const easyCount = Math.round(20 * easyPct / 100) || 3
  const medCount = Math.round(20 * medPct / 100) || 1
  const hardCount = 20 - easyCount - medCount

  const allDiff = [
    ...Array(easyCount).fill('easy'),
    ...Array(medCount).fill('medium'),
    ...Array(hardCount).fill('hard'),
  ].sort(() => Math.random() - 0.5)

  const scores = [
    ...Array(5).fill(3), ...Array(10).fill(5), ...Array(5).fill(8),
  ].sort(() => Math.random() - 0.5)

  for (let i = 0; i < 20; i++) {
    const difficulty = allDiff[i] as 'easy' | 'medium' | 'hard'
    const qType = types[Math.floor(Math.random() * types.length)]

    let qData: any = null

    if (qType === '选择题') {
      const pool = questionBank[difficulty]
      const src = pool[Math.floor(Math.random() * pool.length)]
      qData = { type: qType, content: src.content, options: src.options, answer: src.answer, analysis: src.analysis }
    } else if (qType === '填空题') {
      const bank = banks['填空题']
      const diffBank = bank.find(b => b[difficulty])
      const src = diffBank![difficulty]![0]
      qData = { type: qType, content: src.content, answer: src.answer, analysis: src.analysis }
    } else {
      const bank = banks['计算题']
      const diffBank = bank.find(b => b[difficulty])
      const src = diffBank![difficulty]![0]
      qData = { type: qType, content: src.content, answer: src.answer, analysis: src.analysis }
    }

    questions.push({
      type: qType,
      content: qData.content,
      options: qData.options || [],
      answer: qData.answer || '',
      analysis: qData.analysis || '暂无解析',
      score: scores[i] || 5,
      difficulty,
      keep: false,
      _showDetail: false,
    })
  }

  return questions
}

function replaceQuestion(idx: number) {
  const q = currentPaper.value.questions[idx]
  const types = config.value.selectedTypes.length ? config.value.selectedTypes : ['选择题', '填空题', '计算题']
  const qType = types[Math.floor(Math.random() * types.length)]

  if (qType === '选择题') {
    const pool = questionBank[q.difficulty]
    const src = pool[(idx + 1) % pool.length]
    q.content = src.content
    q.options = src.options
    q.answer = src.answer
    q.analysis = src.analysis
  } else {
    q.content = q.content.replace('（已替换）', '') + ' （已替换）'
  }
  q.type = qType
  q.keep = true
  q._showDetail = false
  uni.showToast({ title: '已换题', icon: 'success' })
}

function editQuestion(_idx: number) {
  uni.showToast({ title: '长按题目可编辑（功能开发中）', icon: 'none', duration: 2000 })
}

function handleExportWord() {
  if (userStore.isVip) { doExportWord(); return }
  uni.showModal({
    title: '导出Word文档',
    content: '导出可编辑的Word文档需消耗1次使用额度(¥1/2次)，VIP用户免费使用。是否继续？',
    confirmText: '付费导出',
    success(res) { if (res.confirm) doExportWord() },
  })
}

function doExportWord() {
  uni.showLoading({ title: '正在生成Word文档...' })
  setTimeout(() => {
    uni.hideLoading()
    // 保存试卷数据到本地存储
    saveExportData('Word')
    uni.showModal({
      title: '生成成功',
      content: `${activeTab.value}卷Word文档已生成，可立即查看试卷内容。`,
      confirmText: '查看文件',
      cancelText: '返回',
      success(res) {
        if (res.confirm) uni.navigateTo({ url: '/pages/teacher/exam-gen/paper-view' })
      },
    })
  }, 1500)
}

function handleExportPdf() {
  if (userStore.isVip) { doExportPdf(); return }
  uni.showModal({
    title: '导出PDF文档',
    content: '导出PDF需VIP权限，开通VIP后可无限次导出。是否前往开通？',
    confirmText: '开通VIP',
    success(res) { if (res.confirm) uni.navigateTo({ url: '/pages/membership/index' }) },
  })
}

function doExportPdf() {
  uni.showLoading({ title: '正在生成PDF...' })
  setTimeout(() => {
    uni.hideLoading()
    saveExportData('PDF')
    uni.showModal({
      title: 'PDF生成成功',
      content: `${activeTab.value}卷PDF已生成，可查看试卷内容或分享给他人。`,
      confirmText: '查看文件', cancelText: '分享',
      success(res) { if (res.confirm) uni.navigateTo({ url: '/pages/teacher/exam-gen/paper-view' }); else handleShare() },
    })
  }, 1500)
}

function handleShare() {
  showShareActionSheet({
    title: `AI智能试卷-${activeTab.value}卷（${currentPaper.value.type}）`,
    summary: `共${currentPaper.value.count}题，满分${currentPaper.value.totalScore}分，难度分布：基础${currentPaper.value.diffBasic}%/中等${currentPaper.value.diffMedium}%/拔高${currentPaper.value.diffHard}%`,
    href: '',
  })
}

function handlePrint() {
  uni.showModal({
    title: '打印试卷',
    content: '小程序暂不支持直接打印，请先导出PDF后在电脑端打开打印。也可将试卷分享到微信在电脑端打开。',
    confirmText: '导出PDF', cancelText: '分享到微信',
    success(res) { if (res.confirm) handleExportPdf(); else handleShare() },
  })
}

function handleUse() {
  uni.showModal({
    title: '选用此卷',
    content: `确认使用${activeTab.value}卷？将跳转到发布作业页面`,
    success(res) {
      if (res.confirm) uni.redirectTo({ url: '/pages/teacher/homework-publish/index?from=examgen' })
    },
  })
}

function saveExportData(format: string) {
  const paper = currentPaper.value
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const exportData = {
    title: `AI智能试卷 - ${activeTab.value}卷`,
    type: paper.type,
    tab: activeTab.value,
    count: paper.count,
    totalScore: paper.totalScore,
    time: timeStr,
    format,
    questions: paper.questions.map(q => ({
      type: q.type,
      content: q.content,
      options: q.options || [],
      answer: q.answer || '',
      analysis: q.analysis,
      score: q.score,
      difficulty: q.difficulty,
    })),
  }
  uni.setStorageSync('exam_export_data', JSON.stringify(exportData))
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.tab-bar { display: flex; gap: 12rpx; margin-bottom: 20rpx; }
.tab-item { flex: 1; text-align: center; padding: 20rpx; background: var(--c-card); border-radius: 16rpx; border: 2rpx solid var(--c-border); }
.tab-item.active { border-color: var(--c-primary); background: rgba(91,123,255,0.1); }
.tab-label { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; }
.tab-item.active .tab-label { color: var(--c-primary); }
.tab-desc { font-size: 22rpx; color: var(--c-t3); }
.tab-item.active .tab-desc { color: var(--c-primary); }

.summary-card { background: var(--c-card); border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.summary-row { display: flex; justify-content: space-between; padding: 8rpx 0; }
.s-label { font-size: 24rpx; color: var(--c-t3); }
.s-val { font-size: 24rpx; color: var(--c-t1); font-weight: 600; }

.export-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.export-options { display: flex; gap: 16rpx; }
.export-item { flex: 1; background: #242838; border-radius: 16rpx; padding: 24rpx 16rpx; text-align: center; border: 2rpx solid var(--c-border); position: relative; }
.export-item:active { border-color: var(--c-primary); background: rgba(91,123,255,0.08); }
.export-icon-wrap { width: 80rpx; height: 80rpx; border-radius: 20rpx; margin: 0 auto 16rpx; display: flex; align-items: center; justify-content: center; }
.export-icon-wrap.word { background: linear-gradient(135deg, #2B579A, #4472C4); }
.export-icon-wrap.pdf { background: linear-gradient(135deg, #C62828, #E53935); }
.export-icon { font-size: 28rpx; font-weight: 800; color: #FFF; }
.export-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.export-desc { font-size: 22rpx; color: var(--c-t3); display: block; margin-bottom: 12rpx; }
.export-price { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; background: rgba(255,186,74,0.15); }
.export-price text { font-size: 22rpx; color: #FFBA4A; font-weight: 600; }
.export-tag.free { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; background: rgba(52,211,153,0.15); }
.export-tag.free text { font-size: 22rpx; color: #34D399; font-weight: 600; }

.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; border: 1rpx solid var(--c-border); }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.question-card { background: #242838; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; }
.q-header { display: flex; align-items: flex-start; gap: 12rpx; margin-bottom: 12rpx; }
.q-num { font-size: 28rpx; font-weight: 700; color: var(--c-primary); min-width: 48rpx; }
.q-tags { display: flex; gap: 8rpx; flex: 1; flex-wrap: wrap; }
.q-tag { padding: 4rpx 12rpx; border-radius: 6rpx; background: rgba(91,123,255,0.1); font-size: 20rpx; color: var(--c-primary); }
.q-tag.score { background: rgba(255,186,74,0.1); color: #FFBA4A; }
.q-tag.diff.easy { background: rgba(52,211,153,0.1); color: #34D399; }
.q-tag.diff.medium { background: rgba(255,186,74,0.1); color: #FFBA4A; }
.q-tag.diff.hard { background: rgba(255,107,107,0.1); color: #FF6B6B; }
.q-expand { font-size: 22rpx; color: var(--c-t3); padding-top: 4rpx; }
.q-content { font-size: 28rpx; color: var(--c-t1); line-height: 1.6; display: block; margin-bottom: 12rpx; }
.q-options { display: flex; flex-direction: column; gap: 8rpx; margin-bottom: 16rpx; }
.q-option { font-size: 26rpx; color: var(--c-t2); padding: 8rpx 16rpx; background: rgba(255,255,255,0.03); border-radius: 8rpx; }

/* 题目详情区域 */
.q-detail { border-top: 1rpx solid var(--c-border); padding-top: 16rpx; margin-top: 12rpx; }
.q-answer, .q-analysis { margin-bottom: 12rpx; }
.detail-label { font-size: 22rpx; color: var(--c-t3); display: block; margin-bottom: 6rpx; }
.detail-value { font-size: 26rpx; color: var(--c-t2); line-height: 1.5; display: block; }
.answer-text { color: #34D399; font-weight: 600; }

.q-actions { display: flex; gap: 12rpx; margin-top: 16rpx; }
.q-act-btn { padding: 8rpx 18rpx; border-radius: 10rpx; background: var(--c-card); border: 1rpx solid var(--c-border); font-size: 24rpx; color: var(--c-t2); }
.q-act-btn.keep.selected { border-color: #34D399; background: rgba(52,211,153,0.1); color: #34D399; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 20rpx 32rpx; background: var(--c-bg); border-top: 1rpx solid var(--c-border); padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
.bottom-actions { display: flex; align-items: center; gap: 16rpx; }
.action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100rpx; height: 88rpx; border-radius: 16rpx; background: var(--c-card); border: 1rpx solid var(--c-border); }
.action-btn:active { background: rgba(91,123,255,0.1); border-color: var(--c-primary); }
.action-icon { font-size: 32rpx; display: block; }
.action-label { font-size: 20rpx; color: var(--c-t3); margin-top: 2rpx; }
.use-btn { flex: 1; background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 16rpx; padding: 24rpx; text-align: center; }
.use-text { font-size: 28rpx; font-weight: 700; color: #FFF; }
</style>
