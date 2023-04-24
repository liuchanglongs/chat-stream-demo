<template>
	<view class="box flex col j-center a-center">
		<u-navbar title="Chat settings"></u-navbar>
		<view class="pic">
			<image class="image" :src="$oss(item.data.image)"></image>
		</view>
		<view class="opt">
			<view class="yes o-btn flex j-center a-center" @tap="upload">
				<view>Change avatar</view>
			</view>
			<view class="o-btn flex j-center a-center" @tap="back">
				<view>Cancel</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			
		}
	},
	computed:{
		chat(){
			return this.$store.state.chat
		},
		item(){
			return this.$store.state.crtChannel
		},
	},
	methods:{
		upload(){
			const _this = this
			uni.chooseImage({
				count: 1, //
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
			    success: (chooseImageRes) => {
					console.log(chooseImageRes)
					uni.showLoading({title:'uploading...'})
					uni.uploadFile({
						url: 'http://ec2-44-210-90-26.compute-1.amazonaws.com:8089/portal/s3/upload', 
						filePath: chooseImageRes.tempFilePaths[0],
						name: "file",
						formData: {
							accessRight: 1,
							fileName:chooseImageRes.tempFiles[0].name
						},
						async success(res) {
							const data = JSON.parse(res.data);
							// console.log(data)
							await _this.item.updatePartial({ set:{image:data.body.linkUrl} });
							uni.hideLoading()
							uni.showToast({
								title:'successed.',
								icon:'none'
							})
						},
						fail() {
							uni.hideLoading()
							uni.showToast({
								title:'upload fail.',
								icon:'none'
							})
						}
					})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.box{
	.pic{width: 440rpx;height: 440rpx;border-radius: 36rpx;background-color: #D9D9D9;margin-top: 152rpx;}
	.opt{margin-top: 160rpx;
		.o-btn{margin-top: 48rpx;width: 312rpx;height: 84rpx;border-radius: 20rpx;
			background-color: #F7F7FA;color: #457FD4;
		}
		.yes{background-color: #457FD4;color:#FFF;}
	}
}
</style>