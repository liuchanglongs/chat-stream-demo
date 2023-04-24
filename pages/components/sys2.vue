<template>
	<view>
		<view v-for="item,i in list" :key="i">
			<!-- 邀请通知 -->
			<view class="box rela" v-if="item.infoType=='2001'" @tap="read(item)">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="invite-time flex j-between a-center">
					<view class="time">{{item.createTime}}</view>
					<view class="flex j-end" v-if="!item.hasRead">
						<view class="opt-btn flex a-center" @tap.stop="setStatus(item,'reject')">
							<u-icon2 name="Close" size="30"></u-icon2>
							<view>Reject</view>
						</view>
						<view class="opt-btn flex a-center" @tap.stop="setStatus(item,'agree')">
							<u-icon2 name="Ok" size="30"></u-icon2>
							<view>Agree</view>
						</view>
					</view>
				</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item,i)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 欢迎通知 -->
			<view class="box rela" v-if="item.infoType=='2002'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 审核未通过 -->
			<view class="box rela" v-if="item.infoType=='2003'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 申请加入 -->
			<view class="box rela" v-if="item.infoType=='2004'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="white-panel word-break">
					{{item.contentText}}
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="invite-time flex j-between a-center">
					<view class="time">{{item.createTime}}</view>
					<view class="flex j-end" v-if="!item.hasRead">
						<view class="opt-btn flex a-center" @tap.stop="setStatus(item,'reject')">
							<u-icon2 name="Close" size="30"></u-icon2>
							<view>Reject</view>
						</view>
						<view class="opt-btn flex a-center" @tap.stop="setStatus(item,'agree')">
							<u-icon2 name="Ok" size="30"></u-icon2>
							<view>Agree</view>
						</view>
					</view>
				</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 离开通知 -->
			<view class="box rela" v-if="item.infoType=='2005'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 解散通知 -->
			<view class="box rela" v-if="item.infoType=='2006'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 设置管理员通知 -->
			<view class="box rela" v-if="item.infoType=='2007'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title flex j-center">
					<view>{{item.title}}</view>
				</view>
				<view class="o-line flex a-center" v-for="sub,j in item.items" :key="j">
					<view class="tit">{{sub.itemName}}</view>
					<view class="val">{{sub.value}}</view>
				</view>
				<view class="split">
					<u-line></u-line>
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
	methods:{
		getList(){
			this.$api.pageInformationHandle({
				 "categoryId": "2",
				 "forward": true,
				 "lastEvaluatedKey": {},
				 "locked": 0,
				 "pageSize": 20,
				 "search": "",
				 "sortField": "createTime",
				 "sortMethod": "desc"
			}).then(res => {
				this.list = res.body
				this.page = res.lastEvaluatedKey
				this.next = res.nextPage
			})
		},
		setStatus(item,type){
			console.log('xxxxxxxxxxxxxxx')
			// type: reject  agree
			this.$api.updateBizStatus({
				  "auditStatus": type == 'reject' ? 1 : 2,
				  "ids": [
				    item.targetId
				  ],
				  "reason": "string",
				  "systemInfo": {
				    "pk": item.pk,
				    "sk": item.sk
				  }
			}).then(res => {
				uni.showToast({
					icon:"none",
					title:res.message
				})
				item.hasRead=1
			})
		},
		read(item){
			this.$api.readsys({pk:item.pk,sk:item.sk}).then(res => {
				this.$store.dispatch('AC_GET_SYSINFO')
			})
		},
		remove(item,index){
			this.$api.delsys({pk:item.pk,sk:item.sk}).then(res => {
				this.list.splice(index,1)
				this.$store.dispatch('AC_GET_SYSINFO')
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.box{padding: 32rpx 24rpx;background-color: #F7F7FA;margin-bottom: 28rpx;border-radius: 10rpx;
	.top{
		.icon{width: 60rpx;height: 60rpx;border-radius: 60rpx;margin-right: 36rpx;background-color: #D1D1D1;}
		.notice{color: #4F4F5F;font-size: 24rpx;font-weight: 400;}
	}
	.title{font-size: 32rpx;font-weight: 400;margin-top: 36rpx;}
	.ctt{font-size: 24rpx;color: #454545;font-weight: 400;margin-top: 20rpx;}
	.time{font-size: 20rpx;color: #BEBECD;margin-top: 28rpx;}
	.level{width: 10rpx;height: 40rpx;right: 0;top:50%;transform: translateY(-50%);background-color: #73DC7D;}
	.close{top:20rpx;right: 20rpx;}
	
	//lock unlock
	.white-panel{background-color: #FFF;border-radius: 10rpx;padding: 24rpx;margin-top: 20rpx;font-size: 24rpx;}
	
	//invite
	.invite-time{margin-top: 28rpx;
		.time{margin-top: 0;}
	}
	.opt-btn{font-size: 24rpx;color: #457FD4;margin-left: 50rpx;}
	.money{font-size: 48rpx;margin: 36rpx;}
	.o-line{margin-top: 30rpx;
		.tit{font-size: 20rpx;color: #BEBECD;width: 190rpx;}
		.val{font-size: 24rpx;color:#457FD4;}
	}
	.split{padding-top: 40rpx;}
}
</style>