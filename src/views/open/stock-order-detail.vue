<template>
  <div class="open-order-page">
    <header class="page-header">
      <div class="header-inner">
        <div>
          <div class="brand">讯翼行分销管理平台</div>
          <h1>权益订单详情</h1>
        </div>
        <div v-if="order.orderNo" class="order-summary">
          <span>订单号</span>
          <strong>{{ order.orderNo }}</strong>
          <el-tag size="small" :type="statusType(order.orderStatus)">{{ orderStatusLabel(order.orderStatus) }}</el-tag>
        </div>
      </div>
    </header>

    <main v-loading="loading" class="page-content">
      <el-alert v-if="loadError" :title="loadError" type="error" show-icon :closable="false" />

      <el-tabs v-else v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="基础信息" name="basic">
          <section class="detail-section">
            <h2>订单信息</h2>
            <el-row :gutter="20">
              <el-col v-for="item in orderInfo" :key="item.label" :xs="24" :sm="12" :lg="8">
                <div class="detail-item"><span>{{ item.label }}</span>{{ item.value }}</div>
              </el-col>
            </el-row>
          </section>

          <section class="detail-section">
            <h2>分销商与来源</h2>
            <el-row :gutter="20">
              <el-col v-for="item in sourceInfo" :key="item.label" :xs="24" :sm="12" :lg="8">
                <div class="detail-item"><span>{{ item.label }}</span>{{ item.value }}</div>
              </el-col>
            </el-row>
            <div class="detail-item detail-item-full"><span>URL参数</span>{{ value(order.urlParams) }}</div>
            <div class="detail-item detail-item-full"><span>来源数据</span>{{ value(order.sourceData) }}</div>
          </section>

          <section class="detail-section">
            <h2>商品与供应商</h2>
            <el-row :gutter="20">
              <el-col v-for="item in goodsInfo" :key="item.label" :xs="24" :sm="12" :lg="8">
                <div class="detail-item">
                  <span>{{ item.label }}</span>
                  <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.value }}</a>
                  <template v-else>{{ item.value }}</template>
                </div>
              </el-col>
            </el-row>
          </section>

          <section class="detail-section">
            <h2>处理与业务状态</h2>
            <el-row :gutter="20">
              <el-col v-for="item in businessInfo" :key="item.label" :xs="24" :sm="12" :lg="8">
                <div class="detail-item"><span>{{ item.label }}</span>{{ item.value }}</div>
              </el-col>
            </el-row>
            <div class="detail-item detail-item-full"><span>同步订单消息</span>{{ value(order.syncOrderMessage) }}</div>
            <div class="detail-item detail-item-full"><span>备注</span>{{ value(order.remark) }}</div>
          </section>
        </el-tab-pane>

        <el-tab-pane label="订单日志" name="logs">
          <section class="detail-section process-log-section">
            <div class="section-header">
              <div>
                <h2>订单过程日志</h2>
                <span class="process-log-count">共 {{ logTotal }} 条</span>
              </div>
              <el-button size="small" icon="el-icon-refresh" :loading="processLogLoading" @click="loadProcessLogs">刷新</el-button>
            </div>

            <div class="process-log-toolbar">
              <el-radio-group v-model="logQuery.logDimension" size="small" @change="handleDimensionChange">
                <el-radio-button label="ALL">全部</el-radio-button>
                <el-radio-button label="DISTRIBUTOR">分销商</el-radio-button>
                <el-radio-button label="INTERNAL">系统内部</el-radio-button>
                <el-radio-button label="SUPPLIER">供应商</el-radio-button>
              </el-radio-group>
              <div class="process-log-filters">
                <el-select v-model="logQuery.logType" size="small" clearable placeholder="具体日志类型" @change="handleLogFilter">
                  <el-option v-for="item in availableLogTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="logQuery.resultStatus" size="small" clearable placeholder="执行结果" @change="handleLogFilter">
                  <el-option label="成功" value="SUCCESS" />
                  <el-option label="失败" value="FAILED" />
                  <el-option label="执行中" value="RUNNING" />
                  <el-option label="结果未知" value="UNKNOWN" />
                </el-select>
              </div>
            </div>

            <div v-loading="processLogLoading" class="process-log-list">
              <el-empty v-if="!processLogs.length && !processLogLoading" description="暂无过程日志（仅展示日志功能上线后的调用）" />
              <el-timeline v-else>
                <el-timeline-item v-for="log in processLogs" :key="log.id"
                  :timestamp="parseTime(log.startTime)" placement="top" :type="resultTagType(log.resultStatus)">
                  <article class="process-log-item">
                    <div class="process-log-summary">
                      <div class="process-log-title">
                        <el-tag size="mini" effect="plain" :type="dimensionTagType(log.logType)">{{ logTypeLabel(log.logType) }}</el-tag>
                        <strong>{{ log.eventName }}</strong>
                        <el-tag size="mini" :type="resultTagType(log.resultStatus)">{{ resultStatusLabel(log.resultStatus) }}</el-tag>
                      </div>
                      <div class="process-log-meta">
                        <span v-if="log.beforeStatus !== null && log.beforeStatus !== undefined" class="status-flow">
                          {{ orderStatusLabel(log.beforeStatus) }} <i class="el-icon-right" /> {{ orderStatusLabel(log.afterStatus) }}
                        </span>
                        <span v-if="log.durationMs !== null && log.durationMs !== undefined">耗时 {{ log.durationMs }}ms</span>
                        <el-tooltip v-if="log.traceId" :content="log.traceId" placement="top">
                          <button type="button" class="trace-button" @click="copyText(log.traceId)">Trace {{ shortTrace(log.traceId) }} <i class="el-icon-document-copy" /></button>
                        </el-tooltip>
                      </div>
                    </div>
                    <div v-if="log.errorMessage" class="process-log-error">{{ log.errorMessage }}</div>
                    <el-collapse v-if="hasLogDetail(log)" v-model="processLogActiveNames">
                      <el-collapse-item title="查看调用详情" :name="String(log.id)">
                        <el-tabs type="border-card" class="payload-tabs">
                          <el-tab-pane v-if="log.requestUrl || log.requestBody" label="请求">
                            <div v-if="log.requestUrl" class="payload-block"><span>请求地址</span><pre>{{ log.requestUrl }}</pre></div>
                            <div v-if="log.requestBody" class="payload-block"><span>请求参数</span><el-button type="text" icon="el-icon-document-copy" @click="copyText(prettyPayload(log.requestBody))">复制</el-button><pre>{{ prettyPayload(log.requestBody) }}</pre></div>
                          </el-tab-pane>
                          <el-tab-pane v-if="log.responseBody" label="响应">
                            <div class="payload-block"><span>响应参数</span><el-button type="text" icon="el-icon-document-copy" @click="copyText(prettyPayload(log.responseBody))">复制</el-button><pre>{{ prettyPayload(log.responseBody) }}</pre></div>
                          </el-tab-pane>
                          <el-tab-pane v-if="log.changedFields" label="字段变化">
                            <div class="payload-block"><span>变更内容</span><el-button type="text" icon="el-icon-document-copy" @click="copyText(prettyPayload(log.changedFields))">复制</el-button><pre>{{ prettyPayload(log.changedFields) }}</pre></div>
                          </el-tab-pane>
                        </el-tabs>
                      </el-collapse-item>
                    </el-collapse>
                  </article>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-pagination v-if="logTotal > logQuery.pageSize" background layout="prev, pager, next"
              :current-page="logQuery.pageNum" :page-size="logQuery.pageSize" :total="logTotal"
              @current-change="handleLogPageChange" />
          </section>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import { getOpenStockOrder, getOpenStockOrderProcessLogs } from '@/api/stockorder/open'

