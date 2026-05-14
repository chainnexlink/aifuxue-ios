<template>
  <div class="app-layout">
    <!-- 移动端顶部栏 -->
    <div class="mobile-header">
      <button class="hamburger-btn" @click="toggleSidebar">☰</button>
      <span class="mobile-title">爱辅学</span>
      <button class="top-btn" @click="activeMenu = 'membership'; closeSidebar()">
        <span v-if="!isVip" class="vip-badge">VIP</span>
        <span v-else class="vip-badge active">VIP</span>
      </button>
    </div>

    <!-- 遮罩层 -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- 侧边栏 -->
    <aside :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-brand">
        <div class="sb-logo"><span>AI</span></div>
        <span class="sb-name">爱辅学</span>
      </div>

      <nav class="sidebar-nav">
        <div v-for="g in menuGroups" :key="g.title" class="nav-group">
          <span class="ng-title">{{ g.title }}</span>
          <a v-for="item in g.items" :key="item.id" :class="['nav-item', activeMenu === item.id ? 'active' : '']"
             @click="activeMenu = item.id; closeSidebar()">
            <span class="ni-icon">{{ item.icon }}</span>
            <span class="ni-text">{{ item.label }}</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ userName.charAt(0) }}</div>
          <div class="user-meta">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ roleLabel }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <h1 class="page-title">{{ currentPageTitle }}</h1>
        <div class="top-actions">
          <button class="top-btn" @click="activeMenu = 'membership'">
            <span v-if="!isVip" class="vip-badge">开通VIP</span>
            <span v-else class="vip-badge active">VIP</span>
          </button>
        </div>
      </header>

      <!-- 仪表盘首页 -->
      <div v-if="activeMenu === 'dashboard'" class="dashboard">
        <div class="welcome-card">
          <div class="wc-content">
            <h2>{{ greetingText }}，{{ userName }}</h2>
            <p v-if="userRole === 'student'">今日待完成：2份作业 | 推荐练习：3组靶向题</p>
            <p v-else-if="userRole === 'teacher'">今日待批改：5份作业 | 班级学生：87人</p>
            <p v-else>孩子本周学习时长：4.2小时 | 完成作业：8份</p>
          </div>
          <div class="wc-visual">📊</div>
        </div>

        <!-- 快捷入口 -->
        <div class="quick-grid">
          <div v-for="q in quickActions" :key="q.label" class="quick-card" @click="activeMenu = q.target">
            <span class="qc-icon">{{ q.icon }}</span>
            <span class="qc-label">{{ q.label }}</span>
          </div>
        </div>

        <!-- 数据概览 -->
        <div class="stats-row">
          <div v-for="s in statsData" :key="s.label" class="stat-card">
            <span class="st-value">{{ s.value }}</span>
            <span class="st-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- 最近动态 -->
        <div class="section-block">
          <h3>最近动态</h3>
          <div class="activity-list">
            <div v-for="a in recentActivities" :key="a.text" class="activity-item">
              <span class="ai-icon">{{ a.icon }}</span>
              <span class="ai-text">{{ a.text }}</span>
              <span class="ai-time">{{ a.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 拍照笔记 -->
      <div v-else-if="activeMenu === 'notes'" class="feature-page">
        <div class="fp-header">
          <h2>拍照笔记整理</h2>
          <p>上传课堂笔记图片，AI自动OCR识别并整理排版</p>
        </div>
        <div class="upload-area" @click="handleUpload" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-content">
            <span class="upload-icon">📷</span>
            <h3>点击上传或拖拽图片到此处</h3>
            <p>支持 JPG、PNG 格式，单次最多5张</p>
          </div>
        </div>
        <div class="note-history">
          <h3>历史笔记</h3>
          <div class="note-grid">
            <div v-for="n in sampleNotes" :key="n.title" class="note-card">
              <div class="nc-preview">{{ n.icon }}</div>
              <div class="nc-info">
                <span class="nc-title">{{ n.title }}</span>
                <span class="nc-date">{{ n.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错题诊断 -->
      <div v-else-if="activeMenu === 'mistakes'" class="feature-page">
        <div class="fp-header">
          <h2>AI错题诊断</h2>
          <p>拍照上传错题，AI自动识别知识点、分析错因、给出避错建议</p>
        </div>
        <div class="upload-area" @click="handleUpload">
          <div class="upload-content">
            <span class="upload-icon">🔍</span>
            <h3>拍照上传错题</h3>
            <p>AI将自动诊断知识点和错误原因</p>
          </div>
        </div>
        <div class="mistake-stats">
          <h3>错题统计</h3>
          <div class="ms-grid">
            <div class="ms-card"><span class="ms-val">23</span><span class="ms-label">本周错题</span></div>
            <div class="ms-card"><span class="ms-val">78%</span><span class="ms-label">巩固正确率</span></div>
            <div class="ms-card"><span class="ms-val">5</span><span class="ms-label">薄弱知识点</span></div>
            <div class="ms-card"><span class="ms-val">12</span><span class="ms-label">已消灭错题</span></div>
          </div>
        </div>
      </div>

      <!-- 靶向练习 -->
      <div v-else-if="activeMenu === 'practice'" class="feature-page">
        <div class="fp-header">
          <h2>靶向练习</h2>
          <p>基于你的笔记和错题，AI精准生成针对性练习题</p>
        </div>
        <div class="practice-options">
          <div v-for="p in practiceTypes" :key="p.label" class="po-card" @click="startPractice(p)">
            <span class="po-icon">{{ p.icon }}</span>
            <h4>{{ p.label }}</h4>
            <p>{{ p.desc }}</p>
            <span class="po-btn">开始练习</span>
          </div>
        </div>
        <div class="practice-history">
          <h3>练习记录</h3>
          <div class="ph-list">
            <div class="ph-item"><span>第三章一元二次方程 靶向练习</span><span class="ph-score">正确率 85%</span><span class="ph-date">今天</span></div>
            <div class="ph-item"><span>第二章函数 巩固练习</span><span class="ph-score">正确率 72%</span><span class="ph-date">昨天</span></div>
            <div class="ph-item"><span>英语Unit5词汇 判断题</span><span class="ph-score">正确率 90%</span><span class="ph-date">2天前</span></div>
          </div>
        </div>
      </div>

      <!-- 教师：班级管理 -->
      <div v-else-if="activeMenu === 'class'" class="feature-page">
        <div class="fp-header">
          <h2>班级管理</h2>
          <p>创建和管理班级，追踪学生学情</p>
        </div>
        <div class="class-list">
          <div class="class-card" v-for="c in classList" :key="c.name">
            <div class="cc-header">
              <h4>{{ c.name }}</h4>
              <span class="cc-code">{{ c.code }}</span>
            </div>
            <div class="cc-stats">
              <span>{{ c.students }}人</span>
              <span>作业完成率 {{ c.rate }}%</span>
            </div>
          </div>
          <div class="class-card add-card" @click="showCreateClass">
            <span class="add-icon">+</span>
            <span>创建新班级</span>
          </div>
        </div>
      </div>

      <!-- 教师：AI出卷 -->
      <div v-else-if="activeMenu === 'examgen'" class="feature-page">
        <div class="fp-header">
          <h2>AI智能出卷</h2>
          <p>基于教材版本和教学进度，AI生成三套不同难度试卷，支持导出Word/PDF</p>
        </div>
        <div class="exam-form">
          <div class="ef-row">
            <label>出卷范围</label>
            <div class="ef-chips">
              <span v-for="ch in ['第一章','第二章','第三章','第四章']" :key="ch" class="ef-chip">{{ ch }}</span>
            </div>
          </div>
          <div class="ef-row">
            <label>试卷类型</label>
            <div class="ef-chips">
              <span class="ef-chip active">单元测试</span>
              <span class="ef-chip">期中模拟</span>
              <span class="ef-chip">期末模拟</span>
            </div>
          </div>
          <div class="ef-row">
            <label>导出格式</label>
            <div class="export-options">
              <div class="eo-card">
                <span class="eo-icon word">W</span>
                <span>Word版 (可编辑)</span>
                <span class="eo-price">¥1/2次</span>
              </div>
              <div class="eo-card">
                <span class="eo-icon pdf">PDF</span>
                <span>PDF版 (直接打印)</span>
                <span class="eo-free">VIP免费</span>
              </div>
            </div>
          </div>
          <button class="gen-btn" @click="handleGenerate">🤖 AI生成三套试卷</button>
        </div>
      </div>

      <!-- 教师：作业管理 -->
      <div v-else-if="activeMenu === 'homework'" class="feature-page">
        <div class="fp-header">
          <h2>作业管理</h2>
          <p>发布在线/离线作业，AI自动批改</p>
        </div>
        <div class="hw-actions">
          <button class="btn-action" @click="showPublishHomework">+ 发布新作业</button>
        </div>
        <div class="hw-list">
          <div v-for="hw in homeworkList" :key="hw.title" class="hw-card">
            <div class="hw-info">
              <h4>{{ hw.title }}</h4>
              <span class="hw-meta">{{ hw.type }} · {{ hw.date }}</span>
            </div>
            <div class="hw-status">
              <span class="hw-rate">提交率 {{ hw.submitRate }}%</span>
              <span :class="['hw-tag', hw.status]">{{ hw.statusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 教师：发成绩 -->
      <div v-else-if="activeMenu === 'grades'" class="feature-page">
        <div class="fp-header">
          <h2>发布成绩</h2>
          <p>录入学生成绩，同步通知学生与家长</p>
        </div>
        <div class="grade-form">
          <div class="gf-header">
            <input type="text" placeholder="考试名称，如：期中考试" class="gf-input" />
            <select class="gf-select"><option>数学</option><option>语文</option><option>英语</option></select>
          </div>
          <div class="grade-table">
            <div class="gt-header"><span>学生姓名</span><span>成绩</span></div>
            <div v-for="s in gradeStudents" :key="s.name" class="gt-row">
              <span>{{ s.name }}</span>
              <input type="number" :placeholder="'满分' + s.full" class="gt-input" />
            </div>
          </div>
          <button class="submit-grade-btn">发布成绩并通知</button>
        </div>
      </div>

      <!-- 英语口语 -->
      <div v-else-if="activeMenu === 'oral'" class="feature-page">
        <div class="fp-header">
          <h2>英语口语练习</h2>
          <p>AI评分发音，精准提升口语能力</p>
        </div>
        <div class="oral-content">
          <div class="oral-sentence">
            <p class="os-en">"The quick brown fox jumps over the lazy dog."</p>
            <p class="os-cn">敏捷的棕色狐狸跳过了懒狗。</p>
          </div>
          <div class="oral-controls">
            <button class="oc-btn listen">🔊 听标准发音</button>
            <button class="oc-btn record">🎤 开始录音</button>
          </div>
          <div class="oral-scores">
            <div class="os-item"><span class="os-label">准确度</span><span class="os-val">85</span></div>
            <div class="os-item"><span class="os-label">流畅度</span><span class="os-val">78</span></div>
            <div class="os-item"><span class="os-label">完整度</span><span class="os-val">92</span></div>
          </div>
        </div>
      </div>

      <!-- AI教案生成 -->
      <div v-else-if="activeMenu === 'teachingplan'" class="feature-page">
        <div class="fp-header">
          <h2>AI一键教案生成</h2>
          <p>选学科、填课文，AI自动生成标准教案+大屏PPT框架</p>
        </div>

        <!-- 表单区 -->
        <div class="tp-form-card">
          <!-- 学段 -->
          <div class="tp-row">
            <label class="tp-label">学段</label>
            <div class="tp-chips">
              <span v-for="s in tpStages" :key="s" :class="['tp-chip', tpForm.stage === s ? 'active' : '']" @click="tpForm.stage = s; tpForm.grade = ''">{{ s }}</span>
            </div>
          </div>
          <!-- 学科 -->
          <div class="tp-row">
            <label class="tp-label">学科</label>
            <div class="tp-chips">
              <span v-for="s in tpSubjects" :key="s" :class="['tp-chip', tpForm.subject === s ? 'active' : '']" @click="tpForm.subject = s">{{ s }}</span>
            </div>
          </div>
          <!-- 年级 -->
          <div class="tp-row">
            <label class="tp-label">年级</label>
            <div class="tp-chips">
              <span v-for="g in tpCurrentGrades" :key="g" :class="['tp-chip', tpForm.grade === g ? 'active' : '']" @click="tpForm.grade = g">{{ g }}</span>
            </div>
          </div>
          <!-- 教材版本 -->
          <div class="tp-row">
            <label class="tp-label">教材版本</label>
            <div class="tp-chips">
              <span v-for="v in tpTextbookVersions" :key="v" :class="['tp-chip', tpForm.textbookVersion === v ? 'active' : '']" @click="tpForm.textbookVersion = v">{{ v }}</span>
            </div>
          </div>
          <!-- 课文全称 -->
          <div class="tp-row">
            <label class="tp-label">课文全称</label>
            <input v-model="tpForm.lessonName" class="tp-input" placeholder="请输入完整课文名称，如：荷塘月色" maxlength="100" />
          </div>
          <!-- 课时 -->
          <div class="tp-row">
            <label class="tp-label">课时（可选）</label>
            <div class="tp-chips">
              <span v-for="p in tpPeriods" :key="p" :class="['tp-chip', tpForm.period === p ? 'active' : '']" @click="tpForm.period = tpForm.period === p ? '' : p">{{ p }}</span>
            </div>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button class="tp-gen-btn" :disabled="tpGenerating" @click="handleTeachingPlanGenerate">
          {{ tpGenerating ? '🤖 正在生成...' : '🤖 AI生成教案' }}
        </button>

        <!-- 错误 -->
        <div v-if="tpErrorMsg" class="tp-error"><span>{{ tpErrorMsg }}</span></div>

        <!-- 结果 -->
        <div v-if="tpRawResult" class="tp-result">
          <div class="tp-tabs">
            <span :class="['tp-tab', tpActiveTab === 'plan' ? 'active' : '']" @click="tpActiveTab = 'plan'">📋 教案</span>
            <span :class="['tp-tab', tpActiveTab === 'ppt' ? 'active' : '']" @click="tpActiveTab = 'ppt'">📊 PPT框架</span>
          </div>
          <div v-if="tpActiveTab === 'plan'" class="tp-content">
            <div v-for="(sec, i) in tpPlanSections" :key="i" class="tp-section">
              <h3 class="tp-sec-title">{{ sec.title }}</h3>
              <pre class="tp-sec-body">{{ sec.body }}</pre>
            </div>
          </div>
          <div v-if="tpActiveTab === 'ppt'" class="tp-content">
            <div v-if="tpPptSlides.length === 0">
              <pre class="tp-sec-body">{{ tpRawResult }}</pre>
            </div>
            <div v-for="(s, i) in tpPptSlides" :key="i" class="tp-slide">
              <span class="tp-slide-num">第{{ i + 1 }}页</span>
              <pre class="tp-slide-body">{{ s }}</pre>
            </div>
          </div>
          <p class="tp-meta">生成条件：{{ tpForm.stage }} · {{ tpForm.subject }} · {{ tpForm.grade }} · {{ tpForm.textbookVersion }} · 《{{ tpForm.lessonName }}》{{ tpForm.period ? ' · ' + tpForm.period : '' }}</p>
        </div>
      </div>

      <!-- VIP会员 -->
      <div v-else-if="activeMenu === 'membership'" class="feature-page">
        <div class="fp-header">
          <h2>VIP会员</h2>
          <p>解锁全部高级功能，无广告畅学</p>
        </div>
        <div class="membership-content">
          <div class="vip-benefits">
            <div class="vb-item"><span>🚫</span><span>去除所有广告</span></div>
            <div class="vb-item"><span>♾️</span><span>AI功能无限次使用</span></div>
            <div class="vb-item"><span>📤</span><span>数据导出无限制</span></div>
            <div class="vb-item"><span>🤖</span><span>AI深度辅导</span></div>
          </div>
          <div class="plan-cards">
            <div v-if="userRole === 'teacher'" class="plan-cards-inner">
              <div :class="['plan-card', 'recommended', selectedPlan === 'cn.aifuxue.teacher.monthly' ? 'selected' : '']"
                   @click="selectedPlan = 'cn.aifuxue.teacher.monthly'">
                <span class="plan-badge">推荐</span>
                <h4>老师月度会员</h4>
                <div class="plan-price">
                  <span class="pp-amount">{{ getProductPrice('cn.aifuxue.teacher.monthly') || '¥30' }}</span>
                  <span class="pp-unit">/月</span>
                </div>
                <p>无限AI批改·出卷·导出</p>
              </div>
              <div :class="['plan-card', selectedPlan === 'cn.aifuxue.teacher.peruse' ? 'selected' : '']"
                   @click="selectedPlan = 'cn.aifuxue.teacher.peruse'">
                <h4>教师按次计费</h4>
                <div class="plan-price">
                  <span class="pp-amount">{{ getProductPrice('cn.aifuxue.teacher.peruse') || '¥1' }}</span>
                  <span class="pp-unit">/2次</span>
                </div>
                <p>AI批改/出卷/导出</p>
              </div>
            </div>
            <div v-else class="plan-cards-inner">
              <div :class="['plan-card', selectedPlan === 'cn.aifuxue.vip.monthly' ? 'selected' : '']"
                   @click="selectedPlan = 'cn.aifuxue.vip.monthly'">
                <h4>学生月度会员</h4>
                <div class="plan-price">
                  <span class="pp-amount">{{ getProductPrice('cn.aifuxue.vip.monthly') || '¥18' }}</span>
                  <span class="pp-unit">/月</span>
                </div>
              </div>
              <div :class="['plan-card', 'recommended', selectedPlan === 'cn.aifuxue.vip.yearly' ? 'selected' : '']"
                   @click="selectedPlan = 'cn.aifuxue.vip.yearly'">
                <span class="plan-badge">推荐</span>
                <h4>学生年度会员</h4>
                <div class="plan-price">
                  <span class="pp-amount">{{ getProductPrice('cn.aifuxue.vip.yearly') || '¥128' }}</span>
                  <span class="pp-unit">/年</span>
                </div>
                <p>省¥88</p>
              </div>
            </div>
          </div>
          <button class="purchase-btn" :disabled="!selectedPlan || purchasing" @click="handlePurchase">
            {{ purchasing ? '处理中...' : (selectedPlan ? '立即开通' : '请选择方案') }}
          </button>
          <button v-if="iapAvailable" class="restore-btn" :disabled="purchasing" @click="handleRestore">恢复购买</button>
          <p v-if="purchaseMessage" :class="['purchase-msg', purchaseMessageType]">{{ purchaseMessage }}</p>
          <div class="subscription-info">
            <p class="si-title">订阅说明</p>
            <ul class="si-list">
              <li v-if="userRole === 'teacher'">订阅名称：老师月度会员（自动续期）</li>
              <li v-else>订阅名称：学生月度会员 / 学生年度会员（自动续期）</li>
              <li v-if="userRole === 'teacher'">订阅时长与价格：老师月度会员 ¥30/月（按月自动续期）；教师按次计费 ¥1/2次（消耗型，无自动续费）</li>
              <li v-else>订阅时长与价格：学生月度会员 ¥18/月（按月自动续期）；学生年度会员 ¥128/年（按年自动续期）</li>
              <li>确认购买后，费用将从您的 Apple ID 账户中扣除</li>
              <li>订阅到期前24小时内自动续费，除非在到期前至少24小时关闭自动续费</li>
              <li>您可以在 iPhone/iPad 的「设置 > Apple ID > 订阅」中管理或取消订阅</li>
            </ul>
            <div class="si-links">
              <a href="/agreement" target="_blank">《用户协议(EULA)》</a>
              <a href="/privacy" target="_blank">《隐私政策》</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置 -->
      <div v-else-if="activeMenu === 'settings'" class="feature-page">
        <div class="fp-header">
          <h2>账号设置</h2>
          <p>管理你的账号信息和偏好设置</p>
        </div>
        <div class="settings-list">
          <div class="setting-item"><span class="si-label">手机号</span><span class="si-val">{{ userPhone }}</span></div>
          <div class="setting-item"><span class="si-label">角色</span><span class="si-val">{{ roleLabel }}</span></div>
          <div class="setting-item"><span class="si-label">邀请码</span><span class="si-val code">USER-{{ userPhone.slice(-6) }}</span></div>
          <div class="setting-item"><span class="si-label">会员状态</span><span class="si-val">{{ isVip ? 'VIP生效中' : '免费版' }}</span></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'

const activeMenu = ref('dashboard')
const isVip = ref(false)
const sidebarOpen = ref(false)

// ========== IAP State ==========
const selectedPlan = ref('')
const purchasing = ref(false)
const purchaseMessage = ref('')
const purchaseMessageType = ref<'success' | 'error'>('success')
const iapProducts = ref<Record<string, { displayPrice: string; displayName: string }>>({})
const iapAvailable = computed(() => !!(window as any).__NATIVE_IAP_AVAILABLE__)

function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
function closeSidebar() { sidebarOpen.value = false }

// ========== AI教案生成 ==========
const tpStages = ['小学', '初中', '高中'] as const
const tpSubjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治']
const tpGradesMap: Record<string, string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三'],
}
const tpTextbookVersions = [
  '部编人教版', '北师大版', '苏教版', '粤教版', '沪教版', '湘教版',
  '鲁教版', '浙教版', '冀教版', '川教版', '外研版', '其他版本',
]
const tpPeriods = ['第1课时', '第2课时', '第3课时', '不指定']

const tpForm = reactive({
  stage: '初中',
  subject: '语文',
  grade: '初一',
  textbookVersion: '部编人教版',
  lessonName: '',
  period: '',
})
const tpGenerating = ref(false)
const tpRawResult = ref('')
const tpErrorMsg = ref('')
const tpActiveTab = ref<'plan' | 'ppt'>('plan')

const tpCurrentGrades = computed(() => tpGradesMap[tpForm.stage] || [])

const tpPlanSections = computed(() => {
  const text = tpRawResult.value
  if (!text) return [] as { title: string; body: string }[]
  const sections: { title: string; body: string }[] = []
  const patterns = ['一、课本原文', '课本原文', '二、教案', '教案', '教学目标', '教学重难点', '课前准备', '完整教学流程', '教学流程', '板书设计', '课后作业布置', '课后作业', '三、PPT内容框架', 'PPT内容框架', 'PPT框架']
  const lines = text.split('\n')
  let curTitle = '教案内容'
  let curBody = ''
  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    const isH = patterns.some(p => t.startsWith(p) || t === p)
    if (isH) {
      if (curBody.trim()) sections.push({ title: curTitle, body: curBody.trim() })
      curTitle = t; curBody = ''
    } else { curBody += line + '\n' }
  }
  if (curBody.trim()) sections.push({ title: curTitle, body: curBody.trim() })
  return sections.length > 0 ? sections : [{ title: '完整教案', body: text }]
})

const tpPptSlides = computed(() => {
  const text = tpRawResult.value
  if (!text) return [] as string[]
  const kw = ['PPT内容框架', 'PPT框架', '三、PPT', '授课PPT', 'PPT内容']
  let st = -1
  for (const k of kw) { const i = text.indexOf(k); if (i !== -1) { st = i; break } }
  if (st === -1) return []
  const pt = text.substring(st)
  const parts = pt.split(/第(\d+)页[：:\s]*/g)
  const slides: string[] = []
  for (let i = 1; i < parts.length; i += 2) slides.push((parts[i + 1] || '').trim())
  return slides.length > 0 ? slides : [pt]
})

async function handleTeachingPlanGenerate() {
  if (tpGenerating.value) return
  if (!tpForm.stage) { tpErrorMsg.value = '请选择学段'; return }
  if (!tpForm.subject) { tpErrorMsg.value = '请选择学科'; return }
  if (!tpForm.grade) { tpErrorMsg.value = '请选择年级'; return }
  if (!tpForm.textbookVersion) { tpErrorMsg.value = '请选择教材版本'; return }
  if (!tpForm.lessonName.trim()) { tpErrorMsg.value = '请输入课文全称'; return }
  tpErrorMsg.value = ''
  tpGenerating.value = true
  tpRawResult.value = ''
  try {
    const token = localStorage.getItem('aifuxue_token')
    const res = await fetch('https://aifuxue.cn/api/ai/teaching-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ stage: tpForm.stage, subject: tpForm.subject, grade: tpForm.grade, textbookVersion: tpForm.textbookVersion, lessonName: tpForm.lessonName.trim(), period: tpForm.period }),
    })
    const d = await res.json()
    if (d.code === 0 && d.data) { tpRawResult.value = d.data.content; tpActiveTab.value = 'plan' }
    else { tpErrorMsg.value = d.message || '生成失败，请重试' }
  } catch (e: any) { tpErrorMsg.value = e.message || '网络错误' }
  finally { tpGenerating.value = false }
}

const userInfo = ref<any>({})
onMounted(() => {
  const token = localStorage.getItem('aifuxue_token')
  if (!token) {
    window.location.href = '/login'
    return
  }
  const saved = localStorage.getItem('aifuxue_user')
  if (saved) userInfo.value = JSON.parse(saved)

  // 支持 iOS 原生 Quick Action 导航
  ;(window as any).__setActiveMenu = (menu: string) => {
    activeMenu.value = menu
  }
  // 处理页面加载前收到的 Quick Action
  if ((window as any).__pendingMenu) {
    activeMenu.value = (window as any).__pendingMenu
    delete (window as any).__pendingMenu
  }

  // ========== IAP Callbacks ==========
  ;(window as any).onNativeIAPProductsLoaded = (raw: any) => {
    try {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      const products = data.products || data
      if (Array.isArray(products)) {
        for (const p of products) {
          iapProducts.value[p.productId] = { displayPrice: p.displayPrice, displayName: p.displayName }
        }
      }
    } catch (e) { console.error('[IAP] parse products error', e) }
  }

  ;(window as any).onNativeIAPResult = (raw: any) => {
    purchasing.value = false
    try {
      const result = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (result.success) {
        verifyTransaction(result.signedTransaction, result.productId)
      } else {
        purchaseMessage.value = result.message || result.error || '购买失败'
        purchaseMessageType.value = 'error'
      }
    } catch (e) {
      purchaseMessage.value = '购买结果解析失败'
      purchaseMessageType.value = 'error'
    }
  }

  ;(window as any).onNativeIAPRestoreResult = (raw: any) => {
    purchasing.value = false
    try {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      const transactions = data.transactions || data
      if (Array.isArray(transactions) && transactions.length > 0) {
        for (const t of transactions) {
          verifyTransaction(t.signedTransaction, t.productId)
        }
        purchaseMessage.value = `已恢复 ${transactions.length} 个购买`
        purchaseMessageType.value = 'success'
      } else {
        purchaseMessage.value = '没有找到可恢复的购买'
        purchaseMessageType.value = 'error'
      }
    } catch (e) {
      purchaseMessage.value = '恢复结果解析失败'
      purchaseMessageType.value = 'error'
    }
  }

  ;(window as any).onNativeIAPTransactionUpdate = (raw: any) => {
    try {
      const update = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (update.signedTransaction) {
        verifyTransaction(update.signedTransaction, update.productId)
      }
    } catch (e) { console.error('[IAP] parse transaction update error', e) }
  }

  // Load IAP products if native bridge available
  if ((window as any).__NATIVE_IAP_AVAILABLE__) {
    ;(window as any).webkit.messageHandlers.nativeIAP.postMessage({ action: 'loadProducts' })
  }
})

const userName = computed(() => userInfo.value?.name || '用户')
const userRole = computed(() => userInfo.value?.role || 'student')
const userPhone = computed(() => userInfo.value?.phone || '')
const roleLabel = computed(() => {
  const m: Record<string, string> = { student: '学生', parent: '家长', teacher: '教师' }
  return m[userRole.value] || '用户'
})

const greetingText = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const currentPageTitle = computed(() => {
  const m: Record<string, string> = {
    dashboard: '工作台', notes: '拍照笔记', mistakes: '错题诊断',
    practice: '靶向练习', class: '班级管理', examgen: 'AI智能出卷',
    teachingplan: 'AI教案生成',
    homework: '作业管理', grades: '发布成绩', oral: '英语口语',
    membership: 'VIP会员', settings: '账号设置',
  }
  return m[activeMenu.value] || '工作台'
})

const menuGroups = computed(() => {
  const groups = [
    { title: '概览', items: [{ id: 'dashboard', icon: '🏠', label: '工作台' }] },
  ]
  if (userRole.value === 'student') {
    groups.push({
      title: '学习工具', items: [
        { id: 'notes', icon: '📷', label: '拍照笔记' },
        { id: 'mistakes', icon: '🔍', label: '错题诊断' },
        { id: 'practice', icon: '🎯', label: '靶向练习' },
        { id: 'oral', icon: '🗣️', label: '英语口语' },
      ]
    })
  } else if (userRole.value === 'teacher') {
    groups.push({
      title: '教学管理', items: [
        { id: 'class', icon: '🏫', label: '班级管理' },
        { id: 'homework', icon: '📋', label: '作业管理' },
        { id: 'grades', icon: '📊', label: '发布成绩' },
        { id: 'examgen', icon: '📝', label: 'AI出卷' },
        { id: 'teachingplan', icon: '📋', label: 'AI教案' },
      ]
    })
  } else {
    groups.push({
      title: '家长中心', items: [
        { id: 'notes', icon: '📊', label: '学习报告' },
        { id: 'homework', icon: '📋', label: '作业情况' },
        { id: 'grades', icon: '📈', label: '成绩查看' },
      ]
    })
  }
  groups.push({
    title: '其他', items: [
      { id: 'membership', icon: '👑', label: 'VIP会员' },
      { id: 'settings', icon: '⚙️', label: '设置' },
    ]
  })
  return groups
})

const quickActions = computed(() => {
  if (userRole.value === 'teacher') {
    return [
      { icon: '📋', label: '发布作业', target: 'homework' },
      { icon: '📝', label: 'AI出卷', target: 'examgen' },
      { icon: '📋', label: 'AI教案', target: 'teachingplan' },
      { icon: '📊', label: '发成绩', target: 'grades' },
      { icon: '🏫', label: '班级管理', target: 'class' },
    ]
  }
  if (userRole.value === 'parent') {
    return [
      { icon: '📊', label: '学习报告', target: 'notes' },
      { icon: '📋', label: '作业情况', target: 'homework' },
      { icon: '📈', label: '成绩查看', target: 'grades' },
      { icon: '👑', label: '开通VIP', target: 'membership' },
    ]
  }
  return [
    { icon: '📷', label: '拍照笔记', target: 'notes' },
    { icon: '🔍', label: '错题诊断', target: 'mistakes' },
    { icon: '🎯', label: '靶向练习', target: 'practice' },
    { icon: '🗣️', label: '英语口语', target: 'oral' },
  ]
})

const statsData = computed(() => {
  if (userRole.value === 'teacher') {
    return [
      { value: '87', label: '班级学生' },
      { value: '5', label: '待批改' },
      { value: '92%', label: '平均提交率' },
      { value: '156', label: '本月批改' },
    ]
  }
  if (userRole.value === 'parent') {
    return [
      { value: '4.2h', label: '本周学习' },
      { value: '8', label: '完成作业' },
      { value: '85%', label: '平均正确率' },
      { value: '3', label: '待完成' },
    ]
  }
  return [
    { value: '23', label: '笔记总数' },
    { value: '156', label: '练习次数' },
    { value: '85%', label: '正确率' },
    { value: '12', label: '消灭错题' },
  ]
})

const recentActivities = [
  { icon: '📷', text: '整理了「第三章一元二次方程」笔记', time: '10分钟前' },
  { icon: '🎯', text: '完成靶向练习，正确率 85%', time: '1小时前' },
  { icon: '🔍', text: '诊断了3道数学错题', time: '2小时前' },
  { icon: '📝', text: '提交了「函数基础」作业', time: '昨天' },
]

const sampleNotes = [
  { icon: '📐', title: '第三章 一元二次方程', date: '今天' },
  { icon: '🧪', title: '化学 氧化还原反应', date: '昨天' },
  { icon: '📖', title: '英语 Unit5 词汇整理', date: '2天前' },
  { icon: '🌍', title: '地理 气候类型总结', date: '3天前' },
]

const practiceTypes = [
  { icon: '🎯', label: '薄弱知识点', desc: '基于错题数据精准出题' },
  { icon: '📝', label: '章节巩固', desc: '按章节生成练习' },
  { icon: '🧠', label: '模拟考试', desc: '全科模拟测试' },
]

const classList = [
  { name: '初三(1)班', code: 'CLASS-A3B2C1', students: 45, rate: 92 },
  { name: '初三(2)班', code: 'CLASS-D4E5F6', students: 42, rate: 88 },
]

const homeworkList = [
  { title: '第三章课后练习', type: '在线作业', date: '今天', submitRate: 78, status: 'active', statusText: '进行中' },
  { title: '一元二次方程测验', type: '在线作业', date: '昨天', submitRate: 95, status: 'done', statusText: '已结束' },
  { title: '实验报告：化学反应', type: '离线作业', date: '3天前', submitRate: 100, status: 'done', statusText: '已结束' },
]

const gradeStudents = [
  { name: '张小明', full: 100 },
  { name: '李小红', full: 100 },
  { name: '王大力', full: 100 },
  { name: '赵美丽', full: 100 },
  { name: '周小刚', full: 100 },
]

function handleLogout() {
  localStorage.removeItem('aifuxue_token')
  localStorage.removeItem('aifuxue_user')
  window.location.href = '/'
}

function handleUpload() { alert('文件上传功能开发中，正式版将支持拍照上传') }
function handleDrop() { alert('拖拽上传功能开发中') }
function startPractice(_p: any) { alert('练习功能开发中，请使用App端体验完整功能') }
function showCreateClass() { alert('创建班级功能开发中') }
function showPublishHomework() { alert('发布作业功能开发中') }
function handleGenerate() { alert('AI出卷功能开发中，生成后将支持Word/PDF导出') }

// ========== IAP Functions ==========
function getProductPrice(productId: string): string {
  return iapProducts.value[productId]?.displayPrice || ''
}

function handlePurchase() {
  if (!selectedPlan.value || purchasing.value) return
  if (iapAvailable.value) {
    purchasing.value = true
    purchaseMessage.value = ''
    ;(window as any).webkit.messageHandlers.nativeIAP.postMessage({
      action: 'purchase',
      productId: selectedPlan.value,
    })
  } else {
    purchaseMessage.value = '应用内购买仅在 iOS App 中可用'
    purchaseMessageType.value = 'error'
  }
}

function handleRestore() {
  if (purchasing.value) return
  purchasing.value = true
  purchaseMessage.value = ''
  ;(window as any).webkit.messageHandlers.nativeRestorePurchases.postMessage({})
}

async function verifyTransaction(signedTransaction: string, productId: string) {
  try {
    const token = localStorage.getItem('aifuxue_token')
    const res = await fetch('/api/subscription/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ signedTransaction }),
    })
    const data = await res.json()
    if (data.success) {
      purchaseMessage.value = '购买成功！'
      purchaseMessageType.value = 'success'
      isVip.value = true
      // For consumables, finish the transaction on native side
      if (data.type === 'consumable' && data.transactionId) {
        ;(window as any).webkit?.messageHandlers?.nativeIAP?.postMessage({
          action: 'finishTransaction',
          transactionId: String(data.transactionId),
        })
      }
    } else {
      purchaseMessage.value = data.message || '验证失败'
      purchaseMessageType.value = 'error'
    }
  } catch (e: any) {
    purchaseMessage.value = e.message || '网络错误'
    purchaseMessageType.value = 'error'
  }
}
</script>

<style scoped>
.app-layout { display: flex; min-height: 100vh; background: var(--bg-light); }

/* 侧边栏 */
.sidebar {
  width: 260px; background: #fff; border-right: 1px solid var(--border);
  display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 10;
}
.sidebar-brand { padding: 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
.sb-logo {
  width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px; font-weight: 800;
}
.sb-name { font-size: 18px; font-weight: 700; color: var(--primary); }

.sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
.nav-group { margin-bottom: 24px; }
.ng-title { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; padding: 0 12px; margin-bottom: 8px; display: block; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
  font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.2s; margin-bottom: 2px;
}
.nav-item:hover { background: var(--bg-light); color: var(--text1); }
.nav-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
.ni-icon { font-size: 18px; }

.sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
.user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: var(--primary);
  color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
}
.user-meta { display: flex; flex-direction: column; }
.user-name { font-size: 14px; font-weight: 600; color: var(--text1); }
.user-role { font-size: 12px; color: var(--text3); }
.logout-btn {
  width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 8px;
  background: #fff; font-size: 13px; color: var(--text3); cursor: pointer; transition: all 0.2s;
}
.logout-btn:hover { border-color: var(--danger); color: var(--danger); }

/* 主内容 */
.main-content { flex: 1; margin-left: 260px; padding: 24px 32px; min-height: 100vh; }
.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 800; color: var(--text1); }
.top-btn { border: none; background: none; cursor: pointer; }
.vip-badge {
  padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500); color: #1A1D2E;
}
.vip-badge.active { background: linear-gradient(135deg, #FFD700, #FFA500); }

/* 仪表盘 */
.welcome-card {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 20px; padding: 36px; color: #fff; display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
}
.wc-content h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.wc-content p { font-size: 15px; opacity: 0.85; }
.wc-visual { font-size: 64px; }

.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.quick-card {
  background: #fff; border: 1px solid var(--border); border-radius: 16px;
  padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.quick-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); border-color: var(--primary); }
.qc-icon { font-size: 32px; }
.qc-label { font-size: 14px; font-weight: 600; color: var(--text1); }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.stat-card { background: #fff; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid var(--border); }
.st-value { font-size: 28px; font-weight: 800; color: var(--primary); display: block; }
.st-label { font-size: 13px; color: var(--text3); }

.section-block { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid var(--border); }
.section-block h3 { font-size: 18px; font-weight: 700; color: var(--text1); margin-bottom: 16px; }
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; background: var(--bg-light); }
.ai-icon { font-size: 20px; }
.ai-text { flex: 1; font-size: 14px; color: var(--text2); }
.ai-time { font-size: 12px; color: var(--text3); }

/* 功能页面通用 */
.feature-page { }
.fp-header { margin-bottom: 28px; }
.fp-header h2 { font-size: 24px; font-weight: 800; color: var(--text1); margin-bottom: 8px; }
.fp-header p { font-size: 15px; color: var(--text3); }

.upload-area {
  border: 2px dashed var(--border); border-radius: 20px; padding: 60px; text-align: center;
  cursor: pointer; transition: all 0.2s; background: #fff; margin-bottom: 28px;
}
.upload-area:hover { border-color: var(--primary); background: var(--primary-light); }
.upload-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.upload-content h3 { font-size: 18px; font-weight: 600; color: var(--text1); margin-bottom: 8px; }
.upload-content p { font-size: 14px; color: var(--text3); }

.note-history h3, .mistake-stats h3, .practice-history h3 { font-size: 18px; font-weight: 700; color: var(--text1); margin-bottom: 16px; }
.note-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.note-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 12px; }
.nc-preview { font-size: 28px; }
.nc-title { font-size: 14px; font-weight: 600; color: var(--text1); display: block; }
.nc-date { font-size: 12px; color: var(--text3); }

