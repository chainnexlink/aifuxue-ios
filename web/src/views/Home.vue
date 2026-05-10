<template>
  <div class="home-page">
    <Navbar />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">AI 驱动的智能学习助手</div>
          <h1>拍照整理笔记<br/>AI诊断错题<br/><span class="gradient-text">让学习更高效</span></h1>
          <p class="hero-desc">爱辅学利用AI技术，帮助学生拍照整理笔记、智能诊断错题、生成靶向练习。教师可创建班级、发布作业、AI自动批改。邀请码获客，人人受益。</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="/download">免费开始使用</a>
            <a class="btn btn-outline btn-lg" href="/features">了解更多</a>
          </div>
          <div class="hero-stats">
            <div class="hs-item"><span class="hs-value">12,000+</span><span class="hs-label">注册用户</span></div>
            <div class="hs-item"><span class="hs-value">500+</span><span class="hs-label">认证教师</span></div>
            <div class="hs-item"><span class="hs-value">1,200+</span><span class="hs-label">活跃班级</span></div>
            <div class="hs-item"><span class="hs-value">126,000+</span><span class="hs-label">AI批改次数</span></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="screen-header"><span class="sh-greeting">下午好，小明</span><span class="sh-badge">免费体验</span></div>
              <div class="screen-cards">
                <div class="sc-card sc-primary"><span class="sc-icon">📷</span><span class="sc-text">拍课后笔记</span></div>
                <div class="sc-card sc-accent"><span class="sc-icon">📝</span><span class="sc-text">拍错题录入</span></div>
              </div>
              <div class="screen-grid">
                <div class="sg-item"><span>🎯</span><span>靶向练习</span></div>
                <div class="sg-item"><span>🏫</span><span>我的班级</span></div>
                <div class="sg-item"><span>📋</span><span>班级作业</span></div>
                <div class="sg-item"><span>🗣️</span><span>英语口语</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section section-alt" id="features">
      <div class="container">
        <div class="section-title"><h2>核心功能</h2><p>覆盖学习全流程，AI助力每一步</p></div>
        <div class="features-grid">
          <router-link v-for="f in features" :key="f.title" :to="f.link || '/features'" class="feature-card">
            <div class="fc-icon" :style="{ background: f.bg }">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section">
      <div class="container">
        <div class="section-title"><h2>三步开始学习</h2><p>简单高效的学习流程</p></div>
        <div class="steps-row">
          <div v-for="(s, i) in steps" :key="i" class="step-card">
            <div class="step-num">{{ i + 1 }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-title"><h2>用户评价</h2><p>来自真实用户的反馈</p></div>
        <div class="testimonial-grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <div class="tc-stars">★★★★★</div>
            <p class="tc-text">"{{ t.text }}"</p>
            <div class="tc-user">
              <div class="tc-avatar" :style="{ background: t.color }">{{ t.name[0] }}</div>
              <div><div class="tc-name">{{ t.name }}</div><div class="tc-role">{{ t.role }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container" style="text-align:center;">
        <h2>开始你的高效学习之旅</h2>
        <p style="color:#ffffffb3;font-size:18px;margin:20px 0 40px;">免费注册，立即体验AI智能学习助手的全部功能</p>
        <a class="btn btn-primary btn-lg" href="/download" style="font-size:18px;padding:18px 56px;">免费注册</a>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const features = [
  { icon: '📷', title: '拍照笔记整理', desc: '拍照上传课堂笔记，AI自动OCR识别、整理排版，生成精美Markdown文档', bg: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', link: '/features/note-taking' },
  { icon: '🔍', title: 'AI错题诊断', desc: '拍照录入错题，AI自动识别知识点、分析错误原因、给出避错建议', bg: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', link: '/features/mistake-diagnosis' },
  { icon: '🎯', title: '靶向练习', desc: '基于笔记和错题智能生成针对性练习，选择题/填空题/判断题全覆盖', bg: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', link: '/features/targeted-practice' },
  { icon: '👨‍🏫', title: '教师助教系统', desc: '教师创建班级、发布在线/离线作业，AI自动批改，教学效率翻倍', bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', link: '/features/teacher-system' },
  { icon: '🏫', title: '班级管理', desc: '邀请码加入班级，作业自动分发，学生完成率实时追踪', bg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', link: '/features' },
  { icon: '🗣️', title: '英语口语', desc: '美式/英式发音，AI评分准确度/流畅度/完整度，口语错题本', bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', link: '/features/oral-english' },
  { icon: '🎁', title: '邀请有礼', desc: '教师分享邀请码赠送30天全功能体验，学生邀请好友获7天体验，人人受益', bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', link: '/features/invite-system' },
  { icon: '👨‍👩‍👧', title: '家长控制', desc: '家长密码保护答案查看，使用时长管控，学习周报推送', bg: 'linear-gradient(135deg,#FDF4FF,#FAE8FF)', link: '/features' },
]

const steps = [
  { title: '注册选角色', desc: '选择学生/家长/教师角色注册，教师需要完成认证。可使用邀请码获得全功能体验' },
  { title: 'AI智能学习', desc: '学生拍照整理笔记、错题诊断、靶向练习；教师创建班级、发布作业、AI批改' },
  { title: '高效闭环', desc: '教师追踪学情、精准教学；学生消灭薄弱点；家长收到学习报告，全员受益' },
]

const testimonials = [
  { name: '张同学', role: '高二学生', text: '用爱辅学整理笔记太方便了，拍一张照片就能生成完美的电子版，还能直接生成练习题！', color: '#5B7BFF' },
  { name: '李妈妈', role: '家长', text: '家长控制功能很贴心，可以设置使用时长，每周还能收到学习报告，放心让孩子使用。', color: '#A78BFA' },
  { name: '赵老师', role: '数学教师', text: '班级管理和AI批改太好用了，以前批30份作业要2小时，现在10分钟搞定，教学效率翻倍！', color: '#FFBA4A' },
  { name: '王同学', role: '初三学生', text: '老师用邀请码让全班加入，作业在线提交AI自动批改，再也不用担心作业忘带了！', color: '#34D399' },
]
</script>

<style scoped>
.hero { padding: 140px 0 80px; background: linear-gradient(180deg, #f8f9fc 0%, #fff 100%);
  .container { display: flex; align-items: center; gap: 60px; }
}
.hero-content { flex: 1; }
.hero-badge { display: inline-block; background: var(--primary-light); color: var(--primary); padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
.hero-content h1 { font-size: 52px; font-weight: 800; line-height: 1.2; color: var(--text1); margin-bottom: 24px; }
.gradient-text { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { font-size: 18px; color: var(--text3); line-height: 1.8; margin-bottom: 36px; max-width: 520px; }
.hero-actions { display: flex; gap: 16px; margin-bottom: 48px; }
.hero-stats { display: flex; gap: 48px; }
.hs-item { display: flex; flex-direction: column; }
.hs-value { font-size: 28px; font-weight: 800; color: var(--primary); }
.hs-label { font-size: 14px; color: var(--text3); }

.hero-visual { flex-shrink: 0; }
.phone-mockup { width: 300px; height: 560px; background: var(--dark); border-radius: 36px; padding: 12px; box-shadow: 0 40px 80px rgba(0,0,0,0.15); }
.phone-screen { background: var(--dark2); border-radius: 28px; height: 100%; padding: 24px 16px; overflow: hidden; }
.screen-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.sh-greeting { color: #E8ECF4; font-size: 16px; font-weight: 600; }
.sh-badge { background: linear-gradient(135deg, #FFBA4A, #FF9800); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 10px; }
.screen-cards { display: flex; gap: 10px; margin-bottom: 16px; }
.sc-card { flex: 1; border-radius: 14px; padding: 16px 12px; display: flex; flex-direction: column; gap: 6px; }
.sc-primary { background: linear-gradient(135deg, #3D56C6, #5B7BFF); }
.sc-accent { background: linear-gradient(135deg, #7C3AED, #A78BFA); }
.sc-icon { font-size: 24px; }
.sc-text { color: #fff; font-size: 13px; font-weight: 600; }
.screen-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sg-item { background: #242838; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 12px; color: #8B92A5; }
.sg-item span:first-child { font-size: 20px; }

.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.feature-card { background: #fff; border-radius: 20px; padding: 32px 24px; border: 1px solid var(--border); transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  h3 { font-size: 18px; font-weight: 700; color: var(--text1); margin: 16px 0 8px; }
  p { font-size: 14px; color: var(--text3); line-height: 1.7; }
}
.fc-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }

.steps-row { display: flex; gap: 40px; justify-content: center; }
.step-card { text-align: center; max-width: 300px;
  h3 { font-size: 20px; font-weight: 700; color: var(--text1); margin: 16px 0 8px; }
  p { font-size: 15px; color: var(--text3); line-height: 1.7; }
}
.step-num { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; font-size: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto; }

.testimonial-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.testimonial-card { background: #fff; border-radius: 20px; padding: 28px; border: 1px solid var(--border); }
.tc-stars { color: #FFBA4A; font-size: 16px; margin-bottom: 12px; }
.tc-text { font-size: 14px; color: var(--text2); line-height: 1.8; margin-bottom: 20px; min-height: 80px; }
.tc-user { display: flex; align-items: center; gap: 12px; }
.tc-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.tc-name { font-size: 14px; font-weight: 600; color: var(--text1); }
.tc-role { font-size: 12px; color: var(--text3); }

.cta-section { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; text-align: center;
  h2 { font-size: 40px; font-weight: 800; }
}
</style>
