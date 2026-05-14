import UIKit
import WebKit
import Photos
import AVFoundation
import UserNotifications
import StoreKit
import LocalAuthentication
import CoreSpotlight
import UniformTypeIdentifiers

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate,
                      UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    private var webView: WKWebView!
    private var progressView: UIProgressView!
    private var splashView: UIView?
    private var observation: NSKeyValueObservation?
    private var storeManager: StoreManager?

    // MARK: - 生产地址（直接进入应用功能页面，避免审核员停留在官网首页）
    private let appURL = URL(string: "https://aifuxue.cn/app")!
    private let appBgColor = UIColor(red: 15/255, green: 17/255, blue: 24/255, alpha: 1)

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = appBgColor
        setupWebView()
        setupProgressView()
        setupSplash()
        setupStoreManager()
        loadApp()
        requestNotificationPermission()
        scheduleStudyReminders()
        indexAppContentInSpotlight()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        injectSafeAreaInsets()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }
    override var prefersStatusBarHidden: Bool { false }

    deinit {
        observation?.invalidate()
    }

    // MARK: - WebView 全屏铺满设置
    private func setupWebView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default()

        let userController = WKUserContentController()
        userController.add(LeakAvoider(delegate: self), name: "nativeCamera")
        userController.add(LeakAvoider(delegate: self), name: "nativeHaptic")
        userController.add(LeakAvoider(delegate: self), name: "nativeShare")
        userController.add(LeakAvoider(delegate: self), name: "nativeClipboard")
        userController.add(LeakAvoider(delegate: self), name: "nativeNotification")
        userController.add(LeakAvoider(delegate: self), name: "nativeIAP")
        userController.add(LeakAvoider(delegate: self), name: "nativeRestorePurchases")
        userController.add(LeakAvoider(delegate: self), name: "nativeBiometric")
        userController.add(LeakAvoider(delegate: self), name: "nativeStudyReminder")
        userController.add(LeakAvoider(delegate: self), name: "nativeOfflineCache")

        let viewportScript = WKUserScript(source: """
            // Mark native iOS environment
            window.__NATIVE_IOS__ = true;
            window.__NATIVE_IAP_AVAILABLE__ = true;

            var meta = document.querySelector('meta[name="viewport"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'viewport';
                document.head.appendChild(meta);
            }
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            if (window.innerWidth >= 768) {
                document.documentElement.classList.add('is-ipad');
            }
        """, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        userController.addUserScript(viewportScript)

        config.userContentController = userController

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.backgroundColor = appBgColor
        webView.isOpaque = false
        webView.scrollView.backgroundColor = appBgColor
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.minimumZoomScale = 1.0
        webView.scrollView.maximumZoomScale = 1.0

        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(red: 91/255, green: 123/255, blue: 255/255, alpha: 1)
        refreshControl.attributedTitle = NSAttributedString(
            string: "下拉刷新页面",
            attributes: [.foregroundColor: UIColor(red: 91/255, green: 123/255, blue: 255/255, alpha: 1)]
        )
        refreshControl.addTarget(self, action: #selector(pullToRefresh), for: .valueChanged)
        webView.scrollView.refreshControl = refreshControl

        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])

        observation = webView.observe(\.estimatedProgress, options: .new) { [weak self] _, change in
            guard let self = self, let progress = change.newValue else { return }
            self.progressView.alpha = 1
            self.progressView.setProgress(Float(progress), animated: true)
            if progress >= 1.0 {
                UIView.animate(withDuration: 0.3, delay: 0.3, options: .curveEaseOut) {
                    self.progressView.alpha = 0
                } completion: { _ in
                    self.progressView.setProgress(0, animated: false)
                }
                self.hideSplash()
            }
        }
    }

    // MARK: - 加载进度条
    private func setupProgressView() {
        progressView = UIProgressView(progressViewStyle: .default)
        progressView.progressTintColor = UIColor(red: 91/255, green: 123/255, blue: 255/255, alpha: 1)
        progressView.trackTintColor = .clear
        view.addSubview(progressView)
        progressView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            progressView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            progressView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            progressView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            progressView.heightAnchor.constraint(equalToConstant: 2),
        ])
    }

    // MARK: - 启动闪屏
    private func setupSplash() {
        let splash = UIView(frame: view.bounds)
        splash.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        splash.backgroundColor = appBgColor

        let logo = UILabel()
        logo.text = "爱"
        logo.font = .boldSystemFont(ofSize: 56)
        logo.textColor = .white
        logo.textAlignment = .center
        logo.backgroundColor = UIColor(red: 61/255, green: 86/255, blue: 198/255, alpha: 1)
        logo.layer.cornerRadius = 20
        logo.clipsToBounds = true
        logo.translatesAutoresizingMaskIntoConstraints = false
        splash.addSubview(logo)

        let name = UILabel()
        name.text = "爱辅学"
        name.font = .boldSystemFont(ofSize: 28)
        name.textColor = .white
        name.textAlignment = .center
        name.translatesAutoresizingMaskIntoConstraints = false
        splash.addSubview(name)

        let desc = UILabel()
        desc.text = "AI智能学习助手"
        desc.font = .systemFont(ofSize: 14)
        desc.textColor = UIColor(white: 1, alpha: 0.5)
        desc.textAlignment = .center
        desc.translatesAutoresizingMaskIntoConstraints = false
        splash.addSubview(desc)

        // 加载指示器（避免审核员认为App卡死）
        let spinner = UIActivityIndicatorView(style: .medium)
        spinner.color = UIColor(white: 1, alpha: 0.4)
        spinner.startAnimating()
        spinner.translatesAutoresizingMaskIntoConstraints = false
        splash.addSubview(spinner)

        // 版权信息
        let copyright = UILabel()
        copyright.text = "© 2026 潮州市益才礼品贸易有限公司"
        copyright.font = .systemFont(ofSize: 11)
        copyright.textColor = UIColor(white: 1, alpha: 0.25)
        copyright.textAlignment = .center
        copyright.translatesAutoresizingMaskIntoConstraints = false
        splash.addSubview(copyright)

        NSLayoutConstraint.activate([
            logo.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            logo.centerYAnchor.constraint(equalTo: splash.centerYAnchor, constant: -40),
            logo.widthAnchor.constraint(equalToConstant: 90),
            logo.heightAnchor.constraint(equalToConstant: 90),
            name.topAnchor.constraint(equalTo: logo.bottomAnchor, constant: 20),
            name.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            desc.topAnchor.constraint(equalTo: name.bottomAnchor, constant: 8),
            desc.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            spinner.topAnchor.constraint(equalTo: desc.bottomAnchor, constant: 40),
            spinner.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            copyright.bottomAnchor.constraint(equalTo: splash.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            copyright.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
        ])

        view.addSubview(splash)
        splashView = splash
    }

    private func hideSplash() {
        guard let splash = splashView else { return }
        UIView.animate(withDuration: 0.4, animations: {
            splash.alpha = 0
        }) { _ in
            splash.removeFromSuperview()
            self.splashView = nil
        }
    }

    // MARK: - 注入安全区域变量
    private func injectSafeAreaInsets() {
        let insets = view.safeAreaInsets
        let js = """
        document.documentElement.style.setProperty('--sat', '\(insets.top)px');
        document.documentElement.style.setProperty('--sar', '\(insets.right)px');
        document.documentElement.style.setProperty('--sab', '\(insets.bottom)px');
        document.documentElement.style.setProperty('--sal', '\(insets.left)px');
        """
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    // MARK: - Load & Refresh
    private func loadApp() {
        let request = URLRequest(url: appURL, cachePolicy: .reloadRevalidatingCacheData)
        webView.load(request)
    }

    @objc private func pullToRefresh() {
        webView.reload()
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            self?.webView.scrollView.refreshControl?.endRefreshing()
        }
    }

    // MARK: - 通知权限
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        if let scheme = url.scheme, ["tel", "mailto", "sms"].contains(scheme) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        if let host = url.host, !host.contains("aifuxue.cn") && navigationAction.navigationType == .linkActivated {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        injectSafeAreaInsets()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        showRetry()
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code == NSURLErrorCancelled { return }
        showRetry()
    }

    // MARK: - WKUIDelegate
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default) { _ in completionHandler() })
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "取消", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "确定", style: .default) { _ in completionHandler(true) })
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String,
                 defaultText: String?, initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (String?) -> Void) {
        let alert = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        alert.addTextField { $0.text = defaultText }
        alert.addAction(UIAlertAction(title: "取消", style: .cancel) { _ in completionHandler(nil) })
        alert.addAction(UIAlertAction(title: "确定", style: .default) { _ in
            completionHandler(alert.textFields?.first?.text)
        })
        present(alert, animated: true)
    }

    // MARK: - 原生相机调用
    private func openCamera() {
        let status = AVCaptureDevice.authorizationStatus(for: .video)
        switch status {
        case .authorized:
            presentCamera()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    if granted { self?.presentCamera() }
                }
            }
        default:
            showPermissionAlert("相机")
        }
    }

    private func presentCamera() {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            presentPhotoLibrary()
            return
        }
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = self
        picker.modalPresentationStyle = .fullScreen
        present(picker, animated: true)
    }

    private func presentPhotoLibrary() {
        let picker = UIImagePickerController()
        picker.sourceType = .photoLibrary
        picker.delegate = self
        picker.modalPresentationStyle = .fullScreen
        present(picker, animated: true)
    }

    func imagePickerController(_ picker: UIImagePickerController,
                               didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        picker.dismiss(animated: true)
        guard let image = info[.originalImage] as? UIImage else { return }
        if let data = image.jpegData(compressionQuality: 0.7) {
            let base64 = data.base64EncodedString()
            let js = "window.onNativeCameraResult && window.onNativeCameraResult('data:image/jpeg;base64,\(base64)');"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
    }

    // MARK: - 原生分享
    private func nativeShare(text: String, url: String?) {
        var items: [Any] = [text]
        if let urlStr = url, let shareURL = URL(string: urlStr) {
            items.append(shareURL)
        }
        let ac = UIActivityViewController(activityItems: items, applicationActivities: nil)
        ac.popoverPresentationController?.sourceView = view
        ac.completionWithItemsHandler = { (_, completed, _, _) in
            if completed {
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            }
        }
        present(ac, animated: true)
    }

    // MARK: - Haptic Feedback
    private func triggerHaptic(_ style: String) {
        switch style {
        case "light":
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        case "medium":
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        case "heavy":
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case "success":
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case "error":
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        default:
            UISelectionFeedbackGenerator().selectionChanged()
        }
    }

    // MARK: - 复制到剪贴板
    private func copyToClipboard(_ text: String) {
        UIPasteboard.general.string = text
        let alert = UIAlertController(title: nil, message: "已复制到剪贴板", preferredStyle: .alert)
        present(alert, animated: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            alert.dismiss(animated: true)
        }
    }

    // MARK: - 本地通知
    private func sendLocalNotification(title: String, body: String, delay: TimeInterval) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            guard granted else { return }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false)
            let request = UNNotificationRequest(
                identifier: UUID().uuidString,
                content: content,
                trigger: trigger
            )
            UNUserNotificationCenter.current().add(request)
        }
    }

    // MARK: - Permission Alert
    private func showPermissionAlert(_ name: String) {
        let alert = UIAlertController(
            title: "需要\(name)权限",
            message: "请在系统设置中允许爱辅学使用\(name)",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.addAction(UIAlertAction(title: "去设置", style: .default) { _ in
            if let url = URL(string: UIApplication.openSettingsURLString) {
                UIApplication.shared.open(url)
            }
        })
        present(alert, animated: true)
    }

    // MARK: - Network Error Retry
    private func showRetry() {
        if presentedViewController != nil { return }
        let alert = UIAlertController(title: "网络连接失败", message: "请检查网络后重试", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "重试", style: .default) { [weak self] _ in
            self?.loadApp()
        })
        present(alert, animated: true)
    }

    // MARK: - Quick Action 导航（供 SceneDelegate 调用）
    func navigateToMenu(_ menu: String) {
        let js = """
        if (window.__setActiveMenu) {
            window.__setActiveMenu('\(menu)');
        } else {
            // 页面未加载完成时，延迟执行
            window.__pendingMenu = '\(menu)';
        }
        """
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    // MARK: - StoreKit IAP Setup
    private func setupStoreManager() {
        if #available(iOS 15.0, *) {
            let manager = StoreManager()
            manager.delegate = self
            storeManager = manager
        }
    }

    private func callJS(_ script: String) {
        webView.evaluateJavaScript(script, completionHandler: nil)
    }

    private func escapeForJS(_ str: String) -> String {
        return str
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "'", with: "\\'")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "")
    }

    // MARK: - 学习提醒（原生通知）
    private func scheduleStudyReminders() {
        let center = UNUserNotificationCenter.current()
        // 移除旧提醒后重新设置
        center.removePendingNotificationRequests(withIdentifiers: ["daily_study_morning", "daily_study_evening"])

        let enabled = UserDefaults.standard.bool(forKey: "study_reminder_enabled")
        guard enabled else { return }

        let morningHour = UserDefaults.standard.integer(forKey: "study_reminder_morning_hour")
        let eveningHour = UserDefaults.standard.integer(forKey: "study_reminder_evening_hour")

        // 早间提醒
        let morningContent = UNMutableNotificationContent()
        morningContent.title = "早安，该学习啦！"
        morningContent.body = "新的一天开始了，打开爱辅学完成今日学习计划吧"
        morningContent.sound = .default
        morningContent.badge = 1
        var morningDate = DateComponents()
        morningDate.hour = morningHour > 0 ? morningHour : 8
        morningDate.minute = 0
        let morningTrigger = UNCalendarNotificationTrigger(dateMatching: morningDate, repeats: true)
        let morningReq = UNNotificationRequest(identifier: "daily_study_morning", content: morningContent, trigger: morningTrigger)
        center.add(morningReq)

        // 晚间提醒
        let eveningContent = UNMutableNotificationContent()
        eveningContent.title = "今天学习了吗？"
        eveningContent.body = "每天坚持学习，进步看得见。快来完成今日任务吧！"
        eveningContent.sound = .default
        eveningContent.badge = 1
        var eveningDate = DateComponents()
        eveningDate.hour = eveningHour > 0 ? eveningHour : 20
        eveningDate.minute = 0
        let eveningTrigger = UNCalendarNotificationTrigger(dateMatching: eveningDate, repeats: true)
        let eveningReq = UNNotificationRequest(identifier: "daily_study_evening", content: eveningContent, trigger: eveningTrigger)
        center.add(eveningReq)
    }

    // MARK: - Spotlight 搜索索引
    private func indexAppContentInSpotlight() {
        var searchableItems: [CSSearchableItem] = []

        let features: [(String, String, String)] = [
            ("aifuxue_ai_tutor", "AI智能辅导", "与AI老师对话，解答学习疑惑，获取个性化辅导方案"),
            ("aifuxue_homework", "作业辅导", "拍照上传作业，AI智能批改并给出详细解析"),
            ("aifuxue_practice", "题目练习", "海量题库智能推荐，薄弱知识点精准练习"),
            ("aifuxue_progress", "学习进度", "查看学习报告，了解学习进度和知识掌握情况"),
            ("aifuxue_membership", "会员中心", "管理订阅，解锁全部AI辅导功能"),
        ]

        for (id, title, desc) in features {
            let attributeSet = CSSearchableItemAttributeSet(contentType: .content)
            attributeSet.title = title
            attributeSet.contentDescription = desc
            attributeSet.keywords = ["爱辅学", "学习", "AI", "辅导", title]

            let item = CSSearchableItem(
                uniqueIdentifier: id,
                domainIdentifier: "cn.aifuxue.app",
                attributeSet: attributeSet
            )
            item.expirationDate = Date.distantFuture
            searchableItems.append(item)
        }

        CSSearchableIndex.default().indexSearchableItems(searchableItems) { error in
            if let error = error {
                print("[Spotlight] 索引失败: \(error.localizedDescription)")
            }
        }
    }

    // MARK: - 生物识别认证
    private func performBiometricAuth(reason: String) {
        let context = LAContext()
        var error: NSError?

        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            let result: [String: Any] = [
                "success": false,
                "error": "not_available",
                "message": error?.localizedDescription ?? "设备不支持生物识别"
            ]
            sendBiometricResult(result)
            return
        }

        let localizedReason = reason.isEmpty ? "请验证身份以继续使用" : reason
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: localizedReason) { [weak self] success, authError in
            DispatchQueue.main.async {
                if success {
                    self?.sendBiometricResult(["success": true, "message": "验证成功"])
                } else {
                    var errorCode = "auth_failed"
                    if let err = authError as? LAError {
                        switch err.code {
                        case .userCancel: errorCode = "user_cancel"
                        case .userFallback: errorCode = "user_fallback"
                        case .biometryLockout: errorCode = "lockout"
                        default: errorCode = "auth_failed"
                        }
                    }
                    self?.sendBiometricResult([
                        "success": false,
                        "error": errorCode,
                        "message": authError?.localizedDescription ?? "验证失败"
                    ])
                }
            }
        }
    }

    private func sendBiometricResult(_ result: [String: Any]) {
        if let data = try? JSONSerialization.data(withJSONObject: result),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeBiometricResult && window.onNativeBiometricResult('\(escapeForJS(json))');")
        }
    }

    // MARK: - 学习提醒管理（来自 Web）
    private func handleStudyReminderMessage(_ body: Any) {
        guard let dict = body as? [String: Any], let action = dict["action"] as? String else { return }

        switch action {
        case "enable":
            UserDefaults.standard.set(true, forKey: "study_reminder_enabled")
            if let morning = dict["morningHour"] as? Int {
                UserDefaults.standard.set(morning, forKey: "study_reminder_morning_hour")
            }
            if let evening = dict["eveningHour"] as? Int {
                UserDefaults.standard.set(evening, forKey: "study_reminder_evening_hour")
            }
            scheduleStudyReminders()
            sendStudyReminderResult(["success": true, "enabled": true])

        case "disable":
            UserDefaults.standard.set(false, forKey: "study_reminder_enabled")
            UNUserNotificationCenter.current().removePendingNotificationRequests(
                withIdentifiers: ["daily_study_morning", "daily_study_evening"]
            )
            sendStudyReminderResult(["success": true, "enabled": false])

        case "getStatus":
            let enabled = UserDefaults.standard.bool(forKey: "study_reminder_enabled")
            let morning = UserDefaults.standard.integer(forKey: "study_reminder_morning_hour")
            let evening = UserDefaults.standard.integer(forKey: "study_reminder_evening_hour")
            sendStudyReminderResult([
                "success": true,
                "enabled": enabled,
                "morningHour": morning > 0 ? morning : 8,
                "eveningHour": evening > 0 ? evening : 20
            ])

        default:
            break
        }
    }

    private func sendStudyReminderResult(_ result: [String: Any]) {
        if let data = try? JSONSerialization.data(withJSONObject: result),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeStudyReminderResult && window.onNativeStudyReminderResult('\(escapeForJS(json))');")
        }
    }

    // MARK: - 离线缓存管理
    private func handleOfflineCacheMessage(_ body: Any) {
        guard let dict = body as? [String: Any], let action = dict["action"] as? String else { return }

        switch action {
        case "save":
            guard let key = dict["key"] as? String, let value = dict["value"] else { return }
            if let jsonData = try? JSONSerialization.data(withJSONObject: value) {
                UserDefaults.standard.set(jsonData, forKey: "offline_\(key)")
                sendOfflineCacheResult(["success": true, "action": "save", "key": key])
            }

        case "load":
            guard let key = dict["key"] as? String else { return }
            if let data = UserDefaults.standard.data(forKey: "offline_\(key)"),
               let value = try? JSONSerialization.jsonObject(with: data) {
                sendOfflineCacheResult(["success": true, "action": "load", "key": key, "value": value])
            } else {
                sendOfflineCacheResult(["success": false, "action": "load", "key": key, "error": "not_found"])
            }

        case "remove":
            guard let key = dict["key"] as? String else { return }
            UserDefaults.standard.removeObject(forKey: "offline_\(key)")
            sendOfflineCacheResult(["success": true, "action": "remove", "key": key])

        case "clear":
            let defaults = UserDefaults.standard
            let allKeys = defaults.dictionaryRepresentation().keys.filter { $0.hasPrefix("offline_") }
            for key in allKeys {
                defaults.removeObject(forKey: key)
            }
            sendOfflineCacheResult(["success": true, "action": "clear"])

        default:
            break
        }
    }

    private func sendOfflineCacheResult(_ result: [String: Any]) {
        if let data = try? JSONSerialization.data(withJSONObject: result),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeOfflineCacheResult && window.onNativeOfflineCacheResult('\(escapeForJS(json))');")
        }
    }
}

