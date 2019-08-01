<template>
  <div class="app-container">
    <div class="build-container">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1" description="构建reader">1</el-step>
        <el-step title="步骤 2" description="构建writer">2</el-step>
      </el-steps>

      <!-- <el-button style="margin-top: 12px;" @click="last">上一步</el-button> -->
      <el-button style="margin-top: 12px;margin-bottom: 12px;" @click="next">下一步</el-button>

      <div v-show="active===1" class="step1">
        <el-form label-position="left" label-width="80px" :model="readerForm">
          <el-form-item label="数据源">
            <el-select
              v-model="readerForm.id"
              filterable
              @change="rDsChange"
            >
              <el-option
                v-for="item in rDsList"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="表">
            <el-select
              v-model="readerForm.tableName"
              filterable
              @change="rTbChange"
            >
              <el-option
                v-for="item in rTbList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字段">
            <el-transfer
              v-model="readerForm.columns"
              filterable
              :data="rColumnList"
              :titles="['可选字段', '抽取的字段']"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active===2" class="step1">222222</div>
    </div>
    <div style="margin-bottom: 100px;" />
    <json-editor ref="jsonEditor" v-model="configJson" />
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/ds-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import JsonEditor from '@/components/JsonEditor'

export default {
  components: { JsonEditor },
  data() {
    return {
      configJson: '',
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
        columns: []
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
    // reader 获取表名
    getRTables() {
      // 组装
      dsQueryApi.getTables(this.readerForm).then(response => {
        this.rTbList = response
      })
    },
    last() {
      if (this.active-- < 1) this.active = 1
    },
    next() {
      // 第一步 reader 判断是否已选字段
      if (this.active === 1) {
        if (this.readerForm.columns.length > 0) {
          this.active++
        } else {
          this.$message({
            message: '无法进行下一步',
            type: 'warning'
          })
        }
      } else {
        // 切回第一步
        this.active = 1
      }
    },
    // reader 数据源切换
    rDsChange(e) {
      // 清空
      this.readerForm.tableName = ''
      this.readerForm.datasourceId = e
      // 获取可用表
      this.getRTables()
    },
    // 获取reader表字段
    getRColumns() {
      // 组装
      dsQueryApi.getColumns(this.readerForm).then(response => {
        const data = []
        console.log(response)
        for (let i = 1; i <= response.length; i++) {
          data.push({
            key: 'r-c-' + i,
            label: response[i],
            disabled: false
          })
        }
        console.log(data)
        this.rColumnList = data
      })
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t
      this.getRColumns()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
