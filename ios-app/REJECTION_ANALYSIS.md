# iOS 审核被拒风险分析及解决方案

## 高风险项（必须提前处理）

### 1. Guideline 4.2 - 最低功能要求（Design: Minimum Functionality）

**风险等级**: ★★★★★ 最高

**问题**: Apple 对纯 WebView 壳应用审核极严，认为"只是把网站包了一层"没有提供原生体验价值。

**已采取的措施**:
- ✅ 原生启动闪屏（非 WebView 白屏过渡）
- ✅ 原生加载进度条
- ✅ 原生下拉刷新
- ✅ 原生相机调用（JS Bridge）
- ✅ 原生触觉反馈（Haptic Feedback）
- ✅ 原生分享功能
- ✅ 左滑返回手势
- ✅ 网络异常原生重试弹窗
- ✅ 安全区域精确适配

**如果仍然被拒，追加方案**:
1. 添加本地推送提醒功能（学习打卡提醒）
2. 添加 3D Touch / Haptic Touch 快捷操作
3. 添加 Widget 小组件（今日学习数据）
4. 使用 WKWebView 的离线缓存（ServiceWorker）展示部分离线内容
5. 申诉时强调: App 提供了原生相机、语音录制、触觉反馈等原生独有能力

---

### 2. Guideline 5.1.1 - 数据收集与存储（Legal: Privacy - Data Collection and Storage）

**风险等级**: ★★★★☆

**问题**: 收集用户手机号、照片、音频等敏感数据需要明确告知。

**已采取的措施**:
- ✅ Info.plist 中所有权限描述（相机/相册/麦克风）含中文说明
- ✅ 应用内可查看完整隐私政策页面
- ✅ 注册时勾选同意隐私政策
- ✅ 提供账号注销功能

**如果被拒**:
- 在首次启动时添加隐私政策弹窗确认
- 确保每个权限请求在使用时才触发（不要在启动时集中请求）

---

### 3. Guideline 2.1 - App 完整性（Performance: App Completeness）

**风险等级**: ★★★☆☆

**问题**: 审核员打开 App 如果后端服务不通/页面加载慢/功能异常，直接拒绝。

**预防措施**:
- 确保提交审核时 https://aifuxue.cn 服务器正常运行
- 确保演示账号（13800138000 + 000000）可以正常登录
- 后端 API 的 verifyCode 方法已支持 000000 万能验证码
- 确保核心功能（笔记、练习、错题）有 mock 数据可展示

**如果被拒**:
- 在备注中详细说明测试步骤
- 提供视频录屏展示完整操作流程

---

### 4. Guideline 1.2 - 用户生成内容（Safety: User Generated Content）

**风险等级**: ★★★☆☆

**问题**: 教师发布作业、学生上传笔记等属于 UGC，Apple 要求必须有举报/屏蔽机制。

**已采取的措施**:
- ✅ 通用举报组件（ReportDialog）已集成
- ✅ 笔记详情页有举报按钮
- ✅ 作业详情页有举报入口
- ✅ 7种举报原因分类

**如果被拒**:
- 在更多页面添加举报入口（班级列表、教师资料等）
- 添加屏蔽用户功能

---

### 5. Guideline 2.3 - 准确的元数据（Performance: Accurate Metadata）

**风险等级**: ★★☆☆☆

**问题**: 截图、描述与实际功能不符。

**预防措施**:
- 截图必须使用真实 App 界面
- 描述中列出的功能必须在 App 中可以体验到
- 不要夸大 AI 能力（如"保证提分"等承诺）

---

## 中风险项

### 6. Guideline 3.1.1 - 应用内购买（Business: In-App Purchase）

**风险等级**: ★★☆☆☆

**问题**: 如果 App 有付费功能但不走 Apple IAP。

**当前状态**: 全部免费 + 广告解锁模式，无需 IAP。完全合规。

**注意**: 如果未来添加 VIP 订阅，必须走 Apple IAP（30%分成）。

---

### 7. Guideline 5.1.2 - 数据使用和共享（Legal: Privacy - Data Use and Sharing）

**风险等级**: ★★☆☆☆

**问题**: App Privacy 标签必须准确填写所有数据收集项。

**预防措施**:
- 如实填写数据类型（见 APP_STORE_SUBMISSION.md）
- 不要漏报（宁可多报不可少报）
- 广告 SDK 收集的数据也要披露

---

### 8. Guideline 4.0 - 设计（Design）

**风险等级**: ★☆☆☆☆

**问题**: 界面不符合 iOS 设计规范。

**已采取的措施**:
- ✅ 全屏适配（viewport-fit=cover）
- ✅ 安全区域 CSS 变量注入
- ✅ 深色主题与 iOS 系统风格协调
- ✅ 状态栏亮色文字
- ✅ 仅竖屏

---

## 低风险项

### 9. IPv6 兼容性
- WKWebView 自动支持 IPv6，无需额外处理

### 10. 64 位支持
- Swift 项目默认 64 位，无需处理

### 11. iOS 最低版本
- 已设置 iOS 14.0，覆盖 98%+ 用户

---

## 审核被拒后的申诉模板

如果因 4.2（最低功能）被拒，使用以下申诉要点：

```
Dear App Review Team,

Thank you for your review. We'd like to clarify that our app "爱辅学" (AiFuXue) 
provides significant native functionality beyond a simple web wrapper:

1. Native Camera Integration: The app uses AVFoundation to capture photos of 
   handwritten notes for AI-powered OCR processing.

2. Native Audio Recording: Utilizes AVAudioSession for English oral practice 
   with real-time pronunciation scoring.

3. Haptic Feedback: Provides tactile responses for user interactions, 
   enhancing the native experience.

4. Native Share Sheet: Integrates with iOS share extensions for sharing 
   learning progress.

5. Pull-to-Refresh: Native UIRefreshControl implementation.

6. Safe Area Adaptation: Dynamic CSS injection for proper display on all 
   iPhone models including notch devices.

7. Offline Error Handling: Native network error detection with retry mechanism.

The web content serves as the AI processing engine (OCR, NLP, speech evaluation) 
which requires server-side computation. The native shell provides hardware access 
and iOS-native UX patterns that cannot be achieved through Safari alone.

We believe this meets the minimum functionality requirements as the app provides 
unique value through the combination of native hardware access and AI capabilities.

Best regards
```

---

## 审核时间预估
- 首次提交: 通常 24-48 小时
- 被拒后重新提交: 通常 24 小时
- 申诉响应: 1-3 个工作日
