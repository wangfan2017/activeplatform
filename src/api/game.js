import axios from "@/utils/axios";

export function gameList(params) {
    return axios({
        url: `/admin/game.gamelist/index`,
        method: "get",
        data: params
    });
}
export function gameEdit(params) {
    return axios({
        url: `/admin/game.gamelist/edit`,
        method: "post",
        data: params
    });
}
export function gameAdd(params) {
    return axios({
        url: `/admin/game.gamelist/add`,
        method: "post",
        data: params
    });
}
export function gameGiftList(params) {
    return axios({
        url: `/admin/game.gamegift/index`,
        method: "get",
        data: params
    });
}
export function getGameGiftList(params) {
    return axios({
        url: `/admin/game.Gamegift/gift_list`,
        method: "get",
        data: params
    });
}
export function addGameGift(params) {
    return axios({
        url: `/admin/game.gamegift/add`,
        method: "post",
        data: params
    });
}
export function editGameGift(params) {
    return axios({
        url: `/admin/game.gamegift/edit`,
        method: "post",
        data: params
    });
}
export function delGameGift(params) {
    return axios({
        url: `/admin/game.gamegift/delete`,
        method: "post",
        data: params
    });
}
export function gamePlayList(params) {
    return axios({
        url: `/admin/game.playingmethodconfig/index`,
        method: "get",
        data: params
    });
}
export function addGamePlay(params) {
    return axios({
        url: `/admin/game.playingmethodconfig/add`,
        method: "post",
        data: params
    });
}
export function editGamePlay(params) {
    return axios({
        url: `/admin/game.playingmethodconfig/edit`,
        method: "post",
        data: params
    });
}
export function delGamePlay(params) {
    return axios({
        url: `/admin/game.playingmethodconfig/delete`,
        method: "post",
        data: params
    });
}
export function postImgUpload(data) {
    return axios({
        url: `/api/v1.Fileuploads/upload_resources_to_the_specified_directory`,
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeOut:2000
    })
}
export function getGameRecord(params) {
    return axios({
        url: `/api/v1.Gamedate/game_raffle_record_list`,
        method: "post",
        data: params
    });
}
export function getGameStatic(params) {
    return axios({
        url: `/api/v1.Gamedate/gameSummaryByGameId`,
        method: "post",
        data: params
    });
}
export function getFishResultLst(params) {
    return axios({
        url: `/api/fishing/game/getSectList`,
        method: "get",
        data: params
    });
}
export function setFishResult(params) {
    return axios({
        url: `/api/fishing/game/setNextResult`,
        method: "get",
        data: params
    });
}
export function getXdpdPeople(params) {
    return axios({
        url: `/api/hykj/party/farm/getFarmPropList`,
        method: "post",
        data: params
    });
}
export function setXdpdResult(params) {
    return axios({
        url: `/api/hykj/party/farm/setNextResult`,
        method: "get",
        data: params
    });
}

export function setSanGuoResult(params) {
    return axios({
        url: `/api/hykj/game/setNextResult`,
        method: "get",
        data: params
    });
}
export function getActyDetail(params) {
    return axios({
        url: `/api/v1.Gamedate/game_raffle_record_list_info`,
        method: "post",
        data: params
    });
}
export function getStarPeopleStatic(params) {
    return axios({
        url: `/api/hykj/gameReport/analysisByUser`,
        method: "post",
        data: params
    });
}
export function getPeopleAnlyCount(params) {
    return axios({
        url: `/api/hykj/gameReport/analysisCount`,
        method: "post",
        data: params
    });
}
export function getXdpdPeopleAnlyCount(params) {
    return axios({
        url: `/api/hykj/party/partyReport/analysisCount`,
        method: "post",
        data: params
    });
}
export function getXdpdPeopleAnlyLst(params) {
    return axios({
        url: `/api/hykj/party/partyReport/analysisByUser`,
        method: "post",
        data: params
    });
}
export function getFishPeopleAnlyCount(params) {
    return axios({
        url: `/api/fishing/report/analysisCount `,
        method: "post",
        data: params
    });
}
export function getFishPeopleAnlyLst(params) {
    return axios({
        url: `/api/fishing/report/analysisByUser`,
        method: "post",
        data: params
    });
}
export function getSanguoRecord(params) {
    return axios({
        url: `/api/hykj/gameReport/getRecordDetailByRecordId?recordId=${params.recordId}`,
        method: "get",
        data: params
    });
}
export function getVirtualData(params) {
    return axios({
        url: `/api/fishing/ext/extCount`,
        method: "get",
        data: params
    });
}
export function getBlackList(params) {
    return axios({
        url: `/admin/game.Gameblackperson/index`,
        method: "post",
        data: params
    });
}
export function checkToken(params) {
    return axios({
        url: "/api/v1.Gamelogin/checkToken",
        method: "post",
        data: params
    });
}








