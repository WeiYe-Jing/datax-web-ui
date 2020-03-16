<template>
  <div class="app-container">
    <RDBMSReader v-if="dataSource!=='hive' && dataSource!=='hbase'" ref="rdbmsreader" @selectDataSource="showDataSource" />
    <HiveReader v-if="dataSource==='hive'" ref="hivereader" @selectDataSource="showDataSource" />
    <HBaseReader v-if="dataSource==='hbase'" ref="hbasereader" @selectDataSource="showDataSource" />
    <MongoDBReader v-if="dataSource==='mongodb'" ref="mongodbreader" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSReader from './reader/RDBMSReader'
import HiveReader from './reader/HiveReader'
import HBaseReader from './reader/HBaseReader'
import MongoDBReader from './reader/MongoDBReader'
export default {
  name: 'Reader',
  components: { RDBMSReader, HiveReader, HBaseReader, MongoDBReader },
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
      } else if (this.dataSource === 'mongodb') {
        return this.$refs.mongodbreader.getData()
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
