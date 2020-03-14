<template>
  <div class="app-container">
    <RDBMSWriter v-if="dataSource!=='hive' && dataSource!=='hbase'" ref="rdbmswriter" @selectDataSource="showDataSource" />
    <HiveWriter v-if="dataSource==='hive'" ref="hivewriter" @selectDataSource="showDataSource" />
    <HBaseWriter v-if="dataSource==='hbase'" ref="hbasewriter" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSWriter from './writer/RDBMSWriter'
import HiveWriter from './writer/HiveWriter'
import HBaseWriter from './writer/HBaseWriter'
export default {
  name: 'Writer',
  components: { RDBMSWriter, HiveWriter, HBaseWriter },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getData()
      } else if (this.dataSource === 'hbase') {
        return this.$refs.hbasewriter.getData()
      } else {
        return this.$refs.rdbmswriter.getData()
      }
    },
    getTableName() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getTableName()
      } else if (this.dataSource === 'hbase') {
        return this.$refs.HBaseReader.getData()
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
