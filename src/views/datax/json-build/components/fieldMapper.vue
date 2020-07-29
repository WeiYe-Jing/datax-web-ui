<template>
  <div class="app-container">
    <el-form label-position="left" label-width="80px" :model="readerForm">
      <el-row :gutter="10">
        <el-col :span="6" style="text-align:center;">
          <a>源端字段</a>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <a>清洗规则</a>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <a>目标字段</a>
        </el-col>
        <el-col :span="2" style="text-align:center;">bnpm
          <a>操作</a>
        </el-col>
      </el-row>
      <div style="margin: 15px 0;" />
      <el-row :gutter="10">
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 5px 0;"
          >
            <el-select
              v-model="readerForm.lcolumns[index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="lHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in fromColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 5px 0;"
          >
            <el-select
              v-model="readerForm.rules[index]"
              placeholder="请选择"
              filterable
              clearable
              value-key="index"
              @change="cHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in ruleSettings" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 5px 0;"
          >
            <el-select
              v-model="readerForm.rcolumns[index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="rHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in toColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="2" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 5px 0;"
          >
            <el-button
              type="infor"
              icon="el-icon-delete"
              circle
              value-key="index"
              @click="bHandleClick(index,$event)"
            />
          </div>
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
      fromColumnsListChecked: [],
      toColumnsList: [],
      toColumnsListChecked: [],
      ruleSettings: [],
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      }
    }
  },
  mounted() {
  },
  methods: {
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
    lHandleSelect(index, v) {},
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {},
    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1)
      this.toColumnsListChecked.splice(index, 1)

      this.readerForm.lcolumns.splice(index, 1)
      this.readerForm.rcolumns.splice(index, 1)
    },
    getLColumns() {
      return this.readerForm.lcolumns
    },
    getRColumns() {
      return this.readerForm.rcolumns
    },
    getRules() {
      return this.readerForm.rules
    }
  }
}
</script>
