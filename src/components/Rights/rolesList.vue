<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="AddRoles()">添加角色</el-button>
      <el-table :data="rolesList" border style="width: 100%" class="table">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'RightsBottom',
                'flex',
                index1 === 0 ? 'separate_topBorder' : ''
              ]"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="deleteRoleRights(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right ico_left"></i
              ></el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'separate_topBorder', 'flex']"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="deleteRoleRights(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right ico_left"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRoleRights(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" align="center" class="xuhao">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger "
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning "
              icon="el-icon-setting"
              size="mini"
              @click="allotRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="AddrolesDispaly"
      width="50%"
      @close="empty"
    >
      <el-form
        :model="addRoles"
        :rules="addRolesrules"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input> </el-form-item
        ><el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddrolesDispaly = false">取 消</el-button>
        <el-button type="primary" @click="confirmRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDisplay" width="50%">
      <el-form
        :model="editData"
        :rules="addRolesrules"
        ref="EditRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editData.roleName"></el-input> </el-form-item
        ><el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editData.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDisplay = false">取 消</el-button>
        <el-button type="primary" @click="YesEdit(editData)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="allotRightsDisplay"
      width="50%"
      @close="closeRights()"
    >
      <el-tree
        :data="RightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectRights"
        default-expand-all
        ref="currentRightsTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRightsDisplay = false">取 消</el-button>
        <el-button type="primary" @click="YesRightsAllot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 添加角色控制显示与隐藏
      AddrolesDispaly: false,
      // 添加表单数据
      addRoles: {},
      // 添加表单数据校验规则
      addRolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      editRolesDisplay: false,
      // 编辑角色存的数据
      editData: {
        roleName: "",
        roleDesc: ""
      },
      // 分配权限控制与隐藏
      allotRightsDisplay: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //所有权限列表
      RightsList: [],
      // 默认选择的权限
      selectRights: [],
      // 当前点击的角色Id
      rolesId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  mounted() {
    console.log("组件挂载完成");
  },
  methods: {
    async getRolesList() {
      const { data: ret } = await this.$http.get("/roles");
      this.rolesList = ret.data;
      if (ret.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
    },
    AddRoles() {
      this.AddrolesDispaly = true;
    },
    confirmRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        if (valid) {
          const { data: ret } = await this.$http.post("/roles", this.addRoles);
          console.log(ret);
          if (ret.meta.status !== 201) {
            return this.$message.error("添加角色失败");
          }
          this.$message.success("添加角色成功");
          this.AddrolesDispaly = false;
          this.getRolesList();
        }
      });
    },
    // 关闭清空，input内容
    empty() {
      this.$refs.addRolesRef.resetFields();
    },
    // 删除角色
    async deleteRoles(id) {
      const ret = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (ret !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete("/roles/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功！");
      this.getRolesList();
    },
    // 编辑角色
    async edit(row) {
      this.editRolesDisplay = true;
      this.editData = row;
    },
    async YesEdit(editData) {
      const { data: ret } = await this.$http.put(
        "/roles/" + editData.id,
        this.editData
      );
      if (ret.meta.status !== 200) {
        return this.$message.info(ret.meta.status);
      }
      this.$message.success("修改角色信息成功！");
      this.editRolesDisplay = false;
      this.getRolesList();
    },
    // 删除权限
    async deleteRoleRights(roles, RightsId) {
      console.log(this.rolesList);
      const ret = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 确认返回confirm，取消返回cancel
      // console.log(ret);
      if (ret !== "confirm") {
        return this.$message.info("取消删除权限");
      }
      const { data: res } = await this.$http.delete(
        `/roles/${roles.id}/rights/${RightsId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.info("取消权限失败");
      }
      this.$message.success(res.meta.msg);
      // 把删除后的权限列表给当前权限列表。删除后的是最新的
      roles.children = res.data;
    },
    async allotRights(current) {
      const { data: ret } = await this.$http.get("/rights/tree");
      // this.rolesList = ret.data;
      if (ret.meta.status !== 200)
        return this.$message.info("获取权限列表失败！");
      this.RightsList = ret.data;
      this.allotRightsDisplay = true;
      this.getHaveRightsList(current, this.selectRights);
      this.rolesId = current.id;
    },
    // 递归拿到分配权限默认展示的id 函数

    /**
     * 递归三要素：
     * 1.明确这个函数要做什么 （找到三级权限）
     * 2.递归结束条件 （没有 children属性）
     * 3.递归的等价关系式 （）
     */
    getHaveRightsList(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getHaveRightsList(item, arr);
      });
    },
    closeRights() {
      this.selectRights = [];
    },
    async YesRightsAllot() {
      let selectSwitchId = [
        ...this.$refs.currentRightsTreeRef.getCheckedKeys(),
        ...this.$refs.currentRightsTreeRef.getHalfCheckedKeys()
      ];
      let divide = selectSwitchId.join(",");
      const { data: res } = await this.$http.post(
        `/roles/${this.rolesId}/rights`,
        {
          rids: divide
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("更新权限成功！");
      this.getRolesList();
      this.allotRightsDisplay = false;
    }
  }
};
</script>

<style>
.RightsBottom {
  border-bottom: 1px solid #eee;
}

.separate_topBorder {
  border-top: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}
.flex {
  display: flex;
  align-items: center;
}
.ico_left {
  margin-left: 3px;
}
</style>
