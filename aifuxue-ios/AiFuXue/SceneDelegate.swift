import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession,
               options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()

        // 处理冷启动时的 Quick Action
        if let shortcutItem = connectionOptions.shortcutItem {
            handleShortcutItem(shortcutItem)
        }
    }

    // MARK: - Home Screen Quick Actions 处理
    func windowScene(_ windowScene: UIWindowScene,
                     performActionFor shortcutItem: UIApplicationShortcutItem,
                     completionHandler: @escaping (Bool) -> Void) {
        completionHandler(handleShortcutItem(shortcutItem))
    }

    @discardableResult
    private func handleShortcutItem(_ item: UIApplicationShortcutItem) -> Bool {
        guard let vc = window?.rootViewController as? ViewController else { return false }
        let menuMap: [String: String] = [
            "com.aifuxue.app.notes": "notes",
            "com.aifuxue.app.mistakes": "mistakes",
            "com.aifuxue.app.practice": "practice",
        ]
        if let menu = menuMap[item.type] {
            vc.navigateToMenu(menu)
            return true
        }
        return false
    }
}
