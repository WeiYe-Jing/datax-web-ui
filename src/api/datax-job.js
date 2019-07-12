import request from '@/utils/request'

// 任务管理

export function runJob(data) {
  return request({
    url: '/api/runJob',
    method: 'post',
    data
  })
}

export function runJobLog(data) {
  return request({
    url: '/api/runJobLog',
    method: 'post',
    data
  })
}
