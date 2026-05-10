<template>
  <view class="page">
    <view class="form-card">
      <text class="form-title">教材与教学信息</text>
      <text class="form-desc">填写教学信息后可使用AI智能出卷功能</text>

      <view class="form-group">
        <text class="form-label">所在地区</text>
        <view class="row-picker">
          <picker mode="selector" :range="provinces" @change="form.province = provinces[$event.detail.value]">
            <view class="form-picker half"><text :class="{ placeholder: !form.province }">{{ form.province || '选择省份' }}</text><text class="picker-arrow">▾</text></view>
          </picker>
          <picker mode="selector" :range="cities" @change="form.city = cities[$event.detail.value]">
            <view class="form-picker half"><text :class="{ placeholder: !form.city }">{{ form.city || '选择城市' }}</text><text class="picker-arrow">▾</text></view>
          </picker>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">学段</text>
        <view class="chip-row">
          <view v-for="s in stages" :key="s" class="chip" :class="{ active: form.stage === s }" @tap="form.stage = s; form.grade = ''">
            <text>{{ s }}</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">年级</text>
        <picker mode="selector" :range="gradeOptions" @change="form.grade = gradeOptions[$event.detail.value]">
          <view class="form-picker"><text :class="{ placeholder: !form.grade }">{{ form.grade || '选择年级' }}</text><text class="picker-arrow">▾</text></view>
        </picker>
      </view>

      <view class="form-group">
        <text class="form-label">学科</text>
        <picker mode="selector" :range="subjects" @change="form.subject = subjects[$event.detail.value]">
          <view class="form-picker"><text :class="{ placeholder: !form.subject }">{{ form.subject || '选择学科' }}</text><text class="picker-arrow">▾</text></view>
        </picker>
      </view>

      <view class="form-group">
        <text class="form-label">教材版本</text>
        <picker mode="selector" :range="textbooks" @change="onTextbookChange($event.detail.value)">
          <view class="form-picker"><text :class="{ placeholder: !form.textbook }">{{ form.textbook || '选择教材版本' }}</text><text class="picker-arrow">▾</text></view>
        </picker>
        <input v-if="form.textbook === '其他（自定义）'" class="form-input" v-model="form.customTextbook" placeholder="请输入教材版本名称" style="margin-top:12rpx;" />
      </view>

      <view class="form-group">
        <text class="form-label">当前教学进度</text>
        <picker mode="selector" :range="chapters" @change="form.chapter = chapters[$event.detail.value]">
          <view class="form-picker"><text :class="{ placeholder: !form.chapter }">{{ form.chapter || '选择章节' }}</text><text class="picker-arrow">▾</text></view>
        </picker>
        <text class="form-hint">也可自定义输入（优先级最高）</text>
        <input class="form-input" v-model="form.customProgress" placeholder="如：第三章第2节 一元二次方程" style="margin-top:12rpx;" />
      </view>
    </view>

    <view class="submit-btn" @tap="handleSave">
      <text class="submit-text">保存设置</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const stages = ['小学', '初中', '高中']
const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '山东', '河南', '湖南']
const cities = ['请先选择省份']
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']
const textbooks = ['人教版', '北师大版', '苏教版', '沪教版', '浙教版', '鲁教版', '冀教版', '其他（自定义）']

const form = ref({
  province: '', city: '', stage: '', grade: '', subject: '',
  textbook: '', customTextbook: '', chapter: '', customProgress: '',
})

const gradeOptions = computed(() => {
  if (form.value.stage === '小学') return ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
  if (form.value.stage === '初中') return ['初一', '初二', '初三']
  if (form.value.stage === '高中') return ['高一', '高二', '高三']
  return []
})

const chapters = computed(() => {
  if (!form.value.subject || !form.value.grade) return ['请先选择学科和年级']
  return [
    '第一章 基础概念', '第二章 基本运算', '第三章 应用拓展',
    '第四章 综合练习', '第五章 复习巩固', '第六章 期末总复习',
  ]
})

function onTextbookChange(idx: number) {
  form.value.textbook = textbooks[idx]
  if (form.value.textbook !== '其他（自定义）') form.value.customTextbook = ''
}

function handleSave() {
  if (!form.value.province || !form.value.stage || !form.value.grade || !form.value.subject) {
    uni.showToast({ title: '请完善必填信息', icon: 'none' }); return
  }
  if (!form.value.textbook) { uni.showToast({ title: '请选择教材版本', icon: 'none' }); return }
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.form-card { background: var(--c-card); border-radius: 24rpx; padding: 32rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.form-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.form-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 28rpx; }
.form-group { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.form-input { background: #242838; border-radius: 14rpx; padding: 24rpx; font-size: 28rpx; color: var(--c-t1); width: 100%; box-sizing: border-box; }
.form-picker { background: #242838; border-radius: 14rpx; padding: 24rpx; display: flex; justify-content: space-between; font-size: 28rpx; color: var(--c-t1); }
.form-picker.half { flex: 1; }
.placeholder { color: var(--c-t3); }
.picker-arrow { color: var(--c-t3); }
.form-hint { font-size: 22rpx; color: var(--c-t3); display: block; margin-top: 8rpx; }
.row-picker { display: flex; gap: 12rpx; }
.chip-row { display: flex; gap: 12rpx; flex-wrap: wrap; }
.chip { padding: 14rpx 28rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 26rpx; color: var(--c-t2); }
.chip.active { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; }
.submit-text { font-size: 32rpx; font-weight: 700; color: #FFF; }
</style>
