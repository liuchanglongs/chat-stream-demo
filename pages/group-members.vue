<template>
	<view>
		<u-navbar>
			<template >
				<view class="title flex col j-center a-center">
					<view>Group members</view>
					<view class="mems">{{list.length}} Members</view>
				</view>
			</template>
		</u-navbar>
		<view class="lock" :style="[getTop()]">
			<view class="search flex j-between a-center">
				<input v-model="keyword" class="ipt" placeholder="Search name"/>
				<u-icon2 name="Search" size="50" color="#BEBECD"></u-icon2>
			</view>
		</view>
		<view class="panel">
			<view class="title">Members</view>
			<view class="list">
				<view v-for="item,i in list" :key="i">
					<view v-if="item.show" class="item flex j-between a-center">
						<view class="flex a-center">
							<view class="head">
								<image class="image" :src="item.icon"></image>
							</view>
							<view>
								<view class="name">{{item.name}}</view>
								<view v-if="item.role == 'owner'" class="own">Owner</view>
								<view v-else class="use">User</view>
							</view>
						</view>
						<!-- <u-icon2 v-if="item.id != chat.id" name="Message" size="50" color="#457FD4" @tap="toChat(item)"></u-icon2> -->
					</view>
				</view>
			</view>
		</view>
		<view class="submit fixed flex j-center a-center">
			<view class="btn flex j-center a-center" @tap="goto('/pages/invite')">
				<view>Add</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			keyword:'',
			list:[
				// {name:'Mason Mount',icon:'',checked:true},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
				// {name:'Mason Mount',icon:'',checked:false},
			],
			top:44,
		}
	},
	onLoad:async function() {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
			}
		})
		let list = await this.chat.getGroupMembers(this.item.cid)
		console.log(list)
		this.list = list.members.map(m => {
			return {name:m.user.name,icon:m.user.image,id:m.user.id,role:m.role,show:true,}
		})
	},
	computed:{
		chat(){
			return this.$store.state.chat
		},
		item(){
			return this.$store.state.crtChannel
		},
	},
	watch:{
		keyword:function(val,old){
			if(val.length){
				this.list.map(m => {
					if(m.name.includes(val)){
						m.show = true
					}else{
						m.show = false
					}
					return m
				})
			}else{
				this.list.map(m => {
					m.show = true
					return m
				})
			}
		}
	},
	methods:{
		getTop(){
			return {top:this.top*2+'rpx'}
		},
		async toChat(item){
			this.$api.isBlack({userId: item.id}).then(res => {
				if(!res.body){
					this.goto('/pages/member-chat?id='+item.id+'&icon='+item.icon+'&me='+this.chat.name+'&him='+item.name)
				}else{
					uni.showToast({
						icon:'none',
						title:'Blacklist eachother'
					})
				}
			})
			
		},
	}
}
</script>

<style lang="scss" scoped>
.title{width: 100%;
	.mems{color: #4F4F5F;font-size: 24rpx;}
}
.b-menus{padding-right: 36rpx;}
.lock{position: sticky;top:0;background-color: #FFF;z-index: 20;padding: 10rpx 0;}
.search{width: 686rpx;height: 88rpx;border-radius: 32rpx;margin: 32rpx;
	background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
	.ipt{width: 540rpx;}
}
.panel{padding: 32rpx 32rpx 200rpx;
	.title{font-size: 40rpx;font-weight: bold;}
	.list{margin-top: 16rpx;
		.item{padding: 16rpx 0;
			.head{width: 96rpx;height: 96rpx;border-radius: 100%;overflow: hidden;margin-right: 32rpx;}
			.name{size: 32rpx;}
			.own{color: #457FD4;font-size: 28rpx;}
			.use{color: #4F4F5F;font-size: 24rpx;}
		}
	}
}
.submit{background-color: #FFF;padding: 20rpx 32rpx 100rpx;left: 0;right: 0;bottom: 0;
	.btn{background-color: #457FD4;color: #FFF;font-size: 32rpx;width: 686rpx;height: 96rpx;border-radius: 32rpx;}
}
</style>