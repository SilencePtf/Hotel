<template>
  <div class="myselfPage">
    <blank-padding></blank-padding>
    <el-container>
      <el-aside width="15%">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          active-text-color="#b0a4e3"
        >
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">
              个人资料
            </span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">
              我的订单
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import blankPadding from './blank-padding.vue'
export default {
  components: { blankPadding },
  data(){
    return{
      activeIndex:'1'
    }
  },
  methods:{
    handleSelect(key,keyPath){
      if(key=='1'){
        this.$router.push('/home/myself/mydata');
      }else if(key=='2'){
        this.$router.push('/home/myself/myorder');
      }
    },
  },
  created(){
    if(this.$route.path=='/home/myself/myorder'){
      this.activeIndex = '2';
    }else{
      this.activeIndex = '1';
    }
  }
}
</script>

<style scoped>
.myselfPage{
  width: 1440px;
  margin: 0 auto;
}
</style>