<template>
  <div v-if="easyFlowVisible" style="height: calc(70vh);">
    <el-row>
      <!--顶部工具菜单-->
      <el-col :span="24">
        <div class="ef-tooltar">
          <el-link type="primary" :underline="false">{{ data.name }}</el-link>
          <el-divider direction="vertical" />
          <el-button
            type="text"
            icon="el-icon-delete"
            size="large"
            :disabled="!this.activeElement.type"
            @click="deleteElement"
          >delete</el-button>
          <el-divider direction="vertical" />
          <el-button
            type="text"
            icon="el-icon-delete"
            size="large"
            @click="clearNode"
          >clearNode</el-button>
          <el-divider direction="vertical" />
          <el-button
            type="text"
            icon="el-icon-delete"
            size="large"
            @click="clearLine"
          >clearLine</el-button>
          <div style="float: right;margin-right: 5px">
            <el-button type="info" plain round icon="el-icon-document" size="mini" @click="dataInfo">流程信息</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex;height: calc(100% - 47px);">
      <div style="width: 230px;overflow:auto;border-right: 1px solid #dce3e8;">
        <node-menu
          ref="nodeMenu"
          :node-menu-list="this.nodeMenuList"
          :job-info="this.jobInfo"
          @addNode="addNode"
        />
      </div>
      <div id="efContainer" ref="efContainer" v-flowDrag class="container">
        <template v-for="node in data.nodeList">
          <flow-node
            :id="node.id"
            :key="node.id"
            :node="node"
            :active-element="activeElement"
            @changeNodeSite="changeNodeSite"
            @clickNode="clickNode"
          />
        </template>
        <!-- 给画布一个默认的宽度和高度 -->
        <div style="position:absolute;top: 97%;left: 98%;">&nbsp;</div>
      </div>
    </div>
    <!-- 流程数据详情 -->
    <el-dialog title="流程数据信息" :visible.sync="flowInfoVisible" width="70%" :modal-append-to-body="false">
      <el-alert
        title="使用说明"
        type="warning"
        description="以下流程信息可以被存储起来，方便下一次流程加载"
        show-icon
        close-text="知道了"
      />
      <br>
      <!--一个高亮显示的插件-->
      <codemirror
        :value="flowJsonData"
        :options="options"
        class="code"
      />
    </el-dialog>
  </div>

</template>

<script>
import { jsPlumb } from 'jsplumb'
import { easyFlowMixin } from '@/views/flow/ef/mixins'
import flowNode from '@/views/flow/ef/node'
import nodeMenu from '@/views/flow/ef/node_menu'
import lodash from 'lodash'
import * as job from '@/api/datax-job-info'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'

require('codemirror/mode/javascript/javascript.js')

