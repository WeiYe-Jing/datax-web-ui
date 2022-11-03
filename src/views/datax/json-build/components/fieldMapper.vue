<template>
  <div class="app-container">
    <el-form label-position="left" label-width="80px" :model="readerForm">
      <el-row>
        <el-col :span="10">
          <el-form-item label="源端字段">
            <el-checkbox
              v-model="readerForm.lcheckAll"
              :indeterminate="readerForm.isIndeterminate"
              @change="lHandleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="readerForm.lcolumns" @change="lHandleCheckedChange">
              <el-checkbox
              style="width: 100%;"
              v-for="(c,index) in fromColumnsList"
              :key="c"
              :label="c"
              @mouseover.native="CheckBoxClick(index)"
              v-dragging="{ item: c, list: fromColumnsList, group: 'c' }">{{ c }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="目标字段">
          <el-checkbox
            v-model="readerForm.rcheckAll"
            :indeterminate="readerForm.isIndeterminate"
            @change="rHandleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 20px 0;" />
          <el-checkbox-group v-model="readerForm.rcolumns" @change="rHandleCheckedChange">
            <el-checkbox
            style="width: 100%;"
            v-for="(c2,index) in toColumnsList"
            :key="c2"
            :label="c2"
            @mouseover.native="CheckBoxClick(index)"
            v-dragging="{ item: c2, list: toColumnsList, group: 'c2' }">{{ c2 }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FieldMapper',
  data() {
    return {
      mapperJson: {},
      fromColumnsList: [],
      toColumnsList: [],
      activeIndex: 0,
      checkedCities: [],
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      }
    }
  },
  mounted() {
    this.$dragging.$on('dragged', ({ value }) => {})
    this.$dragging.$on('dragend', () => {})
  },
  methods: {
    CheckBoxClick(i) {
      this.activeIndex = i
    },
    lHandleCheckAllChange(val) {
      this.readerForm.lcolumns = val ? this.fromColumnsList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckAllChange(val) {
      this.readerForm.rcolumns = val ? this.toColumnsList : []
      this.readerForm.isIndeterminate = false
    },
    lHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.fromColumnsList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.fromColumnsList.length
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.toColumnsList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.toColumnsList.length
    },
    getLColumns() {
      return this.readerForm.lcolumns
    },
    getRColumns() {
      return this.readerForm.rcolumns
    }
  }
}
</script>
