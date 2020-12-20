<template>
  <div class="navMenu">
    <label v-for="menu in menuList" :key="menu.menuId">
      <el-menu-item v-if="menu.childs==null||menu.childs.length==0"
                    :key="menu.menuId"
                    :data="menu"
                    :index="menu.menuPath">
        <i :class="menu.menuIcon"></i>
        <span slot="title">{{menu.menuName}}</span>
      </el-menu-item>
      <el-submenu v-else :key="menu.menuId" :index="menu.menuPath==null?'':menu.menuPath" >
          <template slot="title">
            <i :class="menu.menuIcon"></i>
            <span> {{menu.menuName}}</span>
          </template>
          <NavMenu :menuList="menu.childs"></NavMenu>
      </el-submenu>
    </label>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ['menuList'],
  data() {
    return {}
  },
  methods: {}
}
/*export default {
  props: ['isCollapse'],
  data () {
    return {
      currentPath: location.pathname
    }
  }
}*/
</script>

<style lang="scss" scoped>
/*  .el-menu {
    border: none;
  }
  .menu-nav:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }*/
</style>
