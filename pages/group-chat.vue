<template>
	<view>
		<u-navbar :customBack="navBack" :isBack1='true'>
			<template >
				<view class="title flex col j-center a-center">
					<view class="ecllipse" style="width: 400rpx;text-align: center;">{{title}}</view>
					<view class="mems">{{count}} Members</view>
				</view>
			</template>
			<template #right>
				<view class="b-menus flex a-center">
					<view class="m" @tap="goto('/pages/chat-group-set?cid='+channel.cid+'&name='+title)">
						<u-icon2 name="Menu" size="50"></u-icon2>
					</view>
				</view>
			</template>
		</u-navbar>
		<scroll-view 
		class="panel fixed" 
		:style="{'top':top,'bottom':bottom}" 
		:scroll-top="scrollTop" 
		:scroll-y="true" 
		@tap="other=false"
		:scroll-into-view="scrollInto"
		scroll-with-animation
		>
			<view v-for="item,i in list" :key="i" :id="`itemId_${i}`">
				<u-loadmore :load-text="{loadmore:$toDate(item.time)}" font-size="18"></u-loadmore>
				<view v-if="!item.owner" class="msg msg-left flex" style="position: relative;">
					<view class="head">
						<image class="image" mode="aspectFill" :src="$oss(item.image)"></image>
					</view>
					<view style="position: absolute;left: 50px;top: -10px;">
						<view style="color: #666666;font-size: 12px;">{{item.name}}</view>
					</view>
					<view class="package" v-if="item.isLink">
						<view @tap="gotoAppPage(item.message)" class="link_02">link: {{item.message.content}}</view>
					</view>
					<view class="package" v-if="item.isImg">
						<view class="link_02">
							<view class="pic" @tap="preview(item.message.fileUrl)">
								<image class="image":src="$oss(item.message.fileUrl)"></image>
							</view>
						</view>
					</view>
					<view class="package" v-if="item.isDown">
						<view @tap="down(item.message)" class="link_02">get: {{item.message.fileName}}</view>
					</view>
					<view class="package" v-if="!item.isJson"><text>{{item.message}}</text></view>
				</view>
				<view v-else class="msg msg-right flex j-end">
					<view class="package" v-if="item.isLink">
						<view @tap="gotoAppPage(item.message)" class="link_01">link: {{item.message.content}}</view>
					</view>
					<view class="package" v-if="item.isImg">
						<view class="link_02">
							<view class="pic" @tap="preview(item.message.fileUrl)">
								<image class="image" mode="aspectFill" :src="$oss(item.message.fileUrl)"></image>
							</view>
						</view>
					</view>
					<view class="package" v-if="item.isDown">
						<view @tap="down(item.message)" class="link_01">get: {{item.message.fileName}}</view>
					</view>
					<view class="package" v-if="!item.isJson"><text>{{item.message}}</text></view>
					<view class="head">
						<image class="image" :src="$oss(item.image)"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="ctrl fixed" :style="[getBottom()]">
			<view class="msg flex a-center j-between">
				<view class="box">
					<!-- <input   ref="textareaCh" v-model="message.message" cursor-spacing="224" class="ipt" @focus="other=true" @input="textareaChange" @blur="blurChange" @confirm="sendMessage"></input> -->
				    <textarea
					  ref="textareaCh"
				      v-model="message.message" 
				      cursor-spacing="224" 
				      class="ipt" 
					  @input="textareaChange"
					  @linechange="getDomConfig"
				      @focus="other=true"
					  @blur="blurChange"
					  @confirm="sendMessage"
					  @keyboardheightchange="keyboardheightchange"
				      auto-height
				      ></textarea>
				</view>
				<view class="send flex j-center a-center" @touchend.prevent="sendMessage">
					<u-icon2 name="Send" color="#FFF" size="50"></u-icon2>
				</view>
			</view>
			<!-- 注释上传附件按钮 -->
			<!-- <view v-if="other" class="other flex a-center">
				<view class="opt flex j-center a-center" @tap="show_at=true">
					<u-icon2 name="Mine" size="40" color="#ccc"></u-icon2>
				</view>
				<view class="opt flex j-center a-center" @tap="goto('/pages/storage')">
					<u-icon2 name="File" size="40" color="#ccc"></u-icon2>
				</view>
			</view> -->
		</view>
		<u-popup mode="bottom" v-model="show_at" border-radius="80">
			<view class="pop">
				<view class="flex j-center a-center">
					<view class="bar"></view>
				</view>
				<view class="title">@</view>
				<scroll-view class="at-user rela" :scroll-y="true">
					<at-user @close="show_at=false"></at-user>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import atUser from './components/at-user.vue'
