<template>
	<view>
		<u-navbar></u-navbar>
		<view class="menus flex flex-start a-center wrap">
			<view class="item flex col j-center a-center rela" v-for="item,i in menus" :key="i" @tap="change(i)" v-if="item.name">
				<u-badge type="error" :count="item.count" size="mini" :offset="[0,40]"></u-badge>
				<view class="icon flex j-center a-center" :class="{'checked':current==i}">
					<u-icon2 :name="item.icon" size="60" :color="current==i ? '#FFF' : '#4A4A4A'"></u-icon2>
				</view>
				<view class="name">{{item.name}}</view>
			</view>
			<!-- <view class="item flex col j-center a-center rela" @tap="goto('/pages/member-chat?id=b5f1c1bb-2425-43d0-a4a9-83f77c84f44b&icon=/logo.png'+'&me='+chat.name+'&him=FeedBack')">
				<u-badge type="error" :count="0" size="mini" :offset="[0,40]"></u-badge>
				<view class="icon flex j-center a-center">
					<u-icon2 name="Customer" size="60"></u-icon2>
				</view>
				<view class="name">Feedback</view>
			</view> -->
		</view>
		<social1 v-if="current==0" :gopage="gopage" @refreshBadge="refreshBadge"></social1>
		<social2 v-if="current==1" :gopage="gopage" @refreshBadge="refreshBadge"></social2>
		<social3 v-if="current==2" :gopage="gopage" @refreshBadge="refreshBadge"></social3>
		<social4 v-if="current==3" :gopage="gopage" @refreshBadge="refreshBadge"></social4>
		<social5 v-if="current==4" :gopage="gopage" @refreshBadge="refreshBadge"></social5>
		<social6 v-if="current==5" :gopage="gopage" @refreshBadge="refreshBadge"></social6>
		<social7 v-if="current==6" :gopage="gopage" @refreshBadge="refreshBadge"></social7>
	</view>
</template>

<script>
import social1 from './components/social-1.vue'
import social2 from './components/social-2.vue'
import social3 from './components/social-3.vue'
import social4 from './components/social-4.vue'
import social5 from './components/social-5.vue'
import social6 from './components/social-6.vue'
import social7 from './components/social-7.vue'
export default{
	components:{social1,social2,social3,social4,social5,social6,social7},
	data(){
		return{
			gopage:0,
			menus:[
				{name:'',icon:'User_edit',count:0,},
				{name:'',icon:'Question',count:0,},
				{name:'Follows',icon:'Follow_min',count:0,},
				{name:'Comment',icon:'Comment',count:0,},
				{name:'@Mention',icon:'Mine',count:0,},
				{name:'Likes',icon:'Likes',count:0,},
				{name:'Share',icon:'Share',count:0,},
				{name:'',icon:'Customer',count:0,},
			],
			current:4,
		}
	},
	onReachBottom() {
		this.gopage ++
	},
	onShow() {
		this.refreshBadge();
	},
	methods:{
		change(i){
			this.current = i
			this.gopage = 0
		},
		refreshBadge(){
			this.$api.getSocialNoticeStatistical().then(res => {
				this.menus[0].count =  res.body.invitationNum
				this.menus[1].count =  res.body.answerNum
				this.menus[2].count =  res.body.followNum
				this.menus[3].count =  res.body.commentNum
				this.menus[4].count =  res.body.atMeNum
				this.menus[5].count =  res.body.likeNum
				this.menus[6].count =  res.body.shareNum
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.menus{padding: 36rpx 0 0;border-bottom: 10rpx solid #F7F7FA;
	.item{width:33%;margin-bottom: 54rpx;
		.icon{background-color: #C4C4C426;width: 68rpx;height: 68rpx;border-radius: 100%;}
		.checked{background-color: #457FD499;}
		.name{font-size: 18rpx;margin-top: 8rpx;}
	}
}
</style>