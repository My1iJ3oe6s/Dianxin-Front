import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/api/selfSuppliers/page',
    method: 'post',
    data: query,
  })
}

// 新增产品信息
export function add(data) {
    return request({
      url: '/api/selfSuppliers/save',
      method: 'post',
      data: data
    })
  }
  export function edit(data) {
    return request({
      url: '/api/selfSuppliers/edit',
      method: 'post',
      data: data
    })
  }
  export function handleDelete (id) {
    return request({
      url: `/api/selfSuppliers/delete/${id}`,
      method: 'get',
    })
  }
  
export function getInfo(id) {
  return request({
    url: `/api/selfSuppliers/getById/${id}`,
    method: 'get',
  })
}