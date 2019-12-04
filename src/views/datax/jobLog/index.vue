<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.jobId" placeholder="任务ID" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.jobGroup" placeholder="执行器">
        <el-option :key="-1" :label="全部" :value="-1" />
        <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.logStatus" clearable placeholder="类型" style="width: 200px;">
        <el-option v-for="item in logStatusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handlerDelete">
        Clear
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="任务ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="调度时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.triggerTime }}</template>
      </el-table-column>
      <el-table-column label="调度结果" align="center" width="200">
        <template slot-scope="scope"> {{ statusList.find(t => t.value === scope.row.triggerCode).label }}</template>
      </el-table-column>
      <el-table-column label="调度备注" align="center" width="200">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
          >
            <h5 v-html="scope.row.triggerMsg" />
            <el-button slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.handleTime }}</template>
      </el-table-column>
      <el-table-column label="执行结果" align="center" width="200">
        <template slot-scope="scope"> {{ statusList.find(t => t.value === scope.row.handleCode).label }}</template>
      </el-table-column>
      <el-table-column label="执行备注" align="center" width="200">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
          >
            <h5 v-html="scope.row.handleMsg" />
            <el-button slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click.native="handlerViewLog(row)">执行日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="center" label-width="100px">
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="执行器">
              <el-input size="medium" value="全部" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="任务">
              <el-input size="medium" value="全部" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="执行器">
              <el-select v-model="temp.deleteType" placeholder="请选择执行器" style="width: 230px">
                <el-option v-for="item in deleteTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="deleteLog">
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPluginVisible" title="Reading statistics">
      <el-table :data="pluginData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as log from '@/api/datax-job-log'
import * as job from '@/api/datax-job-info'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'JobInfo',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 0,
        size: 10,
        jobGroup: 0,
        jobId: 0,
        logStatus: -1,
        filterTime: ''
      },
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      executorList: '',
      textMap: {
        create: 'Clear'
      },
      rules: {
      },
      temp: {
        deleteType: '',
        jobGroup: 0,
        jobId: 0
      },
      statusList: [
        { value: 500, label: '失败' },
        { value: 502, label: '失败(超时)' },
        { value: 200, label: '成功' },
        { value: 0, label: '无' }
      ],
      deleteTypeList: [
        { value: 1, label: '清理一个月之前日志数据' },
        { value: 2, label: '清理三个月之前日志数据' },
        { value: 3, label: '清理六个月之前日志数据' },
        { value: 4, label: '清理一年之前日志数据' },
        { value: 5, label: '清理一千条以前日志数据' },
        { value: 6, label: '清理一万条以前日志数据' },
        { value: 7, label: '清理三万条以前日志数据' },
        { value: 8, label: '清理十万条以前日志数据' },
        { value: 9, label: '清理所有日志数据' }
      ],
      logStatusList: [
        { value: -1, label: '全部' },
        { value: 1, label: '成功' },
        { value: 2, label: '失败' },
        { value: 3, label: '进行中' }
      ]
    }
  },
  created() {
    this.fetchData()
    this.getExecutor()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      log.getList(this.listQuery).then(response => {
        const { content } = response
        this.total = content.recordsTotal
        this.list = content.data
        this.listLoading = false
      })
    },
    getExecutor() {
      job.getExecutorList().then(response => {
        const { content } = response
        this.executorList = content
      })
    },
    handlerDelete() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteLog() {
      log.clearLog(this.temp.jobGroup, this.temp.jobId, this.temp.deleteType).then(response => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      // const index = this.list.indexOf(row)
    },
    // 查看日志
    handlerViewLog(row) {
      log.viewJobLog(row.id).then(response => {
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
    }
  }
}
</script>
