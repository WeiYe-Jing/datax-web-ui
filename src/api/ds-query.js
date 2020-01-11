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

// 根据datasourceID、tablename、columns（数组）拼接的json传给后台三个条件创建表【目标端】
export function createTable(query) {
  return request({
    url: '/api/jdbcDatasourceQuery/createTable',
    method: 'post',
    data: query
  })
}
// 判断字段是否存在，存在，即更新值，否则添加字段
export function updateColumnsValue(query) {
  return request({
    url: '/api/jdbcDatasourceQuery/updateColumnsValue',
    method: 'post',
    data: query
  })
}
