<template>
	<view>
		<u-navbar :is-back="true" padding-top="0" :customBack="navBack">
			<template>
				<view class="title">Messages</view>
			</template>
			<template #right>
				<view class="b-menus flex a-center">
					<view class="m" @tap="goto('/pages/social-info')">
						<u-badge type="error" :count="msgCount" size="mini" :offset="[0,90]"></u-badge>
						<u-icon2 name="Note" size="50"></u-icon2>
					</view>
					<view class="m" @tap="goto('/pages/add-group')">
						<u-icon2 name="Message_add" size="50"></u-icon2>
					</view>
				</view>
			</template>
		</u-navbar>
		<view class="bar flex j-between a-center">
			<view class="search flex j-between a-center">
				<input class="ipt" placeholder="Search" v-model="keyword"/>
				<u-icon2 name="Search" size="50" color="#BEBECD"></u-icon2>
			</view>
			<view class="link flex j-center a-center" @tap="goto('/pages/members')">
				<u-icon2 name="Users" color="#FFF" size="40"></u-icon2>
			</view>
		</view>
		<view class="list">
			<u-swipe-action :show="item.show" :index="index" 
			v-for="(item, index) in list" :key="item.id"  :show-delete="true"
			@delete="deleteItem" @open="open" :options="options">
				<template>
					<view>
						<view v-if="item.type=='sys'&&item.search" class="item flex a-center j-between" @tap="goto('/pages/sys-info')">
							<view class="pic">
								<view class="head flex j-center a-center" style="background-color: #8FB2E5;">
									<u-icon2 name="System" size="60" color="#FFF"></u-icon2>
								</view>
							</view>
							<view class="ctt">
								<view class="flex a-center j-between">
									<view class="name">{{item.name}}</view>
									<!-- <view class="time">{{item.time}}</view> -->
								</view>
								<view class="l2 flex a-center j-between">
									<view v-if="syscount.total == 0" class="msg ecllipse">no messages</view>
									<view v-else class="msg ecllipse">
										{{syscount.system ? 'system' : ''}}
										{{syscount.community ? ' community' : ''}}
										{{syscount.research ? ' research' : ''}}
										{{syscount.group ? ' group' : ''}}
										has new messages
									</view>
									<view v-if="syscount.total" class="count flex j-center a-center">
										<view>{{syscount.total}}</view>
									</view>
								</view>
							</view>
						</view>
						<view v-if="item.type=='msg'&&item.search" class="item flex a-center j-between" @tap="toChat(item.channel)">
							<view class="pic rela">
								<view v-if="item.channel.data.chat_type=='group-chat'" class="head">
									<image class="image" :src="$oss(item.channel.data.image)"></image>
								</view>
								<view v-else class="head">
									<image v-if="item.channel.data.created_by.id == chat.id" class="image" :src="$oss(item.channel.data.image, item.channel.data.chat_type)"></image>
									<image v-else class="image" :src="$oss(item.channel.data.owerimg, item.channel.data.chat_type)"></image>
								</view>
								<!-- <u-badge type="error" size="mini" :is-dot="true" :count="item.count"></u-badge> -->
							</view>
							<view class="ctt">
								<view class="flex a-center j-between">
									<view v-if="item.channel.data.chat_type=='group-chat'" class="name name2 ecllipse">{{item.channel.data.name}}</view>
									<view v-if="item.channel.data.chat_type=='chat'" class="name name2 ecllipse">{{item.channel.data.created_by.id == chat.id ? item.channel.data.him : item.channel.data.me}}</view>
									<view class="time">{{item.channel.data.last_message_at ? $toDate(item.channel.data.last_message_at) : $toDate(item.channel.data.updated_at)}}</view>
								</view>
								<view class="l2 flex a-center j-between">
									<view v-if="!!item.channel.state&&item.channel.state.messageSets[0].messages.length>0" class="msg ecllipse" v-html="item.channel.state.messageSets[0].messages[item.channel.state.messageSets[0].messages.length-1].text"></view>
									<view v-else class="msg ecllipse">no messages</view>
									<view v-if="item.count>0" class="count flex j-center a-center">
										<view>{{item.count}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
				<template #delete>
					<view class="delete flex j-center a-center">
						<u-icon2 name="Delete" color="#FFF" size="40"></u-icon2>
					</view>
				</template>
			</u-swipe-action>
		</view>
		<!-- <tabbar></tabbar> -->
	</view>
</template>

<script>
import tabbar from './components/tabbar.vue'
export default{
	name:"Message",
	components:{tabbar},
	data(){
		return {
			keyword:'',
			list:[],
			chat_list:[{type:'sys',search:true,name:'System information',show:false,icon:'/logo.png',no_read:0,time:'11-02-2022',msg:'Amet minim mollit non deserAmet minim mollit non deser'},],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#007aff'
					}
				},
			],
			msgCount:1,
		}
	},
	computed:{
		chat(){
			return this.$store.state.chat
		},
		channels(){
			return this.$store.state.channels
		},
		syscount(){
			return this.$store.state.sysinfo
		}
	},
	watch:{
		syscount:function(val){
			this.chat_list[0].no_read = val.total
		},
		chat:async function(val){
			if(val!=null){
				let list1 = await this.chat.getChatList()
				let list = this.chat_list.concat(list1.map(m => {
					return {
						type:'msg',
						channel:m,
						show:false,
						count:m.state.unreadCount,
						search:true,
					}
				}))
				console.log('------watch----',list)
				this.$store.commit('set_channels',this.handleJsonMsg(list))
			}
		},
		channels:function(val){
			console.log('change channels------------')
			this.list = this.handleJsonMsg(val)
		},
		keyword:function(val,old){
			if(val.length){
				let reg = new RegExp(val)
				this.list.map(m => {
					if(m.type == 'sys'){
						if(reg.test(m.name)){
							m.search = true
						}else{
							m.search = false
						}
					}
					if(m.type == 'msg'){
						if(m.channel.data.chat_type=='group-chat'){
							if(reg.test(m.channel.data.name)){
								m.search = true
							}else{
								m.search = false
							}
						}
						if(m.channel.data.chat_type=='chat'){
							if(reg.test(m.channel.data.created_by.id == this.chat.id ? m.channel.data.him : m.channel.data.me)){
								m.search = true
							}else{
								m.search = false
							}
						}
					}
				})
			}else{
				this.list.map(m => {
					m.search = true
				})
			}
		}
	},
	onShow:async function(){
		console.log('chat', this.chat)
		let info = uni.getSystemInfoSync()
		// console.log(info)
		if(this.chat!=null){
			let list1 = await this.chat.getChatList()
			let list = this.chat_list.concat(list1.map(m => {
				return {
					type:'msg',
					channel:m,
					show:false,
					count:m.state.unreadCount,
					search:true,
				}
			}))
			console.log('------show----',list)
			this.$store.commit('set_channels',this.handleJsonMsg(list))
		}
		this.refreshBadge()
	},
	methods:{
		Rectto(url) {
			uni.redirectTo({
				url: url
			})
		},
		isJson(msg) {
			if(!msg){
				return
			}
		  if(msg.indexOf("{") != 0) {
			return false
		  }
		  try {
			return JSON.parse(msg)
		  } catch (err) {
			return false
		  }
		},
		handleJsonMsg(list) {
		  console.log('list', list)
		  for (let i in list) {
			  // debugger
			if(!!list[i].channel && !!list[i].channel.state) {
				let msgSet = list[i].channel.state.messageSets[0]
				if(msgSet.messages.length){
					let msg = msgSet.messages[msgSet.messages.length-1].text
					let jsonObj = this.isJson(msg)
					if(jsonObj) {
						if(jsonObj.contentType == 'image'){
							msgSet.messages[msgSet.messages.length-1].text = '[image]'
						}else if(jsonObj.contentType == 'file'){
							msgSet.messages[msgSet.messages.length-1].text = '[file]'
						}else{
							msgSet.messages[msgSet.messages.length-1].text = jsonObj.content
						}
					}
				}
			}
		  }
		  return list
		},
		refreshBadge(){
			this.$api.getSocialNoticeStatistical().then(res => {
				let temp = 0
				temp +=  res.body.invitationNum
				temp +=  res.body.answerNum
				temp +=  res.body.followNum
				temp +=  res.body.commentNum
				temp +=  res.body.atMeNum
				temp +=  res.body.likeNum
				temp +=  res.body.shareNum
				this.msgCount = temp
			})
		},
		deleteItem:async function(i){
			if(i){
				await this.chat.deleteChat(this.list[i].channel.data.cid)
				this.list.splice(i,1)
			}
		},
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if(index != idx) this.list[idx].show = false;
			})
		},
		toChat(channel){
			this.$store.commit('set_channels',this.$store.state.channels.map(m => {
				if(m.type=='msg'&&m.channel.cid == channel.cid){
					m.count = 0
				}
				return m
			}))
			if(channel.data.chat_type == 'chat'){
				// this.goto('/pages/member-chat?cid='+channel.cid+'&name='+channel.data.name)
				uni.redirectTo({
					url: '/pages/member-chat?cid='+channel.cid+'&name='+channel.data.name + "&choose=true"
				})
			}else{
				// this.goto('/pages/group-chat?cid='+channel.cid+'&name='+channel.data.name)
				uni.redirectTo({
					url: '/pages/group-chat?cid='+channel.cid+'&name='+channel.data.name
				})
			}
			
		},
		navBack(){
			uni.webView.postMessage({
				data: {
					postMsg: {url:'none',event:'back'}
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.title{font-size: 32rpx;padding-left: 82rpx;height:84rpx;line-height: 84rpx;width: 460rpx;text-align: center;box-sizing: border-box;}
.b-menus{padding-right: 32rpx;
	.m{margin-left: 28rpx;}
}
.bar{padding: 30rpx;margin-top: 48rpx;
	.search{width: 610rpx;height: 88rpx;border-radius: 32rpx;background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
		.ipt{width: 540rpx;}
	}
	.link{width: 60rpx;height: 60rpx;background-color: #4A4A4A;border-radius: 100%;}
}
.list{
	.item{
		.pic{padding: 32rpx;}
		.head{width: 124rpx;height: 124rpx;border-radius: 100%;overflow: hidden;background-color: #EEF5FE;}
		.ctt{width: 540rpx;padding: 44rpx;padding-left:0;border-bottom: 1rpx solid #E0E0EA;
			.name{font-size: 32rpx;width: 300rpx;}
			.name2{width:250rpx;}
			.msg{width: 450rpx;color: #4F4F5F;font-size: 28rpx;}
			.l2{margin-top: 20rpx;}
			.count{width: 36rpx;height: 36rpx;color: #FFF;background-color: #457FD4;border-radius: 100%;}
			.time{color: #4F4F5F;font-size: 28rpx;}
		}
	}
	.delete{background-color: #FF6767;width: 100%;height: 100%;}
}
</style>