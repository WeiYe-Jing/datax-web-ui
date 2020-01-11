<template>
  <div class="app-container">
    <RDBMSReader v-show="dataSource!=='hive'" ref="rdbmsreader" @selectDataSource="showDataSource" />
    <HiveReader v-show="dataSource==='hive'" ref="hivereader" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSReader from './reader/RDBMSReader'
import HiveReader from './reader/HiveReader'
export default {
  name: 'Reader',
  components: { RDBMSReader, HiveReader },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivereader.getData()
      } else {
        return this.$refs.rdbmsreader.getData()
      }
    },
    showDataSource(data) {
      this.dataSource = data
    }
  }
}
</script>
