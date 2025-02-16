import request from '@/utils/request'

// 查询产品信息列表
export function getList(query) {
  if(location.pathname == '/goods/index'){
    query.queryParameters.orderType = 1  }
  return request({
    url: '/selfGoods/page',
    method: 'post',
    data: query,
  })
}
export function getProductAll(query) {
  return request({
    url: '/selfGoods/queryProductAllList',
    method: 'post',
    data: query,
  })
}

// 查询产品信息详细
export function getInfo(id) {
  return request({
    url: `/selfGoods/getById/${id}`,
    method: 'get',
  })
}

// 新增产品信息
export function add(data) {
  data.orderType = 1
  return request({
    url: '/selfGoods/saveGoodsAndProduct',
    method: 'post',
    data: data
  })
}
export function edit(data) {
  data.orderType = 1
  return request({
    url: '/selfGoods/edit',
    method: 'post',
    data: data
  })
}
export function handleDelete (id) {
  return request({
    url: `/selfGoods/delete/${id}`,
    method: 'get',
  })
}

export function getImg (id) {
  return request({
    url: `/file/getById/${id}`,
    method: 'get',
  })
}
// 绑定产品
export function bindProduct(data) {
  data.orderType = 1
  return request({
    url: '/selfGoods/bindingProduct',
    method: 'post',
    data: data
  })
}
// 企业信息
export function companyInfo() {
  return request({
    url: '/selfGoods/company',
    method: 'post',
  })
}
