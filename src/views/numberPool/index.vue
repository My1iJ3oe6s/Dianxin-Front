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
            <div v-if="phoneList.length">
                <div class="phone_box">
                    <div v-for="(item, i) in phoneList">
                        <el-tag :type="item.status == 0?'info':'success'">{{ item.number }}</el-tag>
                    </div>
                </div>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" :pageSizes="[100]" @pagination="getPhone" />
            </div>
            <div v-else>
                <div class="no_data">暂无数据</div>
            </div>

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
                // this.phoneList = [
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 1,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                //     {
                //         "poolId": 1,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "1232134124"
                //     },
                //     {
                //         "poolId": 2,
                //         "poolName": "号池1",
                //         "startDate": "2024-05-19 16:00:00",
                //         "endDate": "2024-05-19 16:00:00",
                //         "status": 0,
                //         "createdAt": "2024-05-20 15:04:49",
                //         "updatedAt": "2024-05-20 15:04:49",
                //         "createdBy": null,
                //         "deleted": 0,
                //         "number": "345345345"
                //     },
                // ]
                this.total = res.data.total;
            })
        },
    }
};
</script>
<style lang="scss">
.no_data {
    text-align: center;
    font-size: 30px;
    color: #ccc;
    margin: 200px 0;
}

.phone_box {
    // border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;

    .used {
        // color: #ccc;
    }

    >div {
        display: inline-block;
        vertical-align: middle;
        padding: 12px 0;
        text-align: center;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        width: 10%;

        &:nth-of-type(1),
        &:nth-of-type(2),
        &:nth-of-type(3),
        &:nth-of-type(4),
        &:nth-of-type(5),
        &:nth-of-type(6),
        &:nth-of-type(7),
        &:nth-of-type(8),
        &:nth-of-type(9),
        &:nth-of-type(10) {
            border-top: 1px solid #ccc;
        }
    }
}
</style>