<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container">
        <h1>帮助中心</h1>
        <p>在这里找到你需要的答案</p>
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="搜索问题..." />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <button v-for="c in categories" :key="c.id" :class="['cat-tab', activeCategory === c.id ? 'active' : '']" @click="activeCategory = c.id">
            <span class="cat-icon">{{ c.icon }}</span>
            <span>{{ c.name }}</span>
          </button>
        </div>

        <!-- FAQ列表 -->
        <div class="faq-grid">
          <router-link v-for="item in filteredItems" :key="item.slug" :to="`/help/${item.slug}`" class="faq-card">
            <div class="faq-card-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <span class="faq-link">查看详情 &rarr;</span>
          </router-link>
        </div>

        <div v-if="filteredItems.length === 0" class="empty-state">
          <p>没有找到相关问题，请尝试其他关键词</p>
        </div>
      </div>
    </section>

    <!-- 联系客服 -->
    <section class="section section-alt">
      <div class="container" style="text-align:center;">
        <h2 style="font-size:32px;font-weight:800;margin-bottom:16px;">没有找到答案？</h2>
        <p style="color:var(--text3);font-size:16px;margin-bottom:32px;">联系我们的客服团队，获取更多帮助</p>
        <div class="contact-row">
          <div class="contact-item">
            <span class="ci-icon">📧</span>
            <h4>邮件支持</h4>
            <p>support@aifuxue.cn</p>
          </div>
          <div class="contact-item">
            <span class="ci-icon">💬</span>
            <h4>微信公众号</h4>
            <p>搜索"爱辅学"</p>
          </div>
          <div class="contact-item">
            <span class="ci-icon">📞</span>
            <h4>客服热线</h4>
            <p>工作日 9:00-18:00</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'getting-started', name: '入门指南', icon: '🚀' },
  { id: 'features', name: '功能使用', icon: '⚙️' },
  { id: 'account', name: '账号管理', icon: '👤' },
  { id: 'teacher', name: '教师功能', icon: '👨‍🏫' },
  { id: 'payment', name: '费用说明', icon: '💰' },
]

interface HelpItem {
  slug: string
  title: string
  summary: string
  icon: string
  category: string
}

const helpItems: HelpItem[] = [
  { slug: 'how-to-register', title: '如何注册爱辅学账号', summary: '了解注册流程，选择适合的角色（学生/家长/教师）开始使用', icon: '📝', category: 'getting-started' },
  { slug: 'role-differences', title: '学生、家长、教师角色有何区别', summary: '了解三种角色的功能权限差异和各自的专属功能', icon: '👥', category: 'getting-started' },
  { slug: 'first-note', title: '如何整理第一份笔记', summary: '拍照上传课堂笔记，AI自动识别和整理的详细教程', icon: '📷', category: 'getting-started' },
  { slug: 'note-export', title: '如何导出笔记', summary: '了解笔记导出的格式选择（PDF/图片/Word）和每日免费次数', icon: '📤', category: 'features' },
  { slug: 'mistake-record', title: '如何录入错题', summary: '拍照录入错题的操作步骤和AI诊断结果说明', icon: '🔍', category: 'features' },
  { slug: 'targeted-practice-guide', title: '如何使用靶向练习', summary: '靶向练习的生成规则、答题流程和正确率追踪说明', icon: '🎯', category: 'features' },
  { slug: 'oral-english-guide', title: '英语口语练习指南', summary: '口语练习的操作方法、评分标准和口语错题本使用方式', icon: '🗣️', category: 'features' },
  { slug: 'parent-control', title: '家长控制功能说明', summary: '设置家长密码、使用时长管控和学习周报功能介绍', icon: '👨‍👩‍👧', category: 'features' },
  { slug: 'change-password', title: '如何修改密码', summary: '通过手机验证码修改账号登录密码', icon: '🔐', category: 'account' },
  { slug: 'bind-phone', title: '如何更换绑定手机', summary: '更换手机号码的操作步骤和注意事项', icon: '📱', category: 'account' },
  { slug: 'delete-account', title: '如何注销账号', summary: '账号注销流程和数据删除说明', icon: '🗑️', category: 'account' },
  { slug: 'teacher-verify', title: '教师认证流程', summary: '教师资格认证的材料要求和审核时间', icon: '✅', category: 'teacher' },
  { slug: 'create-class', title: '如何创建班级', summary: '创建班级、生成邀请码、管理学生的详细教程', icon: '🏫', category: 'teacher' },
  { slug: 'publish-homework', title: '如何发布作业', summary: '在线作业和离线作业的创建和发布流程', icon: '📋', category: 'teacher' },
  { slug: 'ai-grading', title: 'AI批改功能说明', summary: 'AI自动批改的支持科目、准确率和每日配额', icon: '🤖', category: 'teacher' },
  { slug: 'free-model', title: '爱辅学收费吗', summary: '全部免费+广告解锁模式说明，无任何付费项目', icon: '💰', category: 'payment' },
  { slug: 'ad-unlock', title: '广告解锁机制说明', summary: '哪些功能需要广告解锁、每日免费额度详细说明', icon: '📺', category: 'payment' },
  { slug: 'invite-benefit', title: '邀请码使用和获益', summary: '教师邀请码和用户邀请码的使用方式和获益说明', icon: '🎁', category: 'payment' },
]

const filteredItems = computed(() => {
  let items = helpItems
  if (activeCategory.value !== 'all') {
    items = items.filter(i => i.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q))
  }
  return items
})
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); margin-bottom: 28px; }
}
.search-bar { max-width: 500px; margin: 0 auto;
  input { width: 100%; padding: 14px 24px; border: 2px solid var(--border); border-radius: 14px; font-size: 16px; color: var(--text1); outline: none; transition: border-color 0.2s;
    &:focus { border-color: var(--primary); }
    &::placeholder { color: var(--text3); }
  }
}

.category-tabs { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 48px; }
.cat-tab { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 12px; border: 2px solid var(--border); background: #fff; font-size: 14px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all 0.2s;
  &:hover { border-color: var(--primary); color: var(--primary); }
  &.active { background: var(--primary); border-color: var(--primary); color: #fff; }
}
.cat-icon { font-size: 16px; }

.faq-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.faq-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 28px 24px; transition: all 0.3s; display: block;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); border-color: var(--primary); }
  h3 { font-size: 17px; font-weight: 700; color: var(--text1); margin: 14px 0 8px; }
  p { font-size: 14px; color: var(--text3); line-height: 1.7; margin-bottom: 12px; }
}
.faq-card-icon { font-size: 32px; }
.faq-link { font-size: 14px; font-weight: 600; color: var(--primary); }

.empty-state { text-align: center; padding: 60px 0; color: var(--text3); font-size: 16px; }

.contact-row { display: flex; gap: 40px; justify-content: center; }
.contact-item { text-align: center;
  h4 { font-size: 16px; font-weight: 700; color: var(--text1); margin: 10px 0 4px; }
  p { font-size: 14px; color: var(--text2); }
}
.ci-icon { font-size: 36px; }
</style>
