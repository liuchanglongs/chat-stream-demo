<template>
	<view>
		<view v-for="item,i in list" :key="i" @tap="read(item)">
			<!-- LEVEL通知 -->
			<view class="box rela" v-if="itme.infoType=='1001'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title ecllipse2 word-break">{{item.title}}</view>
				<view class="ctt ecllipse2 word-break">{{item.contentText}}</view>
				<view class="time">{{item.createTime}}</view>
				<view class="level abso green"></view> 
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- LOCK UNLOCK通知 -->
			<view class="box rela" v-if="['1002','1003','1004','1005'].includes(item.infoType)">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
				</view>
				<view class="title ecllipse2 word-break">{{item.title}}</view>
				<view class="white-panel word-break">
					{{item.contentText}}
				</view>
				<view class="time">{{item.createTime}}</view>
				<view class="close abso flex j-center a-center" @tap.stop="remove(item)">
					<u-icon2 name="Close_line" size="20" color="#999"></u-icon2>
				</view>
			</view>
			<!-- 提现到账通知 -->
			<view class="box rela" v-if="item.infoType=='1006'">
				<view class="top flex a-center">
					<view class="icon rela flex j-center a-center">
						<u-icon2 name="System" color="#FFF" size="30"></u-icon2>
					</view>
					<view class="notice">Little assistant</view>
					<view class="tip">(Change arrival reminder)</view>
				</view>
				<view class="money flex j-center a-center"> ${{item.title}} </view>
				<view class="o-time flex a-center" v-for="sub,j in item.items" :key="j">
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
				 "categoryId": "1",
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
	.title{font-size: 28rpx;font-weight: 400;margin-top: 28rpx;}
	.ctt{font-size: 24rpx;color: #454545;font-weight: 400;margin-top: 20rpx;}
	.time{font-size: 20rpx;color: #BEBECD;margin-top: 28rpx;}
	.level{width: 10rpx;height: 40rpx;right: 0;top:50%;transform: translateY(-50%);background-color: #73DC7D;}
	.green{background-color: #73DC7D;}
	.red{background-color: #FF6161;}
	.yellow{background-color: #FFC226;}
	.close{top:20rpx;right: 20rpx;}
	
	//lock unlock
	.white-panel{background-color: #FFF;border-radius: 10rpx;padding: 24rpx;margin-top: 20rpx;font-size: 24rpx;}
	
	//提现到账
	.tip{font-size: 20rpx;color: #BEBECD;margin-left: 16rpx;}
	.money{font-size: 48rpx;margin: 36rpx;}
	.o-time{margin-top: 24rpx;
		.tit{font-size: 20rpx;color: #BEBECD;width: 190rpx;}
		.val{font-size: 24rpx;color:#4F4F5F;}
	}
	.split{padding-top: 40rpx;}
}
</style>