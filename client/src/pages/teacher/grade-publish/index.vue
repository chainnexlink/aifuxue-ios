<template>
  <scroll-view scroll-y class="page">
    <!-- 角色切换 -->
    <view class="role-bar">
      <view class="role-chip" :class="{ active: role === 'subject' }" @tap="role = 'subject'"><text>科任老师</text></view>
      <view class="role-chip" :class="{ active: role === 'head' }" @tap="role = 'head'"><text>班主任</text></view>
    </view>

    <!-- 基本信息 -->
    <view class="form-card">
      <text class="form-title">{{ role === 'head' ? '班主任 - 多科成绩管理' : '发布成绩' }}</text>

      <!-- 选择班级 -->
      <view class="form-group">
        <text class="form-label">选择班级</text>
        <view class="class-select">
          <view v-for="cls in classList" :key="cls.id" class="class-chip" :class="{ active: selectedClassId === cls.id }" @tap="selectClass(cls.id)">
            <text>{{ cls.name }}</text>
            <text v-if="role === 'subject'" class="chip-sub">{{ cls.subjectCount }}科可选</text>
          </view>
        </view>
      </view>

      <!-- 科任老师：选择科目 -->
      <view v-if="role === 'subject'" class="form-group">
        <text class="form-label">当前科目</text>
        <view class="chip-row">
          <view v-for="sub in currentClassSubjects" :key="sub" class="chip" :class="{ active: selectedSubject === sub }" @tap="selectedSubject = sub">
            <text>{{ sub }}</text>
          </view>
        </view>
      </view>

      <!-- 考试名称 -->
      <view class="form-group">
        <text class="form-label">考试/测验名称</text>
        <input class="form-input" :value="examName" @input="examName = ($event as any).detail.value" placeholder="如：期中考试、第三章单元测验" placeholder-style="color: #4D5466;" />
      </view>

      <!-- 满分 -->
      <view class="form-group">
        <text class="form-label">满分</text>
        <input class="form-input" type="number" :value="fullScore" @input="fullScore = ($event as any).detail.value" placeholder="100" placeholder-style="color: #4D5466;" />
      </view>
    </view>

    <!-- Excel导入区 -->
    <view v-if="selectedClassId" class="form-card">
      <view class="import-header">
        <text class="form-title">成绩录入</text>
        <view class="import-actions">
          <view class="import-btn" @tap="showImport = !showImport">
            <text>📋 {{ showImport ? '收起' : '导入数据' }}</text>
          </view>
        </view>
      </view>

      <view v-if="showImport" class="import-area">
        <view class="import-tabs">
          <view class="import-tab" :class="{ active: importMode === 'paste' }" @tap="importMode = 'paste'"><text>粘贴数据</text></view>
          <view class="import-tab" :class="{ active: importMode === 'file' }" @tap="importMode = 'file'"><text>导入文件</text></view>
        </view>

        <!-- 粘贴模式 -->
        <view v-if="importMode === 'paste'" class="paste-area">
          <text class="import-hint">从Excel复制学生成绩数据，粘贴到下方（每行格式：姓名 TAB键 分数）</text>
          <textarea class="paste-input" :value="pasteText" @input="pasteText = ($event as any).detail.value" placeholder="示例：
