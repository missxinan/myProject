<template>
  <el-table
    ref="multipleTable"
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    row-key="id"
  >
    <!--  @header-click="chooseall" -->
    <el-table-column v-if="columns.length===0" >
      <template slot-scope="scope" @click="toggleExpanded(scope.$index)">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" >
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-if="columns.length===0">
      <template slot-scope="scope" @click="toggleExpanded(scope.$index)">
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" >
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.value"
      :label="column.text"
      :width="column.width"
    >
      <template slot-scope="scope" >
        <!-- v-if="index === 0"  这里第一个span取消了一个判断，后面有问题在加上-->
        <span

          v-for="space in scope.row._level"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(index,scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
		<img v-if="column.value == 'pic'" class="image" :src="scope.row[column.value]" />
        <span v-if="column.value != 'pic'">{{ scope.row[column.value] }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="{row}">
        <!-- <el-button type="success"  v-if=" row.menuType != 3 " size="mini" @click="handleCreate(row)">
		      添加v-if="checkPermission(['system:menu:add'])"
        </el-button>-->
        <el-button
          type="text"
          size="mini"
          @click="tableOpera('handleCreate',row)"
        >添加</el-button>
        <el-button type="text" size="mini" v-on:click="tableOpera('handleUpdate',row)">修改</el-button>
        <el-button size="mini" type="text" @click="tableOpera('handleDelete',row)">删除</el-button>
        <el-button size="mini" type="text" @click="tableOpera('isShowMet',row)">展示</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang v-if="checkPermission(['system:menu:edit'])"
  Created: 2018/1/19-13:59
*/
import checkPermission from "@/utils/permission"; // 权限判断函数
import treeToArray from "@/utils/eval";
import { menuTreeDelete } from "@/api/menu.js";
export default {
  name: "TreeTable",
  data() {
    return {
      chooseson: true, //全选
      key: true, //单个点击直到全部选中
      lineData:[]
    };
  },
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;

      const args = this.evalArgs
        ? [tmp, this.expandAll].concat(this.evalArgs)
        : [tmp, this.expandAll];
        let data = func.apply(null, args)
        this.lineData = data
      return func.apply(null, args);
    }
  },
  mounted(){
    console.log('执行了点击111')
    setTimeout(()=>{
      console.log('执行了点击')
      this.firstClick()
    },1200)
  },

  methods: {
    checkPermission,
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show == true
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      // debugger
      record._expanded = !record._expanded;
      this.formatData.splice(trIndex, 1, record);
    },
    // 图标显示
    iconShow(index, record) {
      // console.log(index)
      return index === 0 && record.subMenus && record.subMenus.length > 0;
    },

    //设置表头全选
    renderHeader(h, data) {
      return h("span", [
        h("input", {
          attrs: {
            id: "chooseall",
            type: "checkbox",
            style:
              "border: 1px solid #dcdfe6;border-radius: 2px;box-sizing: border-box;width: 14px;height: 14px;background-color: #fff;"
          }
        })
      ]);
    },
    //功能函数:选中部分子集
    setchildtobeselect(arr, key) {
      arr.forEach((v, i) => {
        v.checks = key;
        // v._expanded = key;//选中后展开子项
        if (v.subMenus) {
          this.setchildtobeselect(v.subMenus, v.checks);
        }
      });
    },
    //是否所有的都被选中
    isallchecked(arr) {
      arr.forEach((v, i) => {
        if (!v.checks) {
          this.key = false;
        }
        if (v.subMenus) {
          this.isallchecked(v.subMenus);
        }
      });
    },
    //设置父级为 未选中状态（父级的父级没改变-有bug）
    setparentfalse(arr, id, level) {
      arr.forEach((v, i) => {
        if (v._level == level - 1 && v.subMenus) {
          v.subMenus.forEach((val, ind) => {
            if (val.id == id) {
              v.checks = false;
              return false; //终止此次循环，减少循环次数
            }
          });
        }
        if (v.subMenus) {
          this.setparentfalse(v.subMenus, id, level);
        }
      });
    },
    //设置父级为 选中状态
    setparenttrue(arr, id, level) {
      arr.forEach((v, i) => {
        if (v._level == level - 1 && v.subMenus) {
          let key = true;
          let sameidkey = false;
          v.subMenus.forEach((val, ind) => {
            if (val.id == id) {
              //确保当前点击的在该父级内
              sameidkey = true;
            }
            if (!val.checks) {
              key = false;
            }
          });
          if (key && sameidkey) {
            v.checks = true;
          }
        }
        if (v.subMenus) {
          this.setparentfalse(v.subMenus, id, level);
        }
      });
    },
    //某个复选框被点击时
    toselect(row) {
      console.log(row);
      // row._expanded = row.checks;//选中后是否展开
      //1、若有子集先让子选中
      if (row.subMenus) {
        this.setchildtobeselect(row.subMenus, row.checks);
      }
      //2、然后判断是否全选中
      this.key = true; //重置为true，防止上次已经是false的状态
      this.isallchecked(this.formatData);
      //3、设置多选框的状态
      if (!row.checks) {
        this.setparentfalse(this.formatData, row.id, row._level); //设置父级选中的状态为false
        document.getElementById("chooseall").checked = false; //设置全选框的状态
      } else {
        this.setparenttrue(this.formatData, row.id, row._level); //设置父级选中的状态为true
      }
      if (this.key) {
        document.getElementById("chooseall").checked = true; //设置全选框的状态
      }
    },
    tableOpera(type, data) {
      this.$emit(type, this.formatDataNew(data));
    },
    formatDataNew(data) {
      delete data.parent;
      if (data.subMenus) {
        data.subMenus.forEach(item => {
          this.formatDataNew(item);
        });
      }
      return data;
    },
    // 显示图标
    icon(row) {
      console.log(row);
    },
    firstClick(){
      let data = this.lineData
      data.map((item,index)=>{
        if( item._level == 1 ){
          const record = item
          record._expanded = !record._expanded;
          this.formatData.splice(index, 1, record);
        }
      })
    },
  },
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style scoped>

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #2196f3;
  margin-left: -18px;
}
.image{
	width: 80px;
	height: 80px;
}
</style>
