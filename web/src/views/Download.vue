<template>
  <div>
    <Navbar v-if="!isNativeIOS" />
    <section class="page-hero">
      <div class="container"><h1>下载爱辅学</h1><p>多平台支持，随时随地学习</p></div>
    </section>

    <section class="section">
      <div class="container" style="text-align:center;">
        <div class="download-grid">
          <div v-for="p in filteredPlatforms" :key="p.name" class="dl-card">
            <div class="dl-icon">{{ p.icon }}</div>
            <h3>{{ p.name }}</h3>
            <p>{{ p.desc }}</p>
            <router-link v-if="p.link && p.link !== '#'" :to="p.link" :class="['btn', p.primary ? 'btn-primary' : 'btn-dark']">{{ p.btn }}</router-link>
            <a v-else :class="['btn', p.primary ? 'btn-primary' : 'btn-dark']">{{ p.btn }}</a>
          </div>
        </div>

        <div v-if="!isNativeIOS" class="qr-section">
          <div class="qr-card">
            <div class="qr-placeholder"><span>微信扫码</span><span style="font-size:48px;">📱</span></div>
            <p>微信小程序</p>
          </div>
        </div>

        <div class="sys-req">
          <h3>系统要求</h3>
          <div class="req-grid">
            <div class="req-item"><strong>iOS</strong><span>iOS 13.0 或更高版本</span></div>
            <div v-if="!isNativeIOS" class="req-item"><strong>微信小程序</strong><span>微信 7.0 或更高版本</span></div>
            <div class="req-item"><strong>Web</strong><span>Chrome / Safari / Edge 最新版</span></div>
          </div>
        </div>
      </div>
    </section>
    <Footer v-if="!isNativeIOS" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const isNativeIOS = computed(() => !!(window as any).__NATIVE_IOS__ || !!(window as any).__NATIVE_ANDROID__)

const platforms = [
  { icon: '🍎', name: 'iOS', desc: 'iPhone / iPad', btn: 'App Store 下载', primary: true, link: '#' },
  { icon: '🤖', name: 'Android', desc: '安卓手机 / 平板', btn: '下载 APK', primary: false, link: '#', hideOnIOS: true },
  { icon: '💬', name: '微信小程序', desc: '无需下载，扫码即用', btn: '扫码体验', primary: false, link: '#', hideOnIOS: true },
  { icon: '🌐', name: 'Web 版', desc: '浏览器直接使用', btn: '打开 Web 版', primary: true, link: '/app' },
]

const filteredPlatforms = computed(() =>
  isNativeIOS.value ? platforms.filter(p => !p.hideOnIOS) : platforms
)
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); }
}
.download-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 60px; }
.dl-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px 24px; text-align: center; transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  h3 { font-size: 20px; font-weight: 700; margin: 12px 0 8px; color: var(--text1); }
  p { font-size: 14px; color: var(--text3); margin-bottom: 20px; }
}
.dl-icon { font-size: 48px; }
.qr-section { display: flex; gap: 40px; justify-content: center; margin-bottom: 60px; }
.qr-card { text-align: center;
  p { margin-top: 12px; font-size: 14px; color: var(--text3); font-weight: 600; }
}
.qr-placeholder { width: 180px; height: 180px; background: var(--bg-light); border: 2px dashed var(--border); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text3); font-size: 14px; }
.sys-req { max-width: 700px; margin: 0 auto;
  h3 { font-size: 24px; font-weight: 700; margin-bottom: 24px; color: var(--text1); }
}
.req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.req-item { background: var(--bg-light); border-radius: 12px; padding: 16px 20px; text-align: left; display: flex; flex-direction: column; gap: 4px;
  strong { font-size: 15px; color: var(--text1); }
  span { font-size: 13px; color: var(--text3); }
}
</style>