张三  95
李四  88
王五  72
赵六  90" placeholder-style="color: #4D5466; font-size: 24rpx;" />
          <view class="paste-actions">
            <text class="paste-count">已识别 {{ parsedLines }} 行数据</text>
            <view class="paste-btn" @tap="handlePasteImport"><text>匹配学生</text></view>
          </view>
        </view>

        <!-- 文件导入模式 -->
        <view v-if="importMode === 'file'" class="file-area">
          <view class="file-drop" @tap="handleChooseFile">
            <text class="file-icon">📁</text>
            <text class="file-text">点击选择Excel文件（.xlsx / .xls）</text>
            <text class="file-hint">支持微信聊天中的文件</text>
          </view>
        </view>
      </view>

      <!-- 学生成绩列表 -->
      <view class="score-list">
        <view class="score-header">
          <text v-if="role === 'head'" class="col-name">姓名</text>
          <text v-if="role === 'head'" v-for="sub in allSubjects" :key="sub" class="col-subject">{{ sub }}</text>
          <text v-if="role === 'head'" class="col-total">总分</text>
          <text v-if="role === 'head'" class="col-avg">均分</text>
          <text v-if="role === 'subject'" style="flex:1;">姓名</text>
          <text v-if="role === 'subject'" style="width:160rpx; text-align:center;">分数</text>
        </view>
        <view v-for="(stu, idx) in displayStudents" :key="stu.id" class="student-row" :class="{ even: idx % 2 === 1 }">
          <!-- 科任老师视图 -->
          <template v-if="role === 'subject'">
            <view class="stu-info">
              <text class="stu-index">{{ idx + 1 }}</text>
              <text class="stu-name">{{ stu.name }}</text>
            </view>
            <input class="score-input" type="digit" :value="stu.score" @input="stu.score = ($event as any).detail.value" placeholder="分数" placeholder-style="color: #4D5466; font-size: 24rpx;" />
          </template>
          <!-- 班主任视图 -->
          <template v-if="role === 'head'">
            <text class="col-name">{{ stu.name }}</text>
            <text v-for="sub in allSubjects" :key="sub" class="col-subject score-cell" :class="{ 'score-low': getSubjectScore(stu, sub) < 60, 'score-high': getSubjectScore(stu, sub) >= 90 }">{{ getSubjectScore(stu, sub) || '-' }}</text>
            <text class="col-total score-total">{{ getTotalScore(stu) || '-' }}</text>
            <text class="col-avg">{{ getAvgScore(stu) || '-' }}</text>
          </template>
        </view>
      </view>

      <view class="score-footer">
        <text>已录入 {{ filledCount }}/{{ displayStudents.length }} 人</text>
      </view>
    </view>

    <!-- 科任老师：单科编辑入口（班主任视图下点击科目进入） -->
    <view v-if="role === 'head' && displayStudents.length" class="form-card">
      <text class="form-title">快速操作</text>
      <view class="quick-actions">
        <view v-for="sub in allSubjects" :key="sub" class="quick-chip" @tap="switchToSubject(sub)">
          <text>编辑{{ sub }}</text>
        </view>
        <view class="quick-chip export" @tap="handleExportGrades">
          <text>导出成绩表</text>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="submit-area">
      <view class="submit-btn" @tap="handlePublish">
        <text class="submit-text">{{ role === 'head' ? '发布多科成绩（通知学生与家长）' : '发布成绩（同步通知学生与家长）' }}</text>
      </view>
      <text v-if="role === 'head'" class="submit-hint">班主任发布将同步所有科目成绩</text>
    </view>

    <view style="height: 60rpx;"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// ====== 角色 ======
const role = ref<'subject' | 'head'>('subject');

// ====== 班级数据 ======
interface StudentScore {
  id: string;
  name: string;
  score: string;
  scores: Record<string, string>; // 多科成绩
}

interface ClassInfo {
  id: string;
  name: string;
  subjectCount: number;
  subjects: string[];
}

const classList = ref<ClassInfo[]>([
  { id: 'c1', name: '高一2班', subjectCount: 3, subjects: ['语文', '数学', '英语'] },
  { id: 'c2', name: '高一1班', subjectCount: 5, subjects: ['语文', '数学', '英语', '物理', '化学'] },
]);

