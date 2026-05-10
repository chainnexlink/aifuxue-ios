<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <router-link to="/features">功能介绍</router-link>
          <span class="sep">/</span>
          <span class="current">{{ feature?.title }}</span>
        </div>
        <h1>{{ feature?.title }}</h1>
        <p>{{ feature?.subtitle }}</p>
      </div>
    </section>

    <section class="section" v-if="feature">
      <div class="container">
        <!-- 功能概述 -->
        <div class="overview-block">
          <div class="overview-icon" :style="{ background: feature.iconBg }">{{ feature.icon }}</div>
          <div class="overview-text">
            <h2>功能概述</h2>
            <p v-for="(p, i) in feature.overview" :key="i">{{ p }}</p>
          </div>
        </div>

        <!-- 核心能力 -->
        <div class="abilities-section">
          <div class="section-title"><h2>核心能力</h2></div>
          <div class="abilities-grid">
            <div v-for="a in feature.abilities" :key="a.title" class="ability-card">
              <div class="ability-icon">{{ a.icon }}</div>
              <h3>{{ a.title }}</h3>
              <p>{{ a.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 使用流程 -->
        <div class="flow-section" v-if="feature.flow">
          <div class="section-title"><h2>使用流程</h2></div>
          <div class="flow-steps">
            <div v-for="(s, i) in feature.flow" :key="i" class="flow-step">
              <div class="flow-num">{{ i + 1 }}</div>
              <div class="flow-line" v-if="i < feature.flow.length - 1"></div>
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 适用场景 -->
        <div class="scenario-section" v-if="feature.scenarios">
          <div class="section-title"><h2>适用场景</h2></div>
          <div class="scenario-grid">
            <div v-for="s in feature.scenarios" :key="s.title" class="scenario-card">
              <span class="scenario-icon">{{ s.icon }}</span>
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="faq-section" v-if="feature.faq">
          <div class="section-title"><h2>常见问题</h2></div>
          <div class="faq-list">
            <div v-for="(q, i) in feature.faq" :key="i" class="faq-item" @click="toggleFaq(i)">
              <div class="faq-q">
                <span>{{ q.q }}</span>
                <span class="faq-arrow" :class="{ open: openFaq === i }">&#9660;</span>
              </div>
              <div class="faq-a" v-show="openFaq === i">{{ q.a }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 未找到 -->
    <section class="section" v-else>
      <div class="container" style="text-align:center;padding:100px 0;">
        <h2 style="font-size:32px;margin-bottom:16px;">功能未找到</h2>
        <p style="color:var(--text3);margin-bottom:24px;">请返回功能列表查看</p>
        <router-link to="/features" class="btn btn-primary">返回功能介绍</router-link>
      </div>
    </section>

    <section class="section cta-section" v-if="feature">
      <div class="container" style="text-align:center;">
        <h2>立即体验{{ feature.title }}</h2>
        <p style="color:#ffffffb3;font-size:18px;margin:20px 0 40px;">免费注册，即刻开始使用</p>
        <router-link to="/download" class="btn btn-primary btn-lg" style="font-size:18px;padding:18px 56px;">免费开始使用</router-link>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => { openFaq.value = openFaq.value === i ? null : i }

interface FeatureData {
  title: string
  subtitle: string
  icon: string
  iconBg: string
  overview: string[]
  abilities: { icon: string; title: string; desc: string }[]
  flow?: { title: string; desc: string }[]
  scenarios?: { icon: string; title: string; desc: string }[]
  faq?: { q: string; a: string }[]
}

const featuresMap: Record<string, FeatureData> = {
  'note-taking': {
    title: '拍照笔记整理',
    subtitle: '一键拍照，AI帮你整理排版，生成精美电子文档',
    icon: '📷',
    iconBg: 'linear-gradient(135deg,#EEF2FF,#C7D2FE)',
    overview: [
      '拍照笔记整理是爱辅学的核心功能之一。学生只需用手机拍照课堂笔记，系统将自动进行OCR文字识别，并通过AI技术对内容进行智能整理、归纳和排版。',
      '整理后的笔记会以Markdown格式呈现，层次分明、重点突出。支持多张图片批量上传，一次性完成多页笔记的整理工作。',
      '每日提供3次免费导出额度（PDF/图片/Word格式），超出后可通过观看短视频广告继续使用，无需付费。'
    ],
    abilities: [
      { icon: '🔤', title: 'OCR高精度识别', desc: '采用豆包视觉大模型，支持手写体、印刷体混合识别，识别准确率超过95%' },
      { icon: '🧠', title: 'AI智能整理', desc: 'DeepSeek大模型自动归纳知识点，提取重点，生成结构化Markdown文档' },
      { icon: '📑', title: '批量处理', desc: '支持多张图片同时上传，一次性整理多页课堂笔记' },
      { icon: '📤', title: '多格式导出', desc: '支持导出为PDF、图片、Word等多种格式，方便打印和分享' }
    ],
    flow: [
      { title: '拍照上传', desc: '打开App，选择"拍课后笔记"，拍照或从相册选择笔记图片' },
      { title: 'AI识别整理', desc: '系统自动进行OCR识别，AI分析并整理内容，生成结构化文档' },
      { title: '预览编辑', desc: '查看整理结果，可手动调整和补充内容' },
      { title: '导出分享', desc: '选择PDF/图片/Word格式导出，或直接分享给同学' }
    ],
    scenarios: [
      { icon: '📚', title: '课堂笔记', desc: '快速将课堂手写笔记转为电子版，方便复习和整理' },
      { icon: '📖', title: '读书笔记', desc: '拍照书本重点内容，AI归纳提炼核心知识点' },
      { icon: '🧪', title: '实验记录', desc: '拍照实验报告，自动整理实验步骤和数据' },
      { icon: '📋', title: '考前复习', desc: '批量整理多科笔记，生成复习提纲' }
    ],
    faq: [
      { q: '手写字迹潦草能识别吗？', a: '爱辅学采用豆包视觉大模型进行OCR识别，对手写体有很好的识别能力。但建议书写尽量工整以获得最佳识别效果。' },
      { q: '每日有使用次数限制吗？', a: '笔记整理功能本身无限制，导出功能每日3次免费，超出后观看广告即可继续使用。' },
      { q: '支持哪些学科的笔记？', a: '支持语文、数学、英语、物理、化学、生物、历史、地理、政治等9大学科的笔记整理。' },
      { q: '整理后的笔记存储在哪？', a: '所有笔记都安全存储在云端，支持随时查看、搜索和导出。' }
    ]
  },
  'mistake-diagnosis': {
    title: 'AI错题诊断',
    subtitle: '拍照录入错题，AI自动分析错因，精准定位知识盲点',
    icon: '🔍',
    iconBg: 'linear-gradient(135deg,#FEF2F2,#FECACA)',
    overview: [
      'AI错题诊断是爱辅学帮助学生高效消灭薄弱知识点的核心功能。学生只需拍照上传做错的题目，系统自动进行OCR识别，并调用AI大模型进行深度分析。',
      'AI会自动识别题目涉及的知识点、判断错误类型（计算错误、概念不清、审题偏差、完全不会），并给出具体的避错建议和正确的解题思路。',
      '系统还会根据错题自动生成同类变式题，帮助学生举一反三。错题巩固卷功能可以将一段时间的错题汇总生成专项练习卷。'
    ],
    abilities: [
      { icon: '📸', title: '拍照录入', desc: '拍照即可录入错题，OCR自动识别题目内容，无需手动输入' },
      { icon: '🧠', title: '智能诊断', desc: 'AI自动识别知识点、分析错误原因、给出避错建议' },
      { icon: '📊', title: '四大分类', desc: '将错误精确分为：计算错误、概念不清、审题偏差、完全不会' },
      { icon: '🎯', title: '变式题生成', desc: '基于错题自动生成同类变式练习题，巩固薄弱点' },
      { icon: '📝', title: '巩固卷生成', desc: '汇总错题生成专项巩固试卷，集中消灭弱项' },
      { icon: '📈', title: '错题趋势', desc: '追踪错题变化趋势，直观查看知识掌握进度' }
    ],
    flow: [
      { title: '拍照上传', desc: '选择"拍错题录入"，拍照或从相册选择错题图片' },
      { title: 'AI诊断', desc: '系统自动OCR识别题目，AI分析知识点和错误原因' },
      { title: '查看诊断', desc: '查看AI给出的知识点、错误类型、避错建议和正确解法' },
      { title: '练习巩固', desc: '做AI生成的同类变式题，反复练习直到掌握' }
    ],
    scenarios: [
      { icon: '📐', title: '数学错题', desc: '计算错误、公式记忆偏差、解题思路不清的精准诊断' },
      { icon: '🔬', title: '理科实验题', desc: '物理化学实验题的原理分析和易错点提醒' },
      { icon: '📝', title: '考后分析', desc: '考试后集中拍照录入错题，批量诊断知识盲点' },
      { icon: '🗂️', title: '错题本管理', desc: '按学科、时间、错误类型分类管理所有错题' }
    ],
    faq: [
      { q: '一次可以拍多张图片吗？', a: '支持一次上传多张图片，系统会自动识别并拼接为完整题目。' },
      { q: 'AI诊断的准确率如何？', a: '基于DeepSeek大模型，对主流中小学题目的知识点识别和错因分析准确率很高，且持续迭代优化。' },
      { q: '同类变式题有几道？', a: '每次诊断后会自动生成3道同类型变式题，每日5题免费，超出可观看广告继续。' },
      { q: '错题数据会丢失吗？', a: '所有错题数据安全存储在云端，可随时查看和管理。' }
    ]
  },
  'targeted-practice': {
    title: '靶向练习系统',
    subtitle: '基于笔记和错题智能生成针对性练习，精准提高',
    icon: '🎯',
    iconBg: 'linear-gradient(135deg,#ECFDF5,#A7F3D0)',
    overview: [
      '靶向练习系统是爱辅学的智能练习引擎。不同于传统题库的大量刷题模式，靶向练习根据学生的笔记内容和错题数据，精准生成针对性的练习题。',
      '系统支持选择题、填空题、判断题三种题型，覆盖各学科的主要考点。每次练习后会自动记录正确率，并据此调整后续练习的难度和方向。',
      '家长可以通过密码保护机制管控答案查看权限，防止学生直接查看答案而跳过思考过程。'
    ],
    abilities: [
      { icon: '🎯', title: '精准出题', desc: '基于个人笔记和错题数据，AI精准生成针对性练习' },
      { icon: '📊', title: '多题型覆盖', desc: '选择题、填空题、判断题三种题型全覆盖' },
      { icon: '📈', title: '正确率追踪', desc: '自动记录每次练习的正确率和答题详情' },
      { icon: '🔒', title: '家长管控', desc: '家长密码保护答案查看，引导学生独立思考' }
    ],
    flow: [
      { title: '选择科目', desc: '选择想要练习的科目和章节范围' },
      { title: 'AI生成', desc: '系统根据学习数据智能生成练习题' },
      { title: '作答提交', desc: '完成所有题目后提交答案' },
      { title: '查看详解', desc: '查看正确率、详细解析和知识点关联' }
    ],
    scenarios: [
      { icon: '📝', title: '课后巩固', desc: '学完新课后，立即生成对应练习进行巩固' },
      { icon: '🔄', title: '薄弱项强化', desc: '针对经常出错的知识点，集中练习' },
      { icon: '📋', title: '考前冲刺', desc: '根据错题热点生成考前专项练习' },
      { icon: '🏆', title: '自我检测', desc: '定期检测知识掌握程度，查漏补缺' }
    ],
    faq: [
      { q: '练习题从哪来？', a: '练习题由AI根据你的笔记和错题实时生成，不是固定题库，每次都不一样。' },
      { q: '每天可以练习几次？', a: '每日2次免费练习，超出后观看广告即可继续。' },
      { q: '家长如何设置答案保护？', a: '在"我的"-"家长设置"中设置密码，开启后查看答案需要输入家长密码。' },
      { q: '练习历史记录保留多久？', a: '所有练习记录永久保留，可随时查看历史练习的答题详情和正确率趋势。' }
    ]
  },
  'teacher-system': {
    title: '教师助教系统',
    subtitle: '班级管理、作业发布、AI批改，教学效率翻倍',
    icon: '👨‍🏫',
    iconBg: 'linear-gradient(135deg,#FFF7ED,#FDE68A)',
    overview: [
      '教师助教系统是爱辅学为认证教师提供的专属教学工具。教师通过实名认证后，即可使用完整的教学功能，包括班级创建、作业发布、AI批改等。',
      '教师可以创建多个班级，生成CLASS-XXXXXX格式的邀请码，学生扫码或输入邀请码即可加入。作业支持在线（客观题AI批改）和离线（拍照/录音提交）两种模式。',
      '教师还拥有专属邀请码TEACHER-XXXXXX，学生使用该码注册可获得30天全功能体验，形成教师→学生的有效获客闭环。'
    ],
    abilities: [
      { icon: '🏫', title: '班级创建', desc: '一键创建班级，自动生成CLASS-XXXXXX邀请码' },
      { icon: '📝', title: '作业发布', desc: '支持在线作业（AI自动批改）和离线作业（拍照/录音提交）' },
      { icon: '🤖', title: 'AI批改', desc: '在线作业AI自动批改，每日50次在线+50次离线批改配额' },
      { icon: '📊', title: '学情追踪', desc: '实时查看学生完成率、正确率和班级错题热点分析' },
      { icon: '👁️', title: '视角切换', desc: '一键切换教师/学生视角，预览学生看到的界面' },
      { icon: '🎁', title: '专属邀请码', desc: '教师专属TEACHER-XXXXXX邀请码，学生注册送30天全功能体验' }
    ],
    flow: [
      { title: '教师认证', desc: '提交教师资格证或学校证明，完成实名认证' },
      { title: '创建班级', desc: '创建班级并获取CLASS邀请码，分发给学生' },
      { title: '发布作业', desc: '选择在线或离线模式发布作业，设置截止时间' },
      { title: '查看学情', desc: '查看完成率、正确率等数据，进行精准教学' }
    ],
    scenarios: [
      { icon: '📐', title: '日常作业', desc: '发布每日课后作业，AI自动批改，减轻教师负担' },
      { icon: '📝', title: '单元测试', desc: '发布在线单元测试，实时查看学生成绩分布' },
      { icon: '📷', title: '实践作业', desc: '发布离线实践作业，学生拍照或录音提交' },
      { icon: '📊', title: '学情分析', desc: '根据班级错题热点，调整教学重点和策略' }
    ],
    faq: [
      { q: '如何进行教师认证？', a: '在App中选择"教师"角色注册，上传教师资格证或学校开具的在职证明，审核通过后即可使用全部教学功能。' },
      { q: '教师功能需要付费吗？', a: '认证教师使用全部教学功能完全免费，无任何隐藏收费。' },
      { q: '一个教师可以管理多少班级？', a: '目前没有班级数量限制，教师可以根据需要创建和管理多个班级。' },
      { q: 'AI批改支持哪些科目？', a: '支持语文、数学、英语、物理、化学、生物、历史、地理、政治等9大学科的客观题批改。' }
    ]
  },
  'oral-english': {
    title: '英语口语练习',
    subtitle: 'AI评分发音，精准提升口语能力',
    icon: '🗣️',
    iconBg: 'linear-gradient(135deg,#EFF6FF,#BFDBFE)',
    overview: [
      '英语口语练习功能帮助学生提升英语发音和口语表达能力。支持美式和英式两种口音选择，提供常速和慢速两种播放速度。',
      'AI评分系统从准确度、流畅度、完整度三个维度进行综合评估，并对每个单词和音节进行颜色标注（绿色优秀、黄色一般、红色需改进），帮助学生精准定位发音问题。',
      '独特的口语错题本功能会记录发音不达标的单词和句子，学生需要连续3次评分达到80分以上才能自动移除，确保真正掌握。'
    ],
    abilities: [
      { icon: '🎤', title: '语音评测', desc: 'AI从准确度、流畅度、完整度三维度评分' },
      { icon: '🔤', title: '逐词标注', desc: '每个单词颜色标注发音质量，精准定位问题' },
      { icon: '🇺🇸', title: '双口音', desc: '支持美式和英式两种口音的标准发音' },
      { icon: '📒', title: '口语错题本', desc: '自动记录发音不标准的内容，需3次80+才移除' }
    ],
    flow: [
      { title: '选择内容', desc: '选择要练习的句子或段落，试听标准发音' },
      { title: '跟读录音', desc: '点击录音按钮，跟读标准发音' },
      { title: 'AI评分', desc: '系统即时给出准确度、流畅度、完整度评分' },
      { title: '查看详情', desc: '查看逐词评分和颜色标注，针对性改进' }
    ],
    scenarios: [
      { icon: '📖', title: '课文跟读', desc: '跟读英语课文，纠正发音错误' },
      { icon: '🗣️', title: '口语考试', desc: '模拟口语考试场景，提前适应评分标准' },
      { icon: '📝', title: '单词发音', desc: '逐个练习单词发音，确保读音准确' },
      { icon: '🎯', title: '薄弱音纠正', desc: '针对口语错题本中的弱项集中练习' }
    ],
    faq: [
      { q: '每天可以练习几次？', a: '每日5次免费口语评分，超出后观看广告即可继续。' },
      { q: '评分标准是什么？', a: 'AI从准确度（发音是否标准）、流畅度（是否流畅自然）、完整度（是否读完整段内容）三个维度评分，总分100分。' },
      { q: '口语错题本怎么用？', a: '发音不达标的内容会自动进入口语错题本，需要连续3次评分达到80分以上才会自动移除。' },
      { q: '支持哪些年级？', a: '支持小学到高中各年级的英语口语练习内容。' }
    ]
  },
  'invite-system': {
    title: '邀请码系统',
    subtitle: '分享即获益，教师学生共赢的获客闭环',
    icon: '🎁',
    iconBg: 'linear-gradient(135deg,#F0FDF4,#BBF7D0)',
    overview: [
      '爱辅学的邀请码系统是一个教师→学生→学生的三级传播体系。认证教师拥有专属的TEACHER-XXXXXX格式邀请码，学生使用该码注册即可获得30天全功能体验。',
      '每位注册用户也拥有自己的USER-XXXXXX格式邀请码，分享给好友注册可赠送7天全功能体验。全功能体验期间，原本需要观看广告的功能直接解锁使用。',
      '这种"教师驱动、学生裂变"的模式，让获客自然融入教学场景，教师乐于推荐优质教学工具，学生乐于分享好用的学习助手。'
    ],
    abilities: [
      { icon: '👨‍🏫', title: '教师邀请码', desc: 'TEACHER-XXXXXX格式，学生注册送30天全功能体验' },
      { icon: '👤', title: '用户邀请码', desc: 'USER-XXXXXX格式，好友注册送7天全功能体验' },
      { icon: '🔒', title: '防滥用机制', desc: '每个邀请码每个账号只能使用一次' },
      { icon: '🔄', title: '传播闭环', desc: '教师→学生→学生的三级裂变传播体系' }
    ],
    flow: [
      { title: '获取邀请码', desc: '教师或用户在"我的"页面查看专属邀请码' },
      { title: '分享邀请码', desc: '通过微信、QQ等渠道分享邀请码给好友' },
      { title: '好友注册', desc: '好友在注册时输入邀请码，自动激活全功能体验' },
      { title: '共同受益', desc: '分享者和被邀请者都能获得良好的使用体验' }
    ],
    scenarios: [
      { icon: '🏫', title: '班级推广', desc: '教师在班级群分享邀请码，学生注册即获30天体验' },
      { icon: '👫', title: '同学推荐', desc: '学生分享邀请码给同学，互相获得7天体验' },
      { icon: '👨‍👩‍👧', title: '家庭共享', desc: '家长注册后分享给其他家长，共同关注孩子学习' },
      { icon: '📢', title: '社群传播', desc: '在学习交流群中分享邀请码，快速扩散' }
    ],
    faq: [
      { q: '全功能体验包含哪些？', a: '全功能体验期间，所有需要观看广告的功能（导出、练习、批改等）均可直接使用，无需观看广告。' },
      { q: '邀请码可以反复使用吗？', a: '每个邀请码每个账号只能使用一次，但同一邀请码可以被不同用户使用。' },
      { q: '体验期结束后怎么办？', a: '体验期结束后回到免费版，核心功能仍然无限使用，部分功能需要观看广告解锁。' },
      { q: '邀请码在哪里查看？', a: '登录App后，在"我的"页面可以查看你的专属邀请码。' }
    ]
  }
}

const feature = computed(() => {
  const slug = route.params.slug as string
  return featuresMap[slug] || null
})
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); }
}
.breadcrumb { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; font-size: 14px; color: var(--text3);
  a { color: var(--primary); &:hover { text-decoration: underline; } }
  .sep { color: var(--border); }
  .current { color: var(--text2); }
}

