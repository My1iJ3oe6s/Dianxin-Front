<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px"
                size="medium" class="ry_form">
                <el-form-item label="ID" prop="queryParameters.callRecordId">
                    <el-input v-model="queryParams.queryParameters.callRecordId" placeholder="请输入ID" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单ID" prop="queryParameters.orderId">
                    <el-input v-model="queryParams.queryParameters.orderId" placeholder="请输入订单ID" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号" prop="queryParameters.phoneNumber">
                    <el-input v-model="queryParams.queryParameters.phoneNumber" placeholder="请输入手机号" clearable
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
                <el-table-column label="apikey" align="center" prop="apikey" />
                <el-table-column label="平台" align="center" prop="platform" />
                <el-table-column label="商店名称" align="center" prop="shopName" />
                <!-- <el-table-column label="操作" align="center" class-name="small-padding">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleCheck(scope.row, 0)">修改</el-button>
                        <el-popconfirm title="确定删除？" @confirm="handleDelect(scope.row)">
                            <el-button size="mini" type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
    </div>
</template>
  
<script>
import { getList, add, edit, cancelBind, handleDelete } from "@/api/marketing/index";
import { returnName } from "@/utils/index.js";

export default {
    name: "Call",
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
                    callRecordId: '',
                    orderId: ''
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
            this.$router.push({ path: "/call/detail" });
        },
        /** 删除 */
        handleDelect(row) {
            handleDelete(row.callRecordId)
                .then((res) => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
        },
        /** 修改 */
        handleCheck(row) {
            this.$router.push({ path: "/call/detail", query: { id: row.callRecordId } });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.callRecordId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
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
  