<template>
  <div>
    <el-button type="primary" @click="newMoveIn">
      新入住
    </el-button>
    <br/>
    <br/>
    <br/>
    <br/>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="房间号" prop="roomNumber" class="phone-input">
        <el-input v-model="form.roomNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">查询</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="moveinList"
    stripe
    style="width: 100%">
      <el-table-column
        prop="roomNumber"
        label="房间号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="210">
      </el-table-column>
      <el-table-column
        prop="inDate"
        label="入住时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="outDate"
        label="退房时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pay"
        label="待支付"
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
            >退房</el-button>
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
        <el-form-item label="选择时间" prop="time">
          <template>
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
          </template>
        </el-form-item>
        <el-form-item label="房型" prop="roomType" v-if="havetime">
          <template>
            <el-select v-model="addForm.moveIn.roomType" placeholder="请选择" @change="typeChange">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="房间号" prop="roomId" v-if="havetype">
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
  inject:['reload'],
  data(){
    return{
      havetype:false,
      havetime:false,
      pickerOptions: {
          disabledDate(time) {
            var curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000);
            return time.getTime() < preDate; //不可以选择今天之前的日期 
            // return time.getTime() > Date.now(); //不可以选择今天之后的日期 
          }
      },
      value:'',
      options:[
        {
          value:'男',
        },
        {
          value:'女',
        }
      ],
      roomList:'',
      typeList:'',
      addRoomType:'',
      dialogVisible:false,
      moveinList:[],
      form:{
        roomNumber:''
      },
      rules:{
        roomNumber: [
          { required: true, message: '请输入房间号'}
        ],
      },
      addForm:{
        moveIn:{
          roomId:'',
          inDate:'',
          outDate:'',
          status:1,
          pay:0,
          roomType:'',
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
        roomType: [
          { required: true, message: '请选择房型', trigger: 'change'}
        ],
      }
    }
  },
  methods:{
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
                  this.reload();
                  console.log('successaddmovein');
                }).catch(err =>{
                  console.log(err);
                })
                this.$refs[formName1].resetFields();
                this.$refs[formName2].resetFields();
                this.dialogVisible = false;
                this.havetype = false;
                this.havetime = false;
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
        } else {
          return false;
        }
      });
    },
    cancel(formName1,formName2){
      this.$refs[formName1].resetFields();
      this.$refs[formName2].resetFields();
      this.dialogVisible = false;
      this.havetype = false;
      this.havetime = false;
      this.value = '';
    },
    changeTime(){
      this.havetime = true;
      this.addForm.moveIn.inDate = this.value[0];
      this.addForm.moveIn.outDate = this.value[1];
      this.axios.post("/getRoomTypeListCan",{inDate:this.value[0],outDate:this.value[1]}).then(res => {
        this.typeList = res.data;
      }).catch(err => {
        console.log(err);
      })
    },
    newMoveIn(){
      this.dialogVisible = true;
    },
    typeChange(){
      this.havetype = true;
      this.axios.post('/getRoomListNoIn',{roomType:this.addForm.moveIn.roomType}).then(res => {
        this.roomList = res.data;
      }).catch(err => {
        console.log(err);
      });
    },
    handleEdit(index,row){
      this.$confirm('需付款'+this.moveinList[index].pay+',确定退房吗','提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/outRoom',{id:this.moveinList[index].id,roomNumber:this.moveinList[index].roomNumber}).then(res => {
          this.moveinList.splice(index,1);
        }).catch(err => {
          console.log(err);
        });
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post('/getMoveInByRoomNumber',this.form).then(res => {
            if(res.data){
              this.moveinList = [];
              this.moveinList[0] = res.data;
            }else{
              this.moveinList = [];
            }
          })
        } else {
          return false;
        }
      });
    },
    reset(formName){
      this.$refs[formName].resetFields();
      this.axios.post('/getInList').then(res => {
        this.moveinList = res.data;
      }).catch(err => {
        console.log(err);
      })
    },
  },
  created(){
    this.axios.post('/getInList').then(res => {
      this.moveinList = res.data;
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style scoped>
.phone-input{
  width: 400px;
}
</style>