import request from '@/utils/request'

// 查询电信存量订单列表
export function listStockorder(query) {
  return request({
    url: '/stockorder/stockorder/list',
    method: 'get',
    params: query
  })
}

// 查询电信存量订单详细
export function getStockorder(orderId) {
  return request({
    url: '/stockorder/stockorder/' + orderId,
    method: 'get'
  })
}

// 新增电信存量订单
export function addStockorder(data) {
  return request({
    url: '/stockorder/stockorder',
    method: 'post',
    data: data
  })
}

// 修改电信存量订单
export function updateStockorder(data) {
  return request({
    url: '/stockorder/stockorder',
    method: 'put',
    data: data
  })
}

// 删除电信存量订单
export function delStockorder(orderId) {
  return request({
    url: '/stockorder/stockorder/' + orderId,
    method: 'delete'
  })
}
