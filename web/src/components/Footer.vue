<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo"><span class="flogo-icon">AI</span><span>爱辅学</span></div>
          <p>AI驱动的智能学习助手，让每个学生都能高效学习</p>
        </div>
        <div class="footer-col">
          <h4>产品</h4>
          <router-link to="/features">功能介绍</router-link>
          <router-link to="/pricing">功能方案</router-link>
          <router-link to="/download">下载App</router-link>
        </div>
        <div class="footer-col">
          <h4>功能</h4>
          <router-link to="/features/note-taking">拍照笔记整理</router-link>
          <router-link to="/features/mistake-diagnosis">AI错题诊断</router-link>
          <router-link to="/features/targeted-practice">靶向练习</router-link>
          <router-link to="/features/oral-english">英语口语</router-link>
          <router-link to="/features/teacher-system">教师助教</router-link>
        </div>
        <div class="footer-col">
          <h4>支持</h4>
          <router-link to="/help">帮助中心</router-link>
          <router-link to="/about">关于我们</router-link>
          <router-link to="/privacy">隐私政策</router-link>
          <router-link to="/agreement">用户协议</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 爱辅学 All Rights Reserved. <router-link to="/privacy" style="color:#ffffff60;">隐私政策</router-link> | <router-link to="/agreement" style="color:#ffffff60;">用户协议</router-link></span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--dark); color: #ffffffb3; padding: 80px 0 30px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 50px; }
.footer-brand p { font-size: 14px; color: #ffffff66; margin-top: 12px; max-width: 280px; line-height: 1.8; }
.footer-logo { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; color: #fff; }
.flogo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 800; }
.footer-col { display: flex; flex-direction: column; gap: 12px; }
.footer-col h4 { color: #fff; font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.footer-col a, .footer-col span { font-size: 14px; color: #ffffff80; cursor: pointer; transition: color 0.2s; }
.footer-col a:hover, .footer-col span:hover { color: #fff; }
.footer-bottom { border-top: 1px solid #ffffff15; padding-top: 24px; text-align: center; font-size: 13px; color: #ffffff40; }
</style>