.overview-block { display: flex; gap: 40px; align-items: flex-start; margin-bottom: 80px; }
.overview-icon { width: 120px; height: 120px; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 56px; flex-shrink: 0; }
.overview-text { flex: 1;
  h2 { font-size: 28px; font-weight: 800; color: var(--text1); margin-bottom: 16px; }
  p { font-size: 16px; color: var(--text2); line-height: 1.9; margin-bottom: 12px; }
}

.abilities-section { margin-bottom: 80px; }
.abilities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ability-card { background: var(--bg-light); border-radius: 20px; padding: 32px 24px; transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
  h3 { font-size: 18px; font-weight: 700; color: var(--text1); margin: 12px 0 8px; }
  p { font-size: 14px; color: var(--text3); line-height: 1.7; }
}
.ability-icon { font-size: 36px; }

.flow-section { margin-bottom: 80px; }
.flow-steps { display: flex; justify-content: center; gap: 0; position: relative; }
.flow-step { text-align: center; flex: 1; max-width: 240px; position: relative; padding: 0 16px;
  h4 { font-size: 16px; font-weight: 700; color: var(--text1); margin: 16px 0 8px; }
  p { font-size: 14px; color: var(--text3); line-height: 1.6; }
}
.flow-num { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; font-size: 20px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto; position: relative; z-index: 2; }
.flow-line { position: absolute; top: 24px; left: calc(50% + 32px); width: calc(100% - 16px); height: 2px; background: var(--border); z-index: 1; }

.scenario-section { margin-bottom: 80px; }
.scenario-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.scenario-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 28px 20px; text-align: center; transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
  h4 { font-size: 16px; font-weight: 700; color: var(--text1); margin: 12px 0 6px; }
  p { font-size: 13px; color: var(--text3); line-height: 1.6; }
}
.scenario-icon { font-size: 36px; }

.faq-section { margin-bottom: 40px; }
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item { background: var(--bg-light); border-radius: 16px; margin-bottom: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s;
  &:hover { background: #f0f2f8; }
}
.faq-q { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; font-size: 16px; font-weight: 600; color: var(--text1); }
.faq-arrow { font-size: 12px; color: var(--text3); transition: transform 0.3s; }
.faq-arrow.open { transform: rotate(180deg); }
.faq-a { padding: 0 24px 20px; font-size: 15px; color: var(--text2); line-height: 1.8; }

.cta-section { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff;
  h2 { font-size: 36px; font-weight: 800; }
}

.section-title { text-align: center; margin-bottom: 40px;
  h2 { font-size: 32px; font-weight: 800; color: var(--text1); }
}
</style>
