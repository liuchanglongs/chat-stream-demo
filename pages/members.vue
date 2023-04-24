<template>
	<view>
		<u-navbar v-if="search" :is-back="false">
			<template>
				<view class="ipt-search">
					<view class="box">
						<input class="ipt" @blur="search=false,keyword=''" placeholder="Nickname" v-model="keyword"/>
					</view>
				</view>
			</template>
		</u-navbar>
		<u-navbar v-else title="Member">
			<template #right>
				<view class="s-icon">
					<u-icon2 name="Search" color="#BEBECD" size="50" @tap="search=true"></u-icon2>
				</view>
			</template>
		</u-navbar>
		<view class="tabs" :style="[getTop()]">
			<u-subsection :list="list" :current="current" :height="96" :bold="false" :borderRadius="12" :buttonPadding="4"
			 inactive-color="#BEBECD" @change="change"></u-subsection>
		</view>
		<view class="panel">
			<member-user v-if="current==0" :search="search" :keyword="keyword"></member-user>
			<member-group v-if="current==1"></member-group>
		</view>
	</view>
</template>

<script>
import memberUser from './components/member-user.vue'
import memberGroup from './components/member-group.vue'
export default{
	components:{memberGroup,memberUser},
	data(){
		return{
			top:44,
			search:false,
			keyword:'',
			list: [
				{name: 'User'}, 
				{name: 'Group'}, 
			],
			current: 0
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
			}
		})
	},
	methods:{
		change(i){
			this.current = i
		},
		getTop(){
			return {top:this.top*2+'rpx'}
		}
	}
}
</script>

<style lang="scss" scoped>
.ipt-search{width: 100%;height: 84rpx;padding: 0 32rpx;
	.box{background-color: #F7F7FA;border-radius: 28rpx;height: 100%;padding: 0 20rpx;
		.ipt{width: 100%;height: 100%;}
	}
}
.s-icon{padding-right: 36rpx;}
.tabs{padding: 36rpx 32rpx;background-color: #FFF;position: sticky;z-index: 20;}
.panel{}
</style>