<template>
	<view class="panel">
		<view class="title">@Mention</view>
		<view class="list">
			<view class="item rela" v-for="item,i in list" :key="i" @click="clickmine(item)">
				<view class="user flex a-center">
					<view class="head">
						<image class="image" :src="$oss(item.avatar)"></image>
					</view>
					<view class="flex a-center">
						<view class="name">{{item.nickName}}</view>
						<view class="time">Mentioned me</view>
					</view>
				</view>
				<view class="question">
					<!-- 评论中@我的在二期实现
					<text class="f-at">@Johnny Depp</text>
					<text class="f-at">@Johnny Depp</text> -->
					<!-- <text>{{item.contentText}}</text> -->
					<u-parse :html="item.contentText"></u-parse>
				</view>
				<view class="ctt"  @click="goAppPage(item)">
					<view class="tit">{{item.title}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>
				<view class="btm flex j-between a-center">
					<view class="time">Notification time {{item.createTime | filterTime}}</view>
				</view>
				<view class="close abso flex j-center a-center" @click.stop="remove(item,i)">
					<u-icon name="close" size="30" color="#999"   ></u-icon>
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
			console.log(11111)
			let param = {"pk":item.pk,"sk":item.sk}
			this.$api.delStatistical(param).then(res => {
				if(res.statusCode == 1){
					this.list.splice(index,1)
					this.$emit("refreshBadge")
				}
			})
		},
		//打开App详情页面
		goAppPage(item){
			console.log(item)
		},		
		getList(){
			this.$api.pageSocialNoticeAtMe({
				"forward": true,
				"lastEvaluatedKey": this.page,
				"locked": 0,
				"pageSize": 20,
				"search": "",
				"sortField": "createTime",
				"sortMethod": "desc"
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
		clickmine(item) {
			// console.log(item)
			this.$api.readStatistical({pk:item.pk,sk:item.sk}).then(res => {
				this.$emit("refreshBadge")
				if (item.contentType == 1 ) {
				   uni.webView.postMessage({
					data: {
						postMsg: {
							pk: item.articlePk,
							sk: item.articleSk,
							contentType: item.contentType
						} //把需要传递给app的参数写在此处
					}
				   })	
				}
				if (item.contentType == 5 || item.contentType == 6) {
					uni.webView.postMessage({
						data: {
							postMsg: {
								pk: item.articlePk,
								sk: item.articleSk,
								contentType: 5
							} //把需要传递给app的参数写在此处
						}
					})	
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
		.question{margin-top: 48rpx;font-weight: bold;font-size: 28rpx;
			.f-at{color: #457FD4;}
		}
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