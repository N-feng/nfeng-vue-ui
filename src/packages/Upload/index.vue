<template>
  <div>
    <el-upload
      ref="upload"
      :multiple="from === 'credit' ? true: false"
      :drag="drag"
      :accept="accept"
      :disabled="disabled"
      action="https://upload-z2.qiniup.com"
      :file-list="fileList"
      :data="postData"
      :on-preview="handlePreview"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-remove="handleRemove"
      :append-to-body="true"
      :class="{
        'upload--disabled': disabled,
        'upload--hide': detail || fileList.length >= limit,
        'upload--close': close
      }"
    >
      <template v-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <template v-else>
        <el-button size="small" type="primary">点击上传</el-button>
      </template>
      <div
        slot="tip"
        class="el-upload__tip"
      >支持文件格式：{{accept}}，单个文件不能超过{{fileSize}}MB，最多上传{{limit}}张。</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" @closed='dialogImageUrl = undefined'>
      <img width="100%" :src="dialogImageUrl" alt="图片" />
    </el-dialog>
  </div>
</template>

<script>
import { getPrivateDownloadUrl, getPrivateDownloadUrls } from "@/api/enums.js";
import { randomWord, compressUpload } from "./utils";
import request from "../../utils/request";

const postData = []

export default {
  name: "YgpUpload",
  props: {
    drag: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .pdf",
    },
    limit: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: Boolean,
    },
    detail: {
      type: Boolean,
    },
    close: {
      type: Boolean,
    },
    fileSize: {
      type: Number,
      default: 10,
    },
    getTokenApi: {
      type: String,
      default: "/bciscm/upload/tokenV2",
    },
    params: {
      type: Object,
    },
    value: {},
    from: {
      type: String,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      postData: {},
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.initData(val);
      },
    },
  },
  created() {
    this.initData(this.value);
  },
  mounted() {
    this.drag && document.addEventListener("paste", this.onPasteUpload);
  },
  beforeDestroy() {
    this.drag && document.removeEventListener("paste", this.onPasteUpload);
  },
  methods: {
    initData(value) {
      let _that = this;
      if (Array.isArray(value)) {
        _that.fileList = value.filter(f => f).map((item) => {
          return {
            ...item,
            url: item.url || item.filePath,
            name: item.name || item.fileName,
          };
        });
      }
    },
    beforeUpload(file) {
      let type = false;

      const strArr = file.name.split(".");
      const suffix = strArr[strArr.length - 1];
      const isFormat = this.accept.indexOf(suffix) !== -1;
      if (!isFormat) {
        this.$message.error(`仅支持${this.accept}格式!`);
        return type;
      }
      // const isJPG =
      //   file.type === "image/jpeg" ||
      //   file.type === "image/png" ||
      //   file.type === "application/pdf";
      // if (!isJPG) {
      //   this.$message.error("仅支持jpg/png/pdf格式!");
      //   return type;
      // }
      const imgTypes = ['jpg','jpeg', 'png']
      const isLt5M = file.size / 1024 / 1024 < this.fileSize;
      if (!isLt5M) {
        this.$message.error(`上传不能超过${this.fileSize}MB!`);
        return type;
      }
      if (this.from === "credit") {
        type = request({
          url: "/sys/file/filesystem/getUploadToken",
          method: "GET",
          params: {
            categoryCode: "bciFmsCreditPCAccessory",
            ...this.params,
            filename: file.name,
          },
        }).then(({ data, code }) => {
          if (code === 0) {
            const { uploadToken, url, fullname, filename, uuid, userName } = data;
            this.postData = {
              key: fullname,
              token: uploadToken,
              uuid,
              url,
              filename,
              uid: file.uid,
              userName
            };
            postData.push(this.postData)
            // 图片类型才需要压缩
            return imgTypes.includes(type[1]) ? compressUpload(file): file;
          } else {
            return false;
          }
        });
      } else {
        type = request({
          url: this.getTokenApi,
          method: "GET",
          params: {
            ...this.params,
            filename: file.name,
          },
        }).then(({ data, code }) => {
          if (code === 0) {
            const { uploadToken, dir } = data;
            let type = file.type && file.type.split("/");
            let name = `${randomWord(false, 8)}.${type[1]}`;
            this.postData = {
              token: uploadToken,
              key: `${dir}${name}`,
            };
            // 图片类型才需要压缩
            return imgTypes.includes(type[1]) ? compressUpload(file): file;
          } else {
            return false;
          }
        });
      }
      return type;
    },
    onPasteUpload(e) {
      // 此时file就是剪切板中的图片文件
      const upload = this.$refs.upload;
      if (!upload) {
        return;
      }
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type === "image/png") {
          const file = new File(
            [item.getAsFile()],
            new Date().getTime() + ".png"
          );
          upload.handleStart(file);
        }
      }
      upload.submit();
    },
    uploadSuccess(response, file, fileList) {
      this.$message.success("上传成功！");
      if (this.from === "credit") {
        const newFileList = fileList.map((item) => {
          let dItem = postData.find(f => f.uid === item.uid)
          if (dItem) {
            const { uuid, url, filename, userName } = dItem;
            return {
              ...item,
              uuid,
              url,
              fileType: "OTHER_ATTACHMENT",
              fileName: filename,
              creator: userName
            };
          }
          return item;
        }).filter((item, key) => key < this.limit);
        this.fileList = newFileList;
        this.$emit("input", newFileList);
        this.$emit("change", newFileList);
        this.$emit("validateField");
      } else {
        const newFileList = fileList.map((item) => {
          const fileName = item.fileName || (response && response.fname);
          const filePath = item.filePath || `${response.key}`;
          const fileSize = item.fileSize || (response && response.fsize);
          const fileType = item.fileType || (response && response.mimeType);
          return {
            ...item,
            fileName,
            filePath,
            fileSize,
            fileType,
          };
        });
        this.fileList = newFileList;
        this.$emit("input", newFileList);
        this.$emit("change", newFileList);
        this.$emit("validateField");
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
      this.$emit("change", fileList);
      this.$emit("validateField");
    },
    handlePreview(file) {
      if (this.from === "credit") {
        getPrivateDownloadUrls({
          categoryCode: "bciFmsCreditPCAccessory",
          urls: file.url,
        }).then((res) => {
          let fileType = file.url.split('.').pop()
          if ((file.raw && file.raw.type === "application/pdf") || fileType === "pdf" ||  file.fileType === "application/pdf") {
            window.open(res.data.urls[0]);
            return;
          }
          this.dialogImageUrl = res.data.urls[0];
          this.dialogVisible = true;
        });
      } else {
        getPrivateDownloadUrl({
          privateFileKey: file.filePath,
        }).then((res) => {
          let url = res.data;
          if (file.fileType === "application/pdf") {
            window.open(url);
            return;
          }
          this.dialogImageUrl = url;
          this.dialogVisible = true;
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "./_upload.scss";
</style>
