<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px"
                size="small" class="ry_form">
                <el-form-item label="外部供应商名称" prop="queryParameters.supplierName">
                    <el-input v-model="queryParams.queryParameters.supplierName" placeholder="请输入外部供应商名称" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="外部供应商编码" prop="queryParameters.supplierCode">
                    <el-input v-model="queryParams.queryParameters.supplierCode" placeholder="请输入外部供应商编码" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item class="flex_one tr">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                </el-col>
            </el-row>

            <el-table :key="tableHeight" :height="tableHeight" v-loading="loading" :data="list">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="id" align="center" prop="supplierId" />
                <el-table-column label="外部供应商编码" align="center" prop="supplierCode" />
                <el-table-column label="外部供应商名称" align="center" prop="supplierName" />
                <el-table-column label="联系人" align="center" prop="contactPerson" />
                <el-table-column label="联系电话" align="center" prop="phone" />
                <el-table-column label="邮箱" align="center" prop="email" />
                <el-table-column label="地址" align="center" prop="address" />
                <el-table-column label="文档" align="center" prop="docUrl">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="handleDownLoad(scope.row.docUrl)">下载</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="开通时间" align="center" prop="activationTime" />
                <el-table-column label="操作" align="center" width="200" class-name="small-padding">
                    <template slot-scope="scope">
                        <el-link :underline="false" type="primary" @click="handleCheck(scope.row, 0)">修改</el-link>
                        <el-link :underline="false" type="primary" @click="handleConnectProducts(scope.row)">关联产品</el-link>
                        <el-popconfirm title="确定删除？" @confirm="handleDelect(scope.row)">
                            <el-link :underline="false" type="primary" slot="reference">删除</el-link>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain size="mini" @click="handleCancelBindMutil">批量解除</el-button>
                </el-col>
            </el-row>
            <el-table :data="productList" border @selection-change="handleSelectionChange" v-loading="loading1">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="产品ID" align="center" prop="productId" />
                <el-table-column label="产品名称" align="center" prop="productName" />
                <el-table-column label="产品编码" align="center" prop="productCode" />
                <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleCancelBind({
                            suppliercode: scope.row.suppliercode,
                            productIds: [scope.row.productId]
                        })">解除绑定</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-drawer custom-class="drawer-container" size="40%" :visible.sync="open2" append-to-body>
            <template #title>
                <div style="font-size: 20px; text-align: center; color: #606266">
                    {{ form.supplierId ? '修改' : '新增' }}供应商
                </div>
            </template>
            <el-form class="form-container" ref="form" :model="form" :rules="rules" label-width="150px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="外部供应商名称" prop="supplierName">
                            <el-input v-model="form.supplierName" placeholder="请输入外部供应商名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="外部供应商编码" prop="supplierCode">
                            <el-input v-model="form.supplierCode" placeholder="请输入外部供应商编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="联系人" prop="contactPerson">
                            <el-input v-model="form.contactPerson" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="公共配置" prop="devConfig">
                            <el-input class="multi-line-placeholder" type="textarea" v-model="form.devConfig"
                                placeholder="请输入公共配置"></el-input>
                        </el-form-item>
                        <div class="example">
                            示例：<br />key:value<br />key:value
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="文档" prop="docUrl">
                            <el-upload ref="upload" :action="upload.url + '?updateSupport=' + upload.updateSupport"
                                :limit="1" :file-list="form.docUrlData" v-model="form.docUrl"
                                :on-success="handleFileSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="draw-footer">
                    <el-button :loading="formLoading" type="primary" @click="submitForm" v-if="!isReadonly">确 定</el-button>
                    <el-button @click="cancel2">取 消</el-button>
                </div>
            </el-form>
        </el-drawer>
    </div>
</template>
  
<script>
import { getList, add, edit, cancelBind, handleDelete, getInfo } from "@/api/suppliers/index";
import * as productApi from '@/api/product/index';
import { returnName } from "@/utils/index.js";
import { prodTypeData } from '@/utils/printData';
import { getToken } from "@/utils/auth";

