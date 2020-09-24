<template>
  <div class="app-container">
    <RDBMSWriter
      v-show="
        dataSource !== 'hive' &&
          dataSource !== 'hbase' &&
          dataSource !== 'mongodb' &&
          dataSource !== 'rabbitmq'
      "
      ref="rdbmswriter"
      @selectDataSource="showDataSource"
    />
    <HiveWriter
      v-show="dataSource === 'hive'"
      ref="hivewriter"
      @selectDataSource="showDataSource"
    />
    <HBaseWriter
      v-show="dataSource === 'hbase'"
      ref="hbasewriter"
      @selectDataSource="showDataSource"
    />
    <MongoDBWriter
      v-show="dataSource === 'mongodb'"
      ref="mongodbwriter"
      @selectDataSource="showDataSource"
    />
    <RabbitmqWriter
      v-show="dataSource === 'rabbitmq'"
      ref="rabbitmqwriter"
      @selectDataSource="showDataSource"
    />
  </div>
</template>

<script>
import RDBMSWriter from "./writer/RDBMSWriter";
import HiveWriter from "./writer/HiveWriter";
import HBaseWriter from "./writer/HBaseWriter";
import MongoDBWriter from "./writer/MongoDBWriter";
import RabbitmqWriter from "./writer/RabbitmqWriter";
export default {
  name: "Writer",
  components: {
    RDBMSWriter,
    HiveWriter,
    HBaseWriter,
    MongoDBWriter,
    RabbitmqWriter
  },
  data() {
    return {
      dataSource: ""
    };
  },
  methods: {
    getData() {
      if (this.dataSource === "hive") {
        return this.$refs.hivewriter.getData();
      } else if (this.dataSource === "hbase") {
        return this.$refs.hbasewriter.getData();
      } else if (this.dataSource === "mongodb") {
        return this.$refs.mongodbwriter.getData();
      } else if (this.dataSource === "rabbitmq") {
        return this.$refs.rabbitmqwriter.getData();
      } else {
        return this.$refs.rdbmswriter.getData();
      }
    },
    getTableName() {
      if (this.dataSource === "hive") {
        return this.$refs.hivewriter.getTableName();
      } else if (this.dataSource === "hbase") {
        return this.$refs.hbasewriter.getTableName();
      } else if (this.dataSource === "mongodb") {
        return this.$refs.mongodbwriter.getTableName();
      } else if (this.dataSource === "rabbitmq") {
        return this.$refs.rabbitmqwriter.getTableName();
      } else {
        return this.$refs.rdbmswriter.getTableName();
      }
    },
    getReaderData() {
      return this.$parent.getReaderData();
    },
    showDataSource(data) {
      console.log("writeSource", data);
      this.dataSource = data;
      this.getData();
    },
    sendTableNameAndColumns(fromTableName, fromColumnList) {
      this.$refs.hivewriter.fromTableName = fromTableName;
      this.$refs.hivewriter.fromColumnList = fromColumnList;
    }
  }
};
</script>
