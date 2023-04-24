<template>
	<view>
		<view class="colls">
			<view class="coll-item " v-for="group,i in colls" :key="i" >
				<view class="group flex j-between a-center" @tap="group.coll=!group.coll">
					<view>{{group.name}}</view>
					<u-icon2 v-if="group.coll" name="Right" color="#BEBECD" size="40"></u-icon2>
					<u-icon2 v-else name="Down" color="#457FD4" size="40"></u-icon2>
				</view>
				<view class="list" v-if="!group.coll">
					<view v-for="item,idx in group.items" :key="idx">
						<view v-if="item.show" class="item flex j-between a-center" @tap="toChat(item,i)">
							<view class="flex a-center">
								<view class="head">
									<image class="image" :src="$oss(item.avatar)"></image>
								</view>
								<view>{{item.name}}</view>
							</view>
							<view v-if="group.rm" class="remove" @tap.stop="remove(item)">Remove</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup mode="bottom" v-model="show_remove" border-radius="80">
			<view class="pop">
				<view class="flex j-center a-center">
					<view class="bar"></view>
				</view>
				<view class="title">Are you sure you want to remove him from the blacklist?</view>
				<view class="opts flex j-between">
					<view class="btn flex j-center a-center" @tap="show_remove=false">
						<view>Cancel</view>
					</view>
					<view class="yes btn flex j-center a-center" @tap="removeBlack">
						<view>Yes</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default{
	props:{
		search:{
			type:Boolean,
			default:false,
		},
		keyword:{
			type:String,
			default:''
		}
	},
	data(){
		return{
			show_remove:false,
			colls:[
				{name:'Following',coll:true,items:[],rm:false,},
				{name:'Followers',coll:true,items:[],rm:false,},
				{name:'Blocked Users',coll:true,items:[],rm:true,},
			],
			black:null,
		}
	},
	mounted() {
		this.init()
	},
	computed:{
		chat(){
			return this.$store.state.chat
		}
	},
	watch:{
		keyword:function(val,old){
			if(val.length && this.search){
				this.colls.map(m =>{
					m.coll = false
					m.items.map(m2 => {
						if((new RegExp(val)).test(m2.name)){
							m2.show = true
						}else{
							m2.show = false
						}
						return m2
					})
					return m
				})
			}else{
				this.colls.map(m =>{
					m.coll = true
					m.items.map(m2 => {
						m2.show = true
						return m2
					})
					return m
				})
			}
		}
	},
	methods:{
		init(){
			this.colls[0].items = [
				// {name:'Jack',id:'ba382f74-594d-4652-a95e-91b7d7942478'},
				// {name:'Rose',id:'ab44210a-726f-47eb-86f9-02eb87fc3d0c'},
				// {name:'Tom',id:'3681aa56-9a4f-47fe-a7b1-b1178f6758d9'},
			]
			this.colls[1].items = []
			this.colls[2].items = []
			this.getFollowMe()
			this.getMyfollow()
			this.getBlack()
		},
		toChat:async function(item,i){
			if(i < 2){
				// this.goto('/pages/member-chat?id='+item.id+'&icon='+item.avatar+'&me='+this.chat.name+'&him='+item.name)
				uni.redirectTo({
					url: '/pages/member-chat?id='+item.id+'&icon='+item.avatar+'&me='+this.chat.name+'&him='+item.name
				})
			}
		},
		//关注我
		getFollowMe(){
			this.$api.followme({
			   "followType": 0,
			    "forward": true,
			    "lastEvaluatedKey": {},
			    "locked": 0,
			    "pageSize": 20000,
			    "search": "",
			    "sortField": "createTime",
			    "sortMethod": "desc"
			}).then(res => {
				this.colls[1].items = this.colls[1].items.concat(res.body.map(m=>{
					return{
						name:m.master.nickName ?m.master.nickName:m.master.userName,
						id:m.master.userId,
						avatar:m.master.avatar,
						show:true,
					}
				}))
			})
		},
		//我关注
		getMyfollow(){
			this.$api.myFllow({
			  "followType": 0,
			  "forward": true,
			  "lastEvaluatedKey": {},
			  "locked": 0,
			  "pageSize": 20000,
			  "search": "",
			  "sortField": "createTime",
			  "sortMethod": "desc",
			  "userId": ""
			}).then(res => {
				this.colls[0].items = this.colls[0].items.concat(res.body.map(m=>{
					return{
						name:m.content.nickName ?m.content.nickName:m.content.userName,
						id:m.content.userId,
						avatar:m.content.avatar,
						show:true,
					}
				}))
			})
		},
		//黑名单
		getBlack(){
			this.$api.blackList().then(res => {
				this.colls[2].items = res.body.map(m=>{
					return{
						name:m.nickName,
						id:m.blackUserId,
						avatar:m.avatar,
						show:true,
					}
				})
			})
		},
		remove(item){
			this.black = item
			this.show_remove=true
		},
		removeBlack(){
			if(!!this.black){
				this.$api.delBlack({userId: this.black.id}).then(res => {
					this.init()
					this.show_remove = false
				})
			}else{
				this.show_remove=false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.colls{
	.coll-item{
		.group{padding:16rpx 32rpx;}
		.list{margin-top: 16rpx;padding: 0 32rpx;
			.item{padding: 16rpx 0;
				.head{width: 96rpx;height: 96rpx;border-radius: 100%;overflow: hidden;margin-right: 32rpx;background-color: #c2c2ca;}
				.name{size: 32rpx;}
				.remove{color: #457FD4;font-size: 20rpx;}
			}
		}
	}
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
</style>