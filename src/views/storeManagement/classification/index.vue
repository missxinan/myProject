<template>
	<div class="table-box">
		<div class="filter-container">
			<el-button class="filter-item" style="margin: 15px;" type="primary" icon="el-icon-edit" @click="handleCreate({menuId:0})">添加</el-button>
			<el-input v-model="Classify.name" placeholder="请输入分类名称" style="width:205px"></el-input>

			<el-select v-model="Classify.recommendation" placeholder="是否推荐">
				<el-option v-for="item in recommendation" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

			<el-button type="primary" @click="search">搜索</el-button>
			<el-button type="primary" @click="reset">重置</el-button>
		</div>
		<tree-table :data="data" v-on:handleCreate="handleCreate" v-on:handleUpdate="handleUpdate" v-on:handleDelete="handleDelete" max-height="650"
		 :columns="columns" @weightSort="weightSort" border />
		<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
		<!-- 添加模板 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
				<el-form-item label="分类名称" maxlength="6" show-word-limit required>
					<el-input v-model="temp.menuName" maxlength="6" show-word-limit />
				</el-form-item>
				<el-form-item label="分类等级" required>
					<el-select v-model="temp.menuType" class="filter-item" placeholder="Please select">
						<el-option v-for="item in arr" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>

				<el-form-item label="上级类目" required>
					<el-select v-model="temp.parentId" class="filter-item" placeholder="Please select">
						<el-option v-for="item in brr" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>

				<el-form-item label="类目图" required>
					<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
					 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="temp.visible" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="展示区">

					<img width="100%" :src="temp.visible" alt="">

				</el-form-item>
				<el-form-item label="是否推荐">
					<el-radio-group v-model="temp.permsldent">
						<el-radio label="是" value="1"></el-radio>
						<el-radio label="否" value="0"></el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="权重">
					<el-input-number v-model="temp.remark" controls-position="right" @change="tempremark" :min="1" :max="10"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">关闭</el-button>
				<el-button v-if="dialogStatus==='create'" type="primary" @click="createData">提交</el-button>
				<el-button v-else type="primary" @click="updateData">提交</el-button>
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


		<!-- 修改 -->
		<el-dialog title="修改" :visible.sync="dialogs">
			<el-form ref="dataFormxiugai" :model="tempxiugai" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
				<el-form-item label="分类名称" maxlength="6" show-word-limit required>
					<el-input v-model="tempxiugai.menuName" maxlength="6" show-word-limit />

				</el-form-item>
				<el-form-item label="分类等级" required>
					<el-select v-model="tempxiugai.menuType" class="filter-item" placeholder="Please select">
						<el-option v-for="item in arr" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>

				<el-form-item label="上级类目" required>
					<el-select v-model="tempxiugai.parentId" class="filter-item" placeholder="Please select">
						<el-option v-for="item in brr" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>

				<el-form-item label="类目图" required>
					<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
					 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="tempxiugai.visible" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="展示区">

					<img width="100%" :src="tempxiugai.visible" alt="">

				</el-form-item>
				<el-form-item label="是否推荐">
					<el-radio-group v-model="tempxiugai.permsldent">
						<el-radio label="是" value="1"></el-radio>
						<el-radio label="否" value="0"></el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="权重">
					<el-input-number v-model="tempxiugai.sort" controls-position="right" @change="tempremarkxiugai" :min="1"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">

				<el-button @click="dialogs = false">关闭</el-button>
				<el-button type="primary" @click="xiugaitijiao">提交</el-button>

			</div>
		</el-dialog>

	</div>
