import UIKit
import WebKit
import Photos
import AVFoundation

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate,
                      UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    private var webView: WKWebView!
    private var progressView: UIProgressView!
    private var splashView: UIView?
    private var observation: NSKeyValueObservation?

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
        loadApp()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // 注入安全区域 CSS 变量，让 H5 页面能精确适配刘海/底部
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

        // 注册 JS Bridge 用于原生功能调用
        let userController = WKUserContentController()
        userController.add(LeakAvoider(delegate: self), name: "nativeCamera")
        userController.add(LeakAvoider(delegate: self), name: "nativeHaptic")
        userController.add(LeakAvoider(delegate: self), name: "nativeShare")

        // 注入 viewport 强制适配脚本 + 原生标识
        let viewportScript = WKUserScript(source: """
            // 标记原生 iOS 环境，供前端检测
            window.__NATIVE_IOS__ = true;

            var meta = document.querySelector('meta[name="viewport"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'viewport';
                document.head.appendChild(meta);
            }
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

            // iPad适配: 注入设备类型标识
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

        // 铺满整个屏幕（包括安全区域），让 H5 自行处理安全区
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = true

        // 下拉刷新
        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(red: 91/255, green: 123/255, blue: 255/255, alpha: 1)
        refreshControl.addTarget(self, action: #selector(pullToRefresh), for: .valueChanged)
        webView.scrollView.refreshControl = refreshControl

        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false

        // 全屏约束 — 从屏幕顶部到底部完全铺满
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])

        // 监听加载进度
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

        NSLayoutConstraint.activate([
            logo.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            logo.centerYAnchor.constraint(equalTo: splash.centerYAnchor, constant: -40),
            logo.widthAnchor.constraint(equalToConstant: 90),
            logo.heightAnchor.constraint(equalToConstant: 90),
            name.topAnchor.constraint(equalTo: logo.bottomAnchor, constant: 20),
            name.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
            desc.topAnchor.constraint(equalTo: name.bottomAnchor, constant: 8),
            desc.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
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
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            self?.webView.scrollView.refreshControl?.endRefreshing()
        }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }

        // tel: / mailto: 等系统链接
        if let scheme = url.scheme, ["tel", "mailto", "sms"].contains(scheme) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        // 外部链接用 Safari 打开
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
        // 忽略取消错误
        if (error as NSError).code == NSURLErrorCancelled { return }
        showRetry()
    }

    // MARK: - WKUIDelegate (alert/confirm/prompt)
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

    // MARK: - File Upload (相机/相册选择)
    func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        // iOS WKWebView 不会调用此方法，但做好兼容
        completionHandler(nil)
    }

    // MARK: - 原生相机调用
    private var cameraCallback: ((String?) -> Void)?

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
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else { return }
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = self
        picker.modalPresentationStyle = .fullScreen
        present(picker, animated: true)
    }

    func imagePickerController(_ picker: UIImagePickerController,
                               didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        picker.dismiss(animated: true)
        guard let image = info[.originalImage] as? UIImage else { return }

        // 将图片转为 base64 回传给 H5
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
        // 避免重复弹窗
        if presentedViewController != nil { return }
        let alert = UIAlertController(title: "网络连接失败", message: "请检查网络后重试", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "重试", style: .default) { [weak self] _ in
            self?.loadApp()
        })
        present(alert, animated: true)
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
        default:
            break
        }
    }
}

// MARK: - 防止 WKScriptMessageHandler 循环引用
class LeakAvoider: NSObject, WKScriptMessageHandler {
    weak var delegate: WKScriptMessageHandler?
    init(delegate: WKScriptMessageHandler) { self.delegate = delegate }
    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        delegate?.userContentController(userContentController, didReceive: message)
    }
}
