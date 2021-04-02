<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 15px">
        {{adminName}}
        <el-dropdown>
          <i class="el-icon-setting"  style="margin-right:30px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>
    <blank-padding></blank-padding>
    <div class="admin-home-main">
      <el-container>
        <el-aside width="15%">
          <el-col>
            <el-menu
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              @select="handleSelect"
              active-text-color="#b0a4e3"
            >
              <el-menu-item index="1">
                <i class="el-icon-setting"></i>
                <span slot="title">
                  房型管理
                </span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-setting"></i>
                <span slot="title">
                  房间管理
                </span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-setting"></i>
                <span slot="title">
                  预定管理
                </span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">
                  入住管理
                </span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import blankPadding from '../components/blank-padding.vue'
export default {
  components: { blankPadding },
  data(){
    return {
      adminName:'',
      activeIndex:''
    }
  },
  methods:{
    logout(){
      window.sessionStorage.removeItem('token');
      window.sessionStorage.removeItem('adminName');
      this.$router.push("/adminlogin");
    },
    handleSelect(key,keyPath){
      if(key=='1'){
        this.$router.push('/adminhome/roomtype');
      }else if(key=='2'){
        this.$router.push('/adminhome/room');
      }else if(key=='3'){
        this.$router.push('/adminhome/order')
      }else if(key=='4'){
        this.$router.push('/adminhome/movein')
      }
    },
  },
  created(){
    this.adminName = window.sessionStorage.getItem('adminName');
    if(this.$route.path=='/adminhome/roomtype'){
      this.activeIndex = '1';
    }else if(this.$route.path=='/adminhome/room'){
      this.activeIndex = '2';
    }else if(this.$route.path=='/adminhome/order'){
      this.activeIndex = '3';
    }else if(this.$route.path=='/adminhome/movein'){
      this.activeIndex = '4';
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color:#b0a4e3;
  color: #333;
  line-height: 60px;
}
.admin-home-main{
  width: 1440px;
  margin: 0 auto;
}
</style>