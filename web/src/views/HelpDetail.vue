<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <router-link to="/help">帮助中心</router-link>
          <span class="sep">/</span>
          <span class="current">{{ article?.title }}</span>
        </div>
        <h1>{{ article?.title || '文章未找到' }}</h1>
      </div>
    </section>

    <section class="section" v-if="article">
      <div class="container">
        <div class="article-layout">
          <aside class="article-sidebar">
            <h4>相关文章</h4>
            <router-link v-for="r in relatedArticles" :key="r.slug" :to="`/help/${r.slug}`" class="related-link" :class="{ active: r.slug === route.params.slug }">
              <span class="rl-icon">{{ r.icon }}</span>
              <span>{{ r.title }}</span>
            </router-link>
          </aside>
          <article class="article-content">
            <div class="article-meta">
              <span class="meta-category">{{ categoryName }}</span>
              <span class="meta-date">最后更新：2026年5月</span>
            </div>
            <div class="article-body" v-html="article.content"></div>
            <div class="article-helpful">
              <p>这篇文章对你有帮助吗？</p>
              <div class="helpful-btns">
                <button class="helpful-btn" @click="helpful = true" :class="{ selected: helpful === true }">👍 有帮助</button>
                <button class="helpful-btn" @click="helpful = false" :class="{ selected: helpful === false }">👎 没帮助</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section" v-else>
      <div class="container" style="text-align:center;padding:80px 0;">
        <h2 style="font-size:28px;margin-bottom:16px;">文章未找到</h2>
        <p style="color:var(--text3);margin-bottom:24px;">请返回帮助中心查看其他文章</p>
        <router-link to="/help" class="btn btn-primary">返回帮助中心</router-link>
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
const helpful = ref<boolean | null>(null)

interface ArticleData {
  title: string
  icon: string
  category: string
  content: string
}

