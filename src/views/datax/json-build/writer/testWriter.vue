<template>
  <div>
    <el-form label-position="left" label-width="80px" :model="writerForm">
      <el-form-item>
        <el-switch
          v-model="writerForm.ifStreamWriter"
          active-text="streamwriter"
          inactive-text="other"
        />
      </el-form-item>
      <el-form-item label="数据源">
        <el-select
          v-model="writerForm.id"
          :disabled="writerForm.ifStreamWriter"
          filterable
          @change="wDsChange"
        >
          <el-option
            v-for="item in wDsList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表">
        <el-select
          v-model="writerForm.tableName"
          :disabled="writerForm.ifStreamWriter"
          filterable
          @change="wTbChange"
        >
          <el-option
            v-for="item in wTbList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字段">
        <el-checkbox v-model="writerForm.checkAll" :indeterminate="writerForm.isIndeterminate" @change="wHandleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="writerForm.columns" @change="wHandleCheckedChange">
          <el-checkbox v-for="c in wColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="preSql" prop="preSql">
        <el-input v-model="writerForm.preSql" placeholder="preSql" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/ds-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
export default {
  name: 'MysqlWriter',
  data() {
    return {
      wDsList: [],
      wTbList: [],
      wColumnList: [],
      writerForm: {
        // 是否用streamwriter
        ifStreamWriter: true,
        datasourceId: undefined,
        tableName: '',
        columns: [],
        checkAll: false,
        isIndeterminate: true,
        preSql: ''
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
        this.wDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables() {
      const obj = {
        datasourceId: this.writerForm.datasourceId
      }
      // 组装
      dsQueryApi.getTables(obj).then(response => {
        this.wTbList = response
      })
    },
    wDsChange(e) {
      // 清空
      this.writerForm.tableName = ''
      this.writerForm.datasourceId = e
      // 获取可用表
      this.getTables()
    },
    // 获取表字段
    getColumns() {
      const obj = {
        datasourceId: this.writerForm.datasourceId,
        tableName: this.writerForm.tableName
      }
      dsQueryApi.getColumns(obj).then(response => {
        this.wColumnList = response
        this.writerForm.columns = response
        this.writerForm.checkAll = true
        this.writerForm.isIndeterminate = false
      })
    },
    // 表切换
    wTbChange(t) {
      this.writerForm.tableName = t
      this.wColumnList = []
      this.writerForm.columns = []
      this.getColumns('writer')
    },
    wHandleCheckAllChange(val) {
      this.writerForm.columns = val ? this.wColumnList : []
      this.writerForm.isIndeterminate = false
    },
    wHandleCheckedChange(value) {
      const checkedCount = value.length
      this.writerForm.checkAll = checkedCount === this.wColumnList.length
      this.writerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.wColumnList.length
    },
    getData() {
      return this.writerForm
    }
  }
}
</script>
