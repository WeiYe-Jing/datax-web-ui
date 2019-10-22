<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRunJob">
        启动任务
      </el-button>
      <el-select v-model="jobId" placeholder="Type" class="filter-item" style="width: 200px" clearable @change="handleJobChange" @clear="handleJobClear">
        <el-option v-for="item in pluginList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="getJobList">
        刷新任务
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-trash" @click="templateJson={}">
        清空json
      </el-button>
      <el-button v-show="jobId" class="filter-item" type="primary" icon="el-icon-document" @click="handleViewJobLog">
        查看日志
      </el-button>
    </div>

    <div class="editor-container">
      <div style="width: 90%; margin-bottom: 12px;">
        <el-input v-model="dynamicArgs" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" placeholder="动态参数配置，如无请忽略" />
        <el-button class="filter-item" type="default" icon="el-icon-refresh" @click="extractGetDynamicArgs">
          解析动态参数
        </el-button>
      </div>
      <json-editor ref="jsonEditor" v-model="templateJson" />
    </div>

    <el-dialog title="日志查看" :visible.sync="logShow">
      <div class="log-container">
        <pre :loading="logLoading" v-text="logContent" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loadLog()">
          刷新日志
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { runJob, runJobLog } from '@/api/datax-job'
import { paged as jobConfigPaged, viewJobLog } from '@/api/datax-jobConfig'
import JsonEditor from '@/components/JsonEditor'

export default {
  components: { JsonEditor },
  data() {
    return {
      templateJson: {},
      // 查询参数
      listQuery: {
        current: 1,
        size: 200
      },
      pluginList: [1, 2],
      jobId: undefined,
      // 日志查询参数
      jobLogQuery: {
        id: undefined,
        fromLineNum: 0
      },
      // 日志内容
      logContent: undefined,
      // 显示日志
      logShow: false,
      // 日志显示加载中效果
      logLoading: false,
      // 动态参数
      dynamicArgs: ''
    }
  },
  created() {
    // 获取所有模板，取200条，差不多了吧~
    // todo 先全部加载出来, 后面改成分组
    this.getJobList()
  },
  methods: {
    // 获取模板
    getJobList() {
      jobConfigPaged(this.listQuery).then(response => {
        console.log(response)
        this.jobId = undefined
        this.jobLogQuery.fromLineNum = 0
        this.logContent = undefined
        const { records } = response
        this.pluginList = records
      })
    },
    // 启动任务
    handleRunJob() {
      const obj = {
        jobConfigId: this.jobId,
        jobJson: this.templateJson,
        dynamicArgs: this.dynamicArgs
      }
      // 根据是否有 jobId 调不同的接口
      if (this.jobId === undefined) {
        runJob(obj).then(response => {
          this.$notify({
            title: 'Success',
            message: '启动成功',
            type: 'success',
            duration: 2000
          })
          // 显示日志
          this.handleViewJobLog()
        })
      } else {
        runJobLog(obj).then(response => {
          this.$notify({
            title: 'Success',
            message: '启动成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    // 查看日志
    handleViewJobLog() {
      if (this.jobId === undefined) {
        return
      }
      this.jobLogQuery.id = this.jobId
      if (this.logShow === false) {
        this.logShow = true
      }
      this.loadLog()
    },
    // 加载日志
    loadLog() {
      this.logLoading = true
      viewJobLog(this.jobLogQuery).then(response => {
        // console.log(response)
        // 判断是否是 '\n'，如果是表示显示完成，不重新加载
        if (response.logContent === '\n') {
          // this.jobLogQuery.fromLineNum = response.toLineNum - 20;
          // 重新加载
          // setTimeout(() => {
          //   this.loadLog()
          // }, 2000);
        } else {
          // 后续改进
          // this.jobLogQuery.fromLineNum = response.toLineNum
          this.logContent = response.logContent
        }
        this.logLoading = false
      })
    },
    // 选择任务事件
    handleJobChange(e) {
      this.jobId = e
      this.jobLogQuery.fromLineNum = 0
      for (const v of this.pluginList) {
        if (v.id === this.jobId) {
          this.templateJson = JSON.parse(v.configJson)
          break
        }
      }
    },
    // 清空选项事件
    handleJobClear() {
      this.jobId = undefined
      this.logShow = false
      this.logContent = undefined
    },
    // 从 json 中取出动态参数
    extractGetDynamicArgs() {
      // exec 只返回一个  /\$\{\w+\}/.exec(this.templateJson)
      // 取 ${xxx}
      const argsf = this.templateJson.match(/\$\{\w+\}/g)
      console.log(argsf)
      // 取属性名
      const args = argsf.map(i => /\w+/.exec(i)[0])
      // 转成 json obj
      const argsArray = []
      const a = {}
      args.forEach(e => {
        a[e] = ''
      })
      console.log(argsArray)
      // todo 判断是否已有，不覆盖原值
      this.dynamicArgs = JSON.stringify(a)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container{
  position: relative;
  height: 100%;
}
.log-container{
  margin-bottom: 20px;
  background: #f5f5f5;
  width: 100%;
  height: 500px;
  overflow: scroll;
  pre {
    display: block;
    padding: 10px;
    margin: 0 0 10.5px;
    word-break: break-all;
    word-wrap: break-word;
    color: #334851;
    background-color: #f5f5f5;
    // border: 1px solid #ccd1d3;
    border-radius: 1px;
  }
}
</style>
