import request from '@/utils/request'

// datax插件api

export function getList(params) {
  return request({
    url: '/dataxPlugin',
    method: 'get',
    params
  })
}
