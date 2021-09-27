<template>
  <div class="app-container">
    <!-- <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" /> -->
    <!-- <el-date-picker
        :picker-options="pickerOptions"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="time"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    /> -->
    <!-- <timeSelectPicker :startTime='startTime' :endTime='endTime'></timeSelectPicker> -->
  </div>
</template>

<script>
// import timeSelectPicker from "@/components/timeSelectPicker"; 
export default {
  // components:{
  //   timeSelectPicker
  // },
  data() {
    return {
      pickerOptions: {
         shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }],
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        },
        disabledDate: (time) => {
          const self = this;
          if (!!self.choiceDate) {
            console.log(self.choiceDate,'self.choiceDate')
            const startDay = new Date(self.choiceDate - (24 * 3600 * 1000 * 30));
            const endDay = new Date(self.choiceDate)
            let minTime = startDay;
            let maxTime =  endDay;
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      choiceDate: '',
      time:[],
      startTime:'',
      endTime:''
    }
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree2.filter(val)
    // }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  // pickerOptions: {
  //       onPick: ({ maxDate, minDate }) => {
  //         this.choiceDate = minDate.getTime()
  //         if (maxDate) {
  //           this.choiceDate = ''
  //         }
  //       },
  //       disabledDate: (time) => {
  //         const self = this;
  //         if (!!self.choiceDate) {
  //           console.log(self.choiceDate,'self.choiceDate')
  //           const startDay = (new Date(self.choiceDate).getDate() - 1) * 24 * 3600 * 1000;
  //           const endDay = (new Date(new Date(self.choiceDate).getFullYear(),new Date(self.choiceDate).getMonth() + 1,0).getDate() - new Date(self.choiceDate).getDate()) * 24 * 3600 * 1000;
  //           let minTime = self.choiceDate - startDay;
  //           let maxTime = self.choiceDate + endDay;
  //           return time.getTime() < minTime || time.getTime() > maxTime
  //         }
  //       }
  //     },
}
</script>

