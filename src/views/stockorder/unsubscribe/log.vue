<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="查询日期">
        <el-date-picker
          v-model="queryParams.queryDate"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          placeholder="供应商业务日期"
        />
      </el-form-item>
      <el-form-item label="执行状态">
        <el-select v-model="queryParams.executeStatus" clearable placeholder="全部">
          <el-option label="处理中" :value="0" />
          <el-option label="成功" :value="1" />
          <el-option label="部分成功" :value="2" />
          <el-option label="失败" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求流水">
        <el-input v-model="queryParams.requestId" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['stockorder:unsubscribeLog:execute']"
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="openExecute"
        >
          拉取退订数据
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="rows">
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="查询日期" prop="queryDate" width="110" />
      <el-table-column label="供应商" prop="supplierCode" width="120" />
      <el-table-column label="触发方式" width="90">
        <template slot-scope="{ row }">{{ triggerText(row.triggerType) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="statusType(row.executeStatus)">{{ statusText(row.executeStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总数" prop="totalCount" width="70" />
      <el-table-column label="新增" prop="insertCount" width="70" />
      <el-table-column label="重复" prop="duplicateCount" width="70" />
      <el-table-column label="已匹配" prop="matchedCount" width="80" />
      <el-table-column label="未匹配" prop="unmatchedCount" width="80" />
      <el-table-column label="失败" prop="failureCount" width="70" />
      <el-table-column label="请求流水" prop="requestId" min-width="190" show-overflow-tooltip />
      <el-table-column label="开始时间" prop="startedAt" width="165" />
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="{ row }">
          <el-button
            v-hasPermi="['stockorder:unsubscribeLog:query']"
            type="text"
            @click="showDetail(row.id)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="执行退订查询" :visible.sync="executeOpen" width="420px">
      <el-form label-width="90px">
        <el-form-item label="查询日期">
          <el-date-picker
            v-model="executeDate"
            value-format="yyyy-MM-dd"
            type="date"
            :clearable="false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="executeOpen=false">取消</el-button>
        <el-button type="primary" :loading="executing" @click="executeQuery">执行</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查询日志详情" :visible.sync="detailOpen" width="75%">
      <el-descriptions v-if="detail" :column="3" border>
        <el-descriptions-item label="供应商">{{ detail.supplierCode }}</el-descriptions-item>
        <el-descriptions-item label="查询日期">{{ detail.queryDate }}</el-descriptions-item>
        <el-descriptions-item label="供应商结果码">{{ detail.supplierResultCode }}</el-descriptions-item>
        <el-descriptions-item label="供应商消息" :span="3">{{ detail.supplierMessage }}</el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="3">{{ detail.errorMessage }}</el-descriptions-item>
      </el-descriptions>
      <h4>请求报文</h4><pre class="payload">{{ detail && detail.requestData }}</pre>
      <h4>响应报文</h4><pre class="payload">{{ detail && detail.responseData }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { listUnsubscribeLogs, getUnsubscribeLog, querySupplierUnsubscribe } from '@/api/stockorder/unsubscribe'

export default {
  name: 'UnsubscribeLog',
  data() {
    return {
      loading: false, executing: false, executeOpen: false, detailOpen: false,
      rows: [], total: 0, detail: null, executeDate: this.yesterday(),
      queryParams: { pageNum: 1, pageSize: 10, supplierCode: 'YUYUYUAN',
        queryDate: undefined, executeStatus: undefined, requestId: undefined }
    }
  },
  created() { this.getList() },
  methods: {
    getList() {
      this.loading = true
      listUnsubscribeLogs(this.queryParams).then(r => {
        this.rows = r.rows; this.total = r.total
      }).finally(() => { this.loading = false })
    },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.resetForm('queryForm'); this.handleQuery() },
    openExecute() { this.executeDate = this.yesterday(); this.executeOpen = true },
    executeQuery() {
      this.executing = true
      querySupplierUnsubscribe(this.executeDate, 'YUYUYUAN').then(r => {
        this.$modal.msgSuccess(r.data && r.data.executeStatus === 3 ? '查询执行失败，请查看日志' : '查询执行完成')
        this.executeOpen = false; this.getList()
      }).finally(() => { this.executing = false })
    },
    showDetail(id) {
      getUnsubscribeLog(id).then(r => { this.detail = r.data; this.detailOpen = true })
    },
    yesterday() {
      const d = new Date(Date.now() - 86400000)
      return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')].join('-')
    },
    statusText(v) { return ['处理中', '成功', '部分成功', '失败'][v] || '未知' },
    statusType(v) { return ['', 'success', 'warning', 'danger'][v] || 'info' },
    triggerText(v) { return ({ 1: '定时', 2: '手工', 3: '补偿' })[v] || '未知' }
  }
}
</script>

<style scoped>
.payload { max-height: 260px; overflow: auto; white-space: pre-wrap; word-break: break-all;
  padding: 12px; background: #f5f7fa; border-radius: 4px; }
</style>
