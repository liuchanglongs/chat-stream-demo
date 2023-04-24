<template>
	<view class="list">
		<view class="item flex j-between a-center" v-for="channel,i in list" :key="i" @tap="clickgoto('/pages/group-chat?cid='+channel.cid+'&name='+channel.data.name)">
			<view class="box flex j-center a-center">
				<view class="head">
					<image class="image" :src="$oss(channel.data.image)"></image>
				</view>
			</view>
			<view class="ctt flex a-center">
				<view>{{channel.data.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			list:[]
		}
	},
	created:async function() {
		this.list = await this.chat.getChatList('group-chat')
		console.log(this.list)
	},
	computed:{
		chat(){
			return this.$store.state.chat
		},
	},
	methods:{
		clickgoto(item) {
			uni.redirectTo({
				url: item
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.list{
	.item{padding: 0 14rpx;
		.box{width: 116rpx;height: 116rpx;
			.head{width: 100rpx;height: 100rpx;border-radius: 20rpx;overflow: hidden;}
		}
		.ctt{width: 580rpx;height: 116rpx;border-bottom: 1rpx solid #E0E0EA4D;}
	}
}
</style>