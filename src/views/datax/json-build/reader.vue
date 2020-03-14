<template>
  <div class="app-container">
    <RDBMSReader v-if="dataSource!=='hive' && dataSource!=='hbase'" ref="rdbmsreader" @selectDataSource="showDataSource" />
    <HiveReader v-if="dataSource==='hive'" ref="hivereader" @selectDataSource="showDataSource" />
    <HBaseReader v-if="dataSource==='hbase'" ref="hbasereader" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSReader from './reader/RDBMSReader'
import HiveReader from './reader/HiveReader'
import HBaseReader from './reader/HBaseReader'
export default {
  name: 'Reader',
  components: { RDBMSReader, HiveReader, HBaseReader },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivereader.getData()
      } else if (this.dataSource === 'hbase') {
        return this.$refs.hbasereader.getData()
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
