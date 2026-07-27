<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="系统订单号">
        <el-input v-model="queryParams.merchantOrderNo" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商订单号">
        <el-input v-model="queryParams.supplierOrderNo" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.productNo" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="匹配状态">
        <el-select v-model="queryParams.matchStatus" clearable placeholder="全部">
          <el-option label="待匹配" :value="0" /><el-option label="已匹配" :value="1" />
          <el-option label="未找到" :value="2" /><el-option label="多条匹配" :value="3" />
          <el-option label="处理失败" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="退订时间">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['stockorder:unsubscribeRecord:rematch']"
          type="warning"
          plain
          size="mini"
          icon="el-icon-refresh-right"
          @click="rematch"
        >
          重新匹配异常数据
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="rows">
      <el-table-column label="系统订单号" prop="merchantOrderNo" min-width="180" />
      <el-table-column label="渠道订单号" prop="externalOrderNo" min-width="160" show-overflow-tooltip />
      <el-table-column label="供应商订单号" prop="supplierOrderNo" min-width="160" />
      <el-table-column label="手机号" prop="productNo" width="120" />
      <el-table-column label="产品名称" prop="productName" min-width="150" show-overflow-tooltip />
      <el-table-column label="订购时间" prop="supplierCreateTime" width="165" />
      <el-table-column label="退订时间" prop="unsubscribeTime" width="165" />
      <el-table-column label="匹配状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.matchStatus === 1 ? 'success' : 'warning'">
            {{ matchText(row.matchStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" prop="matchMessage" min-width="210" show-overflow-tooltip />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listUnsubscribeRecords, rematchUnsubscribeRecords } from '@/api/stockorder/unsubscribe'

export default {
  name: 'UnsubscribeRecord',
  data() {
    return {
      loading: false, rows: [], total: 0, dateRange: [],
      queryParams: { pageNum: 1, pageSize: 10, supplierCode: 'YUYUYUAN',
        merchantOrderNo: undefined, supplierOrderNo: undefined, productNo: undefined,
        matchStatus: undefined, unsubscribeStartTime: undefined, unsubscribeEndTime: undefined }
    }
  },
  created() { this.getList() },
  methods: {
    getList() {
      this.loading = true
      const query = { ...this.queryParams }
      query.unsubscribeStartTime = this.dateRange && this.dateRange[0]
      query.unsubscribeEndTime = this.dateRange && this.dateRange[1]
      listUnsubscribeRecords(query).then(r => {
        this.rows = r.rows; this.total = r.total
      }).finally(() => { this.loading = false })
    },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.dateRange = []; this.resetForm('queryForm'); this.handleQuery() },
    rematch() {
      this.$modal.confirm('确认重新匹配最近的异常退订数据？').then(() =>
        rematchUnsubscribeRecords(500)
      ).then(r => { this.$modal.msgSuccess(r.msg); this.getList() }).catch(() => {})
    },
    matchText(v) {
      return ({ 0: '待匹配', 1: '已匹配', 2: '未找到', 3: '多条匹配', 4: '处理失败' })[v] || '未知'
    }
  }
}
</script>
