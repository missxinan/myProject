<template>
    <div class="express-manage">
        <el-dialog title="发货" :visible.sync="flag" style="padding: 0" :before-close="handleClose">
            <el-form :model="form" style="width: 80%">
                <el-form-item label="物流公司" :label-width="formLabelWidth">
                    <el-select v-model="form.wuliuValue" placeholder="请选择物流公司">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div v-for="(item,index) in form.trackNum" :key="index">
                    <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input
                    v-model="item.companyName"
                    autocomplete="off"
                    type="text"
                    placeholder="物流单号只能是数字"
                    maxlength="24"
                    show-word-limit
                    ></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogSure()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import tableData from './mock.js';
import {
  carrierlist,
  deliverGoods
} from "@/api/orderdetails.js";
import {
  orderdetaillist,
  ordercloseOrder,
  orderdetaillistactionId,
} from "@/api/orderdetails.js";
export default {
    name: 'express-manage',
    props:{
        orderId:{
            type: String,
            default:  ''
            },
        flag:{
            type: Boolean,
            default:  ''
            },
    },
    data() {
      return {
        dialogFormVisible: true,//控制弹框开关
        form: {
          //公司名称
          //快递编码
          remarkArea: '',//备注
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          editorOrAdd: '',
          wuliuValue: '',
          trackNum: [
              {
                  companyName: '',
                  expressCoding: ''
              }
          ]
        },
        formLabelWidth: '120px',
        options: [],
        orderIds:null,
        orderCodeNum: 0 ,//控制添加单号name
		orderType:1
      }
    },
    
    created() {
        carrierlist().then((res)=>{
            if(res.msg === 'success'){
                this.funcoptions(res.data)
            }
        })
    },
    methods: {
      funcoptions(records){
            for(let i = 0 ; i < records.length ; i++){
                this.options.push({value:records[i].carrierId,label:records[i].name})
            }
      },
      handleClose(){
        this.$emit('closeDio',!this.flag);
      },
      handleEdit(editor,index, row) {//编辑按钮
        this.form.editorOrAdd = editor;
        // this.$emit('publish',!this.flag);
        this.dialogFormVisible = !this.dialogFormVisible;
      },
      addExpress(add) {//添加快递公司
        this.form.editorOrAdd = add;
        // this.$emit('publish',!this.flag);
        this.dialogFormVisible = !this.dialogFormVisible;
      },
      dialogSure () {//确定按钮执行的回调
        let obj = {
            // orderId:this.orderIds,
            carrierId:this.form.wuliuValue,
            logisticsNo:this.form.trackNum[0].companyName,
            // type:this.orderType
        }
        this.$emit('callBackSendGoods',obj)
      },
      addOrderCode () {//点击添加单号
        if (this.form.trackNum.length < 4) {
            this.form.trackNum.push({
                [`companyName`]: '',
                [`expressCoding`]: ''
            })
        } else {
            this.messageOpen();
            this.$message({
                message: '警告哦，这里只能添加三次哟',
                type: 'warning'
            });
        }
      }
    }
}
</script>

<style scoped>
.express-manage {
    width: 90%;
    height: 100%;
    margin-left: 5%;
}
.btns {
    margin: 20px 0;
}
.paginat {
    position: absolute;
    bottom: 20px;
    right: 20px;
}
.paginat .totalShow {
    display: inline-block;
}
.addEditor {
    color: rgb(16, 16, 245);
    float: right;
}
.el-form-item {
    margin-bottom: 10px!important;
    padding: 0;
}
.el-form-item .el-form-item__content {
    line-height: 20px!important;
}
</style>
