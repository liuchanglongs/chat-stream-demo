import App from './App'
import * as api from '@/requests/index.js';
import * as util from '@/utils/index.js';
import moment from "moment"
Vue.prototype.$api = api;
Vue.prototype.$util = util;

Vue.prototype.goto = (url)=>{
	console.log(url)
	uni.navigateTo({
		url:url
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
/**
 *
 * @param name
 * @param type	头像类型，默认为群组的；type=group-chat为群组；type=chat 为个人私聊的
 * @returns {string|*}
 */
Vue.prototype.$oss = (name, type)=>{
	if(/^http/.test(name)){
		return name
	}
	if(name && name != 'null'){
		return '/static'+name
	}else{
		let img = '/static/'+(type && type === 'group-chat' ? 'logo' : 'avatar_default' )+'.png'
		return img
	}
	
};
Vue.prototype.$toDate = (time)=>{
	let date = new Date(time)
	return 	moment(new Date(date.getTime())).format('MM-DD-YYYY h:mm A')
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