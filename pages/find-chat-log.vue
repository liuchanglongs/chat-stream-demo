<template>
	<view>
		<u-navbar title="Find chat"></u-navbar>
		<view class="lock" :style="[getTop()]">
			<view class="search flex j-between a-center">
				<input class="ipt" placeholder="KeyWords" v-model="keyword"/>
				<u-icon2 name="Search" size="50" color="#BEBECD"></u-icon2>
			</view>
		</view>
		<view class="panel" v-if="!keyword.length">
			<view v-for="item,i in list" :key="i">
				<u-loadmore :load-text="{loadmore:$toDate(item.time)}" font-size="18"></u-loadmore>
				<view v-if="!item.owner" class="msg msg-left flex">
					<view class="head">
						<image class="image" :src="$oss(item.image)"></image>
					</view>
					<view class="package">{{item.message}}</view>
				</view>
				<view v-else class="msg msg-right flex j-end">
					<view class="package">{{item.message}}</view>
					<view class="head">
						<image class="image" :src="$oss(item.image)"></image>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="list">
			<view class="item" v-for="item,i in filter" :key="i">
				<view>
					<view class="flex">
						<view class="head">
							<image class="image" :src="$oss(item.image)"></image>
						</view>
						<view>
							<view>{{item.name}}</view>
							<view class="time">{{$toDate(item.time)}}</view>
						</view>
					</view>
					<view class="txt">{{item.message}}</view>
				</view>
				<!-- <view class="time">{{$toDate(item.time)}}</view> -->
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			top:44,
			keyword:'',
			list:[],
			filter:[],
		}
	},
	computed:{
		channel(){
			return this.$store.state.crtChannel
		}
	},
	watch:{
		keyword:function(val,old){
			if(val.length){
				this.filter = this.list.filter(f => (new RegExp(val)).test(f.message))
				console.log(this.filter)
			}
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
			}
		})
	},
	async onShow() {
		if(this.channel == null){
			this.back()
		}
		let history = await this.channel.watch()
		this.loadingHistory(history)
	},
	methods:{
		getTop(){
			return {top:this.top*2+'rpx'}
		},
		loadingHistory(history){
			history.messages.map(m => {
				this.list.push({
					id:m.id,
					name:m.user.name,
					image:m.user.image,
					time:m.created_at,
					message:m.text,
					owner:m.user.id == this.chat.id
				})
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.lock{position: sticky;top:0;background-color: #FFF;z-index: 20;padding: 10rpx 0;}
.search{width: 686rpx;height: 88rpx;border-radius: 32rpx;margin: 32rpx;
	background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
	.ipt{width: 540rpx;}
}
.panel{padding-bottom: 40rpx;
	.msg{margin: 24rpx 0;
		.head{width: 60rpx;height: 60rpx;border-radius: 100%;overflow: hidden;margin: 0 24rpx;background-color: #eaeaec;}
		.package{padding: 24rpx;font-size: 28rpx;word-break: break-all;
			max-width: 496rpx;
		}
	}
	.msg-left{
		.package{border-radius: 0 32rpx 32rpx 32rpx;color: #191717;background-color: #F7F7FA;}
	}
	.msg-right{
		.package{border-radius: 32rpx 0 32rpx 32rpx;color: #FFF;background-color: #457FD4;}
	}
}
.list{
	.item{padding: 32rpx;border-bottom: 10rpx solid #F7F7FA;
		.head{width: 60rpx;height: 60rpx;border-radius: 100%;overflow: hidden;margin-right: 28rpx;background-color: #eaeaec;}
		.txt{color: #191717;font-size: 28rpx;word-break: break-all;padding-left: 88rpx;margin-top: 10rpx;}
		.time{color: #4F4F5F;font-size: 20rpx;}
	}
}
</style>