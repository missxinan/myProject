<template>
  <div  class="pagination-container">
    <el-date-picker 
        v-model="time" 
        type="datetimerange" 
        :startTime='startTime'
        :endTime='endTime'
        range-separator="-"  
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期" 
        end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>

<script>
// import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'datetimerange',
  props: {
    startTime: {
      required: false,
      type: String,
    },
    endTIme: {
      required: false,
      type: String,
    },
  },
  data(){
    return{
      time:[]
    }
  },
  computed: {
    startTime: {
      get() {
        return this.startTime
      },
      set(val) {
        console.log(val,'val1')
        this.time[0] = val
      }
    },
    endTime: {
      get() {
        return this.endTime
      },
      set(val) {
        console.log(val,'val2')
        this.time[1] = val
      }
    }
  },
  methods: {
    // handleSizeChange(val) {
    //   this.$emit('pagination', { page: this.currentPage, limit: val })
    //   if (this.autoScroll) {
    //     scrollTo(0, 800)
    //   }
    // },
    // handleCurrentChange(val) {
    //   this.$emit('pagination', { page: val, limit: this.pageSize })
    //   if (this.autoScroll) {
    //     scrollTo(0, 800)
    //   }
    // },
    // callBackUp(){
    //    this.$emit('callBackUp')
    // },
    // callBackDown(){
    //    this.$emit('callBackDown')
    // },
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
