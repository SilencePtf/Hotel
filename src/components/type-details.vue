<template>
  <div class="details-page">
    <blank-padding></blank-padding>
    <div class="basic-info-card">
      <div class="basic-main-image">
        <img :src="content.mainImage">
      </div>
      <div class="basic-title">
        {{content.typeName}}
      </div>
      <div class="basic-info">
        <ul class="info-ul">
          <li>床型：&nbsp;{{content.bed}}</li>
          <li>网络：&nbsp;{{content.network}}</li>
          <li>早餐：&nbsp;{{haveBreakfast}}</li>
          <li>价格：&nbsp;{{content.price}}</li>
        </ul>
      </div>
      <el-button round class="basic-button" type="primary" @click="dialogVisible = true">预定</el-button>
    </div>
    <div class="comment-card">
      <blank-padding></blank-padding>
      <comment-item v-for="item in comment.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="item.id">
        <template v-slot:avatar>
          <img :src="item.avatar">
          <!-- {{ item.avatar }} -->
        </template>
        <template v-slot:username>
          {{ item.username }}&nbsp;&nbsp;&nbsp;发表评论说：
        </template>
        <template v-slot:comment>
          {{ item.comment }}
        </template>
        <template v-slot:date>
          {{ item.time }}
        </template>
      </comment-item>
      <blank-padding></blank-padding>
      <div class="slice">
        <el-pagination 
        layout="prev, pager, next" 
        :total="comment.length"
        :page-size="pagesize"
        :current-page.sync="currentPage"
        @current-change="current_change"
        :hide-on-single-page='true'
        >
        </el-pagination>
      </div>
      <div class="textIn">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          maxlength="60"
          show-word-limit
        >
        </el-input>
      </div>
      <br/>
      <div class="commentbt">
        <el-button type="primary" icon="el-icon-edit" circle @click="upComment"></el-button>
      </div>
      <blank-padding></blank-padding>
      <blank-padding></blank-padding>
    </div>
    <div class="details-info-card">
      <div class="details-text">
        {{content.introduction}}
      </div>
      <div class="details-img" v-for="item in imageList" :key="item.id">
        <img :src="item.url">
      </div>
    </div>
    <el-dialog title="输入信息" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="入住姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="open('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import blankPadding from './blank-padding.vue'
import commentItem from './commentItem.vue'
export default {
  components: { blankPadding, commentItem},
  data() {
    return {
      haveBreakfast:'',
      inDate:'',
      outDate:'',
      content: '',
      comment: [],
      pagesize: 10,
      currentPage: 1,
      textarea:'',
      time:'',
      avatar:'',
      updetails:{
        roomType:'',
        comment:''
      },
      index:'1',
      dialogVisible:false,
      form:{
        name:'',
        phone:''
      },
      rules:{
        name:[
					{ required: true, message: '请输入入住人姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
      },
      imageList:[]
    };
  },
  created(){
    this.inDate = window.sessionStorage.getItem("inDate");
    this.outDate = window.sessionStorage.getItem("outDate");
    this.axios.post("/getRoomTypeById",{id:this.$route.params.id}).then(res => {
      this.content = res.data;
      if(res.data.breakfast==1){
        this.haveBreakfast = '含早餐'
      }else{
        this.haveBreakfast = '不含早餐'
      }
    }).catch(err => {
      console.log(err);
    });
    this.axios.post("/getImage",{id:this.$route.params.id}).then(res => {
      this.imageList = res.data;
    }).catch(err => {
      console.log(err);
    });
    this.axios.post("/getCommentList",{id:this.$route.params.id}).then(res => {
      this.comment = res.data;
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    current_change(currentPage) {
      this.currentPage = currentPage;
    },
    upComment(){
      if(this.textarea==''){
        this.$message.error('请输入评论内容！');
      }else{
        var date = new Date();
        let hour = date.getHours(); // 时
        hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
        let minute = date.getMinutes(); // 分
        minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
        this.updetails.roomType = this.$route.params.id;
        this.updetails.comment = this.textarea;
        this.comment.unshift({
          username:window.sessionStorage.getItem("username"),
          comment:this.textarea,
          avatar:window.sessionStorage.getItem("avatar"),
          time:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+hour+':'+minute
        })
        this.axios.post("/addComment",this.updetails).then(res =>{
          console.log(res);
        }).catch(err =>{
          console.log(err)
        })
        this.textarea=''
      }
    },
    open(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$alert('入住姓名：'+this.form.name+'<br/>电话号码：'+this.form.phone+'<br/>入住时间：'+this.inDate+'<br/>退房时间：'+this.outDate, '确认信息', {
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.axios.post('/confirmCanOrder',{
              roomType:this.$route.params.id,
              inDate:this.inDate,
              outDate:this.outDate,
            }).then(res => {
              if(res.data == 1){
                this.axios.post('/addOrder',{
                  roomType:this.$route.params.id,
                  inDate:this.inDate,
                  outDate:this.outDate,
                  clientName:this.form.name,
                  phone:this.form.phone
                }).then(res => {
                  this.$message({
                    type: 'success',
                    message: '成功预定'
                  });
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields();
                }).catch(err => {
                  console.log(err);
                })
              }else{
                this.$message.error("该房型房间已满");
                this.dialogVisible = false;
                this.$refs[formName].resetFields();
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }else{
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>
.details-page{
  width: 1440px;
  margin: 0 auto;
}
.basic-info-card{
  width: 70%;
  height: 430px;
  float: left;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 10px #e9e7ef;
  -moz-box-shadow: 0 0 10px #e9e7ef;
  box-shadow: 0 0 10px #e9e7ef;
}
.basic-main-image{
  width: 600px;
  height: 350px;
  margin: 40px;
  float: left;
}
.basic-main-image img{
  width: 100%;
  height: 100%;
}
.basic-title{
  width: 328px;
  line-height: 60px;
  height: 60px;
  /* background: yellow; */
  float: left;
  margin-top: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 30px;
}
.basic-info{
  width: 288px;
  height: 200px;
  float: left;
  background: rgba(245, 243, 243, 0.527);
  border-radius: 5px;
}
.info-ul{
  list-style: none;
  margin-top: 40px;
}
.info-ul li{
  margin-top: 10px;
}
.basic-button{
  width: 120px;
  height: 45px;
  background: #b0a4e3;
  border: #b0a4e3;
  margin-top: 35px;
}
.details-text{
  margin: 40px;
  background: rgba(245, 243, 243, 0.527);
  line-height: 40px;
  word-wrap:break-word;
  text-indent:2em;
}
.details-img{
  margin-left: 40px;
  margin-bottom: 40px;
  width: 444px;
  float: left;
}
.details-img img{
  width: 100%;
  height: 100%;
}
.comment-card{
  width: 29%;
  float: left;
  margin-left: 1%;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 10px #e9e7ef;
  -moz-box-shadow: 0 0 10px #e9e7ef;
  box-shadow: 0 0 10px #e9e7ef;
}
.details-info-card{
  width: 70%;
  float: left;
  margin-top: 20px;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 10px #e9e7ef;
  -moz-box-shadow: 0 0 10px #e9e7ef;
  box-shadow: 0 0 10px #e9e7ef;
}
.slice {
  margin: 0 auto;
  width: 80%;
}
.textIn{
  margin: 0 auto;
  width: 85%;
}
.commentbt{
  width: 55%;
  float: right;
}
</style>