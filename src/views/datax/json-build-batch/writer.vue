<template>
  <div class="app-container">
    <RDBMSWriter ref="rdbmswriter" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSWriter from './writer/RDBMSWriter'

export default {
  name: 'Writer',
  components: { RDBMSWriter },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      return this.$refs.rdbmswriter.getData()
    },
    getTableName() {
      return this.$refs.rdbmswriter.getTableName()
    },
    getReaderData() {
      return this.$parent.getReaderData()
    },
    showDataSource(data) {
      this.dataSource = data
      this.getData()
    },
    sendTableNameAndColumns(fromTableName, fromColumnList) {
      this.$refs.hivewriter.fromTableName = fromTableName
      this.$refs.hivewriter.fromColumnList = fromColumnList
    }
  }
}
</script>
