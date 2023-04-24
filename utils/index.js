/*
 * @Descripttion: 
 * @version: 
 * @Author: yh
 * @Date: 2023-04-04 10:54:58
 * @LastEditors: yh
 * @LastEditTime: 2023-04-07 16:21:49
 */
import env from "../../node-env.js"
export * from './text.js'
//export * from './validator.js'
export function toast(msg) {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 2000
	})
}
export var baseUrl = null;
if (env == 'dev') {
    // dev
    baseUrl = 'https://fm8i3t8sxb.execute-api.us-east-1.amazonaws.com/dev'
} else if (env == 'test') {
    baseUrl = 'https://abgb9gb69c.execute-api.us-east-2.amazonaws.com/test'
} else if (env == 'preprod') {
    baseUrl = 'https://xcpugl2164.execute-api.us-east-2.amazonaws.com/pre'
}
 else if (env == 'prod') {
    // prod 
    baseUrl = 'https://na9d683noj.execute-api.us-east-1.amazonaws.com/prod'
}


export const logintype = 'wx' // wx 微信 msg 短信
export function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
	if(!query){
		const prms = window.location.href.split('?')
		if(prms.length > 1){
			query = prms[1]
		}
	}
	// debugger
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return '';
}


export function dateFormat(fmt, timestamp) {
    let ret,date;
	date = new Date(parseInt(timestamp))
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString(),         // 秒
        "s+": date.getMilliseconds().toString()          // 毫秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}