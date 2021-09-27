<template>
  <div class="app-container">
        <div class="filter-container">
          <el-select
            v-model="userlistQuery.status"
            placeholder="审核状态"
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
          <el-date-picker
            v-model="userlistQuery.time"
            type="datetimerange"
            clearable
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="申请开始时间"
            end-placeholder="申请结束日期"
            style="width:350px;"
          ></el-date-picker>
          <el-date-picker
            v-model="userlistQuery.auditTime"
            type="datetimerange"
            clearable
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="审核开始时间"
            end-placeholder="审核结束日期"
            style="width:350px;"
          ></el-date-picker>
          <el-input
            v-model="userlistQuery.accountAccountName"
            clearable
            placeholder="用户昵称/手机号"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="userlistQuery.type"
            placeholder="收款方式"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in moneyTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
          <el-button class="filter-item" type="primary" @click="withDrawListUp()">导出</el-button>
          <el-button type='text'>金额：{{totalPrice}}</el-button>
        </div>
        <div style="height: 20px;"></div>
        <el-table
          v-loading="listLoading"
          :data="userlist"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span @click="toUserDetail(scope.row)">{{ scope.row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号名称" align="center">
            <template slot-scope="scope">
              <span
                style="color: #0066CC;cursor: pointer;"
                :class="[scope.row.blacklist !== 0 && scope.row.blacklist? 'warning-row' : '']"
                @click="toUserDetail(scope.row)"
              >{{ scope.row.accountName == '' ? scope.row.account : scope.row.accountName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.applyTime }}</span>
            </template>
          </el-table-column>
           <el-table-column label="收款账户" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.withdrawAccount }}</span>
            </template>
          </el-table-column>
           <el-table-column label="收款账户名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.withdrawName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditMan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.auditTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" class-name="status-col">
            <template slot-scope="{row}">
              <el-tag
                :type="row.status == 1  && (row.blacklist == 0 || !row.blacklist ) ? 'Warning' : row.status == 2  && (row.blacklist == 0 || !row.blacklist ) ?  'success' : 'danger'"
              >{{ row.status == 1 ? '待审核' : row.status == 2 ? '审核通过' :row.status == 3 ? '拒绝' : '提现撤回' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="账号状态" align="center">
            <template slot-scope="{row}">{{(row.blacklist == 0 || !row.blacklist)  ? '正常' : row.blacklist == 1 ? '黑名单一级': row.blacklist == 2 ? '黑名单二级': '黑名单三级'}}</template>
          </el-table-column>
          <el-table-column label="收款方式" align="center">
            <template slot-scope="{row}">{{row.type == 0 ? '微信': '支付宝'}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button
                v-if="row.status == 1 && row.blacklist!==3 && checkPermission(['finance:withDraw:reviewe'])"
                type="primary"
                size="mini"
                @click="handleStart(row)"
              >审核</el-button>
            </template>
          </el-table-column>
        <pagination
          v-show="usertotal>0"
          :total="usertotal"
          :page.sync="userlistQuery.current"
          :limit.sync="userlistQuery.size"
          :currentPage="userlistQuery.current"
          @pagination="getList"
        />
          <!-- <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button
                v-if="row.status == 1 && checkPermission(['finance:withDraw:reviewe'])"
                type="primary"
                size="mini"
                @click="gshandleStart(row)"
              >审核</el-button>
              <el-button
                v-if="row.status != 1"
                type="primary"
                size="mini"
                @click="viphandleStartSee(row)"
              >查看</el-button>
            </template>
          </el-table-column> -->
      </el-table>
      <pagination
        v-show="usertotal>0"
        :total="usertotal"
        :page.sync="userlistQuery.current"
        :limit.sync="userlistQuery.size"
        :currentPage="userlistQuery.current"
        @pagination="getList"
      />
    <!-- 公司审核 -->
    <el-dialog title="审核/查看" :visible.sync="dialogFormgs">
      <el-form
        ref="gsdataForm"
        :model="gsTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="申请时间">
          <span>{{ gsTemp.applyTime }}</span>
        </el-form-item>
        <el-form-item label="提现金额">
          <span>{{ gsTemp.amount }}</span>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="gsTemp.status">
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <textarea v-model="gsTemp.remark" maxlength="100"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormgs = false">取消</el-button>
        <el-button
          v-if="gsUpdateType == true && activeName == 2 "
          type="primary"
          @click="updateDatags()"
           :disabled="submitClick"
        >提交</el-button>
        <el-button
          v-if="gsUpdateType == true && activeName == 3"
          type="primary"
          @click="vipDrawUpdates()"
          :disabled="submitClick"
        >提交</el-button>
      </div>
    </el-dialog>

    <!-- 用户审核 -->
    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="审核内容: " prop="remark">
          <textarea v-model="temp.remark" maxlength="100"></textarea>
        </el-form-item>
        <el-form-item label="审核状态: " prop="status">
          <el-radio v-model="status" label="2">审核通过</el-radio>
          <el-radio v-model="status" label="3">审核不通过</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"  :disabled="submitClick"  @click="updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  audit,
  userfetchList,
  useraudit,
  gsCompentDetail,
  vipWithDraw,
  vipDrawUp,
  vipDrawSee,
  countMoneyApi
} from "@/api/withdraw";
import { uploadImgFile } from "@/api/adver";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {exportBlob} from "@/api/blob"

const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "1",
    display_name: "审核中"
  },
  {
    key: "2",
    display_name: "审核通过"
  },
  {
    key: "3",
    display_name: "审核拒绝"
  }
];

const moneyTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "0",
    display_name: "微信"
  },
  {
    key: "1",
    display_name: "支付宝"
  }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "withdraw",
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 1,
      list: null,
      userlist: null,
      total: 0,
      usertotal: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
        nickName: undefined,
        phone: undefined,
        status: undefined,
        account: undefined
      },
      userlistQuery: {
        current: 1,
        size: 10,
        time: undefined,
        nickName: undefined,
        phone: undefined,
        status: '1',
        accountAccountName: undefined,
        auditTime: undefined,
        type:undefined,
        chargeType:undefined
      },
      calendarTypeOptions,
      moneyTypeOptions,
      positionList: [],
      dialogFormVisible: false,
      status: "1",
      temp: {
        id: "",
        status: "",
        remark: ""
      },
      activeName: "1",
      // 公司审核展示
      dialogFormgs: false,
      gsTemp: {},
      gsUpdateType: true,
      submitClick: false
    };
  },
  created() {
    this.getList();
    this.getCountMoney();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      if (this.activeName == "2") {
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
        this.listQuery.startAuditTime = this.listQuery.auditTime ? this.listQuery.auditTime[0] : undefined;
        this.listQuery.endAuditTime =  this.listQuery.auditTime ? this.listQuery.auditTime[1] : undefined;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = Number(response.data.total);
          this.listLoading = false;
          // Just to simulate the time of the request
        });
      } else if (this.activeName == "1") {
        this.userlistQuery.time
          ? ((this.userlistQuery.startCreateTime = this.userlistQuery.time[0]),
            (this.userlistQuery.endCreateTime = this.userlistQuery.time[1]))
          : ((this.userlistQuery.startCreateTime = undefined),
            (this.userlistQuery.endCreateTime = undefined));
        this.userlistQuery.auditTime
          ? ((this.userlistQuery.startAuditTime = this.userlistQuery.auditTime[0]),
            (this.userlistQuery.endAuditTime = this.userlistQuery.auditTime[1]))
          : ((this.userlistQuery.startAuditTime = undefined),
            (this.userlistQuery.endAuditTime = undefined));
        this.userlistQuery.accountAccountName == ""
          ? (this.userlistQuery.accountAccountName = undefined)
          : "";
        userfetchList(this.userlistQuery).then(response => {
          this.userlist = response.data.records;
          this.usertotal = Number(response.data.total);
          this.listLoading = false;
        });
      } else {
        //vipWithDraw
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
        this.listQuery.startAuditTime = this.listQuery.auditTime ? this.listQuery.auditTime[0] : undefined;
        this.listQuery.endAuditTime =  this.listQuery.auditTime ? this.listQuery.auditTime[1] : undefined;
        vipWithDraw(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = Number(response.data.total);
          this.listLoading = false;
          // Just to simulate the time of the request
        });
      }
    },
    handleFilter() {
      if (this.listQuery.status == "") {
        this.listQuery.status = undefined;
      } else if (this.listQuery.phone == "") {
        this.listQuery.phone = undefined;
      }
      this.listQuery.current = 1;
      this.userlistQuery.current = 1;
      this.getCountMoney();
      this.getList();
    },
    getCountMoney(){
        this.userlistQuery.time
          ? ((this.userlistQuery.startCreateTime = this.userlistQuery.time[0]),
            (this.userlistQuery.endCreateTime = this.userlistQuery.time[1]))
          : ((this.userlistQuery.startCreateTime = undefined),
            (this.userlistQuery.endCreateTime = undefined));
        this.userlistQuery.auditTime
          ? ((this.userlistQuery.startAuditTime = this.userlistQuery.auditTime[0]),
            (this.userlistQuery.endAuditTime = this.userlistQuery.auditTime[1]))
          : ((this.userlistQuery.startAuditTime = undefined),
            (this.userlistQuery.endAuditTime = undefined));
        this.userlistQuery.accountAccountName == ""
          ? (this.userlistQuery.accountAccountName = undefined)
          : "";
        countMoneyApi(this.userlistQuery).then(res => {
          this.totalPrice = res.data
        });
    },
    // 审核
    resetTemp() {
      this.temp = {
        id: "",
        status: "",
        remark: ""
      };
    },
    handleStart(row) {
      this.resetTemp();
      this.temp.id = row.id;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.status = this.status;
          this.submitClick = true
          if (this.activeName == "1") {
            useraudit(this.temp).then(res => {
              this.submitClick = false
              if (res.code == 0) {
                this.dialogFormVisible = false;
                this.$notify({
                  title: "Success",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: "error",
                  message: res.msg,
                  type: "error",
                  duration: 2000
                });
              }
            });
          } else {
            audit(this.temp).then(res => {
              this.submitClick = false
              if (res.code == 0) {
                this.dialogFormVisible = false;
                this.$notify({
                  title: "Success",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
                this.getList();
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
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (this.activeName != tab.name) {
        this.list = [];
        this.userlistQuery = {
          current: 1,
          size: 20,
          time: undefined,
          nickName: undefined,
          phone: undefined,
          status: undefined,
          accountAccountName: undefined,
          auditTime: undefined
        };
        this.listQuery = {
          current: 1,
          size: 20,
          time: undefined,
          nickName: undefined,
          phone: undefined,
          status: undefined,
          accountAccountName: undefined,
          auditTime: undefined
        };
      }
      this.getList();
    },
    gshandleStart(row) {
      // this.resetgsTemp()
      this.gsTemp = JSON.parse(JSON.stringify(row));
      this.temp.id = row.id;
      this.dialogFormgs = true;
      this.gsUpdateType = true;
    },
    gshandleStartSee(row) {
      gsCompentDetail({
        id: row.id
      }).then(res => {
        if (res.code == 0) {
          this.gsTemp = res.data;
          this.gsUpdateType = false;
          this.dialogFormgs = true;
        } else {
          this.$notify({
            title: "error",
            message: res.msg,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    viphandleStartSee(row) {
      vipDrawSee({
        id: row.id
      }).then(res => {
        if (res.code == 0) {
          this.gsTemp = res.data;
          this.gsUpdateType = false;
          this.dialogFormgs = true;
        } else {
          this.$notify({
            title: "error",
            message: res.msg,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    updateDatags() {
      console.log(this.gsTemp, "this.gsTemp");
      let data = {
        status: this.gsTemp.status,
        id: this.gsTemp.id
      };
      if (this.gsTemp.remark != "") {
        data.remark = this.gsTemp.remark;
      }
      this.submitClick = true
      audit(data).then(res => {
         this.submitClick = false
        if (res.code == 0) {
          this.dialogFormgs = false;
          this.$notify({
            title: "Success",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          this.getList();
        } else {
          this.$notify({
            title: "error",
            message: res.msg,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    // vipDrawUpdate
    vipDrawUpdates() {
      console.log(this.gsTemp, "this.gsTemp");
      let data = {
        status: this.gsTemp.status,
        id: this.gsTemp.id
      };
      if (this.gsTemp.remark != "") {
        data.remark = this.gsTemp.remark;
      }
       this.submitClick = true
      vipDrawUp(data).then(res => {
        this.submitClick = false
        if (res.code == 0) {
          this.dialogFormgs = false;
          this.$notify({
            title: "Success",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          this.getList();
        } else {
          this.$notify({
            title: "error",
            message: res.msg,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    getFile(file, fileList) {
      let formDate = new FormData();
      formDate.append("multipartFileList", file.raw);
      uploadImgFile(formDate).then(resp => {
        if (resp.code == 0) {
          this.gsTemp.payeeRecord = resp.data[0];
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          });
        }
      });
    },
     // 到收支明细
    cellclick(row, column, cell, event) {
      if (column.property === "totalIncome") {
        let partnerId = row.partnerId;
        this.$router.push({
          path: "/vipMange/incomeAndPayDetail",
          query: {
            vipId: row.vipId
          }
        });
      }
    },
    // 用户提现导出
    withDrawListUp() {
      console.log(this.userlistQuery,'this.userlistQuery')
      let that = this;
      if((this.userlistQuery.auditTime == [] && this.userlistQuery.time == []) || (this.userlistQuery.auditTime == undefined && this.userlistQuery.time == undefined )){
					this.$message.error('请选择导出时间段');
					return
      }
      // console.log((new Date(this.userlistQuery.auditTime[1]).getTime() - new Date(this.userlistQuery.auditTime[0]).getTime()),'12')
      if(this.userlistQuery.auditTime != [] && this.userlistQuery.auditTime != undefined ){
        if( (new Date(this.userlistQuery.auditTime[1]).getTime() - new Date(this.userlistQuery.auditTime[0]).getTime()) > 30*24*60*60*1000 ){
        	this.$message.error('只能导一个月内的数据');
					return
        }
      }
      if(this.userlistQuery.time != [] && this.userlistQuery.time != undefined){
        if( (new Date(this.userlistQuery.time[1]).getTime() - new Date(this.userlistQuery.time[0]).getTime()) > 30*24*60*60*1000 ){
        	this.$message.error('只能导一个月内的数据');
					return
        }
      }
      this.userlistQuery.time
        ? ((this.userlistQuery.startCreateTime = this.userlistQuery.time[0]),
          (this.userlistQuery.endCreateTime = this.userlistQuery.time[1]))
        : ((this.userlistQuery.startCreateTime = undefined),
          (this.userlistQuery.endCreateTime = undefined));
      this.userlistQuery.auditTime
        ? ((this.userlistQuery.startAuditTime = this.userlistQuery.auditTime[0]),
          (this.userlistQuery.endAuditTime = this.userlistQuery.auditTime[1]))
        : ((this.userlistQuery.startAuditTime = undefined),
          (this.userlistQuery.endAuditTime = undefined));
       let datas = JSON.parse(JSON.stringify(this.userlistQuery));

	   exportBlob('management/member/withdraw/excel',datas).then(res=>{
          console.log(res,'res')
          if( res.code && res.code == 1 ){
            this.$message.error(res.msg)
          }
					const data = res.data;
					const a = document.createElement('a');
					const blob = new Blob([data]);
					const blobUrl = window.URL.createObjectURL(blob);
					a.style.display = 'none';
					a.download = '提现列表.xls';
					a.href = blobUrl;
					a.click();
        })
    },
    // 公司提现导出
    compentExport(){
      if(!this.listQuery.time &&  !this.listQuery.auditTime){
					this.$message.error('请选择时间');
					return
      }
      if( this.listQuery.time ){
        if((new Date(this.listQuery.time[1]).getTime() - new Date(this.listQuery.time[0]).getTime()) > 30*24*60*60*1000 ){
            this.$message.error('只能导一个月内的数据');
            return
        }
      }
      if( this.listQuery.auditTime ){
           if( (new Date(this.listQuery.auditTime[1]).getTime() - new Date(this.listQuery.auditTime[0]).getTime()) > 30*24*60*60*1000 ){
              this.$message.error('只能导一个月内的数据');
              return
            }
      }
      this.listQuery.time
        ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
          (this.listQuery.endCreateTime = this.listQuery.time[1]))
        : ((this.listQuery.startCreateTime = undefined),
          (this.listQuery.endCreateTime = undefined));
      this.listQuery.startAuditTime = this.listQuery.auditTime ? this.listQuery.auditTime[0] : undefined;
      this.listQuery.endAuditTime =  this.listQuery.auditTime ? this.listQuery.auditTime[1] : undefined;
       let datas = JSON.parse(JSON.stringify(this.listQuery));
      exportBlob('upms/partner/withdraw/excel',datas).then(res=>{
          console.log(res,'res')
          if( res.code && res.code == 1 ){
            this.$message.error(res.msg)
          }
					const data = res.data;
					const a = document.createElement('a');
					const blob = new Blob([data]);
					const blobUrl = window.URL.createObjectURL(blob);
					a.style.display = 'none';
					a.download = '合伙人提现列表.xls';
					a.href = blobUrl;
					a.click();
        })

    },
    //店主提现导出
    vipWithdrawExport(){
       if(!this.listQuery.time &&  !this.listQuery.auditTime){
					this.$message.error('请选择时间');
					return
      }
      if( this.listQuery.time ){
        if((new Date(this.listQuery.time[1]).getTime() - new Date(this.listQuery.time[0]).getTime()) > 30*24*60*60*1000 ){
            this.$message.error('只能导一个月内的数据');
            return
        }
      }
      if( this.listQuery.auditTime ){
           if( (new Date(this.listQuery.auditTime[1]).getTime() - new Date(this.listQuery.auditTime[0]).getTime()) > 30*24*60*60*1000 ){
              this.$message.error('只能导一个月内的数据');
              return
            }
      }
      this.listQuery.time
        ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
          (this.listQuery.endCreateTime = this.listQuery.time[1]))
        : ((this.listQuery.startCreateTime = undefined),
          (this.listQuery.endCreateTime = undefined));
      this.listQuery.startAuditTime = this.listQuery.auditTime ? this.listQuery.auditTime[0] : undefined;
      this.listQuery.endAuditTime =  this.listQuery.auditTime ? this.listQuery.auditTime[1] : undefined;
       let datas = JSON.parse(JSON.stringify(this.listQuery));
      exportBlob('upms/vipWithdraw/excel',datas).then(res=>{
          console.log(res,'res')
          if( res.code && res.code == 1 ){
            this.$message.error(res.msg)
          }
					const data = res.data;
					const a = document.createElement('a');
					const blob = new Blob([data]);
					const blobUrl = window.URL.createObjectURL(blob);
					a.style.display = 'none';
					a.download = '店主提现列表.xls';
					a.href = blobUrl;
					a.click();
        })
    },
    toUserDetail(row) {
      // this.$router.push({
      // 	path: '/users/userDetail',
      // 	query: {
      // 		userId: row.userId
      // 	}
      // })
      //  this.$router.push({
      //   path: "DetailsOfreceiptsAndPayments",
      //   query: { userId: row.userId, phone: row.phone }
      // });
      this.$router.push({
        path: "/users/DetailsOfreceiptsAndPayments",
        query: { userId: row.userId, phone: row.phone }
      })
      // window.open(routeData.href, "_blank");
    },
    tomoneydetail(row) {
      console.log(row, "row");
      let routeData = this.$router.resolve({
        path: "/moneyList/comMoneyDetail",
        query: { userId: row.userId }
      });
      window.open(routeData.href, "_blank");
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.blacklist != 0 && row.blacklist) {
        return "warning-row";
      }
      return "";
    }
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 16px;
}
.warning-row {
  color: red !important;
}
.total_blue {
    color: #409eff;
    cursor: pointer;
  }
</style>
