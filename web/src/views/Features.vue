<template>
  <div>
    <Navbar />
    <section class="page-hero">
      <div class="container"><h1>功能介绍</h1><p>全方位AI学习能力，覆盖学习全流程</p></div>
    </section>

    <section v-for="(f, i) in features" :key="f.title" :class="['feature-section', i % 2 === 1 ? 'section-alt' : '']">
      <div class="container">
        <div :class="['feature-row', i % 2 === 1 ? 'reverse' : '']">
          <div class="feature-info">
            <div class="fi-badge" :style="{ background: f.badgeBg, color: f.badgeColor }">{{ f.badge }}</div>
            <h2>{{ f.title }}</h2>
            <p class="fi-desc">{{ f.desc }}</p>
            <ul class="fi-list">
              <li v-for="item in f.items" :key="item">{{ item }}</li>
            </ul>
            <router-link v-if="f.slug" :to="`/features/${f.slug}`" class="btn btn-outline" style="margin-top:20px;">查看详情 &rarr;</router-link>
          </div>
          <div class="feature-visual">
            <div class="fv-card" :style="{ background: f.cardBg }">
              <span class="fv-icon">{{ f.icon }}</span>
              <span class="fv-label">{{ f.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const features = [
  { icon: '📷', badge: '笔记', title: '拍照笔记整理', desc: '一键拍照，AI帮你整理排版', badgeBg: '#EEF2FF', badgeColor: '#5B7BFF', cardBg: 'linear-gradient(135deg,#EEF2FF,#C7D2FE)', slug: 'note-taking',
    items: ['多张图片同时上传，批量整理', 'OCR高精度文字识别', 'AI自动归纳知识点，生成Markdown文档', '支持导出PDF/图片/Word', '广告解锁机制，每日3次免费'] },
  { icon: '🔍', badge: '错题', title: 'AI错题诊断', desc: '智能分析每一道错题的根因', badgeBg: '#FEF2F2', badgeColor: '#EF4444', cardBg: 'linear-gradient(135deg,#FEF2F2,#FECACA)', slug: 'mistake-diagnosis',
    items: ['拍照录入错题，OCR自动识别题目', 'AI识别知识点和错误类型', '4大错误分类：计算错误/概念不清/审题偏差/完全不会', '自动生成同类变式题练习', '错题巩固卷生成（观看广告解锁）'] },
  { icon: '🎯', badge: '练习', title: '靶向练习系统', desc: '精准练习，提高效率', badgeBg: '#ECFDF5', badgeColor: '#10B981', cardBg: 'linear-gradient(135deg,#ECFDF5,#A7F3D0)', slug: 'targeted-practice',
    items: ['基于笔记和错题自动生成', '选择题/填空题/判断题全覆盖', '练习历史记录和正确率统计', '家长密码保护答案查看', '详细的答题分析和知识点关联'] },
  { icon: '👨‍🏫', badge: '教师', title: '教师助教系统', desc: '教师专属工具，教学效率翻倍', badgeBg: '#FFF7ED', badgeColor: '#F59E0B', cardBg: 'linear-gradient(135deg,#FFF7ED,#FDE68A)', slug: 'teacher-system',
    items: ['教师认证后开启完整教学功能', '创建班级，生成CLASS-XXXXXX邀请码', '发布在线作业（AI自动批改）和离线作业（拍照/录音提交）', 'AI批改配额每日50次在线+50次离线', '一键切换教师/学生视角预览'] },
  { icon: '🏫', badge: '班级', title: '班级管理', desc: '邀请码加入，轻松管理', badgeBg: '#F5F3FF', badgeColor: '#8B5CF6', cardBg: 'linear-gradient(135deg,#F5F3FF,#DDD6FE)',
    items: ['学生输入CLASS-XXXXXX邀请码加入', '作业自动分发到班级所有学生', '学生完成率和成绩实时追踪', '支持多班级管理', '教师查看班级错题热点分析'] },
  { icon: '🗣️', badge: '口语', title: '英语口语练习', desc: 'AI评分，精准提升发音', badgeBg: '#EFF6FF', badgeColor: '#3B82F6', cardBg: 'linear-gradient(135deg,#EFF6FF,#BFDBFE)', slug: 'oral-english',
    items: ['美式/英式双口音选择', '常速/慢速播放', 'AI评分：准确度/流畅度/完整度', '逐词评分和音节颜色标注', '口语错题本，连续3次80+自动移除'] },
  { icon: '🎁', badge: '获客', title: '邀请码系统', desc: '分享即获益，病毒式传播', badgeBg: '#F0FDF4', badgeColor: '#16A34A', cardBg: 'linear-gradient(135deg,#F0FDF4,#BBF7D0)', slug: 'invite-system',
    items: ['教师邀请码TEACHER-XXXXXX：学生注册送30天全功能体验', '用户邀请码USER-XXXXXX：好友注册送7天全功能体验', '每个邀请码每个账号只能使用一次', '注册时输入邀请码自动激活全功能体验', '教师→学生→学生的病毒式传播闭环'] },
]
</script>

<style scoped>
.page-hero { padding: 140px 0 60px; background: linear-gradient(180deg, #f8f9fc, #fff); text-align: center;
  h1 { font-size: 44px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
  p { font-size: 18px; color: var(--text3); }
}
.feature-section { padding: 80px 0; }
.section-alt { background: var(--bg-light); }
.feature-row { display: flex; align-items: center; gap: 80px; }
.feature-row.reverse { flex-direction: row-reverse; }
.feature-info { flex: 1; }
.fi-badge { display: inline-block; padding: 6px 16px; border-radius: 16px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
.feature-info h2 { font-size: 32px; font-weight: 800; color: var(--text1); margin-bottom: 12px; }
.fi-desc { font-size: 17px; color: var(--text3); margin-bottom: 24px; }
.fi-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.fi-list li { font-size: 15px; color: var(--text2); padding-left: 24px; position: relative; }
.fi-list li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-weight: 700; }
.feature-visual { flex-shrink: 0; }
.fv-card { width: 360px; height: 280px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.fv-icon { font-size: 64px; }
.fv-label { font-size: 20px; font-weight: 700; color: var(--text1); }
</style>
