<template>
  <scroll-view scroll-y class="page-scroll" :style="{ height: '100vh' }">
    <view class="page">
      <!-- 头部 -->
      <view class="form-card">
        <text class="form-title">AI一键教案生成</text>
        <text class="form-desc">选学科、填课文，AI自动生成标准教案+大屏PPT框架</text>
      </view>

      <!-- 表单区 -->
      <view class="form-card">
        <!-- 学段 -->
        <view class="form-group">
          <text class="form-label">学段</text>
          <view class="chip-row">
            <view
              v-for="s in stages"
              :key="s"
              class="chip"
              :class="{ active: form.stage === s }"
              @tap="form.stage = s; form.grade = ''"
            >
              <text>{{ s }}</text>
            </view>
          </view>
        </view>

        <!-- 学科 -->
        <view class="form-group">
          <text class="form-label">学科</text>
          <view class="chip-row">
            <view
              v-for="s in subjects"
              :key="s"
              class="chip"
              :class="{ active: form.subject === s }"
              @tap="form.subject = s"
            >
              <text>{{ s }}</text>
            </view>
          </view>
        </view>

        <!-- 年级 -->
        <view class="form-group">
          <text class="form-label">年级</text>
          <view class="chip-row">
            <view
              v-for="g in currentGrades"
              :key="g"
              class="chip"
              :class="{ active: form.grade === g }"
              @tap="form.grade = g"
            >
              <text>{{ g }}</text>
            </view>
          </view>
        </view>

        <!-- 教材版本 -->
        <view class="form-group">
          <text class="form-label">教材版本</text>
          <view class="chip-row">
            <view
              v-for="v in textbookVersions"
              :key="v"
              class="chip"
              :class="{ active: form.textbookVersion === v }"
              @tap="form.textbookVersion = v"
            >
              <text>{{ v }}</text>
            </view>
          </view>
        </view>

        <!-- 课文全称 -->
        <view class="form-group">
          <text class="form-label">课文全称</text>
          <input
            v-model="form.lessonName"
            class="text-input"
            placeholder="请输入完整课文名称，如：荷塘月色"
            placeholder-style="color: #4D5466;"
            maxlength="100"
          />
        </view>

        <!-- 课时 -->
        <view class="form-group">
          <text class="form-label">课时（可选）</text>
          <view class="chip-row">
            <view
              v-for="p in periods"
              :key="p"
              class="chip"
              :class="{ active: form.period === p }"
              @tap="form.period = form.period === p ? '' : p"
            >
              <text>{{ p }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 生成按钮 -->
      <view class="gen-btn" :class="{ disabled: generating }" @tap="handleGenerate">
        <text v-if="!generating" class="gen-text">🤖 AI生成教案</text>
        <text v-else class="gen-text">生成中...</text>
      </view>

      <!-- 错误提示 -->
      <view v-if="errorMsg" class="error-card">
        <text class="error-text">{{ errorMsg }}</text>
      </view>

      <!-- 结果展示 -->
      <view v-if="result" class="result-area">
        <!-- Tab切换 -->
        <view class="result-tabs">
          <view
            class="result-tab"
            :class="{ active: activeTab === 'plan' }"
            @tap="activeTab = 'plan'"
          >
            <text>📋 教案</text>
          </view>
          <view
            class="result-tab"
            :class="{ active: activeTab === 'ppt' }"
            @tap="activeTab = 'ppt'"
          >
            <text>📊 PPT框架</text>
          </view>
        </view>

        <!-- 教案内容 -->
        <view v-if="activeTab === 'plan'" class="content-card">
          <view v-for="(section, idx) in planSections" :key="idx" class="content-section">
            <text class="content-section-title">{{ section.title }}</text>
            <text class="content-section-body">{{ section.body }}</text>
          </view>
        </view>

        <!-- PPT框架内容 -->
        <view v-if="activeTab === 'ppt'" class="content-card">
          <view v-for="(slide, idx) in pptSlides" :key="idx" class="ppt-slide">
            <view class="ppt-slide-header">
              <text class="ppt-slide-num">第{{ idx + 1 }}页</text>
            </view>
            <text class="ppt-slide-body">{{ slide }}</text>
          </view>
          <view v-if="pptSlides.length === 0" class="content-section">
            <text class="content-section-body">{{ rawResult }}</text>
          </view>
        </view>

        <!-- 元信息 -->
        <view class="meta-card">
          <text class="meta-text">生成条件：{{ form.stage }} · {{ form.subject }} · {{ form.grade }} · {{ form.textbookVersion }} · 《{{ form.lessonName }}》{{ form.period ? ' · ' + form.period : '' }}</text>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { request } from '@/utils/request';

// 选项数据
const stages = ['小学', '初中', '高中'];

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

const gradesMap: Record<string, string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三', '七年级', '八年级', '九年级'],
  '高中': ['高一', '高二', '高三'],
};