const allStudentData: Record<string, StudentScore[]> = {
  'c1': [
    { id: 's1', name: '张三', score: '', scores: { '语文': '88', '数学': '95', '英语': '82' } },
    { id: 's2', name: '李四', score: '', scores: { '语文': '75', '数学': '68', '英语': '90' } },
    { id: 's3', name: '王五', score: '', scores: { '语文': '92', '数学': '88', '英语': '85' } },
    { id: 's4', name: '赵六', score: '', scores: { '语文': '66', '数学': '72', '英语': '58' } },
    { id: 's5', name: '钱七', score: '', scores: { '语文': '80', '数学': '90', '英语': '76' } },
    { id: 's6', name: '孙八', score: '', scores: { '语文': '45', '数学': '55', '英语': '62' } },
    { id: 's7', name: '周九', score: '', scores: { '语文': '96', '数学': '98', '英语': '94' } },
    { id: 's8', name: '吴十', score: '', scores: { '语文': '70', '数学': '75', '英语': '80' } },
  ],
  'c2': [
    { id: 's10', name: '陈一', score: '', scores: { '语文': '85', '数学': '90', '英语': '78', '物理': '82', '化学': '75' } },
    { id: 's11', name: '林二', score: '', scores: { '语文': '72', '数学': '65', '英语': '88', '物理': '70', '化学': '80' } },
    { id: 's12', name: '黄三', score: '', scores: { '语文': '90', '数学': '95', '英语': '92', '物理': '88', '化学': '85' } },
    { id: 's13', name: '郑四', score: '', scores: { '语文': '60', '数学': '58', '英语': '65', '物理': '55', '化学': '62' } },
    { id: 's14', name: '刘五', score: '', scores: { '语文': '78', '数学': '82', '英语': '75', '物理': '90', '化学': '88' } },
    { id: 's15', name: '杨六', score: '', scores: { '语文': '95', '数学': '92', '英语': '96', '物理': '85', '化学': '90' } },
  ],
};

const selectedClassId = ref('');
const examName = ref('');
const selectedSubject = ref('数学');
const fullScore = ref('100');
const displayStudents = ref<StudentScore[]>([]);

const currentClass = computed(() => classList.value.find(c => c.id === selectedClassId.value));
const currentClassSubjects = computed(() => currentClass.value?.subjects || []);
const allSubjects = computed(() => currentClass.value?.subjects || []);

// ====== Excel导入 ======
const showImport = ref(false);
const importMode = ref<'paste' | 'file'>('paste');
const pasteText = ref('');

const parsedLines = computed(() => {
  return pasteText.value.split('\n').filter(l => l.trim() && l.includes('\t')).length;
});

function selectClass(id: string) {
  selectedClassId.value = id;
  const data = allStudentData[id] || [];
  displayStudents.value = JSON.parse(JSON.stringify(data));
  if (currentClass.value?.subjects.length) {
    selectedSubject.value = currentClass.value.subjects[0];
  }
}

// ====== 粘贴导入 ======
function handlePasteImport() {
  if (!pasteText.value.trim()) {
    uni.showToast({ title: '请先粘贴数据', icon: 'none' });
    return;
  }

  const lines = pasteText.value.split('\n').filter(l => l.trim());
  let matched = 0;
  let unmatched: string[] = [];

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 2) continue;

    const name = parts[0].trim();
    const scoreVal = parts[1].trim();

    const stu = displayStudents.value.find(s => s.name === name);
    if (stu) {
      if (role.value === 'head') {
        stu.scores[selectedSubject.value] = scoreVal;
      } else {
        stu.score = scoreVal;
      }
      matched++;
    } else {
      unmatched.push(name);
    }
  }

  // 触发响应式更新
  displayStudents.value = [...displayStudents.value];

  if (unmatched.length > 0) {
    uni.showToast({
      title: `已匹配${matched}人，${unmatched.length}人未找到(${unmatched.slice(0, 3).join('、')}${unmatched.length > 3 ? '等' : ''})`,
      icon: 'none',
      duration: 3000,
    });
  } else {
    uni.showToast({ title: `成功匹配 ${matched} 名学生`, icon: 'success' });
  }
}

// ====== 文件导入 ======
function handleChooseFile() {
  // #ifdef MP-WEIXIN
  wx.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['xlsx', 'xls'],
    success(res: any) {
      uni.showLoading({ title: '上传解析中...' });
      // 上传到本地服务器解析
      uni.uploadFile({
        url: 'http://127.0.0.1:3000/api/grades/import-excel',
        filePath: res.tempFiles[0].path,
        name: 'file',
        success(uploadRes: any) {
          uni.hideLoading();
          try {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 0) {
              mergeExcelData(data.data);
            } else {
              uni.showToast({ title: data.message || '解析失败', icon: 'none' });
            }
          } catch {
            uni.showToast({ title: '解析结果异常', icon: 'none' });
          }
        },
        fail() {
          uni.hideLoading();
          uni.showToast({ title: '上传失败，请使用粘贴方式', icon: 'none' });
        },
      });
    },
    fail() {
      uni.showToast({ title: '已取消', icon: 'none' });
    },
  });
  // #endif

  // #ifndef MP-WEIXIN
  uni.showToast({ title: '请使用粘贴方式导入', icon: 'none', duration: 2000 });
  // #endif
}

