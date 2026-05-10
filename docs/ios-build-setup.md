# iOS 自动构建配置指南

## 你的项目信息

| 项目 | 值 |
|------|-----|
| Team ID | `VC5PK29BWD` |
| Bundle ID | `cn.aifuxue` |
| 团队名称 | 潮州亿彩礼品贸易有限公司 |

---

## 第一步：导出签名证书 (.p12)

### 1.1 在 Mac 上打开钥匙串访问

1. 打开 **钥匙串访问** (Keychain Access.app)
2. 左侧选择 **"登录"** 钥匙串，类别选 **"我的证书"**
3. 找到你的 iOS 发布证书，名称类似：
   - `iPhone Distribution: Chaozhou Yicai... (VC5PK29BWD)`
   - 或者 `Apple Distribution: Chaozhou Yicai... (VC5PK29BWD)`

> 如果没有证书，先去 Apple Developer → Certificates → 点击 `+` 创建 **"iOS Distribution (App Store)"** 证书

### 1.2 导出 .p12 文件

1. 右键点击证书 → **"导出"{name}**
2. 文件格式选择 **"个人信息交换 (.p12)"**
3. 设置一个导出密码（记住它！这是 `IOS_SIGNING_CERTIFICATE_PASSWORD`）
4. 保存文件，例如 `aifuxue-distribution.p12`

### 1.3 转 Base64

在 Mac 终端执行：
```bash
base64 -i aifuxue-distribution.p12 -o aifuxue-cert-base64.txt
```

`aifuxue-cert-base64.txt` 的内容就是 `IOS_SIGNING_CERTIFICATE_BASE64`

---

## 第二步：导出描述文件 (.mobileprovision)

### 2.1 确保描述文件存在

1. 访问 https://developer.apple.com → **"Profiles"**
2. 确认有一个 **App Store** 类型的描述文件，关联到：
   - App ID: `cn.aifuxue`
   - 证书: 第一步中的发布证书
3. 如果没有，点击 `+` 创建：
   - 类型选 **"App Store"**
   - App ID 选 `cn.aifuxue`
   - 勾选你的发布证书
   - 命名如 `aifuxue-appstore`

### 2.2 下载并转 Base64

1. 下载 `.mobileprovision` 文件
2. 在终端执行：
```bash
base64 -i aifuxue.mobileprovision -o aifuxue-profile-base64.txt
```

`aifuxue-profile-base64.txt` 的内容就是 `IOS_PROVISION_PROFILE_BASE64`

3. **获取描述文件名称**，在终端执行：
```bash
security cms -D -i aifuxue.mobileprovision | grep -A1 "Name" | tail -1 | sed 's/<[^>]*>//g' | xargs
```

输出结果就是 `IOS_PROVISION_PROFILE_NAME`（例如 `aifuxue-appstore`）

---

## 第三步：创建 App Store Connect API Key

### 3.1 创建 API Key

1. 访问 https://appstoreconnect.apple.com → **"用户和访问"** → **"集成"** 标签页
2. 点击 **"App Store Connect API"** → **"生成 API 密钥"**
3. 填写名称：`GitHub Actions`
4. 选择访问权限：**"开发者"**
5. 点击生成

### 3.2 下载并记录

下载 `.p8` 文件后会显示 3 个信息（只显示一次）：

| 项目 | 值 | Secret 名称 |
|------|-----|-------------|
| **Issuer ID** | 类似 `69a6de...` | `APP_STORE_CONNECT_ISSUER_ID` |
| **Key ID** | 类似 `ABC1234567` | `APP_STORE_CONNECT_API_KEY_ID` |
| **API Key (.p8)** | 私钥文件内容 | `APP_STORE_CONNECT_API_KEY` |

### 3.3 获取 API Key 内容

```bash
cat AuthKey_XXXXXX.p8
```

输出内容（包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）就是 `APP_STORE_CONNECT_API_KEY`

---

## 第四步：添加到 GitHub Secrets

访问 https://github.com/chainnexlink/aifuxue-ios/settings/secrets/actions

点击 **"New repository secret"**，逐个添加：

| Secret 名称 | 值 | 来源 |
|-------------|-----|------|
| `IOS_SIGNING_CERTIFICATE_BASE64` | `aifuxue-cert-base64.txt` 的内容 | 第一步 1.3 |
| `IOS_SIGNING_CERTIFICATE_PASSWORD` | 导出 .p12 时设置的密码 | 第一步 1.2 |
| `IOS_PROVISION_PROFILE_BASE64` | `aifuxue-profile-base64.txt` 的内容 | 第二步 2.2 |
| `IOS_PROVISION_PROFILE_NAME` | 描述文件名称 | 第二步 2.3 |
| `IOS_DEVELOPMENT_TEAM` | `VC5PK29BWD` | Apple Developer |
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID | 第三步 3.2 |
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID | 第三步 3.2 |
| `APP_STORE_CONNECT_API_KEY` | .p8 文件内容 | 第三步 3.3 |

---

## 第五步：测试

全部 8 个 Secret 配置完成后：

1. 访问 https://github.com/chainnexlink/aifuxue-ios/actions/workflows/ios-build.yml
2. 点击 **"Run workflow"** → **"Run workflow"**
3. 等待构建完成（约 15-20 分钟）
4. 构建成功后，IPA 会自动上传到 App Store Connect
5. 在 App Store Connect 中即可看到新版本
