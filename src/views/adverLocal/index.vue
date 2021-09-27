<template>
  <div class="app-container">
	   <!-- <div class="filter-container">
	   <div>终端</div>
	   <el-select v-model="terminal" placeholder="状态" filterable  class="filter-item" style="width: 130px" @change="terminalChange">
			<el-option v-for="item in terminalarr" :key="item.key" :label="item.label" :value="item.value" />
		</el-select>
    	</div> -->

		
		<!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      stripe
      fit
      highlight-current-row
	  max-height = "650"
    >
	 <el-table-column  label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column align="center" label="终端" width="95" >
				<template slot-scope="scope">
					{{ scope.row.device }}
				</template>
			</el-table-column>
      <el-table-column label="页面"  align="center">
				<template slot-scope="scope">
					{{ scope.row.name }}
				</template>
			</el-table-column>
			<el-table-column label="备注"  align="center" >
				 <template slot-scope="scope">
					 {{ scope.row.content}}
				 </template>
			</el-table-column>
			
    </el-table>
		
			<!-- 分页handleCheckChange-->
		 <pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page"  @pagination="getList" />
		 <!-- 添加模板 -->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
				<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
					<el-form-item label="登录名" prop="loginName">
						<el-input v-model="temp.loginName" />
					</el-form-item>
					<el-form-item label="用户名" prop="userName">
						<el-input v-model="temp.userName" />
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="temp.email" />
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="temp.phone" />
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
							<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
						</el-select>
					</el-form-item>
					<el-form-item label="密码" prop="passward">
						<el-input v-model="temp.passward" />
					</el-form-item>
					<el-form-item label="角色">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
						@check-change="getCurrentNode"
          />
        </el-form-item>
				<el-form-item label="部门">
					<el-tree :data="departmentData" :props="defaultPropsDepart" @node-click="handleNodeClick"></el-tree>
				</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">
						关闭
					</el-button>
					<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
						提交
					</el-button>
				</div>
			</el-dialog>

			<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
				<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
					<el-table-column prop="key" label="Channel" />
					<el-table-column prop="pv" label="Pv" />
				</el-table>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
				</span>
			</el-dialog>
		
  </div>
</template>

<script>
import { fetchList } from '@/api/adverLocal'
import Pagination from '@/components/Pagination' 
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

const calendarTypeOptions = [
  { key: '1', display_name: '男' },
  { key: '2', display_name: '女' },
]
const defaultRole = {
  routes: []
}
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
	name: 'adverLocal',
	components: { Pagination, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(sex) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      list: null,
	  listLoading: true,
	  terminal:'',
			//----
			total:1,
			listQuery: {
				page: 1,
				limit: 10,
				importance: undefined,
				title: undefined,
				type: undefined
			},
			 dialogStatus: '',
			 dialogFormVisible: false,
			 calendarTypeOptions,
			 statusOptions: ['published', 'draft', 'deleted'],
			 temp: {
					loginName:'',
					userName:'',
					email:'',
					passward:'',
					remark: '',
					sex: '',
					roleList:'',
					deptId:''
			 },
			 textMap: {
        update: '修改',
        create: '添加'
      },
			 rules: {
        loginName: [{ required: true, message: '登录名不能为空', trigger: 'change' }],
        userName: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
				email: [{ required: true, message: '邮箱不能为空', trigger: 'change' }],
				passward: [{ required: true, message: '密码不能为空', trigger: 'change' }],
				phone:[{ required: true, message: '密码不能为空', trigger: 'change' }],
				roleList:[{ required: true }],
				deptId:[{ required: true }]
      },
			dialogPvVisible: false,
			pvData: [],
			// 角色权限
			checkStrictly: false,
			defaultProps: {
        children: 'children',
        label: 'roleName',
				id:'roleId'
      },
			// 角色
			routes: [],
			// 部门
			departmentData:[],
			defaultPropsDepart:{
				children: 'children',
				label: 'deptName',
				id:'deptId'
			},
			roleArr:[],
			terminalarr:[]
		}
  },
	computed:{
		routesData() {
      return this.routes
    }
	},
	created() {
    this.getList()
  },
  methods: {
	checkPermission,
    getList() {
      this.listLoading = true
      fetchList({current:this.listQuery.page, size:this.listQuery.limit }).then(response => {
        this.list = response.data.records
		this.total = Number(response.data.total) 
		for(let i = 0 ; i < this.list.length ; i++){
			this.terminalarr.push({value:i,label:this.list[i].device})
		}
		
        setTimeout(() => {
          this.listLoading = false
        }, 800)
      })
	},
	terminalChangefunc(params){
		let Data = null;
		this.terminalarr.some((item,index)=>{
			if(item.value === params){
				Data = item.label
			}
		})
		return Data
	},
    async terminalChange(value='Liuzhongbao'){
		this.listLoading = true
		let request = null;
		let response = null;
		
		request = await this.terminalChangefunc(value);
		response  = await fetchList({current:this.listQuery.page, size:this.listQuery.limit, device:request})
		
		this.list = response.data.records
		this.total = Number(response.data.total) 
		this.terminalarr = [];
		for(let i = 0 ; i < this.list.length ; i++){
			this.terminalarr.push({value:i,label:this.list[i].device})
		}
        setTimeout(() => {
          this.listLoading = false
        }, 800)
	},
		// 请求角色
		getRoleLists(){
			getRoutes().then((res)=>{
				 this.role = Object.assign({}, defaultRole)
				if (this.$refs.tree) {
					this.$refs.tree.setCheckedNodes([])
				}
				this.dialogType = 'new'
				this.dialogVisible = true
				console.log(res,'角色返回')
				this.routes = res.data
			})
		},
		// 请求部门
		departmentApi(){
			department().then(res=>{
				console.log(res,'部门')
				this.departmentData = res.data
			})
		},
		getCurrentNode(data, checked, indeterminate) {
			console.log(data.roleId, checked, indeterminate,'角色');
			this.temp.roleList = '1,3'
		},
		handleNodeClick(data, checked, indeterminate){
			console.log(data.deptId, checked, indeterminate,'部门');
			this.temp.deptId =data.deptId
		},

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
			deleteRole({ userId:row}).then((res) => {
				console.log(res);
				if( res.code == 0 ){
					this.$message({
					  message: '删除成功',
					  type: 'success'
					})
					this.getList();
				}else{
					this.$message.error(res.msg);
				}
			})
    },
    sortChange(data) {
      const { prop, order } = data
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
    resetTemp() {
      this.temp = {
    		loginName:'',
    		passward:'',
    		userName:'',
    		email:'',
        remark: '',
        sex: '',
				roleList:'',
				deptId:''
      }
    },
		// 添加用户
    handleCreate() {
			// 请求角色
			this.getRoleLists();
			// 请求部门
			this.departmentApi();
			
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
				console.log(this.temp)
        if (valid) {
          createArticle(this.temp).then((res) => {
						this.dialogFormVisible = false
            if( res.code == 0 ){
							 this.$notify({
							  title: 'Success',
							  message: '添加成功',
							  type: 'success',
							  duration: 2000
							})
							 this.getList()
						}else{
							this.$message.error(res.msg)
						}
          })
        }
      })
    },
    handleUpdate(row) {
			console.log(row);
      this.temp = Object.assign({}, row) // copy obj
			console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then((res) => {
            if(res.code == 0){
							this.getList()
						}
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          // return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
    .filter-item{
		float: left;
	}
	.image{
		width: 40px;
		height: 40px;
	}
	.filter-container{
		margin-bottom: 10px;
	}
</style>