const articlesMap: Record<string, ArticleData> = {
  'how-to-register': {
    title: '如何注册爱辅学账号',
    icon: '📝',
    category: 'getting-started',
    content: `
      <h2>注册步骤</h2>
      <p>爱辅学支持手机号验证码注册，注册过程简单快捷。</p>
      <h3>第一步：打开应用</h3>
      <p>下载并打开爱辅学App（或微信小程序），点击"注册"按钮。</p>
      <h3>第二步：输入手机号</h3>
      <p>输入你的手机号码，点击"获取验证码"。验证码将在60秒内发送到你的手机。</p>
      <h3>第三步：设置密码</h3>
      <p>输入收到的验证码后，设置你的登录密码。密码需要6位以上，建议包含字母和数字。</p>
      <h3>第四步：选择角色</h3>
      <p>选择你的角色身份：</p>
      <ul>
        <li><strong>学生</strong>：使用笔记整理、错题诊断、靶向练习等学习功能</li>
        <li><strong>家长</strong>：查看学习报告、设置使用时长、管控答案查看</li>
        <li><strong>教师</strong>：创建班级、发布作业、AI批改（需完成教师认证）</li>
      </ul>
      <h3>第五步：输入邀请码（可选）</h3>
      <p>如果你有教师邀请码（TEACHER-XXXXXX）或用户邀请码（USER-XXXXXX），可以在此处输入，获得全功能体验。</p>
      <div class="tip-box">
        <strong>💡 提示：</strong>教师邀请码注册可获得30天全功能体验，用户邀请码注册可获得7天全功能体验。
      </div>
    `
  },
  'role-differences': {
    title: '学生、家长、教师角色有何区别',
    icon: '👥',
    category: 'getting-started',
    content: `
      <h2>角色功能对比</h2>
      <p>爱辅学提供三种角色，每种角色拥有不同的功能权限：</p>
      <h3>学生角色</h3>
      <ul>
        <li>拍照笔记整理和导出</li>
        <li>错题录入和AI诊断</li>
        <li>靶向练习和模拟考试</li>
        <li>英语口语练习</li>
        <li>加入班级和完成作业</li>
        <li>查看学习统计</li>
      </ul>
      <h3>家长角色</h3>
      <ul>
        <li>查看孩子的学习报告和数据</li>
        <li>设置使用时长管控</li>
        <li>密码保护答案查看</li>
        <li>接收学习周报推送</li>
      </ul>
      <h3>教师角色</h3>
      <ul>
        <li>创建和管理多个班级</li>
        <li>发布在线/离线作业</li>
        <li>AI自动批改作业</li>
        <li>查看学情分析和错题热点</li>
        <li>专属教师邀请码</li>
        <li>同时拥有全部学生功能</li>
      </ul>
      <div class="tip-box">
        <strong>💡 提示：</strong>教师角色需要完成实名认证后才能使用教学功能。认证通过前可以正常使用学生功能。
      </div>
    `
  },
  'first-note': {
    title: '如何整理第一份笔记',
    icon: '📷',
    category: 'getting-started',
    content: `
      <h2>整理笔记教程</h2>
      <p>跟着以下步骤，轻松整理你的第一份笔记。</p>
      <h3>1. 进入笔记功能</h3>
      <p>打开App首页，点击"拍课后笔记"按钮。</p>
      <h3>2. 拍照或选择图片</h3>
      <p>你可以直接拍照，也可以从手机相册中选择已有的笔记照片。支持一次选择多张图片。</p>
      <h3>3. 选择科目</h3>
      <p>选择笔记对应的学科，如语文、数学、英语等，以便AI更准确地理解和整理内容。</p>
      <h3>4. 等待AI处理</h3>
      <p>系统将自动进行OCR文字识别和AI智能整理，通常需要10-30秒。</p>
      <h3>5. 查看和编辑</h3>
      <p>AI整理完成后，你可以查看生成的Markdown文档。支持手动编辑和补充内容。</p>
      <h3>6. 导出分享</h3>
      <p>选择PDF、图片或Word格式导出笔记。每日3次免费导出，超出后观看广告即可继续。</p>
      <div class="tip-box">
        <strong>💡 拍照技巧：</strong>确保光线充足、笔记平放、画面清晰，避免反光和阴影，这样可以获得更好的识别效果。
      </div>
    `
  },
  'note-export': {
    title: '如何导出笔记',
    icon: '📤',
    category: 'features',
    content: `
      <h2>笔记导出说明</h2>
      <h3>支持的导出格式</h3>
      <ul>
        <li><strong>PDF格式</strong>：适合打印和正式保存</li>
        <li><strong>图片格式</strong>：适合分享到微信等社交平台</li>
        <li><strong>Word格式</strong>：适合进一步编辑和修改</li>
      </ul>
      <h3>导出额度</h3>
      <p>每日提供3次免费导出额度。超出免费次数后，可通过观看一段短视频广告解锁额外导出次数。使用邀请码获得全功能体验期间，导出无次数限制。</p>
      <h3>导出步骤</h3>
      <ol>
        <li>打开已整理的笔记</li>
        <li>点击右上角"导出"按钮</li>
        <li>选择导出格式</li>
        <li>等待生成完成后保存到手机</li>
      </ol>
    `
  },
  'mistake-record': {
    title: '如何录入错题',
    icon: '🔍',
    category: 'features',
    content: `
      <h2>错题录入教程</h2>
      <h3>录入步骤</h3>
      <ol>
        <li>打开App首页，点击"拍错题录入"</li>
        <li>拍照或选择错题图片（支持多张）</li>
        <li>选择错题对应的学科</li>
        <li>系统自动OCR识别并调用AI分析</li>
      </ol>
      <h3>AI诊断结果</h3>
      <p>诊断完成后，你将看到：</p>
      <ul>
        <li><strong>涉及知识点</strong>：这道题考查的核心知识点</li>
        <li><strong>错误类型</strong>：计算错误、概念不清、审题偏差或完全不会</li>
        <li><strong>错误原因</strong>：具体的错误分析</li>
        <li><strong>避错建议</strong>：如何避免同类错误</li>
      </ul>
      <h3>同类变式题</h3>
      <p>诊断完成后，系统会自动生成3道同类变式题，帮助你巩固相关知识点。每日5题免费，超出后观看广告即可继续。</p>
    `
  },
  'targeted-practice-guide': {
    title: '如何使用靶向练习',
    icon: '🎯',
    category: 'features',
    content: `
      <h2>靶向练习指南</h2>
      <h3>什么是靶向练习？</h3>
      <p>靶向练习根据你的笔记和错题数据，智能生成针对性的练习题，帮助你精准提高薄弱知识点。</p>
      <h3>使用方法</h3>
      <ol>
        <li>在首页点击"靶向练习"</li>
        <li>选择要练习的科目</li>
        <li>系统自动生成一组练习题</li>
        <li>完成答题后提交</li>
        <li>查看正确率和详细解析</li>
      </ol>
      <h3>题型说明</h3>
      <p>靶向练习包含三种题型：选择题、填空题和判断题，全面覆盖各类考试题型。</p>
      <h3>每日额度</h3>
      <p>每日2次免费生成靶向练习，超出后观看广告即可继续使用。</p>
    `
  },
  'oral-english-guide': {
    title: '英语口语练习指南',
    icon: '🗣️',
    category: 'features',
    content: `
      <h2>口语练习使用说明</h2>
      <h3>功能介绍</h3>
      <p>英语口语练习支持美式和英式两种口音，提供常速和慢速播放，AI从准确度、流畅度、完整度三个维度进行评分。</p>
      <h3>练习步骤</h3>
      <ol>
        <li>进入英语口语模块</li>
        <li>选择口音（美式/英式）和播放速度</li>
        <li>试听标准发音</li>
        <li>点击录音按钮开始跟读</li>
        <li>录音完成后等待AI评分</li>
      </ol>
      <h3>评分标准</h3>
      <ul>
        <li><strong>准确度</strong>：每个单词的发音是否标准</li>
        <li><strong>流畅度</strong>：朗读是否流畅自然，无过多停顿</li>
        <li><strong>完整度</strong>：是否完整读完全部内容</li>
      </ul>
      <h3>口语错题本</h3>
      <p>发音不达标的内容会自动进入口语错题本。需要连续3次评分达到80分以上才能自动移除，确保你真正掌握了正确发音。</p>
    `
  },
  'parent-control': {
    title: '家长控制功能说明',
    icon: '👨‍👩‍👧',
    category: 'features',
    content: `
      <h2>家长控制功能</h2>
      <h3>答案密码保护</h3>
      <p>家长可以设置密码来保护答案查看功能，防止孩子在做练习时直接查看答案，引导独立思考。</p>
      <h3>使用时长管控</h3>
      <p>家长可以设置每日使用时长限制，到达限制后App会提醒休息，帮助孩子合理安排学习时间。</p>
      <h3>学习周报</h3>
      <p>每周自动生成学习报告，包含本周学习时长、完成练习数量、正确率变化等数据，推送给家长查看。</p>
      <h3>设置方法</h3>
      <ol>
        <li>以家长角色登录App</li>
        <li>进入"我的" → "家长设置"</li>
        <li>设置家长密码</li>
        <li>开启需要的管控功能</li>
      </ol>
    `
  },
  'change-password': {
    title: '如何修改密码',
    icon: '🔐',
    category: 'account',
    content: `
      <h2>修改密码</h2>
      <h3>操作步骤</h3>
      <ol>
        <li>进入"我的"页面</li>
        <li>点击"账号设置"</li>
        <li>选择"修改密码"</li>
        <li>输入当前密码</li>
        <li>输入新密码（6位以上）</li>
        <li>确认新密码并提交</li>
      </ol>
      <h3>忘记密码？</h3>
      <p>如果忘记当前密码，可以通过手机验证码重置密码。在登录页面点击"忘记密码"，输入注册手机号获取验证码即可重置。</p>
    `
  },
  'bind-phone': {
    title: '如何更换绑定手机',
    icon: '📱',
    category: 'account',
    content: `
      <h2>更换绑定手机号</h2>
      <h3>操作步骤</h3>
      <ol>
        <li>进入"我的" → "账号设置"</li>
        <li>选择"更换手机号"</li>
        <li>验证原手机号（发送验证码）</li>
        <li>输入新手机号并获取验证码</li>
        <li>完成验证后自动绑定新手机号</li>
      </ol>
      <div class="tip-box">
        <strong>⚠️ 注意：</strong>更换手机号后，下次登录需要使用新手机号。
      </div>
    `
  },
  'delete-account': {
    title: '如何注销账号',
    icon: '🗑️',
    category: 'account',
    content: `
      <h2>账号注销</h2>
      <h3>注销须知</h3>
      <p>账号注销后，以下数据将被永久删除且无法恢复：</p>
      <ul>
        <li>所有笔记数据</li>
        <li>所有错题记录和诊断结果</li>
        <li>练习和考试历史</li>
        <li>班级信息和作业记录</li>
        <li>个人设置和偏好</li>
      </ul>
      <h3>注销步骤</h3>
      <ol>
        <li>进入"我的" → "账号设置"</li>
        <li>滑到底部点击"注销账号"</li>
        <li>阅读注销须知并确认</li>
        <li>输入登录密码验证身份</li>
        <li>确认注销</li>
      </ol>
      <div class="tip-box">
        <strong>⚠️ 重要：</strong>账号注销后所有数据将在7个工作日内完全删除，且无法恢复。请慎重操作。
      </div>
    `
  },
  'teacher-verify': {
    title: '教师认证流程',
    icon: '✅',
    category: 'teacher',
    content: `
      <h2>教师认证</h2>
      <h3>认证材料</h3>
      <p>请准备以下材料之一：</p>
      <ul>
        <li>教师资格证照片（正反面）</li>
        <li>学校开具的在职证明</li>
        <li>其他可证明教师身份的官方材料</li>
      </ul>
      <h3>认证步骤</h3>
      <ol>
        <li>以教师角色注册或在"我的"中切换为教师角色</li>
        <li>进入"教师认证"页面</li>
        <li>填写真实姓名、学校名称、任教科目</li>
        <li>上传认证材料照片</li>
        <li>提交等待审核</li>
      </ol>
      <h3>审核时间</h3>
      <p>通常1-3个工作日内完成审核。审核结果将通过App消息通知和短信告知。</p>
    `
  },
  'create-class': {
    title: '如何创建班级',
    icon: '🏫',
    category: 'teacher',
    content: `
      <h2>创建班级教程</h2>
      <h3>前提条件</h3>
      <p>需要先完成教师认证后才能创建班级。</p>
      <h3>创建步骤</h3>
      <ol>
        <li>进入"我的班级"页面</li>
        <li>点击"创建班级"</li>
        <li>填写班级名称（如"高一(3)班"）</li>
        <li>选择科目</li>
        <li>系统自动生成CLASS-XXXXXX邀请码</li>
      </ol>
      <h3>邀请学生</h3>
      <p>将CLASS-XXXXXX邀请码分享给学生，学生在App中输入邀请码即可加入班级。</p>
    `
  },
  'publish-homework': {
    title: '如何发布作业',
    icon: '📋',
    category: 'teacher',
    content: `
      <h2>发布作业教程</h2>
      <h3>在线作业</h3>
      <p>在线作业由教师在App中创建题目，学生在线答题，AI自动批改。</p>
      <ol>
        <li>进入班级页面</li>
        <li>点击"发布作业" → "在线作业"</li>
        <li>添加题目（选择题/填空题/判断题）</li>
        <li>设置截止时间</li>
        <li>发布到班级</li>
      </ol>
      <h3>离线作业</h3>
      <p>离线作业由教师布置，学生拍照或录音提交完成结果。</p>
      <ol>
        <li>进入班级页面</li>
        <li>点击"发布作业" → "离线作业"</li>
        <li>填写作业要求和说明</li>
        <li>设置截止时间和提交方式（拍照/录音）</li>
        <li>发布到班级</li>
      </ol>
    `
  },
  'ai-grading': {
    title: 'AI批改功能说明',
    icon: '🤖',
    category: 'teacher',
    content: `
      <h2>AI自动批改</h2>
      <h3>支持科目</h3>
      <p>AI批改支持语文、数学、英语、物理、化学、生物、历史、地理、政治等9大学科的客观题（选择题、判断题、填空题）。</p>
      <h3>每日配额</h3>
      <ul>
        <li>在线作业批改：每日50次免费</li>
        <li>离线作业批改：每日50次免费</li>
        <li>超出后可通过观看广告获得额外配额</li>
      </ul>
      <h3>批改流程</h3>
      <p>学生提交作业后，AI自动完成批改并给出评分。教师可以在班级管理中查看整体完成率和正确率分析。</p>
    `
  },
  'free-model': {
    title: '爱辅学收费吗',
    icon: '💰',
    category: 'payment',
    content: `
      <h2>费用说明</h2>
      <h3>全部免费</h3>
      <p>爱辅学<strong>全部功能免费开放</strong>，没有任何付费订阅或内购项目。</p>
      <h3>广告解锁模式</h3>
      <p>部分功能有每日免费额度限制。超出免费额度后，通过观看一段短视频广告即可继续使用，无需任何付费。</p>
      <h3>全功能体验</h3>
      <p>通过邀请码注册可以获得全功能体验（教师邀请码30天、用户邀请码7天），体验期间所有功能无限制使用，无需观看广告。</p>
    `
  },
  'ad-unlock': {
    title: '广告解锁机制说明',
    icon: '📺',
    category: 'payment',
    content: `
      <h2>广告解锁详情</h2>
      <h3>每日免费额度</h3>
      <table>
        <tr><th>功能</th><th>每日免费次数</th></tr>
        <tr><td>笔记导出（PDF/图片/Word）</td><td>3次</td></tr>
        <tr><td>靶向练习生成</td><td>2次</td></tr>
        <tr><td>同类变式题生成</td><td>5题</td></tr>
        <tr><td>口语评分</td><td>5次</td></tr>
        <tr><td>AI批改（在线+离线）</td><td>各50次</td></tr>
      </table>
      <h3>超出后怎么办</h3>
      <p>超出每日免费额度后，系统会提示观看一段短视频广告（通常15-30秒），观看完成后即可继续使用该功能一次。</p>
      <h3>哪些功能完全免费</h3>
      <p>以下功能无限制使用，不需要广告解锁：</p>
      <ul>
        <li>笔记整理（仅导出有额度）</li>
        <li>错题录入和AI诊断</li>
        <li>加入班级和完成作业</li>
        <li>查看学习统计和周报</li>
      </ul>
    `
  },
  'invite-benefit': {
    title: '邀请码使用和获益',
    icon: '🎁',
    category: 'payment',
    content: `
      <h2>邀请码体系</h2>
      <h3>教师邀请码</h3>
      <ul>
        <li>格式：TEACHER-XXXXXX</li>
        <li>获取方式：完成教师认证后自动生成</li>
        <li>获益：学生使用该码注册获得<strong>30天全功能体验</strong></li>
      </ul>
      <h3>用户邀请码</h3>
      <ul>
        <li>格式：USER-XXXXXX</li>
        <li>获取方式：注册后在"我的"页面查看</li>
        <li>获益：好友使用该码注册获得<strong>7天全功能体验</strong></li>
      </ul>
      <h3>使用规则</h3>
      <ul>
        <li>每个邀请码每个账号只能使用一次</li>
        <li>同一邀请码可以被不同用户使用</li>
        <li>只能在注册时使用邀请码</li>
      </ul>
      <h3>全功能体验内容</h3>
      <p>全功能体验期间，所有需要广告解锁的功能均可直接使用，无需观看广告。体验期结束后自动恢复为免费版，核心功能仍然无限使用。</p>
    `
  }
}

