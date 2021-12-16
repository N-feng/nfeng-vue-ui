<template>
  <div>
    <el-upload
      ref="upload"
      :accept="accept"
      :limit="1"
      :disabled="disabled"
      :action="action"
      :file-list="fileList"
      :data="postData"
      :before-upload="beforeUpload"
      :http-request="uploadHandle"
      :on-preview="previewHandle"
      :on-remove="handleRemove"
      :class="{
        'upload--disabled': disabled,
        'upload--hide': detail || fileList.length >=5,
        'upload--close': close
      }"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">支持文件格式：{{accept}}，单个文件不能超过{{limit}}MB，最多上传1个。</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
// import { uploadToken2 } from "@/api/enums.js";
export default {
  name: "YgpUploadFile",
  props: {
    action: {
      type: String,
      default: "https://upload-z2.qiniup.com",
    },
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .pdf",
    },
    limit: {
      type: Number,
      default: 10,
    },
    uploadFn: {
      type: Function,
    },
    beforeFn: {
      type: Function,
    },
    data: {
      type: Object,
    },
    detail: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    value: {},
    close: {
      type: Boolean,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // uploadDomain: "https://upload-z2.qiniup.com",
      openDomain: "",
      dir: "",
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
  methods: {
    initData(value) {
      if (Array.isArray(value)) {
        this.fileList = value.map((item) => {
          return {
            ...item,
            url: item.url || item.filePath,
            name: item.name || item.fileName,
          };
        });
      }
    },
    beforeUpload(file) {
      // console.log('file: ', file);
      // const isJPG =
      //   file.type === "image/jpeg" ||
      //   file.type === "image/png" ||
      //   file.type === "application/pdf";
      // if (!isJPG) {
      //   this.$message.error("仅支持jpg/png/pdf格式!");
      //   return type;
      // }
      // const isAccept = file.type.split('/')[0].indexOf(this.accept) !== -1;
      const isLimit = file.size / 1024 / 1024 < this.limit;
      // if (!isAccept) {
      //   this.$message.error("上传文件的格式不太对哟~");
      // }
      if (!isLimit) {
        this.$message.error("上传不能超过10MB!");
      }
      // type = uploadToken2()
      //   .then(({ data, code }) => {
      //     if (code === 0) {
      //       const { uploadToken, openDomain, dir } = data;
      //       this.postData = { token: uploadToken };
      //       this.openDomain = openDomain;
      //       this.dir = dir;
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   })
      //   .catch(() => {});
      return isLimit;
    },
    async uploadHandle(config) {
      // FormData 对象
      let form = new FormData();
      // 文件对象
      form.append("file", config.file);
      // 其他参数
      if (this.data) {
        Object.keys(this.data).forEach(el => {
          if (typeof this.data[el] === "object") {
             form.append(el, JSON.stringify(this.data[el]));
          } else {
             form.append(el, this.data[el]);
          }
         
        })
      }
      // XMLHttpRequest 对象
      let result = this.uploadFn && await this.uploadFn(form);
      if (result.succeed) {
        this.$message.success("上传成功！");
        this.$emit('success', result.data);
      } else {
        config.onRemove();
      }
      return result && result.succeed;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
      this.$emit("change", fileList);
      this.$emit("validateField");
    },
    previewHandle(file) {
      if (file.fileType === "application/pdf") {
        window.open(file.url);
        return;
      }
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss">
.upload--disabled {
  .el-upload--picture-card {
    display: none;
  }
  .el-upload,
  .el-upload__tip {
    display: none;
  }
  .el-upload-list__item:first-child {
    margin-top: 4px;
  }
}

.upload--hide {
  .el-upload,
  .el-upload__tip {
    display: none;
  }
  .el-upload-list__item:first-child {
    margin-top: 4px;
  }
}

.upload--close {
  .el-upload-list__item-status-label,
  .el-icon-close {
    display: none !important;
  }
}

.el-icon-close-tip {
  display: none !important;
}
</style>
