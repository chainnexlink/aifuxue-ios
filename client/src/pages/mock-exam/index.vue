<template>
  <view class="mock-exam-page">
    <!-- 备考计划模式 -->
    <view v-if="type === 'plan'" class="plan-mode">
      <text class="page-title">生成备考计划</text>
      <view class="card">
        <view class="form-item">
          <text class="form-label">考试日期</text>
          <picker mode="date" @change="onDateChange">
            <view class="form-picker">
              <text>{{ examDate || '选择考试日期' }}</text>
              <text class="arrow">▸</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">考试科目</text>
          <picker :range="subjects" @change="onSubjectChange">
            <view class="form-picker">
              <text>{{ subject || '选择科目' }}</text>
              <text class="arrow">▸</text>
            </view>
          </picker>
        </view>
      </view>
      <view class="btn-primary" @tap="generatePlan">
        <text>生成计划</text>
      </view>

      <view v-if="planGenerated" class="plan-result card">
        <text class="plan-title">备考计划已生成</text>
        <view v-for="(day, idx) in planDays" :key="idx" class="plan-day">
          <text class="day-label">Day {{ idx + 1 }}</text>
          <text class="day-task">{{ day }}</text>
        </view>
      </view>
    </view>

    <!-- 模拟考试/押题卷模式 -->
    <view v-else class="exam-mode">
      <text class="page-title">{{ type === 'push' ? '押题卷设置' : '模拟考试设置' }}</text>
      <view class="card">
        <view class="form-item">
          <text class="form-label">学段</text>
          <picker :range="gradeLabels" @change="onGradeChange">
            <view class="form-picker">
              <text>{{ gradeLabel || '选择学段' }}</text>
              <text class="arrow">▸</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">考试科目</text>
          <picker :range="subjects" @change="onSubjectChange">
            <view class="form-picker">
              <text>{{ subject || '选择科目' }}</text>
              <text class="arrow">▸</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">地区</text>
          <picker :range="provinces" @change="onRegionChange">
            <view class="form-picker">
              <text>{{ selectedRegion || '选择地区' }}</text>
              <text class="arrow">▸</text>
            </view>
          </picker>
        </view>
        <view class="region-hint">
          <text>不同地区考卷结构和总分可能不同，可选择其他地区试卷</text>
        </view>
      </view>

      <view class="exam-info card">
        <text class="info-title">试卷结构预览</text>
        <view v-for="(sec, idx) in examConfig.sections" :key="idx" class="info-row">
          <text>{{ sec.name }}</text>
          <text>{{ sec.count }}题 × {{ sec.score }}分 = {{ sec.count * sec.score }}分</text>
        </view>
        <view class="info-row total"><text>总分</text><text>{{ examConfig.total }}分</text></view>
        <view class="info-row"><text>考试时长</text><text>{{ examConfig.duration }}分钟</text></view>
      </view>

      <view class="btn-primary" @tap="startExam">
        <text>生成并开始考试</text>
      </view>
    </view>

    <view class="btn-secondary back-btn" @tap="goBack">
      <text>返回</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const type = ref('exam'); // exam / push / plan
const subjects = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
const gradeLabels = ['小学', '初中', '高中', '大学'];
const subject = ref('');
const gradeLabel = ref('');
const gradeIndex = ref(-1);
const examDate = ref('');
const planGenerated = ref(false);
const planDays = ref<string[]>([]);

// ========== 地区选择 ==========
const provinces = [
  '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
  '广东', '广西', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '内蒙古', '西藏', '宁夏', '新疆',
];
const selectedRegion = ref('');
const showRegionPicker = ref(false);

// 初始化地区为用户注册地区
function initRegion() {
  const p = userStore.user?.province || '';
  if (p && provinces.includes(p)) {
    selectedRegion.value = p;
  } else if (provinces.length > 0) {
    selectedRegion.value = provinces[0];
  }
}

function onRegionChange(e: any) {
  selectedRegion.value = provinces[e.detail.value];
}

// ========== 考试配置数据 ==========
interface ExamSection {
  name: string;
  count: number;
  score: number;
}
interface ExamConfig {
  sections: ExamSection[];
  total: number;
  duration: number; // 分钟
}