const article = computed(() => {
  const slug = route.params.slug as string
  return articlesMap[slug] || null
})

const categoryName = computed(() => {
  const catMap: Record<string, string> = {
    'getting-started': '入门指南',
    'features': '功能使用',
    'account': '账号管理',
    'teacher': '教师功能',
    'payment': '费用说明'
  }
  return article.value ? catMap[article.value.category] || '' : ''
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  return Object.entries(articlesMap)
    .filter(([, a]) => a.category === article.value!.category)
    .map(([slug, a]) => ({ slug, title: a.title, icon: a.icon }))
})
</script>

<style scoped>
.page-hero { padding: 140px 0 40px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 36px; font-weight: 800; color: var(--text1); }
}
.breadcrumb { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; font-size: 14px; color: var(--text3);
  a { color: var(--primary); &:hover { text-decoration: underline; } }
  .sep { color: var(--border); }
  .current { color: var(--text2); }
}

.article-layout { display: flex; gap: 48px; }
.article-sidebar { width: 260px; flex-shrink: 0; position: sticky; top: 96px; align-self: flex-start;
  h4 { font-size: 14px; font-weight: 700; color: var(--text3); text-transform: uppercase; margin-bottom: 16px; }
}
.related-link { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; font-size: 14px; color: var(--text2); transition: all 0.2s; margin-bottom: 4px;
  &:hover { background: var(--bg-light); color: var(--primary); }
  &.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
}
.rl-icon { font-size: 16px; flex-shrink: 0; }

