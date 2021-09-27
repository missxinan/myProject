<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <div class="bot_bun">
      <el-button size="mini" v-if="text1 != ''" @click="callBackUp()">{{ text1 }}</el-button>
      <el-button size="mini" v-if="text2 != ''" @click="callBackDown()">{{ text2 }}</el-button>
    </div>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    text1:{
      type: String,
      default: ''
    },
    text2:{
      type: String,
      default:  ''
    },
  },
  // data(){
  //   return{
  //     text1:'',
  //     text2:''
  //   }
  // },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    callBackUp(){
       this.$emit('callBackUp')
    },
    callBackDown(){
       this.$emit('callBackDown')
    },
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  display: flex;
  justify-content: space-between;
}
.pagination-container.hidden {
  display: none;
}
</style>
