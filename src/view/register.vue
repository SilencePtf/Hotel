<template>
  <div class="loginPage">
    <div class="loginForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="" prop="username">
          <el-input v-model="ruleForm.username" prefix-icon='el-icon-user' placeholder="请输入用户名"></el-input>
        </el-form-item>
				<el-form-item label="" prop="password">
          <el-input type="password" v-model="ruleForm.password" prefix-icon='el-icon-lock' placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" prefix-icon='el-icon-lock' placeholder="请确认密码"></el-input>
        </el-form-item>
				<el-form-item>
					<div class="buttonPadding"></div>
    			<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
  			</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'register',
  data(){
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
		return{
			ruleForm:{
				username:'',
        password:'',
        checkPass:''
			},
			rules:{
				username:[
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3,max: 8,message:"长度在3到8个字符",trigger:'blur'}
				],
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 3,max: 8,message:"长度在3到8个字符",trigger:'blur'}
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
			}
		}	
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
				if (valid) {
					// alert('submit!');
					console.log(this.ruleForm);
					this.axios.post("/register",{username:this.ruleForm.username,password:this.ruleForm.password}).then(res =>{
						if(res.data==0){
              this.ruleForm.username='';
              this.$message.error("该用户名已存在")
            }else{
              this.$router.push('/login');
              this.$message({
                message: '注册成功',
                type: 'success'
              });
            }
					}).catch(err=>{
						console.log(err);
					})
				} else {
					return false;
				}
			});
    }
  }
}
</script>

<style scoped>
.loginPage{
	position: absolute;
	width: 100%;
	height: 100%;
	background:#409eff;
}
.loginForm{
	background-color: rgb(255, 255, 255, 0.8);
	width: 350px;
	padding: 70px 95px 30px 0px;
	border-radius: 10px;
	top: 50%;
	left: 50%;
	position: absolute;
	transform: translate(-50%,-50%);
}
.buttonPadding{
	float: left;
	width: 90px;
	height: 40px;
}
</style>