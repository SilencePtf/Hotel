<template>
  <div>
    <div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#b0a4e3"
        text-color="#fff"
        active-text-color="#70f3ff"
        >
        <div class="toppadding1"></div>
        <el-menu-item index="1">Hotel</el-menu-item>
        <div class="toppadding2"></div>
        
        <el-submenu index="2">
          <template slot="title">
            <div class="topAvatar">
              <img :src="this.avatar">
            </div>
            {{username}}
          </template>
          <el-menu-item index="2-1">个人中心</el-menu-item>
          <el-menu-item index="2-2">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeIndex: '1',
      username:'',
      avatar:''
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key==1){
        this.$router.push('/home');
      }else{
        if(keyPath[1]==="2-1"){
          this.$router.push("/home/myself");
        }else{
          window.sessionStorage.removeItem('token');
          window.sessionStorage.removeItem('username');
          window.sessionStorage.removeItem('avatar');
          this.$router.push("/login");
        }
      }
    }
  },
  created(){
    this.username = window.sessionStorage.getItem('username');
    this.avatar = window.sessionStorage.getItem('avatar');
  }
}
</script>

<style scoped>
.toppadding1{
  width: 15%;
  height: 61px;
  float: left;
}
.toppadding2{
  width: 55%;
  height: 61px;
  float: left;
}
.topAvatar{
  width: 40px;
  height: 40px;
  border: 1px;
  border-radius: 50%;
  float: left;
  padding: 0 10px 0 0;
}
.topAvatar img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
