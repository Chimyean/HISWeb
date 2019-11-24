<template>
  <div v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="underHeader">
      <!--搜索-->
      <span>
        <el-input v-model="searchInput"
        placeholder="请输入要搜索的病人姓名"
        size="medium"
        prefix-icon="el-icon-search"></el-input>
        <el-button @click="search">搜索</el-button>
      </span>
    </div>
    <div>
      <el-table
      :data="tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)"
      align="center"
      border
      style="width: 100%">
      <el-table-column
      align="center"
      prop="name"
      label="病人姓名">
      <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <!-- <el-table-column
      align="center"
      prop="prescription"
      label="病人处方单">
      <template slot-scope="scope">{{scope.row.prescription}}</template>
      </el-table-column> -->
      <el-table-column
      align="center"
      label="是否已缴费"
      width="200">
      <!-- <template slot-scope="scope">{{scope.row.state}}</template> -->
      <template v-show="scope.row.ifDose" slot-scope="scope">
          <el-switch
            v-model="scope.row.ifPay"
            active-text="已缴费"
            inactive-text="未缴费"
            inactive-value="-1"
            active-value="1"
            @change="changeStatus(scope)"/>
      </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="操作">
      <template slot-scope="scope">
      <span class="btnBox">
        <el-button size="small" @click="toPay(scope)">查看总价</el-button>
      </span>
      </template>
      </el-table-column>
  </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination
      background
      layout="prev, pager, next"
      :total="totalPage"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Bmob from 'hydrogen-js-sdk'
export default{
  data () {
    return {
      allPage: 1, // 所有页数监听搜索框用（监听搜索框）
      searchInput: '',
      input: '',
      tableData: [], // 存放显示的所有药品
      filterData: [], // 存放所有来自bmob的药品
      loading2: false,
      pageSize: 6,
      currentPage: 1,
      totalPage: 1,
      dialogVisible: false,
      changeNum: '',
      neikePerson: 0,
      waikePerson: 0,
      fuchankePerson: 0,
      nankePerson: 0,
      erkePerson: 0,
      wuguankePerson: 0,
      zhongliukePerson: 0,
      pifuxingbingkePerson: 0,
      zhongyikePerson: 0,
      chuanrankePerson: 0,
      jingshenkePerson: 0,
      form: {
        name: '',
        diseaseType: '',
        office: '',
        doctor: ''
        // number: 0
      }
    }
  },
  // 对搜索框进行监听
  watch: {
    searchInput () {
      if (this.searchInput === '') {
        this.tableData = this.filterData
        this.totalPage = this.allPage
      }
    }
  },
  mounted () {
    this.getPatient()
  },
  methods: {
    changeStatus (scope) {
      console.log('state', scope.row.ifPay)
      const changeState = Bmob.Query('patient')
      changeState.get(scope.row.objectId).then(res => {
        res.set('ifPay', scope.row.ifPay)
        res.save()
        this.getPatient()
      }).catch(err => {
        console.log(err)
      })
    },
    getPatient () {
      this.loading2 = true
      const query = Bmob.Query('patient')
      query.get('').then(res => {
        console.log(res)
        this.tableData = res.results.reverse()
        // console.log('测试', JSON.stringify(res.results[0].prescription).toString())
        // for (let i in res.results[0].prescription) {
        //   console.log('测试', res.results[0].prescription[i]['name'] + res.results[0].prescription[i]['number'])
        // }
        this.totalPage = res.results.length
        this.filterData = res.results
        this.allPage = res.results.length
        setTimeout(() => {
          this.loading2 = false
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // console.log('当前页', this.currentPage)
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    search () {
      const searchPatient = Bmob.Query('patient')
      searchPatient.containedIn('name', [this.searchInput])
      searchPatient.find().then(res => {
        this.tableData = res
        this.totalPage = res.length
        // console.log(res[0])
      })
    },
    toPay (scope) {
      console.log('the scope', scope)
      this.patientId = scope.row.objectId
      console.log('id', this.patientId)
      this.$router.push({path: 'pay', query: {patientId: this.patientId}})
    }
  }
}
</script>
<style>
body{
  background: url('../../assets/background-white.jpg');
  background-size: 100%;
  background-repeat:no-repeat;
}
.el-input{
  width: 300px;
}
.underHeader{
  display: flex;
  justify-content: center;
}
.el-button{
  width: 100px;
  background-color: #158998;
  color:white;
}
.btnBox > .el-button{
  width: 80px;
}
.el-table{
  margin-top: 30px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color: #158998;
}
.paginationBox{
  display: flex;
  justify-content: center;
  margin-top:30px;
}
.dialog-footer{
  display: flex;
  justify-content: space-around;
}
</style>
