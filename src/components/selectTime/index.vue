<template>
  <div class="pagination-container">
     <el-button type="primary" size="mini" @click="addlist">新增</el-button>
     <div class="list_content">
         <div class="li_list" v-for="(item,index) in list" :key="index">
             <el-time-picker
                v-model="item.value"
                @change="changeData"
                format='HH:mm' 
                value-format="HH:mm"
                placeholder="选择时间">
                </el-time-picker>
                <el-input v-model="item.interval" @change="changeData" style="margin:0 10px;" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入内容"></el-input>
                <el-button type="danger" @click="delList(index)" size="mini">删除</el-button>
         </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'selectTime',
  props: {},
  data(){
    return{
      list:[{
          value:'10:00',
          interval:'10',
          startTime:'',
          endTime:''
      }],
     
    }
  },
  created(){
    this.changeData();
  },
  computed: {
  },
  methods: {
    addlist(){
        this.list.push({value:'10:00',interval:'10',startTime:'',endTime:''})
        this.changeData();
    },
    delList(index){
        this.list.splice(index,1)
        this.changeData();
    },
    changeData(){
        this.list.map(item=>{
            item.startTime = item.value + ':00'
            let dateTimer = (item.value.split(':')[0])*3600 + (item.value.split(':')[1])*60 + item.interval*60
            let hour = parseInt(dateTimer/60/60)
            let minutes = parseInt(dateTimer/60%60)
            let seconds = parseInt(dateTimer%60)
            item.endTime = (hour < 10 ? '0' + hour : hour ) + ':' + (minutes < 10 ? '0' + minutes : minutes ) +':'+ (seconds < 10 ? '0' + seconds : seconds )
        })

        this.$emit('callback',this.list)
    }
  }
}
</script>

<style scoped>
    .list_content{
        display: flex;
        flex-direction: column;
    }
    .list_content input::after{
        width: 80px;
    }
    .li_list{
        display: flex;
        width: 60%;
       justify-content: space-between;
       margin-bottom: 10px;
    }
</style>
