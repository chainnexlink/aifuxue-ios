<template>
  <view class="search-page">
    <!-- 搜索输入框 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <text class="s-icon">🔍</text>
        <input
          class="s-input"
          :value="keyword"
          @input="onInput"
          placeholder="搜索功能、笔记、作业..."
          placeholder-style="color: #4D5466;"
          focus
          confirm-type="search"
          @confirm="doSearch"
        />
        <text v-if="keyword" class="s-clear" @tap="clearKeyword">✕</text>
      </view>
      <text class="cancel-btn" @tap="goBack">取消</text>
    </view>

    <!-- 搜索结果 -->
    <view class="result-area">
      <!-- 无关键词时显示热门搜索 -->
      <view v-if="!keyword" class="hot-section">
        <text class="hot-title">热门搜索</text>
        <view class="hot-tags">
          <view v-for="tag in hotTags" :key="tag" class="hot-tag" @tap="keyword = tag; doSearch()">
            <text class="hot-tag-text">{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 功能匹配 -->
      <view v-if="keyword && matchedFeatures.length > 0" class="section">
        <text class="section-label">功能</text>
        <view v-for="item in matchedFeatures" :key="item.path" class="result-item" @tap="goFeature(item)">
          <text class="ri-icon">{{ item.icon }}</text>
          <view class="ri-info">
            <text class="ri-name">{{ item.name }}</text>
            <text class="ri-desc">{{ item.desc }}</text>
          </view>
          <view class="ri-arrow"></view>
        </view>
      </view>

      <!-- 后端搜索结果 -->
      <view v-if="keyword && apiResults.length > 0" class="section">
        <text class="section-label">内容</text>
        <view v-for="item in apiResults" :key="item.id" class="result-item" @tap="goResult(item)">
          <text class="ri-icon">{{ typeIcon(item.type) }}</text>
          <view class="ri-info">
            <text class="ri-name">{{ item.title }}</text>
            <text class="ri-desc">{{ item.subtitle }}</text>
          </view>
          <view class="ri-arrow"></view>
        </view>
      </view>

      <!-- 无结果 -->
      <view v-if="keyword && searched && matchedFeatures.length === 0 && apiResults.length === 0" class="empty">
        <text class="empty-text">未找到相关结果</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/store/user';
import { searchApi } from '@/utils/api';

const userStore = useUserStore();
const keyword = ref('');
const searched = ref(false);
const apiResults = ref<any[]>([]);
let searchTimer: any = null;

// 角色判断
const isTeacher = computed(() => userStore.isTeacherView);

// 热门搜索标签
const hotTags = computed(() => {
  if (isTeacher.value) {
    return ['发布作业', 'AI出卷', '班级错题', '成绩发布', '教案生成'];
  }
  return ['课后笔记', '错题本', '模拟考试', '靶向练习', '英语口语'];
});

// 功能列表定义
interface FeatureItem {
  name: string;
  desc: string;
  icon: string;
  path: string;
  keywords: string[];
  roles: string[];
}

const allFeatures: FeatureItem[] = [
  // 学生功能
  { name: '课后笔记', desc: '拍照·AI整理·生成文档', icon: '📷', path: '/pages/notes/index', keywords: ['笔记', '拍照', '整理', '课堂'], roles: ['student'] },
  { name: '错题本', desc: '错题管理·错因分析', icon: '📝', path: '/pages/mistakes/index', keywords: ['错题', '错误', '订正', '纠错'], roles: ['student'] },
  { name: '靶向练习', desc: '针对薄弱点专项训练', icon: '🎯', path: '/pages/practice/index', keywords: ['练习', '靶向', '训练', '薄弱', '专项'], roles: ['student'] },
  { name: '模拟考试', desc: '在线模拟·限时答题', icon: '📋', path: '/pages/mock-exam/index', keywords: ['考试', '模拟', '限时', '答题', '测试'], roles: ['student'] },
  { name: '考前冲刺', desc: '考前重点复习', icon: '🚀', path: '/pages/exam-sprint/index', keywords: ['考前', '冲刺', '复习', '重点'], roles: ['student'] },
  { name: '英语口语', desc: '口语练习·AI评分', icon: '🗣️', path: '/pages/oral/index', keywords: ['英语', '口语', '听力', '发音', '英文'], roles: ['student'] },
  { name: '知识图谱', desc: '学科知识点掌握情况', icon: '🧠', path: '/pages/profile/knowledge-map/index', keywords: ['知识', '图谱', '掌握', '知识点'], roles: ['student'] },
  { name: '数据导出', desc: '导出学习报告', icon: '📊', path: '/pages/profile/export/index', keywords: ['导出', '报告', '数据', '下载'], roles: ['student'] },
  { name: '加入班级', desc: '通过邀请码加入老师的班级', icon: '🏫', path: '/pages/class/join/index', keywords: ['加入', '班级', '邀请码', '课堂'], roles: ['student'] },
  { name: '班级作业', desc: '查看老师布置的作业', icon: '📚', path: '/pages/class/homework/index', keywords: ['作业', '班级', '布置', '提交'], roles: ['student'] },
  { name: '我的成绩', desc: '查看考试成绩', icon: '📊', path: '/pages/class/grades/index', keywords: ['成绩', '考试', '分数', '排名'], roles: ['student'] },
  { name: 'VIP会员', desc: '解锁无限AI批改等功能', icon: '👑', path: '/pages/membership/index', keywords: ['会员', 'VIP', '购买', '开通', '订阅'], roles: ['student', 'teacher'] },
  // 教师功能
  { name: '发布作业', desc: '给班级学生布置作业', icon: '📝', path: '/pages/teacher/homework-publish/index', keywords: ['作业', '发布', '布置', '任务'], roles: ['teacher'] },
  { name: 'AI智能出卷', desc: 'AI自动生成试卷', icon: '📄', path: '/pages/teacher/exam-gen/index', keywords: ['出卷', '试卷', '考试', '生成', 'AI'], roles: ['teacher'] },
  { name: 'AI教案生成', desc: 'AI辅助编写教案', icon: '📋', path: '/pages/teacher/teaching-plan/index', keywords: ['教案', '备课', '课程', '生成', 'AI'], roles: ['teacher'] },
  { name: '班级错题集', desc: '查看班级共性错题', icon: '📊', path: '/pages/teacher/class-mistakes/index', keywords: ['错题', '班级', '共性', '分析'], roles: ['teacher'] },
  { name: '发布成绩', desc: '录入发布学生成绩', icon: '📊', path: '/pages/teacher/grade-publish/index', keywords: ['成绩', '发布', '录入', '分数'], roles: ['teacher'] },
  { name: '教材与教学信息', desc: '设置教材版本和进度', icon: '📚', path: '/pages/teacher/teaching-info/index', keywords: ['教材', '教学', '版本', '进度'], roles: ['teacher'] },
  { name: '我的积分', desc: '邀请学生赚积分', icon: '💎', path: '/pages/teacher/credits/index', keywords: ['积分', '邀请', '兑换', '奖励'], roles: ['teacher'] },
  { name: '教师认证', desc: '认证信息管理', icon: '📋', path: '/pages/teacher/auth/index', keywords: ['认证', '教师', '身份', '审核'], roles: ['teacher'] },
  // 家长功能
  { name: '使用时长管控', desc: '设置孩子使用时间', icon: '⏰', path: '/pages/settings/index?tab=time', keywords: ['时长', '管控', '时间', '限制'], roles: ['parent'] },
  { name: '作业完成情况', desc: '查看孩子作业进度', icon: '📚', path: '/pages/class/homework/index', keywords: ['作业', '完成', '进度', '提交'], roles: ['parent'] },
  { name: '成绩查看', desc: '查看孩子考试成绩', icon: '📊', path: '/pages/class/grades/index', keywords: ['成绩', '考试', '分数', '排名'], roles: ['parent'] },
  { name: '学习周报', desc: '每周学习情况汇总', icon: '📈', path: '/pages/parent/weekly-report/index', keywords: ['周报', '学习', '报告', '汇总'], roles: ['parent'] },
  { name: '多娃管理', desc: '管理多个孩子账号', icon: '👨‍👩‍👧‍👦', path: '/pages/settings/index?tab=grade', keywords: ['多娃', '孩子', '管理', '切换'], roles: ['parent'] },
];

// 本地模糊匹配功能
const matchedFeatures = computed(() => {
  if (!keyword.value.trim()) return [];
  const kw = keyword.value.trim().toLowerCase();
  const role = isTeacher.value ? 'teacher' : 'student';

  return allFeatures.filter(f => {
    if (!f.roles.includes(role)) return false;
    // 匹配名称
    if (f.name.toLowerCase().includes(kw)) return true;
    // 匹配描述
    if (f.desc.toLowerCase().includes(kw)) return true;
    // 匹配关键词
    return f.keywords.some(k => k.includes(kw) || kw.includes(k));
  }).slice(0, 8);
});

// 输入防抖
function onInput(e: any) {
  keyword.value = e.detail.value;
  searched.value = false;
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (keyword.value.trim()) {
      doSearch();
    }
  }, 500);
}

