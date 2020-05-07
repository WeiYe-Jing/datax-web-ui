<template>
  <div class="app-container">
    <RDBMSReader ref="rdbmsreader" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSReader from './reader/reader'
export default {
  name: 'Reader',
  components: { RDBMSReader },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      return this.$refs.rdbmsreader.getData()
    },
    showDataSource(data) {
      this.dataSource = data
      this.getData()
    }
  }
}
</script>
