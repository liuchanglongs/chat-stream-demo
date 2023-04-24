<template>
	<view>
		<u-tabbar2 active-color="#457FD4" inactive-color="#BEBECD" height="86" v-model="tabValue" @change="change" :list="tabData"></u-tabbar2>
		<u-popup v-model="addShow" mode="bottom" :border-radius="20" bgColor="transparent"
			:customStyle="{backgroundColor:'transparent'}"
		>
			<view class="pop flex col j-center a-center">
				<view class="panel">
					<view class="drafts flex j-end">
						<view class="dbtn flex a-center j-center">
							<u-icon2 name="Drafts" size="30"></u-icon2>
							<view style="margin-left: 4rpx;">Drafts</view>
						</view>
					</view>
					<view class="line1 flex j-between">
						<view class="ques rela flex a-center" style="padding-left: 28rpx;" @tap="postMsg('/pages/Add/askQuestions')">
							<view style="width: 80rpx;">Ask a question</view>
							<view class="icon abso">
								<image class="image" :src="$oss('/imgs/add0.png')"></image>
							</view>
						</view>
						<view class="ques rela flex a-center" style="padding-left: 28rpx;background-color: #457FD4;" @tap="postMsg('/pages/Add/articile')">
							<view style="width: 80rpx;">Article</view>
							<view class="icon abso">
								<image class="image" :src="$oss('/imgs/add1.png')"></image>
							</view>
						</view>
					</view>
					<view class="line2 flex j-between">
						<view class="qb flex j-center a-center">
							<view class="desc flex a-center">
								<u-icon2 name="Label" size="48" color="#457FD4"></u-icon2>
								<view class="txt">Question answering</view>
							</view>
						</view>
						<view class="qb flex j-center a-center">
							<view class="desc flex a-center">
								<u-icon2 name="Question" size="48" color="#457FD4"></u-icon2>
								<view class="txt">Questionnaire&vot</view>
							</view>
						</view>
					</view>
				</view>
				<view class="close flex j-center a-center" @tap="addShow=false">
					<u-icon2 name="Close_line" size="40" color="#FFF"></u-icon2>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	const tabData = [{
			path: "/pages/Home/index",
			text: "Home",
			customIcon: false,
			iconPath: "Home",
			selectedIconPath: 'Home_ac'
		},
		{
			path: "/pages/Message/index",
			text: "Messages",
			customIcon: false,
			iconPath: "Message",
			selectedIconPath: 'Message_ac'
		},
		{
			path: "",
			text: "Add",
			customIcon: false,
			iconPath: "Add",
			selectedIconPath: 'Add'
		},
		{
			path: "/pages/Community/index",
			text: "Community",
			customIcon: false,
			iconPath: "User",
			selectedIconPath: 'User_ac'
		},
		{
			path: "/pages/Research/index",
			text: "Research",
			customIcon: false,
			iconPath: "Research",
			selectedIconPath: 'Research_ac'
		}

	]

	export default {
		data() {
			return {
				tabValue: 1,
				addShow: false,
				tabData,
				lists: [{
						name: "Ask a question",
						path: "/pages/Add/askQuestions"
					},
					{
						name: "Article",
						path: "/pages/Add/articile"
					}
				],
				foots: [{
						text: "Question answering",
						icon: "icon-Label"
					},
					{
						text: "Questionnaire&vot",
						icon: "icon-Question"
					}
				],
			}
		},
		methods: {
			change(index){
				if(index==2){
					console.log('show')
					this.addShow = true
				}
				this.tabValue = 1
				console.log('index ',index)
				if(index != 1){
					uni.webView.postMessage({
						data: {
							postMsg: {url:this.tabData[index].path,event:'gotourl'}
						}
					})
				}

			},
			postMsg(url){
				this.addShow = false
				uni.webView.postMessage({
					data: {
						postMsg: {url:url,event:'gotourl'}
					}
				})
			},
			handleAddPath(item, index) {
				this.addShow = false;
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.pop{padding-bottom: 40rpx;
		.panel{background-color: #FFF;border-radius: 40rpx;padding: 26rpx;padding-bottom:64rpx;box-sizing: border-box;
			width: 684rpx;
			.drafts{
				.dbtn{padding:0 10rpx;height: 46rpx;color: #457FD4;font-size: 18rpx;background-color: #F4F4F4;
					border-radius: 12rpx;
				}
			}
			.line1{margin-top:48rpx;color:#FFF;font-size: 32rpx;font-weight: 500;
				.ques{width: 292rpx;height: 160rpx;background-color: #5399FF;border-radius: 28rpx;overflow: hidden;box-sizing: border-box;
					.icon{right: 0;bottom: 0;width: 96rpx;height: 88rpx;}
				}
			}
			.line2{color: #505050;font-size: 18rpx;margin-top: 60rpx;
				.qb{width: 292rpx;}
				.txt{margin-left: 13rpx;}
			}
		}
		.close{width: 80rpx;height: 80rpx;border-radius: 100%;background-color: #457FD4;margin-top: 8rpx;margin-top: 16rpx;}
	}
</style>
