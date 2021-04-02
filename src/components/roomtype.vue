<template>
  <div>
    <el-button type="primary" @click="addRoomType">添加房型</el-button>
    <br/>
    <br/>
    <el-table
    :data="typeList"
    stripe
    style="width: 100%">
      <el-table-column
        prop="typeName"
        label="房间类型"
        width="210">
      </el-table-column>
      <el-table-column
        prop="bed"
        label="床型"
        width="240">
      </el-table-column>
      <el-table-column
        prop="breakfast"
        label="早餐"
        width="180">
      </el-table-column>
      <el-table-column
        prop="network"
        label="网络"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="输入信息" :visible.sync="dialogVisible" width="1000px">
      设置主页图:
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
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="房间类型" prop="typeName">
          <el-input v-model="form.typeName"></el-input>
        </el-form-item>
        <el-form-item label="床型" prop="bed">
          <el-input v-model="form.bed"></el-input>
        </el-form-item>
        <el-form-item label="早餐">
          <el-switch
            v-model="breakfastvalue"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="网络" prop="network">
          <el-input v-model="form.network"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduction">
          <el-input type="textarea" v-model="form.introduction" maxlength="60" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        action=""
        :http-request="upFile"
        :on-remove="removeFile"
        :file-list="fileList"
        list-type="picture">
        <el-button size="small" type="primary">上传详情图片</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="open('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  data() {
    return {
      fileList:[],
      breakfastvalue:false,
      imageUrl: '',
      form:{
        mainImage:'',
        typeName:'',
        bed:'',
        breakfast:null,
        network:'',
        price:'',
        introduction:'',
        roomImage:[]
      },
      rules:{
				typeName:[
					{ required: true, message: '请输入房间类型', trigger: 'blur' },
        ],
        bed: [
          { required: true, message: '请输入床型', trigger: 'blur' },
        ],
        network:[
          { required: true, message: '请输入网络情况', trigger: 'blur' },
        ],
        price:[
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],
        introduction:[
          { required: true, message: '请输入介绍', trigger: 'blur' },
        ]
			},
      dialogVisible: false,
      typeList:[],
      fileurl: [],
      upfilenamelist:[],
      upfileurllist:[],
    }
  },
  methods:{
    cancel(formName){
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    removeFile(file,fileList){
      fileList = fileList.map(v => {
        return {
          name: v.name,
        }
      })
      console.log(fileList);
      this.upfilenamelist = fileList;
    },
    upFile(param) {
      var formData = new FormData();
      formData.append("file", param.file);
      this.axios.post("/upAvatar", formData).then((res) => {
        if (res != null) {
          this.fileurl.push({filename:param.file.name,url:res.data.avatar});
          this.upfilenamelist.push({name:param.file.name})
          console.log(this.fileurl);
        }
      });
    },
    getFileurlList(){
      this.upfileurllist=[]
      this.fileurl.forEach(item => {
        this.upfilenamelist.forEach(i =>{
          console.log("item名字"+item.filename);
          console.log("i名字"+i.name);
          if(item.filename == i.name){
            this.upfileurllist.push(item.url);
            console.log(item.url);
          }
        })
      })
      console.log("文件url列表"+this.upfileurllist[0])
      console.log("文件url列表"+this.upfileurllist[1])
    },
    upAvatar(param){
      this.imageUrl = param.file.url;
      var formData = new FormData();
      formData.append("file", param.file);
      this.axios.post("/upAvatar", formData).then((res) => {
        if (res != null) {
          this.imageUrl = res.data.avatar;
          this.form.mainImage = res.data.avatar;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      return isJPG;
    },
    open(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          if(this.form.mainImage==''){
            this.$message.error('主页图不能为空！');
          }else{
            this.$confirm('请您确认提交', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submit(formName);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
          }
        }else{
          return false;
        }
      })
    },
    submit(formName) {
      if(this.breakfastvalue==true){
        this.form.breakfast = 1;
      }else{
        this.form.breakfast = 0;
      }
      this.axios.post('/getRoomTypeByName',{typeName:this.form.typeName}).then(res => {
        if(res.data == 1){
          this.$message.error('该房型已存在，请修改名字！');
          this.form.typeName = '';
        }else{
          this.getFileurlList();
          this.form.roomImage = this.upfileurllist;
          this.axios.post('/addRoomType',this.form).then(res => {
            this.reload();
          })
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
        }
      })
    },
    addRoomType(){
      this.dialogVisible = true;
    },
    filterTag(value, row) {
      return row.status == value;
    },
    handleEdit(index,row){
      this.$confirm('确认删除该房型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(index,row);
        this.axios.post('/deleteRoomType',{id:this.typeList[index].id}).then(res => {
          if(res.data==1){
            this.typeList.splice(index,1);
          }else{
            this.$message.error("当前这种房型还有预定或入住！");
          }
        }).catch(err => {
          console.log(err);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  created(){
    this.axios.post('/getRoomTypeList').then(res => {
      this.typeList = res.data;
    })
  }
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
</style>