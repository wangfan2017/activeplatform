import {checkToken} from '../api/game.js';
import {useRoute, useRouter} from "vue-router";
class Comm {
    constructor() {
        //this.checkUser();
    }
    async checkUser(){
       const {code,msg}=await checkToken();
       if(code==401){
           router.push({
             path: "/login"
           });
       }
    }
}
export const common=new Comm();