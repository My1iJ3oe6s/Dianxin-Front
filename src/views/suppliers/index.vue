<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px"
                size="medium" class="ry_form">
                <el-form-item label="外部供应商名称" prop="supplierName">
                    <el-input v-model="queryParams.queryParameters.supplierName" placeholder="请输入外部供应商名称" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="外部供应商编码" prop="supplierCode">
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

            <el-table v-loading="loading" border :data="list">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="id" align="center" prop="supplierId" />
                <el-table-column label="外部供应商编码" align="center" prop="supplierCode" />
                <el-table-column label="外部供应商名称" align="center" prop="supplierName" />
                <el-table-column label="联系人" align="center" prop="contactPerson" />
                <el-table-column label="联系电话" align="center" prop="phone" />
                <el-table-column label="邮箱" align="center" prop="email" />
                <el-table-column label="地址" align="center" prop="address" />
                <el-table-column label="开通时间" align="center" prop="activationTime" />
                <el-table-column label="操作" align="center" class-name="small-padding">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleCheck(scope.row, 0)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleConnectProducts(scope.row)">关联产品</el-button>
                        <el-popconfirm title="确定删除？" @confirm="handleDelect(scope.row)">
                            <el-button size="mini" type="text" slot="reference">删除</el-button>
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
    </div>
</template>
  
<script>
import { getList, add, edit, cancelBind, handleDelete } from "@/api/suppliers/index";
import * as productApi from '@/api/product/index';
import { returnName } from "@/utils/index.js";

export default {
    name: "Suppliers",
    data() {
        return {
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
                }
            },
            title: '',
            open: false,
            open1: false,
            conenctData: {},
            productList: [],
            productList: [],
            suppliercode: ''
        };
    },
    activated() {
        this.getList();
    },
    methods: {
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
            this.$router.push({ path: "/suppliers/detail" });
        },
        /** 删除 */
        handleDelect(row) {
            handleDelete(row.supplierId)
                .then((res) => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
        },
        /** 修改 */
        handleCheck(row) {
            this.$router.push({ path: "/suppliers/detail", query: { id: row.supplierId } });
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
    }
};
</script>
<style>
.cell {
    .el-button+span,
    span+span {
        margin-left: 10px;
    }
}
</style>
  