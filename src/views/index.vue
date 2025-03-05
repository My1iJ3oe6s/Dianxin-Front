<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="hover" class="data-card card-1">
          <div class="card-header">
            <div class="icon-wrapper">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="content">
              <count-to :start-val="0" :end-val="todayOrderCount" :duration="2000" class="card-number" />
              <div class="card-title">当日订单量</div>
            </div>
            <div class="trend-indicator">
              <div class="trend-value">
                <span>昨日：</span>
                <div class="value">{{ yesterdayOrderCount }}</div>
              </div>
              <div class="trend-info" :class="orderTrend >= 0 ? 'up' : 'down'">
                <div class="trend-arrow">
                  <i :class="orderTrend >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
                  <span>{{ Math.abs(orderTrend).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <!-- 可以添加其他指标信息 -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card card-2">
          <div class="card-header">
            <div class="icon-wrapper">
              <i class="el-icon-date"></i>
            </div>
            <div class="content">
              <count-to :start-val="0" :end-val="monthOrderCount" :duration="2000" class="card-number" />
              <div class="card-title">当月订单量</div>
            </div>
            <div class="trend-indicator">
              <div class="trend-value">
                <span>上月：</span>
                <div class="value">{{ lastMonthOrderCount }}</div>
              </div>
              <div class="trend-info" :class="monthTrend >= 0 ? 'up' : 'down'">
                <div class="trend-arrow">
                  <i :class="monthTrend >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
                  <span>{{ Math.abs(monthTrend).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <!-- 移除原有内容 -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card card-3">
          <div class="card-header">
            <div class="icon-wrapper">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="content centered">
              <count-to :start-val="0" :end-val="totalOrderCount" :duration="2000" class="card-number" />
              <div class="card-title">总订单量</div>
            </div>
          </div>
          <div class="card-footer">
            <span></span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间部分 - 调整顺序，昨日指标在前 -->
    <el-row :gutter="24" style="margin-top: 24px">
      <el-col :span="6">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">昨日地区排行</span>
          </div>
          <div class="chart-container">
            <div ref="regionRankChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">昨日分销商排行</span>
          </div>
          <div class="chart-container">
            <div ref="distributorRankChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">订单来源分布</span>
          </div>
          <div class="chart-container">
            <div ref="sourceChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">订单状态分布</span>
          </div>
          <div class="chart-container">
            <div ref="orderStatusChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部趋势图 - 调整顺序 -->
    <el-row :gutter="24" style="margin-top: 24px">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">地区订单成功量</span>
            <el-radio-group v-model="regionTimeRange" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <div ref="regionSuccessChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="clearfix">
            <span class="chart-title">订单趋势分析</span>
            <el-radio-group v-model="chartTimeRange" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <div ref="orderTrendChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import * as echarts from 'echarts'
import { getStatistics, getOrderTrend, getOrderStatusDistribution, getCityDistribution, 
  getGoodsRank, getOrderSource, getOrderSuccessByRegion, getRegionRank, getDistributorRank } from '@/api/stockorder/dashboard'

export default {
  name: 'Index',
  components: {
    CountTo
  },
  data() {
    return {
      chartTimeRange: 'week',
      regionTimeRange: 'week',
      todayOrderCount: 0,
      yesterdayOrderCount: 0,
      orderTrend: 0,
      monthOrderCount: 0,
      lastMonthOrderCount: 0,
      monthTrend: 0,
      totalOrderCount: 0,
      charts: {}
    }
  },
  watch: {
    chartTimeRange(val) {
      this.getOrderTrendData()
    },
    regionTimeRange(val) {
      this.getRegionSuccessData()
    }
  },
  mounted() {
    // 确保DOM已经渲染
    this.$nextTick(() => {
      // 先初始化所有图表
      this.initAllCharts();
      
      // 再获取数据
      setTimeout(() => {
        this.fetchAllData();
      }, 100);
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.resizeAllCharts);
    });
  },
  beforeDestroy() {
    // 移除窗口大小变化的监听
    window.removeEventListener('resize', this.resizeAllCharts);
    
    // 销毁图表实例
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    });
  },
  methods: {
    resizeAllCharts() {
      // 调整所有图表大小
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.resize();
        }
      });
    },
    fetchAllData() {
      // 获取统计数据
      getStatistics().then(response => {
        if (response.code === 200) {
          // 更新数据
          this.todayOrderCount = response.data.todayOrderCount || 0;
          this.yesterdayOrderCount = response.data.yesterdayOrderCount || 0;
          this.orderTrend = response.data.orderTrend || 0;
          this.monthOrderCount = response.data.monthOrderCount || 0;
          this.lastMonthOrderCount = response.data.lastMonthOrderCount || 0;
          this.monthTrend = response.data.monthTrend || 0;
          this.totalOrderCount = response.data.totalOrderCount || 0;
        } else {
          this.$message.error('获取统计数据失败');
        }
      }).catch((error) => {
        console.error('获取统计数据错误:', error);
        this.$message.error('获取统计数据失败');
      });
      
      // 获取其他图表数据 - 使用正确的方法名
      this.getOrderTrendData();
      this.getOrderStatusData();
      this.getSourceData();
      this.getRegionSuccessData();
      this.getRegionRankData();
      this.getDistributorRankData();
    },

    getOrderTrendData() {
      getOrderTrend(this.chartTimeRange).then(response => {
        if (response.code === 200) {
          this.updateOrderTrendChart(response.data);
        } else {
          this.$message.error('获取订单趋势数据失败');
        }
      }).catch(() => {
        this.$message.error('获取订单趋势数据失败');
      });
    },
    
    getOrderStatusData() {
      getOrderStatusDistribution().then(response => {
        if (response.code === 200) {
          console.log("订单状态分布数据:", response.data);
          
          // 确保图表实例存在
          if (!this.charts.orderStatus && this.$refs.orderStatusChart) {
            this.initOrderStatusChart();
          }
          
          // 处理数据并渲染图表
          let chartData = response.data.data || response.data || [];
          
          if (chartData.length === 0) {
            chartData = [{name: '暂无数据', value: 100}];
          }
          
          this.updateOrderStatusChart(chartData);
        }
      }).catch(error => {
        console.error("获取订单状态分布错误:", error);
      });
    },

    getSourceData() {
      getOrderSource().then(response => {
        if (response.code === 200) {
          console.log('订单来源数据:', response.data); // 调试日志
          // 确保数据存在且格式正确
          if (response.data && response.data.data) {
            this.updateSourceChart(response.data.data);
          } else {
            console.warn('订单来源数据格式不正确:', response.data);
            // 使用默认数据展示图表
            this.updateSourceChart([
              { name: '直营门店', value: 335 },
              { name: '电商平台', value: 310 },
              { name: '代理商', value: 234 },
              { name: '其他渠道', value: 148 }
            ]);
          }
        } else {
          this.$message.error('获取订单来源分布数据失败');
          // 使用默认数据展示图表
          this.updateSourceChart([
            { name: '直营门店', value: 335 },
            { name: '电商平台', value: 310 },
            { name: '代理商', value: 234 },
            { name: '其他渠道', value: 148 }
          ]);
        }
      }).catch((error) => {
        console.error('获取订单来源数据错误:', error);
        this.$message.error('获取订单来源分布数据失败');
        // 使用默认数据展示图表
        this.updateSourceChart([
          { name: '直营门店', value: 335 },
          { name: '电商平台', value: 310 },
          { name: '代理商', value: 234 },
          { name: '其他渠道', value: 148 }
        ]);
      });
    },

    getRegionSuccessData() {
      getOrderSuccessByRegion(this.regionTimeRange).then(response => {
        if (response.code === 200) {
          console.log('地区订单成功量数据:', response.data); // 调试日志
          this.updateRegionSuccessChart(response.data);
        } else {
          this.$message.error('获取地区订单成功量数据失败');
        }
      }).catch((error) => {
        console.error('获取地区订单成功量数据错误:', error);
        this.$message.error('获取地区订单成功量数据失败');
      });
    },

    updateOrderTrendChart(data) {
      const colors = ['#1890FF', '#73D13D', '#FAAD14', '#F5222D', '#722ED1'];
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: { color: '#666' },
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            params.forEach((item, index) => {
              result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
              result += `${item.seriesName}: ${item.value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: data.series.map(item => {
            return item.name.length > 12 ? item.name.substring(0, 10) + "..." : item.name;
          }),
          right: '5%',
          top: '5%',
          textStyle: { color: '#666' },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '60px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.dates,
          axisLine: { lineStyle: { color: '#ddd' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#666',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '订单数',
          splitLine: {
            lineStyle: { color: '#eee', type: 'dashed' }
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#666' }
        },
        series: data.series.map((item, index) => ({
          name: item.name.length > 12 ? item.name.substring(0, 10) + "..." : item.name,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { 
            color: colors[index % colors.length],
            width: 3
          },
          itemStyle: {
            color: colors[index % colors.length],
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: `${colors[index % colors.length]}33` // 添加透明度
            }, {
              offset: 1,
              color: `${colors[index % colors.length]}11`
            }])
          },
          data: item.data
        }))
      };
      
      this.charts.orderTrend.setOption(option);
    },

    updateSourceChart(data) {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12,
          formatter: function(name) {
            return name.length > 10 ? name.substring(0, 8) + "..." : name;
          },
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '订单来源',
            type: 'pie',
            radius: ['40%', '65%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}\n{d}%',
              position: 'outside',
              distanceToLabelLine: 5,
              alignTo: 'edge',
              edgeDistance: '10%'
            },
            labelLine: {
              length: 15,
              length2: 10,
              smooth: true,
              show: true
            },
            data: data
          }
        ]
      };
      
      this.charts.source.setOption(option);
    },

    updateRegionSuccessChart(data) {
      const colors = ['#1890FF', '#73D13D', '#FAAD14', '#F5222D', '#722ED1'];
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: { color: '#666' },
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            params.forEach((item, index) => {
              result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
              result += `${item.seriesName}: ${item.value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: data.series.map(item => item.name),
          right: '5%',
          top: '5%',
          textStyle: { color: '#666' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '60px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.dates,
          axisLine: { lineStyle: { color: '#ddd' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#666',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '订单数',
          splitLine: {
            lineStyle: { color: '#eee', type: 'dashed' }
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#666' }
        },
        series: data.series.map((item, index) => ({
          name: item.name,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { 
            color: colors[index % colors.length],
            width: 3
          },
          itemStyle: {
            color: colors[index % colors.length],
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: `${colors[index % colors.length]}33` // 添加透明度
            }, {
              offset: 1,
              color: `${colors[index % colors.length]}11`
            }])
          },
          data: item.data
        }))
      };
      this.charts.regionSuccess.setOption(option);
    },

    // 新增获取昨日地区排行数据
    getRegionRankData() {
      getRegionRank().then(response => {
        if (response.code === 200) {
          const data = response.data || { regions: [], counts: [] };
          // 构建图表数据
          this.updateRegionRankChart({
            regions: data.regions || [],
            counts: data.counts || []
          });
        }
      }).catch(error => {
        console.error("获取地区排行错误:", error);
      });
    },
    
    // 新增获取昨日分销商排行数据
    getDistributorRankData() {
      getDistributorRank().then(response => {
        if (response.code === 200) {
          const data = response.data || { distributors: [], counts: [] };
          // 构建图表数据
          this.updateDistributorRankChart({
            distributors: data.distributors || [],
            counts: data.counts || []
          });
        }
      }).catch(error => {
        console.error("获取分销商排行错误:", error);
      });
    },
    
    // 更新地区排行图表
    updateRegionRankChart(data) {
      const barWidth = Math.min(40, Math.max(15, 100 / (data.regions.length || 1)));
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 订单'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.regions,
          axisLine: { 
            show: true, 
            lineStyle: { color: '#ddd', width: 1 } 
          },
          axisTick: { show: false },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            interval: 0,
            rotate: data.regions.length > 5 ? 30 : 0,
            formatter: function(value) {
              return value.length > 6 ? value.substring(0, 6) + '...' : value;
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '订单数',
          axisLine: { 
            show: true, // 显示Y轴线
            lineStyle: { color: '#ddd', width: 1 } // 与X轴线样式一致
          },
          axisTick: { show: false },
          axisLabel: { color: '#666' },
          splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }
        },
        series: [{
          name: '订单数',
          type: 'bar',
          barWidth: barWidth + '%',
          data: data.counts || [],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {offset: 0, color: '#1890FF'},
              {offset: 1, color: '#73D13D'}
            ]),
            borderRadius: [4, 4, 0, 0] // 添加顶部圆角
          },
          label: {
            show: true,
            position: 'top',
            color: '#666'
          }
        }]
      };
      
      this.charts.regionRank.setOption(option);
    },
    
    // 更新分销商排行图表，与地区排行保持一致的坐标轴设置
    updateDistributorRankChart(data) {
      const barWidth = Math.min(40, Math.max(15, 100 / (data.distributors.length || 1)));
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 订单'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.distributors,
          axisLine: { lineStyle: { color: '#ddd' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            interval: 0,
            rotate: data.distributors.length > 5 ? 30 : 0,
            formatter: function(value) {
              return value.length > 6 ? value.substring(0, 6) + '...' : value;
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '订单数',
          axisLine: { 
            show: true, // 显示Y轴线
            lineStyle: { color: '#ddd', width: 1 } // 与X轴线样式一致
          },
          axisTick: { show: false },
          axisLabel: { color: '#666' },
          splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }
        },
        series: [{
          name: '订单数',
          type: 'bar',
          barWidth: barWidth + '%',
          data: data.counts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {offset: 0, color: '#722ED1'},  // 使用不同颜色区分
              {offset: 1, color: '#EB2F96'}
            ]),
            borderRadius: [4, 4, 0, 0]  // 添加顶部圆角
          },
          label: {
            show: true,
            position: 'top',
            color: '#666'
          }
        }]
      };
      
      this.charts.distributorRank.setOption(option);
    },

    // 生成小型趋势图的高度
    getTrendHeight(position, trendValue) {
      // 根据趋势值和位置生成高度
      const baseHeight = 4; // 基础高度
      const step = trendValue >= 0 ? 2 : -2; // 增长或下降的步长
      const height = baseHeight + (position * step); // 每个点的高度
      return `${Math.max(2, Math.min(12, height))}px`; // 限制高度范围在2px到12px之间
    },

    // 添加订单状态图表初始化方法
    initOrderStatusChart() {
      // 确保图表容器DOM已加载
      if (this.$refs.orderStatusChart) {
        // 如果已有实例，先销毁
        if (this.charts.orderStatus) {
          this.charts.orderStatus.dispose();
        }
        
        // 重新创建图表实例
        this.charts.orderStatus = echarts.init(this.$refs.orderStatusChart);
        console.log("订单状态图表已初始化");
      } else {
        console.error("订单状态图表DOM不存在");
      }
    },

    // 修改initAllCharts方法，移除对initOrderStatusChart的直接调用
    initAllCharts() {
      // 初始化所有图表
      this.charts.orderTrend = echarts.init(this.$refs.orderTrendChart);
      this.charts.source = echarts.init(this.$refs.sourceChart);
      this.charts.regionSuccess = echarts.init(this.$refs.regionSuccessChart);
      this.charts.regionRank = echarts.init(this.$refs.regionRankChart);
      this.charts.distributorRank = echarts.init(this.$refs.distributorRankChart);
      
      // 使用新创建的方法初始化订单状态图表
      if (this.$refs.orderStatusChart) {
        this.charts.orderStatus = echarts.init(this.$refs.orderStatusChart);
      }
    },

    // 修改getOrderStatusData方法中相关调用
    getOrderStatusData() {
      getOrderStatusDistribution().then(response => {
        if (response.code === 200) {
          console.log("订单状态分布数据:", response.data);
          
          // 确保图表实例存在
          if (!this.charts.orderStatus && this.$refs.orderStatusChart) {
            this.initOrderStatusChart();
          }
          
          // 处理数据并渲染图表
          let chartData = response.data.data || response.data || [];
          
          if (chartData.length === 0) {
            chartData = [{name: '暂无数据', value: 100}];
          }
          
          this.updateOrderStatusChart(chartData);
        }
      }).catch(error => {
        console.error("获取订单状态分布错误:", error);
      });
    },

    // 添加缺失的updateOrderStatusChart方法
    updateOrderStatusChart(data) {
      // 确保图表实例存在
      if (!this.charts.orderStatus) {
        console.error('订单状态图表实例不存在');
        return;
      }
      
      console.log('更新订单状态图表，数据:', data);
      
      // 使用最简单可靠的饼图配置
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
          type: 'scroll',
          formatter: function(name) {
            return name.length > 8 ? name.substring(0, 8) + "..." : name;
          }
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            data: data
          }
        ]
      };
      
      // 应用配置
      this.charts.orderStatus.setOption(option, true);
      
      // 确保图表渲染
      setTimeout(() => {
        if (this.charts.orderStatus) {
          this.charts.orderStatus.resize();
        }
      }, 200);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 84px);
  padding: 24px;
  background: #fff;  // 改为纯白背景

  // 添加背景装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0%, transparent 46%),
      radial-gradient(circle at 90% 80%, rgba(198, 226, 255, 0.38) 0%, transparent 56%);
    z-index: 0;
  }

  // 内容层级提升
  > .el-row {
    position: relative;
    z-index: 1;
  }

  .data-card {
    height: 100%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background: #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      
      .icon-wrapper {
        transform: rotate(-30deg);
        transition: transform 0.5s ease-in-out;
      }
      
      .card-number {
        transform: scale(1.05);
      }
    }
    
    &:active {
      transform: translateY(-2px) scale(0.98);
      transition: all 0.1s;
    }

    .card-header {
      padding: 24px;
      display: flex;
      align-items: center;
      
      .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        transition: all 0.5s;
        
        i {
          font-size: 30px;
          color: white;
        }
      }
      
      .content {
        flex: 1;
        
        &.centered {
          text-align: center;
          padding-right: 56px; /* 平衡左侧图标宽度 */
        }
        
        .card-number {
          font-size: 34px;
          font-weight: 700;
          color: #303133;
          line-height: 1.2;
          transition: transform 0.3s;
        }
        
        .card-title {
          font-size: 16px;
          color: #606266;
          margin-top: 6px;
          font-weight: 500;
        }
      }
    }

    .trend-indicator {
      margin-left: auto;
      flex: 0 0 40%;
      padding-left: 24px;
      border-left: 1px dashed #e8e8e8;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .trend-value {
        display: flex;
        align-items: baseline;
        margin-bottom: 10px;
        
        span {
          font-size: 16px;
          color: #606266;
        }
        
        .value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin-left: 8px;
        }
      }
      
      .trend-info {
        display: flex;
        align-items: center;
        
        &.up {
          color: #52C41A;
        }
        
        &.down {
          color: #F5222D;
        }
        
        .trend-arrow {
          display: flex;
          align-items: center;
          background: transparent;
          padding: 2px 0;
          font-weight: 500;
          font-size: 16px;
          
          i {
            font-size: 20px;
            margin-right: 6px;
          }
          
          span {
            font-weight: 600;
          }
        }
      }
    }

    .card-footer {
      padding: 0 24px 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #666;
      position: relative;
      z-index: 1;

      .up, .down {
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .up {
        color: #52C41A;
        background: rgba(82, 196, 26, 0.1);
      }

      .down {
        color: #F5222D;
        background: rgba(245, 34, 45, 0.1);
      }

      i {
        font-size: 12px;
      }
    }
  }

  .chart-card {
    height: 100%;
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(-2px) scale(0.98);
      transition: all 0.1s;
    }

    .el-card__header {
      padding: 18px 20px;
      border-bottom: 1px solid #f0f0f0;
      background: #fff;
      border-radius: 16px 16px 0 0;

      .chart-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2d3d;
        position: relative;
        padding-left: 14px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 18px;
          background: #1890FF;
          border-radius: 2px;
        }
      }
    }

    .chart-container {
      height: 360px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .el-radio-group {
    float: right;

    .el-radio-button__inner {
      border-color: #e4e7ed;
      background: #fff;
      color: #606266;
      transition: all 0.3s;
      font-size: 14px;
      padding: 8px 15px;

      &:hover {
        color: #1890FF;
      }
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: #1890FF;
      border-color: #1890FF;
      box-shadow: -1px 0 0 0 #1890FF;
      color: #fff;
      font-weight: 500;
    }
  }
}

.card-1 .icon-wrapper {
  background: linear-gradient(135deg, #36CFFF 0%, #2196F3 100%);
  box-shadow: 0 8px 16px rgba(54, 207, 255, 0.2);
}

.card-2 .icon-wrapper {
  background: linear-gradient(135deg, #9E73FF 0%, #7B46FF 100%);
  box-shadow: 0 8px 16px rgba(158, 115, 255, 0.2);
}

.card-3 .icon-wrapper {
  background: linear-gradient(135deg, #FF9A9E 0%, #FF5E62 100%);
  box-shadow: 0 8px 16px rgba(255, 154, 158, 0.2);
}
</style>