const textbookVersions = [
  '部编人教版', '北师大版', '苏教版', '粤教版', '沪教版', '湘教版',
  '鲁教版', '浙教版', '冀教版', '川教版', '外研版', '其他版本',
];

const periods = ['第1课时', '第2课时', '第3课时', '不指定'];

// 表单数据
const form = ref({
  stage: '初中',
  subject: '语文',
  grade: '初一',
  textbookVersion: '部编人教版',
  lessonName: '',
  period: '',
});

// 状态
const generating = ref(false);
const result = ref('');
const rawResult = ref('');
const errorMsg = ref('');
const activeTab = ref<'plan' | 'ppt'>('plan');

// 根据学段动态年级
const currentGrades = computed(() => {
  return gradesMap[form.value.stage] || [];
});

// 解析教案各章节
const planSections = computed(() => {
  const text = rawResult.value;
  if (!text) return [];

  const sections: { title: string; body: string }[] = [];

  // 尝试按常见教案标题分割
  const patterns = [
    '一、课本原文', '课本原文',
    '二、教案', '教案',
    '1. 教学目标', '教学目标',
    '2. 教学重难点', '教学重难点',
    '3. 课前准备', '课前准备',
    '4. 完整教学流程', '教学流程', '完整教学流程',
    '5. 板书设计', '板书设计',
    '6. 课后作业布置', '课后作业', '课后作业布置',
    '三、PPT内容框架', 'PPT内容框架', 'PPT框架',
  ];

  // 简单的分段逻辑：用大标题分割
  const lines = text.split('\n');
  let currentTitle = '教案内容';
  let currentBody = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 检查是否是新章节标题
    let isTitle = false;
    for (const p of patterns) {
      if (trimmed.startsWith(p) || trimmed === p) {
        if (currentBody.trim()) {
          sections.push({ title: currentTitle, body: currentBody.trim() });
        }
        currentTitle = trimmed;
        currentBody = '';
        isTitle = true;
        break;
      }
    }

    if (!isTitle) {
      currentBody += line + '\n';
    }
  }

  // 收尾
  if (currentBody.trim()) {
    sections.push({ title: currentTitle, body: currentBody.trim() });
  }

  // 如果解析不出，返回全文
  if (sections.length === 0) {
    return [{ title: '完整教案', body: text }];
  }

  return sections;
});

// 解析PPT页面
const pptSlides = computed(() => {
  const text = rawResult.value;
  if (!text) return [];

  // 尝试提取PPT部分
  const pptKeywords = ['PPT内容框架', 'PPT框架', '三、PPT', '授课PPT', 'PPT内容'];
  let pptStart = -1;
  for (const kw of pptKeywords) {
    const idx = text.indexOf(kw);
    if (idx !== -1) {
      pptStart = idx;
      break;
    }
  }

  if (pptStart === -1) return [];

  const pptText = text.substring(pptStart);

  // 按"第X页"或"Slide"分割
  const slides: string[] = [];
  const slidePattern = /第(\d+)页[：:\s]*/g;
  const parts = pptText.split(slidePattern);

  // 重新组装
  let i = 1;
  while (i < parts.length) {
    const num = parts[i];
    const content = parts[i + 1] || '';
    slides.push(content.trim());
    i += 2;
  }

  return slides.length > 0 ? slides : [pptText];
});

