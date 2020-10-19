<template>
    <div class="form-container">
        <el-form
            ref="dataForm"
            :model="temp"
            :rules="rules"
            label-position="left"
            label-width="100px"
            style="width: 500px; margin-left:50px;"
        >
            <el-form-item label="产品名称" prop="name">
                <el-input v-model="temp.name" />
            </el-form-item>

            <el-form-item label="产品类型" prop="type">
                <el-select v-model="temp.type" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in productClassOptions"
                        :key="index"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="发布日期" prop="time">
                <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择日期" />
            </el-form-item>

            <el-form-item label="价格" prop="price">
                <el-input type="price" v-model.number="temp.price" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="产品logo" prop="logo">
                <div class="currentLogo" v-if="currentLogo">
                    <span>当前logo:</span>
                    <img :src="temp.dialogImageUrl" alt="logo" />
                </div>
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="temp.dialogVisible">
                    <img width="100%" :src="temp.dialogImageUrl" alt />
                </el-dialog>
            </el-form-item>

            <el-form-item label="产品简要">
                <el-input
                    v-model="temp.content"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入内容！"
                />
            </el-form-item>

            <el-form-item label="已售数量">
                <el-input v-model="temp.count" disabled></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="cancle">取消</el-button>
                <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { fetchProductClass, fetchProduct, createProduct, updateProduct } from '@/api/product'
export default {
    data() {
        return {
            isEdit: false,
            temp: {
                name: '',
                type: '',
                content: '',
                time: '',
                price: '',
                count: 0,
                dialogImageUrl: '',
                dialogVisible: false
            },
            productClassOptions: [],
            currentLogo: false,
            rules: {
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                time: [{ required: true, message: '请选择日期', trigger: 'change' }],
                price: [{ required: true, message: '价格不能为空' }, { type: 'number', message: '价格必须为数字值' }],
            },
        }
    },
    created() {
        fetchProductClass().then(response => {
            this.productClassOptions = response.data
        })
        const id = this.$route.params && this.$route.params.id
        if (id) {
            this.isEdit = true
            this.currentLogo = true
            fetchProduct(id).then(response => {
                let result = response.data
                this.temp.name = result.product_name
                this.temp.type = result.product_type
                this.temp.dialogImageUrl = result.image_url
                this.temp.content = result.content
                this.temp.time = result.display_time
                this.temp.price = result.price
                this.temp.count = result.count
            })
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                let data = this.temp
                if (valid) {
                    if (this.isEdit) {
                        updateProduct(data).then(response => {
                            this.$notify({
                                title: 'Success',
                                message: '成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.$router.push('/productMange/list')
                        })
                    }else{
                        createProduct(data).then(response =>{
                            this.$notify({
                                title: 'Success',
                                message: '成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.$router.push('/productMange/list')
                        })
                    }
                } else {
                    this.$notify({
                                title: 'Failed',
                                message: '提交失败',
                                type: 'error',
                                duration: 2000
                            })
                    return false;
                }
            });
        },
        cancle() {
            this.$router.go(-1)
        },
        handleRemove(file, fileList) {

        },
        handlePictureCardPreview(file) {
            this.temp.dialogImageUrl = file.url;
            this.temp.dialogVisible = true;
        }
    }
}
</script>
<style lang="scss" scoped>
.form-container {
    padding-top: 20px;
}
.currentLogo {
    width: 100px;
    color: rgb(0, 214, 252);
    img {
        width: 100%;
    }
}
</style>