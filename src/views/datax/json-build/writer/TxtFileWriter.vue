<template>
  <div>
    <el-form label-position="left" label-width="105px" :model="writerForm" :rules="rules">
      <el-form-item label="数据源" prop="datasourceId">
        <el-select
          v-model="writerForm.datasourceId"
          filterable
          style="width: 300px;"
          @change="wDsChange"
        >
          <el-option
            v-for="item in wDsList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="path" prop="path">
        <el-input v-model="writerForm.path" :autosize="{ minRows: 2, maxRows: 20}" type="textarea" placeholder="文件的存储路径" style="width: 42%" />
      </el-form-item>
      <el-form-item label="fileName" prop="fileName">
        <el-input v-model="writerForm.fileName" placeholder="文件名" style="width: 42%" />
      </el-form-item>
      <el-form-item label="fileFormat" prop="fileFormat">
        <el-select v-model="writerForm.fileType" placeholder="文件的类型">
          <el-option v-for="item in fileTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="writeMode" prop="writeMode">
        <el-select v-model="writerForm.writeMode" placeholder="写入前数据处理模式">
          <el-option v-for="item in writeModes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="fieldDelimiter" prop="fieldDelimiter">
        <el-input v-model="writerForm.fieldDelimiter" placeholder="与创建表的分隔符一致" style="width: 42%" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import Bus from '../busWriter'

export default {
  name: 'TxtFileWriter',
  data() {
    return {
      wDsList: [],
      dataSource: '',
      ifCreateTable: false,
      writerForm: {
        datasourceId: -1,
        fileType: 'text',
        path: '',
        fileName: '',
        writeMode: 'truncate',
        fieldDelimiter: '\\u0001'
      },
      readerForm: this.getReaderData(),
      rules: {
        datasourceId: [{ required: true, message: 'this is required', trigger: 'change' }],
        path: [{ required: true, message: 'this is required', trigger: 'change' }],
        fileName: [{ required: true, message: 'this is required', trigger: 'change' }]
      },
      fileTypes: [
        { value: 'text', label: 'text' },
        { value: 'csv', label: 'csv' }
      ],
      writeModes: [
        { value: 'truncate', label: 'truncate' },
        { value: 'append', label: 'append' },
        { value: 'nonConflict', label: 'nonConflict' }
      ]
    }
  },
  watch: {
    'readerForm.tableName': {
      handler: function(val) {
        this.writerForm.fileName = this.readerForm.tableName.replace(/.+\./, '')
      },
      deep: true
    }
  },
  created() {
    this.getJdbcDs()
  },
  methods: {
    // 获取可用数据源
    getJdbcDs() {
      this.loading = true
      jdbcDsList(this.jdbcDsQuery).then(response => {
        const { records } = response
        this.wDsList = records
        this.wDsList.unshift({ id: -1, datasourceName: 'TXT文件', datasource: 'txtfile' })
        this.loading = false
      })
    },
    wDsChange(e) {
      // 清空
      this.writerForm.tableName = ''
      this.writerForm.datasourceId = e
      this.wDsList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource
        }
      })
      Bus.dataSourceId = e
      this.$emit('selectDataSource', this.dataSource)
    },
    getData() {
      if (Bus.dataSourceId) {
        this.writerForm.datasourceId = Bus.dataSourceId
      }
      this.writerForm.columns = this.readerForm.columns
      return this.writerForm
    },
    getReaderData() {
      return this.$parent.getReaderData()
    },
    handleClickCreateTable() {

    }
  }
}
</script>
