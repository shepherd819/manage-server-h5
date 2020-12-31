<template>
  <div class="header-box">
    <el-row type="flex" justify="space-between">
      <el-col :span="12">
        <button class="btn-tool" :title="collapseTitle" @click="collapse" >
            <i :class="collapseIcon"></i>
        </button>
<!--        <button class="btn-tool" title="刷新" @click="refresh">-->
<!--            <i class="el-icon-refresh"></i>-->
<!--        </button>-->
        <button class="btn-tool" title="全屏" @click="Utils.fullScreen">
            <i class="el-icon-rank"></i>
        </button>
        <button class="btn-tool" title="便签" @click="dialogVisible = true" >
          <i class="el-icon-edit"></i>
        </button>
        <span>{{ Utils.todayDate() }}</span>
      </el-col>
      <el-col :span="2">
        <MyAudio></MyAudio>
      </el-col>
      <el-col :span="10" align="right">
        <el-dropdown trigger="click" class="user-name" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile" disabled>个人资料</el-dropdown-item>
            <el-dropdown-item command="updatepwd" disabled>修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog title="便签" width="400px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @closed="saveNotes">
      <el-input
        type="textarea"
        :rows="7"
        placeholder="请输入内容"
        v-model="notes">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import MyAudio from "../audio/MyAudio";
export default {
  components: {MyAudio},
  inject: ['reload'],
  props:[
    'username'
  ],
  comments:{
    MyAudio
  },
  data () {
    return {
      collapseIcon: 'el-icon-d-arrow-left',
      collapseTitle: '折叠',
      dialogVisible: false,
      notes: ''
    }
  },
  methods: {
    collapse () {
      if(this.isCollapse){
        this.collapseIcon = 'el-icon-d-arrow-left'
        this.collapseTitle = '折叠'
      }else{
        this.collapseIcon = 'el-icon-d-arrow-right'
        this.collapseTitle = '展开'
      }
      this.$store.commit('switchCollapse')
    },
    refresh () {
      this.reload()
    },
    saveNotes () {
      localStorage.setItem(this.username, this.notes)
    },
    handleCommand (command) {
      switch (command) {
        case 'logout':
          this.getHttp("/logout").then((res) =>{
            if(res && res.retCode==='200'){
              sessionStorage.removeItem('user')
              this.$router.replace({ path: '/' })
            }
          })
          break
      }
    },
    checkNumberFloat (value) {
      // 去掉数字和.以外的内容
      value = value.replace(/[^\d.]/g, '')
      // 不允许.开头
      value = value.replace(/^\./g, '')
      // 去掉连续的.
      value = value.replace(/\.{2,}/g, '.')
      // 只允许一个点，第一个会匹配到第一个点，第二个会匹配到剩余的点
      // 因为是输入框，最多会呈现到‘1.23.’这种方式
      // 注意第一个点是字符串方式匹配，第二个是正则匹配
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // eslint-disable-next-line no-useless-escape
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      return value
    },

  },
  watch: {
    username (newName, oldName){
      this.notes = localStorage.getItem(newName) || '便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录'
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-tool {
    border: none;
    background: transparent;
    font-size: 18px;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
    /*text-align: left;*/
  }
  .user-name {
    margin-left: 20px;
  }
</style>
