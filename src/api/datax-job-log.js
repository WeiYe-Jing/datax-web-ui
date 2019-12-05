import request from '@/utils/request'

// datax插件api

export function getList(params) {
  return request({
    url: 'api/log/pageList',
    method: 'get',
    params
  })
}

export function triggerJob(data) {
  return request({
    url: '/api/job/trigger',
    method: 'post',
    data
  })
}

export function startJob(id) {
  return request({
    url: '/api/job/start?id=' + id,
    method: 'post'
  })
}

export function getExecutorList() {
  return request({
    url: 'api/jobgroup/list',
    method: 'get'
  })
}

export function getJobConfigList() {
  return request({
    url: '/api/jobConfig/all',
    method: 'get'
  })
}

export function updateJob(data) {
  return request({
    url: '/api/job/update',
    method: 'post',
    data
  })
}

export function createJob(data) {
  return request({
    url: '/api/job/add/',
    method: 'post',
    data
  })
}

export function clearLog(jobGroup, jobId, type) {
  return request({
    url: '/api/log/clearLog?jobGroup=' + jobGroup + '&jobId=' + jobId + '&type=' + type,
    method: 'post'
  })
}

export function viewJobLog(executorAddress, triggerTime, logId, fromLineNum) {
  return request({
    url: '/api/log/logDetailCat?executorAddress=' + executorAddress + '&triggerTime=' + triggerTime + '&logId=' + logId + '&fromLineNum=' + fromLineNum,
    method: 'get'
  })
}