function mergeExcelData(data: Array<{ name: string; score: string }>) {
  let matched = 0;
  for (const item of data) {
    const stu = displayStudents.value.find(s => s.name === item.name);
    if (stu) {
      if (role.value === 'head') {
        stu.scores[selectedSubject.value] = item.score;
      } else {
        stu.score = item.score;
      }
      matched++;
    }
  }
  displayStudents.value = [...displayStudents.value];
  uni.showToast({ title: `成功匹配 ${matched} 名学生`, icon: 'success' });
}

// ====== 成绩统计（班主任视图） ======
function getSubjectScore(stu: StudentScore, subject: string): string {
  return stu.scores[subject] || '';
}

function getTotalScore(stu: StudentScore): string {
  let total = 0;
  let hasScore = false;
  for (const sub of allSubjects.value) {
    const s = parseFloat(stu.scores[sub]);
    if (!isNaN(s)) { total += s; hasScore = true; }
  }
  return hasScore ? String(total) : '';
}

function getAvgScore(stu: StudentScore): string {
  let total = 0;
  let count = 0;
  for (const sub of allSubjects.value) {
    const s = parseFloat(stu.scores[sub]);
    if (!isNaN(s)) { total += s; count++; }
  }
  return count > 0 ? (total / count).toFixed(1) : '';
}

function switchToSubject(sub: string) {
  role.value = 'subject';
  selectedSubject.value = sub;
}

function handleExportGrades() {
  uni.showToast({ title: '成绩表已生成，请在文件管理中查看', icon: 'success', duration: 2000 });
}

// ====== 完成计数 ======
const filledCount = computed(() => {
  if (role.value === 'head') {
    return displayStudents.value.filter(s => getTotalScore(s) !== '').length;
  }
  return displayStudents.value.filter(s => s.score !== '').length;
});

// ====== 发布 ======
function handlePublish() {
  if (!selectedClassId.value) { uni.showToast({ title: '请选择班级', icon: 'none' }); return; }
  if (!examName.value) { uni.showToast({ title: '请填写考试名称', icon: 'none' }); return; }
  if (filledCount.value === 0) { uni.showToast({ title: '请至少录入一名学生的成绩', icon: 'none' }); return; }

  const confirmContent = role.value === 'head'
    ? `将发布"${examName.value}"的多科成绩给${filledCount.value}名学生，同时通知家长。确认发布？`
    : `将发布"${examName.value}"(${selectedSubject.value})成绩给${filledCount.value}名学生，同时通知家长。确认发布？`;

  uni.showModal({
    title: '确认发布',
    content: confirmContent,
    success(res) {
      if (res.confirm) {
        uni.showToast({ title: '成绩发布成功', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    },
  });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); height: 100vh; box-sizing: border-box; }

/* 角色切换 */
.role-bar { display: flex; gap: 12rpx; margin-bottom: 24rpx; }
.role-chip { flex: 1; text-align: center; padding: 20rpx; background: var(--c-card); border-radius: 14rpx; border: 2rpx solid var(--c-border); font-size: 28rpx; color: var(--c-t2); }
.role-chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 700; }

/* 表单卡片 */
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 24rpx; }
.form-group { margin-bottom: 24rpx; }
.form-group:last-child { margin-bottom: 0; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; font-weight: 600; }
.form-input { background: #242838; border-radius: 14rpx; padding: 0 24rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; color: var(--c-t1); width: 100%; box-sizing: border-box; border: 2rpx solid var(--c-border); }

.class-select { display: flex; flex-wrap: wrap; gap: 12rpx; }
.class-chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); display: flex; align-items: center; gap: 8rpx; }
.class-chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); }
.class-chip text:first-child { font-size: 26rpx; color: var(--c-t2); }
.class-chip.active text:first-child { color: var(--c-primary); font-weight: 600; }
.chip-sub { font-size: 20rpx; color: var(--c-t3); }

.chip-row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.chip { padding: 14rpx 24rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }

