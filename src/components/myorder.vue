<template>
  <div>
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
        prop="roomType"
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
        label="状态"
        width="100"
        :filters="[{ text: '已入住', value: '0' }, { text: '待入住', value: '1' }, { text: '已取消', value: '2' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            type='success'
            v-if="scope.row.status=='0'"
            disable-transitions>已入住</el-tag>
          <el-tag
            v-else-if="scope.row.status=='1'"
            disable-transitions>待入住</el-tag>
          <el-tag
            type='danger'
            v-else-if="scope.row.status=='2'"
            disable-transitions>已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status=='1'"
            type="danger"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >退订</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderlist:[]
    }
  },
  methods:{
    filterTag(value, row) {
      return row.status == value;
    },
    handleEdit(index,row){
      this.$confirm('确认退订吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(index,row);
        this.axios.post('/changeOrder',{id:this.orderlist[index].id,status:'2'}).then(res => {
          this.orderlist[index].status = '2';
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
  created(){
    this.axios.post('/getOrderByName').then(res => {
      this.orderlist = res.data;
    })
  }
}
</script>

<style scoped>

</style>