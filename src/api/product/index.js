import request from '@/utils/request'

// 查询产品信息列表
export function getList(query) {
  return request({
    url: '/selfProduct/page',
    method: 'post',
    data: query,
  })
}
export function getSuppliersList(query) {
  return request({
    url: '/selfSuppliers/page',
    method: 'post',
    data: query,
  })
}
export function getProductAll(query) {
  return request({
    url: '/selfProduct/page',
    method: 'post',
    data: query,
  })
}

// 查询产品信息详细
export function getInfo(id) {
  return request({
    url: `/selfProduct/getById/${id}`,
    method: 'get',
  })
}

// 新增产品信息
export function add(data) {
  return request({
    url: '/selfProduct/save',
    method: 'post',
    data: data
  })
}

// 修改产品信息
export function edit(data) {
  return request({
    url: '/selfProduct/edit',
    method: 'post',
    data: data
  })
}

export function cancelBind(data) {
  return request({
    url: '/selfGoods/cancelBinding',
    method: 'post',
    data: data
  })
}