/* 导入区 */
.import-header { display: flex; justify-content: space-between; align-items: center; }
.import-header .form-title { margin-bottom: 0; }
.import-btn { padding: 12rpx 20rpx; border-radius: 10rpx; background: rgba(91,123,255,0.1); border: 1rpx solid var(--c-primary); }
.import-btn text { font-size: 24rpx; color: var(--c-primary); }

.import-area { margin-top: 20rpx; padding-top: 20rpx; border-top: 1rpx solid var(--c-border); }
.import-tabs { display: flex; gap: 0; margin-bottom: 20rpx; }
.import-tab { flex: 1; text-align: center; padding: 14rpx 0; font-size: 26rpx; color: var(--c-t3); border-bottom: 2rpx solid transparent; }
.import-tab.active { color: var(--c-primary); border-bottom-color: var(--c-primary); font-weight: 600; }

.import-hint { font-size: 22rpx; color: var(--c-t3); display: block; margin-bottom: 12rpx; line-height: 1.5; }
.paste-input { width: 100%; min-height: 200rpx; background: #242838; border-radius: 14rpx; padding: 20rpx; font-size: 24rpx; color: var(--c-t1); box-sizing: border-box; border: 2rpx solid var(--c-border); font-family: monospace; }
.paste-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }
.paste-count { font-size: 22rpx; color: var(--c-t3); }
.paste-btn { padding: 12rpx 28rpx; border-radius: 10rpx; background: var(--c-primary); }
.paste-btn text { font-size: 24rpx; color: #FFF; font-weight: 600; }

.file-area { margin-top: 8rpx; }
.file-drop { padding: 60rpx 32rpx; border-radius: 16rpx; border: 2rpx dashed var(--c-border); text-align: center; background: #242838; }
.file-icon { font-size: 48rpx; display: block; margin-bottom: 16rpx; }
.file-text { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 8rpx; }
.file-hint { font-size: 22rpx; color: var(--c-t3); }

/* 成绩列表 */
.score-list { margin-top: 20rpx; }
.score-header { display: flex; align-items: center; padding: 12rpx 0; border-bottom: 1rpx solid var(--c-border); }
.student-row { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid rgba(42,46,63,0.3); }
.student-row.even { background: rgba(255,255,255,0.02); }
.student-row:last-child { border-bottom: none; }

.stu-info { display: flex; align-items: center; gap: 16rpx; flex: 1; }
.stu-index { font-size: 22rpx; color: var(--c-t3); width: 36rpx; }
.stu-name { font-size: 28rpx; color: var(--c-t1); font-weight: 600; }

.score-input { width: 160rpx; background: #242838; border-radius: 12rpx; padding: 0 20rpx; height: 72rpx; line-height: 72rpx; font-size: 28rpx; color: var(--c-t1); text-align: center; border: 2rpx solid var(--c-border); }

/* 班主任视图列 */
.col-name { width: 100rpx; font-size: 26rpx; font-weight: 600; color: var(--c-t1); }
.col-subject { flex: 1; text-align: center; font-size: 22rpx; color: var(--c-t3); }
.col-total { width: 80rpx; text-align: center; font-size: 22rpx; color: var(--c-t3); }
.col-avg { width: 80rpx; text-align: center; font-size: 22rpx; color: var(--c-t3); }
.score-cell { font-size: 26rpx; color: var(--c-t2); font-weight: 600; }
.score-cell.score-low { color: #FF6B6B; }
.score-cell.score-high { color: #34D399; }
.score-total { font-size: 26rpx; color: var(--c-primary); font-weight: 700; }

.score-footer { padding: 16rpx 0; font-size: 24rpx; color: var(--c-primary); text-align: right; }

/* 快速操作 */
.quick-actions { display: flex; gap: 12rpx; flex-wrap: wrap; }
.quick-chip { padding: 12rpx 20rpx; border-radius: 10rpx; background: #242838; border: 1rpx solid var(--c-border); font-size: 24rpx; color: var(--c-t2); }
.quick-chip.export { border-color: var(--c-primary); color: var(--c-primary); }

/* 发布 */
.submit-area { padding: 20rpx 0 40rpx; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; }
.submit-text { font-size: 30rpx; font-weight: 700; color: #FFF; }
.submit-hint { font-size: 22rpx; color: var(--c-t3); text-align: center; display: block; margin-top: 12rpx; }
</style>
