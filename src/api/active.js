import axios from "@/utils/axios";
export function login(params) {
    return axios({
        url: `/api/user/login`,
        method: "post",
        data: params
    });
}
export function getYzm(params) {
    return axios({
        url: `/api/user/getYzm`,
        method: "post",
        data: params
    });
}
export function getTempList(params) {
    return axios({
        url: `/api/user/tempList`,
        method: "post",
        data: params
    });
}