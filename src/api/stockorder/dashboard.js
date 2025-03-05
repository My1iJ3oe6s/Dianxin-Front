import request from '@/utils/request'

// 获取统计数据
export function getStatistics() {
  return request({
    url: '/stockorder/dashboard/statistics',
    method: 'get'
  })
}

// 获取订单趋势数据
export function getOrderTrend(timeRange) {
  return request({
    url: '/stockorder/dashboard/orderTrend',
    method: 'get',
    params: { timeRange }
  })
}

// 获取订单状态分布
export function getOrderStatusDistribution() {
  return request({
    url: '/stockorder/dashboard/orderStatus',
    method: 'get'
  })
}

// 获取城市分布
export function getCityDistribution() {
  return request({
    url: '/stockorder/dashboard/cityDistribution',
    method: 'get'
  })
}

// 获取商品排行
export function getGoodsRank() {
  return request({
    url: '/stockorder/dashboard/goodsRank',
    method: 'get'
  })
}

// 获取订单来源分布
export function getOrderSource() {
  return request({
    url: '/stockorder/dashboard/source',
    method: 'get'
  })
}

// 获取订单处理时间分析
export function getOrderProcessTime(timeRange) {
  return request({
    url: '/stockorder/dashboard/processTime',
    method: 'get',
    params: { timeRange }
  })
}

// 获取不同地区每天的下单成功量
export function getOrderSuccessByRegion(timeRange) {
  return request({
    url: '/stockorder/dashboard/regionSuccess',
    method: 'get',
    params: { timeRange }
  })
}

// 获取昨日地区排行
export function getRegionRank() {
  return request({
    url: '/stockorder/dashboard/regionRank',
    method: 'get'
  })
}

// 获取昨日分销商排行
export function getDistributorRank() {
  return request({
    url: '/stockorder/dashboard/distributorRank',
    method: 'get'
  })
} 