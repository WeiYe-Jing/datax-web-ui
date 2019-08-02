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
      <div v-show="active===2" class="step2">
        <el-form label-position="left" label-width="80px" :model="readerForm">
          <el-form-item>
            <el-switch
              v-model="ifStreamWriter"
              active-text="streamwriter"
              inactive-text="other"
            />
          </el-form-item>
          <el-form-item label="数据源">
            <el-select
              v-model="writerForm.id"
              :disabled="ifStreamWriter"
              filterable
              @change="wDsChange"
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
              v-model="writerForm.tableName"
              :disabled="ifStreamWriter"
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
            <el-transfer
              v-model="writerForm.columns"
              :disabled="ifStreamWriter"
              filterable
              :data="wColumnList"
              :titles="['可选字段', '抽取的字段']"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="beforeBuildJson">构建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <div style="margin-bottom: 100px;" /> -->
    <json-editor v-show="active===2" ref="jsonEditor" v-model="configJson" />
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/ds-query'
import * as dataxJsonApi from '@/api/datax-json'
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
      },
      // 是否用streamwriter
      ifStreamWriter: true,
      wDsList: [],
      wTbList: [],
      wColumnList: [],
      writerForm: {
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
      } else if (type === 'writer') {
        const obj = {
          datasourceId: this.writerForm.datasourceId
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.wTbList = response
        })
      }
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
      this.getTables('reader')
    },
    wDsChange(e) {
      // 清空
      this.writerForm.tableName = ''
      this.writerForm.datasourceId = e
      // 获取可用表
      this.getTables('writer')
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        const obj = {
          datasourceId: this.readerForm.datasourceId,
          tableName: this.readerForm.tableName
        }
        dsQueryApi.getColumns(obj).then(response => {
          const data = []
          console.log(response)
          response.forEach(e => {
            data.push({
              key: e,
              label: e,
              disabled: false
            })
          })
          this.rColumnList = data
        })
      } else if (type === 'writer') {
        const obj = {
          datasourceId: this.writerForm.datasourceId,
          tableName: this.writerForm.tableName
        }
        dsQueryApi.getColumns(obj).then(response => {
          const data = []
          console.log(response)
          response.forEach(e => {
            data.push({
              key: e,
              label: e,
              disabled: false
            })
          })
          console.log(data)
          this.wColumnList = data
        })
      }
      // 组装
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t
      this.rColumnList = []
      this.readerForm.columns = []
      this.getColumns('reader')
    },
    wTbChange(t) {
      this.writerForm.tableName = t
      this.wColumnList = []
      this.writerForm.columns = []
      this.getColumns('writer')
    },
    beforeBuildJson() {
      if (this.writerForm.columns.length > 0 || this.ifStreamWriter === true) {
        this.buildJson()
      }
    },
    // 构建json
    buildJson() {
      console.info(this.readerForm)
      const obj = {
        readerDatasourceId: this.readerForm.datasourceId,
        readerTables: [this.readerForm.tableName],
        readerColumns: this.readerForm.columns,
        ifStreamWriter: this.ifStreamWriter,
        writerDatasourceId: this.writerForm.datasourceId,
        writerTables: [this.writerForm.tableName],
        writerColumns: this.writerForm.columns
      }
      console.info(obj)
      // 调api
      dataxJsonApi.buildJobJson(obj).then(response => {
        console.log(response)
        this.configJson = JSON.parse(response)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