export default {
  components: {
    flowNode, nodeMenu, codemirror
  },
  directives: {
    'flowDrag': {
      bind(el, binding, vnode, oldNode) {
        if (!binding) {
          return
        }
        el.onmousedown = (e) => {
          if (e.button === 2) {
            // 右键不管
            return
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX
          let disY = e.clientY
          el.style.cursor = 'move'

          document.onmousemove = function(e) {
            // 移动时禁止默认事件
            e.preventDefault()
            const left = e.clientX - disX
            disX = e.clientX
            el.scrollLeft += -left

            const top = e.clientY - disY
            disY = e.clientY
            el.scrollTop += -top
          }

          document.onmouseup = function(e) {
            el.style.cursor = 'auto'
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  props: ['nodeMenuList', 'jobInfo'],
  data() {
    return {
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      // 数据
      data: {},
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined
      },
      flowJsonData: {},
      options: {
        mode: { name: 'javascript', json: true },
        lineNumbers: true
      }
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      // 数据加载
      this.reloadData()
      // this.dataReload(JSON.parse(this.jobInfo.chainJson))
    })
  },
  methods: {
    // 返回唯一标识
    getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.activeElement.type = 'line'
          this.activeElement.sourceId = conn.sourceId
          this.activeElement.targetId = conn.targetId
        })
        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          const from = evt.source.id
          const to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
            this.save()
          }
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
          this.save()
        })

        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
          this.save()
        })

        // 连线右击
        this.jsPlumb.bind('contextmenu', (evt) => {
          console.log('contextmenu', evt)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          const from = evt.sourceId
          const to = evt.targetId
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          this.$message.success('连接成功')
          return true
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: 'parent',
            stop: function(el) {
              // 拖拽节点结束后的对调
            }
          })
        }
      }
      // 初始化连线
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i]
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : '',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true
      })
    },
    // 删除激活的元素
    deleteElement() {
      if (this.activeElement.type === 'node') {
        this.deleteNode(this.activeElement.nodeId)
      } else if (this.activeElement.type === 'line') {
        this.$confirm('确定删除所点击的线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var conn = this.jsPlumb.getConnections({
            source: this.activeElement.sourceId,
            target: this.activeElement.targetId
          })[0]
          this.jsPlumb.deleteConnection(conn)
          this.resetActiceElement()
        }).catch(() => {
        })
      }
    },
    clearNode() {
      const jobId = this.jobInfo.id
      this.data.nodeList = this.data.nodeList.filter(function(node) {
        // eslint-disable-next-line eqeqeq
        if (node.id == jobId) {
          return true
        }
        return false
      })
      this.clearLine()
    },
    clearLine() {
      for (var i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i]
        var conn = this.jsPlumb.getConnections({
          source: line.from,
          target: line.to
        })[0]
        this.jsPlumb.deleteConnection(conn)
        this.deleteLine(line.from, line.to)
      }
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
          this.saveJson()
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      var screenX = evt.originalEvent.clientX
      var screenY = evt.originalEvent.clientY
      const efContainer = this.$refs.efContainer
      var containerRect = efContainer.getBoundingClientRect()
      var left = screenX
      var top = screenY
      // 计算是否拖入到容器中
      if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
        this.$message.error('请把节点拖入到画布中')
        return
      }
      left = left - containerRect.x + efContainer.scrollLeft
      top = top - containerRect.y + efContainer.scrollTop
      // 居中
      left -= 85
      top -= 16
      var nodeId = this.getUUID() + '-' + nodeMenu.id
      // 动态生成名字
      var node = {
        id: nodeId,
        name: nodeMenu.name,
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        state: 'success'
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      if (this.hasNode(node)) {
        this.$notify({
          title: '提示',
          message: '该节点已存在',
          type: 'error',
          duration: 2000
        })
      } else {
        this.data.nodeList.push(node)
        this.$nextTick(function() {
          this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
          this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
          this.jsPlumb.draggable(nodeId, {
            containment: 'parent',
            stop: function(el) {
              // 拖拽节点结束后的对调
            }
          })
        })
        this.saveJson()
      }
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        this.data.nodeList = this.data.nodeList.filter(function(node) {
          if (node.id === nodeId) {
            // 伪删除，将节点隐藏，否则会导致位置错位
            // node.show = false
            return false
          }
          return true
        })
        this.$nextTick(function() {
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
        this.resetActiceElement()
        this.save()
      }).catch(() => {
      })
      return true
    },
    clickNode(nodeId) {
      // eslint-disable-next-line eqeqeq
      if (nodeId != this.jobInfo.id) {
        this.activeElement.type = 'node'
        this.activeElement.nodeId = nodeId
      } else {
        this.resetActiceElement()
      }
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否具有该节点
    hasNode(node) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        var temp = this.data.nodeList[i]
        if (temp.id === node.id) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    repaintEverything() {
      this.jsPlumb.repaint()
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true
      this.flowJsonData = JSON.stringify(this.data, null, 4).toString()
    },
    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    reloadData() {
      // 调api
      job.getChainJson({ id: this.jobInfo.id }).then(response => {
        const { content } = response
        this.dataReload(JSON.parse(content))
      })
    },
    save() {
      // 调api
      job.saveChain(this.data).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    saveJson() {
      // 调api
      job.saveChainJson(this.data).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetActiceElement() {
      this.activeElement.type = undefined
      this.activeElement.nodeId = undefined
      this.activeElement.sourceId = undefined
      this.activeElement.targetId = undefined
    }
  }
}
</script>