</template>
<script>
	import Pagination from "@/components/Pagination";
	import treeTable from "@/components/treeTable";
	import checkPermission from "@/utils/permission"; // 权限判断函数
  import treeToArray from '@/utils/eval';

	import {
		menuTreeLis,
		menuTreeAdd,
		menuTreeDelete,
		mentTreeEdit
	} from "@/api/menu.js";
	import {
		uploadFileList,
		categoryedit,
		categorydel
	} from "@/api/Newcompilation.js";
	import {
		sortlist,
		categoryadd,
		allsortlist
	} from '@/api/sortmanagement.js';
	const calendarTypeOptions = [{
			key: "0",
			display_name: "显示"
		},
		{
			key: "1",
			display_name: "隐藏"
		}
	];
	const menuTypeOptions = [{
			key: "1",
			display_name: "目录"
		},
		{
			key: "2",
			display_name: "菜单"
		},
		{
			key: "3",
			display_name: "按钮"
		}
	];

	const defaultRole = {
		routes: []
	};
	const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
		acc[cur.key] = cur.display_name;
		return acc;
	}, {});
	const menuTypeValue = menuTypeOptions.reduce((acc, cur) => {
		acc[cur.key] = cur.display_name;
		return acc;
	}, {});
	export default {
		name: 'classification',
		data() {
			return {
				dialogs: false,
				sortNo: 1,
				Classify: {
					gradeClassify: '',
					name: '',
					recommendation: '',
				},
				recommendation: [{
					value: '',
					label: '全部'
				},{
					value: 1,
					label: '是'
				}, {
					value: 0,
					label: '否'
				}],
				dialogVisible: false,
				arr: [],
				brr: [],
				total: 1,
				columns: [{
						text: "创建时间",
						value: "createTime"
					},
					{
						text: "分类名称",
						value: "name"
					},
					{
						text: "等级",
						value: "categoryName"
					},
					{
						text: "图标",
						value: "pic"
					},
					{
						text: "是否推荐",
						value: "liu"
					},
					{
						text: "排序",
						value: "sort"
					},
				],
				data: [],
				listQuery: {
					page: 1,
					limit: 10,
					importance: undefined,
					title: undefined,
					type: undefined
				},
				tempxiugai: {
					menuName: "",
					sort: "",
					menuType: "",
					visible: "",
					permsldent: "",
					remark: "",
					parentId: ''
				},
				temp: {
					menuName: "",
					sort: "",
					menuType: "",
					visible: "",
					permsldent: "",
					remark: "",
					parentId: ''
				},
				dialogStatus: "",
				textMap: {
					update: "修改",
					create: "添加"
				},
				dialogFormVisible: false,
				calendarTypeOptions,
				menuTypeOptions,
				rules: {
					loginName: [{
						required: true,
						message: "登录名不能为空",
						trigger: "change"
					}],
					userName: [{
						required: true,
						message: "用户名不能为空",
						trigger: "change"
					}],
					email: [{
						required: true,
						message: "邮箱不能为空",
						trigger: "change"
					}],
					passward: [{
						required: true,
						message: "密码不能为空",
						trigger: "change"
					}],
					phone: [{
						required: true,
						message: "密码不能为空",
						trigger: "change"
					}],
					roleList: [{
						required: true
					}],
					deptId: [{
						required: true
					}]
				},
				dialogPvVisible: false,
				pvData: [],
			};
		},

		components: {
			treeTable,
			Pagination
		},
		created() {
			this.getList();
		},
		methods: {
			checkPermission,
			tempremark(value) {
			},
			xiugaitijiao() {
				if(this.tempxiugai.menuName === ''){
					this.$message.error('请输入分类名称！');
					return;
				}
				if(this.tempxiugai.parentId === ''){
					this.$message.error('请选择上级类目！');
					return;
				}
				if(this.tempxiugai.visible === ''){
					this.$message.error('请上传商品类目图！');
					return;
				}
				categoryedit({
					name: this.tempxiugai.menuName,
					categoryId: this.tempxiugai.categoryId,
					sort: this.tempxiugai.sort,
					isRecommend: this.tempxiugai.permsldent === '是' ? 1 : 0,
					pic: this.tempxiugai.visible,
					parentId: this.tempxiugai.parentId,
					type:1
				}).then((response) => {
					console.log(response);
					if (response.msg === 'success') {
						location.reload()
					} else {
						this.$message(response.msg)
					}
				})
				this.dialogs = !this.dialogs;
				console.log(this.tempxiugai, '666')
			},
			tempremarkxiugai(value) {
				console.log(value, '北璇');
			},
			search() {
				this.listLoading = true;
				sortlist({
					current: this.listQuery.page,
					size: this.listQuery.limit,
					parentId: 0,
					isRecommend: this.Classify.recommendation,
					name: this.Classify.name,
					type:1
				}).then((res) => {
					this.data = this.recursionfunc(res.data.records);
					this.total = Number(res.data.total);
					this.listLoading = false;
				})
			},
			//重置函数
			reset() {
				for (var key in this.Classify) {
					this.Classify[key] = ''
				}
			},
			handleDelete(row) {
				categorydel({
					categoryId: Number(row.categoryId)
				}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.getList();
						this.$message({
							message: "删除成功",
							type: "success"
						});
					} else {
						this.$message({
							message: res.msg,
							type: "error"
						});
						this.getList();
					}
				});
			},
			handlePictureCardPreviewHeader(file) {
				this.dialogVisible = true;
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			getFile(file, fileList) {
				console.log('222')
				let formDate = new FormData()
				formDate.append('multipartFileList', file.raw);
				uploadFileList(formDate).then(resp => {
					if (resp.code == 0) {
						this.tempxiugai.visible = resp.data[0]
						this.temp.visible = resp.data[0]
					} else {
						this.$message({
							message: resp.msg,
							type: 'warning'
						});
					}
				})
			},
			//递归函数
			recursionfunc(obj) {
				if (typeof obj !== 'object') {
					return obj;
				}
				if (obj && obj.categoryId) {
					if (obj.categoryId.length === 8) {
						obj.categoryName = '二级'
						obj.isRecommend === 0 ? obj.liu = '否' : obj.liu = '是'
					} else {
						if (obj.categoryId.length === 12) {
							obj.categoryName = '三级'
							obj.isRecommend === 0 ? obj.liu = '否' : obj.liu = '是'
						} 
					}
				}
				let newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
				for (let k in obj) {
					if (k === 'subCategorys') {
						newObj['subMenus'] = obj[k];
						obj['subMenus'] = newObj['subMenus'];
					}
					//测试算法
					if (k === 'isRecommend') {
						if (obj[k] === 0) {
							newObj.isRecommend = '否'
						} else {
							newObj.isRecommend = '是'
						}
					}
					//
					if (k === 'categoryId') {
						newObj['categoryName'] = obj[k].length === 4 ? '一级' : '二级';
					}
					if (typeof obj[k] !== 'object') {
						newObj[k] = obj[k];
					} else {
						newObj[k] = this.recursionfunc(obj[k]);
					}
				}
				return newObj;
			},
			//排序
			weightSort(val) {
				this.sortNo = val;
				this.getList();
			},
			getList() {
				this.listLoading = true;
				sortlist({
					current: this.listQuery.page,
					size: this.listQuery.limit,
					sortNo: this.sortNo,
					parentId: 0,
					type:1
				}).then((res) => {
					this.data = this.recursionfunc(res.data.records);
					this.total = Number(res.data.total);
					this.listLoading = false;
				})
			},
			resetTemp(parentid) {
				this.temp = {
					menuName: "",
					parentId: '',
					sort: "1",
					url: "#",
					menuType: "",
					visible: "",
					permsldent: "",
					icon: "",
					remark: ""
				};
			},
			// 添加菜单
			handleCreate(row) {
				if (row.menuId === 0) {
					this.arr = [{
						key: "0",
						display_name: "一级"
					}]
					this.brr = [{
							key: "0",
							display_name: "无"
						}],
						this.temp.parentId = 0
				} else {
					this.brr = [{
						key: row.categoryId,
						display_name: row.name
					}]
					if (row.categoryId.length === 4) {
						this.arr = [{
							key: "1",
							display_name: "二级"
						}]
					} else if (row.categoryId.length === 8) {
						this.$message({
							message: '最多只能添加到二级',
							type: 'warning'
						});
						return
						this.arr = [{
							key: "2",
							display_name: "三级"
						}]
					}
				}
				this.resetTemp(row.menuId);
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
				});
			},
			updateData(menu) {
				this.$refs["dataForm"].validate(valid => {
					if (valid) {
						if(this.temp.menuName === ''){
							this.$message.error('请输入分类名称！');
							return;
						}
						if(this.temp.parentId === ''){
							this.$message.error('请选择上级类目！');
							return;
						}
						if(this.temp.visible === ''){
							this.$message.error('请上传商品类目图！');
							return;
						}
						this.temp.menuId = this.temp.menuId;
						categoryedit({
							categoryId: this.temp.categoryId,
							parentId: this.temp.parentId,
							name: this.temp.menuName,
							pic: this.temp.visible,
							isRecommend: this.temp.permsldent === '是' ? 1 : 0,
							sort: this.temp.remark,
							type:1
						}).then(res => {
							for (var key in this.temp) {
								this.temp[key] = '';
							}
							if (res.code == 0) {

								this.dialogFormVisible = false;
								this.$notify({
									title: "Success",
									message: "Update Successfully",
									type: "success",
									duration: 2000
								});
								location.reload();
								this.getList();
							} else {
								location.reload();
							}
						});
					} else {
						for (var key in this.temp) {
							this.temp[key] = '';
						}
					}
				});
			},
			createData() {
				this.$refs["dataForm"].validate(valid => {
					if (valid) {
						if(this.temp.menuName === ''){
							this.$message.error('请输入分类名称！');
							return;
						}
						if(this.temp.parentId === ''){
							this.$message.error('请选择上级类目！');
							return;
						}
						if(this.temp.visible === ''){
							this.$message.error('请上传商品类目图！');
							return;
						}
						categoryadd({
							parentId: this.temp.parentId || 0,
							name: this.temp.menuName,
							pic: this.temp.visible,
							isRecommend: this.temp.permsldent === '是' ? 1 : 0,
							sort: this.temp.remark,
							type:1
						}).then(res => {
							this.dialogFormVisible = false;
							if (res.code == 0) {
								for (var key in this.temp) {
									this.temp[key] = '';
								}
								this.$notify({
									title: "Success",
									message: "添加成功",
									type: "success",
									duration: 2000
								});
								this.getList();
								return
								location.reload();
							} else {
								this.$message.error(res.msg);
							}
						});
					} else {
						for (var key in this.temp) {
							this.temp[key] = '';
						}
					}
				});
			},
			//修改分类
			handleUpdate(row) {
				this.dialogs = true;
				if (row.parentId === '0') {
					this.arr = [{
						key: "0",
						display_name: "一级"
					}]
					this.brr = [{
						key: "0",
						display_name: "无"
					}]
				} else {
					let Data = null;
					this.brr = [];
					this.data.some((item, index) => {
						console.log(item);
						if (item.categoryId === row.parentId) {
							this.brr = [{
								key: item.categoryId,
								display_name: item.name
							}];
							return true
						}
					})
					if (row.parentId.length === 4) {
						this.arr = [{
							key: "1",
							display_name: "二级"
						}]
					} else if (row.parentId.length === 8) {
						this.arr = [{
							key: "2",
							display_name: "三级"
						}]
					}
				}
				row.menuName = '';
				row.visible = '';
				row.permsldent = '';
				this.tempxiugai = Object.assign({}, row);
				this.tempxiugai.visible = this.temp.visible + ''
				this.tempxiugai.permsldent = row.isRecommend == 1 ? '是' : '否'
				if (row.parentId === '0') {
					this.tempxiugai.menuType = '0';
					this.tempxiugai.parentId = '0';
				} else if (row.parentId.length === 4) {
					this.tempxiugai.menuType = '1';
				} else if (row.parentId.length === 8) {
					this.tempxiugai.menuType = '2';
				}
				this.tempxiugai.menuName = row.name;
				this.tempxiugai.visible = row.pic;
				this.tempxiugai.parentId = row.parentId;
				console.log(this.brr);
			},
			// 图标
			generateIconCode(symbol) {
				return `<svg-icon icon-class="${symbol}" />`
			}
		}
	}
</script>
<style>
	.table-box {
		padding: 20px;
	}
</style>
