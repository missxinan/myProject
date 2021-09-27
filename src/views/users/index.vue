<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        placeholder="用户名称"
        style="width: 140px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
        style="width: 140px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.channelNo"
        placeholder="渠道"
        style="width: 140px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userId"
        placeholder="用户Id"
        style="width: 140px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select
        v-model="listQuery.blacklist"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusListOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.isLeader"
        placeholder="拍客领袖"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查询</el-button
      >
      <!-- <el-button
	    v-waves
	    class="filter-item"
	    type="primary"
	    @click="handleMango"
	  >芒果赠送</el-button> -->
      <el-button @click="resetListQuery">重置</el-button>
      <el-button @click="exportToExcel">导出邀请数据</el-button>
      <el-button @click="exportChannelNoExcel">导出渠道数据</el-button>
    </div>
    <div style="height: 20px"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
      max-height="650"
      @sort-change="sortChange"
      @cell-click="cellclick"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column label="昵称" align="center" property="nickname">
        <template slot-scope="scope">
          <span
            @click="nickNameClick(scope.row)"
            style="
              cursor: pointer;
              color: #0066cc;
              display: inline-block;
              width: 100%;
              height: 100%;
            "
            >{{ scope.row.nickname }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img
            style="width: 60px; height: 60px; border-radius: 50%"
            :src="scope.row.avatar"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="上级昵称"
        align="center"
        property="parentNickname"
      >
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #0066cc"
            >{{ scope.row.parentNickname }}{{ scope.row.parentPhone }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="center" property="channelNo">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #0066cc">{{
            scope.row.channelNo
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" property="amount">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #0066cc">{{
            scope.row.amount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" property="integralAmount">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #0066cc">{{
            scope.row.integralAmount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invitationCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户身份" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.isLeader == 0
              ? "普通拍客"
              : scope.row.isLeader == 1
              ? "拍客领袖"
              : scope.row.isLeader == 2
              ? "虚拟股东"
              : scope.row.isLeader == 3
              ? "拍客领袖/虚拟股东"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领袖到期时间" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.leaderExpireTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" placement="right-start">
            <div slot="content">
              黑名单一级：前{{ sysConfigTime }}秒禁止出价
              <br />黑名单二级：禁止出价
              <br />黑名单三级：永久禁止出价且禁止提现
            </div>
            <div>
              <el-tag
                :type="scope.row.blacklist == 0 ? 'success' : 'danger'"
                v-show="scope.row.blacklist === 0"
                >正常</el-tag
              >
              <el-tag
                :type="scope.row.blacklist == 0 ? 'success' : 'danger'"
                v-show="scope.row.blacklist === 1"
                >一级黑名单</el-tag
              >
              <el-tag
                :type="scope.row.blacklist == 0 ? 'success' : 'danger'"
                v-show="scope.row.blacklist === 2"
                >二级黑名单</el-tag
              >
              <el-tag
                :type="scope.row.blacklist == 0 ? 'success' : 'danger'"
                v-show="scope.row.blacklist === 3"
                >三级黑名单</el-tag
              >
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            style="color: #f56c6c"
            size="mini"
            v-if="checkPermission(['user:userList:money'])"
            @click="moneyUpdata(row)"
            >余额</el-button
          >
          <el-button
            type="text"
            size="mini"
            v-if="checkPermission(['user:userList:integral'])"
            @click="intergralUpdata(row)"
            >积分</el-button
          >
          <el-button
            type="text"
            size="mini"
            v-if="checkPermission(['user:userList:fans'])"
            @click="fansShow(row)"
            >粉丝</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="blacklistChange(row)"
            v-if="checkPermission(['user:userList:inblacklist'])"
            style="margin-top: 10px; color: #e6a23c"
            >{{ row.blacklist !== 0 ? "修改黑名单" : "加入黑名单" }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="blacklist(row)"
            v-if="
              checkPermission(['user:userList:inblacklist']) &&
              row.blacklist !== 0
            "
            style="margin-top: 10px; color: #e6a23c"
            >移出黑名单</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />
    <!-- 芒果操作 -->
    <el-dialog title="赠送芒果" :visible.sync="dialogMangoVisible">
      <el-form
        ref="dataForm"
        :model="information"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="information.phone" style="width: 200px" />
        </el-form-item>
        <el-form-item label="使用场次" prop="useSession">
          <el-input v-model="information.useSession" style="width: 200px" />
        </el-form-item>
        <el-form-item label="赠送数量" prop="number">
          <el-input v-model="information.number" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMangoVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMangoData()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :modal="false"
    >
      <div v-if="fans == true" style="margin-bottom: 10px">
        直属：{{ fansNum.directNum }}
        <span style="opacity: 0">----</span>
        间属：{{ fansNum.indirectNum }}
        <span style="opacity: 0">----</span>
        全部：{{ fansNum.allFansNum }}
      </div>
      <el-form
        v-if="fans == false"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="余额">
          <el-input v-model="temp.amount" />
        </el-form-item>
        <el-form-item label="收益">
          <el-input v-model="temp.commission" />
        </el-form-item>
        <el-form-item label="总消费">
          <el-input v-model="temp.totalConsume" />
        </el-form-item>
        <el-form-item label="总收入">
          <el-input v-model="temp.totalIncome" />
        </el-form-item>
        <el-form-item label="微信充值">
          <el-input v-model="temp.weixinRecharge" />
        </el-form-item>
        <el-form-item label="微信消费 ">
          <el-input v-model="temp.weixinConsume" />
        </el-form-item>
        <el-form-item label="提现 ">
          <el-input v-model="temp.cashWithdrawal" />
        </el-form-item>
      </el-form>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="fansList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
        v-if="fans == true"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">
            <span
              @click="clickFansName(scope.row)"
              style="
                cursor: pointer;
                color: #0066cc;
                display: inline-block;
                width: 100%;
                height: 100%;
              "
              >{{ scope.row.nickname }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            <span
              @click="clickFansName(scope.row)"
              style="
                cursor: pointer;
                color: #0066cc;
                display: inline-block;
                width: 100%;
                height: 100%;
              "
              >{{ scope.row.phone }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img
              style="width: 60px; height: 60px; border-radius: 50%"
              :src="scope.row.avatar"
            />
          </template>
        </el-table-column>
        <el-table-column label="间属" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.indirectNum }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="fans == true"
        v-show="fansTotal > 0"
        :total="fansTotal"
        :page.sync="fansQuery.current"
        :limit.sync="fansQuery.size"
        :currentPage="fansQuery.current"
        @pagination="getFans"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>-->
      </div>
    </el-dialog>

    <!-- 余额调整 -->
    <el-dialog title="余额调整" :visible.sync="moneyDialog">
      <el-form
        ref="moneyDataForm"
        :model="moneyData"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户昵称">
          <span>{{ moneyData.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户手机号">
          <span>{{ moneyData.phone }}</span>
        </el-form-item>
        <el-form-item label="余额">
          <span>{{ moneyData.amount }}</span>
        </el-form-item>
        <el-form-item label="调整方式" class="is-required">
          <el-radio-group v-model="moneyData.accountDetailType">
            <el-radio label="0">减少</el-radio>
            <el-radio label="1">增加</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整金额" class="is-required">
          <el-input
            v-model="moneyData.money"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="调整原因" class="is-required">
          <el-input v-model="moneyData.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyDialog = false">取消</el-button>
        <el-button type="primary" @click="moneyDataUpda()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 积分调整 -->
    <el-dialog title="积分调整" :visible.sync="integralDialog">
      <el-form
        ref="integralDataForm"
        :model="integralData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户昵称">
          <span>{{ integralData.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户手机号">
          <span>{{ integralData.phone }}</span>
        </el-form-item>
        <el-form-item label="积分">
          <span>{{ integralData.integralAmount }}</span>
        </el-form-item>
        <el-form-item label="调整方式" class="is-required">
          <el-radio-group v-model="integralData.integralDetailType">
            <el-radio label="0">减少</el-radio>
            <el-radio label="1">增加</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数额" class="is-required">
          <el-input
            v-model.number="integralData.integralAmounts"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="调整原因" class="is-required">
          <el-input v-model="integralData.remark" minlength="25" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="integralDialog = false">取消</el-button>
        <el-button type="primary" @click="integralDataUpda()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 更换头像 -->
    <el-dialog title="用户头像" :visible.sync="userAvatar">
      <el-form
        ref="integralDataForm"
        :model="userAvatarData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="头像" class="is-required">
          <img
            width="200px"
            v-if="userAvatarData.avatar"
            class="tempPic"
            :src="userAvatarData.avatar"
            alt
          />
          <el-upload
            ref="upload"
            v-model="userAvatarData.avatar"
            action
            :on-change="getFile"
            :show-file-list="false"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userAvatarData.nickname" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAvatar = false">取消</el-button>
        <el-button type="primary" @click="changeAvatarDataUpda()"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>

    <!-- 加入黑名单 -->
    <!--:before-close关闭前的回调，返回false可阻止回调-->
    <el-dialog
      title="加入黑名单"
      :visible.sync="dialogBlackFormVisible"
      width="30%"
      :before-close="handleBlackCancel"
    >
      <el-form ref="blackForm" :model="blackForm" :rules="blackRules">
        <el-form-item label="用户昵称">{{ blackForm.nickname }}</el-form-item>
        <el-form-item label="黑名单等级" prop="blacklist">
          <el-select
            v-model="blackForm.blacklist"
            placeholder="请选择黑名单等级"
          >
            <el-option label="一级黑名单" value="1"></el-option>
            <el-option label="二级黑名单" value="2"></el-option>
            <el-option label="三级黑名单" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleBlackCancel">取 消</el-button>
        <el-button type="primary" @click="handleBlackOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  usersDetail,
  fansList,
  usersForbidden,
  moneyDetail,
  moneyEdit,
  integralEdit,
  uploadImgFile,
  blacklist,
  getSysConfig,
  fansListNumApi,
  registerAllListApi,
  addRobotApi,
  givingMango,
} from "@/api/users";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth.js";
import {
  requestfile,
  exportBlobUserExcel,
  exportBlobChannelNoExcel,
} from "@/api/blob";
import qs from "qs";
import checkPermission from "@/utils/permission";

const calendarTypeOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "普通用户" },
  { key: "1", display_name: "会员" },
  { key: "2", display_name: "虚拟用户" },
];

const statusListOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "正常" },
  { key: "1", display_name: "一级黑名单" },
  { key: "2", display_name: "二级黑名单" },
  { key: "3", display_name: "三级黑名单" },
];
// arr to obj, such as { CN : "China", US : "USA" }
/*    "": "全部"
      0: "普通用户"
      1: "会员"      */
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "users",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      value1: "",
      value2: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        type: 0,
        nickname: undefined,
        phone: undefined,
        time: undefined,
        userId: undefined,
        blacklist: undefined,
        channelNo: undefined,
      },
      fansQuery: {
        current: 1,
        size: 20,
      },
      fansTotal: 0,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusListOptions, // 状态选择框数据
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        name: "",
        firstChar: "",
      },
      rules: [],
      information: {},
      dialogMangoVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "详情",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      fans: false,
      fansList: [],
      // 余额弹窗
      moneyDialog: false,
      isEarnings: "1",
      isSendMsg: "1",
      moneyData: {},
      // 积分弹窗
      integralDialog: false,
      integralData: {
        superIntegralAmount: "",
      },
      // 用户头像
      userAvatar: false,
      userAvatarData: {
        avatar: "",
      },

      // 加入黑名单
      dialogBlackFormVisible: false, // 弹框显示隐藏
      blackForm: {
        blacklist: "",
        nickname: "",
        userId: "",
      },
      //加入黑名单弹出表单校验
      blackRules: {
        blacklist: [
          { required: true, message: "请选择黑名单", trigger: "blur" },
        ],
      },
      sysConfigTime: "180",
      fansNum: {},
      integralType: "1",
    };
  },
  created() {
    this.getList();
    //获取一级黑名单内容
    this.getSysConfigMeth();
  },
  methods: {
    //导出渠道数据
    exportChannelNoExcel() {
      let that = this;
      let url = "management/report/channel/invitation/excel";
      if (!this.listQuery.channelNo) {
        this.$message.error("请输入导出渠道");
        return;
      }
      //用户名称
      this.listQuery.nickname == ""
        ? (this.listQuery.nickname = undefined)
        : "",
      this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
      this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
      let data = {
        //渠道
        channelNo: this.listQuery.channelNo,
        startCreateTime: this.listQuery.startCreateTime,
      };
      let datas = JSON.parse(JSON.stringify(data));
      //调接口
      exportBlobChannelNoExcel(url, datas).then((res) => {
        console.log(res, "res");
        const data = res.data;
        const a = document.createElement("a");
        //二进制类型的大对象
        const blob = new Blob([data]);
        const blobUrl = window.URL.createObjectURL(blob);
        a.style.display = "none";
        if (this.listQuery.startCreateTime) {
          a.download =
            this.listQuery.channelNo +
            "渠道" +
            this.listQuery.startCreateTime.substr(0, 10) +
            "渠道详情.xls";
        } else {
          a.download = this.listQuery.channelNo + "渠道" + "渠道详情.xls";
        }
        a.href = blobUrl;
        a.click();
      });
    },
    /**
     * 导出excel
     */
    exportToExcel() {
      let that = this;
      let url = "/management/report/member/invitation/excel";
      if (!this.listQuery.phone) {
        this.$message.error("请输入导出用户手机号");
        return;
      }
      this.listQuery.nickname == ""
        ? (this.listQuery.nickname = undefined)
        : "",
        this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
      let data = {
        phone: this.listQuery.phone,
        startCreateTime: this.listQuery.startCreateTime,
      };
      let datas = JSON.parse(JSON.stringify(data));
      exportBlobUserExcel(url, datas).then((res) => {
        console.log(res, "res");
        const data = res.data;
        const a = document.createElement("a");
        const blob = new Blob([data]);
        const blobUrl = window.URL.createObjectURL(blob);
        a.style.display = "none";
        if (this.listQuery.startCreateTime) {
          a.download =
            this.listQuery.phone +
            "用户" +
            this.listQuery.startCreateTime.substr(0, 10) +
            "邀请详情.xls";
        } else {
          a.download = this.listQuery.phone + "用户" + "邀请详情.xls";
        }
        a.href = blobUrl;
        a.click();
      });
    },
    // 权限管理
    checkPermission,
    // 获取一级黑名单内容
    getSysConfigMeth() {
      getSysConfig({ configKey: "blackList_auction_time" }).then((res) => {
        if (res.code == 0) {
          console.log(res, "黑名单延迟时间");
          this.sysConfigTime = res.data;
        }
      });
    },
    bidsrecords(row) {
      this.$router.push({ path: "bidRecord", query: { userId: row.userId } });
    },
    handleMango() {
      this.dialogMangoVisible = true;
    },
    handleMangoData() {
      givingMango(this.information).then((res) => {
        if (res.code == 0) {
          this.dialogMangoVisible = false;
          this.$message({
            message: "操作Success",
            type: "success",
          });
          this.getList();
          this.information = {};
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      this.listQuery.nickname == ""
        ? (this.listQuery.nickname = undefined)
        : "",
        this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = Number(response.data.total);

        setTimeout(() => {
          this.listLoading = false;
        }, 10);
      });
    },
    // 上传头像
    getFile(file, fileList) {
      let formDate = new FormData();
      formDate.append("multipartFileList", file.raw);
      uploadImgFile(formDate).then((resp) => {
        if (resp.code == 0) {
          this.userAvatarData.avatar = resp.data[0];
        } else {
          this.$message({
            message: resp.msg,
            type: "warning",
          });
        }
      });
    },
    changeAvatar(row) {
      this.userAvatarData.avatar = "";
      this.userAvatar = true;
    },
    changeAvatarDataUpda() {
      addRobotApi(this.userAvatarData).then((res) => {
        if (res.code == 0) {
          this.userAvatar = false;
          this.$message({
            message: "操作Success",
            type: "success",
          });
          this.getList();
        } else {
          this.$message({
            message: resp.msg,
            type: "warning",
          });
        }
      });
    },
    handleFilter() {
      if (this.listQuery.name == "") {
        this.listQuery.name = undefined;
      } else if (this.listQuery.status == "") {
        this.listQuery.status = undefined;
      }
      this.listQuery.current = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      brandDel({ brandId: row.brandId }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "操作Success",
            type: "success",
          });
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        name: "",
        firstChar: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          brandAdd(this.temp).then((res) => {
            if (res.code == 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000,
              });
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleUpdate(row) {
      usersDetail({ userId: row.userId }).then((res) => {
        if (res.code == 0) {
          console.log(res);
          this.temp = res.data.data;
          this.dialogStatus = "update";
          this.dialogFormVisible = true;
          this.fans = false;
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate();
          });
        } else {
          this.$message.error(res.msg);
        }
      });
      // this.temp = Object.assign({}, row)
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          const obj = {};
          obj.brandId = tempData.brandId;
          obj.name = tempData.name;
          obj.firstChar = tempData.firstChar;
          brandEdit(obj).then((res) => {
            if (res.code == 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000,
              });
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    // 启用禁用
    usersForbidden(row) {
      usersForbidden({ userId: row.userId }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "操作Success",
            type: "success",
          });
          this.getList();
        }
      });
    },
    fansShow(row) {
      this.dialogFormVisible = true;
      this.fans = true;
      this.fansQuery.userId = row.userId;
      this.fansList = [];
      this.getFans();
      this.getFansNum();
    },
    getFans() {
      fansList(this.fansQuery).then((response) => {
        this.fansList = response.data.records;
        this.fansTotal = Number(response.data.total);
      });
    },
    getFansNum() {
      fansListNumApi(this.fansQuery).then((response) => {
        this.fansNum = response.data;
      });
    },
    moneyUpdata(row) {
      moneyDetail({ userId: row.userId }).then((res) => {
        if (res.code == 0) {
          this.moneyDialog = true;
          this.moneyData = res.data;
          this.moneyData.userId = row.userId;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    moneyDataUpda() {
      let data = {
        userId: this.moneyData.userId,
        accountDetailType: this.moneyData.accountDetailType,
        money: this.moneyData.money,
        remark: this.moneyData.remark,
        isSendMsg: this.isSendMsg,
        isEarnings: this.isEarnings,
      };
      moneyEdit(data).then((res) => {
        if (res.code == 0) {
          this.moneyDialog = false;
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    intergralUpdata(row) {
      moneyDetail({ userId: row.userId }).then((res) => {
        if (res.code == 0) {
          this.integralDialog = true;
          this.integralData = res.data;
          this.integralData.userId = row.userId;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    integralDataUpda() {
      // console.log(this.integralData);
      // console.log(typeof this.integralType);
      let data = {
        integralType: this.integralType,
        userId: this.integralData.userId,
        integralAmount:
          this.integralType == "1"
            ? this.integralData.integralAmounts
            : this.integralData.superIntegralAmounts,
        integralDetailType: this.integralData.integralDetailType,
        remark: this.integralData.remark,
      };
      integralEdit(data).then((res) => {
        if (res.code == 0) {
          this.integralDialog = false;
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    resetListQuery() {
      this.listQuery = {
        type: 0,
        nickname: undefined,
        phone: undefined,
        time: undefined,
        userId: undefined,
        registerSource: undefined,
        registerChannel: undefined,
      };
      this.getList();
    },
    // 加入黑名单
    blacklistChange(row) {
      let msg = "";
      msg = "是否确认加入黑名单?";
      this.blackForm = {
        nickname: row.nickname,
        userId: row.userId,
        blacklist: "",
      };
      this.dialogBlackFormVisible = true;
    },
    blacklist(row) {
      let msg = "";
      msg = "是否确认移出黑名单?";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          userId: row.userId,
          blacklist: row.blacklist == 0 ? 1 : 0,
        };
        blacklist(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.getList();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      });
    },
    // 黑名单确定
    handleBlackOk() {
      this.$refs["blackForm"].validate((valid) => {
        if (valid) {
          let data = {
            userId: this.blackForm.userId,
            blacklist: Number(this.blackForm.blacklist),
          };
          blacklist(data).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.handleBlackCancel();
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }
      });
    },
    //对话框取消按钮触发事件
    handleBlackCancel() {
      this.dialogBlackFormVisible = false;
      this.blackForm = {};
    },
    nickNameClick(row) {
      this.$router.push({
        path: "userDetail",
        query: { userId: row.userId },
      });
    },
    clickFansName(row) {
      // this.dialogFormVisible = false;
      this.$router.push({
        path: "userDetail",
        query: { userId: row.userId },
      });
    },
    cellclick(row, column, cell, event) {
      // 用户详情
      if (column.property === "avatar") {
        this.$router.push({
          path: "userDetail",
          query: { userId: row.userId },
        });
        // 查看上级搜索
      } else if (column.property === "parentNickname") {
        this.resetListQuery();
        this.listQuery.nickname = row.parentNickname;
        this.listQuery.userId = row.parentId;
        this.getList();
        // 余额 资金明细
      } else if (column.property === "amount") {
        this.$router.push({
          path: "DetailsOfreceiptsAndPayments",
          query: { userId: row.userId, phone: row.phone },
        });
        // 积分明细
      } else if (column.property === "integralAmount") {
        this.$router.push({
          path: "integralRecord",
          query: { phone: row.phone, type: "first" },
        });
      } else if (column.property === "superIntegralAmount") {
        this.$router.push({
          path: "integralRecord",
          query: { phone: row.phone, type: "second" },
        });
      }
    },
    // 用户积分搜索选择
    handleSecChange(e) {
      console.log(e, "e");
      this.listQuery.registerChannel = undefined;
      if (e == 2) {
        registerAllListApi().then((res) => {
          if (res.code == 0) {
            this.registerH5 = res.data;
          }
        });
      }
    },
  },
};
</script>
