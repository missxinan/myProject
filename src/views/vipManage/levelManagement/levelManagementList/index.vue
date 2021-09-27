<template>
  <div class="headQuarters-list">
    <div class="search-content">
      <div class="item item-handle">
        <!-- <span class="item-title">等级名称：</span> -->
        <el-input class="item-input" v-model.trim="name" placeholder="请输入等级名称" @keyup.enter.native="search"></el-input>
        <el-button type="primary" class="search-left" @click="search">搜索</el-button>
        <el-button @click="addVipLevel" type="primary">添加等级</el-button>
      </div>
    </div>
    <div class="tablelist">
      <el-table
        :data="dataList"
        border
        class="list"
        style="width: 100%"
        max-height="650">
        <el-table-column  label="序号" type="index" align="center" width="60"></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="等级名称">
        </el-table-column>
        <el-table-column
          prop="limitNum"
          align="center"
          label="一天限制个数">
        </el-table-column>
        <el-table-column
          prop="limitPoint"
          align="center"
          label="单点限制个数">
        </el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="levelId"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="editVipManageLevel(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="dialogName"
        :visible.sync="isShow"
        width="40%"
        >
        <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="等级名称" prop="name" required>
            <el-input
              class="item-input"
              type="text"
              placeholder="请输入等级名称"
              v-model.trim="ruleForm.name"
              maxlength="30"
              show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="一天限制个数" prop="limitNum" required>
            <el-input
              class="item-input"
              type="text"
              placeholder="请输入一天限制个数"
              v-model.number="ruleForm.limitNum"
              maxlength="30"
              show-word-limit
              @blur="BlurText($event)"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="单点限制个数" prop="limitPoint" required>
            <el-input
              class="item-input"
              type="text"
              placeholder="请输入单点限制个数"
              v-model.number="ruleForm.limitPoint"
              maxlength="30"
              show-word-limit
              @blur="BlurText($event)"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="item-input"  v-model="ruleForm.remark" placeholder="请输入备注"  maxlength="30" show-word-limit></el-input>
          </el-form-item>
			</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="vipManageLevelSave">保 存</el-button>
      </span>
</el-dialog>
  </div>
</template>
<script>
  import { vipLevelList, vipLevelAdd, vipLevelDetail, vipLevelEdit } from "@/api/vipMange.js";
  export default {
    name: 'levelManagementList',
    data() {
      return {
        name: '',
        dataList:[],
        size:10,
        current: 1,
        total: 0,
        dialogName: '新增',
        isShow: false, // 新增修改弹框是否显示
        ruleForm:{},
      }
    },
    created(){
      this.getDataList();
    },
    methods:{
      //  添加vip等级
      addVipLevel(){
        this.ruleForm = {};
        this.dialogName = '新增';
        this.isShow = true;
        if(this.$refs['ruleForm']){
        this.$refs['ruleForm'].resetFields();
        }
      },

   //  修改等级数据
      editVipManageLevel(rows){
        vipLevelDetail({id: rows.levelId}).then((res)=>{
          if(res.code == '00000'){
            this.isShow = true;
            this.dialogName = '修改';
            this.ruleForm = {
              levelId: res.data.levelId,
              limitNum: res.data.limitNum || '',
              name: res.data.name,
              remark: res.data.remark || '',
              limitPoint:  res.data.limitPoint || ''
            };
          }
        });
       },
      //获取列表
      getDataList(){
        let data = {
          name: this.name,
          size: this.size,
          current: this.current
        }
        vipLevelList(data).then(res =>{
          if(res.code == '00000'){
            this.dataList = res.data.records;
            this.total = Number(res.data.total);
          }
        })
      },
       // 搜索
      search(){
        this.current = 1;
        this.getDataList();
      },
      // 重置
      reset(){
        // this.time = '';
        // this.nick = '';
        // this.userNamePhone = '';
        this.name=''
        this.getDataList();
      },
      // 分页
      handleCurrentChange(page){
        this.current = page;
        this.getDataList();
      },
      // 条数
      handleSizeChange(page){
        this.size = page;
        this.getDataList();
      },
      BlurText(e){
        let boolean = new RegExp('^[1-9][0-9]*$').test(e.target.value)
        if(!boolean){
          this.$message.warning('限制个数请输入正整数')
          e.target.value = ''
        }
      },
      // 添加修改保存
      vipManageLevelSave (){
        let data = this.ruleForm;
         this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
              const message = data.levelId ? '修改' : '添加';
              if(data.levelId){
          vipLevelEdit(data).then((res)=>{
              this.isShow = false;
              this.$refs['ruleForm'].resetFields();
              this.ruleForm.levelId = null;
              this.$message({
                  showClose: true,
                  message: `${message}成功`,
                  type: 'success'
                });
              this.getDataList();
            });
              } else {
            vipLevelAdd(data).then((res)=>{
              this.isShow = false;
              this.$refs['ruleForm'].resetFields();
              this.$message({
                  showClose: true,
                  message: `${message}成功`,
                  type: 'success'
                });
              this.getDataList();
            });
              }

          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .headQuarters-list{
    padding: 24px;
    .add-company{
      margin-bottom: 24px;
    }
    .search-content{
      display: block;
      // margin-bottom: 10px;
      .item{
        display: inline-block;
        width: 20%;
        margin-bottom: 24px;
        margin-right: 1%;
      }

      .item:first-child{
        width: 100%;
      }
      .item-title{
        font-size: 14px;
      }
      .item-picker{
        width: 300px;
      }
      .item-input{
        width: 220px;
        display: inline-block;
      }
      .search-left{
        margin-left: 20px;
      }
    }
    .tablelist{
      .list{
        margin-bottom: 30px;
      }
    }
    .table-paging{
      display: flex;
      justify-content : flex-end;
    }
    .passwordBomb{
      .company-name{
        margin-bottom: 24px;
        display: flex;
        justify-content:space-around;
        align-items: center;
        .name-text{
          display: inline-block;
          line-height: 40px;
        }
        .name-value{
          display: inline-block;
          width: 300px;
        }
      }
      .company-password{
        margin-bottom: 24px;
        display: flex;
        justify-content:space-around;
        .password-text{
          display: inline-block;
          line-height: 40px;
        }
        .password-text::before{
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
        .password-input{
          display: inline-block;
          width: 300px;
        }
      }
    }
    .table-btn{
      cursor:pointer
    }
    .btn-red{
      color: #f56c6c
    }
    .btn-blue{
      color: #409eff
    }
  }
</style>
