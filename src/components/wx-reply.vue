<template>
  <el-tabs class="border-card" v-model="objData.replyType" @tab-click="handleClick">
    <el-tab-pane name="text">
      <span slot="label"><i class="el-icon-document"></i> 文本</span>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="objData.replyContent"
      >
      </el-input>
    </el-tab-pane>
    <el-tab-pane name="image">
      <span slot="label"><i class="el-icon-picture"></i> 图片</span>
      <el-row>
        <div class="select-item" v-if="objData.repUrl">
          <img class="material-img" :src="objData.repUrl" />
          <p class="item-name" v-if="objData.repName">{{ objData.repName }}</p>
          <el-row class="ope-row">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteObj"
            ></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repUrl">
          <el-row style="text-align: center">
            <el-col :span="12" class="col-select">
              <el-button type="success" @click="openMaterial"
                >素材库选择<i class="el-icon-circle-check el-icon--right"></i
              ></el-button>
            </el-col>
            <el-col :span="12" class="col-add">
              <el-upload
                :action="actionUrl"
                :headers="headers"
                multiple
                :limit="1"
                :on-success="handleUploadSuccess"
                :file-list="fileList"
                :before-upload="beforeImageUpload"
                :data="uploadData"
              >
                <el-button type="primary">上传图片</el-button>
                <div slot="tip" class="el-upload__tip">
                  支持bmp/png/jpeg/jpg/gif格式，大小不超过2M
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-dialog
          title="选择图片"
          :visible.sync="dialogImageVisible"
          width="90%"
          append-to-body
        >
          <wx-material-select
            :objData="objData"
            @selectMaterial="selectMaterial"
          ></wx-material-select>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="voice">
      <span slot="label"><i class="el-icon-phone"></i> 语音</span>
      <el-row>
        <div class="select-item2" v-if="objData.repName">
          <p class="item-name">{{ objData.repName }}</p>
          <div class="item-infos">
            <wx-voice-player
              :objData="
                Object.assign(tempPlayerObj, {
                  repMediaId: objData.media_id,
                  repName: objData.repName,
                })
              "
            ></wx-voice-player>
          </div>
          <el-row class="ope-row">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteObj"
            ></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repName">
          <el-row style="text-align: center">
            <el-col :span="12" class="col-select">
              <el-button type="success" @click="openMaterial"
                >素材库选择<i class="el-icon-circle-check el-icon--right"></i
              ></el-button>
            </el-col>
            <el-col :span="12" class="col-add">
              <el-upload
                :action="actionUrl"
                :headers="headers"
                multiple
                :limit="1"
                :on-success="handleUploadSuccess"
                :file-list="fileList"
                :before-upload="beforeVoiceUpload"
                :data="uploadData"
              >
                <el-button type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  格式支持mp3/wma/wav/amr，文件大小不超过2M，播放长度不超过60s
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-dialog
          title="选择语音"
          :visible.sync="dialogVoiceVisible"
          width="90%"
          append-to-body
        >
          <wx-material-select
            :objData="objData"
            @selectMaterial="selectMaterial"
          ></wx-material-select>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="video">
      <span slot="label"><i class="el-icon-share"></i> 视频</span>
      <el-row>
        <el-input v-model="objData.repName" placeholder="请输入标题"></el-input>
        <div style="margin: 20px 0"></div>
        <el-input v-model="objData.repDesc" placeholder="请输入描述"></el-input>
        <div style="margin: 20px 0"></div>
        <div style="text-align: center">
          <a target="_blank" v-if="objData.repUrl" :href="objData.repUrl"
            ><i class="icon-shipinbofang">&nbsp;播放视频</i></a
          >
        </div>
        <div style="margin: 20px 0"></div>
        <div style="text-align: center">
          <el-button type="success" @click="openMaterial"
            >素材库选择<i class="el-icon-circle-check el-icon--right"></i
          ></el-button>
          <!--          <el-button type="primary" v-if="permissions.wxmp_wxmaterial_add">新建视频<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
        </div>
        <el-dialog
          title="选择视频"
          :visible.sync="dialogVideoVisible"
          width="90%"
          append-to-body
        >
          <wx-material-select
            :objData="objData"
            @selectMaterial="selectMaterial"
          ></wx-material-select>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="news">
      <span slot="label"><i class="el-icon-news"></i> 图文</span>
      <el-row>
        <div class="select-item" v-if="objData.content">
          <wx-news :objData="objData.content.articles"></wx-news>
          <el-row class="ope-row">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteObj"
            ></el-button>
          </el-row>
        </div>
        <div v-if="!objData.content">
          <el-row style="text-align: center">
            <el-col :span="24" class="col-select2">
              <el-button type="success" @click="openMaterial"
                >素材库选择<i class="el-icon-circle-check el-icon--right"></i
              ></el-button>
            </el-col>
          </el-row>
        </div>
        <el-dialog
          title="选择图文"
          :visible.sync="dialogNewsVisible"
          width="90%"
          append-to-body
        >
          <wx-material-select
            :objData="objData"
            @selectMaterial="selectMaterial"
          ></wx-material-select>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="music">
      <span slot="label"><i class="el-icon-service"></i> 音乐</span>
      <el-row>
        <el-col :span="6">
          <div class="thumb-div">
            <img
              style="width: 100px"
              v-if="objData.repThumbUrl"
              :src="objData.repThumbUrl"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="thumb-but">
              <el-upload
                :action="actionUrl"
                :headers="headers"
                multiple
                :limit="1"
                :on-success="handleUploadSuccess"
                :file-list="fileList"
                :before-upload="beforeThumbImageUpload"
                :data="uploadData"
              >
                <el-button slot="trigger" size="mini" type="text"
                  >本地上传</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click="openMaterial"
                  style="margin-left: 5px"
                  >素材库选择</el-button
                >
              </el-upload>
            </div>
          </div>
          <el-dialog
            title="选择图片"
            :visible.sync="dialogThumbVisible"
            width="80%"
            append-to-body
          >
            <wx-material-select
              :objData="{ replyType: 'image' }"
              @selectMaterial="selectMaterial"
            ></wx-material-select>
          </el-dialog>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="objData.repName"
            placeholder="请输入标题"
          ></el-input>
          <div style="margin: 20px 0"></div>
          <el-input
            v-model="objData.repDesc"
            placeholder="请输入描述"
          ></el-input>
        </el-col>
      </el-row>
      <div style="margin: 20px 0"></div>
      <el-input
        v-model="objData.repUrl"
        placeholder="请输入音乐链接"
      ></el-input>
      <div style="margin: 20px 0"></div>
      <el-input
        v-model="objData.repHqUrl"
        placeholder="请输入高质量音乐链接"
      ></el-input>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import WxNews from "@/components/wx-news";