// MARK: - JS Bridge Handler
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        switch message.name {
        case "nativeCamera":
            openCamera()
        case "nativeHaptic":
            let style = (message.body as? String) ?? "light"
            triggerHaptic(style)
        case "nativeShare":
            if let dict = message.body as? [String: String] {
                nativeShare(text: dict["text"] ?? "爱辅学 - AI学习助手", url: dict["url"])
            }
        case "nativeClipboard":
            if let text = message.body as? String {
                copyToClipboard(text)
            }
        case "nativeNotification":
            if let dict = message.body as? [String: Any],
               let title = dict["title"] as? String {
                sendLocalNotification(
                    title: title,
                    body: dict["body"] as? String ?? "",
                    delay: dict["delay"] as? TimeInterval ?? 1
                )
            }
        case "nativeIAP":
            if #available(iOS 15.0, *), let dict = message.body as? [String: String],
               let action = dict["action"] {
                if action == "loadProducts" {
                    storeManager?.loadProducts()
                } else if action == "purchase", let pid = dict["productId"] {
                    storeManager?.purchase(pid)
                } else if action == "finishTransaction", let tid = dict["transactionId"] {
                    storeManager?.finishTransaction(transactionId: tid)
                }
            }
        case "nativeRestorePurchases":
            if #available(iOS 15.0, *) {
                storeManager?.restorePurchases()
            }
        case "nativeBiometric":
            let reason = (message.body as? [String: String])?["reason"] ?? ""
            performBiometricAuth(reason: reason)
        case "nativeStudyReminder":
            handleStudyReminderMessage(message.body)
        case "nativeOfflineCache":
            handleOfflineCacheMessage(message.body)
        default:
            break
        }
    }
}