.ms-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.ms-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px; text-align: center; }
.ms-val { font-size: 28px; font-weight: 800; color: var(--primary); display: block; }
.ms-label { font-size: 13px; color: var(--text3); }

.practice-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
.po-card {
  background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px;
  text-align: center; cursor: pointer; transition: all 0.2s;
}
.po-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); border-color: var(--primary); }
.po-icon { font-size: 36px; display: block; margin-bottom: 12px; }
.po-card h4 { font-size: 16px; font-weight: 700; color: var(--text1); margin-bottom: 6px; }
.po-card p { font-size: 13px; color: var(--text3); margin-bottom: 12px; }
.po-btn { font-size: 13px; font-weight: 600; color: var(--primary); }

.ph-list { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.ph-item { display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text2); }
.ph-item:last-child { border-bottom: none; }
.ph-item span:first-child { flex: 1; }
.ph-score { color: var(--primary); font-weight: 600; margin-right: 16px; }
.ph-date { color: var(--text3); font-size: 12px; }

/* 班级管理 */
.class-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.class-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.cc-header { margin-bottom: 12px; }
.cc-header h4 { font-size: 16px; font-weight: 700; color: var(--text1); margin-bottom: 4px; }
.cc-code { font-size: 12px; color: var(--primary); font-family: monospace; }
.cc-stats { display: flex; gap: 16px; font-size: 13px; color: var(--text3); }
.add-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border-style: dashed; }
.add-card:hover { border-color: var(--primary); background: var(--primary-light); }
.add-icon { font-size: 32px; color: var(--primary); }

