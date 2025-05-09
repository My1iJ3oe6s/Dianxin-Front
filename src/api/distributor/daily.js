import request from '@/utils/request'

// 查询分销商订单消耗明细列表
export function listDaily(query) {
  return request({
    url: '/distributor/daily/list',
    method: 'get',
    params: query
  })
}

// 查询分销商订单消耗明细详细
export function getDaily(consumptionId) {
  return request({
    url: '/distributor/daily/' + consumptionId,
    method: 'get'
  })
}

// 新增分销商订单消耗明细
export function addDaily(data) {
  return request({
    url: '/distributor/daily',
    method: 'post',
    data: data
  })
}

// 修改分销商订单消耗明细
export function updateDaily(data) {
  return request({
    url: '/distributor/daily',
    method: 'put',
    data: data
  })
}

// 删除分销商订单消耗明细
export function delDaily(consumptionId) {
  return request({
    url: '/distributor/daily/' + consumptionId,
    method: 'delete'
  })
}
