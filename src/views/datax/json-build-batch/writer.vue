<template>
  <div class="app-container">
    <TableWriter ref="rdbmswriter" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import TableWriter from './writer/tableWriter'

export default {
  name: 'Writer',
  components: { TableWriter },
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
