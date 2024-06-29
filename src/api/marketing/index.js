import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/callRecords/page',
    method: 'post',
    data: query,
  })
}

// 新增信息
export function add(data) {
    return request({
      url: '/callRecords/save',
      method: 'post',
      data: data
    })
  }
  export function edit(data) {
    return request({
      url: '/callRecords/edit',
      method: 'post',
      data: data
    })
  }
  export function handleDelete (id) {
    return request({
      url: `/callRecords/delete/${id}`,
      method: 'get',
    })
  }
  
export function getInfo(id) {
  return request({
    url: `/callRecords/getById/${id}`,
    method: 'get',
  })
}

export function cancelBind(query) {
  return request({
    url: '/selfProduct/cancelBinding',
    method: 'post',
    data: query,
  })
}