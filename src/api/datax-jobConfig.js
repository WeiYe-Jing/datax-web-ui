import request from '@/utils/request'

// 抽取任务

export function paged(params) {
  return request({
    url: '/api/jobConfig',
    method: 'get',
    params
  })
}

export function fetch(params) {
  return request({
    url: '/api/jobConfig/' + params,
    method: 'get'
  })
}

export function updated(data) {
  return request({
    url: '/api/jobConfig/',
    method: 'put',
    data
  })
}

export function created(data) {
  return request({
    url: '/api/jobConfig/',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return request({
    url: '/api/jobConfig/',
    method: 'delete',
    params: data
  })
}

export function viewJobLog(params) {
  return request({
    url: '/api/viewJobLog',
    method: 'get',
    params
  })
}
