<template>
  <view class="legal-page">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack"><text class="back-arrow"></text></view>
      <text class="nav-title">用户协议</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <view class="content-wrap">
        <text class="update-date">最后更新日期：2026年5月4日</text>

        <text class="h2">一、总则</text>
        <text class="p">欢迎使用爱辅学（以下简称"本产品"）。本用户协议（以下简称"本协议"）是您与爱辅学之间关于使用本产品所订立的协议。请您在使用本产品前仔细阅读本协议，当您注册、登录或使用本产品时，即表示您已充分阅读、理解并同意本协议的全部内容。</text>

        <text class="h2">二、服务内容</text>
        <text class="p">爱辅学为用户提供以下AI智能学习服务：</text>
        <text class="li">- 拍照笔记整理：通过OCR识别和AI技术，将手写笔记转为电子文档</text>
        <text class="li">- AI错题诊断：智能分析错题的知识点、错误类型和避错建议</text>
        <text class="li">- 靶向练习：基于学习数据智能生成针对性练习题</text>
        <text class="li">- 英语口语练习：AI评分发音准确度、流畅度和完整度</text>
        <text class="li">- 教师助教系统：班级管理、作业发布和AI自动批改</text>
        <text class="li">- 其他学习辅助功能</text>

        <text class="h2">三、账号注册和使用</text>
        <text class="h3">3.1 注册条件</text>
        <text class="p">您应当为具有完全民事行为能力的自然人。未满18周岁的未成年人应在监护人的陪同和同意下注册和使用本产品。未满14周岁的儿童需要在取得监护人明确同意后方可注册。</text>
        <text class="h3">3.2 注册信息</text>
        <text class="p">您在注册时应提供真实、准确、完整的个人信息，并在信息发生变更时及时更新。如因您提供虚假信息造成的损失由您自行承担。</text>
        <text class="h3">3.3 账号安全</text>
        <text class="p">您应妥善保管账号和密码，不得将账号借给他人使用。因您个人原因导致的账号安全问题由您自行承担。如发现账号被盗用或存在安全隐患，请立即联系我们。</text>

        <text class="h2">四、用户行为规范</text>
        <text class="p">您在使用本产品时应遵守以下规范：</text>
        <text class="li">- 遵守中华人民共和国相关法律法规</text>
        <text class="li">- 不得利用本产品从事任何违法违规活动</text>
        <text class="li">- 不得上传含有违法、暴力、色情等不良内容的图片或信息</text>
        <text class="li">- 不得干扰或破坏本产品的正常运行</text>
        <text class="li">- 不得利用技术手段绕过产品的功能限制或广告机制</text>
        <text class="li">- 不得恶意注册账号或滥用邀请码机制</text>
        <text class="li">- 教师用户不得冒用他人身份进行教师认证</text>

        <text class="h2">五、知识产权</text>
        <text class="h3">5.1 产品知识产权</text>
        <text class="p">爱辅学的商标、Logo、界面设计、程序代码及相关技术的知识产权归爱辅学所有。未经我们书面授权，不得以任何方式复制、修改、传播或使用上述内容。</text>
        <text class="h3">5.2 用户内容</text>
        <text class="p">您通过本产品上传和创建的内容（包括笔记、错题等），其知识产权归您所有。但为了向您提供服务，您授权我们在服务范围内使用这些内容（如进行OCR识别、AI分析等）。</text>
        <text class="h3">5.3 AI生成内容</text>
        <text class="p">通过AI技术生成的学习内容（如整理后的笔记、诊断报告、练习题等）仅供您个人学习使用，不得用于商业用途。</text>

        <text class="h2">六、服务费用</text>
        <text class="p">爱辅学全部功能免费开放，部分功能超出每日免费额度后，通过观看广告解锁。我们不收取任何订阅费用或内购费用。</text>
        <text class="p">我们保留未来调整服务模式的权利，如有变更将提前通知用户。</text>

        <text class="h2">七、免责声明</text>
        <text class="li">- AI生成的学习内容仅供参考，不保证完全准确。对于因依赖AI内容产生的任何学习结果，我们不承担责任。</text>
        <text class="li">- 由于网络状况、系统维护等原因导致的服务中断或延迟，我们将尽力恢复但不承担赔偿责任。</text>
        <text class="li">- 因不可抗力（如自然灾害、政策变化等）导致的服务变更或终止，我们不承担责任。</text>

        <text class="h2">八、协议变更</text>
        <text class="p">我们有权根据需要修改本协议。修改后的协议将在App内或官网公布，公布后7日内如您继续使用本产品，即视为同意修改后的协议。</text>

        <text class="h2">九、终止服务</text>
        <text class="p">如您违反本协议的约定，我们有权暂停或终止向您提供服务，并有权删除您的账号和数据。您也可以随时通过App内的"注销账号"功能终止使用本产品。</text>

        <text class="h2">十、争议解决</text>
        <text class="p">本协议的解释和执行均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向爱辅学所在地有管辖权的人民法院提起诉讼。</text>

        <text class="h2">十一、联系方式</text>
        <text class="li">- 邮箱：legal@aifuxue.cn</text>
        <text class="li">- 地址：中国北京市</text>

        <view style="height: 120rpx;"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack();
}
</script>

<style scoped>
.legal-page { min-height: 100vh; background: #0F1118; display: flex; flex-direction: column; }
.nav-bar { display: flex; align-items: center; padding: 60rpx 32rpx 24rpx; background: #141722; }
.back-btn { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; }
.back-arrow { width: 20rpx; height: 20rpx; border-left: 4rpx solid #E8ECF4; border-bottom: 4rpx solid #E8ECF4; transform: rotate(45deg); }
.nav-title { flex: 1; text-align: center; font-size: 34rpx; font-weight: 700; color: #E8ECF4; }
.placeholder { width: 60rpx; }
.content-scroll { flex: 1; }
.content-wrap { padding: 32rpx 40rpx; }
.update-date { font-size: 24rpx; color: #4D5466; display: block; margin-bottom: 32rpx; }
.h2 { font-size: 32rpx; font-weight: 700; color: #E8ECF4; display: block; margin-top: 48rpx; margin-bottom: 20rpx; padding-bottom: 12rpx; border-bottom: 1rpx solid #2A2E3F; }
.h3 { font-size: 28rpx; font-weight: 600; color: #C8CDD8; display: block; margin-top: 32rpx; margin-bottom: 12rpx; }
.p { font-size: 26rpx; color: #8B92A5; display: block; line-height: 1.8; margin-bottom: 16rpx; }
.li { font-size: 26rpx; color: #8B92A5; display: block; line-height: 1.8; padding-left: 24rpx; margin-bottom: 8rpx; }
</style>
