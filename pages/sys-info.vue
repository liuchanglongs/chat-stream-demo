<template>
	<view>
		<u-navbar>
			<template>
				<view class="title flex j-center a-center">
					<view>System information</view>
				</view>
			</template>
		</u-navbar>
		<view class="tabs" :style="[getTop()]">
			<u-subsection :list="list" :current="current" :height="96" :bold="false" :borderRadius="12" :buttonPadding="4"
			 @change="change" inactive-color="#BEBECD" :badge="true"></u-subsection>
		</view>
		<view class="panel">
			<sys1 v-if="current==0" :gopage="gopage"></sys1>
			<sys2 v-if="current==1" :gopage="gopage"></sys2>
			<sys3 v-if="current==2" :gopage="gopage"></sys3>
			<sys4 v-if="current==3" :gopage="gopage"></sys4>
		</view>
	</view>
</template>

<script>
import sys1 from './components/sys1.vue'
import sys2 from './components/sys2.vue'
import sys3 from './components/sys3.vue'
import sys4 from './components/sys4.vue'
export default{
	components:{sys1,sys2,sys3,sys4},
	data(){
		return{
			gopage:0,
			top:44,
			list: [
				{name: 'System',count:0}, 
				// {name: 'Community',count:0}, 
				// {name: 'Research',count:0}, 
				// {name: 'Group',count:0}, 
			],
			current: 0
		}
	},
	computed:{
		syscount(){
			return this.$store.state.sysinfo
		}
	},
	watch:{
		syscount:function(val,old){
			this.list =  [
				{name: 'System',count:val.system}, 
				// {name: 'Community',count:val.community}, 
				// {name: 'Research',count:val.research}, 
				// {name: 'Group',count:val.group}, 
			]
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
			}
		})
		this.list =  [
			{name: 'System',count:this.syscount.system}, 
			// {name: 'Community',count:this.syscount.community}, 
			// {name: 'Research',count:this.syscount.research}, 
			// {name: 'Group',count:this.syscount.group}, 
		]
	},
	methods:{
		onReachBottom() {
			this.gopage ++
		},
		change(i){
			this.current = i
			this.gopage = 0
		},
		getTop(){
			return {top:this.top*2+'rpx'}
		}
	}
}
</script>

<style lang="scss" scoped>
.title{width: 100%;}
.tabs{padding: 36rpx 32rpx;background-color: #FFF;position: sticky;z-index: 20;}
.panel{padding: 32rpx;}
</style>