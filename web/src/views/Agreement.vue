<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container"><h1>用户协议</h1><p>最后更新日期：2026年5月4日</p></div>
    </section>

    <section class="section">
      <div class="container">
        <div class="legal-content">
          <h2>一、总则</h2>
          <p>欢迎使用爱辅学（以下简称"本产品"）。本用户协议（以下简称"本协议"）是您与爱辅学之间关于使用本产品所订立的协议。请您在使用本产品前仔细阅读本协议，当您注册、登录或使用本产品时，即表示您已充分阅读、理解并同意本协议的全部内容。</p>

          <h2>二、服务内容</h2>
          <p>爱辅学为用户提供以下AI智能学习服务：</p>
          <ul>
            <li>拍照笔记整理：通过OCR识别和AI技术，将手写笔记转为电子文档</li>
            <li>AI错题诊断：智能分析错题的知识点、错误类型和避错建议</li>
            <li>靶向练习：基于学习数据智能生成针对性练习题</li>
            <li>英语口语练习：AI评分发音准确度、流畅度和完整度</li>
            <li>教师助教系统：班级管理、作业发布和AI自动批改</li>
            <li>其他学习辅助功能</li>
          </ul>

          <h2>三、账号注册和使用</h2>
          <h3>3.1 注册条件</h3>
          <p>您应当为具有完全民事行为能力的自然人。未满18周岁的未成年人应在监护人的陪同和同意下注册和使用本产品。未满14周岁的儿童需要在取得监护人明确同意后方可注册。</p>
          <h3>3.2 注册信息</h3>
          <p>您在注册时应提供真实、准确、完整的个人信息，并在信息发生变更时及时更新。如因您提供虚假信息造成的损失由您自行承担。</p>
          <h3>3.3 账号安全</h3>
          <p>您应妥善保管账号和密码，不得将账号借给他人使用。因您个人原因导致的账号安全问题由您自行承担。如发现账号被盗用或存在安全隐患，请立即联系我们。</p>

          <h2>四、用户行为规范</h2>
          <p>您在使用本产品时应遵守以下规范：</p>
          <ul>
            <li>遵守中华人民共和国相关法律法规</li>
            <li>不得利用本产品从事任何违法违规活动</li>
            <li>不得上传含有违法、暴力、色情等不良内容的图片或信息</li>
            <li>不得干扰或破坏本产品的正常运行</li>
            <li>不得利用技术手段绕过产品的功能限制或广告机制</li>
            <li>不得恶意注册账号或滥用邀请码机制</li>
            <li>教师用户不得冒用他人身份进行教师认证</li>
          </ul>

          <h2>五、知识产权</h2>
          <h3>5.1 产品知识产权</h3>
          <p>爱辅学的商标、Logo、界面设计、程序代码及相关技术的知识产权归爱辅学所有。未经我们书面授权，不得以任何方式复制、修改、传播或使用上述内容。</p>
          <h3>5.2 用户内容</h3>
          <p>您通过本产品上传和创建的内容（包括笔记、错题等），其知识产权归您所有。但为了向您提供服务，您授权我们在服务范围内使用这些内容（如进行OCR识别、AI分析等）。</p>
          <h3>5.3 AI生成内容</h3>
          <p>通过AI技术生成的学习内容（如整理后的笔记、诊断报告、练习题等）仅供您个人学习使用，不得用于商业用途。</p>

          <h2>六、服务费用</h2>
          <p>爱辅学全部功能免费开放，部分功能超出每日免费额度后，通过观看广告解锁。我们不收取任何订阅费用或内购费用。</p>
          <p>我们保留未来调整服务模式的权利，如有变更将提前通知用户。</p>

          <h2>七、免责声明</h2>
          <ul>
            <li>AI生成的学习内容仅供参考，不保证完全准确。对于因依赖AI内容产生的任何学习结果，我们不承担责任。</li>
            <li>由于网络状况、系统维护等原因导致的服务中断或延迟，我们将尽力恢复但不承担赔偿责任。</li>
            <li>因不可抗力（如自然灾害、政策变化等）导致的服务变更或终止，我们不承担责任。</li>
          </ul>

          <h2>八、协议变更</h2>
          <p>我们有权根据需要修改本协议。修改后的协议将在App内或官网公布，公布后7日内如您继续使用本产品，即视为同意修改后的协议。</p>

          <h2>九、终止服务</h2>
          <p>如您违反本协议的约定，我们有权暂停或终止向您提供服务，并有权删除您的账号和数据。您也可以随时通过App内的"注销账号"功能终止使用本产品。</p>

          <h2>十、争议解决</h2>
          <p>本协议的解释和执行均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向爱辅学所在地有管辖权的人民法院提起诉讼。</p>

          <h2>十一、联系方式</h2>
          <ul>
            <li>邮箱：legal@aifuxue.cn</li>
            <li>地址：中国北京市（具体地址待补充）</li>
          </ul>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 16px; color: var(--text3); }
}

.legal-content { max-width: 800px; margin: 0 auto;
  h2 { font-size: 24px; font-weight: 800; color: var(--text1); margin: 48px 0 16px; padding-bottom: 12px; border-bottom: 2px solid var(--bg-light); }
  h3 { font-size: 18px; font-weight: 700; color: var(--text1); margin: 28px 0 12px; }
  p { font-size: 15px; color: var(--text2); line-height: 2; margin-bottom: 16px; }
  ul, ol { padding-left: 24px; margin-bottom: 16px; }
  li { font-size: 15px; color: var(--text2); line-height: 2; margin-bottom: 4px; }
}
</style>
