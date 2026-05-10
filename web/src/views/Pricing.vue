<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container"><h1>功能方案</h1><p>灵活订阅，解锁AI学习全部能力</p></div>
    </section>

    <section class="section">
      <div class="container">
        <!-- 主定价卡片 -->
        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>免费版</h3>
            <div class="price"><span class="price-amount">免费</span></div>
            <p class="price-desc">全部功能开放体验</p>
            <router-link class="btn btn-outline" to="/register" style="width:100%;margin:24px 0;">免费注册</router-link>
            <ul class="plan-features">
              <li><span class="pf-icon check">&#10003;</span>无限笔记整理</li>
              <li><span class="pf-icon check">&#10003;</span>靶向练习（每日2次）</li>
              <li><span class="pf-icon check">&#10003;</span>口语评分（每日5次）</li>
              <li><span class="pf-icon check">&#10003;</span>加入班级完成作业</li>
              <li><span class="pf-icon check">&#10003;</span>错题录入与AI诊断</li>
              <li><span class="pf-icon check">&#10003;</span>知识图谱可视化</li>
              <li><span class="pf-icon cross">-</span>超出额度需观看广告</li>
              <li><span class="pf-icon cross">-</span>不含数据导出</li>
            </ul>
          </div>

          <div class="pricing-card popular">
            <div class="popular-badge">学生/家长推荐</div>
            <h3>VIP会员</h3>
            <div class="price"><span class="price-amount">¥18</span><span class="price-unit">/月</span></div>
            <p class="price-desc">或 ¥128/年（省¥88）</p>
            <router-link class="btn btn-primary" to="/register" style="width:100%;margin:24px 0;">立即开通</router-link>
            <ul class="plan-features">
              <li><span class="pf-icon check">&#10003;</span>去除所有广告</li>
              <li><span class="pf-icon check">&#10003;</span>AI功能无限次使用</li>
              <li><span class="pf-icon check">&#10003;</span>数据导出无限制</li>
              <li><span class="pf-icon check">&#10003;</span>AI深度辅导</li>
              <li><span class="pf-icon check">&#10003;</span>笔记/错题本/学习报告导出</li>
              <li><span class="pf-icon check">&#10003;</span>模拟考试无限制</li>
              <li><span class="pf-icon check">&#10003;</span>口语练习无限制</li>
              <li><span class="pf-icon check">&#10003;</span>优先客服支持</li>
            </ul>
          </div>

          <div class="pricing-card teacher">
            <div class="popular-badge teacher-badge">教师专属</div>
            <h3>教师订阅</h3>
            <div class="price"><span class="price-amount">¥30</span><span class="price-unit">/月</span></div>
            <p class="price-desc">或 ¥1/2次 按需使用</p>
            <router-link class="btn btn-dark" to="/register" style="width:100%;margin:24px 0;">教师注册</router-link>
            <ul class="plan-features">
              <li><span class="pf-icon check">&#10003;</span>AI批改无限次</li>
              <li><span class="pf-icon check">&#10003;</span>AI智能出卷无限制</li>
              <li><span class="pf-icon check">&#10003;</span>Word/PDF试卷导出</li>
              <li><span class="pf-icon check">&#10003;</span>班级管理无限班级</li>
              <li><span class="pf-icon check">&#10003;</span>学情数据分析</li>
              <li><span class="pf-icon check">&#10003;</span>成绩发布与通知</li>
              <li><span class="pf-icon check">&#10003;</span>试卷分享与打印</li>
              <li><span class="pf-icon check">&#10003;</span>新注册免费体验1个月</li>
            </ul>
          </div>
        </div>

        <!-- 功能对比表 -->
        <div class="compare-section">
          <h2 style="text-align:center;font-size:32px;font-weight:800;margin-bottom:40px;">功能对比</h2>
          <table class="compare-table">
            <thead>
              <tr><th>功能</th><th>免费版</th><th>VIP会员</th><th>教师订阅</th></tr>
            </thead>
            <tbody>
              <tr v-for="r in compareRows" :key="r.feature">
                <td>{{ r.feature }}</td>
                <td><span :class="r.freeClass">{{ r.free }}</span></td>
                <td><span :class="r.vipClass">{{ r.vip }}</span></td>
                <td><span :class="r.teacherClass">{{ r.teacher }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 教师专区 -->
        <div class="teacher-section">
          <h2 style="text-align:center;font-size:32px;font-weight:800;margin-bottom:16px;">教师按次计费</h2>
          <p style="text-align:center;color:var(--text3);margin-bottom:40px;">不想包月？¥1可用2次，用多少付多少</p>
          <div class="peruse-card">
            <div class="pu-left">
              <h3>按次计费方案</h3>
              <p>适合使用频率较低的教师，每次AI批改/出卷/导出只需 <strong>¥1/2次</strong></p>
              <div class="pu-features">
                <span>AI批改 2次/¥1</span>
                <span>AI出卷 2次/¥1</span>
                <span>Word导出 2次/¥1</span>
              </div>
            </div>
            <div class="pu-right">
              <div class="pu-price"><span>¥1</span><span>/2次</span></div>
              <p>无月费，按需付费</p>
            </div>
          </div>
        </div>

        <!-- 邀请码系统 -->
        <div class="invite-section">
          <h2 style="text-align:center;font-size:32px;font-weight:800;margin-bottom:16px;">邀请有礼</h2>
          <p style="text-align:center;color:var(--text3);margin-bottom:40px;">分享邀请码，人人都能获益</p>
          <div class="invite-cards">
            <div class="invite-card">
              <div class="ic-icon" style="background:linear-gradient(135deg,#409eff,#79bbff);">&#x1F468;&#x200D;&#x1F3EB;</div>
              <h4>教师邀请码</h4>
              <div class="ic-code">TEACHER-XXXXXX</div>
              <p>学生使用教师邀请码注册，获得 <strong>30天全功能体验</strong></p>
            </div>
            <div class="invite-card">
              <div class="ic-icon" style="background:linear-gradient(135deg,#a78bfa,#c4b5fd);">&#x1F381;</div>
              <h4>用户邀请码</h4>
              <div class="ic-code">USER-XXXXXX</div>
              <p>好友使用邀请码注册，获得 <strong>7天全功能体验</strong></p>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="faq-section">
          <h2 style="text-align:center;font-size:32px;font-weight:800;margin-bottom:40px;">常见问题</h2>
          <div class="faq-list">
            <div v-for="(q, i) in faqs" :key="i" class="faq-item" @click="openFaq = openFaq === i ? null : i">
              <div class="faq-q"><span>{{ q.q }}</span><span class="faq-arrow" :class="{ open: openFaq === i }">&#9660;</span></div>
              <div class="faq-a" v-show="openFaq === i">{{ q.a }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const openFaq = ref<number | null>(null)

const compareRows = [
  { feature: '笔记整理', free: '无限', freeClass: 'check', vip: '无限', vipClass: 'check', teacher: '无限', teacherClass: 'check' },
  { feature: '靶向练习', free: '每日2次', freeClass: '', vip: '无限', vipClass: 'check', teacher: '无限', teacherClass: 'check' },
  { feature: '口语评分', free: '每日5次', freeClass: '', vip: '无限', vipClass: 'check', teacher: '—', teacherClass: 'na' },
  { feature: '笔记导出', free: '每日3次', freeClass: '', vip: '无限', vipClass: 'check', teacher: '无限', teacherClass: 'check' },
  { feature: 'AI错题诊断', free: '无限', freeClass: 'check', vip: '无限', vipClass: 'check', teacher: '无限', teacherClass: 'check' },
  { feature: 'AI批改', free: '—', freeClass: 'na', vip: '—', vipClass: 'na', teacher: '无限', teacherClass: 'check' },
  { feature: 'AI出卷', free: '—', freeClass: 'na', vip: '—', vipClass: 'na', teacher: '无限', teacherClass: 'check' },
  { feature: 'Word/PDF导出', free: '—', freeClass: 'na', vip: '含PDF', vipClass: 'check', teacher: '全部', teacherClass: 'check' },
  { feature: '去广告', free: '✗', freeClass: 'cross', vip: '✓', vipClass: 'check', teacher: '✓', teacherClass: 'check' },
  { feature: '试卷分享/打印', free: '—', freeClass: 'na', vip: '—', vipClass: 'na', teacher: '✓', teacherClass: 'check' },
  { feature: '班级管理', free: '—', freeClass: 'na', vip: '—', vipClass: 'na', teacher: '无限', teacherClass: 'check' },
  { feature: '成绩发布通知', free: '—', freeClass: 'na', vip: '—', vipClass: 'na', teacher: '✓', teacherClass: 'check' },
]

const faqs = [
  { q: '教师注册免费使用1个月具体包含什么？', a: '新注册的教师账户可免费体验全部教学功能1个月，包括AI批改、智能出卷、Word/PDF导出、班级管理等所有功能，无需任何付费。试用期结束后可选择月度订阅(¥30/月)或按次计费(¥1/2次)。' },
  { q: '按次计费和月度订阅哪个更划算？', a: '如果您每月使用AI功能超过60次（批改+出卷+导出总计），月度订阅更划算。如果使用频率较低，按次计费更灵活。' },
  { q: '学生/家长VIP和教师订阅有什么区别？', a: '学生/家长VIP主要解锁学习工具的无限使用和去广告。教师订阅专注于教学功能：AI批改、出卷、Word导出、试卷分享打印、成绩发布等。两者面向不同角色。' },
  { q: '试卷导出Word版需要额外付费吗？', a: '教师月度订阅用户Word导出无限制。按次计费用户每次Word导出扣除1次额度(¥1/2次)。PDF导出VIP用户免费。' },
  { q: '可以随时取消订阅吗？', a: '可以随时取消订阅，取消后当前周期仍然有效，到期后不再自动续费。' },
]
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); }
}
.pricing-grid { display: flex; gap: 24px; justify-content: center; margin-bottom: 80px; }
.pricing-card { flex: 1; max-width: 340px; background: #fff; border: 2px solid var(--border); border-radius: 24px; padding: 36px 28px; position: relative; transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  h3 { font-size: 22px; font-weight: 700; color: var(--text1); margin-bottom: 8px; }
}
.pricing-card.popular { border-color: var(--primary); box-shadow: 0 8px 32px rgba(91,123,255,0.15); }
.pricing-card.teacher { border-color: var(--warning); }
.popular-badge { position: absolute; top: -14px; right: 24px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 10px; }
.teacher-badge { background: linear-gradient(135deg, #F59E0B, #FBBF24) !important; color: #1A1D2E !important; }
.price { margin: 16px 0 8px; }
.price-amount { font-size: 44px; font-weight: 800; color: var(--primary); }
.price-unit { font-size: 16px; color: var(--text3); }
.price-desc { font-size: 14px; color: var(--text3); margin-bottom: 8px; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.plan-features li { font-size: 14px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
.pf-icon { font-weight: 700; width: 20px; text-align: center; }
.pf-icon.check { color: var(--success); }
.pf-icon.cross { color: var(--text3); }

.compare-table { width: 100%; border-collapse: collapse; margin-bottom: 80px; }
.compare-table th, .compare-table td { padding: 14px 20px; text-align: center; border-bottom: 1px solid var(--border); font-size: 14px; }
.compare-table th { background: var(--bg-light); font-weight: 600; color: var(--text1); }
.compare-table td:first-child { text-align: left; font-weight: 500; }
.check { color: var(--success); font-weight: 700; }
.cross { color: #ccc; }
.na { color: var(--text3); }

.teacher-section { margin-bottom: 80px; }
.peruse-card { display: flex; gap: 40px; align-items: center; background: linear-gradient(135deg, #FFF7ED, #FFFBF0); border: 2px solid #FFEDD5; border-radius: 24px; padding: 40px; }
.pu-left { flex: 1; }
.pu-left h3 { font-size: 24px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
.pu-left p { font-size: 15px; color: var(--text3); margin-bottom: 16px; line-height: 1.7; }
.pu-left strong { color: var(--primary); font-weight: 800; }
.pu-features { display: flex; gap: 12px; flex-wrap: wrap; }
.pu-features span { padding: 6px 14px; background: rgba(245,158,11,0.1); border-radius: 8px; font-size: 13px; color: #B45309; font-weight: 600; }
.pu-right { text-align: center; }
.pu-price span:first-child { font-size: 48px; font-weight: 800; color: var(--warning); }
.pu-price span:last-child { font-size: 18px; color: var(--text3); }
.pu-right p { font-size: 14px; color: var(--text3); margin-top: 8px; }

.invite-section { margin-bottom: 80px; }
.invite-cards { display: flex; gap: 28px; justify-content: center; }
.invite-card { flex: 1; max-width: 360px; background: #fff; border: 2px solid var(--border); border-radius: 24px; padding: 36px; text-align: center; transition: all 0.3s; }
.invite-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
.ic-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; }
.invite-card h4 { font-size: 20px; font-weight: 700; color: var(--text1); margin-bottom: 12px; }
.ic-code { font-family: monospace; font-size: 18px; font-weight: 700; color: var(--primary); letter-spacing: 2px; padding: 10px; background: var(--bg-light); border-radius: 8px; margin-bottom: 12px; }
.invite-card p { font-size: 14px; color: var(--text3); line-height: 1.7; }

.faq-section { margin-bottom: 40px; }
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item { background: var(--bg-light); border-radius: 16px; margin-bottom: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s;
  &:hover { background: #f0f2f8; }
}
.faq-q { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; font-size: 16px; font-weight: 600; color: var(--text1); }
.faq-arrow { font-size: 12px; color: var(--text3); transition: transform 0.3s; }
.faq-arrow.open { transform: rotate(180deg); }
.faq-a { padding: 0 24px 20px; font-size: 15px; color: var(--text2); line-height: 1.8; }
</style>
