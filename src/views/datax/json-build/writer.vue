<template>
  <div class="app-container">
    <MysqlWriter ref="writer" />
  </div>
</template>

<script>
import MysqlWriter from './writer/testWriter'
export default {
  name: 'Reader',
  components: { MysqlWriter },
  methods: {
    getData() {
      return this.$refs.writer.getData()
    }
  }
}
</script>