async function handleGenerate() {
  if (generating.value) return;

  // 验证
  if (!form.value.stage) { errorMsg.value = '请选择学段'; return; }
  if (!form.value.subject) { errorMsg.value = '请选择学科'; return; }
  if (!form.value.grade) { errorMsg.value = '请选择年级'; return; }
  if (!form.value.textbookVersion) { errorMsg.value = '请选择教材版本'; return; }
  if (!form.value.lessonName.trim()) { errorMsg.value = '请输入课文全称'; return; }

  errorMsg.value = '';
  generating.value = true;
  result.value = '';
  rawResult.value = '';

  uni.showLoading({ title: 'AI正在生成教案...' });

  try {
    const res = await request({
      url: '/ai/teaching-plan',
      method: 'POST',
      data: {
        stage: form.value.stage,
        subject: form.value.subject,
        grade: form.value.grade,
        textbookVersion: form.value.textbookVersion,
        lessonName: form.value.lessonName.trim(),
        period: form.value.period,
      },
    });

    if (res.code === 0 && res.data) {
      rawResult.value = res.data.content;
      result.value = res.data.content;
      activeTab.value = 'plan';
    } else {
      errorMsg.value = res.message || '生成失败，请重试';
    }
  } catch (e: any) {
    errorMsg.value = e.message || '网络错误，请检查网络后重试';
  } finally {
    generating.value = false;
    uni.hideLoading();
  }
}
</script>

<style scoped>
.page-scroll {
  background: #0F1118;
}
.page {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}

.form-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--c-border);
}

.form-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--c-t1);
  display: block;
  margin-bottom: 8rpx;
}

.form-desc {
  font-size: 24rpx;
  color: var(--c-t3);
  display: block;
}

.form-group {
  margin-bottom: 28rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 26rpx;
  color: var(--c-t2);
  display: block;
  margin-bottom: 12rpx;
  font-weight: 600;
}

.chip-row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.chip {
  padding: 14rpx 24rpx;
  border-radius: 14rpx;
  background: #242838;
  border: 2rpx solid var(--c-border);
  font-size: 26rpx;
  color: var(--c-t2);
}

.chip.active {
  border-color: var(--c-primary);
  background: rgba(91, 123, 255, 0.15);
  color: var(--c-primary);
  font-weight: 600;
}

.text-input {
  width: 100%;
  box-sizing: border-box;
  height: 80rpx;
  background: #242838;
  border: 2rpx solid var(--c-border);
  border-radius: 14rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: var(--c-t1);
}

.gen-btn {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 20rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(91, 123, 255, 0.3);
  margin-bottom: 16rpx;
}

.gen-btn.disabled {
  opacity: 0.6;
}

.gen-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFF;
}

.error-card {
  background: rgba(255, 107, 107, 0.1);
  border: 1rpx solid rgba(255, 107, 107, 0.3);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.error-text {
  font-size: 26rpx;
  color: #FF6B6B;
}

/* ============ 结果区 ============ */
.result-area {
  margin-top: 16rpx;
}

.result-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.result-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  background: var(--c-card);
  border: 2rpx solid var(--c-border);
  border-radius: 16rpx;
  font-size: 28rpx;
  color: var(--c-t2);
}

.result-tab.active {
  border-color: var(--c-primary);
  color: var(--c-primary);
  font-weight: 700;
  background: rgba(91, 123, 255, 0.08);
}

.content-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 32rpx;
  border: 1rpx solid var(--c-border);
  margin-bottom: 20rpx;
}

.content-section {
  margin-bottom: 32rpx;
}

.content-section:last-child {
  margin-bottom: 0;
}

.content-section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--c-primary);
  display: block;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid var(--c-border);
}

.content-section-body {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
}

.ppt-slide {
  background: #242838;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-left: 4rpx solid var(--c-primary);
}

.ppt-slide:last-child {
  margin-bottom: 0;
}

.ppt-slide-header {
  margin-bottom: 12rpx;
}

.ppt-slide-num {
  font-size: 24rpx;
  color: var(--c-primary);
  font-weight: 700;
}

.ppt-slide-body {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.8;
  white-space: pre-wrap;
}

.meta-card {
  background: rgba(145, 192, 255, 0.05);
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  border: 1rpx solid rgba(91, 123, 255, 0.15);
}

.meta-text {
  font-size: 22rpx;
  color: var(--c-t3);
  line-height: 1.5;
}
</style>
