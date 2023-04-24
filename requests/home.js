import Request from '@/js_sdk/pocky-request/pocky-request v.2.0.4/index.js'

export async function atOther(data){
	return Request().request({
		url:'/portal/getStreamByIdOnPortalController/atOther',
		method:'post',
		data
	})
}
export async function atMe(data){
	return Request().request({
		url:'/portal/getStreamByIdOnPortalController/atMe',
		method:'post',
		data
	})
}
export async function userInfo(data){
	return Request().request({
		url:'/portal/user/userInfo',
		method:'post',
		data
	})
}
export async function otherUserInfo(data){
	return Request().request({
		url:'/portal/user/otherUserInfo',
		method:'post',
		data
	})
}
//我关注的列表
export async function myFllow(data){
	return Request().request({
		url:'/portal/follow/followingList',
		method:'post',
		data
	})
}
//关注我的列表
export async function followme(data){
	return Request().request({
		url:'/portal/follow/followedList',
		method:'post',
		data
	})
}
//黑名单
export async function blackList(data){
	return Request().request({
		url:'/portal/black/blackList',
		method:'post',
		data
	})
}
//加入黑名单
export async function addBlack(data){
	return Request().request({
		url:'/portal/black/addBlack',
		method:'post',
		data
	})
}
//移出黑名单
export async function delBlack(data){
	return Request().request({
		url:'/portal/black/remove',
		method:'post',
		data
	})
}
//是否是拉黑关系
export async function isBlack(data){
	return Request().request({
		url:'/portal/black/isBlack',
		method:'post',
		data
	})
}

// 通知统计
export async function getSocialNoticeStatistical(data){
	return Request().request({
		url:'/portal/SocialNotice/getSocialNoticeStatistical',
		method:'post',
		data
	})
}
// invite
export async function pageSocialNoticeInvitationHandle(data){
	return Request().request({
		url:'/portal/SocialNotice/pageSocialNoticeInvitationHandle',
		method:'post',
		data
	})
}
//@mine
export async function pageSocialNoticeAtMe(data){
	return Request().request({
		url:'/portal/SocialNotice/pageSocialNoticeAtMe',
		method:'post',
		data
	})
}
//answer comment
export async function pageSocialNoticeCommentsAndRepliesHandle(data){
	return Request().request({
		url:'/portal/SocialNotice/pageSocialNoticeCommentsAndRepliesHandle',
		method:'post',
		data
	})
}
//follow
export async function pageSocialNoticeFollowMeHandle(data){
	return Request().request({
		url:'/portal/SocialNotice/pageSocialNoticeFollowMeHandle',
		method:'post',
		data
	})
}

//like share
export async function pageSocialNoticeLikeAndShareHandle(data){
	return Request().request({
		url:'/portal/SocialNotice/pageSocialNoticeLikeAndShareHandle',
		method:'post',
		data
	})
}
//系统消息数量
export async function sysinfocount(data){
	return Request().request({
		url:'/portal/systemInformation/count',
		method:'post',
		data
	})
}
//系统通知阅读
export async function readsys(data){
	return Request().request({
		url:'/portal/systemInformation/readed',
		method:'post',
		data
	})
}
//系统通知删除
export async function delsys(data){
	return Request().request({
		url:'/portal/systemInformation/remove',
		method:'post',
		data
	})
}
//查询各种通知
export async function pageInformationHandle(data){
	return Request().request({
		url:'/portal/systemInformation/pageInformationHandle',
		method:'post',
		data
	})
}
//修改邀请审核状态
export async function updateBizStatus(data){
	return Request().request({
		url:'/portal/community/updateBizStatus',
		method:'post',
		data
	})
}

//删除通知消息
export async function delStatistical(data){
	return Request().request({
		url:'/portal/SocialNotice/delStatistical',
		method:'post',
		data
	})
}
//阅读通知消息
export async function readStatistical(data){
	return Request().request({
		url:'/portal/SocialNotice/readStatistical',
		method:'post',
		data
	})
}

//回复评论
export async function commentReply(data){
	return Request().request({
		url:'/portal/comment/reply',
		method:'post',
		data
	})
}
//保存关注
export async function saveFollow(data){
	return Request().request({
		url:'portal/follow/save',
		method:'post',
		data
	})
}
//根据分享ID获取存储的参数对象
export async function getParamsByShareId(data){
	return Request().request({
		url:'portal/user/userShareInfo',
		method:'post',
		data
	})
}
//文件列表
export async function listFile(data){
	return Request().request({
		url:'/portal/file/listFile',
		method:'post',
		data
	})
}
//获取文件
export async function getUploadUrlWithSign(data){
	return Request().request({
		url:'/portal/s3/getUploadUrlWithSign',
		method:'post',
		data
	})
}
