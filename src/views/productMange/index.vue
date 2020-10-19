<template>
    <div class="app-container">
        <div class="caozuo">
            <div>
                <el-button type="primary" @click="addProduct">添加产品</el-button>
                <div v-permission="['admin']">
                    <FilenameOption v-model="filename" />
                    <AutoWidthOption v-model="autoWidth" />
                    <BookTypeOption v-model="bookType" />
                    <el-button
                        style="margin:0 0 20px 40px;"
                        type="primary"
                        icon="el-icon-document"
                        @click="handleDownload"
                    >导出excel</el-button>
                </div>
            </div>
        </div>
        <!-- Note that row-key is necessary to get a correct row order. -->
        <el-table
            ref="dragTable"
            v-loading="listLoading"
            :data="list"
            row-key="id"
            border
            fit
            highlight-current-row
            style="width: 100%"
        >
            <el-table-column align="center" label="ID" width="65">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column width="110px" align="center" label="产品名称">
                <template slot-scope="{row}">
                    <span>{{ row.product_name }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="产品分类" width="95">
                <template slot-scope="{row}">
                    <span>{{ row.product_type }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="产品Logo">
                <template slot-scope="{row}">
                    <img :src="row.image_url" alt="Logo" />
                </template>
            </el-table-column>

            <el-table-column min-width="150px" label="简要" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.content }}</span>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="发布日期">
                <template slot-scope="{row}">
                    <span>{{ row.display_time | timeFilter('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="价格" width="65">
                <template slot-scope="{row}">
                    <span>￥{{ row.price }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="已售数量(件)" width="110">
                <template slot-scope="{row}">
                    <span>{{ row.count }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                align="center"
                width="150px"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="{row,$index}">
                    <router-link :to="'/productMange/edit/'+row.id">
                        <el-button type="primary" size="mini">修改</el-button>
                    </router-link>
                    <el-button
                        v-if="row.status!='deleted'"
                        size="mini"
                        type="danger"
                        @click="handleDelete(row,$index)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
        />
    </div>
</template>

<script>
import { fetchList } from '@/api/product'
import { parseTime } from '@/utils/index'
import Sortable from 'sortablejs'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FilenameOption from './excelcomponents/FilenameOption'
import AutoWidthOption from './excelcomponents/AutoWidthOption'
import BookTypeOption from './excelcomponents/BookTypeOption'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
    name: 'DragTable',
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10
            },
            sortable: null,
            filename: '',
            autoWidth: true,
            bookType: 'xlsx'
        }
    },
    filters: {
        timeFilter: parseTime
    },
    directives: { permission },
    components: { Pagination, FilenameOption, AutoWidthOption, BookTypeOption },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
            this.listLoading = true
            const { data } = await fetchList(this.listQuery)
            this.list = data.items
            this.total = data.total
            this.listLoading = false
            this.$nextTick(() => {
                this.setSort()
            })
        },
        handleDelete(row, index) {
            this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 2000
            })
            this.list.splice(index, 1)
        },
        setSort() {
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: function (dataTransfer) {
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                    dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                    this.list.splice(evt.newIndex, 0, targetRow)
                }
            })
        },
        addProduct() {
            this.$router.push('/productMange/create')
        },
        handleDownload() {
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['ID', '产品名称', '产品分类', '产品logo', '简要', '发布日期', '价格', '已售数量']
                const filterVal = ['id', 'product_name', 'product_type', 'image_url', 'content', 'display_time', 'price', 'count']
                const list = this.list
                const data = this.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: this.autoWidth,
                    bookType: this.bookType
                })
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                    return parseTime(v[j])
                } else {
                    return v[j]
                }
            }))
        }
    }
}
</script>

<style>
img {
    width: 100%;
}
.sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
    margin-right: 2px;
}
.drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
}
.show-d {
    margin-top: 15px;
}

.caozuo div {
    float: right;
    margin-bottom: 3px;
}
</style>
