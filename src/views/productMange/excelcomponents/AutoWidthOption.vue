<template>
    <div style="display:inline-block; margin: 10px 10px 0;">
        <label class="radio-label">宽度自适应:</label>
        <el-switch v-model="autoWidth" active-text="是" inactive-text="否"></el-switch>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        autoWidth: {
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