// 执行后端搜索
async function doSearch() {
  if (!keyword.value.trim()) return;
  searched.value = true;
  try {
    const role = isTeacher.value ? 'teacher' : 'student';
    const res = await searchApi.search(keyword.value.trim(), role);
    apiResults.value = res.results || [];
  } catch {
    apiResults.value = [];
  }
}

function clearKeyword() {
  keyword.value = '';
  apiResults.value = [];
  searched.value = false;
}

function goBack() {
  uni.navigateBack();
}

function goFeature(item: FeatureItem) {
  if (item.path.startsWith('/pages/') && item.path.includes('index')) {
    // 判断是否是tabBar页面
    const tabPaths = ['/pages/home/index', '/pages/notes/index', '/pages/practice/index', '/pages/mistakes/index', '/pages/profile/index'];
    if (tabPaths.includes(item.path)) {
      uni.switchTab({ url: item.path });
    } else {
      uni.navigateTo({ url: item.path });
    }
  }
}

function goResult(item: any) {
  if (item.path) {
    uni.navigateTo({ url: item.path });
  }
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    note: '📒', mistake: '❌', homework: '📝', grade: '📊', student: '👤',
  };
  return map[type] || '📄';
}
</script>

<style scoped>
.search-page {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  padding-top: 88rpx;
  background: var(--c-card);
  border-bottom: 1rpx solid var(--c-border);
}
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: #242838;
  border-radius: 14rpx;
  padding: 16rpx 20rpx;
}
.s-icon { font-size: 28rpx; }
.s-input { flex: 1; font-size: 28rpx; color: var(--c-t1); }
.s-clear { font-size: 28rpx; color: var(--c-t3); padding: 0 8rpx; }
.cancel-btn { font-size: 28rpx; color: var(--c-primary); white-space: nowrap; }

.result-area { padding: 24rpx 32rpx; }

.hot-section { margin-bottom: 40rpx; }
.hot-title { font-size: 28rpx; font-weight: 600; color: var(--c-t2); display: block; margin-bottom: 20rpx; }
.hot-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.hot-tag {
  background: var(--c-card);
  border: 1rpx solid var(--c-border);
  border-radius: 12rpx;
  padding: 12rpx 24rpx;
}
.hot-tag-text { font-size: 26rpx; color: var(--c-t2); }

.section { margin-bottom: 32rpx; }
.section-label { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 16rpx; font-weight: 600; }

.result-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
  background: var(--c-card);
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid var(--c-border);
}
.ri-icon { font-size: 36rpx; flex-shrink: 0; }
.ri-info { flex: 1; display: flex; flex-direction: column; gap: 4rpx; }
.ri-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); }
.ri-desc { font-size: 22rpx; color: var(--c-t3); }
.ri-arrow {
  width: 14rpx; height: 14rpx;
  border-right: 2.5rpx solid var(--c-t3);
  border-top: 2.5rpx solid var(--c-t3);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.empty { text-align: center; padding: 80rpx 0; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }
</style>
