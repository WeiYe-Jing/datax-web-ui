<template>
  <div ref="tool" class="flow-menu">
    <div v-for="menu in menuList" :key="menu.id">
      <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i
        :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"
      />&nbsp;{{ menu.name }}</span>
      <ul v-show="menu.open" class="ef-node-menu-ul">
        <draggable v-model="menu.children" :options="draggableOptions" @end="end" @start="move($event,menu.children)">
          <li v-for="subMenu in menu.children" :key="subMenu.id" class="ef-node-menu-li" :type="subMenu.type">
            <i :class="subMenu.ico" /> {{ subMenu.name }}
          </li>
        </draggable>
      </ul>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: -1,
  top: -1
}

export default {
  components: {
    draggable
  },
  props: ['nodeMenuList'],
  data() {
    return {
      activeNames: '1',
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        // 不使用H5原生的配置
        forceFallback: true
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: [],
      menuList: this.nodeMenuList,
      nodeMenu: {}
    }
  },
  created() {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function(event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    // 拖拽开始时触发
    move(event, list) {
      this.nodeMenu = list[event.oldIndex]
    },
    // 拖拽结束时触发
    end(event) {
      this.$emit('addNode', event, this.nodeMenu, mousePosition)
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {
        return true
      }
      return false
    }
  }
}
</script>
