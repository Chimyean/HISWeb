<template>
<div class="container">
  <!--外容器-->
  <el-container class="allContainer">
      <!--侧边栏-->
      <el-aside style="width:200px;
      background-color:#158998;
      min-height:600px;overflow:hidden">
        <!--菜单栏-->
        <el-menu
        router
        style="width:200px"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#158998"
        text-color="#a8a8a8"
        active-text-color="#fff">
        <!-- <template v-for="route in $router.options.routes" v-if="route.children && route.children.length">
          <template v-for="item in route.children"> -->
          <!-- <el-menu-item :key="route.path + '/' + item.path" :index="item.path"> -->
            <!-- <template slot="title">  -->
            <!-- <i class="el-icon-location"></i>
            <span slot="title">{{item.name}}</span> -->
            <!-- </template> -->
          <!-- </el-menu-item> -->
          <el-menu-item index="register" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">挂号管理</span>
          </el-menu-item>
          <!--*******************************-->
          <el-submenu index="registerQuery" v-if="ifRegister">
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>查询统计</span>
            </template>
          <el-menu-item index="registerWork" v-if="false" >
            <i class="el-icon-menu"></i>
            <span slot="title">挂号员工作量</span>
          </el-menu-item>
          <el-menu-item index="doctorWork" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">医生工作量</span>
          </el-menu-item>
          <el-menu-item index="officeWork" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">科室工作量</span>
          </el-menu-item>
          </el-submenu>
          <!--*******************************-->
          <el-submenu index="registerData" v-if="ifRegister">
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>基础数据</span>
            </template>
            <el-menu-item index="officeInfo" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">科室信息</span>
            </el-menu-item>
            <el-menu-item index="doctorInfo" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">医生信息</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="registerPay" v-if="ifRegister">
            <i class="el-icon-menu"></i>
            <span slot="title">处方缴费</span>
          </el-menu-item>
          <el-menu-item index="management" v-if="ifMedicine">
            <i class="el-icon-menu"></i>
            <span slot="title">药房管理</span>
          </el-menu-item>
          <el-menu-item index="dose" v-if="ifMedicine">
            <i class="el-icon-menu"></i>
            <span slot="title">门诊发药</span>
          </el-menu-item>
          <el-menu-item index="queue" v-if="ifDoctor">
            <i class="el-icon-menu"></i>
            <span slot="title">病人队列</span>
          </el-menu-item>
          <el-menu-item index="workPlace" v-if="false">
            <i class="el-icon-menu"></i>
            <span slot="title">工作台</span>
          </el-menu-item>
          <!-- </template>
        </template> -->
        </el-menu>
      </el-aside>
      <!--左边路由显示-->
      <el-container class="left-container">
        <!--顶部导航-->
        <el-header class="app-header" style="height:40px">
          <el-dropdown size="small">
            <span class="el-dropdown-link">
            {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!--显示窗口-->
        <el-main>
          <template class="right-view">
            <router-view/>
          </template>
        </el-main>
      </el-container>
  </el-container>
</div>
</template>
<script>
export default{
  data () {
    return {
      username: 'user',
      active: 'register',
      ifMedicine: true,
      ifRegister: true,
      ifDoctor: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    logout () {
      //   let user = sessionStorage.getItem('user')
      //   console.log('the user name', user)
      this.$confirm('退出登录？', '提示', {}).then(() => {
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      })
        .catch(() => {

        })
    },
    tokenJudgement () {
      let user = sessionStorage.getItem('user')
      let token = sessionStorage.getItem('token')
      this.username = user
      // console.log(this.username)
      console.log('container.token', token)
      if (token === '3') {
        this.ifRegister = false
        this.ifDoctor = false
        this.ifMedicine = true
      } else if (token === '1') {
        this.ifRegister = true
        this.ifDoctor = false
        this.ifMedicine = false
      } else {
        this.ifRegister = false
        this.ifDoctor = true
        this.ifMedicine = false
      }
      console.log('ifRegister', this.ifRegister)
    },
    ifLogin () {
      let token = sessionStorage.getItem('token')
      if (token === null) {
        this.$router.push({path: '/login'})
      }
    }
  },
  mounted () {
    this.tokenJudgement()
    this.ifLogin()
  }
}
</script>
<style>
body{
  background: url('../../assets/background-white.jpg');
  background-size: 100%;
  background-repeat:no-repeat;
  margin: 0px;
}
.allContainer{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.left-container{
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  /* background-color: #000; */
}
.app-header{
  height: 30px;
  background-color: #e6e6e6;
  border-bottom: 1.5px solid #0fa5b9;
  border-top: 1.5px solid #0fa5b9;
  border-right: 1.5px solid #0fa5b9;
  display: flex;
  justify-content: flex-end;
}
.el-dropdown-link{
  line-height: 32px;
  font-size: 14px;
  color: #64a49f;
}
.el-dropdown{
  min-width: 30px;
}
.right-view{
  background: url('../../assets/background-white.jpg');
  background-size: 100%;
  background-repeat:no-repeat;
}
</style>
