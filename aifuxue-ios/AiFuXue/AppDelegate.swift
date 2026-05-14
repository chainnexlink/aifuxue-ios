import UIKit
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 注册本地通知（用于学习打卡提醒 — Guideline 4.2 原生功能）
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
        application.applicationIconBadgeNumber = 0

        // 注册 Home Screen Quick Actions（3D Touch / Haptic Touch 快捷操作 — Guideline 4.2）
        application.shortcutItems = [
            UIApplicationShortcutItem(
                type: "com.aifuxue.app.notes",
                localizedTitle: "拍照笔记",
                localizedSubtitle: "拍摄课堂笔记并整理",
                icon: UIApplicationShortcutIcon(systemImageName: "camera.fill"),
                userInfo: nil
            ),
            UIApplicationShortcutItem(
                type: "com.aifuxue.app.mistakes",
                localizedTitle: "错题诊断",
                localizedSubtitle: "AI智能诊断错题",
                icon: UIApplicationShortcutIcon(systemImageName: "doc.text.magnifyingglass"),
                userInfo: nil
            ),
            UIApplicationShortcutItem(
                type: "com.aifuxue.app.practice",
                localizedTitle: "靶向练习",
                localizedSubtitle: "精准针对薄弱知识点",
                icon: UIApplicationShortcutIcon(systemImageName: "target"),
                userInfo: nil
            ),
        ]

        return true
    }

    // MARK: UISceneSession Lifecycle
    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    // MARK: UNUserNotificationCenterDelegate
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        completionHandler()
    }
}
