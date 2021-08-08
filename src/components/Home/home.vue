<template>
  <el-container class="wrapper">
    <el-header class="header">Header</el-header>
    <div class="btn_contaner">
      <el-button type="info" @click="quit">退出</el-button>
    </div>
    <el-container class="mian_container">
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    quit() {
      sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
}
.btn_contaner {
  position: absolute;
  right: 0;
  top: 0;
}
.mian_container {
  background-color: pink;
  .el-aside {
    height: 100%;
    background-color: blue;
  }
}
</style>
