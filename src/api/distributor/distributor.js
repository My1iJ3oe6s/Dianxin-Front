import request from '@/utils/request'

// 查询分销商列表
export function listDistributor(query) {
  return request({
    url: '/distributor/distributor/list',
    method: 'get',
    params: query
  })
}

// 查询分销商详细
export function getDistributor(distributorId) {
  return request({
    url: '/distributor/distributor/' + distributorId,
    method: 'get'
  })
}

// 新增分销商
export function addDistributor(data) {
  return request({
    url: '/distributor/distributor',
    method: 'post',
    data: data
  })
}

// 修改分销商
export function updateDistributor(data) {
  return request({
    url: '/distributor/distributor',
    method: 'put',
    data: data
  })
}

// 删除分销商
export function delDistributor(distributorId) {
  return request({
    url: '/distributor/distributor/' + distributorId,
    method: 'delete'
  })
}
