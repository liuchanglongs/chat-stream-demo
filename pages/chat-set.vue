<template>
	<view>
		<u-navbar title="Chat settings"></u-navbar>
		<view class="user">
			<view class="flex a-center">
				<view class="head">
					<image v-if="item.data.created_by.id == chat.id" class="image" :src="$oss(item.data.image)"></image>
					<image v-else class="image" :src="$oss(item.data.owerimg)"></image>
				</view>
				<view v-if="item.data.chat_type=='group-chat'" class="name">{{item.data.name}}</view>
				<view v-if="item.data.chat_type=='chat'" class="name">{{item.data.created_by.id == chat.id ? item.data.him : item.data.me}}</view>
			</view>
			<view class="addgroup flex a-center" @tap="goto('/pages/add-group')">
				<view class="head flex j-center a-center">
					<u-icon2 name="Plus_min" size="50rpx" color="#D8D8D8"></u-icon2>
				</view>
				<view class="name">Add group chat</view>
			</view>
		</view>
		<view class="panel">
			<view class="line flex j-between a-center" @tap="goto('/pages/find-chat-log')">
				<view class="title">Find chat log</view>
				<view class="txt">Pictures, videos, files</view>
			</view>
			<view class="line flex j-between a-center">
				<view class="title">Pin to top</view>
				<u-switch v-model="top" inactive-color="#F2F2F2"></u-switch>
			</view>
			<view class="line flex j-between a-center">
				<view class="title">Block user</view>
				<u-switch v-model="black" inactive-color="#F2F2F2"></u-switch>
			</view>
		</view>
		<u-popup mode="bottom" v-model="show_black" border-radius="80">
			<view class="pop">
				<view class="flex j-center a-center">
					<view class="bar"></view>
				</view>
				<view class="title">Are you sure you want to remove him from the blacklist?</view>
				<view class="opts flex j-between">
					<view class="btn flex j-center a-center" @tap="show_black=false,black=false">
						<view>Cancel</view>
					</view>
					<view class="yes btn flex j-center a-center" @tap="show_black=false">
						<view>Yes</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data(){
		return{
			top:false,
			black:false,
			show_black:false,
			other_id:'',
		}
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
		black:function(val){
			if(val){
				this.$api.addBlack({userId: this.other_id})
			}else{
				this.$api.delBlack({userId: this.other_id})
			}
		},
		top:function(val,old){
			if(val != old){
				this.item.updatePartial({ set:{ top: val ? 1 : 0 } })
			}
		}
	},
	async onLoad() {
		this.top = this.item.data.top ? true : false
		let res = await this.item.queryMembers({},{created_at: -1},{})
		// console.log(res.members)
		res.members.map(m => {
			if(m.user_id != this.chat.id){
				this.other_id = m.user_id
			}
		})
		// console.log(this.other_id)
		this.$api.isBlack({userId: this.other_id}).then(res2 => {
			this.black = res2.body
		})
	}
}
</script>

<style lang="scss" scoped>
.user{padding: 20rpx 32rpx;border-bottom: 10rpx solid #F7F7FA;
	.head{width: 124rpx;height: 124rpx;border-radius: 100rpx;margin-right: 28rpx;overflow: hidden;}
	.name{font-size: 32rpx;}
	.addgroup{margin-top: 40rpx;
		.head{width: 108rpx;height: 108rpx;background-color: #F7F7FA;margin-right: 16rpx;}
		.name{color: #BEBECD;font-size: 24rpx;}
	}
}
.panel{padding: 32rpx;
	.line{margin-bottom: 36rpx;
		.title{font-size: 32rpx;}
		.txt{color: #BEBECD;font-size: 24rpx;}
	}
}
.pop{padding: 16rpx 26rpx 48rpx;
	.bar{background-color: #E0E0EA;width: 60rpx;height: 8rpx;border-radius: 12rpx;}
	.title{color: #000;font-weight: bold;font-size: 40rpx;margin-top: 100rpx;}
	.opts{margin-top: 100rpx;
		.btn{width: 320rpx;height: 96rpx;border: 1rpx solid #457FD4;color: #457FD4;font-size: 32rpx;
			border-radius: 32rpx;
		}
		.yes{color: #FFF;background-color: #457FD4;}
	}
}
</style>