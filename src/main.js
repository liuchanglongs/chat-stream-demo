import App from './App'
import * as api from '@/requests/index.js';
import * as util from '@/utils/index.js';

Vue.prototype.$api = api;
Vue.prototype.$util = util;

Vue.prototype.goto = (url)=>{
	console.log(url)
	uni.navigateTo({
		url:url
	})
}
Vue.prototype.Rectto = (url) => {
	uni.redirectTo({
		url: url
	})
}
Vue.prototype.tabto = (url)=>{
	uni.switchTab({
		url:url
	})
}
Vue.prototype.back = ()=>{
	uni.navigateBack();
}
Vue.prototype.$oss = (name)=>{
	if(/^http/.test(name)){
		return name
	}
	return '/static'+name
};
// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif