<script>
// import { StreamChat } from 'stream-chat';
import Chat from '@/utils/chat.js';

export default {
  async onLaunch() {
    // alert('StreamChat', StreamChat);
    // console.log('App Launch')
    await this.login();
    //postMessage
    !(function (e, n) {
      'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = n())
        : 'function' == typeof define && define.amd
        ? define(n)
        : ((e = e || self).uni = n());
    })(this, function () {
      'use strict';
      try {
        var e = {};
        Object.defineProperty(e, 'passive', {
          get: function () {
            !0;
          },
        }),
          window.addEventListener('test-passive', null, e);
      } catch (e) {}
      var n = Object.prototype.hasOwnProperty;
      function t(e, t) {
        return n.call(e, t);
      }
      var i = [],
        a = function (e, n) {
          var t = { options: { timestamp: +new Date() }, name: e, arg: n };
          if (window.__dcloud_weex_postMessage || window.__dcloud_weex_) {
            if ('postMessage' === e) {
              var a = { data: [n] };
              return window.__dcloud_weex_postMessage
                ? window.__dcloud_weex_postMessage(a)
                : window.__dcloud_weex_.postMessage(JSON.stringify(a));
            }
            var o = {
              type: 'WEB_INVOKE_APPSERVICE',
              args: { data: t, webviewIds: i },
            };
            window.__dcloud_weex_postMessage
              ? window.__dcloud_weex_postMessageToService(o)
              : window.__dcloud_weex_.postMessageToService(JSON.stringify(o));
          }
          if (!window.plus)
            return window.parent.postMessage(
              { type: 'WEB_INVOKE_APPSERVICE', data: t, pageId: '' },
              '*'
            );
          if (0 === i.length) {
            var r = plus.webview.currentWebview();
            if (!r)
              throw new Error('plus.webview.currentWebview() is undefined');
            var d = r.parent(),
              s = '';
            (s = d ? d.id : r.id), i.push(s);
          }
          if (plus.webview.getWebviewById('__uniapp__service'))
            plus.webview.postMessageToUniNView(
              {
                type: 'WEB_INVOKE_APPSERVICE',
                args: { data: t, webviewIds: i },
              },
              '__uniapp__service'
            );
          else {
            var w = JSON.stringify(t);
            plus.webview
              .getLaunchWebview()
              .evalJS(
                'UniPlusBridge.subscribeHandler("'
                  .concat('WEB_INVOKE_APPSERVICE', '",')
                  .concat(w, ',')
                  .concat(JSON.stringify(i), ');')
              );
          }
        },
        o = {
          navigateTo: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = e.url;
            a('navigateTo', { url: encodeURI(n) });
          },
          navigateBack: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = e.delta;
            a('navigateBack', { delta: parseInt(n) || 1 });
          },
          switchTab: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = e.url;
            a('switchTab', { url: encodeURI(n) });
          },
          reLaunch: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = e.url;
            a('reLaunch', { url: encodeURI(n) });
          },
          redirectTo: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = e.url;
            a('redirectTo', { url: encodeURI(n) });
          },
          getEnv: function (e) {
            window.plus ? e({ plus: !0 }) : e({ h5: !0 });
          },
          postMessage: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            a('postMessage', e.data || {});
          },
        },
        r = /uni-app/i.test(navigator.userAgent),
        d = /Html5Plus/i.test(navigator.userAgent),
        s = /complete|loaded|interactive/;
      var w = window.my && navigator.userAgent.indexOf('AlipayClient') > -1;
      var u =
        window.swan && window.swan.webView && /swan/i.test(navigator.userAgent);
      var c =
        window.qq &&
        window.qq.miniProgram &&
        /QQ/i.test(navigator.userAgent) &&
        /miniProgram/i.test(navigator.userAgent);
      var g =
        window.tt &&
        window.tt.miniProgram &&
        /toutiaomicroapp/i.test(navigator.userAgent);
      var v =
        window.wx &&
        window.wx.miniProgram &&
        /micromessenger/i.test(navigator.userAgent) &&
        /miniProgram/i.test(navigator.userAgent);
      var p = window.qa && /quickapp/i.test(navigator.userAgent);
      for (
        var l,
          _ = function () {
            (window.UniAppJSBridge = !0),
              document.dispatchEvent(
                new CustomEvent('UniAppJSBridgeReady', {
                  bubbles: !0,
                  cancelable: !0,
                })
              );
          },
          f = [
            function (e) {
              if (r || d)
                return (
                  window.__dcloud_weex_postMessage || window.__dcloud_weex_
                    ? document.addEventListener('DOMContentLoaded', e)
                    : window.plus && s.test(document.readyState)
                    ? setTimeout(e, 0)
                    : document.addEventListener('plusready', e),
                  o
                );
            },
            function (e) {
              if (v)
                return (
                  window.WeixinJSBridge && window.WeixinJSBridge.invoke
                    ? setTimeout(e, 0)
                    : document.addEventListener('WeixinJSBridgeReady', e),
                  window.wx.miniProgram
                );
            },
            function (e) {
              if (c)
                return (
                  window.QQJSBridge && window.QQJSBridge.invoke
                    ? setTimeout(e, 0)
                    : document.addEventListener('QQJSBridgeReady', e),
                  window.qq.miniProgram
                );
            },
            function (e) {
              if (w) {
                document.addEventListener('DOMContentLoaded', e);
                var n = window.my;
                return {
                  navigateTo: n.navigateTo,
                  navigateBack: n.navigateBack,
                  switchTab: n.switchTab,
                  reLaunch: n.reLaunch,
                  redirectTo: n.redirectTo,
                  postMessage: n.postMessage,
                  getEnv: n.getEnv,
                };
              }
            },
            function (e) {
              if (u)
                return (
                  document.addEventListener('DOMContentLoaded', e),
                  window.swan.webView
                );
            },
            function (e) {
              if (g)
                return (
                  document.addEventListener('DOMContentLoaded', e),
                  window.tt.miniProgram
                );
            },
            function (e) {
              if (p) {
                window.QaJSBridge && window.QaJSBridge.invoke
                  ? setTimeout(e, 0)
                  : document.addEventListener('QaJSBridgeReady', e);
                var n = window.qa;
                return {
                  navigateTo: n.navigateTo,
                  navigateBack: n.navigateBack,
                  switchTab: n.switchTab,
                  reLaunch: n.reLaunch,
                  redirectTo: n.redirectTo,
                  postMessage: n.postMessage,
                  getEnv: n.getEnv,
                };
              }
            },
            function (e) {
              return document.addEventListener('DOMContentLoaded', e), o;
            },
          ],
          m = 0;
        m < f.length && !(l = f[m](_));
        m++
      );
      l || (l = {});
      var E = 'undefined' != typeof uni ? uni : {};
      if (!E.navigateTo) for (var b in l) t(l, b) && (E[b] = l[b]);
      return (E.webView = l), E;
    });
  },
  methods: {
    async login() {
      // let id = this.$util.getQueryVariable('user_id')
      // let token = this.$util.getQueryVariable('token')
      let id = '9cbbbb29-2cbd-4386-b268-a75bd6ffd72f';
      let token =
        'eyJraWQiOiJpZW8xam94NDQ5WkpjTklTclpLM1NwcjhpK2lPenNkN0JCdUZvanhheVBzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiVFhZYlpGRlQ2QVR5UlFNRk1LMko3USIsInN1YiI6Ijg0OTA5MGM4LTk3NGUtNDE2Ni1iNTQ0LTFlMzk4ZjQ5M2UwZiIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV9ieEprYWkwbnhfR29vZ2xlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfYnhKa2FpMG54IiwiY29nbml0bzp1c2VybmFtZSI6Imdvb2dsZV8xMDIxMjA5NTIwNjUzMjM1OTI2NjgiLCJub25jZSI6Ik9TSUx6Y0RLd3lKOWMwS09WOC14VkNXYno5bGtmUmNDTEo4dTlWU3h2dDZpdWsxZ1gwdGVCZVAtdjZtLTR4Z3dMVUE1bHdUc19TTGpyb1pQb21VamFsTFlhZURveFBXZU1jdURZNDFJemZVRzBsN3NadVRrSlBaX2FYU1BlaGgzcTZHd2Y5S0oxXzNiTVlTcWpPQWJXNWJ2LTJNQ1ZHQjI1blZEODU4Nkk0NCIsImF1ZCI6IjZybXNqbHI0Y3Rmcm9pb2ttZDNpYjhtcXVxIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiMTAyMTIwOTUyMDY1MzIzNTkyNjY4IiwicHJvdmlkZXJOYW1lIjoiR29vZ2xlIiwicHJvdmlkZXJUeXBlIjoiR29vZ2xlIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTY4MTk3MDA1OTMyNCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODIyMzY3NjgsImV4cCI6MTY4MjMyMzE2OCwiaWF0IjoxNjgyMjM2NzY4LCJqdGkiOiJiNWIyYTk0Mi00ZDRhLTQwNzctYWVlMS04NjAwZDAzYzBjYWUiLCJlbWFpbCI6InpoYW5nc2h1YW5nc2h1YW5nNkBnbWFpbC5jb20ifQ.4AhXUIy1Zkm6ZpxaCcWGkiypIgVgoS6OHk_EHqP-3s29r9Nrs1OkuhPv-jTbs-ah43q6dFScND_bXbxiuu0RH-XPQ6N30KUwYnlXmeDEmxT0FLX5jV0-2WzICMpKpQ_sg_PJg61NeoxEXU3pYdb90VFjAB8TasUo66V7odw1VO-l9pwtSDHBtUQbKQqPpxbY_zECzh9B9yylHzf7Rjx9r3tGo0gbfBAE55PutMEL_DQ4KwjtluoOzDy6nHQPqSPcGWRNGhO9N8ezI0bv2aHFe9wHcn5vTqZeXawOlooOvxQptjIGQO4ND_FkO3hfXKzcGkEN3Lp5B6hldPToHusW5g';
      //         https://polygon-h5-dev.s3.amazonaws.com/callback.html#access_token=eyJraWQiOiJDK04wTjE3XC95RmtIK2VuTmMySGo0OW9yMVZMTlI4NUViRGlQKzZUcUN6QT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4NDkwOTBjOC05NzRlLTQxNjYtYjU0NC0xZTM5OGY0OTNlMGYiLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfYnhKa2FpMG54X0dvb2dsZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ieEprYWkwbngiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI2cm1zamxyNGN0ZnJvaW9rbWQzaWI4bXF1cSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoicGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2ODIyMzY3NjgsImV4cCI6MTY4MjMyMzE2OCwiaWF0IjoxNjgyMjM2NzY4LCJqdGkiOiI4ZmQ3Y2NiNi02YTk4LTQwM2EtYWUzYi01YTZjNmQ0Y2JiMDAiLCJ1c2VybmFtZSI6Imdvb2dsZV8xMDIxMjA5NTIwNjUzMjM1OTI2NjgifQ.eqowIic3u4D5kRnVZbl31qR8qaEoVgq-BXAJBpIC6Uij96HLOOh3-FAfubt7u1e6LdgJQ8hnLVO1HI5JhbyxY08Eeq4b1h-dedrcaY7kEGhBckYP-DgFtnC-impZeE0Bii6brO_Hvy9XJcI-DwRGi79cBVEcT0ufOb6YVxAoLBuMSOzS_rPydy6ynvFrJxrEchjvYUZOz4JEdNCUTPnGBnHccPHQE24SWucCQF6U4o4b9G3uDgyMjxbgyjI9wAJ6WU1aAnWbClx-4cEl8YLQtsqKAAqEuVQ9ZY18H7z0zVHoqo9iHu0n9kIfOc7SqVBiT9TnwZAs9QJgZ4x_ZDgYnw&id_token=

      // user_id: 9cbbbb29-2cbd-4386-b268-a75bd6ffd72f

      let top = this.$util.getQueryVariable('top');
      if (top) {
        this.$store.commit('set_barheight', Number(top));
      }
      if (token) {
        console.log('hastoken');
        uni.setStorageSync('token', token);
        this.$store.dispatch('AC_GET_SYSINFO'); //查询系统通知数量
        uni.setStorageSync('id', id);
        let res2 = await this.$api.atMe();
        // debugger
        let chat = new Chat(
          'at4vhxsgbu65',
          res2.body.getstreamId,
          res2.body.getstreamName,
          res2.body.avatar,
          res2.body.token
        );
        chat.init();
        this.$store.commit('set_chat', chat);
      } else {
        /************  mock user data  ***********/
        console.log('notoken');
        if (!id) {
          id = uni.getStorageSync('id');
        }
        if (id) {
          uni.setStorageSync('id', id);
          let user = {
            'b5a306e2-01e8-4001-ad1c-7e8fbd4eaf1c': {
              name: 'kxf',
              image: '/logo.png',
              token:
                'eyJraWQiOiJvQ0YzQmZMZVlJMGs5blNjUHJ5QnEwbTczdWN4dExhYU13N05cL2ZIMGpFRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNWEzMDZlMi0wMWU4LTQwMDEtYWQxYy03ZThmYmQ0ZWFmMWMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUkYybkJZWnl4IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6ImxlYWRlcjEyMTJAc2luYS5jb20iLCJvcmlnaW5fanRpIjoiYzM4MDE1NWItNDU2NC00ZjE3LTlmOGEtZDAxOGQ2YmU0NGJhIiwiY3VzdG9tOnVzZXJUeXBlIjoiMyIsImF1ZCI6IjFrOTdjM3RlcGh0YjdqN2oxMTg2YzY4ZzZkIiwiZXZlbnRfaWQiOiJkM2M4YmI3Yi0wZWNmLTQxYjEtODk0MC04NTE4YWZkYmQ2MzAiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY2Nzk2NjAxMywiZXhwIjoxNjY4MDUyNDEzLCJjdXN0b206bmlja05hbWUiOiJhbmR5MDAxIiwiaWF0IjoxNjY3OTY2MDEzLCJqdGkiOiI5NTBkMWI1Ni0yMzg2LTQ4M2ItYTBmZC05OTk0NDY4YTE4NmUiLCJlbWFpbCI6ImxlYWRlcjEyMTJAc2luYS5jb20ifQ.FVl2Jv04yaCNXDX537Dey2E4k_55weig_XrdU8xx6XRV9JJRu_WH8TiKitgg4BcHhlIpyPKSLlgH8wDFolCLm1949kaheYN040Ke1zwYEuUh5Tdg9-LJvsnYlnMWUQOYubYmoZrlI_ylh-oBGL-TvvkotsgAHIm0KMvLvV9r6Tm7DQabv6dt8gEkmSnxCq9Lw2eElr9cC67KU9wtLF5lVkm8ymnDP6kvZ6z3gBXlxkx_PnHmJiFblhRftRFnvYF2H5kFAxbqFwk9BLcP4sAwvim_ixU_vGyyOPuW3_-TGZCJm21Uu2uVO0Ccyb5V0EO-fghl8D_yl9_UA_fw44xylQ',
            },
          };
          let chat = new Chat(
            'at4vhxsgbu65',
            id,
            user[id].name,
            user[id].image,
            user[id].token
          );
          chat.init();
          this.$store.commit('set_chat', chat);
        }
      }
      // 判断有 shareId 则获取储存的参数
      let shareId = this.$util.getQueryVariable('shareId');
      if (shareId) {
        let res = await this.$api.getParamsByShareId({ shareId: shareId });
        if (res.statusCode == 1 && res.body.content) {
          let params = JSON.parse(res.body.content);
          await this.sendMsgToChannels(params);
        }
      } else {
        // 发送对象：频道id或userId
        let tochat = this.$util.getQueryVariable('tochat');
        console.log(tochat);
        if (!tochat) {
          return;
        }
        let msg = this.$util.getQueryVariable('msg');
        let res1 = await this.$api
          .otherUserInfo({ userId: tochat })
          .then((r1) => {
            return r1;
          });
        let res2 = await this.$api
          .atOther({ userId: res1.body.userId })
          .then((r2) => {
            return r2;
          });
        this.$api.isBlack({ userId: tochat }).then((res) => {
          if (!res.body) {
            this.goto(
              '/pages/member-chat?id=' +
                tochat +
                '&icon=' +
                res1.body.avatar +
                '&me=' +
                this.chat.name +
                '&him=' +
                res1.body.nickName +
                '&msg=' +
                msg
            );
          } else {
            uni.showToast({
              icon: 'none',
              title: 'Blacklist eachother',
            });
          }
        });
      }
    },
    async sendMsgToChannels(params) {
      // debugger
      if (params.type == 'channel') {
        let channels = await this.chat.getChatList();
        let tochat = params.tochat.replaceAll('%21', '!');
        const send_chats = channels.filter((c) => tochat.indexOf(c.id) > -1);
        send_chats.forEach((c) =>
          c.sendMessage({ text: JSON.stringify(params.msg) })
        );
      } else if (params.type == 'createchat') {
        let list = params.tochat.split(',');
        for (let i = 0; i < list.length; i++) {
          let resb = await this.$api
            .isBlack({ userId: list[i] })
            .then((ress) => {
              return ress;
            });
          if (!resb.body) {
            let res = await this.$api
              .otherUserInfo({ userId: list[i] })
              .then((r1) => {
                return r1;
              });
            let res2 = await this.$api
              .atOther({ userId: res.body.userId })
              .then((r2) => {
                return r2;
              });
            // await this.chat.createUser(res.body.userId,res.body.nickName,res.body.avatar)
            let channel = await this.chat.createChat(
              list[i],
              res.body.avatar,
              this.chat.name,
              res.body.nickName
            );
            await channel.sendMessage({ text: JSON.stringify(params.msg) });
          } else {
            uni.showToast({
              icon: 'none',
              title: 'Blacklist eachother',
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
// @import "uni.scss";
// @import 'uview-ui/theme.scss';
@import 'static/iconfont.scss';
// @import "uview-ui/index.scss";
.page,
page {
  font-family: 'Poppins';
  color: #191717;
}
.image {
  width: 100%;
  height: 100%;
  display: block;
}
.rela {
  position: relative;
}
.abso {
  position: absolute;
}
.fixed {
  position: fixed;
}
.flex {
  display: flex;
}
.wrap {
  flex-wrap: wrap;
}
.row {
  flex-direction: row;
}
.col {
  flex-direction: column;
}
.j-center {
  justify-content: center;
}
.j-around {
  justify-content: space-around;
}
.j-between {
  justify-content: space-between;
}
.j-end {
  justify-content: flex-end;
}
.a-center {
  align-items: center;
}
.a-end {
  align-items: flex-end;
}
.ecllipse {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ecllipse2 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ecllipse3 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
.word-break {
  word-break: break-all;
}
</style>
