import request from '@/utils/request'

// 查询权益分销商列表
export function listOrderSource(query) {
  return request({
    url: '/business/orderSource/list',
    method: 'get',
    params: query
  })
}

// 查询权益分销商详细
export function getOrderSource(id) {
  return request({
    url: '/business/orderSource/' + id,
    method: 'get'
  })
}

// 新增权益分销商
export function addOrderSource(data) {
  return request({
    url: '/business/orderSource',
    method: 'post',
    data: data
  })
}

// 修改权益分销商
export function updateOrderSource(data) {
  return request({
    url: '/business/orderSource',
    method: 'put',
    data: data
  })
}

// 删除权益分销商
export function delOrderSource(id) {
  return request({
    url: '/business/orderSource/' + id,
    method: 'delete'
  })
}