const STATUS_LABELS = {
  0: '新增',
  1: '发送短信',
  2: '订单确认',
  3: '订单完成',
  4: '短信发送失败',
  5: '下单失败',
  6: '异步下单成功',
  9: '前置校验失败'
}

export default {
  name: 'OpenStockOrderDetail',
  data() {
    return {
      loading: true,
      loadError: '',
      activeTab: 'basic',
      order: {},
      logsLoaded: false,
      processLogLoading: false,
      processLogs: [],
      processLogActiveNames: [],
      logTotal: 0,
      logQuery: {
        pageNum: 1,
        pageSize: 20,
        logDimension: 'ALL',
        logType: null,
        resultStatus: null
      },
      logTypeOptions: [
        { label: '分销商调用', value: 'DISTRIBUTOR_API', dimension: 'DISTRIBUTOR' },
        { label: '订单变更', value: 'ORDER_MUTATION', dimension: 'INTERNAL' },
        { label: '供应商调用', value: 'SUPPLIER_API', dimension: 'SUPPLIER' },
        { label: '供应商回调', value: 'SUPPLIER_CALLBACK', dimension: 'SUPPLIER' },
        { label: '定时查单', value: 'SCHEDULE_QUERY', dimension: 'SUPPLIER' },
        { label: '订单任务', value: 'ORDER_TASK', dimension: 'INTERNAL' },
        { label: '人工操作', value: 'MANUAL_OPERATION', dimension: 'INTERNAL' }
      ]
    }
  },
  computed: {
    orderNo() {
      return this.$route.params.orderNo
    },
    orderInfo() {
      return [
        { label: '订单ID', value: this.value(this.order.orderId) },
        { label: '订单号', value: this.value(this.order.orderNo) },
        { label: '分销商订单号', value: this.value(this.order.externalOrderNo) },
        { label: '供应商订单号', value: this.value(this.order.supplierOrderNo) },
        { label: '客户手机号', value: this.value(this.order.phone) },
        { label: '短信验证码', value: this.value(this.order.smsNum) },
        { label: '订单状态', value: this.orderStatusLabel(this.order.orderStatus) },
        { label: '下单时间', value: this.timeValue(this.order.orderTime) },
        { label: '创建人', value: this.value(this.order.createBy) },
        { label: '创建时间', value: this.timeValue(this.order.createTime) },
        { label: '更新人', value: this.value(this.order.updateBy) },
        { label: '更新时间', value: this.timeValue(this.order.updateTime) }
      ]
    },
    sourceInfo() {
      return [
        { label: '分销商编码', value: this.value(this.order.distributorCode) },
        { label: '营销地址', value: this.value(this.order.distributorUrl) },
        { label: '来源触点', value: this.value(this.order.platform) },
        { label: '省份', value: this.value(this.order.province) },
        { label: '城市', value: this.value(this.order.cityName) },
        { label: '城市编码', value: this.value(this.order.cityCode) }
      ]
    },
    goodsInfo() {
      return [
        { label: '商品名称', value: this.value(this.order.goodsName) },
        { label: '商品编码', value: this.value(this.order.goodsCode) },
        { label: '商品明细ID', value: this.value(this.order.goodsDetailId) },
        { label: '供应商编码', value: this.value(this.order.supplierCode) },
        { label: '供应商商品编码', value: this.value(this.order.supplierGoodsCode) },
        { label: '供应商商品明细编码', value: this.value(this.order.supplierGoodsDetailCode) },
        { label: '工号', value: this.value(this.order.gongHao) },
        { label: '供应商订单地址', value: this.value(this.order.supplierOrderUrl), url: this.safeUrl(this.order.supplierOrderUrl) },
        { label: '商品截图地址', value: this.value(this.order.goodsScreenshotUrl), url: this.safeUrl(this.order.goodsScreenshotUrl) }
      ]
    },
    businessInfo() {
      return [
        { label: '是否扣减', value: this.yesNo(this.order.isDeduct) },
        { label: '是否退订', value: this.yesNo(this.order.isUnsubscribe) },
        { label: '是否拉黑', value: this.yesNo(this.order.isBlacklist) },
        { label: '退订时间', value: this.timeValue(this.order.unsubscribeTime) }
      ]
    },
    availableLogTypeOptions() {
      if (this.logQuery.logDimension === 'ALL') return this.logTypeOptions
      return this.logTypeOptions.filter(item => item.dimension === this.logQuery.logDimension)
    }
  },
  created() {
    this.loadDetail()
  },
  watch: {
    activeTab(value) {
      if (value === 'logs' && !this.logsLoaded) {
        this.loadProcessLogs()
      }
    }
  },
  methods: {
    loadDetail() {
      this.loading = true
      this.loadError = ''
      getOpenStockOrder(this.orderNo).then(response => {
        this.order = response.data || {}
        document.title = `权益订单详情 - ${this.order.orderNo || this.orderNo}`
      }).catch(() => {
        this.loadError = '订单不存在或暂时无法加载，请核对订单号后重试。'
      }).finally(() => {
        this.loading = false
      })
    },
    loadProcessLogs() {
      if (!this.order.orderNo) return Promise.resolve()
      this.processLogLoading = true
      return getOpenStockOrderProcessLogs(this.order.orderNo, this.logQuery).then(response => {
        this.processLogs = response.rows || []
        this.logTotal = response.total || 0
        this.logsLoaded = true
      }).finally(() => {
        this.processLogLoading = false
      })
    },
    handleLogFilter() {
      this.logQuery.pageNum = 1
      this.processLogActiveNames = []
      this.loadProcessLogs()
    },
    handleDimensionChange() {
      this.logQuery.logType = null
      this.handleLogFilter()
    },
    handleLogPageChange(page) {
      this.logQuery.pageNum = page
      this.processLogActiveNames = []
      this.loadProcessLogs()
    },
    value(value) {
      return value === null || value === undefined || value === '' ? '-' : value
    },
    timeValue(value) {
      return value ? this.parseTime(value) : '-'
    },
    yesNo(value) {
      if (value === null || value === undefined) return '-'
      return Number(value) === 1 ? '是' : '否'
    },
    safeUrl(value) {
      return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : ''
    },
    orderStatusLabel(value) {
      return STATUS_LABELS[value] || (value === null || value === undefined ? '-' : `状态 ${value}`)
    },
    statusType(value) {
      if ([3, 6].includes(Number(value))) return 'success'
      if ([4, 5, 9].includes(Number(value))) return 'danger'
      if ([1, 2].includes(Number(value))) return 'warning'
      return 'info'
    },
    logTypeLabel(value) {
      const option = this.logTypeOptions.find(item => item.value === value)
      return option ? option.label : value
    },
    resultStatusLabel(value) {
      return { SUCCESS: '成功', FAILED: '失败', RUNNING: '执行中', UNKNOWN: '结果未知' }[value] || value
    },
    resultTagType(value) {
      return { SUCCESS: 'success', FAILED: 'danger', RUNNING: 'warning', UNKNOWN: 'info' }[value] || 'info'
    },
    dimensionTagType(value) {
      if (value === 'DISTRIBUTOR_API') return ''
      if (['SUPPLIER_API', 'SUPPLIER_CALLBACK', 'SCHEDULE_QUERY'].includes(value)) return 'warning'
      return 'info'
    },
    shortTrace(value) {
      if (!value || value.length <= 12) return value || '-'
      return `${value.slice(0, 6)}...${value.slice(-4)}`
    },
    copyText(value) {
      const text = value || ''
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => this.$message.success('已复制'))
        return
      }
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('已复制')
    },
    hasLogDetail(log) {
      return Boolean(log.requestUrl || log.requestBody || log.responseBody || log.changedFields)
    },
    prettyPayload(value) {
      if (!value) return ''
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      } catch (e) {
        return value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.open-order-page {
  min-height: 100vh;
  color: #303133;
  background: #f4f6f8;
  letter-spacing: 0;
}

.page-header {
  color: #fff;
  background: #18212f;
  border-bottom: 4px solid #2d8b57;
}

.header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  max-width: 1280px;
  min-height: 128px;
  margin: 0 auto;
  padding: 28px 32px 24px;
}

