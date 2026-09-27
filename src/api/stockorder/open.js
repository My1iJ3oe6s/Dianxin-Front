import request from '@/utils/request'

// 匿名查询权益订单列表
export function listOpenStockOrders(params) {
  return request({
    url: '/api/open/stock-orders',
    method: 'get',
    params,
    headers: { isToken: false }
  })
}

// 匿名查询权益订单详情
export function getOpenStockOrder(orderNo) {
  return request({
    url: '/api/open/stock-orders/' + encodeURIComponent(orderNo),
    method: 'get',
    headers: { isToken: false }
  })
}

// 匿名查询权益订单过程日志
export function getOpenStockOrderProcessLogs(orderNo, params) {
  return request({
    url: '/api/open/stock-orders/' + encodeURIComponent(orderNo) + '/process-logs',
    method: 'get',
    params,
    headers: { isToken: false }
  })
}
