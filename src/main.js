
import './public-path'
import Vue from 'vue'
import VueRouter from 'vue-router';
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

let instance = null

const render = (props) => {
  const { container } = props;
  instance = new Vue({
    el: '#dataxApp',
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#dataxApp') : '#dataxApp')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render(document);
}

export async function bootstrap(props) {
  console.log('[vue] vue app bootstraped', props)
  Vue.prototype.parentData = {...props.data}
}
export async function mount(props) {
  console.log('[vue] props from main framework', props)
  render(props)
}
export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  // router = null;
}
