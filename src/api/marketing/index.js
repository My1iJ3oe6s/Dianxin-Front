import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/marketingPlatformConfig/page',
    method: 'post',
    data: query,
  })
}

// 新增信息
export function add(data) {
    return request({
      url: '/marketingPlatformConfig/save',
      method: 'post',
      data: data
    })
  }
  export function edit(data) {
    return request({
      url: '/marketingPlatformConfig/edit',
      method: 'post',
      data: data
    })
  }
  export function handleDelete (id) {
    return request({
      url: `/marketingPlatformConfig/delete/${id}`,
      method: 'get',
    })
  }
  
export function getInfo(id) {
  return request({
    url: `/marketingPlatformConfig/getById/${id}`,
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