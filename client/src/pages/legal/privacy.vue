<template>
  <view class="legal-page">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack"><text class="back-arrow"></text></view>
      <text class="nav-title">隐私政策</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <view class="content-wrap">
        <text class="update-date">最后更新日期：2026年5月4日</text>

        <text class="h2">引言</text>
        <text class="p">爱辅学（以下简称"我们"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。</text>
        <text class="p">本隐私政策适用于爱辅学App、爱辅学微信小程序及爱辅学官方网站（以下统称"爱辅学产品"）。</text>

        <text class="h2">一、我们收集的信息</text>
        <text class="h3">1.1 注册信息</text>
        <text class="p">当您注册爱辅学账号时，我们会收集您的手机号码、密码、角色身份（学生/家长/教师）。教师角色还需要提供真实姓名和教师认证材料。</text>
        <text class="h3">1.2 学习数据</text>
        <text class="p">在您使用爱辅学产品的过程中，我们会收集以下学习数据：</text>
        <text class="li">- 您上传的课堂笔记图片（用于OCR识别和AI整理）</text>
        <text class="li">- 您上传的错题图片（用于AI诊断分析）</text>
        <text class="li">- 您的答题记录和练习数据（用于生成学习报告）</text>
        <text class="li">- 您的口语录音数据（用于AI评分，评分后即删除原始录音）</text>
        <text class="h3">1.3 设备信息</text>
        <text class="p">为保障产品正常运行和安全性，我们会收集设备型号、操作系统版本、设备唯一标识符等基本设备信息。</text>
        <text class="h3">1.4 日志信息</text>
        <text class="p">当您使用爱辅学产品时，我们会自动收集您的使用日志，包括访问时间、浏览页面、使用功能的记录等。</text>

        <text class="h2">二、我们如何使用信息</text>
        <text class="p">我们收集您的信息仅用于以下目的：</text>
        <text class="li">- 提供核心学习服务：笔记整理、错题诊断、练习生成、口语评测等</text>
        <text class="li">- 教学服务：班级管理、作业发布和批改</text>
        <text class="li">- 生成学习报告和数据分析</text>
        <text class="li">- 改善和优化产品体验</text>
        <text class="li">- 保障账号安全和产品运行安全</text>
        <text class="li">- 展示广告（仅在免费额度超出后的广告解锁环节）</text>

        <text class="h2">三、信息存储和安全</text>
        <text class="h3">3.1 存储地点</text>
        <text class="p">您的个人信息存储在中华人民共和国境内的阿里云服务器上，我们不会将您的信息传输到境外。</text>
        <text class="h3">3.2 存储期限</text>
        <text class="p">我们仅在为实现目的所必需的期限内保留您的个人信息。在您注销账号后，我们将在7个工作日内删除您的个人信息，法律法规另有规定的除外。</text>
        <text class="h3">3.3 安全措施</text>
        <text class="p">我们采用业界通行的安全技术和管理措施来保护您的个人信息，包括但不限于：</text>
        <text class="li">- 数据传输加密（HTTPS/TLS）</text>
        <text class="li">- 数据存储加密</text>
        <text class="li">- 严格的数据访问权限控制</text>
        <text class="li">- 安全审计和监控</text>
        <text class="li">- 定期安全评估</text>

        <text class="h2">四、信息共享和披露</text>
        <text class="p">我们不会向第三方出售、出租或交易您的个人信息。以下情况除外：</text>
        <text class="li">- 获得您的明确同意</text>
        <text class="li">- 根据法律法规的要求</text>
        <text class="li">- 根据政府主管部门的要求</text>
        <text class="li">- 为保护爱辅学用户或公众的人身财产安全</text>
        <text class="p">我们使用的第三方服务（如阿里云短信服务、广告SDK）可能会收集有限的必要信息，但我们会要求这些第三方遵守相关法律法规和本隐私政策。</text>

        <text class="h2">五、未成年人保护</text>
        <text class="p">爱辅学产品的主要用户群体包括未成年学生。我们高度重视未成年人个人信息的保护：</text>
        <text class="li">- 未满14周岁的未成年人注册需要取得监护人同意</text>
        <text class="li">- 我们不会向未成年人推送任何不适宜的内容</text>
        <text class="li">- 家长可以通过家长控制功能管理孩子的使用行为</text>
        <text class="li">- 所有广告内容均经过严格审核，确保适合未成年人</text>

        <text class="h2">六、您的权利</text>
        <text class="p">您有权：</text>
        <text class="li">- 访问和查看您的个人信息</text>
        <text class="li">- 更正不准确的个人信息</text>
        <text class="li">- 删除您的个人信息</text>
        <text class="li">- 注销您的账号</text>
        <text class="li">- 撤回您之前给予的同意</text>
        <text class="p">您可以通过App内的"账号设置"页面行使上述权利，或联系我们的客服团队获得帮助。</text>

        <text class="h2">七、隐私政策更新</text>
        <text class="p">我们可能会适时对本隐私政策进行修订。当政策发生重大变更时，我们会通过App内通知或短信等方式告知您。</text>

        <text class="h2">八、联系我们</text>
        <text class="p">如果您对本隐私政策有任何疑问或建议，可以通过以下方式联系我们：</text>
        <text class="li">- 邮箱：privacy@aifuxue.cn</text>
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
