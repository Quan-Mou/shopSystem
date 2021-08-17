<template>
  <el-container class="wrapper">
    <el-header class="header">
      <div class="title">
        <img src="@/assets/logo.png" alt="" />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container class="main_container">
      <el-aside :width="fold ? '64px' : '200px'" class="aside">
        <div class="fold" @click="foldBtn">|||</div>
        <el-menu
          :default-active="asideCurrentActive"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#46acff"
          unique-opened
          :collapse="fold"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in asideList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="submenuIco[item.id]" class="iconfont"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + itemList.path"
              v-for="itemList in item.children"
              :key="itemList.id"
              @click="currentActive('/' + itemList.path)"
            >
              <template slot="title">
                <i class="iconfont icon-yonghuliebiao"></i>
                <span>{{ itemList.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
        <!-- <default></default> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Default from "@/components/default";
// import Default from "../default.vue";
export default {
  components: { Default },
  data() {
    return {
      asideList: [],
      submenuIco: {
        "125": "icon-yonghuliebiao",
        "103": "icon-quanxianguanli",
        "101": "icon-shangpinguanli",
        "102": "icon-guanli",
        "145": "icon-yonghuliebiao"
      },
      fold: false,
      asideCurrentActive: ""
    };
  },
  created() {
    this.getAside();
    console.log("组件创建了");
    // this.asideCurrentActive = sessionStorage.getItem("ActiveKey");
  },
  destroyed() {
    console.log("组件销毁了");
  },
  methods: {
    quit() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    getAside() {
      this.$http.get("/menus").then(res => {
        this.asideList = res.data.data;
      });
      // this.$http.get("/menus");
    },
    foldBtn() {
      // this.fold
      return (this.fold = !this.fold);
    },
    currentActive(Active) {
      // this.asideCurrentActive = Active;
      sessionStorage.setItem("ActiveKey", Active);
      // console.log(this.asideCurrentActive);
      this.asideCurrentActive = Active;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  img {
    width: auto;
    height: 100%;
  }
  h3 {
    display: inline-block;
    text-align: center;
    line-height: 100%;
    color: #fff;
    font-size: 22px;
    margin-left: 15px;
  }
}
.btn_contaner {
  position: absolute;
  right: 0;
  top: 10px;
  margin-right: 10px;
}
.main_container {
  background-color: #eaedf1;
  .el-aside {
    height: 100%;
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
    .fold {
      color: #fff;
      background-color: #4a5064;
      line-height: 27px;
      text-align: center;
      letter-spacing: 7px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
