<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm1" :inline="true" v-show="showSearch" label-width="100px"
                size="medium" class="ry_form">
                <el-form-item label="号池" prop="poolName">
                    <el-select v-model="queryParams.queryParameters.poolName" placeholder="请选择号池" clearable size="small">
                        <el-option v-for="item in list" :key="item.poolName" :label="item.poolName"
                            :value="item.poolName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="queryParams.queryParameters.phone" placeholder="手机号" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item class="flex_one tr">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getPhone">搜索</el-button>
                    <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="phoneList">
                <el-table-column label="手机号" align="center" key="number" prop="number" />
                <el-table-column label="创建时间" align="center" key="createdAt" prop="createdAt" />
                <el-table-column label="状态" align="center" key="status" prop="status" />
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getPhone" />
        </div>
    </div>
</template>
  
<script>
import {
    getList, getPhoneList
} from "@/api/numberPool/index";
import { dict } from '@/utils'

export default {
    name: "NumberTool",
    data() {
        return {
            dict,
            // 遮罩层
            loading: true,
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
            // 用户表格数据
            list: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            queryParams: {
                pageNo: 0,
                pageSize: 10,
                queryParameters: {
                    poolName: ''
                }
            },
            phoneList: []
        };
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询列表 */
        getList() {
            getList().then(response => {
                this.list = response.data
            });
        },
        handleQuery(event) {
            event.preventDefault();
            this.getList();
        },
        handleCheck() {
            this.getPhone();
            this.open = true;
            this.title = '号码列表';
        },
        getPhone() {
            getPhoneList(this.queryParams).then((res) => {
                this.phoneList = res.data.records;
                this.total = res.data.total;
            })
        },
    }
};
</script>