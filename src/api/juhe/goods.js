import request from '@/utils/request'

// 查询商品列表
export function listGoods(query) {
  return request({
    url: '/stockgoods/stockgoods/query',
    method: 'get',
    params: query
  })
}

// 获取商品订购链接
export function getOrderUrl(goodsId) {
  return request({
    url: '/stockgoods/stockgoods/' + goodsId,
    method: 'get',
    //params: { goodsId }
  })
}
