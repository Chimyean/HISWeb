<template>
  <div v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="underHeader">
      <span>
        <el-input v-model="searchInput"
        placeholder="请输入要搜索的医生姓名"
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
      prop="doctorName"
      label="医生姓名">
      <template slot-scope="scope">{{scope.row.doctorName}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="office"
      label="所在科室">
      <template slot-scope="scope">{{scope.row.office}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="patientNum"
      label="接诊病人数">
      <template slot-scope="scope">{{scope.row.patientNum}}</template>
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
      ifExist: 0,
      getTableData: 0,
      input: '',
      tableData: [], // 存放显示的所有药品
      filterData: [], // 存放所有来自bmob的药品
      loading2: false,
      pageSize: 6,
      currentPage: 1,
      totalPage: 1,
      dialogVisible: false,
      changeDialogVisible: false,
      options: [{
        value: '内科',
        label: '内科'
      }, {
        value: '外科',
        label: '外科'
      }, {
        value: '妇产科',
        label: '妇产科'
      }, {
        value: '男科',
        label: '男科'
      }, {
        value: '儿科',
        label: '儿科'
      }, {
        value: '五官科',
        label: '五官科'
      }, {
        value: '肿瘤科',
        label: '肿瘤科'
      }, {
        value: '皮肤性病科',
        label: '皮肤性病科'
      }, {
        value: '中医科',
        label: '中医科'
      }, {
        value: '传染科',
        label: '传染科'
      }],
      form: {
        doctorName: '',
        office: '',
        patient: ''
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
    this.getDoctor()
  },
  methods: {
    getDoctor () {
      this.loading2 = true
      const query = Bmob.Query('doctorWork')
      query.get('').then(res => {
        console.log(res)
        this.tableData = res.results.reverse()
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
    addDoctor () {
      const query = Bmob.Query('doctorWork')
      query.get('').then(res => {
        this.getTableData = res.results.length
        for (let i = 0; i < this.getTableData; i++) {
          if (this.form.doctorName === res.results[i].doctorName) {
            this.$message({
              message: '该医生已添加！',
              type: 'warning'
            })
            this.ifExist = 1
            this.form.doctorName = ''
            this.form.office = ''
            break
          }
        }
        // console.log(this.ifExist)
        if (this.ifExist === 0) {
          query.set('doctorName', this.form.doctorName)
          query.set('office', this.form.office)
          query.save().then(res => {
            console.log(res)
            this.dialogVisible = false
            this.form.doctorName = ''
            this.form.office = ''
            this.getDoctor()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    delDoctor (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          const del = Bmob.Query('doctorWork')
          del.destroy(scope.row.objectId).then(res => {
            console.log(res)
            this.getDoctor()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(_ => {})
    },
    search () {
      const searchDoctor = Bmob.Query('doctorWork')
      searchDoctor.containedIn('doctorName', [this.searchInput])
      searchDoctor.find().then(res => {
        this.tableData = res
        this.totalPage = res.length
        // console.log(res[0])
      })
    }
  }
}
</script>
<style scoped>
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
