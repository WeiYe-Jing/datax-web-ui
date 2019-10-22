<template>
  <div class="app-container">
    <el-form label-position="left" label-width="80px" :model="readerForm">
      <el-form-item label="数据源">
        <el-select v-model="readerForm.id" filterable @change="rDsChange">
          <el-option
            v-for="item in rDsList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表">
        <el-select v-model="readerForm.tableName" filterable @change="rTbChange">
          <el-option v-for="item in rTbList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="querySql" prop="querySql">
        <el-input v-model="readerForm.querySql" :autosize="{ minRows: 3, maxRows: 20}" type="textarea" placeholder="sql查询，一般用于多表关联查询时才用" />
        <el-button @click.prevent="getColumns('reader')">解析字段</el-button>
      </el-form-item>
      <el-form-item label="字段">
        <el-checkbox
          v-model="readerForm.checkAll"
          :indeterminate="readerForm.isIndeterminate"
          @change="rHandleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="readerForm.columns" @change="rHandleCheckedChange">
          <el-checkbox v-for="c in rColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="where" prop="where">
        <el-input v-model="readerForm.where" placeholder="where条件" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/ds-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'

export default {
  name: 'MysqlReader',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 50
      },
      rDsList: [],
      rTbList: [],
      rColumnList: [],
      loading: false,
      active: 1,
      readerForm: {
        datasourceId: undefined,
        tableName: '',
        columns: [],
        where: '',
        querySql: '',
        checkAll: false,
        isIndeterminate: true
      }
    }
  },
  created() {
    this.getJdbcDs()
  },
  methods: {
    // 获取可用数据源
    getJdbcDs() {
      this.loading = true
      jdbcDsList(this.jdbcDsQuery).then(response => {
        const { records } = response
        this.rDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables(type) {
      if (type === 'reader') {
        const obj = {
          datasourceId: this.readerForm.datasourceId
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.rTbList = response
        })
      }
    },
    // reader 数据源切换
    rDsChange(e) {
      // 清空
      this.readerForm.tableName = ''
      this.readerForm.datasourceId = e
      // 获取可用表
      this.getTables('reader')
    },
    getTableColumns() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        tableName: this.readerForm.tableName
      }
      dsQueryApi.getColumns(obj).then(response => {
        this.rColumnList = response
        this.readerForm.columns = response
        this.readerForm.checkAll = true
        this.readerForm.isIndeterminate = false
      })
    },
    getColumnsByQuerySql() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        querySql: this.readerForm.querySql
      }
      dsQueryApi.getColumnsByQuerySql(obj).then(response => {
        this.rColumnList = response
        this.readerForm.columns = response
        this.readerForm.checkAll = true
        this.readerForm.isIndeterminate = false
      })
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        if (this.readerForm.querySql !== '') {
          this.getColumnsByQuerySql()
        } else {
          this.getTableColumns()
        }
      }
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t
      this.rColumnList = []
      this.readerForm.columns = []
      this.getColumns('reader')
    },
    rHandleCheckAllChange(val) {
      this.readerForm.columns = val ? this.rColumnList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.rColumnList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.rColumnList.length
    },
    getData() {
      return this.readerForm
    }
  }
}
</script>
