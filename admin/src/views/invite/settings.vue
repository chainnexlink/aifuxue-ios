<template>
  <div>
    <div class="page-header">
      <h2>邀请码设置</h2>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">教师邀请码设置</span></template>
          <el-form :model="teacherSettings" label-width="160px">
            <el-form-item label="邀请码前缀">
              <el-input v-model="teacherSettings.prefix" disabled style="width:200px;" />
            </el-form-item>
            <el-form-item label="邀请码长度（后缀）">
              <el-input-number v-model="teacherSettings.suffixLength" :min="4" :max="8" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">生成格式：TEACHER-XXXXXX</span>
            </el-form-item>
            <el-form-item label="赠送体验天数">
              <el-input-number v-model="teacherSettings.vipDays" :min="1" :max="365" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">教师邀请学生注册后，学生获得的全功能体验天数</span>
            </el-form-item>
            <el-form-item label="每个邀请码使用次数">
              <el-input-number v-model="teacherSettings.maxUses" :min="1" :max="999" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">同一邀请码可被使用的次数（设为1=一次性）</span>
            </el-form-item>
            <el-form-item label="教师自动获取邀请码">
              <el-switch v-model="teacherSettings.autoGenerate" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">教师认证通过后自动生成专属邀请码</span>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">用户邀请码设置</span></template>
          <el-form :model="userSettings" label-width="160px">
            <el-form-item label="邀请码前缀">
              <el-input v-model="userSettings.prefix" disabled style="width:200px;" />
            </el-form-item>
            <el-form-item label="赠送体验天数">
              <el-input-number v-model="userSettings.vipDays" :min="1" :max="365" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">用户邀请好友注册后，好友获得的全功能体验天数</span>
            </el-form-item>
            <el-form-item label="邀请者奖励体验天数">
              <el-input-number v-model="userSettings.inviterReward" :min="0" :max="365" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">邀请成功后，邀请者自己获得的全功能体验天数奖励</span>
            </el-form-item>
            <el-form-item label="每个账号只能用一次">
              <el-switch v-model="userSettings.oneTimePerAccount" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">同一账号只能使用一次邀请码</span>
            </el-form-item>
            <el-form-item label="活跃用户自动获取">
              <el-switch v-model="userSettings.vipAutoGenerate" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">活跃用户自动获得专属邀请码</span>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">通用设置</span></template>
          <el-form :model="generalSettings" label-width="160px">
            <el-form-item label="邀请码默认有效期">
              <el-input-number v-model="generalSettings.defaultExpireDays" :min="1" :max="365" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">天</span>
            </el-form-item>
            <el-form-item label="邀请码功能开关">
              <el-switch v-model="generalSettings.enabled" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">关闭后所有邀请码将无法使用</span>
            </el-form-item>
            <el-form-item label="注册页面显示">
              <el-switch v-model="generalSettings.showOnRegister" />
              <span style="margin-left:8px;color:#909399;font-size:13px;">在注册页面显示邀请码输入框</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">设置说明</span></template>
          <div class="help-section">
            <h4>获客流程</h4>
            <div class="flow-steps">
              <div class="flow-step"><span class="fs-num">1</span><span>教师分享邀请码</span></div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step"><span class="fs-num">2</span><span>学生注册使用邀请码</span></div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step"><span class="fs-num">3</span><span>学生获得全功能体验期</span></div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step"><span class="fs-num">4</span><span>体验到期 → 广告解锁</span></div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step"><span class="fs-num">5</span><span>活跃学生分享邀请码</span></div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step"><span class="fs-num">6</span><span>病毒式传播</span></div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">快速操作</span></template>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <el-button type="primary" style="width:100%;" @click="handleSave">保存设置</el-button>
            <el-button style="width:100%;" @click="handleReset">恢复默认</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const teacherSettings = ref({
  prefix: 'TEACHER-', suffixLength: 6, vipDays: 30, maxUses: 1, autoGenerate: true,
})

const userSettings = ref({
  prefix: 'USER-', vipDays: 7, inviterReward: 3, oneTimePerAccount: true, vipAutoGenerate: true,
})

const generalSettings = ref({
  defaultExpireDays: 90, enabled: true, showOnRegister: true,
})

function handleSave() {
  ElMessage.success('设置保存成功')
}

function handleReset() {
  ElMessageBox.confirm('确定恢复默认设置？', '恢复默认', { type: 'warning' }).then(() => {
    teacherSettings.value = { prefix: 'TEACHER-', suffixLength: 6, vipDays: 30, maxUses: 1, autoGenerate: true }
    userSettings.value = { prefix: 'USER-', vipDays: 7, inviterReward: 3, oneTimePerAccount: true, vipAutoGenerate: true }
    generalSettings.value = { defaultExpireDays: 90, enabled: true, showOnRegister: true }
    ElMessage.success('已恢复默认设置')
  }).catch(() => {})
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; }
.help-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 16px; }
.flow-steps { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.flow-step { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: #f5f7fa; border-radius: 8px; width: 100%; }
.fs-num { width: 24px; height: 24px; border-radius: 50%; background: #409eff; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.flow-arrow { color: #c0c4cc; font-size: 16px; }
</style>
