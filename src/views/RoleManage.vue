<template>
  <div id="role_manage">
    <div class="content-box">
      <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addRole">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column property="roleNameZh" label="角色名">
        </el-table-column>
        <el-table-column property="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="status" label="状态" style="width: 10%" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '1' ? 'primary' : 'danger'"
              disable-transitions>{{scope.row.status === '1'?'启用':'禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.roleName=='ROLE_admin'"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              :disabled="scope.row.roleName=='ROLE_admin'"
              @click="roleEdit(scope.$index, scope.row)">权限分配
            </el-button>
            <el-button
              size="mini"
              @click="handleUser(scope.$index, scope.row)">人员分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="角色信息" width="700px" class="dialog1" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleNameZh"
                      maxlength="15"
                      show-word-limit
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form.roleDesc"
                      maxlength="30"
                      show-word-limit
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否开启" :label-width="formLabelWidth">
            <el-switch v-model="form.status"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" v-db-click @click="addRoleSubmit">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="title2" class="dialog2" @opened="setRoleData" :visible.sync="dialogFormVisible2">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="margin-bottom: 20px"
        >
        </el-input>
        <el-tree
          :data="roleTreeData"
          node-key="menuId"
          show-checkbox
          check-on-click-node
          default-expand-all
          :check-strictly="true"
          @check="checkeTree"
          :expand-on-click-node="false"
          ref="permission"
          :filter-node-method="filterNode"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" v-db-click @click="rolePermissionSubmit">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="title3" class="dialog3" :visible.sync="dialogFormVisible3">
        <el-transfer
          filterable
          :titles="['未添加人员', '已添加人员']"
          :button-texts="['移除', '添加']"
          filterable
          filter-placeholder="请输入姓名"
          v-model="selectUserId"
          :data="userList">
        </el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" v-db-click @click="rolePersonSubmit">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  export default {
    name: "RoleManage",
    data() {
      return {
        userList: [],
        selectUserId: [],
        roleTreeData: [],
        tableData: [],
        dialogFormVisible: false,
        dialogFormVisible2: false,
        title2: '',
        dialogFormVisible3: false,
        title3: '',
        form: {
          roleNameZh: "",
          roleDesc: "",
          status: true,
          permission: []
        },
        formLabelWidth: "120px",
        defaultProps: {
          children: "childs",
          label: "menuName",
          id: "menuId"
        },
        selectRoleId: "",
        selectData: [],
        filterText: "",
        addRoleBtnLoading: false
      }
    },
    methods: {
      handleEdit(index, row) {
        for (let item in row) {
          this.form[item] = row[item]
        }
        this.form.status = row.status === "1"
        this.dialogFormVisible = true
      },
      addRole() {
        this.form = {
          roleNameZh: "",
          roleDesc: "",
          status: true
        }
        this.dialogFormVisible = true
      },
      addRoleSubmit() {
        this.addRoleBtnLoading = true
        let that = this
        if (!this.form.roleNameZh) {
          that.$message({
            showClose: true,
            message: "角色名称不能为空",
            type: "error"
          })
          return false
        }
        this.$http({
          url: '/tsr_server_manager/bmm/role/html/post/v1/addOrUpdateRole',
          data: {
            data: {
              role_id: this.form.role_id,
              roleNameZh: this.form.roleNameZh,
              roleDesc: this.form.roleDesc,
              status: this.form.status ? "1" : "0"
            }
          }
        }).then(res => {
          console.log(res)
          this.addRoleBtnLoading = false
          this.dialogFormVisible = false
          if (res.retCode === "0") {
            this.$message({message: "保存成功", type: 'success', duration: 1500});
            this.getRoleList();
          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.addRoleBtnLoading = false
          this.dialogFormVisible = false
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });
      },
      // 选中子节点，默认选中父节点
      checkeTree(data) {
        console.log(data)
        let thisNode = this.$refs.permission.getNode(data.menuId) // 获取当前节点
        const keys = this.$refs.permission.getCheckedKeys() // 获取已勾选节点的key值
        if (thisNode.checked) { // 当前节点若被选中
          if (thisNode.level == 1) {
            for (let childNode of thisNode.childNodes) { // 父级节若被选中，则将父节点的一级子节点选中（暂不支持多级子节点，可以用迭代实现多级子节点）
              if (!childNode.checked) { //
                keys.push(childNode.data.menuId)
              }
            }
          } else {
            for (let i = thisNode.level; i > 1; i--) {  // 判断是否有父级节点
              if (!thisNode.parent.checked) { // 父级节点未被选中，则将父节点替换成当前节点（暂不支持多级子节点，可以用迭代实现多级子节点）
                keys.push(thisNode.parent.data.menuId)
              }
            }
          }
        } else {
          if (thisNode.level == 1) {  //若取消父节点，则将父节点的一级子节点也取消
            for (let childNode of thisNode.childNodes) {
              if (childNode.checked) { //
                keys.splice(keys.indexOf(childNode.data.menuId), 1)
              }
            }
          }
          if (thisNode.level == 2) {
            var flag = true
            for (let childNode of thisNode.parent.childNodes) {
              if (childNode.checked) {
                flag = false
                break
              }
            }
            if (flag) {
              keys.splice(keys.indexOf(thisNode.parent.data.menuId), 1)
            }
          }
        }
        this.$refs.permission.setCheckedKeys(keys) // 将所有keys数组的节点全选中
      },
      rolePermissionSubmit() {
        let _this = this
        console.log("保存角色菜单")
        this.postHttp('/role/roleMenu',{
              menuIdList: _this.$refs.permission.getCheckedKeys(),
              roleId: _this.selectRoleId
        }).then(res => {
          console.log(res)
          if (res.retCode === "200") {
            this.$message({message: "保存成功", type: 'success', duration: 1500});
          }
          this.dialogFormVisible2 = false
        }).catch(err => {
          console.log(err);
        });
      },
      rolePersonSubmit() {
        let _this = this
        console.log("保存角色用户")
        this.$http({
          url: '/tsr_server_manager/bmm/role/html/post/v1/updateRoleUser',
          data: {
            data: {
              user_id_list: _this.selectUserId,
              role_id: _this.selectRoleId
            }
          }
        }).then(res => {
          console.log(res)
          if (res.retCode === "0") {
            this.$message({message: "保存成功", type: 'success', duration: 1500});
          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
          this.dialogFormVisible3 = false
        }).catch(err => {
          console.log(err);
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });
      },
      roleEdit(index, row) {
        console.log(index, row)
        this.title2 = row.roleNameZh + "-权限分配"
        this.selectRoleId = row.roleId
        this.getHttp('/role/roleMenuList',{"roleId": this.selectRoleId}).then(res => {
          console.log(res)
          if (res.retCode === "200") {
            this.selectData = res.result
            this.dialogFormVisible2 = true
          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });
      },
      setRoleData() {
        this.$refs.permission.setCheckedKeys([])
        this.$refs.permission.setCheckedKeys(this.selectData)
      },
      handleUser(index, row) {
        this.title3 = row.roleNameZh + "-人员分配"
        console.log("role_id:" + row.role_id)
        this.selectRoleId = row.role_id
        this.$http({
          url: '/tsr_server_manager/bmm/role/html/get/v1/getRoleUsers',
          data: {
            data: {
              role_id: row.role_id
            }
          }
        }).then(res => {
          console.log(res)
          if (res.retCode === "0") {
            this.userList = res.result.userList
            this.selectUserId = res.result.roleUserList
          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });

        this.dialogFormVisible3 = true
        console.log("handleUser")
      },
      getRoleList() {
        this.getHttp('/role/roleList').then(res => {
          console.log(res)
          if (res.retCode === "200") {
            this.tableData = res.result
          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });
      },
      getMenuList() {
        this.getHttp('/role/menuList').then(res => {
          console.log(res)
          if (res.retCode === "200") {
            this.roleTreeData = res.result

          } else {
            this.$message({message: res.retInfo, type: 'error', duration: 1500});
          }
        }).catch(err => {
          console.log(err);
          this.$message({message: "网络异常", type: 'error', duration: 1500});
        });
      },
      filterNode(value, data) {
        if (!value) return true
        return data.menuName.indexOf(value) !== -1
      }
    },
    watch: {
      filterText(val) {
        this.$refs.permission.filter(val)
      }
    },
    computed: {},
    mounted() {
      this.getRoleList()
      this.getMenuList()
    }
  }
</script>
<style>
  #role_manage .el-transfer-panel {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    overflow: hidden;
    background: #FFF;
    display: inline-block;
    vertical-align: middle;
    width: 30%;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }

  #role_manage .el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 15px;
  }

  #role_manage .dialog3 .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    transition: .1s;
    font-weight: 500;
    padding: 11px 12px;
    font-size: 14px;
  }
</style>

<style scoped>
  #role_manage .content-box {
    background: #fff;
    padding: 30px 40px;
    min-height: 100%;
  }

  .el-button--mini, .el-button--mini.is-round {
    padding: 10px 8px;
  }


  .nameinput {
    width: 150px;
  }

  .phoneinput {
    width: 120px;
  }

  .datepicker {
    width: 260px;
  }

  .dialog1 .el-dialog {
    width: 35%;
  }

  .dialog1 .el-dialog .el-form {
    width: 500px;
    margin: 0 auto;
  }

  .el-form-item__content {
    margin-left: 120px;
    width: 300px;
  }


</style>

