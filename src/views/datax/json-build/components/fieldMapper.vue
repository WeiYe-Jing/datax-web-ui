<template>
  <div class="app-container">
    <json-editor ref="jsonEditor" v-model="mapperJson" />
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
export default {
  name: 'Reader',
  components: { JsonEditor },
  data() {
    return {
      mapperJson: {}
    }
  },
  created() {
    this.buildMapperJson()
  },
  methods: {
    getData() {

    },
    buildMapperJson() {
      this.mapperJson = [{
        'src': {
          'name': 'aaa'
        },
        'des': {
          'name': ''
        }
      }]
    }
  }
}
</script>
