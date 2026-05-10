<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push('/system/logs')">返回日志</el-button><h2 style="margin:0;">日志详情 #{{ logId }}</h2></div></div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">操作详情</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="日志ID">{{ log.id }}</el-descriptions-item>
            <el-descriptions-item label="操作模块"><el-tag>{{ log.module }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="操作类型"><el-tag :type="{create:'success',update:'warning',delete:'danger',login:'primary',export:'info'}[log.type] as any">{{ log.typeName }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="操作人">{{ log.operator }}</el-descriptions-item>
            <el-descriptions-item label="操作时间">{{ log.time }}</el-descriptions-item>
            <el-descriptions-item label="IP地址">{{ log.ip }}</el-descriptions-item>
            <el-descriptions-item label="操作结果"><el-tag :type="log.success ? 'success' : 'danger'" size="small">{{ log.success ? '成功' : '失败' }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="耗时">{{ log.duration }}ms</el-descriptions-item>
            <el-descriptions-item label="操作描述" :span="2">{{ log.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;"><template #header><span style="font-weight:600;">请求/响应详情</span></template>
          <el-tabs>
            <el-tab-pane label="请求参数">
              <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;overflow-x:auto;">{{ JSON.stringify(log.requestParams, null, 2) }}</pre>
            </el-tab-pane>
            <el-tab-pane label="响应数据">
              <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;overflow-x:auto;">{{ JSON.stringify(log.responseData, null, 2) }}</pre>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">设备信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="浏览器">{{ log.browser }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ log.os }}</el-descriptions-item>
            <el-descriptions-item label="User-Agent">{{ log.userAgent }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute(); const logId = Number(route.params.id)
const log = reactive({
  id: logId, module: '用户管理', type: 'update', typeName: '编辑', operator: '管理员',
  time: '2026-05-03 14:30:15', ip: '192.168.1.100', success: true, duration: 128,
  description: '修改用户"小明"的学段从"初中"改为"高中"',
  requestParams: { userId: 1, field: 'gradeLevel', oldValue: 'JUNIOR', newValue: 'SENIOR' },
  responseData: { code: 200, message: 'success', data: { id: 1, gradeLevel: 'SENIOR' } },
  browser: 'Chrome 120', os: 'Windows 11', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
})
</script>
