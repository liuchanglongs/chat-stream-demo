<template>
	<view class="panel">
		<view class="title">Follows</view>
		<view class="list">
			<view class="item rela" v-for="item,i in list" :key="i">
				<view class="user flex a-center">
					<view class="head">
						<image class="image" :src="$oss(item.avatar)"></image>
					</view>
					<view>
						<view class="name" v-if="item.followFlag == 1">{{item.nickName}} followed me</view>
						<view class="name" v-else>{{item.nickName}} unfollow me</view>
					</view>
				</view>
				<view class="btm flex j-between a-center">
					<view class="time">Notification time {{item.createTime | filterTime}}</view>
				</view>
				<!-- <view v-if="item.userRelation==1 || item.userRelation==4" class="focus abso flex j-center a-center"  @tap="saveFollow(item,i)">
					<view class="flex j-center a-center">
						<view>+Follows</view>
					</view>
				</view>
				<view v-if="item.userRelation==2" class="focus not abso flex j-center a-center">
					<view  class="flex j-center a-center">
						<view>Followed</view>
					</view>
				</view> -->
				<!-- <view v-if="item.userRelation==3" class="focus not abso flex j-center a-center">
					<view class="flex j-center a-center">
						<view>Mutual</view>
					</view>
				</view> -->
				<view class="close abso flex j-center a-center">
					<u-icon name="close" size="30" color="#999"  @tap="remove(item,i)"></u-icon>
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
		saveFollow(item,index){
			this.$api.saveFollow({
				  "followType": 0,
				  "userId": item.contentId,
				  "content":{
					  "pk":"User#" + item.contentId,
					  "sk":item.contentId,
					  "name":item.nickName,
				  }
			}).then(res => {
				if(res.statusCode == 1){
					item.userRelation = item.userRelation == 4 ? 2: 3
				}
			})
		},
		getList(){
			this.$api.pageSocialNoticeFollowMeHandle({
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
			.time{font-size: 20rpx;color: #BEBECD;}
		}
		.question{margin-top: 48rpx;font-weight: bold;font-size: 28rpx;}
		.btm{margin-top: 36rpx;}
		.time{font-size: 20rpx;color: #BEBECD;}
		.answer{color: #457FD4;
			.txt{margin-left: 16rpx;}
		}
		.focus{width: 96rpx;height: 40rpx;border-radius: 10rpx;right: 32rpx;top:80rpx;
			border:1rpx solid #457FD4;color:#457FD4;font-size: 18rpx;
		}
		.not{background-color: rgba(69, 127, 212, 0.1);border:none;color: #BEBECD;}
		.close{top:32rpx;right: 32rpx;}
	}
}
</style>