export default {
    name: "Suppliers",
    data() {
        return {
            prodTypeData,
            formLoading: false,
            open2: false,
            form: {

            },
            rules: {
                supplierName: [{ required: true, message: "外部供应商名称必填", trigger: "blur" }],
                supplierCode: [{ required: true, message: "外部供应商编码必填", trigger: "blur" }],
            },
            isEdit: false,
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "file/upload",
            },
            // 遮罩层
            loading: false,
            loading1: false,
            // 导出遮罩层
            exportLoading: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 商品信息表格数据
            list: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                queryParameters: {
                    supplierName: '',
                    supplierCode: ''
                }
            },
            title: '',
            open: false,
            open1: false,
            conenctData: {},
            productList: [],
            productList: [],
            suppliercode: '',
            height: 400
        };
    },
    activated() {
        this.getList();
    },
    mounted() {
        this.calcHeight();
        window.onresize = () => {
            this.calcHeight();
        };
    },
    beforeDestroy() {
        window.onresize = null;
    },
    watch: {
        open2: {
            handler(val) {
                if (!val) {
                    this.form = {
                        productionStatus: '1',
                        isNumbered: '0',
                        checkIdentity: '0',
                        configParam: {}
                    };
                    this.isEdit = false;
                    this.isReadonly = false;
                }
            }
        }
    },
    methods: {
        calcHeight() {
            this.tableHeight = document.documentElement.clientHeight - 380;
        },
        handleStatusChange(row) { },
        returnNameData(list, target, value, name) {
            return returnName(list, target, value, name);
        },
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    add(this.form)
                        .then((response) => {
                            this.open = false;
                            this.getList();
                        })
                }
            });
        },
        cancel() {
            this.open = false;
        },
        /** 查询商品信息列表 */
        getList() {
            this.loading = true;
            const { pageNum, pageSize } = this.queryParams;
            const pageReq = { pageNo: pageNum, pageSize: pageSize };
            const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined, ...pageReq };
            getList(query).then(response => {
                const { records, total } = response.data
                this.list = records;
                this.total = total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open2 = true;
        },
        /** 删除 */
        handleDelect(row) {
            handleDelete(row.supplierId)
                .then((res) => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
        },
        /** 下载文件 */
        handleDownLoad(url) {
            window.open(url);
        },
        /** 修改 */
        handleCheck(row, target) {
            const id = row.productId;

            this.openAddForm(row, target)
        },
        getConnectProduct(row, fn) {
            console.log(row)
            productApi.getList({
                pageNo: 1,
                pageSize: 10,
                queryParameters: {
                    supplierCode: row.supplierCode
                }
            }).then((res) => {
                const { records, total } = res.data
                this.productList = records;
                fn && fn()
            })

        },
        handleConnectProducts(row) {
            this.getConnectProduct(row, () => {
                this.title = '关联产品查看'
                this.open = true;
            })
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.productId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 解除绑定 */
        handleCancelBindMutil(row) {
            if (this.ids.length) {
                this.handleCancelBind({
                    suppliercode: this.suppliercode,
                    productIds: this.ids
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择要解除绑定的产品'
                })
            }
        },
        handleCancelBind(data) {
            this.loading1 = true
            cancelBind(data)
                .then((res) => {
                    this.loading1 = false
                    this.getConnectProduct(data)
                })
        },

        openAddForm(row, target) {
            this.open2 = true;
            const { supplierId } = row;
            this.isReadonly = target == 1 ? true : false;
            if (supplierId) {
                this.isEdit = true;
                this.queryDetail(supplierId)
            }
        },

        handleFileSuccess(res) {
            const { url, name } = res.data;
            this.form.docUrlData = [{ name: name, url: url }];
            this.form.docUrl = url;
        },
        cancel2() {
            this.open2 = false;
        },
        queryDetail(id) {
            this.formLoading = true;
            getInfo(id).then((res) => {
                const { data } = res;
                data.docUrlData = data.docUrl && [{ name: data.docUrl, url: data.docUrl }]
                this.form = data
                this.formLoading = false;
            });
        },
        submitForm() {
            this.$refs["form"].validate((valid, a) => {
                if (valid) {
                    this.formLoading = true;
                    if (this.form.supplierId) {
                        edit(this.form).then((response) => {
                            this.formLoading = false;
                            this.cancel2();
                            this.getList();
                        })
                            .catch(() => {
                                this.formLoading = false;
                            });
                    } else {
                        add(this.form).then((response) => {
                            this.formLoading = false;
                            this.cancel2();
                            this.getList();
                        })
                            .catch(() => {
                                this.formLoading = false;
                            });

                    }
                }
            })
        },
    }
};
</script>
<style scoped lang="scss">
.cell {

    .el-button+span,
    span+span {
        margin-left: 10px;
    }
}


::v-deep .drawer-container {
    padding: 10px 40px;
    display: flex;

    .form-container {
        margin-bottom: 70px;
    }

    .draw-footer {
        height: 60px;
        text-align: right;
        position: absolute;
        /* position: fixed; */
        bottom: -8px;
        right: 60px;
        background: #fff;
        width: 100%;
        z-index: 9;
    }
}

::v-deep .el-drawer__body {
    overflow: unset;
    overflow-y: auto;
}

.example{
    color: #ccc;
    padding-left: 150px;
    margin-top: -10px;
    margin-bottom: 10px;
}
</style>
  