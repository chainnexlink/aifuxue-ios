/**
 * 分享工具 - 支持微信、QQ、抖音等平台分享
 */

export interface ShareParams {
  title: string
  summary?: string
  href?: string
  imageUrl?: string
}

/**
 * 打开分享面板（App端使用uni.share，小程序端使用onShareAppMessage）
 */
export function showSharePanel(params: ShareParams) {
  // #ifdef APP-PLUS
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: params.title,
    summary: params.summary || '',
    href: params.href || '',
    imageUrl: params.imageUrl || '',
    success() {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail(err: any) {
      if (err?.errMsg?.includes('cancel')) return
      uni.showToast({ title: '分享失败', icon: 'none' })
    },
  })
  // #endif

  // #ifdef MP-WEIXIN
  // 小程序环境无法主动调用分享，需通过button open-type="share"触发
  uni.showToast({ title: '请点击右上角菜单分享', icon: 'none' })
  // #endif

  // #ifndef APP-PLUS || MP-WEIXIN
  // H5环境使用复制链接
  if (params.href) {
    uni.setClipboardData({
      data: params.href,
      success() {
        uni.showToast({ title: '链接已复制，可粘贴分享', icon: 'success' })
      },
    })
  }
  // #endif
}

/**
 * 显示分享到指定平台的选择面板
 */
export function showShareActionSheet(params: ShareParams) {
  const platforms = [
    { name: '微信好友', provider: 'weixin', scene: 'WXSceneSession' },
    { name: '微信朋友圈', provider: 'weixin', scene: 'WXSceneTimeline' },
    { name: 'QQ好友', provider: 'qq', scene: '' },
    { name: '抖音', provider: 'douyin', scene: '' },
    { name: '复制链接', provider: 'copy', scene: '' },
  ]

  uni.showActionSheet({
    itemList: platforms.map((p) => p.name),
    success(res) {
      const selected = platforms[res.tapIndex]
      if (selected.provider === 'copy') {
        uni.setClipboardData({
          data: params.href || params.title,
          success() {
            uni.showToast({ title: '已复制', icon: 'success' })
          },
        })
        return
      }

      // #ifdef APP-PLUS
      uni.share({
        provider: selected.provider as any,
        scene: selected.scene as any,
        type: 0,
        title: params.title,
        summary: params.summary || '',
        href: params.href || '',
        imageUrl: params.imageUrl || '',
        success() {
          uni.showToast({ title: '分享成功', icon: 'success' })
        },
        fail(err: any) {
          if (err?.errMsg?.includes('cancel')) return
          uni.showToast({ title: '分享失败，请确认已安装对应App', icon: 'none' })
        },
      })
      // #endif

      // #ifndef APP-PLUS
      uni.showToast({ title: '该平台分享仅在App中可用', icon: 'none' })
      // #endif
    },
  })
}
