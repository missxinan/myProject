<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
     
     <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>
	<div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
	  <el-table-column  label="序号" type="index" align="center" width="60"></el-table-column>
	  <el-table-column label="品牌名称"  align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.name }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="创建人"  align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.createBy }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="创建时间"  align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.createTime }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="修改人"  align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.updateBy }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="修改时间"  align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.updateTime }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="状态" class-name="status-col" width="70">
	    <template slot-scope="{row}">
	      <el-tag :type="row.status == 0 ? 'success' : 'danger'">
	        {{ row.status == 0 ? '启用' : '停用' }}
	      </el-tag>
	    </template>
	  </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
		   <el-button   type="primary" size="mini"  @click="handleStart(row)">
		    {{ row.status == 0 ? '禁用' : '启用' }}
		  </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" :currentPage="listQuery.current" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
		<el-form-item label="首字母 " prop="firstChar">
		  <el-input v-model="temp.firstChar" />
		</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
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
import { fetchList, brandEdit, brandAdd, brandDel, brandDetail, brandStart } from '@/api/brand'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '0', display_name: '可用' },
  { key: '1', display_name: '禁用' },

]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'fastMail',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        importance: undefined,
        name: undefined,
        status: undefined,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        name: '',
		firstChar:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: 'type is required', trigger: 'change' }],
        firstChar: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = Number(response.data.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    handleFilter() {
			if( this.listQuery.name == '' ){
				this.listQuery.name = undefined
			}else if(this.listQuery.status == ''){
				this.listQuery.status = undefined
			}
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
	  brandDel({brandId:row.brandId}).then(res=>{
		  if(res.code == 0){
			  this.$message({
			    message: '操作Success',
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
        name:'',
		firstChar:''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          brandAdd(this.temp).then((res) => {
						if(res.code == 0){
							this.dialogFormVisible = false
							this.$notify({
							  title: 'Success',
							  message: 'Created Successfully',
							  type: 'success',
							  duration: 2000
							})
							this.getList();
						}else{
						 this.$message.error(res.msg);
					}
          })
        }
      })
    },
    handleUpdate(row) {
	  brandDetail({brandId:row.brandId}).then(res => {
		  if( res.code == 0 ){
			  console.log(res)
			  this.temp = res.data
			  this.dialogStatus = 'update'
			  this.dialogFormVisible = true
			  this.$nextTick(() => {
			    this.$refs['dataForm'].clearValidate()
			  })
		  }else{
				this.$message.error(res.msg);
			}
	  })
      // this.temp = Object.assign({}, row) 
      
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
         const tempData = Object.assign({}, this.temp)
				const obj = {}
				obj.brandId = tempData.brandId
				obj.name = tempData.name
				obj.firstChar = tempData.firstChar
          brandEdit(obj).then(res => {
						if( res.code == 0 ){
							this.dialogFormVisible = false
							this.$notify({
							  title: 'Success',
							  message: 'Update Successfully',
							  type: 'success',
							  duration: 2000
							})
							this.getList();
						}else{
							this.$message.error(res.msg);
						}
            
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
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal, this.list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
	// 启用禁用
	handleStart(row){
		let statusNum = 0
		if( row.status == 0 ){
			statusNum = 1
		}
		brandStart({ brandId:row.brandId,status:statusNum }).then(res =>{
			if( res.code == 0 ){
				 this.$message({
				  message: '操作Success',
				  type: 'success'
				})
				this.getList();
			}
		})
		console.log(row)
	}
  }
}
</script>
