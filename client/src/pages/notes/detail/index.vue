<template>
  <view class="detail-page">
    <view v-if="loading" class="loading-state">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <template v-else-if="note">
      <!-- 笔记标题 + 学科标签 -->
      <view class="note-header">
        <text class="note-title">{{ note.title }}</text>
        <view class="note-meta">
          <text v-if="note.subject" class="meta-tag">{{ note.subject }}</text>
          <text class="meta-time">{{ formatTime(note.createdAt) }}</text>
        </view>
      </view>

      <!-- 笔记正文 (Markdown渲染) -->
      <view class="note-body">
        <rich-text :nodes="renderedContent" />

        <!-- 锁定遮罩 -->
        <view v-if="note.isLocked" class="lock-overlay">
          <view class="lock-content">
            <view class="lock-icon-wrap">
              <view class="lock-arc"></view>
              <view class="lock-body"></view>
            </view>
            <text class="lock-text">查看完整笔记</text>
            <view class="unlock-btn" @tap="unlockNote">
              <text>看广告解锁</text>
            </view>
            <text class="lock-hint">每天可免费解锁3次</text>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view v-if="!note.isLocked" class="action-bar safe-bottom">
        <view class="action-item" @tap="exportPdf">
          <view class="ai-icon ai-export">
            <view class="aie-body"></view>
            <view class="aie-arrow"></view>
          </view>
          <text class="action-label">导出PDF</text>
        </view>
        <view class="action-item" @tap="exportImage">
          <view class="ai-icon ai-image">
            <view class="aii-frame"></view>
          </view>
          <text class="action-label">生成长图</text>
        </view>
        <view class="action-item" @tap="shareNote">
          <view class="ai-icon ai-share">
            <view class="ais-dot d1"></view>
            <view class="ais-dot d2"></view>
            <view class="ais-dot d3"></view>
            <view class="ais-line l1"></view>
            <view class="ais-line l2"></view>
          </view>
          <text class="action-label">分享</text>
        </view>
        <view class="action-item" @tap="generateExercise">
          <view class="ai-icon ai-target">
            <view class="ait-ring"></view>
            <view class="ait-dot"></view>
          </view>
          <text class="action-label">生成练习</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { notesApi } from '@/utils/api';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import { hasFreeQuota, consumeFreeQuota, getQuotaText } from '@/utils/daily-limit';

const noteId = ref('');
const note = ref<any>(null);
const loading = ref(true);

onLoad((options) => {
  if (options?.id) {
    noteId.value = options.id;
    loadNote();
  }
});

const mockNotes: Record<string, any> = {
  '1': {
    id: '1', title: '高一数学 · 导数与极值课堂笔记', subject: '数学',
    isLocked: false, canExport: true,
    createdAt: new Date().toISOString(),
    markdownContent: `# 导数与极值\n\n## 一、导数的定义\n\n导数是函数在某一点处的变化率，表示为 **f\'(x)**。\n\n- 导数的几何意义：曲线在某点处的切线斜率\n- 导数的物理意义：瞬时变化率\n\n## 二、基本求导公式\n\n- **(x^n)\' = nx^(n-1)**\n- **(sin x)\' = cos x**\n- **(cos x)\' = -sin x**\n- **(e^x)\' = e^x**\n- **(ln x)\' = 1/x**\n\n## 三、极值判定\n\n- f\'(x₀) = 0 且 f\'\'(x₀) < 0 → 极大值\n- f\'(x₀) = 0 且 f\'\'(x₀) > 0 → 极小值`,
  },
  '2': {
    id: '2', title: '英语语法 · 虚拟语气专题', subject: '英语',
    isLocked: false, canExport: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    markdownContent: `# 虚拟语气\n\n## 一、与现在事实相反\n\n- 条件句：If + S + **did/were**\n- 主句：S + **would/could/might** + do\n\n## 二、与过去事实相反\n\n- 条件句：If + S + **had done**\n- 主句：S + **would/could/might** + have done\n\n## 三、与将来事实相反\n\n- 条件句：If + S + **should/were to** + do\n- 主句：S + **would/could/might** + do\n\n## 四、常见固定句型\n\n- I wish + 从句（虚拟）\n- It is time that + S + did\n- Would rather + S + did`,
  },
  '3': {
    id: '3', title: '物理力学 · 自由落体运动', subject: '物理',
    isLocked: true, canExport: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    markdownContent: `# 自由落体运动\n\n## 一、基本概念\n\n自由落体是指物体仅在重力作用下从静止开始下落的运动。\n\n## 二、公式\n\n- **v = gt**\n- **h = ½gt²**\n- **v² = 2gh**\n\n其中 g ≈ 9.8 m/s²\n\n## 三、重要结论\n\n- 自由落体是匀加速直线运动\n- 加速度恒为g，与质量无关`,
  },
};

