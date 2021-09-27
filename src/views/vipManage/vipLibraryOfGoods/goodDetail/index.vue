<template>
  <div class="container" id="containerly">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品分类" class="is-required" prop="classificationofgoods">
          <div class="block">
            <span>{{ ruleForm.categoryName }}</span>
          </div>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <span>{{ ruleForm.goodsName }}</span>
        </el-form-item>
        <el-form-item label="商品简介" prop="description">
          <span>{{ruleForm.description}}</span>
        </el-form-item>
        <el-form-item label="封面图展示" prop="logo" v-if="jiaohuFlag != 0">
          <div class="selectedDisplayarea">
            <img :src="ruleForm.logo" alt="图片出错" />
          </div>
        </el-form-item>
        <el-form-item label="头图展示区" prop="headImage">
          <div class="showimages">
            <img class="item-img width_height" v-for="(item,index) in ruleForm.headImage" :src="item" :key="index"/>
          </div>
        </el-form-item>

        <el-form-item label="成本价" prop="costPrice">
          <span>{{ ruleForm.costPrice }}</span>
        </el-form-item>
       <!-- <el-form-item label="商品限价" prop="limitedPriceType" v-if="saveType !== 'see'">
          <el-radio-group v-model="ruleForm.limitedPriceType">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item
          v-if="ruleForm.limitedPriceType == 1 "
          label="限价价格"
          maxlength="10"
          :prop=" ruleForm.isLimitPrice == 1 ? 'limitedPrice' : ''"
        >
          <span>{{ruleForm.limitedPrice}}</span>
        </el-form-item> -->
        <el-form-item label="起拍价" prop="startPrice">
          <span>{{ruleForm.startPrice}}</span>
        </el-form-item>
        <el-form-item label="加价幅度" prop="markupPrice">
          <span>{{ruleForm.markupPrice}}</span>
        </el-form-item>
        <el-form-item label="积分赠送比" prop="inventory">
          <span>{{ ruleForm.isGiveIntegral }}</span>
        </el-form-item>
        <el-form-item label="估值" prop="assessPrice">
          <span>{{ ruleForm.assessPrice }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>详情</span>
      </div>
      <div v-html="ruleForm.goodsDetail"></div>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import moreImgUpload from "@/components/moreImgUpload";
import { goodsInfoadd, goodsInfoaddlist, goodsInfoedit } from "@/api/addrules";
import {
  vipLibraryOfGoodsAdd,
  vipLibraryOfGoodsEdit,
  vipLibraryOfGoodsDetails
} from "@/api/vipMange.js";
import { auctionRecordInfoList, treeApi } from "@/api/AuctionsRecord.js";
import { uploadFileList, inputOnchange } from "@/api/Newcompilation.js";
import particulars from "@/components/particulars";
import vuedraggable from "vuedraggable";
export default {
  components: {
    quillEditor,
    particulars,
    moreImgUpload,
    vuedraggable
  },
  data() {
    return {
      JiePaiTimeTrueFalse: false,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      FlagNumber: false,
      YongJin: "",
      props: {
        multiple: true
      },
      content: "<h2>I am Example</h2>",
      editorOption: {
        placeholder: "",
        theme: "snow"
      },
      imgs: "",
      //拍卖设置部分
      AuctionSet: {
        assessPrice: "",
        startPrice: "",
        protectPrice: "",
        maxProtectPrice: "",
        markupPrice: "",
        startTime: "",
        endTime: "",
        addPriceRuleId: "",
        ProtectPrice: ""
      },
      ImgFlag: false,
      //
      ruleForm: {
        headImage: [],
        limitedPriceType: 0
      },
      addrules: [],
      dialogVisibleHeader: false,
      dialogVisible: false,
      test: [],
      options: [],
      jiaohuFlag: null,
      SampleData: [],
      SwitchFlag: false,
      IndexSelected: "",
      numbers: null,
      selectedIndex: 0,
      copyflag: false,
      CurrentTime: null,
      saveType: "",
      userInfo: {},
      userInfoShow: false
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    sum() {
      inputOnchange({
        configKey: "markup_ratio_member"
      }).then(res => {
        if (res.msg === "success") {
          this.numbers = Number(res.data);
        }
      });
      return (this.AuctionSet.markupPrice * this.numbers).toFixed(2);
    }
  },
  created() {
    this.jiaohuFlag = Array.from(Object.keys(this.$route.query)).length;
    if (this.$route.query.hasOwnProperty("see")) {
      this.saveType = "see";
      this.getGoodsDetail();
    }
    vipLibraryOfGoodsDetails(this.$route.query).then(res => {
      console.log(res, "resreserse");
      for (var oldkey in this.ruleForm) {
        for (var newkey in res.data) {
          if (oldkey === newkey) {
            if (oldkey === "headImage") {
              console.log(res.data[newkey], "666666");
              this.ruleForm[oldkey] = res.data[newkey];
              this.imgs = res.data[newkey];
            } else {
              this.ruleForm[oldkey] = res.data[newkey];
            }
          }
        }
      }

      if (res.data.displayArea === 1) {
        this.ruleForm.displayArea = "默认区";
      }
      for (var oldkey in this.AuctionSet) {
        for (var newkey in res.data) {
          if (oldkey === newkey) {
            this.AuctionSet[oldkey] = res.data[newkey];
          }
        }
      }
      this.YongJin = res.data.brokerage;
      if (typeof this.ruleForm.headImage === "string") {
        this.ruleForm.headImage = JSON.parse(this.ruleForm.headImage);
        if (this.ruleForm.headImage.length === 0) {
          this.SwitchFlag = true;
        }
      }
    });
    setTimeout(() => {
      treeApi({ type: 1 }).then(res => {
        this.test = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].subCategorys.length > 0) {
            this.test.push({
              value: res.data[i].categoryId,
              label: res.data[i].name,
              children: []
            });
            for (let j = 0; j < res.data[i].subCategorys.length; j++) {
              this.test[i].children.push({
                value: res.data[i].subCategorys[j].categoryId,
                label: res.data[i].subCategorys[j].name
              });
            }
          } else {
            this.test.push({
              value: res.data[i].categoryId,
              label: res.data[i].name,
              disabled: true
            });
          }
        }
        this.options = this.test;
      });
    }, 500);
  },
  methods: {
    getGoodsDetail() {
      vipLibraryOfGoodsDetails({ goodsId: this.$route.query.goodsId }).then(
        res => {
          if (res.code == 0) {
            res.data.goodsInfo.headImage = JSON.parse(
              res.data.goodsInfo.headImage
            );
            let arr = [];
            let str = res.data.goodsInfo.categoryId;
            if (str.length > 4) {
              arr.push(str.slice(0, 4));
              arr.push(str);
            } else {
              arr.push(str);
            }
            res.data.goodsInfo.classificationofgoods = arr;
            this.ruleForm = res.data.goodsInfo;
          }
        }
      );
    },
    imageSuccessCBK(arr) {
      console.log(arr, "arr");
      const _this = this;
      arr.forEach(v => {
        if (this.ruleForm.headImage.length < 9) {
          this.ruleForm.headImage.push(v.url);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-demo ul {
  display: none !important;
}
.el-upload-list .el-upload-list--picture {
  display: none !important;
}
.showimages {
  display: flex;
  flex-wrap: wrap;
}
.selectedDisplayarea{
  height: 100px;
}
.selectedDisplayarea img {
  height: 100%;
}
.container {
  padding: 20px;
}
.Displayarea span {
  display: block;
  text-align: center;
}
.Displayarea {
  position: relative;
  float: left;
  margin-left: 20px;
}
.Displayarea img {
  width: 100px;
  height: 100px;
}
.container {
  padding: 20px;
}
.Images {
  width: 50px;
  height: 50px;
}
.productDetails {
  width: 100%;
  height: 632px;
  border: 1px solid #ccc;
  margin-left: 20px;
  margin-top: 20px;
  overflow-y: scroll;
}
.footerBun {
  margin: 20px 30px 40px;
}
.width_height {
  height: 100px;
  margin-right: 20px;
}
</style>
