import axios from "axios";
import store from "@/store";
import { ElMessage } from "element-plus";
import {
	VERSION,
	MODEL_TEST_VERSION,
	SERVER_TYPE,
	AXIOS_TIMEOUT

} from "@/constant";
import CryptoJS from 'crypto-js'
import { switchServerUrl } from "@/utils/index";

/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 **/
axios.interceptors.request.use(config => {
	return config;
}, error => {
	return Promise.reject(error);
});

/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/
axios.interceptors.response.use(response => {
	return response;
}, error => {
	return Promise.reject(error);
});
function isFormData(obj) {
	return obj instanceof FormData;
}
function createSign(data){
	if(!data){
		data.atype=1;
	}
	if(isFormData(data)){
		return  data;
	}
	if(data)
	{
		var jsonObj =JSON.parse(JSON.stringify(data));//
		var timeSpan = new Date().getTime();
		jsonObj.timestamp = timeSpan
		var sortObj = Object.keys(jsonObj).sort();

		var sortJson = {};
		sortObj.forEach((key) => {
			sortJson[key] = jsonObj[key]; // 按排序后的键顺序构造新的对象
		});
		var jsonStr = '';
		for (let key in sortJson) {
			if (sortJson.hasOwnProperty(key)) {
				jsonStr += (key + sortJson[key])
			}
		}
		var skey = 'HT*l$BCvf3tPOmH8^K11x@4mr7uroL';
		jsonStr = skey + jsonStr + skey + timeSpan;
		jsonObj.sign = CryptoJS.SHA256(jsonStr).toString();
		jsonObj.timestamp = timeSpan;
		data=jsonObj;
		//config.data=jsonObj;
		return data;
	}
}
export default function http(options) {
	// 获取不同环境的请求域名
	const server_url = switchServerUrl();

	let opt = {};
	const method = options.method || "post";
	let url = options.url;
	let data = options.data || {};
	if (!options.url) {
		console.error("url参数缺失");
		return;
	}

	if (method == "get") {
		if( url.indexOf('hykj')!=-1){
			let surl=import.meta.env.VITE_BASE_API_JAVA;
			url=surl+url;
		}else{
			let surl=import.meta.env.VITE_BASE_API;
			url=surl+url;
		}
		opt = {
			method,
			baseURL: "",
			url: url.indexOf("//") > -1 ? url : (server_url + url),
			params: data,
			timeout: AXIOS_TIMEOUT
		};
	} else if (method == "post") {
		if(url.indexOf('/farm/')!=-1 || url.indexOf('/party/')!=-1 || url.indexOf('/fishing')!=-1){
			let surl=import.meta.env.VITE_BASE_API_JAVA_XDPD;
			url=surl+url;
		}else{
			let surl=import.meta.env.VITE_BASE_API;
			url=surl+url;
		}
		//data=createSign(data);
		opt = {
			method,
			baseURL: "",
			url: url.indexOf("//") > -1 ? url : (server_url + url),
			data, // qs.stringify(data)
			timeout: AXIOS_TIMEOUT
		};
	}
	if (store.getters.token) {
		if (url.indexOf('upload')!=-1) {
			//上传
			opt.headers={'authorization': store.getters.token,'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'multipart/form-data'}
		}else{
			opt.headers={'authorization': store.getters.token,'X-Requested-With': 'XMLHttpRequest'}
		}

	}
	return new Promise((resolve, reject) => {
		axios(opt).then(res => {
			if (res && (res.status === 200 || res.status === 304 || res.status === 400)) {
				const data = res.data;
				if (data.code==200 ) {
					resolve(data);
				} else if (data.code==401) { // 101请获取权限 102登录失效
					//ElMessage.error(data.status.error_msg); // 提示错误信息
					// 登出操作
					store.dispatch("user/logout");
				} else {
					//ElMessage.error(data.status.error_msg || "网络异常，请稍后重试！"); // 提示错误信息
					reject(data);
				}
			} else {
				ElMessage.error(res || "网络异常，请稍后重试！"); // 提示错误信息
				reject("网络异常，请稍后重试");
			}
		}, err => {
			ElMessage.error(err); // 提示错误信息
			reject(err);
		});
	});
}