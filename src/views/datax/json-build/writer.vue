<template>
  <div class="app-container">
    <RDBMSWriter v-show="dataSource!=='hive'" ref="rdbmswriter" @selectDataSource="showDataSource" />
    <HiveWriter v-show="dataSource==='hive'" ref="hivewriter" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSWriter from './writer/RDBMSWriter'
import HiveWriter from './writer/HiveWriter'
export default {
  name: 'Writer',
  components: { RDBMSWriter, HiveWriter },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getData()
      } else {
        return this.$refs.rdbmswriter.getData()
      }
    },
    getTableName() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getTableName()
      } else {
        return this.$refs.rdbmswriter.getTableName()
      }
    },
    getReaderData() {
      return this.$parent.getReaderData()
    },
    showDataSource(data) {
      this.dataSource = data
    },
    sendTableNameAndColumns(fromTableName, fromColumnList) {
      this.$refs.hivewriter.fromTableName = fromTableName
      this.$refs.hivewriter.fromColumnList = fromColumnList
    }
  }
}
</script>