.article-content { flex: 1; min-width: 0; }
.article-meta { display: flex; gap: 16px; margin-bottom: 32px; }
.meta-category { background: var(--primary-light); color: var(--primary); font-size: 13px; font-weight: 600; padding: 4px 14px; border-radius: 8px; }
.meta-date { font-size: 13px; color: var(--text3); display: flex; align-items: center; }

.article-body {
  :deep(h2) { font-size: 24px; font-weight: 800; color: var(--text1); margin: 40px 0 16px; padding-bottom: 12px; border-bottom: 2px solid var(--bg-light); }
  :deep(h3) { font-size: 18px; font-weight: 700; color: var(--text1); margin: 28px 0 12px; }
  :deep(p) { font-size: 15px; color: var(--text2); line-height: 1.9; margin-bottom: 16px; }
  :deep(ul), :deep(ol) { padding-left: 24px; margin-bottom: 16px; }
  :deep(li) { font-size: 15px; color: var(--text2); line-height: 1.9; margin-bottom: 6px; }
  :deep(table) { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  :deep(th), :deep(td) { padding: 10px 16px; border: 1px solid var(--border); font-size: 14px; text-align: left; }
  :deep(th) { background: var(--bg-light); font-weight: 600; color: var(--text1); }
  :deep(.tip-box) { background: #EEF2FF; border-left: 4px solid var(--primary); padding: 16px 20px; border-radius: 0 12px 12px 0; margin: 20px 0; font-size: 14px; color: var(--text2); line-height: 1.7; }
}

.article-helpful { border-top: 1px solid var(--border); padding-top: 32px; margin-top: 48px; text-align: center;
  p { font-size: 16px; font-weight: 600; color: var(--text1); margin-bottom: 16px; }
}
.helpful-btns { display: flex; gap: 12px; justify-content: center; }
.helpful-btn { padding: 10px 24px; border: 2px solid var(--border); border-radius: 12px; background: #fff; font-size: 14px; cursor: pointer; transition: all 0.2s;
  &:hover { border-color: var(--primary); }
  &.selected { background: var(--primary-light); border-color: var(--primary); color: var(--primary); font-weight: 600; }
}
</style>
