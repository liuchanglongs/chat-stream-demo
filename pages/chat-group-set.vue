<template>
	<view>
		<u-navbar title="Chat settings"></u-navbar>
		<view class="user">
			<view class="flex a-center">
				<view class="head" @tap="checkOrEditPic">
					<image class="image" :src="$oss(item.data.image)"></image>
				</view>
				<view>
					<view v-if="!edit" class="flex a-center" @tap="edit=true">
						<view class="name">{{name}}</view>
						<u-icon name="edit-pen-fill" color="#999999" size="40"></u-icon>
					</view>
					<view v-else class="edit">
						<input v-model="name" class="ipt" @blur="setName"/>
					</view>
				</view>
			</view>
		</view>
		<view class="panel">
			<view class="line flex j-between a-center" @tap="goto('/pages/find-chat-log')">
				<view class="title">Find chat log</view>
				<view class="txt">Pictures, videos, files</view>
			</view>
			<view class="line flex j-between a-center" @tap="goto('/pages/group-members?cid='+cid)">
				<view class="title">Group members</view>
				<u-icon2 name="Right" size="40" color="#BEBECD"></u-icon2>
			</view>
			<view class="line flex j-between a-center">
				<view class="title">Pin to top</view>
				<u-switch v-model="top" inactive-color="#F2F2F2"></u-switch>
			</view>
		</view>
		<view class="submit fixed flex j-center a-center" @tap="show_leave=true">
			<view class="btn flex j-center a-center">
				<view v-if="item.data.created_by.id != chat.id">Leave</view>
				<view v-else>Disband</view>
			</view>
		</view>
		<u-popup mode="bottom" v-model="show_leave" border-radius="80">
			<view class="pop">
				<view class="flex j-center a-center">
					<view class="bar"></view>
				</view>
				<view v-if="item.data.created_by.id != chat.id" class="title">Are you sure you want to leave this group?</view> <!-- 普通用户离开 -->
				<view v-else class="title">Are you sure you want to disband the group?</view> <!-- 群主解散 -->
				<view class="opts flex j-between">
					<view class="btn flex j-center a-center" @tap="show_leave=false">
						<view>Cancel</view>
					</view>
					<view class="yes btn flex j-center a-center" @tap="leaveGroup">
						<view>Yes</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup mode="center" v-model="show_head" border-radius="80">
			<view class="bighead">
				<image class="image" :src="$oss('/logo.png')"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default{
	data(){
		return{
			top:false,
			show_leave:false,
			edit:false,
			show_head:false,
			cid:'',
			name:''
		}
	},
	onLoad(prms) {
		this.cid = prms.cid
		this.name = prms.name
		this.top = this.item.data.top ? true : false
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
		top:function(val,old){
			if(val != old){
				this.item.updatePartial({ set:{ top: val ? 1 : 0 } })
			}
		}
	},
	methods:{
		checkOrEditPic(){
			if(!this.edit){
				this.show_head = true
			}else{
				this.goto('/pages/set-group-avatar')
			}
		},
		setName:async function(){
			await this.item.updatePartial({ set:{name:this.name} });
			// await this.chat.setGroupName(this.cid,this.name)
			this.edit = false
		},
		async leaveGroup(){
			if(this.item.data.created_by.id == this.chat.id){
				await this.item.delete()
			}else{
				await this.item.removeMembers([this.chat.id])
			}
			this.show_leave = false
			this.goto('/pages/index')
		}
	}
}
</script>

<style lang="scss" scoped>
.user{padding: 20rpx 32rpx;border-bottom: 10rpx solid #F7F7FA;
	.head{width: 124rpx;height: 124rpx;border-radius: 32rpx;margin-right: 28rpx;overflow: hidden;}
	.name{font-size: 32rpx;}
	.edit{border-bottom: 1rpx solid #457FD4B0;}
}
.panel{padding: 32rpx;
	.line{margin-bottom: 36rpx;
		.title{font-size: 32rpx;}
		.txt{color: #BEBECD;font-size: 24rpx;}
	}
}
.submit{background-color: #FFF;padding: 0 32rpx 100rpx;left: 0;right: 0;bottom: 0;
	.btn{background-color: #F7F7FA;color: #FF3B30;font-size: 32rpx;width: 686rpx;height: 96rpx;border-radius: 32rpx;}
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
.bighead{width: 440rpx;height: 440rpx;}
</style>