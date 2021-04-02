<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="电话号码" prop="phone" class="phone-input">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">查询</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="orderlist"
    stripe
    style="width: 100%">
      <el-table-column
        prop="orderTime"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话号码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="房型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="inDate"
        label="预定入住时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="outDate"
        label="预定退房时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row,0)"
            >入住</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleEdit(scope.$index, scope.row,2)"
            >退订</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="输入信息" :visible.sync="dialogVisible" width="600px">
      <el-form ref="addFormClient" :model="addForm.client" label-width="80px" :rules="addRules">
        <el-form-item label="姓名" prop="clientName">
          <el-input v-model="addForm.client.clientName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="addForm.client.idCard"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <template>
            <el-select v-model="addForm.client.sex" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <el-form ref="addFormMoveIn" :model="addForm.moveIn" label-width="80px" :rules="addRules">
        <el-form-item label="房间号" prop="roomId">
          <template>
            <el-select v-model="addForm.moveIn.roomId" placeholder="请选择">
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.roomNumber"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('addFormClient','addFormMoveIn')">取 消</el-button>
        <el-button type="primary" @click="open('addFormClient','addFormMoveIn')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chooseIndex:'',
      options:[
        {
          value:'男',
        },
        {
          value:'女',
        }
      ],
      roomList:[],
      dialogVisible:false,
      orderlist:[],
      form:{
        phone:''
      },
      rules:{
        phone: [
          { required: true, message: '请输入电话号码'}
        ],
      },
      addForm:{
        moveIn:{
          roomId:'',
          inDate:'',
          outDate:'',
          status:1,
          pay:0
        },
        client:{
          idCard:'',
          clientName:'',
          sex:''
        }
      },
      addRules:{
        clientName: [
          { required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change'}
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change'}
        ],
      }
    }
  },
  methods:{
    cancel(formName1,formName2){
      this.$refs[formName1].resetFields();
      this.$refs[formName2].resetFields();
      this.dialogVisible = false;
    },
    open(formName1,formName2){
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          this.$refs[formName2].validate((valid) => {
            if(valid){
              this.$confirm('请您确认提交', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.axios.post('/addMoveIn',this.addForm).then(res => {
                  console.log('successaddmovein');
                  this.axios.post('/changeOrder',{id:this.orderlist[this.chooseIndex].id,status:0}).then(res => {
                    this.orderlist.splice(this.chooseIndex,1);
                  }).catch(err => {
                    console.log(err);
                  })
                }).catch(err =>{
                  console.log(err);
                })
                this.$refs[formName1].resetFields();
                this.$refs[formName2].resetFields();
                this.dialogVisible = false;
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });  
                this.$refs[formName1].resetFields();
                this.$refs[formName2].resetFields();
                this.dialogVisible = false;        
              });
            }else{
              return false;
            }
          })
        } else {
          return false;
        }
      });
    },
    filterTag(value, row) {
      return row.status == value;
    },
    handleEdit(index,row,number){
      if(number==0){
        this.dialogVisible = true;
        this.addForm.moveIn.inDate = row.inDate;
        this.addForm.moveIn.outDate = row.outDate;
        this.chooseIndex = index;
        this.axios.post('/getRoomListNoIn',{roomType:this.orderlist[index].roomType}).then(res => {
          this.roomList = res.data;
        }).catch(err => {
          console.log(err);
        })
      }else{
        this.$confirm('确定退订吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/changeOrder',{id:this.orderlist[index].id,status:number}).then(res => {
            this.orderlist.splice(index,1);
          }).catch(err => {
            console.log(err);
          })
          this.$message({
            type: 'success',
            message: '退订成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退订'
          });          
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post('/getOrderByPhone',this.form).then(res => {
            this.orderlist = res.data;
          })
        } else {
          return false;
        }
      });
    },
    reset(formName){
      this.$refs[formName].resetFields();
      this.axios.post('/getOrderList').then(res => {
        this.orderlist = res.data;
      })
    },
  },
  created(){
    this.axios.post('/getOrderList').then(res => {
      this.orderlist = res.data;
    })
  }
}
</script>

<style scoped>
.phone-input{
  width: 400px;
}
</style>