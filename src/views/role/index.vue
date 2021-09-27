<template>
	<div class="app-container">
		<div class="filter-container">	
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" v-if="checkPermission(['system:role:add'])" icon="el-icon-edit" @click="handleCreate">添加</el-button>
		</div>

		<!-- 列表 -->
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row max-height="700">
			<el-table-column align="center" label="ID">
				<template slot-scope="scope">{{ scope.row.roleId }}</template>
			</el-table-column>
			<el-table-column label="角色名称" align="center">
				<template slot-scope="scope">{{ scope.row.roleName }}</template>
			</el-table-column>
			<el-table-column label="角色权限" align="center">
				<template slot-scope="scope">{{ scope.row.roleKey }}</template>
			</el-table-column>
			<el-table-column label="排序" align="center">
				<template slot-scope="scope">{{ scope.row.sort }}</template>
			</el-table-column>
			<el-table-column label="角色分类" align="center">
				<template slot-scope="scope">{{ scope.row.admin }}</template>
			</el-table-column>
			<el-table-column label="角色状态" align="center">
				<template slot-scope="scope">{{ scope.row.state == 0 ? '正常' : '停用' }}</template>
			</el-table-column>
			<el-table-column label="备注" align="center">
				<template slot-scope="scope">{{ scope.row.remark }}</template>
			</el-table-column>
			<el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini"  @click="handleUpdate(row)">修改</el-button>
					<el-button size="mini" type="danger" v-if="checkPermission(['system:role:del'])" @click="handleModifyStatus(row,'deleted')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页handleCheckChange-->
		<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
		<!-- 添加模板 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="temp.roleName" />
				</el-form-item>
				<el-form-item label="角色权限" prop="roleKey">
					<el-input v-model="temp.roleKey" />
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model.number="temp.sort" />
				</el-form-item>
				<el-form-item label="角色分类" prop="admin">
					<el-input v-model.number="temp.admin" />
				</el-form-item>
				<el-form-item label="角色状态" prop="state">
					<el-select v-model="temp.state" class="filter-item" placeholder="Please select">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
				</el-form-item>
				<el-form-item label="菜单权限">
					<el-tree :data="allMenuListCopy" check-strictly=true default-expand-all=false  :props="defaultProps" ref="menuRef"
					 show-checkbox  node-key="menuId"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">关闭</el-button>
				<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
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
	// import waves from '@/directive/waves'
	import {
		getList
	} from "@/api/table";
	import Pagination from "@/components/Pagination";
	import permission from "@/directive/permission/index.js"; // 权限判断指令
	import checkPermission from "@/utils/permission"; // 权限判断函数
	import {
		getRoutes,
		getRoles,
		addRole,
		deleteRoleById,
		updateRole,
		department,
		detailRole,
		allMenuListTree
	} from "@/api/role";

	const calendarTypeOptions = [{
			key: "0",
			display_name: "正常"
		},
		{
			key: "1",
			display_name: "停用"
		}
	];
	const defaultRole = {
		routes: []
	};
	const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
		acc[cur.key] = cur.display_name;
		return acc;
	}, {});
	export default {
		components: {
			Pagination,
			permission
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: "success",
					draft: "info",
					deleted: "danger"
				};
				return statusMap[status];
			},
			typeFilter(sex) {
				return calendarTypeKeyValue[type];
			}
		},
		data() {
			return {
				list: null,
				listLoading: true,
				//----
				total: 1,
				listQuery: {
					page: 1,
					limit: 10,
					importance: undefined,
					title: undefined,
					type: undefined
				},
				dialogStatus: "",
				dialogFormVisible: false,
				calendarTypeOptions,
				statusOptions: ["published", "draft", "deleted"],
				temp: {
					roleName: "",
					roleKey: "",
					sort: "",
					admin: "",
					state: "",
					remark: ""
				},
				textMap: {
					update: "修改",
					create: "添加"
				},
				rules: {
					roleName: [{
						required: true,
						message: "角色名称不能为空",
						trigger: "change"
					}],
					roleKey: [{
						required: true,
						message: "角色权限不能为空",
						trigger: "change"
					}],
					admin: [{
							required: true,
							message: "角色分类不能为空",
							trigger: "blur"
						},
						{
							type: "number",
							message: "必须为数字值",
							trigger: "change"
						}
					],
					sort: [{
						type: "number",
						message: "必须为数字值",
						trigger: "change"
					}],
					state: [{
						required: true,
						message: "角色状态不能为空",
						trigger: "change"
					}]
				},
				dialogPvVisible: false,
				pvData: [],
				// 角色权限
				checkStrictly: false,
				defaultProps: {
					children: "subMenus",
					label: "menuName",
					id: "menuId"
				},
				// 角色
				routes: [],
				// 部门
				departmentData: [],
				defaultPropsDepart: {
					children: "children",
					label: "deptName",
					id: "deptId"
				},
				roleArr: [],
				allMenuList: [],
				allMenuListCopy: []
			};
		},
		computed: {
			allMenuListCheckedkeys() {
				let arr = [];
				arr = this.getId(this.temp.menuList || []);

				return arr;
			},
			allMenuListExpandedKeys() {
				let arr = [];
				arr = this.getId(this.temp.menuList || []);
				return arr;
			},
			routesData() {
				return this.routes;
			}
		},
		created() {
			this.getAllMenu();
			this.getList();
		},
		methods: {
			getId(dataList) {
				let arr = [];
				dataList.forEach(item => {
					arr.push(item.menuId);
					if (item.subMenus && item.subMenus.length) {
						arr = arr.concat(this.getId(item.subMenus));
					}
				});
				return arr;
			},
			checkPermission,
			getAllMenu() {
				allMenuListTree().then(res => {
					this.allMenuList = res.data || [];
				});
			},

			getList() {
				this.listLoading = true;
				getRoles({
					current: this.listQuery.page,
					size: this.listQuery.limit
				}).then(response => {
					console.log(response, "response");
					this.list = response.data.records;
					this.total = Number(response.data.total);
					// Just to simulate the time of the request
					this.listLoading = false;
				});
			},
			handleFilter() {
				this.listQuery.page = 1;
				this.getList();
			},
			operaCallback(msg) {
				this.$message({
					message: msg,
					type: "success"
				});
				this.getList();
			},
			handleModifyStatus(row) {
				deleteRoleById({
					roleId: row.roleId
				}).then(res => {
					this.operaCallback("删除成功");
				});
			},
			sortChange(data) {
				const {
					prop,
					order
				} = data;
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
					menuList: [],
					roleName: "",
					roleKey: "",
					sort: "",
					admin: "",
					state: "",
					remark: ""
				};
			},
			// 添加用户
			handleCreate() {
				// 请求角色
				this.resetTemp();
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
				//this.$refs.menuRef.setCheckedKeys([])
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
					this.allMenuListCopy = JSON.parse(JSON.stringify(this.allMenuList));
				});
			},
			getDtoOfCreateAndUpdate() {
				let sendData = JSON.parse(JSON.stringify(this.temp));
				let ref = this.$refs["menuRef"];
				let children = ref.getCheckedKeys();
				let parent = ref.getHalfCheckedKeys();
				sendData.menuList = parent.concat(children).join(",");
				return sendData;
			},
			createData() {
				this.$refs["dataForm"].validate(valid => {
					if (valid) {
						addRole(this.getDtoOfCreateAndUpdate()).then(res => {
							if (res.code == 0) {
								this.dialogFormVisible = false;
								this.operaCallback("添加成功");
								this.$store.dispatch("menu/updateMenu");
							} else {
								this.$message.error(res.msg);
							}

						});
					}
				});
			},
			handleUpdate(row) {
				detailRole({
					roleId: row.roleId
				}).then(res => {
					res.data.admin = Number(res.data.admin);
					this.temp = res.data;
					this.dialogStatus = "update";
					this.dialogFormVisible = true;
					this.allMenuListCopy = JSON.parse(JSON.stringify(this.allMenuList));
					this.$nextTick(() => {
						this.$refs["dataForm"].clearValidate();
						// this.$refs["menuRef"].setCheckedNodes(res.data.menuList);
						//默认选中的树的数据
						console.log(res.data.menuList,'res.data.menuList')
						setTimeout(()=> {
							res.data.menuList.forEach((value)=>{
								this.$refs.menuRef.setChecked(value,true)
								if(value.subMenus){
									value.subMenus.forEach((values)=>{
										this.$refs.menuRef.setChecked(values,true)
										if( values.subMenus ){
											values.subMenus.forEach(valuss=>{
												this.$refs.menuRef.setChecked(valuss,true)
											})
										}
									})
								}
							})
						 },500);
					});
				});
			},
			updateData() {
				this.$refs["dataForm"].validate(valid => {
					if (valid) {
						updateRole(this.getDtoOfCreateAndUpdate()).then(() => {
							this.dialogFormVisible = false;
							this.operaCallback("修改成功");
							this.$store.dispatch("menu/updateMenu");
						});
					}
				});
			},

			handleFetchPv(pv) {
				fetchPv(pv).then(response => {
					this.pvData = response.data.pvData;
					this.dialogPvVisible = true;
				});
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v =>
					filterVal.map(j => {
						if (j === "timestamp") {
							return parseTime(v[j]);
						} else {
							return v[j];
						}
					})
				);
			}
		}
	};
</script>
<style>
	.image {
		width: 40px;
		height: 40px;
	}

	.filter-container {
		margin-bottom: 10px;
	}
</style>
