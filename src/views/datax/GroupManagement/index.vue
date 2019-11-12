<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="groupName" clearable placeholder="分组名" style="width: 200px;">
        <el-option v-for="item in options1" :key="item.key" :label="item.text" :value="item.value" />
      </el-select>
      <el-select v-model="Type" clearable placeholder="类型" style="width: 200px;">
        <el-option v-for="item in options2" :key="item.key" :label="item.text" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
      <el-table-column label="序号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="分组名" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.gn }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.tp }}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.isStart }}
        </template>
      </el-table-column>
      <el-table-column label="说明" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.dc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupName: 1,
      options1: [
        { value: 1, text: '金三数据源' },
        { value: 2, text: '数据同步' }
      ],
      Type: 1,
      options2: [
        { value: 1, text: '数据源' },
        { value: 2, text: '作业同步' }
      ]
    }
  }
}
</script>
