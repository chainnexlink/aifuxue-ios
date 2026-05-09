# 爱辅学 iOS App

AI智能学习助手 - iOS 原生客户端

## 技术架构

| 层 | 技术 |
|---|---|
| 原生容器 | Swift 5 / UIKit / WKWebView |
| 内容引擎 | H5 Web App (https://aifuxue.cn) |
| JS Bridge | WKScriptMessageHandler (相机/分享/触觉反馈/通知/剪贴板) |
| 最低版本 | iOS 14.0 |
| 目标设备 | iPhone / iPad |

## 原生特色功能（Guideline 4.2 合规）

| 功能 | 实现 |
|---|---|
| 原生相机调用 | AVFoundation + UIImagePickerController |
| 触觉反馈 | UIImpactFeedbackGenerator / UINotificationFeedbackGenerator / UISelectionFeedbackGenerator |
| 原生分享面板 | UIActivityViewController (支持微信/QQ/抖音/AirDrop/打印) |
| 本地推送通知 | UNUserNotificationCenter (学习提醒/打卡通知) |
| 剪贴板操作 | UIPasteboard |
| 启动闪屏 | 原生UILabel + UIActivityIndicatorView (非WebView白屏) |
| 加载进度条 | UIProgressView + KVO监听estimatedProgress |
| 下拉刷新 | UIRefreshControl + 触觉反馈 |
| 左滑返回手势 | WKWebView.allowsBackForwardNavigationGestures |
| 网络异常重试 | 原生UIAlertController重试弹窗 |
| 权限请求引导 | 原生UIAlertController跳转系统设置 |
| 安全区域适配 | 动态CSS变量注入（--sat/--sar/--sab/--sal） |
| iPad 适配 | 设备识别CSS类注入 + 多方向支持 |

## 提交前检查清单

- [x] Info.plist 权限描述完备（中文本地化）
- [x] PrivacyInfo.xcprivacy 隐私清单（2024+ 强制要求）
- [x] NSAppTransportSecurity 仅允许 HTTPS
- [x] ITSAppUsesNonExemptEncryption = NO（出口合规）
- [x] LaunchScreen.storyboard 原生启动画面
- [x] 仅竖屏（iPhone）+ iPad 全方向
- [x] UIRequiredDeviceCapabilities: armv7
- [x] 演示账号：13800138000 + 000000

## 隐私收集声明

| 数据类型 | 用途 | 关联用户 | 追踪 |
|---|---|---|---|
| 手机号 | 账号注册与登录 | 是 | 否 |
| 照片/视频 | 笔记识别与错题诊断 | 是 | 否 |
| 音频数据 | 英语口语评分（评分后删除） | 否 | 否 |
| 使用数据 | 功能优化分析 | 是 | 否 |
| 崩溃数据 | 问题诊断 | 否 | 否 |

## 构建方式

1. 在 Xcode 中打开 `AiFuXue.xcodeproj`
2. 选择目标设备（iOS 14.0+）
3. Product → Archive
4. Organizer → Distribute App → App Store Connect

## App Store 信息

| 项目 | 值 |
|---|---|
| Bundle ID | cn.aifuxue.app |
| 显示名称 | 爱辅学 |
| 版本 | 1.0.0 (Build 1) |
| 类别 | 教育（主），效率（副） |
| 分级 | 4+ |
| 版权 | © 2026 潮州市益才礼品贸易有限公司 |
| 隐私政策 | https://aifuxue.cn/privacy |
| 技术支持 | https://aifuxue.cn/support |

## 审核备注模板

```
本应用为AI学习辅助工具，所有功能免费使用。
演示账号：13800138000，验证码输入000000即可登录。

应用提供了以下原生功能（非纯Web壳）：
1. 原生相机：拍摄课堂笔记和错题照片
2. 原生音频：英语口语录音评分
3. 触觉反馈：操作交互的触觉响应
4. 原生分享：支持iOS系统分享面板（微信/QQ/抖音/AirDrop/打印）
5. 本地通知：学习打卡提醒
6. 启动闪屏：原生启动画面代替WebView白屏
7. 安全区域适配：原生CSS变量注入适配刘海/底部安全区
8. 左滑返回：原生侧滑手势体验
9. 下拉刷新：原生刷新控件

Web内容仅作为AI处理引擎（OCR、NLP、语音评测）的展示层，
这些计算需要服务端支持，原生容器提供了硬件访问和iOS原生UX体验。
```
