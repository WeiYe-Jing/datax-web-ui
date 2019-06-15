<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRunJob">
        启动任务
      </el-button>
      <el-select v-model="pluginId" placeholder="Type" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in pluginList" :key="item.id" :label="item.pluginName" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleLoadTmp">
        加载模板
      </el-button>
    </div>
    <div class="editor-container">
      <json-editor ref="jsonEditor" v-model="templateJson" />
    </div>
  </div>
</template>

<script>
import { runJob } from "@/api/datax-job";
// import { getList, fetchPlugin } from "@/api/datax-plugin";
import JsonEditor from '@/components/JsonEditor'

export default {
  components: { JsonEditor },
  data() {
    return {
      templateJson: JSON.parse('{"job":{"setting":{"speed":{"channel":3},"errorLimit":{"record":0,"percentage":0.02}},"content":[{"reader":{"name":"mysqlreader","parameter":{"username":"root","password":"root","column":["id","name"],"splitPk":"db_id","connection":[{"table":["table"],"jdbcUrl":["jdbc:mysql://127.0.0.1:3306/database"]}]}},"writer":{"name":"streamwriter","parameter":{"print":true}}}]}}'),
      pluginList: [1, 2],
      pluginId: undefined
    };
  },
  created() {
    // 获取所有模板
    // getList().then(response => {
    //   console.log(response)
    //   const { records } = response
    //   this.pluginList = records
    // })
  },
  methods: {
    // 加载模板
    handleLoadTmp() {
      this.$message('coming soon');
      // console.log(this.pluginId)
      // for (const v of this.pluginList) {
      //   if (v.id === this.pluginId) {
      //     const index = this.pluginList.indexOf(v)
      //     this.templateJson = v.templateJson
      //     break
      //   }
      // }
    },
    // 启动任务
    handleRunJob() {
      runJob(this.templateJson).then(response => {
        this.$notify({
          title: 'Success',
          message: '启动成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>
