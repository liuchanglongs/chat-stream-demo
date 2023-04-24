<template>
  <view>
    <u-navbar :is-back="true" :customBack="navBack" :isBack1="true">
      <template>
        <view class="title flex j-center a-center">
          <view>{{ title }}</view>
        </view>
      </template>
      <template #right>
        <view class="b-menus flex a-center">
          <view class="m" @tap="goto('/pages/chat-set')">
            <u-icon2 name="Menu" size="50"></u-icon2>
          </view>
        </view>
      </template>
    </u-navbar>
    <scroll-view
      class="panel fixed"
      :style="{ top: top, bottom: bottom }"
      :scroll-y="true"
      @tap="other = false"
      :scroll-into-view="scrollInto"
      scroll-with-animation
    >
      <view v-for="(item, i) in list" :key="i" :id="`itemId_${i}`">
        <u-loadmore
          :load-text="{ loadmore: $toDate(item.time) }"
          font-size="18"
        ></u-loadmore>
        <view v-if="!item.owner" class="msg msg-left flex">
          <view class="head">
            <image
              class="image"
              mode="aspectFill"
              :src="$oss(item.image)"
            ></image>
          </view>
          <view class="package" v-if="item.isLink">
            <view @tap="gotoAppPage(item.message)" class="link_02"
              >link: {{ item.message.content }}</view
            >
          </view>
          <view class="package" v-if="item.isImg">
            <view class="link_02">
              <view class="pic" @tap="preview(item.message.fileUrl)">
                <image class="image" :src="$oss(item.message.fileUrl)"></image>
              </view>
            </view>
          </view>
          <view class="package" v-if="item.isDown">
            <view @tap="down(item.message)" class="link_02"
              >get: {{ item.message.fileName }}</view
            >
          </view>
          <view class="package" v-if="!item.isJson"
            ><text>{{ item.message }}</text></view
          >
        </view>
        <view v-else class="msg msg-right flex j-end">
          <view class="package" v-if="item.isLink">
            <view @tap="gotoAppPage(item.message)" class="link_01"
              >link: {{ item.message.content }}</view
            >
          </view>
          <view class="package" v-if="item.isImg">
            <view class="link_02">
              <view class="pic" @tap="preview(item.message.fileUrl)">
                <image
                  class="image"
                  mode="aspectFill"
                  :src="$oss(item.message.fileUrl)"
                ></image>
              </view>
            </view>
          </view>
          <view class="package" v-if="item.isDown">
            <view @tap="down(item.message)" class="link_01"
              >get: {{ item.message.fileName }}</view
            >
          </view>
          <view class="package" v-if="!item.isJson"
            ><text>{{ item.message }}</text></view
          >
          <view class="head">
            <image class="image" :src="$oss(item.image)"></image>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="ctrl fixed" :style="[getBottom()]">
      <view class="msg flex a-center j-between">
        <view class="box">
          <textarea
            v-model="message"
            cursor-spacing="224"
            class="ipt"
            @focus="other = true"
            @blur="blurChange"
            auto-height
            @linechange="getDomConfig"
            @keyboardheightchange="keyboardheightchange"
          ></textarea>
        </view>
        <view
          class="send flex j-center a-center"
          @touchend.prevent="sendMessage"
        >
          <u-icon2 name="Send" color="#FFF" size="50"></u-icon2>
        </view>
      </view>
      <!-- 注释上传附件按钮 -->
      <!-- <view v-if="other && !is_black" class="other flex a-center">
				<view class="opt flex j-center a-center">
					<u-icon2 name="Mine" size="40" color="#ccc"></u-icon2>
				</view>
				<view class="opt flex j-center a-center" @tap="goto('/pages/storage')">
					<u-icon2 name="File" size="40" color="#ccc"></u-icon2>
				</view>
			</view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      top: 44,
      bottom: 0,
      height: 0,
      other: false,
      channel: null,
      title: '',
      message: '',
      list: [],
      scrollTop: 0,

      other_id: '',
      is_black: false,
      choose: false,
      // 滚动到最底部的id
      scrollInto: '',
    };
  },
  async onLoad(prms) {
    console.log('prms-->', prms);
    if (prms.choose) {
      this.choose = prms.choose;
    }
    uni.getSystemInfo({
      success(res) {
        this.top += res.safeArea.top;
        this.bottom += res.safeArea.bottom;
      },
    });
    if (!prms.id && !prms.cid) {
      this.back();
    } else {
      if (prms.id) {
        this.channel = await this.chat.createChat(
          prms.id,
          prms.icon,
          prms.me,
          prms.him
        );
        this.title = prms.him;
      } else {
        this.channel = await this.chat.getChatListByCid(prms.cid);
        this.title =
          this.channel.data.created_by.id == this.chat.id
            ? this.channel.data.him
            : this.channel.data.me;
      }
      this.$store.commit('set_crtChannel', this.channel);
      let history = await this.channel.watch();
      this.loadingHistory(history);
      await this.channel.markRead({ user_id: this.chat.id });

      this.channel.on('message.new', this.getMessage);
      if (!!prms.msg) {
        this.channel.sendMessage({
          text: prms.msg,
        });
      }
      //黑名单逻辑
      let res = await this.channel.queryMembers({}, { created_at: -1 }, {});
      res.members.map((m) => {
        if (m.user_id != this.chat.id) {
          this.other_id = m.user_id;
        }
      });
      this.$api.isBlack({ userId: this.other_id }).then((res2) => {
        this.is_black = res2.body;
      });
    }
  },
  async onShow() {
    //黑名单逻辑
    if (this.channel) {
      let res = await this.channel.queryMembers({}, { created_at: -1 }, {});
      res.members.map((m) => {
        if (m.user_id != this.chat.id) {
          this.other_id = m.user_id;
        }
      });
      this.$api.isBlack({ userId: this.other_id }).then((res2) => {
        this.is_black = res2.body;
      });
    }
  },
  onUnload() {
    this.channel.off('message.new', this.getMessage);
  },
  computed: {
    chat() {
      return this.$store.state.chat;
    },
    barHeight() {
      return this.$store.state.barHeight;
    },
  },
  watch: {
    other: function (val) {
      this.getSize();
      // if(val){
      // 	this.$nextTick(()=>{
      // 		this.scrollTop = this.list.length * 160
      // 	})
      // }
    },
    top: function (val) {
      console.log('top', val);
    },
  },
  methods: {
    navBack() {
      if (this.choose == 'true') {
        uni.redirectTo({
          url: '/pages/index',
        });
      } else {
        uni.webView.postMessage({
          data: {
            postMsg: { url: 'none', event: 'back1', id: this.other_id },
          },
        });
      }
    },
    preview(url) {
      uni.previewImage({
        urls: [url],
      });
    },
    down(item) {
      uni.webView.postMessage({
        data: {
          postMsg: {
            event: 'down',
            data: item,
          },
        },
      });
    },
    isJson(msg) {
      if (!msg) {
        return false;
      }
      if (msg.indexOf('{') != 0) {
        return false;
      }
      try {
        return JSON.parse(msg);
      } catch (err) {
        return false;
      }
    },
    getSize() {
      // this.top = 60+'px';
      this.top = this.barHeight * 2 + 88 + 'rpx';
      this.bottom = 40 + (this.height + (this.other ? 48 : 0)) + 'px';
      setTimeout(() => {
        if (this.other) {
          this.scrollIntoBottom();
        }
      }, 125);
    },
    getBottom() {
      return { bottom: this.bottom * 2 + 'rpx' };
    },
    async getMessage(event) {
      await this.channel.markRead({ user_id: this.chat.id });
      if (
        event.cid == this.channel.cid &&
        event.type == 'message.new' &&
        event.channel_type == 'messaging'
      ) {
        let msgItem = {
          id: event.message.id,
          name: event.message.user.name,
          image: event.message.user.image,
          time: event.message.created_at,
          message: event.message.text,
          owner: event.message.user.id == this.chat.id,
        };
        const jsonObj = this.isJson(event.message.text);
        if (!jsonObj) {
          msgItem.isJson = false;
        } else {
          msgItem.isJson = true;
          msgItem.isLink = true;
          if (!!jsonObj.mimeType) {
            if (
              jsonObj.mimeType == 'image' ||
              jsonObj.mimeType.includes('image')
            ) {
              msgItem.isLink = false;
              msgItem.isImg = true;
            }
            if (
              jsonObj.mimeType == 'file' ||
              jsonObj.mimeType.includes('file')
            ) {
              msgItem.isLink = false;
              msgItem.isDown = true;
            }
          }
          msgItem.message = jsonObj;
        }
        this.list.push(msgItem);
        this.$nextTick(() => {
          this.scrollTop = this.list.length * 160;
        });
      }
    },
    loadingHistory(history) {
      history.messages.map((m) => {
        let msgItem = {
          id: m.id,
          name: m.user.name,
          image: m.user.image,
          time: m.created_at,
          message: m.text,
          owner: m.user.id == this.chat.id,
        };
        const jsonObj = this.isJson(m.text);
        if (!jsonObj) {
          msgItem.isJson = false;
        } else {
          msgItem.isJson = true;
          msgItem.isLink = true;
          if (!!jsonObj.mimeType) {
            if (
              jsonObj.mimeType == 'image' ||
              jsonObj.mimeType.includes('image')
            ) {
              msgItem.isLink = false;
              msgItem.isImg = true;
            }
            if (
              jsonObj.mimeType == 'file' ||
              jsonObj.mimeType.includes('file')
            ) {
              msgItem.isLink = false;
              msgItem.isDown = true;
            }
          }
          msgItem.message = jsonObj;
        }
        this.list.push(msgItem);
        this.$nextTick(() => {
          this.scrollTop = this.list.length * 160;
        });
      });
    },
    sendMessage() {
      if (this.is_black) {
        uni.showToast({
          icon: 'none',
          title: 'Blacklist eachother',
        });
        return;
      }
      if (this.message.length) {
        this.message = this.message.replaceAll('’', "'");
        const txt = this.message;
        this.message = '';
        this.channel.sendMessage({
          text: txt,
        });
        this.other = false;
      }
    },
    gotoAppPage(item) {
      console.log(item.contentType + '---' + item.pk + '------' + item.sk);
      uni.webView.postMessage({
        data: {
          postMsg: {
            pk: item.pk,
            sk: item.sk,
            contentType: item.contentType,
          },
        },
      });
    },
    getDomConfig() {
      let that = this;
      let info = uni.createSelectorQuery().select('.box');
      this.$nextTick(() => {
        info
          .boundingClientRect(function (data) {
            //data - 各种参数
            // 获取此时输入框的高度
            that.height = data.height;
            that.getSize();
          })
          .exec();
      });
    },
    blurChange() {
      this.other = false;
    },
    // 监听键盘弹起变化
    keyboardheightchange(e) {
      setTimeout(() => {
        if (e.height != 0) {
          this.scrollIntoBottom();
        }
      }, 100);
    },
    // 滚动到底部
    scrollIntoBottom() {
      this.scrollInto = '';
      this.$nextTick(() => {
        this.scrollInto = `itemId_${this.list.length - 1}`;
        console.log('bottom:', this.scrollInto);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
}
.b-menus {
  padding-right: 36rpx;
}
.panel {
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  .msg {
    margin: 24rpx 0;
    .head {
      width: 60rpx;
      height: 60rpx;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 24rpx;
      background-color: #bfbfc1;
    }
    .package {
      padding: 24rpx;
      font-size: 28rpx;
      max-width: 496rpx;
      .pic {
        width: 200rpx;
        height: 200rpx;
        background-color: #fff;
      }
    }
  }
  .msg-left {
    .package {
      border-radius: 0 32rpx 32rpx 32rpx;
      color: #191717;
      background-color: #f7f7fa;
    }
  }
  .msg-right {
    .package {
      border-radius: 32rpx 0 32rpx 32rpx;
      color: #fff;
      background-color: #457fd4;
    }
  }
}
.ctrl {
  left: 0;
  right: 0;
  bottom: 0;
  .msg {
    box-sizing: border-box;
    // height: 146rpx;
    box-shadow: 0px -4px 4px #f2f2f2;
    padding: 28rpx 32rpx;
    .box {
      width: 574rpx;
      box-sizing: border-box;
      // height: 88rpx;
      border: 1rpx solid #45515433;
      border-radius: 10rpx;
      padding: 22rpx 10rpx;
      display: flex;
      align-items: center;
      .ipt {
        width: 100%;
        height: 100%;
        line-height: 24px;
      }
    }
    .send {
      width: 88rpx;
      height: 88rpx;
      background-color: #457fd4;
      border-radius: 24rpx;
    }
  }
  .other {
    background-color: #f7f7fa;
    height: 100rpx;
    .opt {
      width: 80rpx;
      height: 80rpx;
      margin-right: 40rpx;
    }
  }
}
.link_01 {
  color: #ffffff;
  text-decoration: underline;
}
.link_02 {
  color: #457fd4;
  text-decoration: underline;
}
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