/* AI出卷 */
.exam-form { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
.ef-row { margin-bottom: 24px; }
.ef-row label { font-size: 14px; font-weight: 600; color: var(--text2); display: block; margin-bottom: 10px; }
.ef-chips { display: flex; gap: 10px; flex-wrap: wrap; }
.ef-chip { padding: 8px 18px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.2s; }
.ef-chip:hover, .ef-chip.active { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
.export-options { display: flex; gap: 16px; }
.eo-card { flex: 1; padding: 16px; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text2); }
.eo-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; }
.eo-icon.word { background: linear-gradient(135deg, #2B579A, #4472C4); }
.eo-icon.pdf { background: linear-gradient(135deg, #C62828, #E53935); }
.eo-price { margin-left: auto; color: var(--warning); font-weight: 600; font-size: 13px; }
.eo-free { margin-left: auto; color: var(--success); font-weight: 600; font-size: 13px; }
.gen-btn {
  width: 100%; padding: 16px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 16px rgba(91,123,255,0.3); transition: all 0.2s;
}
.gen-btn:hover { transform: translateY(-2px); }

/* 作业管理 */
.hw-actions { margin-bottom: 20px; }
.btn-action {
  padding: 12px 24px; border: none; border-radius: 10px;
  background: var(--primary); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
}
.hw-list { display: flex; flex-direction: column; gap: 12px; }
.hw-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
.hw-info h4 { font-size: 15px; font-weight: 600; color: var(--text1); margin-bottom: 4px; }
.hw-meta { font-size: 13px; color: var(--text3); }
.hw-status { display: flex; align-items: center; gap: 12px; }
.hw-rate { font-size: 13px; color: var(--text2); }
.hw-tag { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.hw-tag.active { background: rgba(91,123,255,0.1); color: var(--primary); }
.hw-tag.done { background: rgba(52,211,153,0.1); color: var(--success); }

/* 发布成绩 */
.grade-form { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
.gf-header { display: flex; gap: 16px; margin-bottom: 24px; }
.gf-input { flex: 1; padding: 12px 16px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; }
.gf-input:focus { border-color: var(--primary); }
.gf-select { padding: 12px 16px; border: 2px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; }
.grade-table { margin-bottom: 20px; }
.gt-header { display: flex; padding: 12px 16px; background: var(--bg-light); border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--text3); margin-bottom: 8px; }
.gt-header span:first-child { flex: 1; }
.gt-row { display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.gt-row span { flex: 1; font-size: 14px; color: var(--text2); }
.gt-input { width: 100px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; text-align: center; outline: none; }
.gt-input:focus { border-color: var(--primary); }
.submit-grade-btn {
  width: 100%; padding: 14px; border: none; border-radius: 10px;
  background: var(--primary); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
}

/* 英语口语 */
.oral-content { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; text-align: center; }
.oral-sentence { margin-bottom: 28px; }
.os-en { font-size: 20px; font-weight: 600; color: var(--text1); margin-bottom: 8px; }
.os-cn { font-size: 14px; color: var(--text3); }
.oral-controls { display: flex; gap: 16px; justify-content: center; margin-bottom: 28px; }
.oc-btn { padding: 14px 28px; border-radius: 12px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; }
.oc-btn.listen { background: var(--primary-light); color: var(--primary); }
.oc-btn.record { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; }
.oral-scores { display: flex; gap: 40px; justify-content: center; }
.os-item { text-align: center; }
.os-label { font-size: 13px; color: var(--text3); display: block; margin-bottom: 4px; }
.os-val { font-size: 28px; font-weight: 800; color: var(--primary); }

/* VIP会员 */
.membership-content { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; }
.vip-benefits { display: flex; gap: 24px; justify-content: center; margin-bottom: 32px; }
.vb-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text2); }
.plan-cards { margin-bottom: 28px; }
.plan-cards-inner { display: flex; gap: 20px; justify-content: center; }
.plan-card { flex: 1; max-width: 280px; padding: 28px; border: 2px solid var(--border); border-radius: 16px; text-align: center; position: relative; cursor: pointer; transition: all 0.2s; }
.plan-card:hover { border-color: var(--primary); transform: translateY(-2px); }
.plan-card.selected { border-color: var(--primary); background: rgba(91,123,255,0.04); box-shadow: 0 0 0 3px rgba(91,123,255,0.15); }
.plan-card.recommended { border-color: #FFD700; }
.plan-card.recommended.selected { border-color: var(--primary); }
.plan-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #FFD700, #FFA500); padding: 4px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #1A1D2E; }
.plan-card h4 { font-size: 16px; font-weight: 600; color: var(--text2); margin-bottom: 12px; }
.plan-price { margin-bottom: 8px; }
.pp-amount { font-size: 36px; font-weight: 800; color: var(--text1); }
.pp-unit { font-size: 14px; color: var(--text3); }
.plan-card p { font-size: 13px; color: var(--text3); }
.purchase-btn {
  width: 100%; max-width: 400px; margin: 0 auto; display: block; padding: 16px;
  border: none; border-radius: 12px;
  background: linear-gradient(135deg, #FFD700, #FFA500); color: #1A1D2E;
  font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.purchase-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.purchase-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(255,215,0,0.4); }
.restore-btn {
  width: 100%; max-width: 400px; margin: 12px auto 0; display: block; padding: 12px;
  border: 1px solid var(--border); border-radius: 10px;
  background: #fff; color: var(--text2); font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.restore-btn:hover { border-color: var(--primary); color: var(--primary); }
.restore-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.purchase-msg { text-align: center; margin-top: 16px; font-size: 14px; font-weight: 600; }
.purchase-msg.success { color: var(--success); }
.purchase-msg.error { color: #E53935; }
.subscription-info {
  margin-top: 24px; padding: 20px 24px; background: #f8f9fc; border-radius: 12px;
}
.subscription-info .si-title { font-size: 14px; font-weight: 700; color: var(--text2); margin-bottom: 10px; }
.subscription-info .si-list { list-style: none; padding: 0; margin: 0 0 12px; }
.subscription-info .si-list li { font-size: 12px; color: var(--text3); line-height: 1.8; padding-left: 12px; position: relative; }
.subscription-info .si-list li::before { content: '·'; position: absolute; left: 0; }
.subscription-info .si-links { display: flex; gap: 16px; }
.subscription-info .si-links a { font-size: 12px; color: var(--primary); text-decoration: underline; }

/* 设置 */
.settings-list { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.setting-item { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.setting-item:last-child { border-bottom: none; }
.si-label { font-size: 15px; color: var(--text2); }
.si-val { font-size: 15px; font-weight: 600; color: var(--text1); }
.si-val.code { font-family: monospace; color: var(--primary); }

/* ========== AI教案生成 ========== */
.tp-form-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
.tp-row { margin-bottom: 22px; }
.tp-row:last-child { margin-bottom: 0; }
.tp-label { display: block; font-size: 14px; font-weight: 600; color: var(--text2); margin-bottom: 10px; }
.tp-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.tp-chip {
  padding: 8px 16px; border: 2px solid var(--border); border-radius: 10px;
  font-size: 13px; color: var(--text2); cursor: pointer; transition: all 0.15s;
  user-select: none;
}
.tp-chip:hover { border-color: var(--primary); color: var(--primary); }
.tp-chip.active { border-color: var(--primary); color: var(--primary); background: rgba(91,123,255,0.06); font-weight: 600; }
.tp-input {
  width: 100%; box-sizing: border-box; padding: 12px 16px; border: 2px solid var(--border);
  border-radius: 10px; font-size: 15px; color: var(--text1); outline: none; transition: border-color 0.15s;
}
.tp-input:focus { border-color: var(--primary); }
.tp-input::placeholder { color: var(--text3); }

.tp-gen-btn {
  width: 100%; padding: 16px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 16px rgba(91,123,255,0.3); transition: all 0.2s;
  margin-bottom: 16px;
}
.tp-gen-btn:hover { transform: translateY(-2px); }
.tp-gen-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.tp-error { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: 12px; padding: 14px 20px; margin-bottom: 16px; }
.tp-error span { font-size: 14px; color: #E53935; }

.tp-result { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
.tp-tabs { display: flex; gap: 12px; margin-bottom: 20px; }
.tp-tab {
  flex: 1; text-align: center; padding: 12px; border: 2px solid var(--border);
  border-radius: 12px; font-size: 15px; color: var(--text2); cursor: pointer; user-select: none;
}
.tp-tab.active { border-color: var(--primary); color: var(--primary); font-weight: 700; background: rgba(91,123,255,0.04); }
.tp-content { }
.tp-section { margin-bottom: 28px; }
.tp-section:last-child { margin-bottom: 0; }
.tp-sec-title { font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.tp-sec-body { font-size: 14px; color: var(--text1); line-height: 1.8; white-space: pre-wrap; word-break: break-word; margin: 0; font-family: inherit; }
.tp-slide { background: var(--bg-light); border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; border-left: 4px solid var(--primary); }
.tp-slide:last-child { margin-bottom: 0; }
.tp-slide-num { display: block; font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
.tp-slide-body { font-size: 14px; color: var(--text1); line-height: 1.8; white-space: pre-wrap; margin: 0; font-family: inherit; }
.tp-meta { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text3); }

/* 移动端头部 - 默认隐藏 */
.mobile-header {
  display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 20;
  height: 56px; background: #fff; border-bottom: 1px solid var(--border);
  padding: 0 16px; align-items: center; justify-content: space-between;
}
.hamburger-btn {
  width: 40px; height: 40px; border: none; background: none;
  font-size: 22px; cursor: pointer; border-radius: 8px; color: var(--text1);
}
.hamburger-btn:hover { background: var(--bg-light); }
.mobile-title { font-size: 17px; font-weight: 700; color: var(--primary); }
.sidebar-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  z-index: 9;
}

/* ===== iPad / 平板响应式 (≤1024px) ===== */
@media (max-width: 1024px) {
  .mobile-header { display: flex; }
  .sidebar-overlay { display: block; }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 30;
  }
  .sidebar.open { transform: translateX(0); }

  .main-content {
    margin-left: 0 !important;
    padding: 72px 20px 24px !important;
  }

  .top-bar { display: none; }

  .quick-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 12px !important; }
  .stats-row { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
  .note-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .ms-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .class-list { grid-template-columns: repeat(2, 1fr) !important; }
  .practice-options { grid-template-columns: repeat(2, 1fr) !important; }
  .export-options { flex-direction: column; }
  .plan-cards-inner { flex-direction: column; align-items: center; }
  .plan-card { max-width: 100%; }
  .vip-benefits { flex-wrap: wrap; justify-content: flex-start; gap: 12px; }
}

/* ===== 手机响应式 (≤640px) ===== */
@media (max-width: 640px) {
  .quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .quick-card { padding: 16px; }
  .qc-icon { font-size: 24px; }
  .welcome-card { padding: 24px; flex-direction: column; text-align: center; gap: 16px; }
  .wc-content h2 { font-size: 18px; }
  .oral-scores { flex-wrap: wrap; gap: 20px; }
  .ef-chips { gap: 6px; }
  .ef-chip { padding: 6px 12px; font-size: 13px; }
}
</style>
