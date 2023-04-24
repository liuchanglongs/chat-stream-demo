<template>
	<view>
		<u-navbar title="Group Message" :autoBack="true"></u-navbar>
		<view class="lock" :style="[getTop()]">
			<view class="search flex j-between a-center">
				<input class="ipt" placeholder="User" v-model="keyword"/>
				<u-icon2 name="Search" size="50" color="#BEBECD"></u-icon2>
			</view>
		</view>
		<view class="panel">
			<view class="title">Following</view>
			<view class="list">
				<view v-for="item,i in list" :key="i">
					<view v-if="item.show" class="item flex j-between a-center" @tap="item.checked=!item.checked">
						<view class="flex a-center">
							<view class="head">
								<image class="image" :src="$oss(item.icon)"></image>
							</view>
							<view>{{item.name}}</view>
						</view>
						<view class="check flex j-center a-center" :class="{'checked':item.checked}">
							<u-icon2 v-if="item.checked" name="Correct" size="40" color="#FFF"></u-icon2>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit fixed flex j-center a-center">
			<view class="btn flex j-center a-center" @tap="createGroup">
				<view>Create Group Chat</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			list:[
				// {name:'Mason Mount',icon:'',checked:true},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
			],
			top:44,
			keyword:'',
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
			}
		})
		this.$api.myFllow({
			  "followType": 0,
			  "forward": true,
			  "lastEvaluatedKey": {},
			  "locked": 0,
			  "pageSize": 99999,
			  "search": "",
			  "sortField": "createTime",
			  "sortMethod": "desc",
			  "userId": uni.getStorageSync('id')
		}).then(res => {
			this.list = res.body.map(m => {
				return {
					name:m.content.nickName?m.content.nickName:m.content.userName,
					id:m.content.userId,
					icon:/^http/.test(m.content.avatar) ? m.content.avatar : '/user.png',
					checked:false,
					show:true,
				}
			})
		})
		// this.$api.myFllow({
		// 	  "followType": 0,
		// 	  "forward": true,
		// 	  "lastEvaluatedKey": {},
		// 	  "locked": 0,
		// 	  "pageSize": 99999,
		// 	  "search": "",
		// 	  "sortField": "createTime",
		// 	  "sortMethod": "desc",
		// 	  "userId": uni.getStorageSync('id')
		// }).then(res => {
		// 	this.list = res.body.map(m => {
		// 		return {
		// 			name:m.content.nickName?m.content.nickName:m.content.userName,
		// 			id:m.content.userId,
		// 			icon:/^http/.test(m.content.avatar) ? m.content.avatar : '/logo.png',
		// 			checked:false,
		// 			show:true,
		// 		}
		// 	})
		// })
	},
	computed:{
		chat(){
			return this.$store.state.chat
		}
	},
	watch:{
		keyword:function(val,old){
			if(val.length){
				this.list.map(m =>{
					if((new RegExp(val)).test(m.name)){
						m.show = true
					}else{
						m.show = false
					}
					return m
				})
			}else{
				this.list.map(m =>{
					m.show = true
					return m
				})
			}
		}
	},
	methods:{
		clickleft() {
			console.log(11212)
		},
		getTop(){
			return {top:this.top*2+'rpx'}
		},
		async createGroup(){
			let ids = this.list.filter(f => f.checked).map(m =>m.id)
			
			if(ids.length){
				// 判断用户是否存在
				const rs = await this.chat.findUsers( ids );
				let noExistUserIds = []
				// 去掉已经再im中有得用户
				for(let idIdx in ids) {
					let exist = false
					for (let uIdx in rs.users) {
						if(ids[idIdx] === rs.users[uIdx].id) {
							exist = true
						}
					}
					if(!exist) {
						noExistUserIds.push(ids[idIdx])
					}
				}
				// 创建不存在的用户信息
				if(noExistUserIds.length > 0) {
					// 调用创建 IM 用户接口完成创建后，再调下面的方法
					console.log(ids, '================noExistUserIds=====', noExistUserIds)
					let all = this.list.filter(f => f.checked)
					for(let i in noExistUserIds){
						let tmp = all.find(f => f.id == noExistUserIds[i])
						if(tmp){
							this.chat.createUser(tmp.id,tmp.name,tmp.icon)
						}
					}
				}
				let channel = await this.chat.createGroupChat(
					ids,
					'/logo.png',
					this.chat.name + '、'+ this.list.filter(f => f.checked).map(m =>m.name).splice(0,2).join('、').substr(0,30)
				)
				// debugger
				this.goto('/pages/group-chat?cid='+channel.cid+'&name='+channel.data.name)
				
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.lock{position: sticky;top:0;background-color: #FFF;z-index: 20;padding: 10rpx 0;}
.search{width: 686rpx;height: 88rpx;border-radius: 32rpx;margin: 32rpx;
	background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
	.ipt{width: 540rpx;}
}
.panel{padding: 32rpx 32rpx 200rpx;
	.list{margin-top: 16rpx;
		.item{padding: 16rpx 0;
			.head{width: 96rpx;height: 96rpx;border-radius: 100%;overflow: hidden;margin-right: 32rpx;background-color: #EEF5FE;}
			.name{size: 32rpx;}
			.check{width: 44rpx;height: 44rpx;background-color: #EEF5FE;border-radius: 10rpx 10rpx;}
			.checked{background-color: #457FD4;}
		}
	}
}
.submit{background-color: #FFF;padding: 0 32rpx 100rpx;left: 0;right: 0;bottom: 0;
	.btn{background-color: #457FD4;color: #FFF;font-size: 32rpx;width: 686rpx;height: 96rpx;border-radius: 32rpx;}
}
</style>