// MARK: - StoreManager Delegate
@available(iOS 15.0, *)
extension ViewController: StoreManagerDelegate {
    func didLoadProducts(_ products: [IAPProductInfo]) {
        var items: [[String: String]] = []
        for p in products {
            items.append([
                "productId": p.productId,
                "displayName": p.displayName,
                "displayPrice": p.displayPrice,
                "description": p.description,
                "type": p.type
            ])
        }
        if let data = try? JSONSerialization.data(withJSONObject: ["success": true, "products": items]),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeIAPProductsLoaded && window.onNativeIAPProductsLoaded('\(escapeForJS(json))');")
        }
    }

    func didCompletePurchase(productId: String, jwsTransaction: String) {
        if let data = try? JSONSerialization.data(withJSONObject: [
            "success": true,
            "productId": productId,
            "signedTransaction": jwsTransaction
        ] as [String: Any]),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeIAPResult && window.onNativeIAPResult('\(escapeForJS(json))');")
        }
    }

    func didFailPurchase(productId: String, error: String, message: String) {
        if let data = try? JSONSerialization.data(withJSONObject: [
            "success": false,
            "productId": productId,
            "error": error,
            "message": message
        ] as [String: Any]),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeIAPResult && window.onNativeIAPResult('\(escapeForJS(json))');")
        }
    }

    func didRestorePurchases(_ transactions: [IAPRestoreInfo]) {
        var items: [[String: Any]] = []
        for t in transactions {
            var item: [String: Any] = [
                "productId": t.productId,
                "signedTransaction": t.signedTransaction
            ]
            if let exp = t.expiresDate {
                item["expiresDate"] = ISO8601DateFormatter().string(from: exp)
            }
            items.append(item)
        }
        if let data = try? JSONSerialization.data(withJSONObject: ["success": true, "transactions": items]),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeIAPRestoreResult && window.onNativeIAPRestoreResult('\(escapeForJS(json))');")
        }
    }

    func didReceiveTransactionUpdate(jwsTransaction: String) {
        if let data = try? JSONSerialization.data(withJSONObject: [
            "signedTransaction": jwsTransaction
        ]),
           let json = String(data: data, encoding: .utf8) {
            callJS("window.onNativeIAPTransactionUpdate && window.onNativeIAPTransactionUpdate('\(escapeForJS(json))');")
        }
    }
}

// MARK: - Prevent WKScriptMessageHandler retain cycle
class LeakAvoider: NSObject, WKScriptMessageHandler {
    weak var delegate: WKScriptMessageHandler?
    init(delegate: WKScriptMessageHandler) { self.delegate = delegate }
    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        delegate?.userContentController(userContentController, didReceive: message)
    }
}
