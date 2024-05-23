import request from '@/utils/request'

// 查询产品信息列表
export function getList(query) {
  return request({
    url: '/api/selfGoods/page',
    method: 'post',
    data: query,
  })
}
export function getProductAll(query) {
  return request({
    url: '/api/selfGoods/queryProductAllList',
    method: 'post',
    data: query,
  })
}

// 查询产品信息详细
export function getInfo(id) {
  return request({
    url: `/api/selfGoods/getById/${id}`,
    method: 'get',
  })
}

// 新增产品信息
export function add(data) {
  return request({
    url: '/api/selfGoods/save',
    method: 'post',
    data: data
  })
}
export function edit(data) {
  return request({
    url: '/api/selfGoods/edit',
    method: 'post',
    data: data
  })
}
export function handleDelete (id) {
  return request({
    url: `/api/selfGoods/delete/${id}`,
    method: 'get',
  })
}

