<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-input
            :span="9"
            placeholder="请输入内容"
            class="input-with-select"
            v-model="userListParams.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="8">
          <el-button
            :span="6"
            type="primary"
            class="addUser"
            @click="AddVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          key=""
          width="180"
          align="center"
          type="#"
        >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <!-- {{ scope }} 这个是当前行的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              @change="switchChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" widht="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="ModifyFn(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <template>
              <el-button
                type="danger "
                icon="el-icon-delete"
                size="mini"
                @click="deleteBtn(scope.row.id)"
              ></el-button>
            </template>
            <!-- 权限分配按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning "
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userListParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userListParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户弹出的对话框 -->
      <el-dialog
        title="添加用户"
        width="50%"
        :visible.sync="AddVisible"
        @close="emptyContent"
      >
        <!-- 对话框内容 -->
        <el-form
          :model="AddFrom"
          :rules="AddFromrules"
          ref="AddFromRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="AddFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="AddFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="AddFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="AddFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddUserData">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹出的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="ModifyVisible"
        width="50%"
        @close="closeModify()"
      >
        <!-- 内容区 -->
        <el-form
          :model="ModifyData"
          :rules="ModifyDataRule"
          ref="ModifyRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="ModifyData.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ModifyData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ModifyData.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ModifyVisible = false">取 消</el-button>
          <el-button type="primary" @click="YesModify()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1\d{10}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      // 参数
      userListParams: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 用户行信息
      userList: [],
      // 总数据
      total: null,
      // 添加用户控制显示与隐藏
      AddVisible: false,
      AddFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      AddFromrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 修改用户的显示与隐藏
      ModifyVisible: false,
      // 修改用户表单的数据
      ModifyData: {},
      // 修改用户验证规则
      ModifyDataRule: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 获取用户列表数据
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: ret } = await this.$http.get("/users", {
        params: this.userListParams
      });

      this.userList = ret.data.users;
      this.total = ret.data.total;
    },
    handleSizeChange(current) {
      this.userListParams.pagesize = current;
      this.getUserList();
    },
    handleCurrentChange(current) {
      this.userListParams.pagenum = current;
      this.getUserList();
    },
    async switchChange(userList) {
      console.log(userList);
      const { data: ret } = await this.$http.put(
        `/users/${userList.id}/state/${userList.mg_state}`
      );
      if (ret.meta.status !== 200) {
        return this.$message.error("状态更改失败");
      }
      this.$message.success("状态更改成功");
    },
    emptyContent() {
      this.$refs.AddFromRef.resetFields();
    },
    AddUserData() {
      this.$refs.AddFromRef.validate(async valid => {
        if (!valid) return;
        const { data: ret } = await this.$http.post("/users", this.AddFrom);
        if (ret.meta.status !== 201) {
          console.log(ret);
          return this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        // 添加用户成功后隐藏对话框并且重新请求用户数据
        this.AddVisible = false;
        this.getUserList();
      });
    },
    async ModifyFn(data) {
      this.ModifyVisible = true;
      const { data: res } = await this.$http.get("/users/" + data.id);

      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败！");
      }
      this.ModifyData = res.data;
    },
    // 关闭修改用户后的重置
    closeModify() {
      this.$refs.ModifyRef.resetFields();
    },
    // 确定修改用户
    YesModify() {
      this.$refs.ModifyRef.validate(async valid => {
        console.log(valid);
        if (!valid) {
          return;
        }
        // 预校验通过发起网络请求
        const { data: res } = await this.$http.put(
          "/users/" + this.ModifyData.id,
          {
            email: this.ModifyData.email,
            mobile: this.ModifyData.mobile
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("数据修改失败！");
        }
        this.ModifyVisible = false;
        this.$message.success("数据修改成功!");
        this.getUserList();
        // console.log(res);
        // console.log(this.ModifyData);
        // this.$http.put("/users/" + this.ModifyData.id, {
        //   email: this.ModifyData.email,
        //   mobile: this.ModifyData.mobile
        // });
      });
    },
    async deleteBtn(id) {
      console.log(id);
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (res == "cancel") return this.$message.info("已取消删除");
      // 发送请求
      const { data: ret } = await this.$http.delete("/users/" + id);
      console.log(ret);
      if (ret.meta.status !== 200) {
        return this.$message.info("删除失败" + ret.meta.msg + "!");
      }
      this.$message.success(ret.meta.msg);
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  .el-table {
    margin-top: 15px;
    .el-table-column {
      height: 52px;
    }
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
