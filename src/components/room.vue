<template>
  <div>
    <el-button type="primary" @click="addRoom">添加房间</el-button>
    <br/>
    <br/>
    <el-table
    :data="roomList"
    stripe
    style="width: 100%">
      <el-table-column
        prop="roomNumber"
        label="房间号"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roomType"
        label="房型"
        width="300">
      </el-table-column>
      <el-table-column
        prop="inRoom"
        label="状态"
        width="300"
        :filters="[{ text: '空闲', value: '0' }, { text: '已入住', value: '1' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            type='success'
            v-if="scope.row.inRoom=='0'"
            disable-transitions>空闲</el-tag>
          <el-tag
            v-else-if="scope.row.inRoom=='1'"
            disable-transitions>已入住</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="inRoom"
        label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.inRoom=='0'"
            type="danger"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="输入信息" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="form.roomNumber"></el-input>
        </el-form-item>
        <el-form-item label="房型" prop="roomType">
          <template>
            <el-select v-model="form.roomType" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
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
  data(){
    return{
      typeList:[],
      roomList:[],
      dialogVisible:false,
      form:{
        roomNumber:'',
        roomType:''
      },
      rules:{
				roomNumber:[
					{ required: true, message: '请输入房间号', trigger: 'blur' },
        ],
        roomType:[
					{ required: true, message: '请输入房间类型', trigger: 'change' },
        ],
      }
    }
  },
  methods:{
    filterTag(value, row) {
      return row.status == value;
    },
    handleEdit(index,row){
      this.$confirm('确认删除该房间?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/deleteRoom',{id:this.roomList[index].id}).then(res => {
          this.roomList.splice(index,1);
        }).catch(err => {
          console.log(err);
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    addRoom(){
      this.dialogVisible = true;
      this.axios.post('/getRoomTypeList').then(res => {
        this.typeList = res.data;
      }).catch(err => {
        console.log(err);
      })
    },
    cancel(formName){
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    open(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('请您确认提交', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.submit(formName);
            console.log(this.form);
            this.axios.post('/selectRoomByNumber',{roomNumber:this.form.roomNumber}).then(res => {
              if(res.data == 1){
                // this.$confirm('这个房间已存在，您要更新该房间的信息吗？','提示', {
                //   confirmButtonText: '确认',
                //   cancelButtonText: '取消',
                //   type: 'warning'
                // }).then(()=>{
                //   this.axios.post('/updateRoom',this.form).then(res => {
                //     this.reload();
                //   })
                // })
                this.$message.error("这个房间已存在");
              }else{
                this.axios.post('/addRoom',this.form).then(res =>{
                  this.reload();
                })
              }
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
        } else {
          return false;
        }
      });
    },
  },
  created(){
    this.axios.post('/getRoomList').then(res => {
      this.roomList = res.data;
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style scoped>

</style>