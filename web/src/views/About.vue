<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container"><h1>关于爱辅学</h1><p>用AI技术赋能教育，让每个学生都能高效学习</p></div>
    </section>

    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <h2>我们的愿景</h2>
            <p>爱辅学是一款AI驱动的智能学习助手，致力于解决中小学生课后学习效率低、错题积累难消化、练习缺乏针对性等问题。</p>
            <p>通过拍照笔记整理、AI错题诊断、靶向练习生成、智能模拟考试、英语口语评测等功能，帮助学生建立高效的学习闭环。</p>
            <p>同时为家长提供学习时长管控、周报推送、答案密码保护等功能，让家长放心，让学习更有效。</p>
          </div>
          <div class="about-stats">
            <div class="as-card" v-for="s in stats" :key="s.label">
              <span class="as-value">{{ s.value }}</span>
              <span class="as-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-title"><h2>技术栈</h2><p>基于主流技术构建</p></div>
        <div class="tech-grid">
          <div v-for="t in techs" :key="t.name" class="tech-card">
            <span class="tech-icon">{{ t.icon }}</span>
            <h4>{{ t.name }}</h4>
            <p>{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title"><h2>联系我们</h2><p>有问题随时联系</p></div>
        <div class="contact-grid">
          <div class="contact-card">
            <span class="ci">📧</span><h4>邮箱</h4><p>support@aifuxue.com</p>
          </div>
          <div class="contact-card">
            <span class="ci">💬</span><h4>微信</h4><p>搜索 "爱辅学" 公众号</p>
          </div>
          <div class="contact-card">
            <span class="ci">📞</span><h4>电话</h4><p>400-800-XXXX</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const stats = [
  { value: '12,000+', label: '注册用户' },
  { value: '48,000+', label: '整理笔记' },
  { value: '126,000+', label: '练习次数' },
  { value: '9', label: '覆盖科目' },
  { value: '31', label: '省份覆盖' },
  { value: '5,600+', label: '题库题量' },
]

const techs = [
  { icon: '⚡', name: 'Vue 3', desc: '前端框架' },
  { icon: '📱', name: 'uni-app', desc: '跨平台移动端' },
  { icon: '🖥️', name: 'Element Plus', desc: '后台管理UI' },
  { icon: '🧠', name: 'AI/OCR', desc: '智能识别处理' },
  { icon: '🗃️', name: 'MySQL', desc: '阿里云数据库' },
  { icon: '🚀', name: 'NestJS', desc: '后端服务框架' },
]
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); }
}
.about-grid { display: flex; gap: 60px; align-items: center; }
.about-text { flex: 1;
  h2 { font-size: 32px; font-weight: 800; color: var(--text1); margin-bottom: 20px; }
  p { font-size: 16px; color: var(--text2); line-height: 1.9; margin-bottom: 16px; }
}
.about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex-shrink: 0; }
.as-card { background: var(--bg-light); border-radius: 16px; padding: 24px; text-align: center; min-width: 140px; }
.as-value { font-size: 28px; font-weight: 800; color: var(--primary); display: block; }
.as-label { font-size: 13px; color: var(--text3); }
.tech-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.tech-card { text-align: center; background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 16px;
  h4 { font-size: 15px; font-weight: 700; margin: 8px 0 4px; color: var(--text1); }
  p { font-size: 12px; color: var(--text3); }
}
.tech-icon { font-size: 36px; }
.contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.contact-card { text-align: center; background: var(--bg-light); border-radius: 20px; padding: 36px 24px;
  h4 { font-size: 18px; font-weight: 700; margin: 12px 0 8px; color: var(--text1); }
  p { font-size: 15px; color: var(--text2); }
}
.ci { font-size: 36px; }
</style>
