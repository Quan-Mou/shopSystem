<template>
  <div class="login_container">
    <div class="login_wapper">
      <div class="login_logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <div class="login_form">
        <el-form
          class="form_container"
          :model="login_form"
          ref="form"
          :rules="rules"
        >
          <el-form-item class="form_item" prop="username">
            <el-input
              prefix-icon="iconfont icon-yonghu"
              v-model="login_form.username"
            ></el-input>
          </el-form-item>
          <el-form-item class="form_item" prop="password">
            <el-input
              prefix-icon="iconfont icon-mima"
              v-model="login_form.password"
              type="password"
            ></el-input>
          </el-form-item>
          <div class="login_button">
            <!-- <i class="el-icon-edit"></i> -->
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login_form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reset() {
      // this.$refs.form; 得到的是 这个组件
      // console.log(this.$refs.form);
      this.$refs.form.resetFields();
    },
    login() {
      this.$refs.form.validate(async ret => {
        if (!ret) return;
        this.$http.post("/login", this.login_form).then(ret => {
          if (ret.data.meta.status !== 200) {
            this.$message.error("登录失败，密码错误！！");
          } else if (ret.data.meta.status == 200) {
            this.$message.success("登录成功！");
            console.log(ret);
            sessionStorage.setItem("token", ret.data.data.token);
            this.$router.push("/home");
          }
          console.log(ret);
        });

        // const { data: ret } = await this.$http.post("/login", this.login_form);
        // console.log(ret);

        if (!ret) {
          return;
        }
        const { data: res } = await this.$http.post("/login", this.login_form);
        console.log(res);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_wapper {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .login_logo {
      width: 130px;
      height: 130px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px;
      img {
        width: 100%;
        height: 100%;
        // border: 1px solid #eee;
        border-radius: 50%;
        background-color: #efefef;
        overflow: hidden;
      }
    }
    .form_container {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      // display: flex;
      // justify-content: flex-end;
      .login_button {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 22px;
      }
    }
  }
}
</style>
