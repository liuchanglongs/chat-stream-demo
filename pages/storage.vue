<template>
	<view>
		<u-navbar title="Storage"></u-navbar>
		<view class="panel">
			<view class="list">
				<view class="item flex j-between a-center" v-for="item,i in list" :key="i" @tap="check(item)">
					<view class="flex">
						<view class="head flex j-center a-center">
							<!-- <u-icon2 v-if="item.icon=='image'" name="Image" size="80"></u-icon2> -->
							<image v-if="item.icon=='image'" class="image" :src="item.url" mode="aspectFill"></image>
							<u-icon2 v-if="!!item.icon && item.icon!='image'" name="File_info" size="80"></u-icon2>
							<u-icon2 v-if="!item.icon" name="Folder" size="80"></u-icon2>
						</view>
						<view class="desc">
							<view class="name ecllipse3">{{item.name}}</view>
							<view class="time">{{item.time}}</view>
						</view>
					</view>
					<view v-if="item.canuse" class="check flex j-center a-center" :class="{'checked':item.checked}">
						<u-icon2 v-if="item.checked" name="Correct" size="40" color="#FFF"></u-icon2>
					</view>
				</view>
			</view>
		</view>
		<view class="submit fixed flex j-center a-center">
			<view class="btn flex j-center a-center" @tap="send">
				<view>Send ({{list.filter(f => f.checked).length}})</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			list:[
				// {name:'Image file',icon:'Image',time:'2021-03-12 16:00',checked:false,canuse:true,},
			],
			next:{},
			paths:['/'],
			top:44,
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
	onLoad() {
		this.getList()
	},
	onReachBottom() {
		if(this.next.gsiSk){
			this.getList()
		}
	},
	methods:{
		async send(){
			let list = this.list.filter(f => f.checked)
			if(list.length){
				// debugger
				for(let i = 0;i<list.length;i++){
					await this.item.sendMessage({text:JSON.stringify(list[i])})
				}
				this.back()
			}
		},
		check(item){
			if(item.canuse){
				item.checked=!item.checked
			}else{
				this.paths.push(item.id)
				console.log(this.paths)
				// console.log('/'+this.paths.join('/')+this.paths.length?'/':'')
				// debugger
				this.list = []
				this.getList()
			}
		},
		getList(){
			this.$api.listFile({
			  "directoryId": this.paths[this.paths.length - 1],
			  "fileType": "",
			  "forward": true,
			  "lastEvaluatedKey": this.next,
			  "locked": 0,
			  "pageSize": 20,
			  "search": "",
			  "sortField": "createTime",
			  "sortMethod": "desc"
			}).then(res => {
				this.next = res.lastEvaluatedKey
				this.list = this.list.concat(res.body.map(m => {
					let canuse = true
					if(m.fileType == "directory"){
						canuse = false
					}
					return {
						...m,
						id:m.fileId,
						name:m.fileName,
						icon:m.mimeType,
						url:m.fileUrl,
						time:this.$toDate(m.createTime),
						contentType:m.mimeType,
						checked:false,
						canuse:canuse
					}
				}))
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.lock{position: sticky;top:0;background-color: #FFF;z-index: 20;padding: 10rpx 0;}
.search{width: 686rpx;height: 88rpx;border-radius: 32rpx;margin: 32rpx;
	background-color: #F7F7FA;padding: 0 32rpx;box-sizing: border-box;
	.ipt{width: 540rpx;}
}
.panel{padding: 32rpx 32rpx 200rpx;
	.list{margin-top: 16rpx;
		.item{padding: 24rpx;width: 680rpx;height: 240rpx;margin: 32rpx auto;border:2rpx solid #457FD4;
			border-radius: 32rpx;box-sizing: border-box;
			.head{width: 144rpx;height: 192rpx;border-radius: 32rpx;overflow: hidden;margin-right: 48rpx;
				background-color: #457FD4;color: #FFF;
			}
			.desc{padding-top: 24rpx;width: 400rpx;
				.name{font-size: 28rpx;word-break: break-all;}
				.time{color: #4F4F5F;font-size: 24rpx;margin-top: 10rpx;}
			}
			.check{width: 44rpx;height: 44rpx;background-color: #EEF5FE;border-radius: 10rpx 10rpx;}
			.checked{background-color: #457FD4;}
		}
	}
}
.submit{background-color: #FFF;padding: 20rpx 32rpx 100rpx;left: 0;right: 0;bottom: 0;
	.btn{background-color: #457FD4;color: #FFF;font-size: 32rpx;width: 686rpx;height: 96rpx;border-radius: 32rpx;}
}
</style>