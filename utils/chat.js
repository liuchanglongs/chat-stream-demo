import { StreamChat } from 'stream-chat';
import store from '@/store/index';
class Chat {
	constructor(apikey,id,name,image,token){
		console.log('this.id',id)
		this.id = id
		this.name = name
		this.image = image
		this.token = token
		// debugger
		this.client = StreamChat.getInstance(apikey)
		// this.init()
		this.listening()
	}
	async init(){
		uni.showLoading()
		this.user = (await this.client.connectUser({id: this.id,name:this.name,image:this.image},this.token)).me
		uni.hideLoading()
	}
	async createUser(id,name,image){
		await this.client.connectUser({id: id,name:name,image:image},this.token)
	}
	async listening(){
		this.client.on(event => {
			if(event.type == "notification.added_to_channel"){
				store.commit('set_channels',store.state.channels.concat({
					type:'msg',
					channel:{cid:event.cid,data:event.channel},
					show:false,
					search:true,
					count:0,
				}))
			}else if(event.type == 'channel.deleted' || event.type == 'notification.channel_deleted'){
				store.commit('set_channels',store.state.channels.filter(f =>f.type=='sys'|| (f.type=='msg' && f.channel.cid != event.channel.cid)))
			}else if(event.type == 'message.new' || event.type == 'notification.message_new'|| event.type == 'message.updated'){
				store.commit('set_channels',store.state.channels.map(m => {
					// debugger
					if(m.type=='msg' && m.channel.cid == event.cid && event.unread_count){
						// console.log('unread---------')
						m.count++
					}
					if(m.type=='msg' && m.channel.cid == event.cid){
						if(!!m.channel.state){
							// m.channel.state.messageSets[0].messages.push(event.message)
						}else{
							m.channel.state = {messageSets:[{messages:[event.message]}]}
						}
					}
					return m
				}))
			}
		});
	}
	//查询 users
	async findUsers(ids){
		let users =  this.client.queryUsers({ id: { $in:ids } })
		return users
	}
	//查询所有聊天频道  (个聊、群聊)
	async getChatList(type){ //type chat-个聊 group-chat-群聊
		uni.showLoading()
		let filter = {type:"messaging", members: { $in: [this.id] }}
		// let filter = {type:"messaging", created_by_id: this.id}
		if(type){
			filter.chat_type = type
		}
		let sort = [{ last_message_at: -1 }]
		let channels = (await this.client.queryChannels(filter, sort, {}))
		uni.hideLoading()
		return channels.sort((a,b)=>{return (b.data.top ? 1 : 0) - (a.data.top ? 1 : 0)})
	}
	//查询某个频道
	async getChatListByCid(cid){
		uni.showLoading()
		let filter = {type:"messaging", cid:cid }
		let sort = [{ last_message_at: -1 }]
		let channels = await this.client.queryChannels(filter, sort)
		uni.hideLoading()
		return channels[0]
	}
	//创建个人聊天
	async createChat(uid,img,me,him){
		uni.showLoading()
		// debugger
		let channel =  this.client.channel('messaging', {
		    members: [uid,this.id],
			chat_type:'chat',
			image:img?img:'/avatar_default.png',
			owerimg:this.image?this.image:'/avatar_default.png',
			me:me,
			him:him,
			top:0,
		})
		await channel.create();
		uni.hideLoading()
		return channel
	}
	//创建群聊
	async createGroupChat(ids,img,title){
		uni.showLoading()
		const  channelId = this.id + '_' +  Date.now()
		let channel =  this.client.channel('messaging', channelId,{
		    members: [this.id, ...ids],
			chat_type:'group-chat',
			image:img?img:'/logo.png',
			name:title?title:('Group_'+Math.random()),
			top:0,
			created_by_id: this.id
		})
		await channel.create();
		uni.hideLoading()
		return channel
	}
	//删除聊天频道
	async deleteChat(cid){
		uni.showLoading()
		const response = await this.client.deleteChannels([cid], {hard_delete: true});
		uni.hideLoading()
		return response
	}
	//查询群成员
	async getGroupMembers(cid){
		let channel = await this.getChatListByCid(cid)
		let sort = {created_at: -1};
		uni.showLoading()
		let members = await channel.queryMembers({}, sort, {})
		uni.hideLoading()
		return members
	}
	//更新群名称
	async setGroupName(cid,name){
		let channel = await this.getChatListByCid(cid)
		let sort = {created_at: -1};
		uni.showLoading()
		await channel.updatePartial({ set:{name:name} });
		uni.hideLoading()
	}
	//查询频道消息
	async getMessages(cid){
		uni.showLoading()
		
		const filters = { cid:cid };
		const search = await this.client.search(
		   filters,
		   { text: { "$q":  "" }},
		   { limit: 10, offset: 0 },
		);

		uni.hideLoading()
		return search
	}
	// 更新频道消息
	async updateChannel(cid){
		let channel = await this.getChatListByCid(cid)
		channel.updatePartial({set:{'members':[]}})
		uni.showLoading()

		let members = []
		for (let u in this.userInfo.inviteUser) {
			members.push({
				user_id : u.user_id,
				role: 'member',
				user: {id: u.user_id}
			})
		}
		this.$http({
			url: `https://chat.stream-io-api.com/channels/{channel。type}/{channel。id}`,
			data: {add_members: members},
			method: 'post'
		}).then(res => {
			this.flag.invitesFlag = false
			this.userInfo.inviteUser = []
		})
	}
}
export default Chat