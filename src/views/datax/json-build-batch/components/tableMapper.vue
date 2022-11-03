<template>
  <div class="app-container">
    <el-form label-position="left" label-width="80px" :model="readerForm">
      <el-row>
        <el-col :span="10">
          <el-form-item label="源端表"  >
            <el-checkbox
              v-model="readerForm.lcheckAll"
              :indeterminate="readerForm.isIndeterminate"
              @change="lHandleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="readerForm.ltables" @change="lHandleCheckedChange">
              <el-checkbox
              style="width: 100%;"
              v-for="(c,index) in fromTablesList"
              :key="c"
              :label="c"
              @mouseover.native="CheckBoxClick(index)"
              v-dragging="{ item: c, list: fromTablesList, group: 'c' }">{{ c }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="目标表"  >
            <el-checkbox
              style="width: 100%;"
              v-model="readerForm.rcheckAll"
              :indeterminate="readerForm.isIndeterminate"
              @change="rHandleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 20px 0;" />
            <el-checkbox-group v-model="readerForm.rtables" @change="rHandleCheckedChange">
              <el-checkbox
              style="width: 100%;"
              v-for="(c2,index) in toTablesList"
              :key="c2"
              :label="c2"
              @mouseover.native="CheckBoxClick(index)"
              v-dragging="{ item: c2, list: toTablesList, group: 'c2' }">{{ c2 }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'TableMapper',
  data() {
    return {
      mapperJson: {},
      fromTablesList: [],
      toTablesList: [],
      activeIndex: 0,
      checkedCities: [],
      readerForm: {
        ltables: [],
        rtables: [],
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
      this.readerForm.ltables = val ? this.fromTablesList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckAllChange(val) {
      this.readerForm.rtables = val ? this.toTablesList : []
      this.readerForm.isIndeterminate = false
    },
    lHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.fromTablesList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.fromTablesList.length
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.toTablesList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.toTablesList.length
    },
    getLTables() {
      return this.readerForm.ltables
    },
    getRTables() {
      return this.readerForm.rtables
    }
  }
}
</script>
