<template>
    <div class="app-addrules">
        <div class=""></div>
        <el-button
        class="filter-item"
        style="margin-left: 10px;marginTop:20px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
       >添加规则</el-button>
       <el-button type="primary" :icon="namedata.Icon" @click="ordermethod">{{namedata.content}}</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :style="{marginTop:Top}"
    >
      <el-table-column label="创建时间" align="center" >
        <template slot-scope="scope">
            {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="规则" align="center">
        <template slot-scope="scope">出价时间间隔:{{ scope.row.markupSpace }}<br/> 个数:{{scope.row.num}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" style="color:#0099FF">
        <template slot-scope="scope" style="color:#0099FF"><el-button type="text" size="small" @click="dialogFormVisibleEdit(scope.row.id)">编辑</el-button></template>
      </el-table-column>
    </el-table>


    <el-dialog title="新增/编辑" :visible.sync="dialogFormVisible" style="width:1000px;left:50%;marginLeft:-500px">
        <el-form :model="form">
            <el-form-item label="   名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="出价间隔时间" :label-width="formLabelWidthTime">
            <el-input v-model="form.markupSpace" autocomplete="off" placeholder="请输入出价间隔时间" type="number" @keyup.native="Fns($event)" min='1'>
                <template slot="append">秒</template>
            </el-input>
            <div>离上一次出价的时间，包含机器人和用户出价</div>
            </el-form-item>
            <el-form-item label="个数" :label-width="formLabelWidthTime">
            <el-input-number v-model="form.num" controls-position="right" @change="handleChange" :min="2" :max="999" style="width:363px"></el-input-number>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleCalce">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisibleSure">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import checkPermission from "@/utils/addrules";
import { allList,edit,add } from "@/api/addrules";
export default {
	name:'priceRule',
    data() {
        return {
            namedata:{
                Icon:'el-icon-bottom',
                content:'点击正序',
                flag:false
            },
            listLoading: true,
            id:'',
            list:[],
            Top:'30px',
            dialogFormVisible:false,
            form: {
            name: '',
            markupSpace:'',
            num:1,
            },
            formLabelWidth: '98px',
            formLabelWidthTime:'98px',
            flag:false
        }
    },
    created() {
        //请求接口完成任务:
        this.getList();
        
    },

    methods: {
        Fns(e){
            var keynum = window.event?e.keyCode:e.which;
            var keychar = String.fromCharCode(keynum);
            if(keynum==189 || keynum==190 || keynum==110 || keynum==109){
                this.$message.warning('静止输入小数及负数');
                e.target.value = '';
            }
        },
        ordermethod(){
            if(!this.namedata.flag){
                this.namedata.Icon = 'el-icon-top';
                this.namedata.content = '点击倒序';
                this.namedata.flag = true;
            }else{
                this.namedata.Icon = 'el-icon-bottom';
                this.namedata.content = '点击正序';
                this.namedata.flag = false;
            }
            this.list.reverse();
        },
        //节流函数 如有必要需要添加。
        throttle(handle, wait) {
            let lastTime = 0;
            return function (e) {
                let nowTime = new Date().getTime()
                if (nowTime - lastTime > wait) {
                    handle();
                    lastTime = nowTime;
                }
            }
        },
        dialogFormVisibleEdit(id){
            this.id = id;
            this.list.some((item,index)=>{
                if(item.id === this.id){
                    this.form.name = item.name;
                    this.form.markupSpace = item.markupSpace;
                    this.form.num = item.num;
                }
            })
            this.dialogFormVisible = true;

        },
        //初次加载函数
        getList(){
            allList().then((res)=>{
                if(res.msg === 'success'){
                    this.list = res.data
                }else{
                    console.error('服务器开小拆了！')
                }
                this.listLoading = false
            })
        },
        handleChange(value){
            console.log('Hello，world')
        },
        handleCreate(){
            this.dialogFormVisible = true;
            this.flag = true
        },
        ToEcho(){
            //去回显
            for(let key in this.form){
                this.form[key] = '';
            }
            //关闭弹框
            this.dialogFormVisible = false;
            this.flag = false;
        },
        dialogFormVisibleSure(){
            let Fnonblank = true;
            //一个是添加函数， 另一个是编辑部分，此处用flag做操作。
            if(this.flag){
                for(var key in this.form){
                    if(this.form[key] === '' || this.form[key]===undefined || this.form[key]===null){
                        Fnonblank = false;
                        switch(key){
                            case 'name' : this.$message('名称不能为空！');
                            break
                            case 'markupSpace' : this.$message('出价间隔时间不能为空！');
                            break
                            case 'num' : this.$message('请填写相对应得个数');
                        }
                        break
                    }
                }
                if(Fnonblank){
                    add(this.form).then((res)=>{
                        if(res.msg === "success"){
                            this.list.unshift(res.data);
                            this.ToEcho();
                            // location.reload()
                        }else{
                            this.ToEcho();
                            this.$message(res.msg);
                            // location.reload()
                        }
                    })
                }
                
            }else{
                let Fnonblank = true;
                let flag = {}
                this.list.some((item,index)=>{
                    if(item.id === this.id){
                        item.name = this.form.name;
                        item.markupSpace = this.form.markupSpace;
                        item.num = this.form.num;
                        flag = {...this.form,id:this.id};
                        return true;
                    }
                })
                for(var key in flag){
                    if(flag[key] === '' || flag[key]===undefined || flag[key]===null){
                        Fnonblank = false;
                        switch(key){
                            case 'name' : this.$message('名称不能为空！');
                            break
                            case 'markupSpace' : this.$message('出价间隔时间不能为空！');
                            break
                            case 'num' : this.$message('请填写相对应得个数');
                        }
                        break
                    }
                }
                if(Fnonblank){
                    edit(flag).then((res)=>{
                        if(res.msg === "success"){
                            this.ToEcho();
                            location.reload()
                        }else{
                            this.$message(res.msg);
                            this.ToEcho();
                            location.reload()
                        }
                    })
                }
                
            }
            
            
        },
        //提示框
        openVn() {
            const h = this.$createElement;
            this.$message({
            message: h('p', null, [
                h('span', null, '接口处理有误，请联系管理员 '),
                h('i', { style: 'color: teal' }, 'jiasu')
            ])
            });
        },
        dialogFormVisibleCalce(){
            this.ToEcho()
        }
    },
}
</script>

<style scoped>
    .app-addrules{
        background-color: rgba(244, 244, 244, 1);
		padding: 20px;
    }
    #a9{
            border-width: 0px;
            position: absolute;
            left: 240px;
            top: 96px;
            width: 1208px;
            height: 732px;
    }
    .ad_default{
        font-family: 'ArialMT', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        color: #333333;
        text-align: center;
        line-height: normal;
    }
</style>
