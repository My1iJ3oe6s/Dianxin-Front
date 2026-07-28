<template>
  <div class="app-container">
    <div class="filter-container">
    <el-form ref="queryForm" :model="queryParams" label-width="110px" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="系统订单号">
        <el-input v-model="queryParams.merchantOrderNo" style="width: 240px" placeholder="请输入系统订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商订单号">
        <el-input v-model="queryParams.supplierOrderNo" style="width: 240px" placeholder="请输入供应商订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.productNo" style="width: 240px" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="匹配状态">
        <el-select v-model="queryParams.matchStatus" style="width: 240px" clearable placeholder="全部">
          <el-option label="待匹配" :value="0" /><el-option label="已匹配" :value="1" />
          <el-option label="未找到" :value="2" /><el-option label="多条匹配" :value="3" />
          <el-option label="处理失败" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="退订时间">
        <el-date-picker
          style="width: 360px"
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
    </div>
    <div class="table-container">
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
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['stockorder:unsubscribeRecord:export']"
          type="warning"
          plain
          size="mini"
          icon="el-icon-download"
          @click="handleExport"
        >
          导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>
    <el-table v-loading="loading" :data="rows">
      <el-table-column type="expand" width="48">
        <template slot-scope="{ row }">
          <el-descriptions class="order-detail" title="完整订单信息" :column="4" border size="small">
            <el-descriptions-item label="系统订单号">{{ row.merchantOrderNo }}</el-descriptions-item>
            <el-descriptions-item label="分销商订单号">{{ row.externalOrderNo }}</el-descriptions-item>
            <el-descriptions-item label="分销商编码">{{ row.distributorCode }}</el-descriptions-item>
            <el-descriptions-item label="客户手机号">{{ row.phone }}</el-descriptions-item>
            <el-descriptions-item label="省市">{{ [row.province, row.cityName].filter(Boolean).join(' ') }}</el-descriptions-item>
            <el-descriptions-item label="城市编码">{{ row.cityCode }}</el-descriptions-item>
            <el-descriptions-item label="短信验证码">{{ row.smsNum }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">{{ row.orderStatus }}</el-descriptions-item>
            <el-descriptions-item label="商品编码">{{ row.goodsCode }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{ row.goodsName }}</el-descriptions-item>
            <el-descriptions-item label="商品明细ID">{{ row.goodsDetailId }}</el-descriptions-item>
            <el-descriptions-item label="工号">{{ row.gongHao }}</el-descriptions-item>
            <el-descriptions-item label="供应商商品编码">{{ row.supplierGoodsCode }}</el-descriptions-item>
            <el-descriptions-item label="供应商商品明细编码">{{ row.supplierGoodsDetailCode }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ row.orderTime }}</el-descriptions-item>
            <el-descriptions-item label="退订时间">{{ row.unsubscribeTime }}</el-descriptions-item>
            <el-descriptions-item label="触点">{{ row.platform }}</el-descriptions-item>
            <el-descriptions-item label="订单来源信息" :span="3">{{ row.sourceData }}</el-descriptions-item>
            <el-descriptions-item label="订单备注" :span="2">{{ row.remark }}</el-descriptions-item>
            <el-descriptions-item label="处理结果" :span="2">{{ row.matchMessage }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="系统订单号" prop="merchantOrderNo" min-width="180" />
      <el-table-column label="渠道订单号" prop="externalOrderNo" min-width="160" show-overflow-tooltip />
      <el-table-column label="供应商订单号" prop="supplierOrderNo" min-width="160" />
      <el-table-column label="手机号" prop="productNo" width="120" />
      <el-table-column label="分销商" prop="distributorCode" width="120" show-overflow-tooltip />
      <el-table-column label="商品编码" prop="goodsCode" min-width="140" show-overflow-tooltip />
      <el-table-column label="产品名称" prop="productName" min-width="150" show-overflow-tooltip />
      <el-table-column label="触点" prop="platform" min-width="130" show-overflow-tooltip />
      <el-table-column label="订单来源信息" prop="sourceData" min-width="180" show-overflow-tooltip />
      <el-table-column label="下单时间" prop="orderTime" width="165" />
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
  </div>
</template>

<script>
import { listUnsubscribeRecords, rematchUnsubscribeRecords } from '@/api/stockorder/unsubscribe'

export default {
  name: 'UnsubscribeRecord',
  data() {
    return {
      loading: false, rows: [], total: 0, dateRange: [], showSearch: true,
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
    handleExport() {
      const query = { ...this.queryParams }
      query.unsubscribeStartTime = this.dateRange && this.dateRange[0]
      query.unsubscribeEndTime = this.dateRange && this.dateRange[1]
      this.download('stockorder/unsubscribe/records/export', query,
        `unsubscribe_records_${new Date().getTime()}.xlsx`)
    },
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

<style scoped>
.order-detail {
  padding: 16px 24px 20px;
}
</style>
