<!--
 * @Date: 2021-02-22 11:58:22
 * @LastEditors: N-feng
 * @LastEditTime: 2021-03-05 09:47:32
 * @FilePath: /ygp-bciscm-static/src/packages/CityPicker/index.vue
-->
<template>
  <div class="city-picker">
    <el-select
      v-model="currentProvince"
      class="city-select"
      placeholder="请选择省级"
      :disabled="disabled"
      @change="provinceChange"
    >
      <el-option
        v-for="(item, key) in provinces"
        :key="key"
        :label="getLabel(item, 'name')"
        :value="getValue(item, 'code')"
      ></el-option>
    </el-select>
    <el-select
      v-model="currentCity"
      class="city-select"
      placeholder="请选择市级"
      :disabled="disabled"
      @change="cityChange"
    >
      <el-option
        v-for="(item, key) in citys"
        :key="key"
        :label="getLabel(item, 'name')"
        :value="getValue(item, 'code')"
      ></el-option>
    </el-select>
    <el-select
      v-model="currentArea"
      class="city-select"
      placeholder="请选择区域"
      :disabled="disabled"
      @change="areaChange"
    >
      <el-option
        v-for="(item, key) in areas"
        :key="key"
        :label="getLabel(item, 'name')"
        :value="getValue(item, 'code')"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { listAreasByParentCode } from "@/api/area";

export default {
  name: "YgpCityPicker",
  props: {
    value: {},
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      provinces: [], // 省级下拉数据
      citys: [], // 市级下拉数据
      areas: [], // 区域下拉数据
      currentProvince: undefined, // 省级下拉值
      currentCity: undefined, // 市级下拉值
      currentArea: undefined // 区域下拉值
    };
  },
  watch: {
    value: {
      handler(val) {
        this.initData(val)
      }
    },
    currentProvince: {
      handler(val) {
        if (val) {
          this.getCitys(val)
          this.areas = []
        }
      }
    },
    currentCity: {
      handler(val) {
        if (val) {
          this.getAreas(val);
        }
      }
    }
  },
  created() {
    this.initData(this.value);
    this.getProvinces();
  },
  methods: {
    initData(value) {
      if (!value||value.length===0) {
        // 兼容弹窗-新增
        this.currentProvince = ""
        this.currentCity = ""
        this.currentArea = ""
        return;
      }
      if (value.length) {
        this.currentProvince = value[0];
      }
      if (value.length > 1) {
        this.currentCity = value[1];
      }
      if (value.length > 2) {
        this.currentArea = value[2];
      }
    },
    getProvinces() {
      listAreasByParentCode(0).then(({ data }) => {
        let arr = [];
        Object.keys(data).forEach(item => {
          arr = [...arr, ...data[item]];
        });
        this.provinces = arr;
      });
    },
    getCitys(val) {
      listAreasByParentCode(val).then(({ data }) => {
        let arr = [];
        Object.keys(data).forEach(item => {
          arr = [...arr, ...data[item]];
        });
        this.citys = arr;
      });
    },
    getAreas(val) {
      listAreasByParentCode(val).then(({ data }) => {
        let arr = [];
        Object.keys(data).forEach(item => {
          arr = [...arr, ...data[item]];
        });
        this.areas = arr;
      });
    },
    getLabel(option, labelKey) {
      return typeof option === "object" ? option[labelKey] : option;
    },
    getValue(option, valueKey) {
      return typeof option === "object" ? option[valueKey] : option;
    },
    // 省值改变回调
    provinceChange(val) {
      const option = this.provinces.find(item => item.code === val);
      this.currentCity = undefined;
      this.currentArea = undefined;
      this.$emit("input", [val]);
      this.$emit("change", [val], option);
    },
    // 市值改变回调
    cityChange(val) {
      const option = this.citys.find(item => item.code === val);
      this.currentArea = undefined;
      this.$emit("input", [this.currentProvince, val]);
      this.$emit("change", [this.currentProvince, val], option);
    },
    // 区值改变回调
    areaChange(val) {
      const option = this.areas.find(item => item.code === val);
      this.$emit("input", [this.currentProvince, this.currentCity, val]);
      this.$emit(
        "change",
        [this.currentProvince, this.currentCity, val],
        option
      );
    }
  }
};
</script>
