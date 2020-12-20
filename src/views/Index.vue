<template>
  <el-container class="index-box">
    <el-aside width="asideWidth">
      <div class="logo">
        <img v-show="!isCollapse" src="./../assets/b_logo.png" alt="ELementUI" width="122" height="27">
      </div>
<!--      <menus :isCollapse="isCollapse"/>-->
      <el-menu class="menu-nav"
               :default-active="currentPath"
               router
               background-color="#20222A"
               text-color="rgba(255,255,255,.8)"
               active-text-color="#ffd04b"
               :collapse="isCollapse">
        <NavMenu :menuList="menuList"></NavMenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <Headers :username="username"/>
      </el-header>
      <el-main>
        <div class="bar">
          <NavBar></NavBar>
        </div>
        <transition name="slide-fade">
          <router-view v-if="isRouterAlive"/>
        </transition>
<!--        <router-view v-if="isRouterAlive"/>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from '@/components/menus/NavMenu'
import Headers from '@/components/header/header'
import NavBar from '@/components/navBar'
export default {
  provide () {
    return {
      reload: this.reload,
    }
  },
  components: {
    NavMenu,
    Headers,
    NavBar
  },
  data () {
    return {
      isRouterAlive: true,
      currentPath: location.pathname,
      username:'',
      menuList:[
        {
          "menuId":"1",
          "menuName":"主页",
          "menuPath":"/index",
          "menuIcon":"el-icon-location",
          "childs":[]
        },
        {
          "menuId":"2",
          "menuName":"商场",
          "menuPath":"/goods",
          "menuIcon":"el-icon-goods",
          "childs":[]
        },
        {
          "menuId":"3",
          "menuName":"文章",
          "menuPath":"/articles",
          "menuIcon":"el-icon-document",
          "childs":[]
        },
        {
          "menuId":"4",
          "menuName":"图表",
          "menuPath":"/echarts",
          "menuIcon":"el-icon-share",
          "childs":[]
        },
        {
          "menuId":"5",
          "menuName":"设置",
          "menuPath":"",
          "menuIcon":"el-icon-setting",
          "childs":[
            {
              "menuId":"6",
              "menuName":"基本资料 (空)",
              "menuPath":"/profile",
              "menuIcon":"",
              "childs":[]
            },
            {
              "menuId":"7",
              "menuName":"修改密码 (空)",
              "menuPath":"/password",
              "menuIcon":"",
              "childs":[]
            }
          ]
        }
      ]
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    initUserInfo (){
      let user = JSON.parse(sessionStorage.getItem('user')?sessionStorage.getItem('user'):"{}")
      if (!user) {
        this.$router.push({ name: 'login' })
      }else{
        this.username = user.username
        this.menuList = user.menuList
      }
    }
  },
  mounted () {
    this.initUserInfo();
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
    asideWidth () {
      return this.$store.state.isCollapse ? 'auto' : '200px'
    }
  }
}
</script>

<style lang="scss">
.index-box {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  .el-container{
    height: 100%;
    .el-main {
      height: 100%;
    }
  }
  .el-aside {
    background-color: #20222A;
    height: 100vh;
    min-height: 100%;
    .logo {
      background-color: #20222A;
      color: rgba(255,255,255,.8);
      text-align: center;
      height: 60px;
      padding-top: 16px;
      font-size: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid gray;
    }
  }
  .el-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    line-height: 60px;
  }
  .el-menu {
    border: none;
  }
  .menu-nav:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .bar {
    margin-bottom: 8px;
  }
}
</style>
