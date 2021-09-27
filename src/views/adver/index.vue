<template>
  <div class="app-container">
    <!-- 渲染部分 -->
    <div class="filter-container">
      <el-select
        v-model="searchbanner.displayPosition"
        clearable
        class="filter-item"
        style="width: 130px"
        placeholder="终端"
      >
        <el-option
          v-for="item in terminalArrys"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input
        v-model="searchbanner.name"
        placeholder="广告名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="searchbanner.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>

      <el-select
        v-model="searchbanner.positionId"
        placeholder="位置"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusarr"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="searchbanner.status"
        clearable
        class="filter-item"
        style="width: 130px"
        placeholder="状态"
      >
        <el-option
          v-for="item in usageStates"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="reset">重置</el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        v-if="checkPermission(['adver:adverList:add'])"
        icon="el-icon-edit"
        @click="addfunc"
      >添加</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="selectSort"
      max-height="750"
    >
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告图片" align="center" width="220">
        <template slot-scope="scope">
          <img :src="scope.row.image" style="max-width:200px;max-height:200px;" />
        </template>
      </el-table-column>
      <el-table-column label="终端" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.displayPosition == '1'">小程序</span>
          <span v-if="scope.row.displayPosition == '2'">APP</span>
          <span
            v-if="scope.row.displayPosition.search('1') !=-1 && scope.row.displayPosition.search('2') != -1"
          >小程序/APP</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">H5</span>
          <span v-if="scope.row.type === 2">拍卖商品</span>
          <span v-if="scope.row.type === 3">分类</span>
          <span v-if="scope.row.type === 4">小程序</span>
          <span v-if="scope.row.type === 5">拍卖区域</span>
          <span v-if="scope.row.type === 6">无跳转</span>
          <span v-if="scope.row.type === 7">抽奖活动</span>
          <span v-if="scope.row.type === 8">积分商城</span>
        </template>
      </el-table-column>

      <el-table-column label="位置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.positionName }} <span v-if="scope.row.positionId=='3'">{{scope.row.sign=='1'?'一楼':'二楼'}}</span> </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">可用</span>
          <span v-if="scope.row.status === 1">不可用</span>
        </template>
      </el-table-column>

      <el-table-column label="广告投放时间" align="center">
        <template slot-scope="scope">{{scope.row.startTime + '~' + scope.row.endTime}}</template>
      </el-table-column>

      <el-table-column label="排序" sortable="custom" prop="sort" align="center"></el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            style="margin-bottom:20px"
            @click="examine(row)"
            v-if="row.status === 0 && checkPermission(['adver:adverList:lookUp'])"
          >查看</el-button>

          <el-button
            type="primary"
            size="mini"
            style="margin-bottom:20px"
            @click="editoryour(row)"
            v-if="row.status === 1 && checkPermission(['adver:adverList:edit'])"
          >编辑</el-button>

          <el-button
            size="mini"
            type="danger"
            style="margin-bottom:20px"
            @click="outfunc(row)"
            v-if="row.status === 0 && checkPermission(['adver:adverList:forbidden'])"
          >禁用</el-button>

          <el-button
            size="mini"
            type="success"
            style="margin-bottom:20px"
            @click="putawayfunc(row)"
            v-if="row.status === 1 && checkPermission(['adver:adverList:forbidden'])"
          >启用</el-button>

          <el-button
            type="primary"
            size="mini"
            style="margin-bottom:20px"
            v-if="checkPermission(['adver:adverList:Ordering'])"
            @click="Thesequencebutton(row)"
          >调序</el-button>
          <el-button
            size="mini"
            type="info"
            style="margin-bottom:20px"
            v-if="row.status === 1"
            @click="deleteAdver(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="cancelLevel"
    >
      <el-form
        v-if="dialogFormVisible"
        ref="dataForm"
        :rules="rules"
        :model="information"
        label-position="left"
        label-width="100px"
        style="width: 750px; margin-left:50px;"
      >
        <el-form-item label="终端" class="is-required" prop="checkList">
          <el-checkbox-group v-model="information.checkList">
            <el-checkbox label="1" name="checkList">小程序</el-checkbox>
            <el-checkbox label="2" name="checkList">APP</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="广告位" class="is-required" prop="positionId">
          <el-select
            v-model="information.positionId"
            placeholder="位置"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in statusarr"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
		<el-form-item v-if="information.positionId=='3'" label="金刚区位置" prop="sign">
		  <el-input v-model="information.sign" maxlength="1" style="width: 200px" /><span style="font-size:14px">(1：表示1楼，2：表示2楼，不填默认为1)</span>
		</el-form-item>
        <el-form-item label="广告名称 " class="is-required" prop="name">
          <el-input v-model="information.name" maxlength="30" style="width: 200px" show-word-limit />
        </el-form-item>
        <el-form-item label="广告图片" class="is-required" prop="image">
          <img style="max-width: 200px;max-height: 200px;" v-if="information.image" class="tempPic" :src="information.image" alt />
          <el-upload
            ref="upload"
            v-model="information.image"
            action
            :on-change="(file, fileList)=>{getFile(file, fileList,'image')}"
            :show-file-list="false"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          :label="information.positionId == '4' ? '小banner图': '广告列表图'"
          :prop="information.positionId == '4' ? 'minImage' : 'aaa'"
        >
		 <span  v-if="information.minImage">
			 <img
            style="max-width: 200px;max-height: 200px;"
            v-for="item in information.minImage"
			:key="item"
            class="tempPic"
            :src="item"
            alt
          /></span>
          
          <el-upload
            ref="upload"
            v-model="information.minImage"
            action
			list-type="picture"
            :on-change="(file, fileList)=>{getFile(file, fileList,'minImage')}"
            :show-file-list="false"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload><span style="font-size:14px">(图片展示位置 1 大图X 2 今明昨标签图 3 小图 4 小图X)</span>
        </el-form-item>

        <el-form-item label="广告时间" class="is-required" prop="validity">
          <el-radio-group v-model="information.validity">
            <el-radio :label="1">永久投放</el-radio>
            <el-radio :label="2">时间段</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="投放时间"
          class="is-required"
          v-if="information.validity === 2"
          prop="startTimeaddendTime"
        >
          <el-date-picker
            v-model="information.startTimeaddendTime"
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="广告类型" class="is-required" prop="type">
          <el-select
            v-model="information.type"
            placeholder="类型"
            clearable
            @change="handleClick"
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拍卖区域" class="is-required" v-if="information.type == 5" prop="linkId">
          <el-select
            v-model="information.linkId"
            placeholder="选择拍卖区域"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in auctionAreaList"
              :key="item.key"
              :label="item.auctionName"
              :value="item.auctionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="H5链接"
          class="is-required"
          v-if="information.type == 1 || information.type == 7"
          prop="linkId"
        >
          <el-input v-model="information.linkId" style="width: 200px" />
        </el-form-item>

        <el-form-item
          label="选择商品"
          class="is-required"
          v-if="information.type == 2 || information.type == 8"
          prop="linkId"
        >
          <el-input v-model="showname" @focus="selectShopping" style="width: 200px" />
        </el-form-item>

        <el-form-item label="类目" class="is-required" v-if="information.type == 3" prop="linkId">
          <el-cascader
            placeholder="请选择商品分类"
            :props="Props"
            :options="category"
            v-model="information.linkId"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="小程序" class="is-required" v-if="information.type == 4" prop="linkId">
          <el-input v-model="information.linkId" style="width: 200px" />
        </el-form-item>

        <el-form-item label="权重" class="is-required" prop="sort">
          <el-input v-model="information.sort" type="number" style="width: 200px" />
        </el-form-item>
        <el-form-item label="广告提示语">
          <el-input
            v-model="information.prompt"
            maxlength="120"
            type="textarea"
            style="width: 400px"
            :rows="5"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLevel">取消</el-button>
        <el-button type="primary" @click="createDatabanner">提交</el-button>
      </div>
    </el-dialog>
    <goodsChoice @closeDialog="closeDialog" :dialogPvVisible="dialogPvVisible" @callback="iwantyou"></goodsChoice>
    <integralMall @closeDialog="closeDialog" :goodsDialog="goodsDialog" @callback="iwantyou"></integralMall>
    <el-dialog :visible.sync="examineshopping" title="查看商品" :before-close="callbackexamine">
      <examine
        @examineshoppings="callbackexamine"
        :examineshoppingvalue="examineshoppingvalue"
        v-if="examineshopping"
      ></examine>
    </el-dialog>

    <el-dialog title="调序" :visible.sync="Thesequence">
      <div class="Shopping">商品名称:{{debuggers.shoppingname}}</div>
      <div class="Shopping">当前权重:{{debuggers.weight}}</div>
      <div class="Setweight Shopping">
        设置权重:
        <el-input v-model="Setweight" style="width:50%"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Thesequence = false">取 消</el-button>
        <el-button type="primary" @click="sortSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="下架" :visible.sync="soldOut">
      <div class="putawayClass">确定下架此广告吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="soldOut = false">取 消</el-button>
        <el-button type="primary" @click="soldSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="上架" :visible.sync="putaway">
      <div class="putawayClass">确定上架此广告吗？</div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="putaway = false">取 消</el-button>
        <el-button type="primary" @click="putawaySure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确定删除吗？" :visible.sync="deleleOut">
      <div class="putawayClass">删除后，广告信息不可见，确定删除吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleleOut = false">取 消</el-button>
        <el-button type="primary" @click="deleleOutSure(row)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  bannerlist,
  bannerPosition,
  bannersearch,
  banneradd
} from "@/api/Advertisingpopups";
import { treeApi, bannerchangeshoppping } from "@/api/AuctionsRecord";
import goodsChoice from "@/components/Advertisingmanagementpopup/goodsChoice";
import integralMall from "@/components/Advertisingmanagementpopup/integralMall";
import { fetchListbanner, setsortdata } from "@/api/adverLocal";
import {
  fetchList,
  positionList,
  advDel,
  advDetail,
  advEdit,
  uploadImg,
  advAdd,
  advChange,
  superList,
  uploadImgFile,
  auctionAreaList
} from "@/api/adver";
import { h5ManageGetAllList } from "@/api/rule";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import treeToArray from "@/utils/deal";
import examine from "@/components/examine/index";
import checkPermission from "@/utils/permission";
//类型
const calendarTypeOptions = [
  {
    key: 1,
    display_name: "H5"
  },
  {
    key: 2,
    display_name: "拍卖商品"
  },
  {
    key: 3,
    display_name: "分类"
  },
  {
    key: 4,
    display_name: "小程序"
  },
  {
    key: 5,
    display_name: "拍卖区域"
  },
  {
    key: 6,
    display_name: "无跳转"
  },
  {
    key: 8,
    display_name: "积分商城"
  }
];
const terminalArrys = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "1",
    label: "小程序"
  },
  {
    value: "2",
    label: "APP"
  }
];
const usageStates = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "0",
    label: "可用"
  },
  {
    value: "1",
    label: "不可用"
  }
];

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "adver",
  components: {
    Pagination,
    goodsChoice,
    examine,
    integralMall
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      advId: "",
      value: "",
      sortNo: "",
      //展示字段
      showname: "",
      reuseStatus: "",
      putaway: false,
      //上架内容
      //调序
      Informationfromtheshelves: "",
      soldOut: false,
      debuggers: {
        shoppingname: "",
        weight: ""
      },
      Thesequence: false,
      Setweight: "",

      examineshoppingvalue: null,
      examineshopping: false,
      options: [],
      props: { multiple: true },
      category: [],
      information: {
        checkList: [],
        positionId: "",
        name: "",
		sign:1,
        image: "",
        validity: "",
        startTime: "",
        endTime: "",
        //时间组合
        startTimeaddendTime: "",
        type: "",
        linkId: "",
        sort: "",
        id: "",
        auctionId: undefined,
        displayPosition: [],
        minImage: [],
        prompt: "" //广告提示语
      },
      statusarr: [],
      tableKey: 0,
      tableKey1: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        time: undefined,
        name: undefined,
        status: undefined
      },
      //搜索内容
      searchbanner: {
        type: "",
        positionId: "",
        name: "",
        status: "",
        displayPosition: ""
      },
      //
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      terminalArrys,
      usageStates,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        name: "",
        positionId: "",
        time: "",
        content: "",
        sort: "",
        type: "",
        linkId: "",
        image: "",
        themeImage: ""
      },
      tempLinkId: [],
      dialogFormVisible: false,
      goodsDialog: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        positionId: [
          {
            required: true,
            message: "请选择广告位",
            trigger: ["blur", "change"]
          }
        ],
        minImage: [
          {
            required: true,
            message: "请选择小banner图",
            trigger: ["blur", "change"]
          }
        ],
        checkList: [
          {
            type: "array",
            required: true,
            message: "请选择终端",
            trigger: "change"
          }
        ],
        validity: [
          { required: true, message: "请选择广告时间", trigger: "change" }
        ],
        name: [
          { required: true, message: "请选择广告名称", trigger: "change" }
        ],
        image: [
          { required: true, message: "请选择广告图片", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ],
        linkId: [
          {
            required: true,
            message: "这是必选项",
            trigger: "change"
          }
        ],
        source: [
          { required: true, message: "请选择商品来源", trigger: "change" }
        ],

        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        supplier: [
          { required: true, message: "请输入供应商", trigger: "change" }
        ],
        displayArea: [
          { required: true, message: "请选择展示区域", trigger: "change" }
        ],
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入商品简介", trigger: "change" }
        ],
        costPrice: [
          { required: true, message: "请输入成本价", trigger: "change" }
        ],
        sort: [{ required: true, message: "请输商品权重", trigger: "blur" }],
        startTimeaddendTime: [
          {
            required: true,
            message: "请选择投放时间",
            trigger: "change"
          }
        ],

        auctionId: [
          { required: true, message: "请选择拍卖区域", trigger: "change" }
        ],
        displayPosition: [
          { required: true, message: "请选择终端", trigger: "change" }
        ]
      },
      downloadLoading: false,
      activeName: "first",
      // 广告位列表管理
      positionList: [],
      Props: {
        value: "categoryId",
        label: "name"
      },
      sortOption: [],
      ProductionPrice: {
        cascade: [],
        productName: ""
      },
      iwantyouvalue: "",
      putawayStatus: null,
      soldOutstatus: null,
      editoryourFlag: false,
      tiaoxuId: "",
      auctionAreaList: [], // 区域列表
      deleleOut: false,
      h5List: []
    };
  },
  created() {
    this.getList();
    this.getAuctionAreaList();
  },
  watch: {
    dialogFormVisible: function(newvalue, oldvalue) {
      this.dialogFormVisible = newvalue;
      if (!this.dialogFormVisible) {
        this.editoryourFlag = false;
      }
    }
  },
  methods: {
    checkPermission,
    // 获取区域列表
    getAuctionAreaList() {
      auctionAreaList().then(res => {
        if (res.code == 0) {
          this.auctionAreaList = res.data;
        } else {
          this.$message(res.msg);
        }
      });
    },
    checkboxChange(val) {
      debugger;
    },
    handleClick(e) {
      // debugger
      this.information.linkId = undefined;
      if (this.information.type !== "" && this.information.type != e) {
        this.showname = "";
        this.iwantyouvalue = "";
        this.information.linkId = "";
      }
    },
    //排序
    selectSort(val) {
      let sortType = val.order;
      if (sortType == "ascending") {
        this.sortNo = 1;
      } else if (sortType == "descending") {
        this.sortNo = 0;
      }
      this.getList();
    },
    //编辑内容
    editoryour(row) {
      // if (this.information.hasOwnProperty("startTimeaddendTime")) {
      //   this.information.startTimeaddendTime.length = 0;
      // } else {
      this.information.startTimeaddendTime = [];
      // }
	  console.log(row)
	  let arr=JSON.parse(row.zoneVoList)
	  let arr1=[]
	  for (let i = 0; i < arr.length; i++) {
	  	arr1.push(arr[i].imageUrl)
	  }
	  row.minImage=arr1
      if (row.validity === 1) {
        this.information.validity = 1;
      } else {
        this.information.validity = 2;
        this.information.startTimeaddendTime.push(row.startTime);
        this.information.startTimeaddendTime.push(row.endTime);
      }
      this.information.displayPosition = row.displayPosition.split(",");
      this.information.checkList = row.displayPosition.split(",");
      this.information.type = row.type;
      this.information.positionId = row.positionId;
      this.information.name = row.name;
      this.information.sign = row.sign;
      this.information.linkId = row.linkId;
      this.information.sort = row.sort;
      this.information.image = row.image;
      this.information.minImage = row.minImage;
      this.information.prompt = row.prompt;
	  this.information.zoneVoList = row.zoneVoList
      this.information.id = row.id;
      this.showname = row.linkId;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getH5List();
      this.editoryourFlag = true;
    },
    soldSure() {
      bannerchangeshoppping({
        id: this.soldOutstatus.id,
        status: 1
      }).then(res => {
        if (res.msg === "success") {
          this.$message("下架成功！");
          this.getList();
        } else {
          this.$message(res.msg);
        }
      });
      this.soldOut = !this.soldOut;
    },
    putawayfunc(row) {
      this.putawayStatus = row;
      this.putaway = !this.putaway;
    },
    //确认上架函数
    //下架函数
    outfunc(row) {
      this.soldOutstatus = row;
      this.soldOut = !this.soldOut;
    },
    putawaySure() {
      bannerchangeshoppping({
        id: this.putawayStatus.id,
        status: 0
      }).then(res => {
        if (res.msg === "success") {
          this.$message("上架成功！");
          this.getList();
        } else {
          this.$message(res.msg);
        }
      });
      this.putaway = !this.putaway;
    },

    //删除广告
    deleteAdver(row) {
      this.deleleOut = true;
      this.advId = row.id;
    },
    //确定删除广告
    deleleOutSure() {
      advDel({
        id: this.advId
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.deleleOut = false;
          this.getList();
        } else {
          this.$message(res.message);
        }
      });
    },
    Thesequencebutton(row) {
      this.debuggers.shoppingname = row.name;
      this.debuggers.weight = row.sort;
      this.tiaoxuId = row.id;
      this.Thesequence = true;
    },
    //调序
    sortSure() {
      if (this.Setweight === "") {
        console.error("This is a error");
      } else {
        this.list.some((item, index) => {
          if (item.goodsId == this.debuggers.id) {
            item.sort = Number(this.Setweight);
            return true;
          }
        });
        setsortdata({
          id: this.tiaoxuId,
          sort: this.Setweight
        }).then(res => {
          if (res.msg === "success") {
            location.reload();
          }
        });
        this.Setweight = "";
      }
      this.Thesequence = false;
    },
    callbackexamine(value) {
      this.examineshopping = false;
      this.examineshoppingvalue = null;
    },
    examine(row) {
      console.log(row)
	  row.minImage=JSON.parse(row.zoneVoList)
      this.examineshoppingvalue = row;
      this.examineshopping = !this.examineshopping;
    },
    iwantyou(value) {
      console.log(value);
      this.showname = value.goodsName;
      this.iwantyouvalue = value.auctionId;
      this.information.linkId = value.auctionId;
      this.dialogPvVisible = false;
      this.goodsDialog = false;
    },
    sure() {
      let Flag = null;
      let Basic = false;
      if (this.ProductionPrice.cascade.length === 0) {
        Flag = "";
      } else {
        if (this.ProductionPrice.cascade.length > 1) {
          Flag = this.ProductionPrice.cascade[0][0];
          for (let i = 0; i < this.ProductionPrice.cascade.length; i++) {
            this.ProductionPrice.cascade[i].some((item, index) => {
              if (item === Flag) {
                Basic = true;
                return true;
              } else {
                Basic = false;
                return true;
              }
            });
          }

          if (Basic) {
            let pop = false;
            this.options.some((item, index) => {
              if (item.value === Flag) {
                if (
                  item.children.length === this.ProductionPrice.cascade.length
                ) {
                  Flag = this.ProductionPrice.cascade[0][0];
                  return true;
                } else {
                  pop = true;
                  return true;
                }
              }
            });
            if (pop) {
              this.$message("商品分类只能选择一个");
              return;
            }
          } else {
            this.$message("商品分类只能选择一个");
            return;
          }
        } else {
          if (this.ProductionPrice.cascade[0].length > 1) {
            Flag = this.ProductionPrice.cascade[0][1];
          } else {
            Flag = this.ProductionPrice.cascade[0][0];
          }
        }
      }
    },
    selectShopping() {
      if (this.information.type == 2) {
        this.dialogPvVisible = true;
      } else {
        this.goodsDialog = true;
      }
    },
    closeDialog() {
      this.dialogPvVisible = false;
      this.goodsDialog = false;
    },
    ChangeTime(d) {
      var d = new Date(d);
      var startStartTime =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      return startStartTime;
    },
    createDatabanner() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.editoryourFlag) {
            if (this.information.startTimeaddendTime.length === 0) {
            } else {
              this.information.startTime = this.information.startTimeaddendTime[0];
              this.information.endTime = this.information.startTimeaddendTime[1];
            }
            if (this.information.type == 3) {
              this.information.linkId = this.information.linkId[
                this.information.linkId.length - 1
              ];
            }
            const displayPosition = this.information.checkList.join(",");
            this.information.displayPosition = displayPosition;
            let data = this.fliterfunc(this.information);
            if (data.hasOwnProperty("linkId")) {
              if (this.information.type == 2 || this.information.type == 8) {
                data.linkId = this.iwantyouvalue;
              } else {
                data.linkId = this.information.linkId;
              }
            }
            if (data.type == 6) {
              data.linkId = 6;
            }
            // 当type类型时需要传 h5id
            if (data.type == 1) {
              let h5Id = null;
              for (const item of this.h5List) {
                if (item.h5Url == data.linkId) {
                  h5Id = item.id;
                }
              }
              data.h5Id = h5Id;
            }
			if(data.minImage){
				let zoneVoList=[]
				let arr2=JSON.parse(data.zoneVoList)
				console.log(arr2)
				for (let i = 0; i < data.minImage.length; i++) {
					let obj = {}
					obj.bannerId=data.id
					arr2[i]?obj.id=arr2[i].id:''
					obj.location=(i+1)
					obj.imageUrl=data.minImage[i]
					zoneVoList.push(obj)
				}
				data.zoneVoList=JSON.stringify(zoneVoList)
			}
			console.log(data,data.minImage,data.zoneVoList)
			data.minImage=""
			// return
            advEdit(data).then(res => {
              if (res.code == "0") {
                this.$message("编辑成功！");
                this.getList();
                this.cancelLevel();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            if (this.information.startTimeaddendTime.length === 0) {
            } else {
              this.information.startTime = this.information.startTimeaddendTime[0];
              this.information.endTime = this.information.startTimeaddendTime[1];
            }
            const displayPosition = this.information.checkList.join(",");
            this.information.displayPosition = displayPosition;
            if (this.information.type == 3) {
              this.information.linkId = this.information.linkId[
                this.information.linkId.length - 1
              ];
            }
            let data = this.fliterfunc(this.information);
            if (data.hasOwnProperty("linkId")) {
              if (this.information.type == 2 || this.information.type == 8) {
                data.linkId = this.iwantyouvalue;
              } else {
                data.linkId = this.information.linkId;
              }
            }
            if (data.type == 6) {
              data.linkId = 6;
            }
            // 当type类型时需要传 h5id
            if (data.type == 1) {
              let h5Id = null;
              for (const item of this.h5List) {
                if (item.h5Url == data.linkId) {
                  h5Id = item.id;
                }
              }
              data.h5Id = h5Id;
            }
			console.log(data)
			if(data.minImage){
				let zoneVoList=[]
				for (let i = 0; i < data.minImage.length; i++) {
					let obj = {}
					obj.location=(i+1)
					obj.imageUrl=data.minImage[i]
					zoneVoList.push(obj)
				}
				data.zoneVoList=JSON.stringify(zoneVoList)
			}
			data.minImage=""
			console.log(data)
            banneradd(data).then(res => {
              if (res.code == "000") {
                //去回显操作
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.getList();
                this.cancelLevel();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //添加
    addfunc() {
      for (var key in this.information) {
        if (key === "startTimeaddendTime") {
          this.information[key] = [];
        } else {
          this.information[key] = "";
        }
      }
      this.information.checkList = [];
      if (this.statusarr.length > 0) {
        this.statusarr = [];
      }
      if (this.statusarr.length === 0) {
        positionList().then(response => {
          for (let i = 0; i < response.data.records.length; i++) {
            this.statusarr.push({
              key: response.data.records[i].id,
              display_name: response.data.records[i].name
            });
          }
        });
      }
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getH5List(); // 获取h5列表
    },
    getList() {
      this.listLoading = true;
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : "";
      let Obj = this.fliterfunc(this.searchbanner);
      bannerlist({
        current: this.listQuery.page,
        sortNo: this.sortNo,
        size: this.listQuery.limit,
        ...Obj
      }).then(response => {
        this.list = [];
        this.list = response.data.records;
        this.total = Number(response.data.total);
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
      //广告位列表
      fetchListbanner({
        current: this.listQuery.page,
        size: this.listQuery.limit
      }).then(response => {
        this.statusarr = [];
        for (let i = 0; i < response.data.records.length; i++) {
          this.statusarr.push({
            key: response.data.records[i].id,

            display_name: response.data.records[i].name
          });
        }
      });
      treeApi({ type: 1 }).then(res => {
        this.category = res.data;
      });
    },
    //拦截方法
    fliterfunc(Obj) {
      for (let key in Obj) {
        if (Obj[key]) {
          if (Object.prototype.toString.call(Obj[key]) == "[object String]") {
            if (Obj[key].indexOf("NaN") != -1) {
              delete Obj[key];
            } else {
              Obj[key] = Obj[key];
            }
          } else {
            Obj[key] = Obj[key];
          }
        } else {
          delete Obj[key];
        }
      }
      return Obj;
    },
    handleFilter() {
      if (this.listQuery.name == "") {
        this.listQuery.name = undefined;
      } else if (this.listQuery.status == "") {
        this.listQuery.status = undefined;
      }
      this.listQuery.page = 1;
      let Obj = this.fliterfunc(this.searchbanner);
      bannerlist(Obj).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    reset() {
      for (let key in this.searchbanner) {
        this.searchbanner[key] = "";
      }
      this.information.positionId = undefined;
      this.information.type = undefined;
      this.information.name = "";
      this.getList();
    },
    getFile(file, fileList, key) {
      let formDate = new FormData();
      formDate.append("multipartFileList", file.raw);
      uploadImgFile(formDate).then(resp => {
        if (resp.code == 0) {
			if(key=='minImage'){
				console.log(key,this.information)
				this.information[key]?'':this.information[key]=[]
				this.information[key].push(resp.data[0]);
			}else{
				this.information[key] = resp.data[0];
			} 
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          });
        }
      });
    },
    // 添加修改时请求h5地址链接
    getH5List() {
      h5ManageGetAllList().then(res => {
        if (res.code == 0) {
          this.h5List = res.data;
        }
      });
    },
    // 新增h5路由跳转
    addH5() {
      this.dialogFormVisible = false;
      this.$router.push({ path: "/rule/hFiveAddEdit", query: { type: "add" } });
    },
    //  关闭等级弹框
    cancelLevel() {
      this.$refs["dataForm"].resetFields();
      this.dialogFormVisible = false;
      for (var key in this.information) {
        if (key === "startTimeaddendTime") {
          this.information[key] = [];
        } else {
          this.information[key] = "";
        }
      }
      this.information.checkList = [];
    }
  }
};
</script>
<style>
.putawayClass {
  text-align: center;
  width: 100%;
}
.Flex {
  display: flex;
  justify-content: space-around;
}
.el-form-item__content {
  font-size: 22px;
}
.addStyle {
  color: #0071f8;
  cursor: pointer;
}
</style>
