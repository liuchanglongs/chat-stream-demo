import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../requests/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		me:null,
		chat:null,
		channels:[],
		barHeight:0,
		crtChannel:null,
		sysinfo:{system: 0, community: 0, research: 0, group: 0, total: 0},
	},
	mutations: {
		set_me:(state, val) => {
			state.me = val
		},
		set_chat:(state, val) => {
			state.chat = val
		},
		set_channels:(state, val) => {
			state.channels = val
		},
		set_barheight:(state, val) => {
			state.barHeight = val
		},
		set_crtChannel:(state, val) => {
			state.crtChannel = val
		},
		set_sysinfo: (state,val) => {
			state.sysinfo = val
		}
	},
	actions:{
		// AC_GET_USERINFO({ commit,state }) {
		// 	if(!state.user){
		// 		return api.info().then(res => {
		// 			commit('SET_USER',res.data)
		// 		})
		// 	}
		// },
		AC_GET_SYSINFO({commit,state}) {
			return api.sysinfocount().then(res => {
				commit('set_sysinfo',res.body)
			})
		}
	}
})

export default store
