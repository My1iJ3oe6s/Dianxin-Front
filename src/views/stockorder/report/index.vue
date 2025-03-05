<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px" size="small">
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="分销商编码" prop="distributorCode">
          <el-select style="width: 240px" v-model="queryParams.distributorCode" placeholder="请选择分销商编码" clearable>
            <el-option
              v-for="dict in dict.type.channel_customer"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select style="width: 240px" v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="dict in dict.type.self_stock_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="panel-group">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>总订单数</span>
          </div>
          <div class="card-panel-num">{{ statistics.totalOrders || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>成功订单数</span>
          </div>
          <div class="card-panel-num">{{ statistics.successOrders || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>失败订单数</span>
          </div>
          <div class="card-panel-num">{{ statistics.failedOrders || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>退订订单数</span>
          </div>
          <div class="card-panel-num">{{ statistics.unsubscribeOrders || 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表展示 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>订单状态分布</span>
          </div>
          <div ref="statusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>每日订单趋势</span>
          </div>
          <div ref="trendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分销商订单统计表格 -->
    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header">
        <span>分销商订单统计</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-download"
          @click="handleExport"
        >导出</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="distributorList"
        border
        style="width: 100%"
      >
        <el-table-column label="分销商编码" align="center" prop="distributorCode">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.channel_customer" :value="scope.row.distributorCode"/>
          </template>
        </el-table-column>
        <el-table-column label="总订单数" align="center" prop="totalOrders" />
        <el-table-column label="成功订单数" align="center" prop="successOrders" />
        <el-table-column label="失败订单数" align="center" prop="failedOrders" />
        <el-table-column label="退订订单数" align="center" prop="unsubscribeOrders" />
        <el-table-column label="成功率" align="center" prop="successRate">
          <template slot-scope="scope">
            {{ scope.row.successRate }}%
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StockorderReport',
  dicts: ['self_stock_status', 'channel_customer'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        dateRange: [],
        distributorCode: undefined,
        orderStatus: undefined
      },
      // 统计数据
      statistics: {
        totalOrders: 0,
        successOrders: 0,
        failedOrders: 0,
        unsubscribeOrders: 0
      },
      // 分销商统计列表
      distributorList: [],
      // 图表实例
      statusChart: null,
      trendChart: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 初始化图表
    this.initCharts()
    // 监听窗口大小变化，重绘图表
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    // 销毁图表实例
    if(this.statusChart) {
      this.statusChart.dispose()
    }
    if(this.trendChart) {
      this.trendChart.dispose()
    }
    window.removeEventListener('resize', this.resizeCharts)
  },
  methods: {
    /** 查询统计数据 */
    getList() {
      this.loading = true
      // 这里需要调用后端接口获取数据
      // getStockorderStatistics(this.queryParams).then(response => {
      //   this.statistics = response.data.overview
      //   this.distributorList = response.data.distributorList
      //   this.updateCharts(response.data)
      //   this.loading = false
      // })
      
      // 模拟数据
      setTimeout(() => {
        this.statistics = {
          totalOrders: 1000,
          successOrders: 800,
          failedOrders: 150,
          unsubscribeOrders: 50
        }
        this.distributorList = [
          {
            distributorCode: '1001',
            totalOrders: 500,
            successOrders: 400,
            failedOrders: 80,
            unsubscribeOrders: 20,
            successRate: '80.0'
          },
          // ... 更多数据
        ]
        this.updateCharts({
          statusData: [
            {value: 800, name: '成功'},
            {value: 150, name: '失败'},
            {value: 50, name: '退订'}
          ],
          trendData: {
            dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
            orders: [100, 120, 90, 150, 130]
          }
        })
        this.loading = false
      }, 1000)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('stockorder/report/export', {
        ...this.queryParams
      }, `订单统计报表_${new Date().getTime()}.xlsx`)
    },
    /** 初始化图表 */
    initCharts() {
      this.statusChart = echarts.init(this.$refs.statusChart)
      this.trendChart = echarts.init(this.$refs.trendChart)
      
      // 设置图表基础配置
      this.statusChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside'
            },
            data: []
          }
        ]
      })

      this.trendChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '订单数',
            type: 'line',
            data: []
          }
        ]
      })
    },
    /** 更新图表数据 */
    updateCharts(data) {
      if (this.statusChart) {
        this.statusChart.setOption({
          series: [{
            data: data.statusData
          }]
        })
      }
      
      if (this.trendChart) {
        this.trendChart.setOption({
          xAxis: {
            data: data.trendData.dates
          },
          series: [{
            data: data.trendData.orders
          }]
        })
      }
    },
    /** 重绘图表 */
    resizeCharts() {
      if(this.statusChart) {
        this.statusChart.resize()
      }
      if(this.trendChart) {
        this.trendChart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  
  .card-panel-num {
    font-size: 20px;
    font-weight: bold;
    color: #666;
    text-align: center;
  }
}

.box-card {
  .el-card__header {
    padding: 10px 20px;
    font-weight: bold;
  }
}
</style> 