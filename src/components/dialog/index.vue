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
					<!-- onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" -->
                    <!-- <el-form-item :label-width="formLabelWidth">
                        <el-input placeholder="请填写物流编号" v-model="item.expressCoding" autocomplete="off"></el-input>
                    </el-form-item> -->
                </div>
                

                <!-- <el-form-item :label-width="formLabelWidth">
                    <span class="addEditor" @click="addOrderCode()">+添加物流单号</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <p class="el-form-item__content">提示：如果一个包裹不够可以填写多个物流单分别派发，最多可添加三个物流单</p>
                </el-form-item> -->
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
    props:['flag','orderId'],
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
        // console.log(this.$route.query,'77');
        // console.log(this.orderId,'5454')
        let Data = Array.from(Object.keys(this.$route.query));
        console.log(Data,'888888');
        if(Data[0] === 'auctionId'){
            orderdetaillistactionId({
                auctionId : this.$route.query.auctionId
            }).then((res)=>{
                console.log(res,'7777777777777777');
                this.orderIds = res.data.order.orderId;
            })
        }else{
            this.orderIds = this.$route.query.orderId;
			orderdetaillist({
				orderId: this.$route.query.orderId
			}).then((res) => {
				let dataTag = JSON.parse(JSON.stringify(res.data.order))
				dataTag.companyName = ''
				if( dataTag.carrierId && dataTag.carrierId != '' ){
					this.form.wuliuValue = dataTag.carrierId
				}
				if( dataTag.logisticsNo != ''){
					this.orderType = 2
					// let obj = {}
					// obj.companyName = dataTag.logisticsNo
					// this.form.trackNum[0] = obj
				}
			})
        }
        
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
        this.$emit('publish',!this.flag);
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
        // console.log(this.form, '这里是获取表单内容的函数，也是点击后校验成功与否的地方')
         deliverGoods({
               orderId:this.orderIds,
               carrierId:this.form.wuliuValue,
			   logisticsNo:this.form.trackNum[0].companyName,
			   type:this.orderType
         }).then((res)=>{
            //  console.error('目前只能加一个','222');
             console.log(res);
             if(res.code == 0){
                 this.$message({
                  message: '发货成功',
                  type: 'success'
                })
                location.reload();
             }else{
                 this.$message(res.msg);
                 location.reload();
             }
         })
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