// 主三科(语数英)在初中高中为150分, 其他科目及小学按地区有差异
function getExamConfig(grade: string, subj: string, region: string): ExamConfig {
  const isMain3 = ['数学', '语文', '英语'].includes(subj);

  // 高中
  if (grade === '高中') {
    if (isMain3) {
      // 高中语数英150分
      if (subj === '数学') {
        return {
          sections: [
            { name: '选择题', count: 12, score: 5 },
            { name: '填空题', count: 4, score: 5 },
            { name: '解答题', count: 6, score: 12 },
          ],
          total: 150, duration: 120,
        };
      }
      if (subj === '语文') {
        return {
          sections: [
            { name: '选择题', count: 10, score: 3 },
            { name: '文言文阅读', count: 4, score: 5 },
            { name: '现代文阅读', count: 3, score: 6 },
            { name: '作文', count: 1, score: 60 },
          ],
          total: 150, duration: 150,
        };
      }
      // 英语
      return {
        sections: [
          { name: '听力', count: 20, score: 1.5 },
          { name: '阅读理解', count: 15, score: 2 },
          { name: '完形填空', count: 15, score: 1 },
          { name: '语法填空', count: 10, score: 1.5 },
          { name: '书面表达', count: 1, score: 25 },
        ],
        total: 150, duration: 120,
      };
    }
    // 高中理综/文综单科 (全国卷通常100分/科)
    // 部分省份(江苏/上海/浙江等)有120分制
    const is120Region = ['江苏', '上海', '浙江', '北京', '天津'].includes(region);
    const baseTotal = is120Region ? 120 : 100;
    return {
      sections: [
        { name: '选择题', count: is120Region ? 15 : 12, score: is120Region ? 4 : 4 },
        { name: '填空题', count: is120Region ? 4 : 3, score: 5 },
        { name: '解答题', count: is120Region ? 4 : 3, score: is120Region ? 10 : 12 },
      ],
      total: baseTotal,
      duration: is120Region ? 100 : 75,
    };
  }

  // 初中
  if (grade === '初中') {
    if (isMain3) {
      if (subj === '数学') {
        // 部分地区120分(北京/上海/广东), 部分150分(江苏/安徽)
        const is150Region = ['江苏', '安徽', '河南', '四川', '湖南'].includes(region);
        const total = is150Region ? 150 : 120;
        return {
          sections: [
            { name: '选择题', count: is150Region ? 12 : 10, score: is150Region ? 4 : 3 },
            { name: '填空题', count: is150Region ? 6 : 6, score: is150Region ? 5 : 4 },
            { name: '解答题', count: is150Region ? 7 : 6, score: is150Region ? 10 : 9 },
          ],
          total, duration: 120,
        };
      }
      if (subj === '语文') {
        const is150Region = ['江苏', '安徽', '河南', '四川', '湖南'].includes(region);
        const total = is150Region ? 150 : 120;
        return {
          sections: [
            { name: '积累运用', count: 8, score: is150Region ? 4 : 3 },
            { name: '阅读理解', count: 5, score: is150Region ? 12 : 10 },
            { name: '作文', count: 1, score: is150Region ? 60 : 50 },
          ],
          total, duration: 150,
        };
      }
      // 英语
      const is150Region = ['江苏', '安徽', '河南', '四川', '湖南'].includes(region);
      const total = is150Region ? 150 : 120;
      return {
        sections: [
          { name: '听力', count: 20, score: is150Region ? 2 : 1.5 },
          { name: '选择题', count: 15, score: is150Region ? 2 : 1 },
          { name: '完形填空', count: 10, score: is150Region ? 2 : 1.5 },
          { name: '阅读理解', count: 10, score: is150Region ? 2 : 2 },
          { name: '书面表达', count: 1, score: is150Region ? 20 : 15 },
        ],
        total, duration: is150Region ? 120 : 100,
      };
    }
    // 初中其他科目一般100分
    return {
      sections: [
        { name: '选择题', count: 15, score: 3 },
        { name: '填空题', count: 5, score: 3 },
        { name: '解答题', count: 4, score: 10 },
      ],
      total: 100, duration: 90,
    };
  }

  // 小学
  if (grade === '小学') {
    return {
      sections: [
        { name: '选择题', count: 10, score: 3 },
        { name: '填空题', count: 10, score: 2 },
        { name: '计算题', count: 5, score: 4 },
        { name: '应用题', count: 3, score: 10 },
      ],
      total: 100, duration: 90,
    };
  }

  // 大学(默认)
  return {
    sections: [
      { name: '选择题', count: 20, score: 2 },
      { name: '填空题', count: 5, score: 4 },
      { name: '解答题', count: 5, score: 12 },
    ],
    total: 120, duration: 120,
  };
}

