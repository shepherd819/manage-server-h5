<template>
  <div class="login-box">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
      <h3 class="title">用 户 登 录</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          autocomplete="off"
          placeholder="账 号: admin"
          prefix-icon="el-icon-user">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input :type="textType"
          v-model="loginForm.password"
          @keyup.native.enter="login('loginForm')"
          autocomplete="off"
          placeholder="密 码: admin"
          prefix-icon="el-icon-unlock">
          <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="verifyCode">
        <div style="display: flex">
          <el-input v-model="loginForm.code"
                    @keyup.native.enter="login('loginForm')"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    prefix-icon="el-icon-message" style="width: 250px">
          </el-input>
          <img :src="verifyCode" @click="updateVerifyCode" style="cursor: pointer;margin-left: 10px"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')" class="login-btn" >登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      verifyCode: '/user/verifyCode?' + new Date(),
      textType: 'password'
    }
  },
  methods: {
    updateVerifyCode () {
      this.verifyCode = this.verifyCode + "?" + new Date();
    },
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postFormHttp('/user/login', this.loginForm).then((res) => {
            console.log(res)
            if(res && res.retCode === '200'){
              sessionStorage.setItem('user', JSON.stringify(res.result))
              this.$router.replace({ path: '/index' })
            }else {
              sessionStorage.removeItem('user')
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('validate failed')
          return false
        }
      })
    },
    changeType () {
      this.textType = (this.textType === 'password' ? 'text' : 'password')
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  /*width: 100%;*/
  /*height: 100%;*/
  /*overflow: hidden;*/
  /*background: #20222A;*/
  width: 100%;
  height: 100%;
  background-image: url("../assets/login_bg.png");
  background-size: cover;
  background-position: center;
  position: absolute;
  .login-form {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    /*background: #f5f5f5;*/
    /*border: 1px solid #eaeaea;*/
    /*box-shadow: 0 0 5px #cac6c6;*/
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .btn-eye {
      cursor: pointer;
    }
    .text-danger {
      color: #F56C6C;
    }
    .login-btn {
      margin: 35px 0 10px 0;
      width: 100%;
    }
  }
}
</style>

