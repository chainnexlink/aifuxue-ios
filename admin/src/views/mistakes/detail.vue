<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/mistakes/list')">返回列表</el-button>
        <h2 style="margin:0;">错题详情 #{{ mistakeId }}</h2>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="warning" icon="Refresh" @click="generateVariant">生成变式题</el-button>
        <el-button type="danger" icon="Delete" @click="handleDelete">删除</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">原题内容</span></template>
          <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:16px;text-align:center;color:#909399;">
            <el-icon style="font-size:40px;"><Picture /></el-icon><p>OCR识别原图</p>
          </div>
          <p style="font-size:16px;line-height:1.8;">{{ mistake.ocrText }}</p>
        </el-card>
        <el-row :gutter="20" style="margin-top:20px;">
          <el-col :span="12">
            <el-card shadow="hover" style="border-left:4px solid #f56c6c;">
              <template #header><span style="font-weight:600;color:#f56c6c;">用户答案</span></template>
              <p style="line-height:1.8;">{{ mistake.userAnswer }}</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" style="border-left:4px solid #67c23a;">
              <template #header><span style="font-weight:600;color:#67c23a;">正确答案</span></template>
              <p style="line-height:1.8;">{{ mistake.correctAnswer }}</p>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">AI解析</span></template>
          <div style="line-height:1.8;white-space:pre-wrap;">{{ mistake.aiExplanation }}</div>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;" v-if="variants.length">
          <template #header><span style="font-weight:600;">变式题 ({{ variants.length }})</span></template>
          <div v-for="(v, idx) in variants" :key="idx" style="padding:12px;margin-bottom:12px;border:1px solid #e4e7ed;border-radius:8px;">
            <p style="font-weight:500;">变式{{ idx + 1 }}：{{ v.content }}</p>
            <p style="color:#67c23a;font-size:13px;margin-top:8px;">答案：{{ v.answer }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">错题信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="错题ID">{{ mistake.id }}</el-descriptions-item>
            <el-descriptions-item label="用户"><el-link type="primary" @click="$router.push(`/user/detail/${mistake.userId}`)">{{ mistake.user }}</el-link></el-descriptions-item>
            <el-descriptions-item label="科目"><el-tag size="small">{{ mistake.subject }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="知识点"><el-link type="primary" @click="$router.push(`/mistakes/knowledge/${encodeURIComponent(mistake.knowledgePoint)}`)">{{ mistake.knowledgePoint }}</el-link></el-descriptions-item>
            <el-descriptions-item label="错误类型"><el-tag :type="{'计算错误':'warning','概念不清':'danger','审题偏差':'','完全不会':'info'}[mistake.errorType] as any" size="small">{{ mistake.errorType }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="来源">{{ mistake.source }}</el-descriptions-item>
            <el-descriptions-item label="已消灭"><el-tag :type="mistake.resolved ? 'success' : 'danger'" size="small">{{ mistake.resolved ? '是' : '否' }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="重做次数">{{ mistake.retryCount }}次</el-descriptions-item>
            <el-descriptions-item label="录入时间">{{ mistake.createdAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">相似错题</span></template>
          <div v-for="s in similarMistakes" :key="s.id" style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <el-link type="primary" @click="$router.push(`/mistakes/detail/${s.id}`)">{{ s.ocrText }}</el-link>
            <div style="font-size:12px;color:#909399;margin-top:4px;"><el-tag size="small">{{ s.errorType }}</el-tag> {{ s.user }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const route = useRoute(); const router = useRouter()
const mistakeId = Number(route.params.id)
const mistake = reactive({
  id: mistakeId, userId: 1, user: '小明', ocrText: '求函数f(x)=x³-3x在区间[-2,2]上的极值和最值',
  subject: '数学', knowledgePoint: '导数应用', errorType: '计算错误', source: '拍照识别',
  resolved: false, retryCount: 2, createdAt: '2026-05-01 14:30',
  userAnswer: 'f\'(x)=3x²-3=0, x=1, f(1)=-2为极小值。最大值f(2)=2',
  correctAnswer: 'f\'(x)=3x²-3=0, x=±1\nf(-1)=2为极大值, f(1)=-2为极小值\n比较端点值: f(-2)=-2, f(2)=2\n最大值为f(-1)=f(2)=2, 最小值为f(1)=f(-2)=-2',
  aiExplanation: `错误分析：用户漏掉了x=-1这个驻点。\n\n详细解析：\n1. 求导：f'(x) = 3x² - 3 = 3(x+1)(x-1)\n2. 令f'(x)=0，得x=-1和x=1（用户只求到x=1）\n3. 极值判断：\n   - x=-1左侧f'>0，右侧f'<0 → 极大值f(-1)=(-1)³-3(-1)=2\n   - x=1左侧f'<0，右侧f'>0 → 极小值f(1)=1-3=-2\n4. 端点值：f(-2)=-8+6=-2，f(2)=8-6=2\n5. 最值：最大值max{2,-2,-2,2}=2，最小值min{2,-2,-2,2}=-2`,
})
const variants = ref<any[]>([])
const similarMistakes = ref([
  { id: 2, ocrText: '求f(x)=2x³-6x+1的极值', user: '小李', errorType: '计算错误' },
  { id: 3, ocrText: '函数f(x)=x⁴-2x²的极值', user: '小王', errorType: '概念不清' },
])
function generateVariant() {
  variants.value.push(
    { content: '求函数g(x)=x³-6x²+9x在[0,4]上的最值', answer: '最大值g(1)=4，最小值g(3)=0' },
    { content: '已知f(x)=2x³-3x²-12x+5，求f(x)的单调区间和极值', answer: '单调递增(-∞,-1)∪(2,+∞)，单调递减(-1,2)，极大值f(-1)=12，极小值f(2)=-15' },
  )
  ElMessage.success('已生成2道变式题')
}
function handleDelete() {
  ElMessageBox.confirm('确定删除此错题？', '删除', { type: 'error' }).then(() => {
    ElMessage.success('已删除'); router.push('/mistakes/list')
  }).catch(() => {})
}
</script>
