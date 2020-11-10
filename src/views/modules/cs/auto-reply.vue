<template>
  <div class="app-container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-star-off"></i> 关注时回复</span>
        <el-table
          :data="dataList"
          border
          type="expand"
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="作用范围">
                  <span>{{
                    props.row.appid ? "当前公众号" : "全部公众号"
                  }}</span>
                </el-form-item>
                <el-form-item label="精确匹配">
                  <span>{{ props.row.exactMatch ? "是" : "否" }}</span>
                </el-form-item>
                <el-form-item label="是否有效">
                  <span>{{ props.row.status ? "是" : "否" }}</span>
                </el-form-item>
                <el-form-item label="备注说明">
                  <span>{{ props.row.desc }}</span>
                </el-form-item>
                <el-form-item label="生效时间">
                  <span>{{ props.row.effectTimeStart }}</span>
                </el-form-item>
                <el-form-item label="失效时间">
                  <span>{{ props.row.effectTimeEnd }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="ruleName"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="规则名称"
          >
          </el-table-column>
          <el-table-column
            prop="matchValue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="匹配关键词"
          >
          </el-table-column>
          <el-table-column
            prop="replyType"
            header-align="center"
            align="center"
            :formatter="replyTypeFormat"
            label="消息类型"
          >
          </el-table-column>
          <el-table-column
            prop="replyContent"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="回复内容"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteHandle(scope.row.ruleId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label"
          ><i class="el-icon-chat-line-round"></i> 消息回复</span
        >
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption2"
          @refresh-change="refreshChange"
          @sort-change="sortChange"
        >
          <template slot-scope="scope" slot="menuLeft">
            <div class="add_but">
              <el-button type="primary" @click="handleAdd" size="mini"
                >新 增</el-button
              >
            </div>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              plain
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              plain
              @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </avue-crud>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label"><i class="el-icon-news"></i> 关键词回复</span>
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption3"
          @refresh-change="refreshChange"
          @sort-change="sortChange"
          @search-change="searchChange"
        >
          <template slot-scope="scope" slot="menuLeft">
            <div class="add_but">
              <el-button type="primary" @click="handleAdd" size="mini"
                >新 增</el-button
              >
            </div>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              plain
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              plain
              @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="handleType == 'add' ? '新增回复消息' : '修改回复消息'"
      :visible.sync="dialog1Visible"
      width="50%"
    >
      <el-form label-width="100px">
        <el-form-item label="请求消息类型" v-if="type == '2'">
          <el-select v-model="objData.reqType" placeholder="请选择">
            <el-option
              v-for="item in dictData.get('wx_req_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              v-if="item.value !== 'event'"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="匹配类型" v-if="type == '3'">
          <el-select
            v-model="objData.repMate"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="item in dictData.get('wx_rep_mate')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" v-if="type == '3'">
          <el-input placeholder="请输入内容" v-model="objData.reqKey" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="回复消息">
          <WxReplySelect
            :objData="objData"
            v-if="hackResetWxReplySelect"
          ></WxReplySelect>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1Visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDataList, getObj, save, remove } from "@/api/wx/wxautoreply";
import {
  tableOption1,
  tableOption2,
  tableOption3,
} from "@/const/crud/wxmp/wxautoreply";
import WxReplySelect from "@/components/wx-reply";

export default {
  data() {
    return {
      dataForm: {
        matchValue: "",
      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        ascs: [], //升序字段
        descs: [], //降序字段
      },
      paramsSearch: {},
      tableLoading: false,
      tableOption1: tableOption1,
      tableOption2: tableOption2,
      tableOption3: tableOption3,
      dialog1Visible: false,
      type: "1", //类型（1、关注时回复；2、消息回复；3、关键词回复）
      objData: {
        repType: "text",
      },
      handleType: null,
      dictData: new Map(),
      hackResetWxReplySelect: false,
    };
  },
  components: { WxReplySelect },
  watch: {},
  created() {
    this.getPage(this.page);
    this.dictData.set("wx_rep_mate", [
      {
        value: "1",
        label: "全匹配",
      },
      {
        value: "2",
        label: "半匹配",
      },
    ]);
    this.dictData.set("wx_req_type", [
      {
        value: "text",
        label: "文本",
      },
      {
        value: "image",
        label: "图片",
      },
      {
        value: "voice",
        label: "语音",
      },
      {
        value: "video",
        label: "视频",
      },
      {
        value: "shortvideo",
        label: "小视频",
      },
      {
        value: "location",
        label: "地理位置",
      },
      {
        value: "link",
        label: "链接消息",
      },
      {
        value: "event",
        label: "事件推送",
      },
    ]);
  },
  mounted: function () {},
  computed: {},
  methods: {
    handleAdd() {
      this.hackResetWxReplySelect = false; //销毁组件
      this.$nextTick(() => {
        this.hackResetWxReplySelect = true; //重建组件
      });
      this.handleType = "add";
      this.dialog1Visible = true;
      this.objData = {
        repType: "text",
      };
    },
    handleEdit(row) {
      this.hackResetWxReplySelect = false; //销毁组件
      this.$nextTick(() => {
        this.hackResetWxReplySelect = true; //重建组件
      });
      this.handleType = "edit";
      this.dialog1Visible = true;
      this.objData = Object.assign({}, row);
    },
    handleClick(tab, event) {
      this.tableData = [];
      this.page.currentPage = 1;
      this.type = tab.name;
      this.getPage(this.page);
    },
    searchChange(params, done) {
      params = this.filterForm(params);
      this.paramsSearch = params;
      this.page.currentPage = 1;
      this.getPage(this.page, params);
      done();
    },
    sortChange(val) {
      let prop = val.prop
        ? val.prop.replace(/([A-Z])/g, "_$1").toLowerCase()
        : "";
      if (val.order == "ascending") {
        this.page.descs = [];
        this.page.ascs = prop;
      } else if (val.order == "descending") {
        this.page.ascs = [];
        this.page.descs = prop;
      } else {
        this.page.ascs = [];
        this.page.descs = [];
      }
      this.getPage(this.page);
    },
    getPage(page, params) {
      this.dataListLoading = true;
      getDataList(
        this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          matchValue: this.dataForm.matchValue,
          type: this.type,
        })
      ).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.page.list;
          this.totalCount = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalCount = 0;
        }
        this.dataListLoading = false;
      });
    },
    handleDel: function (row, index) {
      var _this = this;
      this.$confirm("是否确认删除此数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.id);
        })
        .then((data) => {
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
          this.getPage(this.page);
        })
        .catch(function (err) {});
    },
    handleSubmit(row) {
      if (this.handleType == "add") {
        addObj(
          Object.assign(
            {
              type: this.type,
            },
            this.objData
          )
        ).then((data) => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
          this.getPage(this.page);
          this.dialog1Visible = false;
        });
      }
      if (this.handleType == "edit") {
        save(this.objData.ruleId,this.objData).then((data) => {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
          this.getPage(this.page);
          this.dialog1Visible = false;
        });
      }
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done, loading) {
      save(row.ruleId,row)
        .then((data) => {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
          done();
          this.getPage(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    /**
     * @title 数据添加
     *
     **/
    handleSave: function (row, done, loading) {
      addObj(
        Object.assign(
          {
            type: this.type,
          },
          this.objData
        )
      )
        .then((data) => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
          this.getPage(this.page);
          this.dialog1Visible = false;
        })
        .catch(() => {
          done();
        });
    },
    /**
     * 刷新回调
     */
    refreshChange(page) {
      this.objData = {
        repType: "text",
      };
      this.getPage(page);
    },
  },
};
</script>