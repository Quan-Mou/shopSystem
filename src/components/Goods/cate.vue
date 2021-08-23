<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- cart卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col
          ><el-button type="primary" @click="AddCate()"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="CateData"
        :columns="columns"
        show-row-hover
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        style="margin-top:15px"
      >
        <template slot="valid" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:#90ee90;font-size:14px"
            v-if="scope.row.cat_deleted == false"
          ></i>

          <i class="el-icon-error" style="color:red;font-size:14px" v-else></i>
        </template>
        <template slot="paixu" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="handle" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="redactCate(scope.row, scope.row.cat_name)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRedact(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 编辑表格分类信息弹出框 -->
      <el-dialog title="编辑分类" :visible.sync="cateDispaly" width="50%">
        <!-- 内容 -->
        <el-form ref="form" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="getCurrentRedactInfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="cateDispaly = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              YesRedactCate(
                getCurrentRedactInfo.cat_id,
                getCurrentRedactInfo.cat_name
              )
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 添加分类 -->
      <el-dialog
        title="添加分类"
        :visible.sync="AddCateDispaly"
        width="50%"
        @close="closeClassify"
      >
        <el-form
          ref="AddcateRef"
          label-width="80px"
          :model="AddCateData"
          :rules="AddCateDataRules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="AddCateData.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" required>
            <el-cascader
              style="width:100%"
              v-model="SelectorAddCate"
              :options="pullData"
              :props="CateDataConfig"
              @change="SelectorVal"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddCateDispaly = false">取 消</el-button>
          <el-button type="primary" @click="YesCateData">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 参数
      queryInfo: {
        type: 3,
        // 页数
        pagenum: 1,
        // 每页显示几条
        pagesize: 5
      },
      total: 0,
      // 分类数据
      CateData: [],
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // prop: "cat_deleted",
          // minWidth: "200px",
          type: "template",
          template: "valid"
        },
        {
          label: "排序",
          type: "template",
          template: "paixu"
        },
        {
          label: "操作",
          type: "template",
          template: "handle"
        }
      ],
      // 验证规则
      AddCateDataRules: {
        cat_name: [{ required: true, message: "请输入分类名", trigger: "blur" }]
      },
      // 编辑分类显示与隐藏的开关
      cateDispaly: false,
      // 点击编辑时拿到当前行信息
      getCurrentRedactInfo: [],
      // 添加分类显示与隐藏的开关
      AddCateDispaly: false,
      // 添加分类的数据
      AddCateData: {
        cat_name: "",
        // 父级id
        cat_pid: 0,
        // 层级
        cat_level: 0
      },
      // 添加分类联级数据
      pullData: [],

      SelectorAddCate: [],

      // 联级选择配置数据
      CateDataConfig: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: "true"
      }
    };
  },
  created() {
    this.getCateData();
  },
  methods: {
    async getCateData() {
      // console.log(this.queryInfo);
      // this.$http
      //   .get("/categories", { params: this.queryInfo })
      //   .then(ret => {
      //     if (ret.data.meta.status !== 200) {
      //       return this.$message.error("获取商品分类失败！");
      //     }
      //     this.CateData = ret.data.data;
      //     this.total = ret.data.data.total;
      //   })
      //   .catch(err => err);

      const { data: ret } = await this.$http.get("/categories", {
        params: this.queryInfo
      });
      if (ret.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.total = ret.data.total;
      this.CateData = ret.data.result;
    },
    // 编辑分类
    redactCate(currentInfo, name) {
      this.cateName = name;
      this.cateDispaly = true;
      this.getCurrentRedactInfo = currentInfo;
      console.log(this.getCurrentRedactInfo);
    },
    // 确定更改分类
    async YesRedactCate(id, name) {
      console.log(id, name);
      if (this.cateName === "") {
        return this.$message.error("请填写分类名称");
      }

      const { data: res } = await this.$http.put("/categories/" + id, {
        cat_name: name
      });

      if (res.meta.status !== 200) {
        return this.$message.error("更改失败！");
      }
      this.$message.success("更改成功！");
      this.getCateData();
      this.cateDispaly = false;
    },
    // 删除分类
    async deleteRedact(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(result);

      if (result !== "confirm") {
        return this.$message.error("取消删除");
      }

      const { data: res } = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$$message.error("删除失败");
      }
      this.$message.success("删除成功！");
      this.getCateData();
    },
    // 添加分类
    AddCate() {
      this.AddCateDispaly = true;
      this.getAddClassData();
      // console.log("a");
    },
    // 分页功能函数
    // 每条页面数发生改变时
    handleSizeChange(current) {
      this.queryInfo.pagesize = current;
      this.getCateData();
    },
    // 当前页发生改变时
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current;
      this.getCateData();
    },
    // 获取添加分类联级数据
    async getAddClassData() {
      const { data: ret } = await this.$http.get("/categories", {
        params: { type: 2 }
      });
      if (ret.meta.status !== 200) {
        return this.$message.error("获取分类父级失败！");
      }
      this.pullData = ret.data;
    },
    SelectorVal(val) {
      // 大于0就说明它选择的不是一级分类
      if (this.SelectorAddCate.length > 0) {
        // 一级分类的id 为0
        this.AddCateData.cat_pid = this.SelectorAddCate[
          this.SelectorAddCate.length - 1
        ];
        this.AddCateData.cat_level = this.SelectorAddCate.length;
      } else {
        // 证明等于0 等于0就是没有选择，是一级分类
        this.AddCate.cat_pid = 0;
        this.AddCate.cat_level = 0;
      }
    },
    // 确定添加分类
    YesCateData() {
      this.$refs.AddcateRef.validate(async valid => {
        // console.log(valid);
        if (!valid) {
          return;
        }
        console.log(this.AddCateData);
        const { data: ret } = await this.$http.post(
          "/categories",
          this.AddCateData
        );
        console.log(ret);
        if (ret.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加成功！");
        this.getCateData();
        this.AddCateDispaly = false;
      });
    },
    // 关闭添加分类的回调
    closeClassify() {
      this.AddCateData = {};
      this.SelectorAddCate = [];
    }
  }
};
</script>

<style lang="less" scoped></style>
