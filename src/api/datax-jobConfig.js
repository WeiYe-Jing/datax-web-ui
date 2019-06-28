import request from '@/utils/request'

// 抽取任务

export function paged(params) {
  return request({
    url: '/jobConfig',
    method: 'get',
    params
  })
}

export function fetch(params) {
  return request({
    url: '/jobConfig/' + params,
    method: 'get'
  })
}

export function updated(data) {
  return request({
    url: '/jobConfig/',
    method: 'put',
    data
  })
}

export function created(data) {
  return request({
    url: '/jobConfig/',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return request({
    url: '/jobConfig/',
    method: 'delete',
    params: data
  })
}

export function viewJobLog(params) {
  return request({
    url: '/viewJobLog',
    method: 'get',
    params
  })
}
