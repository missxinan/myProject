<template>
    <el-dialog :visible.sync="goodsDialog" :before-close="handleClose" title="选择商品">
        <div class="goods-choice">
            <el-form :inline="true" :model="form" class="forms" size="mini">
                <div class="block">
                    <span class="demonstration">商品分类</span>
                    <el-cascader
                        v-model="ProductionPrice.cascade"
                        :options="options"
                        :props="props"
                        collapse-tags
                        @change="handleChange"
                        clearable></el-cascader>
                </div>
                <div class="block">
                    <span>商品名称:</span>
                    <el-input v-model="ProductionPrice.productName" placeholder="请输入内容" style="width:210px"></el-input>
                </div>
                <el-button type="primary" size="mini" @click="search">搜索</el-button>
            </el-form>
            <el-tabs v-model="goodsType" @tab-click="handleClick">
                <el-tab-pane label="换购" name="1"></el-tab-pane>
                <el-tab-pane label="寄拍" name="2"></el-tab-pane>
            </el-tabs>
            <el-table :key="tableKey" v-loading="listLoading" :data="goodsList" border fit highlight-current-row style="width: 100%;"
            @sort-change="sortChange">
                    <el-table-column label="商品名称" type="index" align="center" width='200px'>
                    <template slot-scope="scope">
                        <span>{{ scope.row.goodsName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品图片" type="index" align="center" width='200px'>
                    <template slot-scope="scope">
                        <img class="goods_image" :src="scope.row.logo" />
                    </template>
                </el-table-column>
                <el-table-column label="分类" type="index" align="center" width='200px'>
                    <template slot-scope="scope">
                        <span>{{ scope.row.categoryName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width='200px' class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="pitch(row)">
                            选中
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-page">
                <pagination v-show="total>0" 
                    :total="total" 
                    :page.sync="listQuery.page" 
                    :limit.sync="listQuery.limit" 
                    :currentPage="listQuery.current"
                @pagination="getList" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import {treeApi} from '@/api/AuctionsRecord'
import {goodsListMall} from '@/api/mallManagement'
export default {
    name: 'integralMall',
    props:['goodsDialog'],
    components: {
		Pagination,
	},
    data() {
      return {
        listLoading:false,
        tableKey:0,
        ProductionPrice:{
			cascade:[],
			productName:'',
        },
        options:[],
        props: { multiple: true },
		category:[],
        listQuery: {
					current: 1,
					size: 20,
					time: undefined,
					name: undefined,
                    status: undefined,
                    page: 1,
                    limit: 10,
		},
        total: 0,
        dialogVisible: true,//控制弹框开关
        form: {
          goodsTypeFir: '',//选择商品第一框
          goodsTypeSec: '',//选择商品第二框
          goodsName: '',//商品名称
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        gridData: [],
        goodsList: [],
        goodsType:'1',
        pageSize: 1//每页渲染条数
      }
    },
    created() {
        this.getList();
    },
    methods: {
        handleClose(){
           	this.$emit('closeDialog');
		},
		handleClick(tab, event){
			this.listQuery.page = 1;
			this.listQuery.limit = 10;
			this.getList();
		},
        search(){
                this.listLoading = true;
                let Flag = null;
				let Basic = false;
				if(this.ProductionPrice.cascade.length === 0){
					Flag = '';
				}else{
					if(this.ProductionPrice.cascade.length>1){
						Flag = this.ProductionPrice.cascade[0][0];
						for(let i = 0 ; i < this.ProductionPrice.cascade.length ; i++){
							this.ProductionPrice.cascade[i].some((item,index)=>{
								if(item === Flag){
									Basic = true;
									return true
								}else{
									Basic = false;
									return true
								}
							})
						}
						
						if(Basic){
							let pop = false;
							this.options.some((item,index)=>{
								if(item.value === Flag){
									if(item.children.length === this.ProductionPrice.cascade.length){
										Flag = this.ProductionPrice.cascade[0][0];
										return true
									}else{
										pop = true;
										return true
									}
								}
							})
							if(pop){
								this.$message('商品分类只能选择一个');
								return 
							}
							
						}else{
							this.$message('商品分类只能选择一个');
							return
						}
						
					}else{
						if(this.ProductionPrice.cascade[0].length>1){
							Flag = this.ProductionPrice.cascade[0][1]
						}else{
							Flag = this.ProductionPrice.cascade[0][0]
						}
					}
                }
                let Data = this.fliterfunc({
                    categoryId : Flag,
                    goodsName : this.ProductionPrice.productName
                })
               let datas = {}
				if(this.goodsType == 1){
					datas = {
						current: this.listQuery.page,
						size: this.listQuery.limit,
						status: 2,
						goodsType: 2,
						...Data
					}
				}else{
					datas = {
						current: this.listQuery.page,
						size: this.listQuery.limit,
						status: 2,
						goodsType: 1,
						...Data
					}
				}
				goodsListMall(datas).then((res)=>{
					this.goodsList = res.data.records;
					this.total = Number(res.data.total);
					this.listLoading = false;
				})
        },
        fliterfunc(Obj){
				for(let key in Obj){
				if(Obj[key]){
				if(Object.prototype.toString.call(Obj[key])=="[object String]"){
				if(Obj[key].indexOf("NaN") != -1){
				delete Obj[key]
				}else{
				Obj[key] = Obj[key]
				}
				}else{
				Obj[key] = Obj[key]
				}
				}else{
				delete Obj[key]
				}
				}
				//(Obj,'处理后');
				return Obj
		},
        pitch(row){
            this.$emit('callback',{auctionId:row.goodsId,goodsName:row.goodsName});
        },
        handleChange(value){
           // console.log(value)
        },
        sortChange(data) {
				const {
					prop,
					order
				} = data
				if (prop === 'id') {
					this.sortByID(order)
				}
		},
		sortByID(order) {
				if (order === 'ascending') {
					this.listQuery.sort = '+id'
				} else {
					this.listQuery.sort = '-id'
				}
				this.handleFilter()
		},
        getList() {
            this.listLoading = true
            this.listQuery.time ?
                (this.listQuery.startTime = this.listQuery.time[0],
                    this.listQuery.endTime = this.listQuery.time[1]) : ""
            let datas = {}
            if(this.goodsType == 1){
                datas = {
                    current: this.listQuery.page,
                    size: this.listQuery.limit,
                    status: 2,
                    goodsType: 2,
                }
            }else{
                datas = {
                    current: this.listQuery.page,
                    size: this.listQuery.limit,
                    status: 2,
                    goodsType: 1,
                }
            }
            goodsListMall(datas).then((res)=>{
                this.goodsList = res.data.records;
                this.total = Number(res.data.total);
                this.listLoading = false;
            })
            treeApi({type: 1}).then((res)=>{
                this.test = [];
                for(let i = 0 ; i < res.data.length ; i++){
                    if(res.data[i].subCategorys.length>0){
                        this.test.push({value:res.data[i].categoryId,label:res.data[i].name,children:[]})
                        for(let j = 0 ; j < res.data[i].subCategorys.length ; j++){
                            this.test[i].children.push({value:res.data[i].subCategorys[j].categoryId,label:res.data[i].subCategorys[j].name})
                        }
                    }else{
                        this.test.push({value:res.data[i].categoryId,label:res.data[i].name})
                    }
                    
                }
                this.options = this.test;
            })
	   },
      dialogSure () {//点击搜索框的回调
        console.log(this.form, '这里是获取表单内容的函数，也是点击后校验成功与否的地方')
      },
      pageChange (e) {//切换页码时的回调
        console.log(e)//这里是改变后的页码
      },
      pageChangePrev (e) {//点击上一页的回调
        console.log(e, '点击上一页的回调,e为当前页')
      },
      pageChangeNext (e) {//点击下一页的回调
        console.log(e, '点击下一页的回调,e为当前页')          
      }
    }
}
</script>

<style scoped>
.forms{
    margin-bottom: 30px;
}
.block{
    margin-top: 20px;
    display: inline-block;
    width: 300px
}
.goods-choice {
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
.pagination-page {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
}
</style>
