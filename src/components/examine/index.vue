<template>
<div>
    
    <!-- <div slot="header" class="clearfix">
        <span>广告名称:{{Obj.name}}</span>
    </div> -->
    
    <el-form ref="dataForm"  label-position="left" label-width="100px" style="width: 480px; margin-left:50px;">
        <el-form-item label="终端">
          	<el-checkbox-group v-model="checkList" :disabled="true">
				<el-checkbox label="1" >小程序</el-checkbox>
				<el-checkbox label="2" >APP</el-checkbox>
			</el-checkbox-group>
        </el-form-item>
        <el-form-item label="广告名称" prop="sort">
			<el-input v-model="Obj.name"  :disabled="true"/>
		</el-form-item>
        <el-form-item label="广告位" prop="sort">
			<el-input v-model="bannerPositionposition"  :disabled="true"/>
		</el-form-item>
        <el-form-item label="广告图片" prop="sort">
            <img  v-if="Obj.image" class="tempPic" :src="Obj.image" alt="" />
		</el-form-item>
         <el-form-item label="广告列表图" prop="minImage">
            <img  v-for="item in Obj.minImage" class="tempPic" :src="item.imageUrl" alt="" />
		</el-form-item>
        <el-form-item label="广告时间" prop="sort">
            <el-input v-model="time"  :disabled="true" />
		</el-form-item>
        <el-form-item label="投放时间" prop="sort">
            <el-input v-model="Obj.createTime"  :disabled="true" />
		</el-form-item>
        <el-form-item label="广告类型" prop="sort">
            <el-select
				v-model="Obj.type"
				placeholder="类型"
				clearable
				class="filter-item"
				style="width: 240px"
                :disabled="true"
			>
				<el-option
				v-for="item in advertisementType"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				/>
			</el-select>
		</el-form-item>
        <el-form-item label="H5链接" class="is-required" v-if="Obj.type == 1 || Obj.type == 7">
          <el-input v-model="Obj.linkId"  :disabled="true" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="选择商品" class="is-required" v-if="Obj.type == 2 || Obj.type == 8">
          <el-input v-model="Obj.linkId" :disabled="true" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="类目" class="is-required" v-if="Obj.type == 3">
			<el-cascader
			placeholder="请选择商品分类"
			:props="Props"
			:options="category"
			v-model="Obj.linkId"
            :disabled="true"
			></el-cascader>
        </el-form-item>
        <el-form-item label="小程序" class="is-required" v-if="Obj.type == 4">
          <el-input v-model="Obj.linkId" :disabled="true" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="权重" prop="sort">
            <el-input v-model="Obj.sort"  :disabled="true" />
		</el-form-item>
         <el-form-item label="广告提示语" prop="prompt">
            <el-input v-model="Obj.prompt"  :disabled="true" />
		</el-form-item>
    </el-form>
    
</div>

</template>

<script>
import {bannerPosition} from '@/api/TheADID'
import {treeApi} from '@/api/AuctionsRecord'
export default {
    props:{
        examineshoppingvalue:{
            type: Object,
            require: true
        }
    },
    data() {
        return {
           names:'',
           advertisementType:[
                {
                    value: 1,
                    label: 'H5'
                },
                {
                    value: 2,
                    label: '拍卖商品'
                },
                {
                    value: 3,
                    label: '分类'
                },
                {
                    value: 4,
                    label: '小程序'
                },
                {
                    value: 5,
                    label: '拍卖区域'
                },
                {
                    value: 6,
                    label: '无跳转'
                },
                {
                    value: 7,
                    label: '抽奖'
                },
                {
                    value: 8,
                    label: '积分商城'
                }
           ],
            checkList:[],
            bannerPositionarr:[],
            bannerPositionposition:'',
            time:'',
            Obj:null,
            Props:{
                value:'value',
                label:'label',
                children:'children'
            },
            category:[],
            Props:{
                value:'value',
                label:'label',
                children:'children'
            },
        }
    },
    created() {
        console.log(this.examineshoppingvalue);
        this.Obj = this.examineshoppingvalue;
        if(this.Obj.type === 1 || this.Obj.type === 7){
            this.names = "H5链接"
        }else if(this.Obj.type === 2 || this.Obj.type === 8){
            this.names = "商品"
        }else if(this.Obj.type === 3){
            this.names = "分类"
        }else if(this.Obj.type === 4){
            this.names = "小程序"
        }else if(this.Obj.type === 5){
            this.names = "拍卖区域"
        }
        const datas = this.examineshoppingvalue;
        if(datas.displayPosition.length>0){
            this.checkList = datas.displayPosition.split(',')
        }
        this.bannerPositionmethod();
    },
    methods: {
        bannerPositionmethod(){
            bannerPosition().then((res)=>{
                res.data.records.some((item,index)=>{
                    if(item.id === this.Obj.positionId){
                        this.bannerPositionposition = item.name
                    }
                })
                this.time = this.Obj.startTime + '~' + this.Obj.endTime;
            })
            treeApi().then((res)=>{
                let test = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].subCategorys.length > 0) {
                        test.push({
                            value: res.data[i].categoryId,
                            label: res.data[i].name,
                            children: []
                        })
                        for (let j = 0; j < res.data[i].subCategorys.length; j++) {
                            test[i].children.push({
                                value: res.data[i].subCategorys[j].categoryId,
                                label: res.data[i].subCategorys[j].name
                            })
                        }
                    } else {
                        test.push({
                            value: res.data[i].categoryId,
                            label: res.data[i].name,
                            disabled: true,
                        })
                    }

                }
                this.category = test;
            })
        },
        dialogFormVisible(){
            this.$emit('examineshoppings',false)
        },
        getChange(){

        }
    },
}
</script>

<style scoped>
.tempPic{
    width: 100px;
    height: 100px;
}   
</style>