const examConfig = computed<ExamConfig>(() => {
  return getExamConfig(
    gradeLabel.value || '高中',
    subject.value || '数学',
    selectedRegion.value || '北京',
  );
});

// ========== 事件处理 ==========
onLoad((options) => {
  if (options?.type) type.value = options.type;
  initRegion();
});

function onSubjectChange(e: any) { subject.value = subjects[e.detail.value]; }
function onGradeChange(e: any) {
  gradeIndex.value = Number(e.detail.value);
  gradeLabel.value = gradeLabels[gradeIndex.value];
}
function onDateChange(e: any) { examDate.value = e.detail.value; }

function generatePlan() {
  if (!examDate.value || !subject.value) {
    uni.showToast({ title: '请选择考试日期和科目', icon: 'none' });
    return;
  }
  planDays.value = [
    `复习${subject.value}基础概念，整理核心公式`,
    `做历年真题第一套，标记薄弱章节`,
    `针对薄弱点专项练习，重做错题`,
    `做历年真题第二套，计时模拟`,
    `查漏补缺，整理易错知识点卡片`,
    `考前最终模拟，保持状态`,
    `轻松复习，查看背诵卡`,
  ];
  planGenerated.value = true;
}

function startExam() {
  if (!subject.value) {
    uni.showToast({ title: '请选择考试科目', icon: 'none' });
    return;
  }
  if (!gradeLabel.value) {
    uni.showToast({ title: '请选择学段', icon: 'none' });
    return;
  }
  const config = examConfig.value;
  const configStr = encodeURIComponent(JSON.stringify(config));
  uni.navigateTo({
    url: `/pages/mock-exam/do/index?subject=${subject.value}&type=${type.value}&grade=${gradeLabel.value}&region=${selectedRegion.value}&config=${configStr}`,
  });
}

function goBack() { uni.navigateBack(); }
</script>

<style scoped>
.mock-exam-page { padding: 24rpx; background: #0F1118; min-height: 100vh; }
.page-title { font-size: 38rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 30rpx; }

.form-item { display: flex; justify-content: space-between; align-items: center; padding: 28rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.form-item:last-child { border-bottom: none; }
.form-label { font-size: 30rpx; color: #E8ECF4; }
.form-value { font-size: 28rpx; color: #8B92A5; }
.form-picker { display: flex; align-items: center; gap: 8rpx; color: #8B92A5; }
.arrow { color: #4D5466; }

.exam-info { margin-top: 24rpx; margin-bottom: 30rpx; }
.info-title { font-size: 30rpx; font-weight: 600; color: #E8ECF4; display: block; margin-bottom: 20rpx; }
.info-row { display: flex; justify-content: space-between; padding: 12rpx 0; font-size: 28rpx; color: #8B92A5; }
.info-row.total { font-weight: 700; color: #5B7BFF; border-top: 1rpx solid #2A2E3F; padding-top: 16rpx; margin-top: 8rpx; }

.plan-result { margin-top: 30rpx; }
.plan-title { font-size: 32rpx; font-weight: 700; color: #5B7BFF; display: block; margin-bottom: 24rpx; }
.plan-day { display: flex; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.day-label { font-size: 26rpx; font-weight: 600; color: #5B7BFF; white-space: nowrap; }
.day-task { font-size: 28rpx; color: #8B92A5; }

.region-hint { padding: 8rpx 0 0; }
.region-hint text { font-size: 22rpx; color: #4D5466; }

.back-btn { margin-top: 20rpx; }
</style>