.brand {
  margin-bottom: 8px;
  color: #9fb0c5;
  font-size: 14px;
}

h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.3;
}

.order-summary {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 5px 12px;
  max-width: 60%;
  text-align: right;
}

.order-summary span {
  color: #9fb0c5;
  font-size: 12px;
}

.order-summary strong {
  overflow-wrap: anywhere;
}

.order-summary .el-tag {
  grid-column: 2;
  justify-self: end;
}

.page-content {
  max-width: 1280px;
  min-height: 420px;
  margin: 0 auto;
  padding: 24px 32px 48px;
}

.detail-tabs {
  padding: 0 20px 20px;
  background: #fff;
  border: 1px solid #dfe4ea;
}

.detail-section {
  padding: 22px 4px 12px;
  border-bottom: 1px solid #e6e9ed;
}

.detail-section:last-child {
  border-bottom: 0;
}

.detail-section h2 {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.4;
}

.detail-item {
  min-height: 58px;
  padding: 8px 0;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.detail-item > span:first-child {
  display: block;
  color: #909399;
  font-size: 12px;
}

.detail-item a {
  color: #2877c7;
}

.detail-item-full {
  min-height: auto;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  white-space: pre-wrap;
}

.section-header,
.section-header > div,
.process-log-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-header h2 {
  margin-bottom: 0;
}

.process-log-count {
  color: #909399;
  font-size: 12px;
}

.process-log-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0;
  padding: 12px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.process-log-filters {
  display: flex;
  gap: 8px;
}

.process-log-filters .el-select {
  width: 140px;
}

.process-log-item {
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.process-log-title {
  display: flex;
  align-items: center;
  min-width: 0;
}

.process-log-title strong {
  margin: 0 8px;
}

.process-log-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  color: #909399;
  font-size: 12px;
}

.status-flow {
  color: #606266;
}

.trace-button {
  max-width: 148px;
  overflow: hidden;
  padding: 0;
  color: #909399;
  font: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.trace-button:hover {
  color: #409eff;
}

.process-log-error {
  margin-top: 12px;
  padding: 10px 12px;
  color: #c93636;
  background: #fef0f0;
  border-radius: 4px;
}

.process-log-item .el-collapse {
  margin-top: 10px;
  border-bottom: 0;
}

.payload-tabs {
  margin-top: 4px;
  box-shadow: none;
}

.payload-block {
  margin-bottom: 12px;
}

.payload-block > span {
  color: #606266;
  font-weight: 600;
}

.payload-block > .el-button {
  float: right;
  padding: 0;
}

.payload-block pre {
  max-height: 280px;
  overflow: auto;
  padding: 12px;
  color: #d8dee9;
  font: 12px/1.6 Menlo, Monaco, Consolas, monospace;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: #222b38;
  border-radius: 4px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

@media (max-width: 767px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
    min-height: 0;
    padding: 22px 16px;
  }

  h1 {
    font-size: 24px;
  }

  .order-summary {
    max-width: 100%;
    text-align: left;
  }

  .order-summary .el-tag {
    justify-self: start;
  }

  .page-content {
    padding: 12px 10px 32px;
  }

  .detail-tabs {
    padding: 0 12px 12px;
  }

  .process-log-toolbar,
  .process-log-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .process-log-toolbar .el-radio-group {
    display: flex;
    width: 100%;
    overflow-x: auto;
  }

  .process-log-filters {
    width: 100%;
  }

  .process-log-filters .el-select {
    width: 50%;
  }

  .process-log-title {
    flex-wrap: wrap;
    gap: 6px;
  }

  .process-log-title strong {
    margin: 0;
  }

  .process-log-meta {
    justify-content: flex-start;
  }
}
</style>
