<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="pluginType" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.pluginType }}</template>
      </el-table-column>
      <el-table-column label="pluginName" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pluginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="templateJson" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.templateJson }}</template>
      </el-table-column>
      <el-table-column label="comments" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.comments }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from "@/api/datax-plugin";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then(response => {
        console.log(response);
        this.list = response.records;
        this.listLoading = false;
      });
    }
  }
};
</script>
