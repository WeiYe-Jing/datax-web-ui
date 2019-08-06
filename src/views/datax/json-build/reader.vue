<template>
  <div class="app-container">
    <MysqlReader ref="reader" />
  </div>
</template>

<script>
import MysqlReader from './reader/mysqlReader'
export default {
  name: 'Reader',
  components: { MysqlReader },
  methods: {
    getData() {
      return this.$refs.reader.getData()
    }
  }
}
</script>
