import request from '@/utils/request'

// 任务管理

export function runJob(data) {
  return request({
    url: '/runJob',
    method: 'post',
    data
  })
}
