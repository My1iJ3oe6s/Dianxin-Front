<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px"
                size="medium" class="ry_form">
                <el-form-item label="外部供应商名称" prop="supplierName">
                    <el-input v-model="queryParams.queryParameters.supplierName" placeholder="请输入外部供应商名称" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="外部供应商编码" prop="supplierCode">
                    <el-input v-model="queryParams.queryParameters.supplierCode" placeholder="请输入外部供应商编码" clearable size="small"
                        @keyup.enter.native="handleQuery" />
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
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
    </div>
</template>
  
<script>
import { getList, add, edit, handleDelete } from "@/api/suppliers/index";
import { returnName } from "@/utils/index.js";

export default {
    name: "Suppliers",
    data() {
        return {
            // 遮罩层
            loading: true,
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
                pageNum: 0,
                pageSize: 10,
                queryParameters: {
                }
            },
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
            const pageReq = { pageNo: pageNum - 1, pageSize: pageSize };
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
            this.$router.push({ path: "/goods/detail" });
        },
    }
};
</script>
  