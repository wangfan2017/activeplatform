import axios from "@/utils/axios";
export function getAdmintorList(params) {
    return axios({
        url: `/api/user/getOperator`,
        method: "post",
        data: params
    });
}
export function getRoleList(params) {
    return axios({
        url: `/api/user/getRoleList`,
        method: "post",
        data: params
    });
}
export function getPermission(params) {
    return axios({
        url: `/api/user/getPermission`,
        method: "post",
        data: params
    });
}

