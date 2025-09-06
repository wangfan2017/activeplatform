<template>
	<div class="login-container">
		<el-form ref="loginFromRef" class="login-form" :model="loginForm" :rules="loginRules">
			<div class="title-container">
				<h3 class="title">活动后台</h3>
			</div>
			<el-form-item prop="tel" style="display: flex;flex-direction: row">
				<span class="icon-container">
					<phone style="width: 1em;height: 1em" />
				</span>
				<el-input
					v-model="loginForm.tel" placeholder="请输入手机号" name="tel" type="text"
					@keyup.enter.native="handleLogin"
				/>
			</el-form-item>

			<el-form-item prop="code">
				<span class="icon-container">
					<Message style="width: 1em;height: 1em" />
				</span>
				<el-input
					v-model="loginForm.code" placeholder="请输入验证码" name="code" type="number"
					@keyup.enter.native="handleLogin"
				/>
				<span class="show-pwd">
					         <span class='content-right-msg' :class="loginForm.msg!='获取验证码'?'paddingleft':''" @click='getYzmCode'>{{loginForm.msg}}</span>
				</span>
			</el-form-item>

<!--			<el-form-item class="code-box" prop="captcha_code">-->
<!--				<span class="icon-container">-->
<!--					<Tickets style="width: 1em;height: 1em" />-->
<!--				</span>-->
<!--				<el-input-->
<!--					v-model="loginForm.captcha_code" placeholder="图形验证码" name="captcha_code" class="code-input"-->
<!--					maxlength="4" @keyup.enter.native="handleLogin"-->
<!--				>-->
<!--				</el-input>-->
<!--				<div class="code-img" @click="getCodeImg">{{codeNet}}</div>-->
<!--			</el-form-item>-->

			<el-button
				type="primary" style=" margin-bottom: 30px;width: 100%;" :loading="loading"
				size="large" @click.native.prevent="handleLogin"
			>
				<span>{{!loading ? '登 录' : '登 录 中...'}}</span>
			</el-button>
		</el-form>
		<!--  底部  -->
		<div class="el-login-footer">
			<span></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$bg: #5268bc;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #000;
$txt_color: #333;
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  //background-image: url("../../assets/login-background.jpeg");
  //background-size: cover;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  .login-form {
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    margin-top: 3%;
    padding: 35px;
    width: 420px;
    max-width: 100%;
    border-radius: 10px;
    background: white;
    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.1);
      color: #454545;

    }

    ::v-deep .el-input {
      display: inline-block;
      width: 85%;
      height: 47px;
      input {
        padding: 12px 5px 12px 15px;
        height: 47px;
        color: $txt_color;
        caret-color: $cursor;
      }
      .el-input__wrapper {
        width: 90%;
        height: 47px;
        background: none;
        box-shadow: none;
      }

    }
  }
  .icon-container {
    display: inline-block;
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    color: $dark_gray;
  }
  .title-container {
    position: relative;
    .title {
      margin: 0 auto 40px;
      text-align: center;
      font-weight: bold;
      font-size: 26px;
      color: $txt_color;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
    color: $dark_gray;
  }
  .code-box {
    position: relative;
    .code-img {
      position: absolute;
      right: 0;
      top: 6px;
      width: 60px;
      background: transparent;
      font-size: 22px;

    }
  }
  .el-login-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-family: Arial;
    font-size: 12px;
    color: #fff;
    letter-spacing: 1px;
  }
}
@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}

 :deep(.el-input) input[type='number'] {
   -moz-appearance: textfield; /* Firefox */
 }

:deep(.el-input) input[type='number']::-webkit-inner-spin-button,
:deep(.el-inpu) input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<script setup>
import { UserFilled, Lock, Tickets } from "@element-plus/icons";

import { ref, onMounted } from "vue";
import { validatePassword, validateCode } from "./rules";
import { getYzm,login } from "@/api/active";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";


const codeNet = ref("");

onMounted(() => {
	//getCodeImg();
});

// 数据源
const loginForm = ref({
  tel: "18911112222",
	code: "",
	captcha_code: "",
  msg:'获取验证码',
  seconds:60,
  timer:null,
});
const getYzmCode =async () => {
  if(loginForm.value.msg!='获取验证码')return;
  let params={
    phone:loginForm.value.tel,
    code_remark:'平台登录'
  }
  const { data, code,msg } =await getYzm(params);
  if(code==200){
    loginForm.msg=loginForm.value.seconds+'s';
    timers();
  }else{
    Message.info(msg);
  }
}
const timers = () => {
  loginForm.value.timer=setTimeout(()=>{
    if(loginForm.value.seconds==0){
      clearTimeout(loginForm.value.timer);
      loginForm.value.msg='获取验证码';
      loginForm.value.seconds=60;
      return;
    }
    loginForm.value.seconds=loginForm.value.seconds-1;
    loginForm.value.msg=loginForm.value.seconds+'s';
    timers();
  },1000)
}
// 验证规则
const loginRules = ref({
  tel: [
		{
			required: true,
			trigger: "blur",
			message: "请输入手机号"
		}

	],
	code: [
		{
			required: true,
			trigger: "blur",
      message:"请输入验证码"
		}

	]
	// captcha_code: [
	// 	{
	// 		required: true,
	// 		trigger: "blur",
	// 		validator: validateCode()
	// 	}
	// ]
});



// 登录动作处理
const loading = ref(false);
const loginFromRef = ref(null);
const store = useStore();
const router = useRouter();

/**
 * 登录
 */
const handleLogin = () => {
	loginFromRef.value.validate(valid => {
		if (!valid) return;
		loading.value = true;
		store.dispatch("user/login", loginForm.value)
			.then((res) => {
        router.push("/");
        return;
        if(res.code==200){
          setTimeout(() => {
            loading.value = false;
            // TODO: 登录后操作
            router.push("/");
          }, 500);
        }else{
          ElMessage.error(res.msg);
        }

			})
			.catch((err) => {
				//getCodeImg();
        ElMessage.error(err.msg);
				loading.value = false;
			});
	});
};
/**
 * 获取图形验证码
 */
// const getCodeImg = () => {
// 	getCode({})
// 		.then(data => {
// 			const obj = data.obj;
//
// 			loginForm.value.code_key = obj.code_key;
// 			codeNet.value = obj.code;
// 		})
// 		.catch(() => {
// 		});
// };

</script>