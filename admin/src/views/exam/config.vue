<template>
  <div>
    <div class="page-header"><h2>考试配置</h2><el-button type="primary" icon="Plus" @click="addVisible = true">添加配置</el-button></div>
    <el-card shadow="never">
      <el-table :data="configs" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="grade" label="学段" width="80" />
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="region" label="适用地区" width="160" />
        <el-table-column label="试卷结构" min-width="260">
          <template #default="{ row }">
            <span v-for="(s, i) in row.sections" :key="i" style="margin-right:12px;font-size:12px;color:#606266;">{{ s.name }}:{{ s.count }}题×{{ s.score }}分</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总分" width="70">
          <template #default="{ row }"><el-tag type="primary" size="small">{{ row.total }}分</el-tag></template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="80">
          <template #default="{ row }">{{ row.duration }}分钟</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/exam/config/${row.id}`)">详情</el-button>
            <el-button type="info" link size="small" @click="handleCopy(row)">复制</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addVisible" title="添加考试配置" width="550px">
      <el-form label-width="80px">
        <el-form-item label="学段">
          <el-select v-model="addForm.grade" style="width:100%;">
            <el-option label="小学" value="小学" /><el-option label="初中" value="初中" /><el-option label="高中" value="高中" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="addForm.subject" style="width:100%;">
            <el-option v-for="s in ['数学','语文','英语','物理','化学','生物']" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区"><el-input v-model="addForm.region" placeholder="如：全国通用" /></el-form-item>
        <el-form-item label="总分"><el-input-number v-model="addForm.total" :min="50" :max="300" /></el-form-item>
        <el-form-item label="时长(分)"><el-input-number v-model="addForm.duration" :min="30" :max="300" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const addVisible = ref(false)
const addForm = ref({ grade: '高中', subject: '数学', region: '', total: 150, duration: 120 })
const handleAdd = () => {
  configs.value.push({
    id: configs.value.length + 1,
    grade: addForm.value.grade, subject: addForm.value.subject,
    region: addForm.value.region || '全国通用',
    sections: [{ name: '选择题', count: 10, score: 3 }],
    total: addForm.value.total, duration: addForm.value.duration,
  })
  addVisible.value = false
  ElMessage.success('配置已添加')
}
const handleCopy = (row: any) => {
  const newConfig = { ...row, id: configs.value.length + 1, region: row.region + '(副本)', sections: [...row.sections] }
  configs.value.push(newConfig)
  ElMessage.success('配置已复制')
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除「${row.grade} ${row.subject} - ${row.region}」配置？`, '删除确认', { type: 'warning' }).then(() => {
    configs.value = configs.value.filter(c => c.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const configs = ref([
  { id: 1, grade: '高中', subject: '数学', region: '全国通用', sections: [{ name: '选择题', count: 12, score: 5 }, { name: '填空题', count: 4, score: 5 }, { name: '解答题', count: 6, score: 12 }], total: 150, duration: 120 },
  { id: 2, grade: '高中', subject: '语文', region: '全国通用', sections: [{ name: '选择题', count: 10, score: 3 }, { name: '文言文', count: 4, score: 5 }, { name: '现代文', count: 3, score: 6 }, { name: '作文', count: 1, score: 60 }], total: 150, duration: 150 },
  { id: 3, grade: '高中', subject: '英语', region: '全国通用', sections: [{ name: '听力', count: 20, score: 1.5 }, { name: '阅读', count: 15, score: 2 }, { name: '完形', count: 15, score: 1 }, { name: '语法', count: 10, score: 1.5 }, { name: '写作', count: 1, score: 25 }], total: 150, duration: 120 },
  { id: 4, grade: '高中', subject: '物理', region: '江苏/上海/浙江', sections: [{ name: '选择题', count: 15, score: 4 }, { name: '填空题', count: 4, score: 5 }, { name: '解答题', count: 4, score: 10 }], total: 120, duration: 100 },
  { id: 5, grade: '高中', subject: '物理', region: '其他省份', sections: [{ name: '选择题', count: 12, score: 4 }, { name: '填空题', count: 3, score: 5 }, { name: '解答题', count: 3, score: 12 }], total: 100, duration: 75 },
  { id: 6, grade: '初中', subject: '数学', region: '江苏/安徽/河南', sections: [{ name: '选择题', count: 12, score: 4 }, { name: '填空题', count: 6, score: 5 }, { name: '解答题', count: 7, score: 10 }], total: 150, duration: 120 },
  { id: 7, grade: '初中', subject: '数学', region: '北京/上海/广东', sections: [{ name: '选择题', count: 10, score: 3 }, { name: '填空题', count: 6, score: 4 }, { name: '解答题', count: 6, score: 9 }], total: 120, duration: 120 },
  { id: 8, grade: '小学', subject: '数学', region: '全国通用', sections: [{ name: '选择题', count: 10, score: 3 }, { name: '填空题', count: 10, score: 2 }, { name: '计算题', count: 5, score: 4 }, { name: '应用题', count: 3, score: 10 }], total: 100, duration: 90 },
])
</script>
