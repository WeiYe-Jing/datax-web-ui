<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.registryKey" placeholder="执行器" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        Search
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
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="执行器" align="center">
        <template slot-scope="scope">{{ scope.row.registryKey }}</template>
      </el-table-column>
      <el-table-column label="注册地址" align="center">
        <template slot-scope="scope">{{ scope.row.registryValue }}</template>
      </el-table-column>
      <el-table-column label="CPU使用率" align="center">
        <template slot-scope="scope">{{ scope.row.cpuUsage }}%</template>
      </el-table-column>
      <el-table-column label="内存使用率" align="center">
        <template slot-scope="scope">{{ scope.row.memoryUsage }}%</template>
      </el-table-column>
      <el-table-column label="平均负载" align="center">
        <template slot-scope="scope">{{ scope.row.loadAverage }}</template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getList } from '@/api/datax-registry'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Registry',
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
        current: 1,
        size: 10,
        registryKey: undefined
      },
      dialogPluginVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        const { records } = response
        const { total } = response
        this.total = total
        this.list = records
        this.listLoading = false
      })
    }
  }
}
</script>
