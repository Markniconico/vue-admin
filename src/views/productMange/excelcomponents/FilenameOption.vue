<template>
  <div style="display:inline-block; margin-left:10px">
    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input v-model="filename" placeholder="请输入文件名" style="width:150px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