async function loadNote() {
  loading.value = true;
  try {
    note.value = await notesApi.getById(noteId.value);
  } catch {
    // Mock模式下使用本地mock数据
    note.value = mockNotes[noteId.value] || mockNotes['1'];
  }
  finally { loading.value = false; }
}

const renderedContent = computed(() => {
  if (!note.value?.markdownContent) return '';
  let html = note.value.markdownContent
    .replace(/### (.+)/g, '<h3 style="font-size:16px;font-weight:bold;margin:12px 0 6px;">$1</h3>')
    .replace(/## (.+)/g, '<h2 style="font-size:18px;font-weight:bold;margin:16px 0 8px;">$1</h2>')
    .replace(/# (.+)/g, '<h1 style="font-size:20px;font-weight:bold;margin:20px 0 10px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/- (.+)/g, '<div style="padding-left:12px;margin:4px 0;">&#8226; $1</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
});

async function unlockNote() {
  try {
    await notesApi.unlock(noteId.value);
    uni.showToast({ title: '解锁成功', icon: 'success' });
    loadNote();
  } catch {}
}

async function exportPdf() {
  if (hasFreeQuota('NOTE_EXPORT')) {
    consumeFreeQuota('NOTE_EXPORT');
    uni.navigateTo({ url: '/pages/profile/export/index' });
  } else {
    const ok = await tryPlayAd(AD_UNIT_IDS.NOTE_EXPORT, '笔记导出');
    if (ok) uni.navigateTo({ url: '/pages/profile/export/index' });
  }
}

async function exportImage() {
  if (hasFreeQuota('NOTE_EXPORT')) {
    consumeFreeQuota('NOTE_EXPORT');
    uni.navigateTo({ url: '/pages/profile/export/index' });
  } else {
    const ok = await tryPlayAd(AD_UNIT_IDS.NOTE_EXPORT, '笔记导出');
    if (ok) uni.navigateTo({ url: '/pages/profile/export/index' });
  }
}

function shareNote() {
  uni.navigateTo({ url: `/pages/profile/export/index` });
}

async function generateExercise() {
  if (hasFreeQuota('TARGET_PRACTICE')) {
    consumeFreeQuota('TARGET_PRACTICE');
    uni.navigateTo({ url: `/pages/exercise/index?noteId=${noteId.value}` });
  } else {
    const ok = await tryPlayAd(AD_UNIT_IDS.TARGET_PRACTICE, '靶向练习');
    if (ok) uni.navigateTo({ url: `/pages/exercise/index?noteId=${noteId.value}` });
  }
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
</script>

<style scoped>
.detail-page {
  --c-primary: #5B7BFF;
  --c-primary-bg: rgba(91,123,255,0.15);
  --c-t1: #E8ECF4;
  --c-t3: #4D5466;
  --c-danger: #FF6B6B;
  --c-card: #1A1D2E;
  --c-border: #2A2E3F;
  padding: 24rpx 32rpx;
  padding-bottom: 160rpx;
  background: #0F1118;
  min-height: 100vh;
  box-sizing: border-box;
}

.loading-state {
  display: flex; flex-direction: column;
  align-items: center; padding-top: 200rpx; gap: 16rpx;
}
.loading-spinner {
  width: 48rpx; height: 48rpx;
  border: 4rpx solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 28rpx; color: var(--c-t3); }

.note-header {
  background: var(--c-card); border-radius: 20rpx;
  padding: 28rpx 24rpx; margin-bottom: 16rpx;
  border: 1rpx solid var(--c-border);
}
.note-title { font-size: 38rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 16rpx; }
.note-meta { display: flex; gap: 16rpx; align-items: center; }
.meta-tag { font-size: 24rpx; color: var(--c-primary); background: var(--c-primary-bg); padding: 4rpx 16rpx; border-radius: 8rpx; }
.meta-time { font-size: 24rpx; color: var(--c-t3); }

.note-body {
  background: var(--c-card); border-radius: 20rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid var(--c-border);
  position: relative; min-height: 400rpx;
  font-size: 30rpx; line-height: 1.8; color: #8B92A5;
}

.lock-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; height: 70%;
  background: linear-gradient(to bottom, rgba(15,17,24,0) 0%, rgba(15,17,24,0.95) 30%, #0F1118 100%);
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 40rpx;
}
.lock-content { display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.lock-icon-wrap { width: 48rpx; height: 56rpx; position: relative; }
.lock-arc {
  width: 28rpx; height: 18rpx;
  border: 4rpx solid var(--c-t3);
  border-radius: 14rpx 14rpx 0 0; border-bottom: none;
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
}
.lock-body {
  width: 36rpx; height: 28rpx;
  background: var(--c-t3); border-radius: 4rpx;
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
}
.lock-text { font-size: 30rpx; font-weight: 600; color: var(--c-t1); }
.unlock-btn {
  background: linear-gradient(135deg, #3D56C6, #5B7BFF);
  color: #FFF; padding: 20rpx 80rpx;
  border-radius: 16rpx; font-size: 28rpx; font-weight: 600;
}
.lock-hint { font-size: 24rpx; color: var(--c-t3); }

/* Action Bar */
.action-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--c-card);
  display: flex; justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid var(--c-border);
}
.action-item {
  display: flex; flex-direction: column;
  align-items: center; gap: 6rpx; padding: 8rpx 20rpx;
}
.action-label { font-size: 22rpx; color: #8B92A5; }

/* Action Icons */
.ai-icon { width: 36rpx; height: 36rpx; position: relative; display: flex; align-items: center; justify-content: center; }

/* Export */
.aie-body { width: 20rpx; height: 24rpx; border: 2rpx solid #8B92A5; border-radius: 3rpx; }
.aie-arrow {
  width: 8rpx; height: 8rpx;
  border-right: 2rpx solid #8B92A5; border-top: 2rpx solid #8B92A5;
  transform: rotate(-45deg);
  position: absolute; top: 4rpx; right: 4rpx;
}

/* Image */
.aii-frame {
  width: 24rpx; height: 20rpx;
  border: 2rpx solid #8B92A5; border-radius: 3rpx;
  position: relative;
}
.aii-frame::after {
  content: '';
  width: 0; height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-bottom: 8rpx solid #8B92A5;
  position: absolute; bottom: 2rpx; left: 4rpx;
  transform: rotate(180deg);
}

/* Share */
.ai-share { }
.ais-dot {
  width: 8rpx; height: 8rpx;
  background: #8B92A5; border-radius: 50%;
  position: absolute;
}
.ais-dot.d1 { top: 2rpx; right: 2rpx; }
.ais-dot.d2 { bottom: 2rpx; left: 2rpx; }
.ais-dot.d3 { bottom: 2rpx; right: 2rpx; }
.ais-line {
  position: absolute;
  height: 2rpx; background: #8B92A5;
}
.ais-line.l1 { width: 16rpx; top: 10rpx; left: 6rpx; transform: rotate(-25deg); }
.ais-line.l2 { width: 16rpx; bottom: 10rpx; left: 6rpx; transform: rotate(25deg); }

/* Target */
.ait-ring {
  width: 24rpx; height: 24rpx;
  border: 2rpx solid var(--c-primary); border-radius: 50%;
}
.ait-dot {
  width: 8rpx; height: 8rpx;
  background: var(--c-primary); border-radius: 50%;
  position: absolute;
}
</style>
