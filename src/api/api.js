import axios from "@/utils/axios";
import moment from "moment";

/**
 * 登录
 */
export function login(params) {
	return axios({
		url: "/api/v1.Gamelogin/login",
		method: "post",
		data: params
	});
}
/**
 * 角色列表
 * @param params
 */
export function getRoleList(params) {
	return axios({
		url: "/adminAuth/getRoleList",
		method: "post",
		data: params
	});
}

/**
 * 获取图形验证码
 */
export function getCode(params) {
	return axios({
		url: "/Index/getCaptchaCode",
		method: "post",
		data: params
	});
}

/**
 * 权限列表（侧边栏权限和按钮权限）
 * @param params
 */
export function getPermission(params) {
	return axios({
		url: "/api/v1.Gamemenu/get_game_menu",
		method: "post",
		data: params
	});
}

/**用户
 * 列表
 * @param params
 */
export function getUserList(params) {
	return axios({
		url: "/api/v1.Gamedate/getUserList",
		method: "post",
		data: params
	});
}

/**
 * 三国每日
 * @param params
 */
export function getSanguoList(params) {
	return axios({
		url: "/api/hykj/game/threeKingdomReplayDayCount",
		method: "post",
		data: params
	});
}
/**
 * 三国每月
 * @param params
 */
export function getSanguoMonthList(params) {
	return axios({
		url: "/api/hykj/game/kingdomCountByDay",
		method: "post",
		data: params
	});
}
/**
 * 三国明细
 * @param params
 */
export function getSanguoDetailList(params) {
	return axios({
		url: "/api/hykj/game/getKingdomDetailByUser",
		method: "post",
		data: params
	});
}
export function getSanguoDetailInfo(params) {
	return axios({
		url: "/api/hykj/game/getKingdomDetail",
		method: "post",
		data: params
	});
}
export function getSanguoDetailGift(params) {
	return axios({
		url: "/api/hykj/game/getKingdomDetailGiftList",
		method: "post",
		data: params
	});
}

export function getHomeInfo(params) {
	return axios({
		url: "/api/hykj/accountSettlementService/countHomePage",
		method: "post",
		data: params
	});
}



export function getBoxDataList(params) {
	return axios({
		url: "/api/v1.Gamedate/getBoxList",
		method: "post",
		data: params
	});
}
export function getBoxDayInfo(params) {
	return axios({
		url: "/api/v1.Gamedate/getBoxUserListinfo",
		method: "post",
		data: params
	});
}
export function getBoxDayDetailInfo(params) {
	return axios({
		url: "/api/v1.Gamedate/getBoxUserListDetailedData",
		method: "post",
		data: params
	});
}

export function getPdList(params) {
	return axios({
		url: "/api/hykj/party/farm/getFarmReplayDayCount",
		method: "post",
		data: params
	});
}
export function getPdListDetail(params) {
	return axios({
		url: "/api/hykj/party/farm/getFarmReplayDetail",
		method: "post",
		data: params
	});
}
export function getPdByPerson(params) {
	return axios({
		url: "/api/hykj/party/farm/getFarmDetailByUser",
		method: "post",
		data: params
	});
}
export function getPdByPlace(params) {
	return axios({
		url: "/api/hykj/party/farm/getFarmDetailByUserId",
		method: "post",
		data: params
	});
}
export function getPdByCurrentPlace(params) {
	return axios({
		url: "/api/hykj/party/farm/getSectDetailByUserIdAndRecordId",
		method: "post",
		data: params
	});
}
export function getFishListByDay(params) {
	return axios({
		url: "/api/fishing/report/fishingReplayDayCount",
		method: "post",
		data: params
	});
}
export function getFishListDetailByDay(params) {
	return axios({
		url: "/api/fishing/report/getFishingRecordDetail",
		method: "post",
		data: params
	});
}

export function getFishListByUser(params) {
	return axios({
		url: "/api/fishing/report/getFishingDetailByUser",
		method: "post",
		data: params
	});
}
export function getFishListByPlace(params) {
	return axios({
		url: "/api/fishing/report/getFishingDetailByUserId",
		method: "post",
		data: params
	});
}
export function getFishListByCurrentPlace(params) {
	return axios({
		url: "/api/fishing/report/getSectDetailByUserIdAndRecordId",
		method: "post",
		data: params
	});
}


export function gameStop(params) {
	return axios({
		url: `/api/hykj/game/handleSwitch?gameId=${params.gameId}&isSwitch=${params.isSwitch}`,
		method: "get",
		data: params
	});
}
export function gameState(params) {
	return axios({
		url: "/api/hykj/game/getGameSwitch",
		method: "get",
		data: params
	});
}

// 上传图片
export function publicUploadFile(params) {
	return axios({
		url: "/public/uploadFile",
		method: "post",
		data: params
	});
}

