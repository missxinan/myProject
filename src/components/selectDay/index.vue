<template>
  <div class="pagination-container">
    <el-checkbox-group v-model="checkboxGroup4" size="mini" @change="changeData">
      <el-checkbox-button v-for="(item,index) in list" :label="index" :key="index">{{item}}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'selectDay',
  props: {},
  data(){
    return{
      list:[],
      listData:[],
      checkboxGroup4:[],
    }
  },
  created(){
      this.getDayList();
  },
  computed: {
  },
  methods: {
    getDayList(){
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for( let i = 0;i <= days - day;i++ ){
            this.list.push((month+1)+'.'+(day+i))
            this.listData.push(year +'-'+((month+1)<10 ? '0'+(month+1):(month+1))+'-'+((day+i) < 10 ? '0' +(day+i) : (day+i)))
        }
        let num = 30 - this.list.length
        let nextMonth = month + 2
        if(nextMonth > 12){
            nextMonth = 1
            year = year + 1
        }
        for( let j = 1;j<= num;j++ ){
             this.list.push(nextMonth+'.'+ j)
             this.listData.push(year +'-'+(nextMonth < 10 ? ('0' + nextMonth) : nextMonth)+'-'+(j < 10 ? ('0'+j) :j))
        }
    },
    changeData(){
        let arr = []
        this.checkboxGroup4.map(item=>{
            arr.push(this.listData[item])
        })
        this.$emit('callback',arr)
    }
  }
}
</script>

<style scoped>

</style>
