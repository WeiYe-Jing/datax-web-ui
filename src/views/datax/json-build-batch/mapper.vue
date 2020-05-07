<template>
  <div class="app-container">
    <TableMapper ref="mapper" />
  </div>
</template>
<script>
import TableMapper from './components/tableMapper'
export default {
  name: 'Mapper',
  components: { TableMapper },
  methods: {
    sendTables(fromTablesList, toTablesList) {
      this.$refs.mapper.fromTablesList = fromTablesList
      this.$refs.mapper.toTablesList = toTablesList
    },
    getLColumns() {
      return this.$refs.mapper.getLColumns()
    },
    getRColumns() {
      return this.$refs.mapper.getRColumns()
    }
  }
}
</script>
