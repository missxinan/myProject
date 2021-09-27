<template>
  <div>
    <el-button type="primary" @click="toAddGoods">去添加商品</el-button>
    列表页
  </div>
</template>

<script>
export default {
  name: "goodsList",
  data(){
    return {

    }
  },
  methods: {
    toAddGoods(){
      this.$router.push('/ownStoreGoods/addOwnStoreGoods')
    }
  }

}
</script>

<style scoped>

</style>
