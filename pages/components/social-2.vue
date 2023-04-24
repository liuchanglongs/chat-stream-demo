<template>
	<view class="panel">
		<view class="title">Answer</view>
		<view class="list">
			<view class="item rela" v-for="item,i in list" :key="i" @click="clickanswer(item)">
				<view class="user flex a-center">
					<view class="head">
						<image class="image" :src="$oss(item.avatar)"></image>
					</view>
					<view class="flex a-center">
						<view class="name">{{item.nickName}}</view>
						<view class="time">Answer my question</view>
					</view>
				</view>
				<view class="question">
					<u-parse :html="item.contentText"></u-parse>
				</view>
				<view class="ctt">
					<view class="tit">{{item.title}}</view>
					<view class="at">@{{item.author}}</view>
				</view>
				<view class="btm flex j-between a-center">
					<view class="time">Notification time {{item.createTime | filterTime}}</view>
				</view>
				<view class="close abso flex j-center a-center">
					<u-icon name="close" size="20" color="#999"  @tap="remove(item,i)"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import moment from "moment"
export default{
	props:{
		gopage:{
			type:Number,
			default:0
		}
	},
	data(){
		return{
			list:[],
			next:false,
			page:{},
		}
	},
	created() {
		this.getList()
	},
	watch:{
		gopage:function(val){
			if(this.next){
				this.getList()
			}
		}
	},
	filters:{
		filterTime(text) {
			if (!text) {
				return ""
			}
			return moment(new Date(text)).format("MM-DD-YYYY h:mm A")
		}
	},
	methods:{
		remove(item,index){
			let param = {"pk":item.pk,"sk":item.sk}
			this.$api.delStatistical(param).then(res => {
				if(res.statusCode == 1){
					this.list.splice(index,1)
					this.$emit("refreshBadge")
				}
			})
		},		
		getList(){
			this.$api.pageSocialNoticeCommentsAndRepliesHandle({
				"forward": true,
				"lastEvaluatedKey":this.page,
				"locked": 0,
				"pageSize": 20,
				"search": "",
				"sortField": "createTime",
				"sortMethod": "desc",
				"type": "2"
			}).then(res => {
				if (this.page == '{}') {
					this.list = res.body
					this.page = res.lastEvaluatedKey
					this.next = res.nextPage
				} else {
					this.list = [...this.list, ...res.body]
					this.page = res.lastEvaluatedKey
					this.next = res.nextPage
				}
			})
		},
		clickanswer(item) {
			console.log('item')
			console.log(item)
			uni.webView.postMessage({
				data: {
					postMsg: {
						pk: item.contentPk,
						sk: item.contentSk,
						contentType: 5
					} //把需要传递给app的参数写在此处
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.panel{padding: 32rpx;
	.title{font-size: 32rpx;color: #455154;}
	.item{background-color: #F7F7FA;border-radius: 10rpx;padding: 20rpx 32rpx;margin-top: 28rpx;
		.user{
			.head{width: 60rpx;height: 60rpx;border-radius: 100%;margin-right: 16rpx;overflow: hidden;background-color: #BEBECD;}
			.name{color: #455154;}
			.time{font-size: 20rpx;color: #BEBECD;margin-left: 10rpx;}
		}
		.question{margin-top: 48rpx;font-weight: bold;font-size: 28rpx;}
		.ctt{background-color: #FFF;border-radius: 20rpx;padding: 24rpx;margin-top: 16rpx;
			.tit{font-weight: bold;margin-bottom: 6rpx;font-size: 24rpx;}
			.at{color: #4F4F5F80;font-size: 16rpx;}
		}
		.btm{margin-top: 36rpx;}
		.time{font-size: 20rpx;color: #BEBECD;}
		.close{top:32rpx;right: 32rpx;}
	}
}
</style>