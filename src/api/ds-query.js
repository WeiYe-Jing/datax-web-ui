import request from '@/utils/request'

// 数据库信息api

// 获取表名
export function getTables(params) {
  return request({
    url: '/api/jdbcDatasourceQuery/getTables',
    method: 'get',
    params
  })
}

// 获取字段
export function getColumns(params) {
  return request({
    url: '/api/jdbcDatasourceQuery/getColumns',
    method: 'get',
    params
  })
}

// 根据sql获取字段
export function getColumnsByQuerySql(params) {
  return request({
    url: '/api/jdbcDatasourceQuery/getColumnsByQuerySql',
    method: 'get',
    params
  })
}
