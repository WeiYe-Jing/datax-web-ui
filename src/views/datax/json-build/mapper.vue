<template>
  <div class="app-container">
    <FieldMapper ref="mapper" />
  </div>
</template>
<script>
import FieldMapper from './components/fieldMapper'
export default {
  name: 'Mapper',
  components: { FieldMapper },
  methods: {
    sendColumns(fromColumnsList, toColumnsList) {
      this.$refs.mapper.fromColumnsList = JSON.parse(JSON.stringify(fromColumnsList))
      this.$refs.mapper.toColumnsList = JSON.parse(JSON.stringify(toColumnsList))
      this.$refs.mapper.fromColumnsListChecked = JSON.parse(JSON.stringify(fromColumnsList))
      this.$refs.mapper.toColumnsListChecked = JSON.parse(JSON.stringify(toColumnsList))
      this.$refs.mapper.readerForm.lcolumns = JSON.parse(JSON.stringify(fromColumnsList))
      this.$refs.mapper.readerForm.rcolumns = JSON.parse(JSON.stringify(toColumnsList))
      this.$refs.mapper.readerForm.rules = Array.from(
        { length: fromColumnsList.length },
        (item, index) => ''
      )
    },
    sendRuleSettings() {
      const arrays = []
      arrays.push('Hiding')
      arrays.push('Floor')
      arrays.push('Enumerate')
      arrays.push('Prefix Preserve')
      arrays.push('MD5')
      // arrays.push("EDP");
      // arrays.push("AES");
      // arrays.push("FPE");
      // arrays.push("RSA");
      this.$refs.mapper.ruleSettings = arrays
    },
    getLColumns() {
      return this.$refs.mapper.getLColumns()
    },
    getRColumns() {
      return this.$refs.mapper.getRColumns()
    },
    getRules() {
      return this.$refs.mapper.getRules()
    }
  }
}
</script>
