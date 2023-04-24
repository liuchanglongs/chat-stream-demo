<template>
	<view>
		<view class="lock">
			<view class="search flex j-between a-center">
				<input v-model="keyword" class="ipt" placeholder="Nick Name"/>
				<u-icon2 name="Search" size="50" color="#BEBECD"></u-icon2>
			</view>
		</view>
		<view class="panel">
			<view class="list">
				<view v-for="item,i in list" :key="i" @tap="item.checked=!item.checked">
					<view class="item flex j-between a-center" v-if="item.show">
						<view class="flex a-center">
							<view class="head">
								<image class="image" :src="$oss(item.icon)"></image>
							</view>
							<view>{{item.name}}</view>
						</view>
						<view class="check flex j-center a-center" :class="{'checked':item.checked}">
							<u-icon2 v-if="item.checked" name="Correct" size="40" color="#FFF"></u-icon2>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit fixed flex j-center a-center">
			<view class="btn flex j-center a-center" @tap="commit">
				<view>Apply ({{list.filter(f=>f.checked).length}})</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			list:[
			],
			keyword:'',
		}
	},
	watch:{
		keyword:function(val,old){
			if(val.length){
				this.list.map(m =>{
					if((new RegExp(val)).test(m.name)){
						m.show = true
					}else{
						m.show = false
						m.checked = false
					}
					return m
				})
			}else{
				this.list.map(m =>{
					m.checked = false
					m.show = true
					return m
				})
			}
		}
	},
	created() {
		this.$api.followme({
			  "followType": 0,
			  "forward": true,
			  "lastEvaluatedKey": {},
			  "locked": 0,
			  "pageSize": 99999,
			  "search": "",
			  "sortField": "createTime",
			  "sortMethod": "desc",
			  "userId": uni.getStorageSync('id')
		}).then(res => {
			this.list = res.body.map(m => {
				return {
					name:m.master.nickName?m.master.nickName:m.master.userName,
					id:m.master.userId,
					icon:/^http/.test(m.master.avatar) ? m.master.avatar : '/logo.png',
					checked:false,
					show:true,
				}
			})
		})
	},
	methods:{
		commit(){
			let args = this.list.filter(f => f.checked)
			this.$emit('at',args)
		}
	}
}
</script>

<style lang="scss">
.lock{position: sticky;top:0;background-color: #FFF;z-index: 20;padding: 10rpx 0;}
.search{width: 686rpx;height: 88rpx;border-radius: 32rpx;
	background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
	.ipt{width: 540rpx;}
}
.panel{padding: 32rpx 32rpx 200rpx;
	.list{margin-top: 16rpx;
		.item{padding: 16rpx 0;
			.head{width: 96rpx;height: 96rpx;border-radius: 100%;overflow: hidden;margin-right: 32rpx;}
			.name{size: 32rpx;}
			.check{width: 44rpx;height: 44rpx;background-color: #EEF5FE;border-radius: 10rpx 10rpx;}
			.checked{background-color: #457FD4;}
		}
	}
}
.submit{background-color: #FFF;padding: 0 32rpx 100rpx;left: 0;right: 0;bottom: 0;
	.btn{background-color: #457FD4;color: #FFF;font-size: 32rpx;width: 686rpx;height: 96rpx;border-radius: 32rpx;}
}
</style>