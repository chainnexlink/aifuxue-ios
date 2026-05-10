export function getPrivacyHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>隐私政策 - 爱辅学</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif; color: #333; line-height: 1.8; background: #fff; }
  .container { max-width: 800px; margin: 0 auto; padding: 40px 20px 60px; }
  h1 { font-size: 36px; font-weight: 800; text-align: center; margin-bottom: 8px; color: #1a1a2e; }
  .update-date { text-align: center; font-size: 14px; color: #999; margin-bottom: 40px; }
  h2 { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 40px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #eee; }
  h3 { font-size: 17px; font-weight: 700; color: #333; margin: 24px 0 10px; }
  p { font-size: 15px; color: #555; margin-bottom: 14px; }
  ul, ol { padding-left: 24px; margin-bottom: 14px; }
  li { font-size: 15px; color: #555; margin-bottom: 4px; }
  .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #999; }
</style>
</head>
<body>
<div class="container">
  <h1>隐私政策</h1>
  <p class="update-date">最后更新日期：2026年5月4日</p>

  <h2>引言</h2>
  <p>爱辅学（以下简称"我们"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。同时，我们承诺按照业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。</p>
  <p>本隐私政策适用于爱辅学App、爱辅学微信小程序及爱辅学官方网站（以下统称"爱辅学产品"）。</p>

  <h2>一、我们收集的信息</h2>
  <h3>1.1 注册信息</h3>
  <p>当您注册爱辅学账号时，我们会收集您的手机号码、密码、角色身份（学生/家长/教师）。教师角色还需要提供真实姓名和教师认证材料。</p>
  <h3>1.2 学习数据</h3>
  <p>在您使用爱辅学产品的过程中，我们会收集以下学习数据：</p>
  <ul>
    <li>您上传的课堂笔记图片（用于OCR识别和AI整理）</li>
    <li>您上传的错题图片（用于AI诊断分析）</li>
    <li>您的答题记录和练习数据（用于生成学习报告）</li>
    <li>您的口语录音数据（用于AI评分，评分后即删除原始录音）</li>
  </ul>
  <h3>1.3 设备信息</h3>
  <p>为保障产品正常运行和安全性，我们会收集设备型号、操作系统版本、设备唯一标识符等基本设备信息。</p>
  <h3>1.4 日志信息</h3>
  <p>当您使用爱辅学产品时，我们会自动收集您的使用日志，包括访问时间、浏览页面、使用功能的记录等。</p>

  <h2>二、我们如何使用信息</h2>
  <p>我们收集您的信息仅用于以下目的：</p>
  <ul>
    <li>提供核心学习服务：笔记整理、错题诊断、练习生成、口语评测等</li>
    <li>教学服务：班级管理、作业发布和批改</li>
    <li>生成学习报告和数据分析</li>
    <li>改善和优化产品体验</li>
    <li>保障账号安全和产品运行安全</li>
    <li>展示广告（仅在免费额度超出后的广告解锁环节）</li>
  </ul>

  <h2>三、信息存储和安全</h2>
  <h3>3.1 存储地点</h3>
  <p>您的个人信息存储在中华人民共和国境内的阿里云服务器上，我们不会将您的信息传输到境外。</p>
  <h3>3.2 存储期限</h3>
  <p>我们仅在为实现目的所必需的期限内保留您的个人信息。在您注销账号后，我们将在7个工作日内删除您的个人信息，法律法规另有规定的除外。</p>
  <h3>3.3 安全措施</h3>
  <p>我们采用业界通行的安全技术和管理措施来保护您的个人信息，包括但不限于：</p>
  <ul>
    <li>数据传输加密（HTTPS/TLS）</li>
    <li>数据存储加密</li>
    <li>严格的数据访问权限控制</li>
    <li>安全审计和监控</li>
    <li>定期安全评估</li>
  </ul>

  <h2>四、信息共享和披露</h2>
  <p>我们不会向第三方出售、出租或交易您的个人信息。以下情况除外：</p>
  <ul>
    <li>获得您的明确同意</li>
    <li>根据法律法规的要求</li>
    <li>根据政府主管部门的要求</li>
    <li>为保护爱辅学用户或公众的人身财产安全</li>
  </ul>
  <p>我们使用的第三方服务（如阿里云短信服务、广告SDK）可能会收集有限的必要信息，但我们会要求这些第三方遵守相关法律法规和本隐私政策。</p>

  <h2>五、未成年人保护</h2>
  <p>爱辅学产品的主要用户群体包括未成年学生。我们高度重视未成年人个人信息的保护：</p>
  <ul>
    <li>未满14周岁的未成年人注册需要取得监护人同意</li>
    <li>我们不会向未成年人推送任何不适宜的内容</li>
    <li>家长可以通过家长控制功能管理孩子的使用行为</li>
    <li>所有广告内容均经过严格审核，确保适合未成年人</li>
  </ul>

  <h2>六、您的权利</h2>
  <p>您有权：</p>
  <ul>
    <li>访问和查看您的个人信息</li>
    <li>更正不准确的个人信息</li>
    <li>删除您的个人信息</li>
    <li>注销您的账号</li>
    <li>撤回您之前给予的同意</li>
  </ul>
  <p>您可以通过App内的"账号设置"页面行使上述权利，或联系我们的客服团队获得帮助。</p>

  <h2>七、隐私政策更新</h2>
  <p>我们可能会适时对本隐私政策进行修订。当政策发生重大变更时，我们会通过App内通知或短信等方式告知您。</p>

  <h2>八、联系我们</h2>
  <p>如果您对本隐私政策有任何疑问或建议，可以通过以下方式联系我们：</p>
  <ul>
    <li>邮箱：privacy@aifuxue.cn</li>
    <li>地址：中国北京市</li>
  </ul>

  <div class="footer">
    <p>© 2026 爱辅学 版权所有</p>
  </div>
</div>
</body>
</html>`;
}
