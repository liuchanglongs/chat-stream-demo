<template>
	<view class="panel">
		<view class="title">Comment</view>
		<view class="list">
			<view class="item rela" v-for="item,i in list" :key="item.id" @click="clickcomment(item)" >
				<view class="user flex a-center">
					<view class="head">
						<image class="image" :src="$oss(item.avatar)"></image>
					</view>
					<view class="flex a-center">
						<view class="name">{{item.nickName}}</view>
						<view class="time">replied to my comment</view>
					</view>
				</view>
				<view class="question">{{item.contentText}}</view>
				<!-- 文章 -->
				<view class="ctt" v-if="item.contentType == 1" @tap="goAppPage(item)">
					<view class="tit">{{item.content.title}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>
				<!-- 投票&问卷 -->
				<view class="ctt" v-else-if="item.contentType == 2 || item.contentType == 3 "  @tap="goAppPage(item)">
					<view class="tit">{{item.content.generalTitle}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>
				<!-- 计划 -->
				<view class="ctt" v-else-if="item.contentType == 4"  @tap="goAppPage(item)">
					<view class="tit">{{item.content.title}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>
				<!-- Question -->
				<view class="ctt" v-else-if="item.contentType == 5"  @tap="goAppPage(item)">
					<view class="tit">{{item.content.question}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>				
				<!-- topic -->
				<view class="ctt" v-else-if="item.contentType == 10"  @tap="goAppPage(item)">
					<view class="tit">{{item.content.topic}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>			
				<!-- 团购 -->
				<view class="ctt" v-else-if="item.contentType == 13"  @tap="goAppPage(item)">
					<view class="tit">{{item.content.groupOrderName}}</view>
					<!-- <view class="at">@{{item.author}}</view> -->
				</view>							
				<view class="btm flex j-between a-center">
					<view class="time">Notification time {{item.createTime | filterTime}}</view>
					<view class="answer flex a-center" @tap="toMessage(item)" @tap.stop.prevent>
						<u-icon2 name="Forum"></u-icon2>
						<view class="txt">Reply</view>
					</view>
				</view>
				<view class="close abso flex j-center a-center" @click.stop="remove(item,i)">
					<u-icon name="close" size="30" color="#999"></u-icon>
				</view>
			</view>
		</view>
		<view class="reply fixed" v-if="reply">
			<view class="mask abso" @tap="closeReply"></view>
			<view class="ctrl abso" :style="[getBottom()]">
				<view class="msg flex a-center j-between">
					<view class="box">
						<view class="at-txt">{{at_text}}</view>
						<textarea v-model="message" cursor-spacing="224" class="ipt" maxlength="-1" auto-height @focus="other=true"></textarea>
					</view>
					<view class="send flex j-center a-center" @tap="sendMessage">
						<u-icon2 name="Send" color="#FFF" size="50"></u-icon2>
					</view>
				</view>
<!-- 这个版本临时屏蔽，二期增加此功能
				<view v-if="other" class="other flex a-center">
					<view class="opt flex j-center a-center">
						<u-icon2 name="Mine" size="40" color="#ccc" @tap="at=true"></u-icon2>
					</view>
				</view> -->
			</view>
		</view>
		<!-- 这个版本临时屏蔽，二期增加此功能
		 <u-popup mode="bottom" v-model="at" border-radius="80">
			<view class="pop">
				<view class="flex j-center a-center">
					<view class="bar"></view>
				</view>
				<view class="title">@</view>
				<scroll-view class="at-user rela" :scroll-y="true">
					<at-user @at="atUsersCmt"></at-user>
				</scroll-view>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
import moment from "moment"
import atUser from './at-user-cmt.vue'
export default{
	name:"Comment",
	components:{atUser},
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
			other:false,
			message:'',
			reply:false,
			at:false,
			comment:{},
			at_list:[],
			at_text:'',
			
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
		},
		other:function(val){
			if(val){
				this.$nextTick(()=>{
					this.scrollTop = this.list.length * 160
				})
			}
		},
		at_list:function(val,old){
			this.at_text = val.map(m => '@'+m.name+'　').join('')
		},
		message:function(val,old){
			
			
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
		toMessage(item){
			this.reply = true
			this.comment = item
		},
		//打开App详情页面
		goAppPage(item){
			console.log(item)
		},
		//回复消息
		sendMessage(){
			let prms = {
				msg:this.message,//内容
				at_list:this.at_list.map(m => m.id).join(','), //at 用户id字符串 逗号分隔
			}
			if(!prms.msg){
				uni.showToast({
					icon:'none',
					title:'请输入回复内容'
				})
				return
			}
			
			let params =   { "commentContext": this.message,
			    "parentComment": {
			      "pk": this.comment.contentPk,
			      "sk": this.comment.contentSk,
			      "name": ""
			    }
			}
			this.$api.commentReply(params).then(res=>{
				if(res.statusCode == 1){
					this.$api.readStatistical({pk:this.comment.pk,sk:this.comment.sk}).then(res => {
						this.$emit("refreshBadge")
					})
				}
			})

			this.at_list = []
			this.message = ''
			this.reply = false
		},
		closeReply(){
			this.reply = false
			this.other = false
			this.message = ''
			
		},
		getBottom(){
			return {bottom:(this.bottom*2)+'rpx'}
		},
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
				"lastEvaluatedKey": this.page,
				"locked": 0,
				"pageSize": 20,
				"search": "",
				"sortField": "createTime",
				"sortMethod": "desc",
				"type": "1"
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
		atUsersCmt(args){
			this.at = false
			if(args.length){
				this.at_list = args
			}
		},
		clickcomment(item) {
			this.$api.readStatistical({pk:item.pk,sk:item.sk}).then(res =>{
				this.$emit("refreshBadge")
				if (item.contentType == 1 ) {
				   uni.webView.postMessage({
					data: {
						postMsg: {
							pk: item.content.pk,
							sk: item.content.sk,
							contentType: item.contentType
						} //把需要传递给app的参数写在此处
					}
				   })	
				}
				if (item.contentType == 5 || item.contentType == 6) {
					uni.webView.postMessage({
						data: {
							postMsg: {
								pk: item.content.pk,
								sk: item.content.sk,
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
		.question{margin-top: 48rpx;font-weight: bold;font-size: 28rpx;}
		.ctt{background-color: #FFF;border-radius: 20rpx;padding: 24rpx;margin-top: 16rpx;
			.tit{font-weight: bold;margin-bottom: 6rpx;font-size: 24rpx;}
			.at{color: #4F4F5F80;font-size: 16rpx;}
		}
		.btm{margin-top: 36rpx;}
		.time{font-size: 20rpx;color: #BEBECD;}
		.answer{color: #457FD4;font-size: 24rpx;
			.txt{margin-left: 16rpx;}
		}
		.close{top:32rpx;right: 32rpx;}
	}
}
.reply{left: 0;right: 0;bottom: 0;top:0;z-index: 9;
	.mask{left: 0;right: 0;bottom: 0;top:0;background: rgba(0, 0, 0, 0.3);}
	.ctrl{left: 0;right: 0;bottom: 0;background: #FFF;
		.msg{box-sizing: border-box;
			box-shadow: 0px -4px 4px #F2F2F2;
			padding: 28rpx 32rpx;
			.box{width: 574rpx;box-sizing: border-box;min-height: 88rpx;border:1rpx solid #45515433;border-radius: 10rpx;
				padding: 0 10rpx;
				// .ipt{width: 100%;}
				.at-txt{color:#457FD4;font-size: 28rpx;}
				/deep/ .uni-textarea-wrapper {
						max-height: 180rpx;
						height: 88rpx;
					}
			}
			.send{width: 88rpx;height: 88rpx;background-color: #457FD4;border-radius: 24rpx;}
		}
		.other{background-color: #F7F7FA;height: 100rpx;
			.opt{width: 80rpx;height: 80rpx;margin-right: 40rpx;}
		}
	}
}
.pop{padding: 16rpx 26rpx 48rpx;
	.bar{background-color: #E0E0EA;width: 60rpx;height: 8rpx;border-radius: 12rpx;}
	.title{color: #000;font-weight: bold;font-size: 40rpx;margin-top: 48rpx;}
	.at-user{margin-top: 20rpx;max-height: 75vh;}
}
</style>