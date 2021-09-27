<template>
  <div class="container">
    <div class="addFlex">
      <div>
        <el-button
          type="primary"
          @click="addSellingRecord"
        >新增拼赚</el-button>
      </div>
      <div class="ax_200">
        <el-input v-model="ProductionPrice.productName" style="width:140px" placeholder="请输入商品名称"></el-input>
      </div>
	  <el-select
	    v-model="ProductionPrice.status"
	    placeholder="商品状态"
	    clearable
	    class="filter-item"
	    style="width: 130px"
	  >
	    <el-option label="上架" value="0"/>
	    <el-option label="下架" value="1"/>
	    <!-- <el-option label="拼赚失败" value="7"/> -->
	  </el-select>
   <div class="ax_200 right">
        <el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchTitle">搜索</el-button>
        <el-button style="height:40px" @click="reset">重置</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      max-height="600"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" width="260">
        <template slot-scope="scope">
          <div class="goodsInfo_wrap">
            <div class="goodsImg_wrap">
              <img class="goods_image" :src="scope.row.logo" />
            </div>
            <div class="goods_right">
              <span class="goods_name">{{ scope.row.goodsName }}</span>
              <span>{{ scope.row.goodsId }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
	  <el-table-column label="竞拍起拍价" align="center">
	    <template slot-scope="scope">{{ scope.row.startPrice }}</template>
	  </el-table-column>
      <el-table-column label="拼赚市场价" align="center">
        <template slot-scope="scope">{{ scope.row.marketPrice }}</template>
      </el-table-column>
	  <el-table-column label="拼赚价" align="center">
	    <template slot-scope="scope">{{ scope.row.spellMakePrice }}</template>
	  </el-table-column>
      <el-table-column label="拼赚最低保护价" align="center">
        <template slot-scope="scope">{{ scope.row.minimumPrice }}</template>
      </el-table-column>
      <el-table-column label="拼赚所需人数" align="center">
        <template slot-scope="scope">{{ scope.row.requiredNumber }}</template>
      </el-table-column>
	  <el-table-column label="拼赚时限" align="center">
	    <template slot-scope="scope">{{ scope.row.timeLimit }}</template>
	  </el-table-column>
	  <el-table-column label="拼赚开拍时限" align="center">
	    <template slot-scope="scope">{{ scope.row.actionTimeLimit }}</template>
	  </el-table-column>
	  <el-table-column label="预估总增值" align="center">
	    <template slot-scope="scope">{{ scope.row.valueAdded }}</template>
	  </el-table-column>
      <el-table-column label="拼赚商品每日数量" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.dailyNumber}}</template>
      </el-table-column>
      <el-table-column label="拼赚商品每日补量" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.goodsNumber}}</template>
      </el-table-column>
	  <el-table-column label="竞拍最低保护价" width="100" align="center">
	    <template slot-scope="scope">{{ scope.row.protectPrice}}</template>
	  </el-table-column>
	  <el-table-column label="竞拍最高保护价" width="100" align="center">
	    <template slot-scope="scope">{{ scope.row.maxProtectPrice}}</template>
	  </el-table-column>
	  <el-table-column label="加价幅度" width="100" align="center">
	    <template slot-scope="scope">{{ scope.row.markupPrice}}</template>
	  </el-table-column>
	  <el-table-column label="佣金" width="100" align="center">
	    <template slot-scope="scope">{{ scope.row.brokerage}}</template>
	  </el-table-column>
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          <div v-if="0 === scope.row.status">上架</div>
          <div v-if="1 === scope.row.status">下架</div>
        </template>
      </el-table-column>
      <el-table-column label="拼赚规则(所需虚拟币)" align="center">
         <template slot-scope="scope">{{ scope.row.theRules}}</template>
      </el-table-column>
	  <el-table-column label="权重" align="center">
	     <template slot-scope="scope">{{ scope.row.sort}}</template>
	  </el-table-column>
      <el-table-column label="机器人" align="center">
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.openRobot == 0 ? 'warning' : ''"
          >{{ scope.row.openRobot == 0 ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="text" size="mini" @click="CheckFile(row)">查看详情</el-button> -->
		  <el-button
		    type="text"
		    v-if="row.status == 1"
		    size="mini"
		    @click="deleteSpell(row.id)"
		  >删除</el-button>
		  <el-button type="text"  @click="updataStatus(row.id,row)" v-if="1 === row.status">商品上架</el-button>
		  <el-button type="text"  @click="updataStatus(row.id,row)" v-if="0 === row.status">商品下架</el-button>
          <el-button
            type="text"
            v-if="row.status == 1"
            size="mini"
            @click="editProPrice(row)"
          >修改</el-button>
          <el-button
            type="text"
            v-if="row.status == 0"
            size="mini"
            @click="robotForbidden(row.id,row)"
          >{{ row.openRobot == 0 ? '机器人启用' : '机器人禁用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增拼赚 -->
    <el-dialog title="新增拼赚" :visible.sync="dialogFormVisible">
      <el-form
        ref="sellingRecord"
        :rules="rules"
        :model="sellingRecordDate"
        label-position="left"
        label-width="15%"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="选择商品" prop="goodsId">
          <el-input v-model="sellingRecordDate.goodsName" @focus="selectShopping" />
        </el-form-item>
		<el-form-item label="起拍价" prop="startPrice">
		  <el-input
		    v-model="sellingRecordDate.startPrice"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
        <el-form-item label="拼赚市场价" prop="marketPrice">
          <el-input
            v-model="sellingRecordDate.marketPrice"
            maxlength="12"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
		<el-form-item label="拼赚价" prop="spellMakePrice">
		  <el-input
		    v-model="sellingRecordDate.spellMakePrice"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="拼赚最低保护价" prop="minimumPrice">
		  <el-input
		    v-model="sellingRecordDate.minimumPrice"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="拼赚所需人数" prop="requiredNumber">
		  <el-input
		    v-model="sellingRecordDate.requiredNumber"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="拼赚时限(天)" prop="timeLimit">
		  <el-input
		    v-model="sellingRecordDate.timeLimit"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="拼赚开拍时限(天)" prop="actionTimeLimit">
		  <el-input
		    v-model="sellingRecordDate.actionTimeLimit"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="预估最低总增值" prop="valueAddedMin">
		  <el-input
		    v-model="sellingRecordDate.valueAddedMin"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="预估最高总增值" prop="valueAddedMax">
		  <el-input
		    v-model="sellingRecordDate.valueAddedMax"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="商品每日数量" prop="dailyNumber">
		  <el-input
		    v-model="sellingRecordDate.dailyNumber"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="商品每日补量" prop="goodsNumber">
		  <el-input
		    v-model="sellingRecordDate.goodsNumber"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="所需虚拟币" prop="theRules">
		  <el-input
		    v-model="sellingRecordDate.theRules"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
		<el-form-item label="上架状态" class="is-required">
		  <el-radio-group v-model="sellingRecordDate.status">
			<el-radio label="1" value="1">下架</el-radio>
		    <el-radio label="0" value="0">上架</el-radio>
		  </el-radio-group>
		</el-form-item>
        <el-form-item label="机器人" class="is-required">
          <el-radio-group v-model="sellingRecordDate.openRobot">
            <el-radio label="1" value="1">开启</el-radio>
            <el-radio label="0" value="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
		<el-form-item
		  label="最低保护价"
		  v-if="sellingRecordDate.openRobot == 1"
		  :prop="sellingRecordDate.openRobot == 1 ? 'startProtectPrice':''"
		>
		  <div style="display:flex;">
		    <el-input
		      v-model="sellingRecordDate.startProtectPrice"
		      maxlength="12"
		      oninput="value=value.replace(/[^\d]/g,'')"
		    /><span style="margin:0 5px;">-</span><el-input
		      v-model="sellingRecordDate.endProtectPrice"
		      maxlength="12"
		      oninput="value=value.replace(/[^\d]/g,'')"
		    />
		  </div>
		</el-form-item>
		<el-form-item
		  label="最高保护价"
		  v-if="sellingRecordDate.openRobot == 1"
		  :prop="sellingRecordDate.openRobot == 1 ?'startMaxProtectPrice':''"
		>
		<div style="display:flex;">
		  <el-input
		    v-model="sellingRecordDate.startMaxProtectPrice"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d]/g,'')"
		  /><span style="margin:0 5px;">-</span><el-input
		    v-model="sellingRecordDate.endMaxProtectPrice"
		    maxlength="12"
		    oninput="value=value.replace(/[^\d]/g,'')"
		  />
		</div>
		</el-form-item>
        <el-form-item label="加价幅度" prop="markupPrice">
          <el-input
            v-model="sellingRecordDate.markupPrice"
            maxlength="7"
          />
        </el-form-item>
        <el-form-item label="佣金" class="is-required">
          <el-input v-if="sellingRecordDate.markupPrice>=0" :value="sellingRecordDate.markupPrice*0.1" oninput="value=value.replace(/[^\d.]/g,'')" :disabled="true" />
          <el-input v-if="sellingRecordDate.markupPrice<0" :value="-sellingRecordDate.markupPrice*0.1" oninput="value=value.replace(/[^\d.]/g,'')" :disabled="true" />
        </el-form-item>
       <el-form-item label="权重" prop="sort">
          <el-input v-model="sellingRecordDate.sort" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :disabled="submitClick" @click="addSellingUpdate()">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="selectSellingGoods" title="选择商品" width="60%">
      <spellGoods @callback="iwantyou"></spellGoods>
    </el-dialog>

    <!-- 修改保护价弹窗 -->
    <el-dialog title="修改保护价" :visible.sync="editSellingDia">
      <el-form
        ref="sellingRecord"
        :model="editSelling"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="商品名称">
          <span>{{ editSelling.goodsName }}</span>
        </el-form-item>
        <el-form-item label="市场价" prop="marketPrice">
          <el-input v-model="editSelling.marketPrice" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
		<el-form-item label="拼赚价" prop="spellMakePrice">
		  <el-input v-model="editSelling.spellMakePrice" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚最低保护价" prop="minimumPrice">
		  <el-input v-model="editSelling.minimumPrice" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚所需人数" prop="requiredNumber">
		  <el-input v-model="editSelling.requiredNumber" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚时限" prop="timeLimit">
		  <el-input v-model="editSelling.timeLimit" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚开拍时限" prop="actionTimeLimit">
		  <el-input v-model="editSelling.actionTimeLimit" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="预估最低总增值" prop="valueAddedMin">
		  <el-input v-model="editSelling.valueAddedMin" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="预估最高总增值" prop="valueAddedMax">
		  <el-input v-model="editSelling.valueAddedMax" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚商品每日数量" prop="dailyNumber">
		  <el-input v-model="editSelling.dailyNumber" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚商品每日补量" prop="goodsNumber">
		  <el-input v-model="editSelling.goodsNumber" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="拼赚规则(所需虚拟币)" prop="theRules">
		  <el-input v-model="editSelling.theRules" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="竞拍起拍价" prop="startPrice" v-if="editPriceUprobot == false">
		  <el-input v-model="editSelling.startPrice"  @input="onInput()"/>
		</el-form-item>
		<el-form-item label="竞拍最低保护价" prop="protectPrice">
		  <el-input v-model="editSelling.protectPrice" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
		<el-form-item label="竞拍最高保护价" prop="maxProtectPrice">
		  <el-input v-model="editSelling.maxProtectPrice" @input="onInput()" oninput="value=value.replace(/[^\d.]/g,'')" />
		</el-form-item>
        <el-form-item label="加价幅度" prop="markupPrice" v-if="editPriceUprobot == false">
          <el-input v-model="editSelling.markupPrice" @input="onInput()" />
        </el-form-item>
        <el-form-item label="佣金" prop="markupPrice" v-if="editPriceUprobot == false">
          <span v-if="editSelling.markupPrice>=0">{{ editSelling.markupPrice * 0.05 }}</span>
          <span v-if="editSelling.markupPrice<0">{{ -editSelling.markupPrice * 0.05 }}</span>
        </el-form-item>
		<el-form-item label="权重" prop="sort">
		   <el-input v-model="editSelling.sort" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
		 </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSellingDia = false">取消</el-button>
        <el-button type="primary" @click="editSellingUpdata()">提交</el-button>
      </div>
    </el-dialog>
    <pagination
	  text1="批量上架"
	  text2="批量下架"
      v-on:callBackUp="bathChangeGoodStatusUp"
      v-on:callBackDown="bathChangeGoodStatusDown"
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.current"
      @pagination="getList"
    />
  </div>
</template>

<script>
//tablelist中需要改接口
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
import { fetchList } from "@/api/userInfo.js";
import spellGoods from "@/components/spellGoods/goodsChoice";
import selectDay from "@/components/selectDay/index";
import selectTime from "@/components/selectTime/index";
import {
  auctionRecordInfoList,
  treeApi,
  robotForbidden,
  addsellingrecord,
  sellingRecordClose,
  editProtectPrice,
  getVipRoomUser,
  getSystemTime,
  batchAddsellingrecord,
  bathCloseSellingApi,
  bathCloseRobotApi,
  sellingAreaList,
  refreshAuction
} from "@/api/AuctionsRecord.js";
import {
  spellMakeDelete,
  spellMakeInfo,
  spellMakeList,
  spellMakeUpdata,
  spellMakeSave,
  spellMakeRobot,
  spellMakeStatus,
  changeGoodStatus
} from "@/api/spellRecord.js";
import checkPermission from "@/utils/permission";
const displayArea = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 1,
    label: "默认区"
  },
  {
    value: 2,
    label: "新人"
  },
  {
    value: 3,
    label: "VIP"
  }
];
const shoppingStatus = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 2,
    label: "预展"
  },
  {
    value: 3,
    label: "竞拍中"
  },
  {
    value: 4,
    label: "已售"
  },
  {
    value: 5,
    label: "已流拍"
  },
  {
    value: 7,
    label: "已关闭"
  }
];
//请求积分赠送类型
const integralTypeList = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "0",
    label: "无积分"
  },
  {
    value: "1",
    label: "全额积分"
  },
  {
    value: "2",
    label: "超值"
  }
];
export default {
  name: "spellRecord",
  components: {
    Pagination,
    spellGoods,
    selectDay,
    selectTime
  },
  data() {
    return {
      //
      Setweight: "",
      list: null,
      listLoading: true,
      props: {
        multiple: true
      },
      displayArea,
      shoppingStatus,
      //----
      total: 1,
      listQuery: {
        current: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      //
      dialogFormVisible: false,
      soldOut: false,
      ProductionPrice: {
        start: "",
        end: "",
		mallNumber:"",
        productName: "",
        goodsStatus: undefined,
        integralTypeId: undefined,
        integralType: undefined
      },
      options: [],
      classifyvalue1: "",
      //商品分类
      test: [],
      classifyvalue2: "",
      //新增拍卖
      sellingRecordDate: {
        goodsId: undefined,
        startPrice: undefined,
        protectPrice: undefined,
        maxProtectPrice: undefined,
        markupPrice: undefined,
        marketPrice: undefined,
		spellMakePrice:undefined,
		minimumPrice:undefined,
		requiredNumber:undefined,
		timeLimit:undefined,
		actionTimeLimit:undefined,
		valueAddedMin:undefined,
		valueAddedMax:undefined,
		dailyNumber:undefined,
		goodsNumber:undefined,
		theRules:undefined,
        limitPrice: undefined,
        sort: 1,
        status: "1",
        openRobot: "1",
		openLimitPrice:'0',
        robotNum:30
      },
      selectSellingGoods: false,
      rules: {
        goodsId: [
          { required: true, message: "商品不能为空", trigger: "change" }
        ],
        startPrice: [
          { required: true, message: "起拍价不能为空", trigger: "change" }
        ],
		spellMakePrice: [
		  { required: true, message: "拼赚价不能为空", trigger: "change" }
		],
		requiredNumber: [
		  { required: true, message: "拼赚所需人数不能为空", trigger: "change" }
		],
		timeLimit: [
		  { required: true, message: "拼赚时限不能为空", trigger: "change" }
		],
		actionTimeLimit: [
		  { required: true, message: "拼赚开拍时限不能为空", trigger: "change" }
		],
		valueAddedMin: [
		  { required: true, message: "预估最低总增值不能为空", trigger: "change" }
		],
		valueAddedMax: [
		  { required: true, message: "预估最高总增值不能为空", trigger: "change" }
		],
		dailyNumber: [
		  { required: true, message: "拼赚商品每日数量不能为空", trigger: "change" }
		],
		goodsNumber: [
		  { required: true, message: "拼赚商品每日补量不能为空", trigger: "change" }
		],
		theRules: [
		  { required: true, message: "拼赚规则不能为空", trigger: "change" }
		],
		minimumPrice: [
		  { required: true, message: "拼赚最低保护价不能为空", trigger: "change" }
		],
        protectPrice: [
          { required: true, message: "最低保护价最小值不能为空", trigger: "change" }
        ],
        maxProtectPrice: [
          { required: true, message: "最低保护价最大值不能为空", trigger: "change" }
        ],
		startProtectPrice: [
		  { required: true, message: "最低保护价最小值不能为空", trigger: "change" }
		],
		// endProtectPrice
		endProtectPrice: [
		  { required: true, message: "最低保护价最大值不能为空", trigger: "change" }
		],
		startMaxProtectPrice: [
		  { required: true, message: "最高保护价最小值不能为空", trigger: "change" }
		],
		endMaxProtectPrice: [
		  { required: true, message: "最高保护价最大值不能为空", trigger: "change" }
		],
        markupPrice: [
          { required: true, message: "加价幅度不能为空", trigger: "change" }
        ],
        marketPrice: [
          { required: true, message: "市场价不能为空", trigger: "change" }
        ],
        sort: [{ required: true, message: "权重不能为空", trigger: "change" }],
        // robotNum
        robotNum: [
          { required: true, message: "机器人个数不能为空", trigger: "change" },
          {min:1,max:100, message: "只能输入正整数，大于等于2，最多2位数", trigger: "change"}
        ],
      },
      //修改保护价
      editSellingDia: false,
      editSelling: {
        goodsName: undefined,
        markupPrice: undefined,
        marketPrice: undefined,
		status: "1",
		openRobot: "1",
      },
      // 暂存临时最低保护价，最高保护价
      lowPrice: "",
      highPrice: "",
      // 批量上架的日期和时间的回调
      callBackSelectDay: [],
      callBackSelectTime: [],
      // 批量关闭操作列表
      handleSelection: [],
      // 请求商品展示区域列表
      // 修改保护价并开启机器人
      editPriceUprobot: false,
      // 添加拍卖防重点击
      submitClick: false
    };
  },
  created() {
    this.getTreeApiList();
    this.getList();
    // 获取系统参数
    this.getSystemnum();
  },
  methods: {
    checkPermission,
    getSystemnum() {
      getSystemTime({ configKey: "auction_continued_time" }).then(res => {
        if (res.code == 0) {
          console.log(res, "系统时间");
          this.systemTime = res.data;
        }
      });
    },
	onInput(){
	     this.$forceUpdate();
	},
    soldoutl(row) {
      this.$router.push({
        path: "/orderManagement/orderList/detail",
        query: {
          auctionId: row.auctionId
        }
      });
    },
    //下架
    handleChange(value) {
      console.log("Hello,World");
    },
    CheckFile(row) {
      this.$router.push({
        path: "sellingRecordDetail",
        query: row
      });
    },
    soldout(row) {
      this.soldOut = true;
    },
    //调序

    Thesequence(row) {
      this.dialogFormVisible = true;
    },
    getList() {
      this.listLoading = true;
	  let displayAreaStr=""
	  this.ProductionPrice.displayArea?displayAreaStr=this.ProductionPrice.displayArea.join(","):""
      let Obj = this.fliterfunc({
        size: this.listQuery.limit,
        current: this.listQuery.current,
        status: this.ProductionPrice.status,
        goodsName: this.ProductionPrice.productName,
        displayArea: displayAreaStr,
        integralType: this.ProductionPrice.integralType,
      });
      spellMakeList({
        ...Obj,
        timeSort: this.zhengxu === "点击倒序" ? 1 : 2
      }).then(res => {
        if (res.code == 0) {
          let listData = res.data.records;
          listData.map((item, index) => {
            item.lowPrice = false;
            item.highPrice = false;
            item.index = index;
          });
          this.list = JSON.parse(JSON.stringify(listData));
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getTreeApiList() {
      treeApi().then(res => {
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
              label: res.data[i].name
            });
          }
        }
        this.options = this.test;
      });
    },
    //问题出现的点，无线递归
    Tosortoutthetree(json, arr) {
      for (var i = 0; i < json.length; i++) {
        var sonList = json[i].subCategorys;
        if (sonList.length == 0) {
          arr.push({
            value: json[i].categoryId,
            label: json[i].name,
            children: []
          });
        } else {
          arr.push({
            value: json[i].categoryId,
            label: json[i].name,
            children: []
          });
          this.Tosortoutthetree(sonList, arr[i].children);
        }
      }
      return arr;
    },
    // 搜索页面置一
    searchTitle() {
      this.listQuery.current = 1;
      this.search();
    },
    search() {
      this.listLoading = true;
      let Flag = null;
      let Basic = false;
      let Obj = this.fliterfunc({
        categoryId: Flag,
        size: this.listQuery.limit,
        current: this.listQuery.current,
        status: this.ProductionPrice.status,
        goodsName: this.ProductionPrice.productName,
        goodsId: this.ProductionPrice.goodsId,
        integralType: this.ProductionPrice.integralType,
      });
      spellMakeList(Obj).then(res => {
        if (res.code == 0) {
          let listData = res.data.records;
          listData.map((item, index) => {
            item.lowPrice = false;
            item.highPrice = false;
            item.index = index;
          });
          this.list = listData;
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message(res.msg + "请输入有效值！");
        }
      });
    },
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
    //时间转换方法
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
    reset() {
      for (var key in this.ProductionPrice) {
        if (key == "cascade") {
          this.ProductionPrice[key] = "";
        } else {
          this.ProductionPrice[key] = null;
        }
      }
      this.getList();
    },
    // 禁用启用机器人 新增
    robotForbidden(id, rows) {
      this.$confirm("请确认是否继续对机器人操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let dataobg = {
          id: id,
          status: rows.openRobot == 0 ? 1 : 0
        };
        spellMakeRobot(dataobg).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      });
    },
	// 商品上下架
	updataStatus(id, rows) {
	  this.$confirm("请确认是否继续对商品操作?", "提示", {
	    confirmButtonText: "确定",
	    cancelButtonText: "取消",
	    type: "warning"
	  }).then(() => {
	    let dataobg = {
	      id: id,
	      status: rows.status == 0 ? 1 : 0
	    };
	    spellMakeStatus(dataobg).then(res => {
	      if (res.code == 0) {
	        this.$message({
	          message: "操作成功",
	          type: "success"
	        });
	        this.getList();
	      } else {
	        this.$message({
	          message: res.msg,
	          type: "error"
	        });
	      }
	    });
	  });
	},
	// 商品删除
	deleteSpell(id) {
	  this.$confirm("请确认是否继续对商品操作?", "提示", {
	    confirmButtonText: "确定",
	    cancelButtonText: "取消",
	    type: "warning"
	  }).then(() => {
	    let dataobg = {
	      id: id
	    };
	    spellMakeDelete(dataobg).then(res => {
	      if (res.code == 0) {
	        this.$message({
	          message: "操作成功",
	          type: "success"
	        });
	        this.getList();
	      } else {
	        this.$message({
	          message: res.msg,
	          type: "error"
	        });
	      }
	    });
	  });
	},
    resetTemp() {
      this.sellingRecordDate = {
        goodsId: undefined,
        startPrice: undefined,
        protectPrice: undefined,
        maxProtectPrice: undefined,
        markupPrice: undefined,
		spellMakePrice:undefined,
		minimumPrice:undefined,
		requiredNumber:undefined,
		timeLimit:undefined,
		actionTimeLimit:undefined,
		valueAddedMin:undefined,
		valueAddedMax:undefined,
		dailyNumber:undefined,
		goodsNumber:undefined,
		theRules:undefined,
        marketPrice: undefined,
        limitPrice:undefined,
        sort: 1,
        openRobot: "1",
        status: "1",
		openLimitPrice:'0',
        robotNum:30,
      };
    },
    //addSellingRecord
    addSellingRecord() {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["sellingRecord"].clearValidate();
      });
    },
    // 新增拍卖和批量新增拍卖
    addSellingUpdate() {
      this.$refs["sellingRecord"].validate(valid => {
        if (valid) {
		  console.log(this.sellingRecordDate)
          this.submitClick = true;
          setTimeout(() => {
            this.submitClick = false;
          }, 3000);
		  this.sellingRecordDate.markupPrice>=0?this.sellingRecordDate.brokerage=this.sellingRecordDate.markupPrice*0.05:this.sellingRecordDate.brokerage=-this.sellingRecordDate.markupPrice*0.05
		  
          const tempData = Object.assign({}, this.sellingRecordDate);
		  console.log(tempData)
		  // return
          spellMakeSave(tempData).then(res => {
            if (res.code == 0) {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "error",
                message: res.msg,
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    selectShopping() {
      this.selectSellingGoods = true;
    },
    iwantyou(value) {
      console.log(value, "value");
      this.sellingRecordDate.goodsId = value.goodsId;
      this.sellingRecordDate.goodsName = value.goodsName;
      this.sellingRecordDate.marketPrice = value.marketPrice;
      this.sellingRecordDate.startPrice = value.costPrice;
      this.sellingRecordDate.limitPrice = value.limitPrice;
      this.sellingRecordDate.isLimitPrice = value.isLimitPrice
      this.sellingRecordDate.openLimitPrice = value.isLimitPrice
      this.selectSellingGoods = false;
    },
    closeSelling(row) {
      this.$confirm("此操作将关闭拍卖, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        sellingRecordClose({ auctionId: row.auctionId }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.search();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      });
    },
    editProPrice(rows) {
      let row = JSON.parse(JSON.stringify(rows));
	  console.log(row,'row')
      this.editSelling.id = row.id;
      this.editSelling.goodsName = row.goodsName;
      this.editSelling.marketPrice = Number(row.marketPrice);
      this.editSelling.spellMakePrice = row.spellMakePrice;
      this.editSelling.minimumPrice = row.minimumPrice;
      this.editSelling.requiredNumber = row.requiredNumber;
      this.editSelling.timeLimit = row.timeLimit;
      this.editSelling.actionTimeLimit = row.actionTimeLimit;
      this.editSelling.minimumPrice = row.minimumPrice;
      this.editSelling.valueAddedMin = Number(row.valueAdded.split('~')[0])
      this.editSelling.valueAddedMax = Number(row.valueAdded.split('~')[1])
      this.editSelling.dailyNumber = row.dailyNumber
      this.editSelling.goodsNumber = row.goodsNumber
      this.editSelling.theRules = row.theRules
      this.editSelling.status = row.status
      this.editSelling.startPrice = row.startPrice
      this.editSelling.protectPrice = row.protectPrice
      this.editSelling.maxProtectPrice = row.maxProtectPrice
      this.editSelling.markupPrice = row.markupPrice
      this.editSelling.brokerage = row.brokerage
      this.editSelling.openRobot = row.openRobot
	  console.log(this.editSelling)
      this.editPriceUprobot = false;
      this.editSellingDia = true;
    },
    editSellingUpdata() {
      console.log(
        this.editSelling.markupPrice,
        this.editSelling.startPrice,
        "this.editSelling.startPrice"
      );
	  this.editSelling.markupPrice>=0?this.editSelling.brokerage=this.editSelling.markupPrice*0.05:this.editSelling.brokerage=-this.editSelling.markupPrice*0.05
	  // this.editSelling.brokerage = this.editSelling.markupPrice *0.05;
	  console.log(this.editSelling)
	  // return
      spellMakeUpdata(this.editSelling).then(res => {
        if (res.code == 0) {
		  this.editSellingDia=false
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.search();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    ChangeShow(data) {
      var d = new Date(data);
      var datetime =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) +
        " " +
        (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +
        ":" +
        (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
        ":" +
        (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
      // var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
      // 	':' + d.getSeconds();
      return datetime;
    },
    //截拍时间
    Gm(vm) {
      // 1秒 == 1000毫秒
      // 1小时 == 60分钟 60秒 3600000
      if (
        new Date(vm).getTime() -
          new Date(this.sellingRecordDate.startTime).getTime() >=
          0 &&
        new Date(vm).getTime() -
          new Date(this.sellingRecordDate.startTime).getTime() <=
          3600000
      ) {
        this.$message("选择成功！");
        console.log(vm, this.ChangeShow(vm), "21212");
        this.sellingRecordDate.endTime = this.ChangeShow(vm);
      } else {
        this.$message("请先选择开拍时间且截拍时间距开拍时间不能超过一小时！");
        this.sellingRecordDate.endTime = "";
      }
    },
    Vm(vm) {
      // console.log(vm, "7777");
      if (vm < this.CurrentTime) {
        this.$message("选中时间要大于当前时间！");
        this.sellingRecordDate.startTime = "";
      } else {
        // this.$message('请重新选择时间！');
        let Data = new Date(vm).getTime() + this.systemTime * 60 * 1000;
        var d = new Date(Data);
        this.sellingRecordDate.endTime = this.ChangeShow(d);
        this.JiePaiTimeTrueFalse = false;
      }
    },
    // 修改最低保护价
    changeLowPrice(row) {
      this.list.map((item, index) => {
        if (index == row.index) {
          this.lowPrice = this.list[index].protectPrice;
          this.list[index].lowPrice = true;
        } else if (item.lowPrice == true) {
          item.protectPrice = this.lowPrice;
          item.lowPrice = false;
        }
      });
    },
    // 修改最高保护价
    changehighPrice(row) {
      this.list.map((item, index) => {
        if (index == row.index) {
          this.highPrice = this.list[index].maxProtectPrice;
          this.list[index].highPrice = true;
        } else if (item.highPrice == true) {
          item.maxProtectPrice = this.highPrice;
          item.highPrice = false;
        }
      });
    },
    // 确认修改
    cancelEdit(row, index) {
      if (index == 1) {
        if (row.protectPrice > row.maxProtectPrice) {
          this.$message.error("最低保护价应小于最高保护价");
          return;
        } else {
          row.lowPrice = false;
        }
      } else {
        if (row.protectPrice > row.maxProtectPrice) {
          this.$message.error("最高保护价应大于最低保护价");
          return;
        } else {
          row.highPrice = false;
        }
      }
      let obj = {
        protectPrice: row.protectPrice,
        maxProtectPrice: row.maxProtectPrice,
        auctionId: row.auctionId,
        markupPrice: row.markupPrice,
        marketPrice: row.marketPrice,
        startPrice: row.startPrice
      };
      editProtectPrice(obj).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getList();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
          this.getList();
        }
      });
    },
    // 取消修改保护价
    cancelEditClose(row, index) {
      if (index == 1) {
        row.lowPrice = false;
        row.protectPrice = this.lowPrice;
      } else {
        row.highPrice = false;
        row.maxProtectPrice = this.highPrice;
      }
    },
    // 日期回调数据
    selectDate(data) {
      this.callBackSelectDay = data;
      console.log(data, "日期");
    },
    // 时间回调
    selectTime(data) {
      this.callBackSelectTime = data;
      console.log(data, "时间");
    },
    // 多选操作
    handleSelectionChange(e) {
      this.handleSelection = e;
    },
	//批量上下架
	bathChangeGoodStatusUp(){
		// changeGoodStatus
		
		  if (this.handleSelection.length <= 0) {
		    this.$message.error("请选择批量操作的数据");
		    return;
		  }
		  this.$confirm("是否批量上架?", "提示", {
		    confirmButtonText: "确定",
		    cancelButtonText: "取消",
		    type: "warning"
		  }).then(() => {
		    if (this.handleSelection.length <= 0) {
		      this.$message.error("请选择批量操作的数据");
		    } else {
		      let arr = [];
		      this.handleSelection.map(item => {
		          arr.push(item.id);
		      });
			  console.log(arr)
			  // return
		      if (arr.length <= 0) {
		        this.$message.error("没有可操作的数据");
		      } else {
		        arr = arr.join(",");
		        changeGoodStatus({ ids: arr,status:0 }).then(res => {
		          if (res.code == 0) {
		            this.$message({
		              message: "操作成功",
		              type: "success"
		            });
		            this.getList();
		          } else {
		            this.$message.error(res.msg);
		          }
		        });
		      }
		    }
		  });
		
	},
	bathChangeGoodStatusDown(){
		
			// changeGoodStatus
			
			  if (this.handleSelection.length <= 0) {
			    this.$message.error("请选择批量操作的数据");
			    return;
			  }
			  this.$confirm("是否批量下架?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning"
			  }).then(() => {
			    if (this.handleSelection.length <= 0) {
			      this.$message.error("请选择批量操作的数据");
			    } else {
			      let arr = [];
			      this.handleSelection.map(item => {
			          arr.push(item.id);
			      });
				  console.log(arr)
				  // return
			      if (arr.length <= 0) {
			        this.$message.error("没有可操作的数据");
			      } else {
			        arr = arr.join(",");
			        changeGoodStatus({ ids: arr,status:1 }).then(res => {
			          if (res.code == 0) {
			            this.$message({
			              message: "操作成功",
			              type: "success"
			            });
			            this.getList();
			          } else {
			            this.$message.error(res.msg);
			          }
			        });
			      }
			    }
			  });
			
		
	},
    // 批量关闭拍卖
    bathCloseSelling() {
      if (this.handleSelection.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return;
      }
      this.$confirm("是否批量关闭拍卖?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.handleSelection.length <= 0) {
          this.$message.error("请选择批量操作的数据");
        } else {
          let arr = [];
          this.handleSelection.map(item => {
            if (item.status == 2 || item.status == 3) {
              arr.push(item.auctionId);
            }
          });
          if (arr.length <= 0) {
            this.$message.error("没有可关闭的拍卖记录");
          } else {
            arr = arr.join(",");
            bathCloseSellingApi({ auctionIds: arr }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        }
      });
    },
    // 批量关闭机器人
    bathCloseRobot() {
      if (this.handleSelection.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return;
      }
      this.$confirm("是否继续批量关闭机器人?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.handleSelection.length <= 0) {
          this.$message.error("请选择批量操作的数据");
        } else {
          let arr = [];
          this.handleSelection.map(item => {
            if (item.status == 2 || item.openRobot == 1) {
              arr.push(item.auctionId);
            }
          });
          if (arr.length <= 0) {
            this.$message.error("没有可关闭的机器人");
          } else {
            arr = arr.join(",");
            bathCloseRobotApi({ auctionIds: arr }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.Shopping {
  line-height: 37px;
}
.el-dialog {
	width: 60%;
}
.Setweight {
  display: flex;
}

.image {
  width: 80px;
  height: 80px;
}

.addFlex {
  display: flex;
  flex-wrap: wrap;
}

.ax_200 {
  // width: 25%;
  height: 50px;
  margin-left: 4px;
  // margin-top: 10px;
  display: flex;
}

.ax_200 span {
  line-height: 43px;
  font-size: 15px;
  color: #333;
  font-weight: 400;
}

.ax_200 span:nth-child(1) {
  width: 80px;
}

.container {
  padding: 20px;
}

.search-content {
  display: block;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .item {
    display: inline-block;
    width: 30%;
    margin-bottom: 24px;
    margin-right: 1%;
    display: flex;
  }

  .item:first-child {
    width: 25%;
  }

  .item-title {
    font-size: 14px;
    line-height: 40px;
  }

  .item-picker {
    width: 300px;
  }

  .item-input {
    width: 220px;
    display: inline-block;
  }
}
</style>