export default {
	components:{atUser},
	data(){
		return{
			top:44,
			bottom:0,
			height:0,
			other:false,
			show_at:false,
			channel:null,
			title:'',
			count:0,
			message:{
				message:''
			},
			text:'',
			list:[],
			scrollTop:0,
			scrollStyle:{},
			// 滚动到最底部的id
			scrollInto:''
		}
	},
	onLoad:async function(prms) {
		uni.getSystemInfo({
			success(res) {
				this.top+=res.safeArea.top
				this.bottom+=res.safeArea.bottom
			}
		})
		if(!prms.cid){
			this.back()
		}else{
			this.channel = await this.chat.getChatListByCid(prms.cid)
			
			this.title = this.channel.data.name
			this.count = this.channel.data.member_count

			this.$store.commit('set_crtChannel',this.channel)
			let history = await this.channel.watch()
			this.loadingHistory(history)

			await this.channel.markRead({ user_id: this.chat.id })

			this.channel.on("message.new", this.getMessage)
		}
	},
	onUnload() {
		this.channel.off("message.new", this.getMessage)
	},
	computed:{
		chat(){
			return this.$store.state.chat
		},
		barHeight(){
			return this.$store.state.barHeight
		}
	},
	watch:{
		other:function(val){
			this.getSize()
		}
	},

	methods:{
		isJson(msg) {
			if(!msg){
				return false
			}
		  if(msg.indexOf("{") != 0) {
			return false
		  }
		  try {
			return JSON.parse(msg)
		  } catch (err) {
			return false
		  }
		},
		getSize(){
			// this.top = 60+'px';
            this.top = (this.barHeight*2+88)+'rpx';
		    this.bottom = 40+(this.height+(this.other ? 48 : 0))+'px';
			setTimeout(()=>{
				if(this.other){
					this.scrollIntoBottom()
				}
			},125)
			
		},
		getBottom(){
			return {bottom:(this.bottom*2)+'rpx'}
		},
		async getMessage(event){
			await this.channel.markRead({ user_id: this.chat.id });
			if(event.cid == this.channel.cid && event.type == 'message.new' && event.channel_type == 'messaging'){
			let msgItem = {
				id:event.message.id,
				name:event.message.user.name,
				image:event.message.user.image,
				time:event.message.created_at,
				message:event.message.text,
				owner:event.message.user.id == this.chat.id
			}
			const jsonObj = this.isJson(event.message.text)
			if(!jsonObj) {
				msgItem.isJson = false
			}else{
				msgItem.isJson = true
				msgItem.isLink = true
				if(!!jsonObj.mimeType){
					if(jsonObj.mimeType == 'image' || jsonObj.mimeType.includes('image')){
						msgItem.isLink = false
						msgItem.isImg = true
					}
					if(jsonObj.mimeType == 'file' || jsonObj.mimeType.includes('file')){
						msgItem.isLink = false
						msgItem.isDown = true
					}
				}
				msgItem.message = jsonObj
			}
			this.list.push(msgItem)
				this.$nextTick(()=>{
					this.scrollTop = this.list.length * 160
				})
			}
		},
		loadingHistory(history){
			history.messages.map(m => {
			let msgItem = {
			  id:m.id,
			  name:m.user.name,
			  image:m.user.image,
			  time:m.created_at,
			  message:m.text,
			  owner:m.user.id == this.chat.id
			}
			const jsonObj = this.isJson(m.text)
				// debugger
			if(!jsonObj) {
				msgItem.isJson = false
			}else{
				msgItem.isJson = true
				msgItem.isLink = true
				if(!!jsonObj.mimeType){
					if(jsonObj.mimeType == 'image' || jsonObj.mimeType.includes('image')){
						msgItem.isLink = false
						msgItem.isImg = true
					}
					if(jsonObj.mimeType == 'file' || jsonObj.mimeType.includes('file')){
						msgItem.isLink = false
						msgItem.isDown = true
					}
				}
				msgItem.message = jsonObj
			}
			this.list.push(msgItem)
				this.$nextTick(()=>{
					this.scrollTop = this.list.length * 160
				})
			})
		},
		textareaChange(e){
			this.message.message = e.target.value	
		},
		blurChange(e){
			this.message.message = e.target.value
			this.textareaChangeConfirm(e)
			this.other = false
		},
		textareaChangeConfirm(e){
			this.message.message = e.target.value
		},
		sendMessage(){
			this.message.message = this.message.message.replaceAll("’", "'")
			const txt = this.message.message
			
			if(txt.length){
				// this.message.message = ''
				this.channel.sendMessage({
				  text: txt,
				});
				this.channel.on('message.new', event => {
					console.log(event)
					this.$delete(this.message,'message')
					this.$set(this.message,'message','')
					console.log(this.message.message)
					this.other = false
				})
				
				
			}
		},
		gotoAppPage(item) {
		  uni.webView.postMessage({
			data: {
			  postMsg: {
				pk: item.pk,
				sk: item.sk,
				contentType: item.contentType
			  }
			}
		  })
		},
		navBack() {
			uni.redirectTo({
				url: '/pages/index'
			})
		},
		preview(url){
			uni.previewImage({
				urls:[url]
			})
		},
		getDomConfig() {
			 let that = this
			 let info = uni.createSelectorQuery().select(".box");
			 this.$nextTick(()=>{
				 info.boundingClientRect(function(data) { //data - 各种参数
				    // console.log(data.height) // 获取元素的相关信息 
					that.height = data.height
					that.getSize()
				 }).exec() 
			 })
			
		},
		// 监听键盘弹起变化
		keyboardheightchange(e) {
			setTimeout(()=>{
				if(e.height != 0){
					this.scrollIntoBottom()
				}
			},100)
		},
		// 滚动到底部
		scrollIntoBottom(){
			this.scrollInto = '';
			this.$nextTick(()=>{
				this.scrollInto = `itemId_${ this.list.length - 1 }`;
				 console.log('bottom:',this.scrollInto);
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.title{width: 100%;
	.mems{color: #4F4F5F;font-size: 24rpx;}
}
.b-menus{padding-right: 36rpx;}
.panel{top:0;right: 0;left: 0;box-sizing: border-box;
	.msg{margin: 24rpx 0;
		.head{width: 60rpx;height: 60rpx;border-radius: 100%;overflow: hidden;margin: 0 24rpx;background-color: #bfbfc1;}
		.package{padding: 24rpx;font-size: 28rpx;
			margin-top: 10px;
			max-width: 496rpx;
			.pic{width: 200rpx;height: 200rpx;background-color: #FFF;}
		}
	}
	.msg-left{
		.package{border-radius: 0 32rpx 32rpx 32rpx;color: #191717;background-color: #F7F7FA;}
	}
	.msg-right{
		.package{border-radius: 32rpx 0 32rpx 32rpx;color: #FFF;background-color: #457FD4;}
	}
}
.ctrl{left: 0;right: 0;bottom: 0;
      z-index: 999;
	.msg{box-sizing: border-box;
	    // height: 146rpx;
		box-shadow: 0px -4px 4px #F2F2F2;
		padding: 28rpx 32rpx;
		.box{
			width: 574rpx;
			box-sizing: border-box;
			// height: 88rpx;
			border:1rpx solid #45515433;
			border-radius: 10rpx;
			padding: 22rpx 10rpx;
			.ipt{width: 100%;height: 100%;line-height: 24px;}
		}
		.send{width: 88rpx;height: 88rpx;background-color: #457FD4;border-radius: 24rpx;}
	}
	.other{background-color: #F7F7FA;height: 100rpx;
		.opt{width: 80rpx;height: 80rpx;margin-right: 40rpx;}
	}
}
.pop{padding: 16rpx 26rpx 48rpx;
	.bar{background-color: #E0E0EA;width: 60rpx;height: 8rpx;border-radius: 12rpx;}
	.title{color: #000;font-weight: bold;font-size: 40rpx;margin-top: 48rpx;}
	.at-user{margin-top: 20rpx;max-height: 75vh;}
}
.link_01{color: #ffffff; text-decoration:underline;}
.link_02{color: #457FD4; text-decoration:underline;}
/deep/ .uni-textarea-wrapper {
  max-height: 180rpx;
}

/deep/ .uni-textarea-textarea {
  overflow-y: auto !important;
}
/deep/ .uni-scroll-view-content {
	margin-top: 15px;
}
</style>