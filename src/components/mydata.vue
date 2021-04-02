<template>
  <div class="mydataPage">
    修改头像:
    <el-upload
      class="avatar-uploader"
      :http-request="upAvatar"
      action=""
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <br/>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请确认密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="change('ruleForm')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'mydata',
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      imageUrl: '',
      ruleForm:{
				password:'',
        checkPass:'',
				phone:''
			},
			rules:{
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 3,max: 8,message:"长度在3到8个字符",trigger:'blur'}
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        phone:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
        ]
			}
    };
  },
  created(){
    this.imageUrl = window.sessionStorage.getItem("avatar");
  },
  methods: {
    change(formName){
      this.$refs[formName].validate((valid) => {
				if (valid) {
          this.axios.post('/updateInfo',{
            password:this.ruleForm.password,
            phone:this.ruleForm.phone
          }).then(res =>{
            if(res.data=='success'){
              this.$message({
                message:'修改成功',
                type:'success'
              })
            }else{
              return false;
            }
          })
				} else {
					return false;
				}
			});
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    open(){
      this.$confirm('确认提交描述吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.commit();
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    commit(){
      this.axios.post('/setProfile',this.ruleForm).then(res=>{
        console.log("上传简介成功");
        this.ruleForm.profile=''
      }).catch(err=>{
        console.log("上传简介失败");
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.open();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    upAvatar(param){
      this.imageUrl = param.file.url;
      var formData = new FormData();
      formData.append("file", param.file);
      this.axios.post("/upAvatar", formData).then((res) => {
        if (res != null) {
          window.sessionStorage.setItem("avatar",res.data.avatar);
          console.log(res.data.avatar);
          this.imageUrl = res.data.avatar;
        }
      }).catch(err => {
        console.log(err);
      });
    }
  },
}
</script>

<style scoped>
.avatar-uploader{
  margin-left: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-left: 100px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.subbtn{
  margin-left: 100px;
}
</style>