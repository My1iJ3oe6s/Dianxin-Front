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
  