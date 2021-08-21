<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="rightsList"
        style="width: 100%"
        :stripe="true"
        border
        max-height="550"
      >
        <el-table-column
          prop="date"
          label="序号"
          width="90"
          align="center"
          type="index"
        >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="382"
          align="center"
          id="demo"
        >
        </el-table-column>
        <el-table-column prop="path" label="路径" width="381" align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
          width="385"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级 </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: ret } = await this.$http.get("/rights/list");
      if (ret.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      // 获取到数据发送请求
      this.rightsList = ret.data;
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
}
#demo {
  line-height: 77px;
  font-size: 22px;
  color: red;
}
</style>
