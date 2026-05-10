<template>
  <div>
    <div class="page-header"><h2>系统配置</h2></div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">基础配置</span></template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="系统名称"><el-input v-model="config.systemName" /></el-form-item>
            <el-form-item label="系统版本"><el-input v-model="config.version" disabled /></el-form-item>
            <el-form-item label="维护模式"><el-switch v-model="config.maintenance" /></el-form-item>
            <el-form-item label="注册开关"><el-switch v-model="config.registerEnabled" /></el-form-item>
            <el-form-item label="邀请码注册"><el-switch v-model="config.inviteCodeRequired" /></el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">AI配置</span></template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="OCR服务"><el-select v-model="config.ocrService" style="width:100%;"><el-option label="阿里云OCR" value="aliyun" /><el-option label="百度OCR" value="baidu" /><el-option label="腾讯OCR" value="tencent" /></el-select></el-form-item>
            <el-form-item label="AI模型"><el-select v-model="config.aiModel" style="width:100%;"><el-option label="GPT-4" value="gpt4" /><el-option label="通义千问" value="qwen" /><el-option label="文心一言" value="ernie" /></el-select></el-form-item>
            <el-form-item label="语音合成"><el-select v-model="config.ttsService" style="width:100%;"><el-option label="Azure TTS" value="azure" /><el-option label="阿里云TTS" value="aliyun" /></el-select></el-form-item>
            <el-form-item label="语音评测"><el-select v-model="config.speechEval" style="width:100%;"><el-option label="讯飞评测" value="iflytek" /><el-option label="Azure评测" value="azure" /></el-select></el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">学科配置</span></template>
          <el-form label-width="100px" label-position="left">
            <el-form-item label="可用学科">
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <el-tag v-for="s in config.subjects" :key="s" closable @close="removeSubject(s)">{{ s }}</el-tag>
                <el-button size="small" type="primary" text icon="Plus" @click="addSubjectVisible = true">添加</el-button>
              </div>
            </el-form-item>
            <el-form-item label="学段">
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <el-tag v-for="g in config.grades" :key="g">{{ g }}</el-tag>
              </div>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <!-- ========== 已修改：VIP配置→广告解锁配置，待ICP许可证下发后恢复 [2026-05-04] ========== -->
          <template #header><span style="font-weight:600;">广告解锁配置</span></template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="免费解锁次数"><el-input-number v-model="config.freeUnlocks" :min="0" :max="10" /></el-form-item>
            <el-form-item label="体验天数"><el-input-number v-model="config.trialDays" :min="0" :max="30" /></el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">存储配置</span></template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="存储服务"><el-select v-model="config.storageService" style="width:100%;"><el-option label="阿里云OSS" value="aliyun_oss" /><el-option label="腾讯COS" value="tencent_cos" /></el-select></el-form-item>
            <el-form-item label="数据库"><el-input v-model="config.database" disabled /></el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="large" style="width:200px;" @click="handleSave">保存配置</el-button>
    </div>

    <el-dialog v-model="addSubjectVisible" title="添加学科" width="400px">
      <el-input v-model="newSubject" placeholder="输入学科名称" />
      <template #footer>
        <el-button @click="addSubjectVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubject">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const config = reactive({
  systemName: '爱辅学',
  version: '1.0.0',
  maintenance: false,
  registerEnabled: true,
  inviteCodeRequired: false,
  ocrService: 'aliyun',
  aiModel: 'gpt4',
  ttsService: 'azure',
  speechEval: 'iflytek',
  subjects: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'],
  grades: ['小学', '初中', '高中', '大学', '成人'],
  // ========== 已删除：monthlyPrice/quarterlyPrice/yearlyPrice，待ICP许可证下发后恢复 [2026-05-04] ==========
  freeUnlocks: 3,
  trialDays: 7,
  storageService: 'aliyun_oss',
  database: '阿里云RDS MySQL',
})

const addSubjectVisible = ref(false)
const newSubject = ref('')
const addSubject = () => {
  if (newSubject.value && !config.subjects.includes(newSubject.value)) {
    config.subjects.push(newSubject.value)
    newSubject.value = ''
    addSubjectVisible.value = false
    ElMessage.success('学科已添加')
  }
}
const removeSubject = (s: string) => {
  config.subjects = config.subjects.filter(sub => sub !== s)
}
const handleSave = () => {
  ElMessage.success('配置已保存')
}
</script>
