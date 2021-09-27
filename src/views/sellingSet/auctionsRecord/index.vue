<template>
  <div class="container">
    <div class="addFlex">
      <div>
        <el-button
          type="primary"
          v-if="checkPermission(['sellingSet:sellingSetList:add'])"
          @click="addSellingRecord"
        >新增拍卖</el-button>
      </div>
      <div class="ax_200">
        <el-date-picker
          v-model="ProductionPrice.startTimeValue"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开拍开始日期"
          end-placeholder="开拍结束日期"
        ></el-date-picker>
      </div>
      <el-date-picker
        v-model="ProductionPrice.startTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="开拍时间点"
      ></el-date-picker>
      <div class="ax_200">
        <el-date-picker
          v-model="ProductionPrice.finishTimeValue"
          type="datetimerange"
          range-separator="~"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="结拍开始日期"
          end-placeholder="结拍结束日期"
        ></el-date-picker>
      </div>

      <div class="ax_200">
        <div class="block">
          <el-cascader
            v-model="ProductionPrice.cascade"
            style="width:150px"
            placeholder="请选择商品分类"
            :options="options"
            :props="props"
            collapse-tags
            @change="handleChange"
            clearable
          ></el-cascader>
        </div>
      </div>
      <div class="ax_200">
        <el-select v-model="ProductionPrice.goodsStatus" style="width:150px" placeholder="请选择商品状态">
          <el-option
            v-for="item in shoppingStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="ax_200">
        <el-input v-model="ProductionPrice.start" placeholder="请输入最低起拍价格" style="width:130px"></el-input>
        <span>~</span>
        <el-input v-model="ProductionPrice.end" placeholder="请输入最高起拍价格" style="width:130px"></el-input>
      </div>

      <div class="ax_200">
        <el-input v-model="ProductionPrice.productName" style="width:140px" placeholder="请输入商品名称"></el-input>
      </div>
      <div class="ax_200">
        <el-input v-model="ProductionPrice.goodsId" style="width:140px" placeholder="请输入商品ID"></el-input>
      </div>
	  <div class="ax_200">
	    <el-input v-model="ProductionPrice.auctionId" style="width:140px" placeholder="请输入记录ID"></el-input>
	  </div>
	  <div class="ax_200">
	    <el-input v-model="ProductionPrice.mallNumber" style="width:140px" placeholder="请输入编号"></el-input>
	  </div>

      <div class="ax_200">
        <el-select v-model="ProductionPrice.sources" placeholder="请选择商品来源">
          <el-option
            v-for="item in Sources"
            style="width:130px"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div >
        <el-select style="width:350px" v-model="ProductionPrice.displayArea" multiple  placeholder="请选择展示区域">
          <el-option
            v-for="item in reqDisplayArea"
            :key="item.auctionId"
            :label="item.auctionName"
            :value="item.auctionId"
          ></el-option>
        </el-select>
      </div>
   <div class="ax_200 right">
        <el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchTitle">搜索</el-button>
        <el-button style="height:40px" @click="reset">重置</el-button>
        <el-button style="height:40px" @click="exportToExcel">导出数据</el-button>
        <el-button style="height:40px" @click="zhengxuanddaoxu">{{zhengxu}}</el-button>
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
      <el-table-column align="center" label="记录ID">
        <template slot-scope="scope">{{ scope.row.auctionId }}</template>
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
      <el-table-column label="商品类别" align="center">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>
	  <el-table-column label="编号" align="center">
	    <template slot-scope="scope">{{ scope.row.mallNumber }}</template>
	  </el-table-column>
      <el-table-column label="起拍价格" align="center">
        <template slot-scope="scope">{{ scope.row.startPrice }}</template>
      </el-table-column>
      <el-table-column label="加价" align="center">
        <template slot-scope="scope">{{ scope.row.markupPrice }}</template>
      </el-table-column>
	  <el-table-column label="是否开启限价" align="center">
	    <template slot-scope="scope">{{ scope.row.isLimitPrice?'开启':'未开启' }}</template>
	  </el-table-column>
	  <el-table-column label="限价" align="center">
	    <template slot-scope="scope">{{ scope.row.limitPrice?scope.row.limitPrice:'无' }}</template>
	  </el-table-column>
	  <el-table-column label="限制粉丝数" align="center">
	    <template slot-scope="scope">{{ scope.row.baseFansNumber }}</template>
	  </el-table-column>
      <el-table-column label="最低保护价" class="is-required" align="center">
        <template slot-scope="{row}">
          <template v-if="row.lowPrice">
            <el-input
              v-model="row.protectPrice"
              class="edit-input"
              oninput="value=value.replace(/[^\d.]/g,'')"
              size="small"
            />
            <el-button class="cancel-btn" size="small" type="text" @click="cancelEdit(row,1)">修改</el-button>
            <el-button
              class="cancel-btn"
              size="small"
              type="text"
              @click="cancelEditClose(row,1)"
            >取消</el-button>
          </template>
          <span v-else style="cursor: pointer;" @click="changeLowPrice(row)">{{row.protectPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最高保护价" class="is-required" align="center">
        <template slot-scope="{row}">
          <template v-if="row.highPrice">
            <el-input
              v-model="row.maxProtectPrice"
              class="edit-input"
              oninput="value=value.replace(/[^\d.]/g,'')"
              size="small"
            />
            <el-button class="cancel-btn" size="small" type="text" @click="cancelEdit(row,2)">修改</el-button>
            <el-button
              class="cancel-btn"
              size="small"
              type="text"
              @click="cancelEditClose(row,2)"
            >取消</el-button>
          </template>
          <span
            v-else
            style="cursor: pointer;"
            @click="changehighPrice(row)"
          >{{row.maxProtectPrice}}</span>
        </template>
      </el-table-column>
	  <el-table-column label="创建时间" width="100" align="center">
	    <template slot-scope="scope">{{ scope.row.createTime}}</template>
	  </el-table-column>
      <el-table-column label="开拍时间" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.startTime}}</template>
      </el-table-column>
      <el-table-column label="截拍时间" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.endTime}}</template>
      </el-table-column>
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          <div v-if="1 === scope.row.status">上架</div>
          <div v-if="2 === scope.row.status">预展</div>
          <div v-if="3 === scope.row.status">竞拍中</div>
          <div v-if="4 === scope.row.status">已售</div>
          <div v-if="5 === scope.row.status">已流拍</div>
          <div v-if="6 === scope.row.status">下架</div>
          <div v-if="7 === scope.row.status">已关闭</div>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="scope">
          <div v-if="1 === scope.row.source">商城</div>
          <div v-if="2 === scope.row.source">平台</div>
        </template>
      </el-table-column>
	  <el-table-column  label="修改开拍时间" align="center">
	    <template slot-scope="{row}">
	      <el-tag v-if="2 === row.status" type="" @click="handleAuctionTime(row)">修改</el-tag>
	    </template>
	  </el-table-column>
      <el-table-column label="机器人" align="center">
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.openRobot == 0 ? 'warning' : ''"
          >{{ scope.row.openRobot == 0 ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
	  <el-table-column label="刷新数据库缓存" align="center">
	    <template slot-scope="{row}">
	      <el-button type="button" size="mini" @click="updataData(row)">刷新</el-button>
	    </template>
	  </el-table-column>
      <el-table-column label="送积分" align="center">
        <template slot-scope="scope">
          {{ scope.row.isGiveIntegral }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="CheckFile(row)">查看详情</el-button>
          <el-button
            type="text"
            v-if="(row.status == 2 || row.status == 3) && checkPermission(['sellingSet:sellingSetList:close'])"
            size="mini"
            @click="closeSelling(row)"
          >关闭拍卖</el-button>
          <el-button
            type="text"
            v-if="row.status == 2 && checkPermission(['sellingSet:sellingSetList:editPrice'])"
            size="mini"
            @click="editProPrice(row)"
          >修改保护价</el-button>
          <el-button
            type="text"
            v-if="row.status == 2 && checkPermission(['sellingSet:sellingSetList:robot'])"
            size="mini"
            @click="robotForbidden(row.auctionId,row)"
          >{{ row.openRobot == 0 ? '机器人启用' : '机器人禁用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!-- 修改开拍时间 -->
    <el-dialog title="修改开拍时间" :visible.sync="dialogAuctionTime">
      <el-form
        ref="dataForm"
        :model="information"
        label-position="left"
        label-width="140px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="商品名称: " >
		  <span>{{ information.goodsName}}</span>
        </el-form-item>
		<el-form-item label="开拍时间: ">
			<span>{{ information.startTime}}</span>
		</el-form-item>
		<el-form-item label="修改开拍时间">
		  <el-date-picker
		    type="datetime"
		    placeholder="选择日期"
		    value-format="yyyy-MM-dd HH:mm:00"
		    @change="Vm"
		    v-model="information.auctionTime"
		  ></el-date-picker>
		</el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuctionTime = false">取消</el-button>
        <el-button type="primary"   @click="updateData()">提交</el-button>
      </div>
    </el-dialog>

    <!-- 新增拍卖 -->
    <el-dialog title="新增竞拍" :visible.sync="dialogFormVisible">
      <el-form
        ref="sellingRecord"
        :rules="rules"
        :model="sellingRecordDate"
        label-position="left"
        label-width="15%"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="竞拍数量" class="is-required">
          <el-radio-group v-model="addModel">
            <el-radio label="1" value="1">单个</el-radio>
            <el-radio label="2" value="2">批量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示区域" prop="displayArea">
          <el-select
            v-model="sellingRecordDate.displayArea"
            @change="getVipRome"
            placeholder="请选择展示区域"
          >
            <el-option
              v-for="item in reqDisplayArea"
              :key="item.auctionId"
              :label="item.auctionName"
              :value="item.auctionId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" v-if="sellingRecordDate.displayArea == 3" prop="roomId">
          <el-select v-model="sellingRecordDate.roomId" placeholder="请选择">
            <el-option
              v-for="item in vipRomeDate"
              :key="item.roomId"
              :label="item.name"
              :value="item.roomId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品" prop="goodsId">
          <el-input v-model="sellingRecordDate.goodsName" @focus="selectShopping" />
        </el-form-item>
        <el-form-item label="估价" prop="assessPrice">
          <el-input
            v-model="sellingRecordDate.assessPrice"
            maxlength="12"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
		<el-form-item label="限价" class="is-required">
		  <el-radio-group v-model="sellingRecordDate.openLimitPrice">
		    <el-radio label="1" value="1">开启</el-radio>
		    <el-radio label="0" value="0">关闭</el-radio>
		  </el-radio-group>
		</el-form-item>
        <el-form-item label="限价" :prop=" this.sellingRecordDate.isLimitPrice == 1 ? 'limitPrice' : ''">
          <el-input
            v-model="sellingRecordDate.limitPrice"
            maxlength="12"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="起拍价" prop="startPrice">
          <el-input
            v-model="sellingRecordDate.startPrice"
            maxlength="12"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
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
		<el-form-item label="粉丝数" prop="baseFansNumber">
		  <el-input
		    v-model="sellingRecordDate.baseFansNumber"
		    maxlength="5"
		    oninput="value=value.replace(/[^\d.]/g,'')"
		  />
		</el-form-item>
        <el-form-item label="佣金" class="is-required">
          <el-input v-if="sellingRecordDate.markupPrice>=0" :value="sellingRecordDate.markupPrice*0.05" oninput="value=value.replace(/[^\d.]/g,'')" :disabled="true" />
          <el-input v-if="sellingRecordDate.markupPrice<0" :value="-sellingRecordDate.markupPrice*0.05" oninput="value=value.replace(/[^\d.]/g,'')" :disabled="true" />
        </el-form-item>
        <el-form-item label="权重" prop="sort">
          <el-input v-model="sellingRecordDate.sort" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
        </el-form-item>
        <el-form-item label="开拍时间" v-if="addModel == 1" :prop="addModel == 1 ? 'startTime' : ''">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:00"
            @change="Vm"
            v-model="sellingRecordDate.startTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截拍时间" v-if="addModel == 1" :prop="addModel == 1 ? 'endTime' : ''">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:00"
            @change="Gm"
            v-model="sellingRecordDate.endTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="日期" v-if="addModel == 2" class="is-required">
          <selectDay @callback="selectDate"></selectDay>
        </el-form-item>
        <el-form-item label="时间" v-if="addModel == 2" class="is-required">
          <selectTime @callback="selectTime"></selectTime>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :disabled="submitClick" @click="addSellingUpdate()">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="selectSellingGoods" title="选择商品" width="60%">
      <selectGoods @callback="iwantyou"></selectGoods>
    </el-dialog>


    <!-- 修改保护价弹窗 -->
    <el-dialog title="修改保护价" :visible.sync="editSellingDia">
      <el-form
        ref="sellingRecord"
        :rules="rules"
        :model="editSelling"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="商品名称">
          <span>{{ editSelling.goodsName }}</span>
        </el-form-item>
        <el-form-item label="最低保护价" prop="protectPrice">
          <el-input v-model="editSelling.protectPrice" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="最高保护价" prop="maxProtectPrice">
          <el-input
            v-model="editSelling.maxProtectPrice"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="加价幅度" prop="markupPrice" v-if="editPriceUprobot == false">
          <el-input v-model="editSelling.markupPrice" />
        </el-form-item>
        <el-form-item label="估值" prop="assessPrice" v-if="editPriceUprobot == false">
          <el-input v-model="editSelling.assessPrice" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="佣金" prop="markupPrice" v-if="editPriceUprobot == false">
          <span v-if="editSelling.markupPrice>=0">{{ editSelling.markupPrice * 0.05 }}</span>
          <span v-if="editSelling.markupPrice<0">{{ -editSelling.markupPrice * 0.05 }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSellingDia = false">取消</el-button>
        <el-button type="primary" @click="editSellingUpdata()">提交</el-button>
      </div>
    </el-dialog>
    <pagination
      text1="批量关闭拍卖"
      text2="批量关闭机器人"
      v-on:callBackUp="bathCloseSelling"
      v-on:callBackDown="bathCloseRobot"
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
  </div>
</template>

<script>
//tablelist中需要改接口
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
import { fetchList } from "@/api/userInfo.js";
import selectGoods from "@/components/selectGoods/goodsChoice";
import selectDay from "@/components/selectDay/index";
import selectTime from "@/components/selectTime/index";
import { requestfile, exportBlobExcel } from "@/api/blob";
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
  refreshAuction,
  updataAuctionTime
} from "@/api/AuctionsRecord.js";
import checkPermission from "@/utils/permission";
const Sources = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 1,
    label: "商城"
  },
  {
    value: 2,
    label: "平台"
  }
];
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
  name: "sellingRecord",
  components: {
    Pagination,
    selectGoods,
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
	  information:{},
      zhengxu: "点击倒序",
      //商品来源
      Sources,
      integralTypeList,
      displayArea,
      shoppingStatus,
      //----
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      //
	  dialogAuctionTime:false,
      dialogFormVisible: false,
      soldOut: false,
      ProductionPrice: {
        start: "",
        end: "",
		mallNumber:"",
        productName: "",
        sources: undefined,
        startTimeValue: "",
        finishTimeValue: "",
        goodsStatus: undefined,
        cascade: [],
        integralTypeId: undefined,
        integralType: undefined
      },
      //商品分类
      // 级联框
      Cascadebox: [],
      options: [],
      classifyvalue1: "",
      //商品分类
      test: [],
      classifyvalue2: "",
      //新增拍卖
      sellingRecordDate: {
        displayArea: undefined,
        goodsId: undefined,
        startPrice: undefined,
        protectPrice: undefined,
        maxProtectPrice: undefined,
        markupPrice: undefined,
        startTime: undefined,
        endTime: undefined,
        assessPrice: undefined,
        limitPrice: undefined,
        sort: 1,
		baseFansNumber:0,
        openRobot: "1",
		openLimitPrice:'0',
        robotNum:30
      },
      selectSellingGoods: false,
      rules: {
        displayArea: [
          { required: true, message: "展示区域不能为空", trigger: "change" }
        ],
        roomId: [
          { required: true, message: "店铺不能为空", trigger: "change" }
        ],
        goodsId: [
          { required: true, message: "商品不能为空", trigger: "change" }
        ],
        startPrice: [
          { required: true, message: "起拍价不能为空", trigger: "change" }
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
        startTime: [
          { required: true, message: "开拍时间不能为空", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "结拍时间不能为空", trigger: "change" }
        ],
        assessPrice: [
          { required: true, message: "估值不能为空", trigger: "change" }
        ],
        sort: [{ required: true, message: "权重不能为空", trigger: "change" }],
		baseFansNumber: [{ required: true, message: "粉丝数不能为空", trigger: "change" }],
        limitPrice: [
          { required: true, message: "限价不能为空", trigger: "change" }
        ],
        // robotNum
        robotNum: [
          { required: true, message: "机器人个数不能为空", trigger: "change" },
          {min:1,max:100, message: "只能输入正整数，大于等于2，最多2位数", trigger: "change"}
        ],
      },
      //修改保护价
      editSellingDia: false,
      editSelling: {
        auctionId: undefined,
        goodsName: undefined,
        protectPrice: undefined,
        maxProtectPrice: undefined,
        markupPrice: undefined,
        assessPrice: undefined
      },
      vipRomeDate: [],
      // 暂存临时最低保护价，最高保护价
      lowPrice: "",
      highPrice: "",
      // 竞拍数量
      addModel: "1",
      // 批量上架的日期和时间的回调
      callBackSelectDay: [],
      callBackSelectTime: [],
      // 批量关闭操作列表
      handleSelection: [],
      // 请求商品展示区域列表
      reqDisplayArea: [],
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
    //获取展示区域列表sellingAreaList
    this.getDisplayArea();
  },
  methods: {
    checkPermission,
    zhengxuanddaoxu() {
      this.listLoading = true;
      if (this.zhengxu == "点击正序") {
        this.zhengxu = "点击倒序";
        let Obj = this.fliterfunc({
          categoryId: this.Flagfunc(),
          size: this.listQuery.limit,
          current: this.listQuery.page,
          timeSort: 1,
          source: this.ProductionPrice.sources,
          status: this.ProductionPrice.goodsStatus,
          startStartPrice: this.ProductionPrice.start,
          endStartPrice: this.ProductionPrice.end,
          goodsName: this.ProductionPrice.productName,
          startStartTime:
            this.ProductionPrice.startTimeValue == "" ||
            this.ProductionPrice.startTimeValue == null ||
            this.ProductionPrice.startTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
          endStartTime:
            this.ProductionPrice.startTimeValue == "" ||
            this.ProductionPrice.startTimeValue == null ||
            this.ProductionPrice.startTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
          startEndTime:
            this.ProductionPrice.finishTimeValue == "" ||
            this.ProductionPrice.finishTimeValue == null ||
            this.ProductionPrice.finishTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
          endEndTime:
            this.ProductionPrice.finishTimeValue == "" ||
            this.ProductionPrice.finishTimeValue == null ||
            this.ProductionPrice.finishTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
        });
        auctionRecordInfoList({
          ...Obj
        }).then(res => {
          if (res.msg === "success") {
            this.list = res.data.records;
            this.total = Number(res.data.total);
            this.listLoading = false;
          } else {
            console.error("服务器开小差了！");
          }
        });
      } else {
        this.zhengxu = "点击正序";
        let Obj = this.fliterfunc({
          categoryId: this.Flagfunc(),
          size: this.listQuery.limit,
          current: this.listQuery.page,
          source: this.ProductionPrice.sources,
          timeSort: 2,
          status: this.ProductionPrice.goodsStatus,
          startStartPrice: this.ProductionPrice.start,
          endStartPrice: this.ProductionPrice.end,
          goodsName: this.ProductionPrice.productName,
          startStartTime:
            this.ProductionPrice.startTimeValue == "" ||
            this.ProductionPrice.startTimeValue == null ||
            this.ProductionPrice.startTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
          endStartTime:
            this.ProductionPrice.startTimeValue == "" ||
            this.ProductionPrice.startTimeValue == null ||
            this.ProductionPrice.startTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
          startEndTime:
            this.ProductionPrice.finishTimeValue == "" ||
            this.ProductionPrice.finishTimeValue == null ||
            this.ProductionPrice.finishTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
          endEndTime:
            this.ProductionPrice.finishTimeValue == "" ||
            this.ProductionPrice.finishTimeValue == null ||
            this.ProductionPrice.finishTimeValue == undefined
              ? ""
              : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
        });
        auctionRecordInfoList({
          ...Obj
        }).then(res => {
          if (res.msg === "success") {
            this.list = res.data.records;
            this.total = Number(res.data.total);
            this.listLoading = false;
          } else {
            console.error("服务器开小差了！");
          }
        });
      }
    },
	/**
	 * 导出excel
	 */
	exportToExcel() {
	  let that = this;
	  let url = "/management/order/auctionRecordInfo/excelAuctionInfo";
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
	            // console.log(111);
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
	  console.log(this.ProductionPrice.displayArea)
	  let displayAreaStr=this.ProductionPrice.displayArea.join(",")
	  console.log(displayAreaStr)
	  let Obj = this.fliterfunc({
	    categoryId: Flag,
	    size: this.listQuery.limit,
	    current: this.listQuery.page,
	    source: this.ProductionPrice.sources,
	    status: this.ProductionPrice.goodsStatus,
	    mallNumber: this.ProductionPrice.mallNumber,
	    startStartPrice: this.ProductionPrice.start,
	    endStartPrice: this.ProductionPrice.end,
	    goodsName: this.ProductionPrice.productName,
	    goodsId: this.ProductionPrice.goodsId,
	    auctionId: this.ProductionPrice.auctionId,
	    // displayArea: this.ProductionPrice.displayArea,
	    displayArea: displayAreaStr,
	    timeSort: this.zhengxu == "点击倒序" ? 1 : 2,
	    integralType: this.ProductionPrice.integralType,
	    startTime: this.ProductionPrice.startTime,
	    startStartTime:
	      this.ProductionPrice.startTimeValue == "" ||
	      this.ProductionPrice.startTimeValue == null ||
	      this.ProductionPrice.startTimeValue == undefined
	        ? ""
	        : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
	    endStartTime:
	      this.ProductionPrice.startTimeValue == "" ||
	      this.ProductionPrice.startTimeValue == null ||
	      this.ProductionPrice.startTimeValue == undefined
	        ? ""
	        : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
	    startEndTime:
	      this.ProductionPrice.finishTimeValue == "" ||
	      this.ProductionPrice.finishTimeValue == null ||
	      this.ProductionPrice.finishTimeValue == undefined
	        ? ""
	        : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
	    endEndTime:
	      this.ProductionPrice.finishTimeValue == "" ||
	      this.ProductionPrice.finishTimeValue == null ||
	      this.ProductionPrice.finishTimeValue == undefined
	        ? ""
	        : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
	  });
	  console.log(Obj)
	  exportBlobExcel(url, Obj).then(res => {
	    console.log(res, "res");
	    const data = res.data;
	    const a = document.createElement("a");
	    const blob = new Blob([data]);
	    const blobUrl = window.URL.createObjectURL(blob);
	    a.style.display = "none";
	    a.download = "拍卖管理.xls";
	    a.href = blobUrl;
	    a.click();
	  });
	},
    getSystemnum() {
      getSystemTime({ configKey: "auction_continued_time" }).then(res => {
        if (res.code == 0) {
          console.log(res, "系统时间");
          this.systemTime = res.data;
        }
      });
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
	updataData(row){
		console.log(row)
		refreshAuction({auctionId:row.auctionId}).then(res => {
			console.log(res,'刷新数据库')
		  if (res.code == 0) {
			this.$message("操作成功");
		    this.search();
		  }
		});
	},
    soldout(row) {
      this.soldOut = true;
    },
    //调序

    Thesequence(row) {
      this.dialogFormVisible = true;
    },
    Flagfunc() {
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
      return Flag;
    },
    getList() {
      this.listLoading = true;
	  let displayAreaStr=""
	  this.ProductionPrice.displayArea?displayAreaStr=this.ProductionPrice.displayArea.join(","):""
      let Obj = this.fliterfunc({
        categoryId: this.Flagfunc(),
        size: this.listQuery.limit,
        current: this.listQuery.page,
        source: this.ProductionPrice.sources,
        status: this.ProductionPrice.goodsStatus,
        mallNumber: this.ProductionPrice.mallNumber,
        startStartPrice: this.ProductionPrice.start,
        endStartPrice: this.ProductionPrice.end,
        goodsName: this.ProductionPrice.productName,
        displayArea: displayAreaStr,
        integralType: this.ProductionPrice.integralType,
        startStartTime:
          this.ProductionPrice.startTimeValue == "" ||
          this.ProductionPrice.startTimeValue == null ||
          this.ProductionPrice.startTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
        endStartTime:
          this.ProductionPrice.startTimeValue == "" ||
          this.ProductionPrice.startTimeValue == null ||
          this.ProductionPrice.startTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
        startEndTime:
          this.ProductionPrice.finishTimeValue == "" ||
          this.ProductionPrice.finishTimeValue == null ||
          this.ProductionPrice.finishTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
        endEndTime:
          this.ProductionPrice.finishTimeValue == "" ||
          this.ProductionPrice.finishTimeValue == null ||
          this.ProductionPrice.finishTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
      });
      auctionRecordInfoList({
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
      this.listQuery.page = 1;
      this.search();
    },
    search() {
      this.listLoading = true;
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
                // console.log(111);
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
	  console.log(this.ProductionPrice.displayArea)
	  let displayAreaStr=this.ProductionPrice.displayArea.join(",")
	  console.log(displayAreaStr)
      let Obj = this.fliterfunc({
        categoryId: Flag,
        size: this.listQuery.limit,
        current: this.listQuery.page,
        source: this.ProductionPrice.sources,
        status: this.ProductionPrice.goodsStatus,
        mallNumber: this.ProductionPrice.mallNumber,
        startStartPrice: this.ProductionPrice.start,
        endStartPrice: this.ProductionPrice.end,
        goodsName: this.ProductionPrice.productName,
        goodsId: this.ProductionPrice.goodsId,
        auctionId: this.ProductionPrice.auctionId,
        // displayArea: this.ProductionPrice.displayArea,
        displayArea: displayAreaStr,
        timeSort: this.zhengxu == "点击倒序" ? 1 : 2,
        integralType: this.ProductionPrice.integralType,
        startTime: this.ProductionPrice.startTime,
        startStartTime:
          this.ProductionPrice.startTimeValue == "" ||
          this.ProductionPrice.startTimeValue == null ||
          this.ProductionPrice.startTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
        endStartTime:
          this.ProductionPrice.startTimeValue == "" ||
          this.ProductionPrice.startTimeValue == null ||
          this.ProductionPrice.startTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
        startEndTime:
          this.ProductionPrice.finishTimeValue == "" ||
          this.ProductionPrice.finishTimeValue == null ||
          this.ProductionPrice.finishTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
        endEndTime:
          this.ProductionPrice.finishTimeValue == "" ||
          this.ProductionPrice.finishTimeValue == null ||
          this.ProductionPrice.finishTimeValue == undefined
            ? ""
            : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
      });
      auctionRecordInfoList(Obj).then(res => {
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
    robotForbidden(auctionId, rows) {
      this.$confirm("请确认是否继续对机器人操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (
          rows.openRobot == 0 &&
          (rows.protectPrice == "" ||
            rows.maxProtectPrice == "" ||
            rows.protectPrice == null ||
            rows.maxProtectPrice == null)
        ) {
          let row = JSON.parse(JSON.stringify(rows));
          this.editSelling.auctionId = row.auctionId;
          this.editSelling.goodsName = row.goodsName;
          this.editSelling.markupPrice = row.markupPrice;
          this.editSelling.startPrice = row.startPrice;
          this.editSelling.protectPrice = row.protectPrice;
          this.editSelling.maxProtectPrice = row.maxProtectPrice;
          this.editSelling.assessPrice = row.assessPrice;
          this.editSelling.brokerage = row.brokerage;
          this.editPriceUprobot = true;
          this.editSellingDia = true;
          return;
        }
        let dataobg = {
          auctionId: auctionId,
          opendRobot: rows.openRobot == 0 ? 1 : 0
        };
        robotForbidden(dataobg).then(res => {
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
        displayArea: undefined,
        goodsId: undefined,
        startPrice: undefined,
        protectPrice: undefined,
        maxProtectPrice: undefined,
        markupPrice: undefined,
        startTime: undefined,
        endTime: undefined,
        assessPrice: undefined,
        limitPrice:undefined,
        sort: 1,
		baseFansNumber:0,
        openRobot: "1",
		openLimitPrice:'0',
        robotNum:30,
      };
    },
	handleAuctionTime(row){
		console.log(row)
		this.information.auctionId=row.auctionId
		this.information.goodsName=row.goodsName
		this.information.startTime=row.startTime
		this.dialogAuctionTime=true
	},
    //addSellingRecord
    addSellingRecord() {
      this.addModel = "1";
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
          if (this.sellingRecordDate.openRobot == 0) {
            delete this.sellingRecordDate.protectPrice;
            delete this.sellingRecordDate.maxProtectPrice;
          }
		  if (this.sellingRecordDate.openLimitPrice == 0) {
		    this.sellingRecordDate.isLimitPrice=0;
		  }else{
			  if(this.sellingRecordDate.limitPrice==0){
				  this.$message.warning('请输入限价')
			  }
			  this.sellingRecordDate.isLimitPrice=1;
		  }
		  console.log(this.sellingRecordDate)
		  // return
          if(this.sellingRecordDate.openRobot == 1 ){
            if( !this.sellingRecordDate.endProtectPrice ){
              this.$message.warning('请输入最低保护价最大值')
            }
            if( !this.sellingRecordDate.endMaxProtectPrice ){
              this.$message.warning('请输入最高保护价最大值')
            }
            // if (
            //   Number(this.sellingRecordDate.startMaxProtectPrice) <
            //   Number(this.sellingRecordDate.endProtectPrice)
            // ) {
            //   this.$message({
            //     message: "最高保护价最小值不能小于最低保护价最大值",
            //     type: "warning"
            //   });
            //   return;
            // }
            // if (
            //   Number(this.sellingRecordDate.startProtectPrice) >
            //   Number(this.sellingRecordDate.endProtectPrice)
            // ) {
            //   this.$message({
            //     message: "最低保护价最小值不能大于最低保护价最大值",
            //     type: "warning"
            //   });
            //   return;
            // }
            // if (
            //   Number(this.sellingRecordDate.startMaxProtectPrice) >
            //   Number(this.sellingRecordDate.endMaxProtectPrice)
            // ) {
            //   this.$message({
            //     message: "最高保护价最小值不能大于最高保护价最大值",
            //     type: "warning"
            //   });
            //   return;
            // }
          }
          // if (
          //     Number(this.sellingRecordDate.markupPrice) >=
          //     Number(this.sellingRecordDate.startPrice)
          //   ) {
          //     this.$message({
          //       message: "加价幅度必须小于起拍价",
          //       type: "warning"
          //     });
          //     return;
          //   }
            // 起拍价必须小于商品限价
            // if(this.sellingRecordDate.limitPrice != 0){
            //   if (
            //     Number(this.sellingRecordDate.startPrice) >=
            //     Number(this.sellingRecordDate.limitPrice)
            //   ) {
            //     this.$message({
            //       message: "起拍价必须小于商品限价",
            //       type: "warning"
            //     });
            //     return;
            //   }
            //   最低、最高保护价的最大区间值必须小于商品限价
            //   if (
            //     Number(this.sellingRecordDate.endProtectPrice) >=
            //     Number(this.sellingRecordDate.limitPrice) || Number(this.sellingRecordDate.endMaxProtectPrice) >=
            //     Number(this.sellingRecordDate.limitPrice)
            //   ) {
            //     this.$message({
            //       message: "最低、最高保护价的最大区间值必须小于商品限价",
            //       type: "warning"
            //     });
            //     return;
            //   }

            // }


          this.submitClick = true;
          setTimeout(() => {
            this.submitClick = false;
          }, 3000);
          // 判断机器人是否开启，机器人关闭状态删除最低保护价和最高保护价

          if (this.addModel == 2) {
            console.log(
              this.callBackSelectTime,
              this.callBackSelectDay,
              "时间回调列表"
            );
            if (
              this.callBackSelectDay.length <= 0 ||
              this.callBackSelectTime <= 0
            ) {
              this.$message({
                message: "请选择日期和时间",
                type: "warning"
              });
              return;
            }
            let arr = [];
            let obj = {};
            let timetrue = true;
            this.callBackSelectDay.map(item => {
              this.callBackSelectTime.map(ite => {
                obj = {};
                obj.startTime = item + " " + ite.startTime;
                obj.endTime = item + " " + ite.endTime;
                if(new Date(obj.startTime).getTime() - new Date().getTime() < 60000 ){
                  timetrue = false
                }
                arr.push(obj);
              });
            });
            if(timetrue == false){
               this.$message({
                message: "时间格式错误，开拍时间需大于当前时间1分钟",
                type: "warning"
              });
              return;
            }
            const tempData = Object.assign({}, this.sellingRecordDate);
            tempData.times = JSON.stringify(arr);
            batchAddsellingrecord(tempData).then(res => {
              if (res.code == 0) {
                this.getList();
                this.dialogFormVisible = false;
                this.$notify({
                  title: "Success",
                  message: "批量新增成功",
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
              this.submitClick = false;
            });
            return;
          }
          const tempData = Object.assign({}, this.sellingRecordDate);
          //tempData.startTime = tempData.startTime[0]
          //tempData.endTime = tempData.endTime[0]

          addsellingrecord(tempData).then(res => {
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
      this.sellingRecordDate.assessPrice = value.assessPrice;
      this.sellingRecordDate.startPrice = value.costPrice;
      this.sellingRecordDate.limitPrice = value.limitPrice;
      this.sellingRecordDate.isLimitPrice = value.isLimitPrice
      this.sellingRecordDate.openLimitPrice = value.isLimitPrice
      this.selectSellingGoods = false;
    },
	//修改开拍时间
	updateData(){
		if(!this.information.auctionTime){
			this.$message({
			  message: "请选择开拍时间",
			  type: "warning"
			});
			return
		}
      this.$confirm("此操作将修改开拍时间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updataAuctionTime({
			auctionId: this.information.auctionId,
			startTime:this.information.auctionTime
			}).then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
			this.dialogAuctionTime=false
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
      this.editSelling.auctionId = row.auctionId;
      this.editSelling.goodsName = row.goodsName;
      this.editSelling.markupPrice = row.markupPrice;
      this.editSelling.startPrice = row.startPrice;
      this.editSelling.protectPrice = row.protectPrice;
      this.editSelling.maxProtectPrice = row.maxProtectPrice;
      this.editSelling.assessPrice = row.assessPrice;
      this.editSelling.brokerage = row.brokerage;
      this.editPriceUprobot = false;
      this.editSellingDia = true;
    },
    editSellingUpdata() {
      console.log(
        this.editSelling.markupPrice,
        this.editSelling.startPrice,
        "this.editSelling.startPrice"
      );
	  console.log(this.editSelling,'console.log(this.editSelling)')
	  this.editSelling.brokerage = this.editSelling.markupPrice *0.1;
	  console.log(this.editSelling)
	  // return
      if (this.editSelling.protectPrice == "") {
        this.$message({
          message: "最低保护价不能为空",
          type: "warning"
        });
        return;
      } else if (this.editSelling.maxProtectPrice == "") {
        this.$message({
          message: "最高保护价不能为空",
          type: "warning"
        });
        return;
      } else if (this.editSelling.markupPrice == "") {
        this.$message({
          message: "加价幅度不能为空",
          type: "warning"
        });
        return;
      } else if (
        Number(this.editSelling.maxProtectPrice) <
        Number(this.editSelling.protectPrice)
      ) {
        this.$message({
          message: "最高保护价不能小于最低保护价",
          type: "warning"
        });
        return;
      } else if (
        Number(this.editSelling.protectPrice) <
        Number(this.editSelling.markupPrice)
      ) {
        this.$message({
          message: "最低保护价需大于加价幅度",
          type: "warning"
        });
        return;
      }
      editProtectPrice(this.editSelling).then(res => {
        if (res.code == 0) {
          this.editSellingDia = false;
          if (this.editPriceUprobot == true) {
            let dataobg = {
              auctionId: this.editSelling.auctionId,
              opendRobot: 1
            };
            robotForbidden(dataobg).then(res => {
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
            return;
          }
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
          0 
      ) {
        this.$message("选择成功！");
        console.log(vm, this.ChangeShow(vm), "21212");
        this.sellingRecordDate.endTime = this.ChangeShow(vm);
      } else {
        this.$message("请先选择开拍时间且截拍时间距开拍时间不能小于0！");
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
    getVipRome() {
      if (this.sellingRecordDate.displayArea == 3) {
        getVipRoomUser().then(res => {
          if (res.code == 0) {
            this.vipRomeDate = res.data;
          }
        });
      }
	  if(this.sellingRecordDate.displayArea == 14){
		  this.sellingRecordDate.openRobot = 0
	  }else{
		  this.sellingRecordDate.openRobot = 1
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
        assessPrice: row.assessPrice,
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
    // 请求展示区域
    getDisplayArea() {
      sellingAreaList().then(res => {
        if (res.code == 0) {
          this.reqDisplayArea = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.Shopping {
  line-height: 37px;
}
.el-dialog {
	width: 80%;
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