import WxMaterialSelect from "@/components/wx-material-select";
import WxVoicePlayer from "@/components/wx-voice-player";
export default {
  // 微信回复
  name: "wx-reply",
  props: {
    objData: {
      type: Object,
    },
  },
  data() {
    return {
      empPlayerObj: {
        type: "2",
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        ascs: [], //升序字段
        descs: [], //降序字段
      },
      tableLoading: false,
      dialogNewsVisible: false,
      dialogImageVisible: false,
      dialogVoiceVisible: false,
      dialogVideoVisible: false,
      dialogThumbVisible: false,
      tempObj: new Map().set(
        this.objData.replyType,
        Object.assign({}, this.objData)
      ),
      fileList: [],
      uploadData: {
        mediaType: this.objData.replyType,
        title: "",
        introduction: "",
      },
      actionUrl: "/dev-api/wxmaterial/materialFileUpload"
    };
  },
  components: {
    WxNews,
    WxMaterialSelect,
    WxVoicePlayer,
  },
  methods: {
    beforeThumbImageUpload(file) {
      const isType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/bmp" ||
        file.type === "image/jpg";
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("上传图片格式不对!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过2M!");
      }
      return isType && isLt;
    },
    deleteObj() {
      this.$delete(this.objData, "repName");
      this.$delete(this.objData, "repUrl");
      this.$delete(this.objData, "content");
    },
    beforeVoiceUpload(file) {
      this.tableLoading = true;
      const isType =
        file.type === "audio/mp3" ||
        file.type === "audio/wma" ||
        file.type === "audio/wav" ||
        file.type === "audio/amr";
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("上传语音格式不对!");
      }
      if (!isLt) {
        this.$message.error("上传语音大小不能超过2M!");
      }
      return isType && isLt;
    },
    beforeImageUpload(file) {
      const isType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/bmp" ||
        file.type === "image/jpg";
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("上传图片格式不对!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过2M!");
      }
      return isType && isLt;
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.fileList = [];
        this.uploadData.title = "";
        this.uploadData.introduction = "";
        let item = response.data;
        this.selectMaterial(item);
      } else {
        this.$message.error("上传出错：" + response.msg);
      }
    },
    selectMaterial(item) {

      console.log(this.objData)
      let tempObjItem = {};
      tempObjItem.replyType = this.objData.replyType;
      tempObjItem.repMediaId = item.mediaId;
      tempObjItem.media_id = item.mediaId;
      tempObjItem.content = item.content; 
      this.dialogNewsVisible = false;
      this.dialogImageVisible = false;
      this.dialogVoiceVisible = false;
      this.dialogVideoVisible = false;

      this.objData.repMediaId = item.mediaId;
      this.objData.media_id = item.mediaId;
      this.objData.replyContent = item.content;  
      if (this.objData.replyType == "music") {
        tempObjItem.repThumbMediaId = item.mediaId;
        tempObjItem.repThumbUrl = item.url;
        this.objData.repThumbMediaId = item.mediaId;
        this.objData.repThumbUrl = item.url;
        this.dialogThumbVisible = false;
      } else {
        tempObjItem.repName = item.name;
        tempObjItem.repUrl = item.url;
        this.objData.repName = tempObjItem.repName;
        this.objData.repUrl = tempObjItem.repUrl;
      }
      if (this.objData.replyType == "video") {
        getMaterialVideo({
          mediaId: item.mediaId,
        }).then((response) => {
          if (response.code == 200) {
            let data = response.data;
            this.$set(this.objData, "repName", data.title);
            this.$set(this.objData, "repDesc", data.description);
            this.$set(this.objData, "repUrl", data.downUrl);
            tempObjItem.repDesc = data.description;
            tempObjItem.repUrl = data.downUrl;
          }
        });
      }
      this.tempObj.set(this.objData.replyType, tempObjItem);
    },
    openMaterial() {
      if (this.objData.replyType == "news") {
        this.dialogNewsVisible = true;
      } else if (this.objData.replyType == "image") {
        this.dialogImageVisible = true;
      } else if (this.objData.replyType == "voice") {
        this.dialogVoiceVisible = true;
      } else if (this.objData.replyType == "video") {
        this.dialogVideoVisible = true;
      } else if (this.objData.replyType == "music") {
        this.dialogThumbVisible = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.public-account-management {
  .el-input {
    width: 70%;
    margin-right: 2%;
  }
}
.pagination {
  text-align: right;
  margin-right: 25px;
}
.select-item {
  width: 280px;
  padding: 10px;
  margin: 0 auto 10px auto;
  border: 1px solid #eaeaea;
}
.select-item2 {
  padding: 10px;
  margin: 0 auto 10px auto;
  border: 1px solid #eaeaea;
}
.ope-row {
  padding-top: 10px;
  text-align: center;
}
.item-name {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.el-form-item__content {
  line-height: unset !important;
}
.col-select {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
  width: 49.5%;
}
.col-select2 {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
}
.col-add {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
  width: 49.5%;
  float: right;
}
.avatar-uploader-icon {
  border: 1px solid #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
.material-img {
  width: 100%;
}
.thumb-div {
  display: inline-block;
  text-align: center;
}
.item-infos {
  width: 30%;
  margin: auto;
}
</style>