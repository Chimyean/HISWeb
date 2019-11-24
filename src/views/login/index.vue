<template>
  <div class="container">
    <div class="loginContainer">
    <el-form :model="loginForm" :rules="loginRule" ref="loginForm" class="loginBox">
      <div class="text"><p>医 院 信 息 系 统</p></div>
      <!--用户名-->
      <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <!--登录按钮-->
      <el-form-item>
        <div class="loginBtn">
          <el-button :loading="ifLogin" @click="submit">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<script>
import Bmob from 'hydrogen-js-sdk'
export default {
  data () {
    return {
      img: require('../../assets/background-image.jpg'),
      ifLogin: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRule: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submit (event) {
    //   console.log(event)
    //   console.log(this.$refs.loginForm.validate)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // console.log(this.loginForm.username)
          // this.ifLogin = true
          // if (this.loginForm.username === 'user' &&
          // this.loginForm.password === '123456') {
          //   this.ifLogin = false
          //   this.$router.push({path: '/hisPublic'})
          //   sessionStorage.setItem('user', this.loginForm.username)
          // } else {
          //   this.ifLogin = false
          //   alert('密码错误！')
          // }
          Bmob.User.login(this.loginForm.username, this.loginForm.password).then(res => {
            console.log('login', res)
            this.ifLogin = false
            this.$router.push({path: '/'})
            sessionStorage.setItem('user', this.loginForm.username)
            sessionStorage.setItem('token', res.userToken)
            console.log('userToken', res.userToken)
          }).catch(err => {
            console.log(err)
            this.ifLogin = false
            alert('用户名或密码有误！')
          })
        } else {
          console.log('err')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
/* body{
  background: url('../../assets/background-image.jpg');
  background-size: 100%;
  background-repeat:no-repeat;
} */
html{
  height: 0px;
}
.container{
  background: url("../../assets/background-image.jpg");
  background-size: 100% 100%;
  height: 100%;
  position: fixed;
  width: 100%;
  background-repeat: no-repeat;
}
.loginContainer{
  margin: 80px auto;
  width: 500px;
  height: 400px;
  background-color: #ffffffad;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  font-weight: bold;
}
.text{
  color: #158998;
  font-size: 20px;
  display: flex;
  justify-content: center;
}
.loginBtn{
  /* margin-left: 100px; */
  display: flex;
  justify-content: center;
}
.el-form.loginBox{
  width: 300px;
}
.el-button{
  background: #158998;
  color: #fff;
}
</style>
