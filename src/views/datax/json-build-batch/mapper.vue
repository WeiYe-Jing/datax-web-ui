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
    sendColumns(fromColumnsList, toColumnsList) {
      this.$refs.mapper.fromColumnsList = fromColumnsList
      this.$refs.mapper.toColumnsList = toColumnsList
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
