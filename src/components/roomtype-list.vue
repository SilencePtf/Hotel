<template>
  <div class="roomtypelistdiv">
    <blank-padding></blank-padding>
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="item in roomtypeItem" :key="item.id">
        <img :src="item.mainImage" class="hoverImage" />
      </el-carousel-item>
    </el-carousel>
    <blank-padding></blank-padding>
    请选择时间：
    <div class="block">
      <el-date-picker
        v-model="value"
        @change="changeTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['14:00:00','12:00:00']"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyyMMdd"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
    <div class="itemdiv" v-for="item in afterChooseList" :key="item.id">
      <div class="itemcard">
        <router-link
          :to="{ name: 'typedetails', params: { id: item.id } }"
          class="a"
        >
          <div class="itemimagediv">
            <img :src="item.mainImage" />
          </div>
          <div class="titlediv">
            <h2 class="textlimit">{{ item.typeName }}</h2>
          </div>
          <div class="labeldiv">
            <el-tag v-if="item.breakfast==1">有早</el-tag>
            <el-tag v-else>无早</el-tag>
            &nbsp;
            <el-tag type="success">{{item.network}}</el-tag>
            &nbsp;
            <el-tag type="warning">剩余：{{item.spare}}</el-tag>
          </div>
          <div class="labeldiv">
            <el-tag type="danger">￥{{ item.price }}</el-tag>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import blankPadding from "./blank-padding.vue";
export default {
  components: { blankPadding },
  methods: {
    changeTime(){
      console.log(this.value);
      window.sessionStorage.setItem("inDate",this.value[0]);
      window.sessionStorage.setItem("outDate",this.value[1]);
      this.axios.post("/getRoomTypeListCan",{inDate:this.value[0],outDate:this.value[1]}).then(res => {
        this.afterChooseList = res.data;
      }).catch(err => {
        console.log(err);
      })
      if(this.afterChooseList==[]){
        this.$message.error("您所选择的时间内房间都已订满!");
      }
    }
  },
  data() {
    return {
      pickerOptions: {
          disabledDate(time) {
            var curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000);
            return time.getTime() < preDate; //不可以选择今天之前的日期 
            // return time.getTime() > Date.now(); //不可以选择今天之后的日期 
          }
      },
      roomtypeItem: [],
      afterChooseList:[],
      value:''
    };
  },
  created() {
    this.axios.post("/getRoomTypeList").then((res) => {
      this.roomtypeItem = res.data;
      console.log(this.roomtypeItem);
    });
  },
};
</script>

<style scoped>
.block{
  margin:20px
}
.roomtypelistdiv {
  width: 1440px;
  margin: 0 auto;
}
.hoverImage {
  width: 100%;
  height: 100%;
}
.itemdiv {
  width: 720px;
  height: 290px;
  float: left;
}
.itemcard {
  width: 680px;
  height: 250px;
  margin: 20px;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 10px #e9e7ef;
  -moz-box-shadow: 0 0 10px #e9e7ef;
  box-shadow: 0 0 10px #e9e7ef;
}
.itemimagediv {
  width: 384px;
  height: 250px;
  float: left;
}
.itemimagediv img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.textlimit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.titlediv {
  width: 296px;
  line-height: 60px;
  margin: 0 auto;
  text-align: center;
  float: left;
}
.labeldiv {
  width: 296px;
  line-height: 75px;
  margin: 0 auto;
  text-align: center;
  float: left;
}
.a {
  text-decoration: none;
  color: black;
}
</style>