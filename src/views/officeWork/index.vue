<template>
  <div v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="underHeader">
      <span style="margin:0 auto">
        <el-input v-model="searchInput"
        placeholder="请输入要搜索的科室"
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
      prop="office"
      label="科室">
      <template slot-scope="scope">{{scope.row.office}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="personNum"
      label="科室接诊人数">
      <template slot-scope="scope">{{scope.row.personNum}}</template>
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
      doctorInSameOffice: ['儿科'],
      neike: [],
      waike: [],
      fuchanke: [],
      nanke: [],
      erke: [],
      wuguanke: [],
      zhongliuke: [],
      pifuxingbingke: [],
      zhongyike: [],
      chuanranke: [],
      jingshenke: [],
      form: {
        doctorName: '',
        office: ''
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
    this.getDoctorsName()
  },
  methods: {
    getDoctor () {
      this.loading2 = true
      const query = Bmob.Query('doctorWork')
      query.get('').then(res => {
        console.log(res)
        for (let i = 0; i < res.results.length; i++) {
          if (res.results[i].office === '内科') {
            this.neike.push(res.results[i].doctorName)
            // console.log('sameOffice', this.doctorInSameOffice)
          } else if (res.results[i].office === '外科') {
            this.waike.push(res.results[i].doctorName)
          } else if (res.results[i].office === '妇产科') {
            this.fuchanke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '男科') {
            this.nanke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '儿科') {
            this.erke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '五官科') {
            this.wuguanke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '肿瘤科') {
            this.zhongliuke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '皮肤性病科') {
            this.pifuxingbingke.push(res.results[i].doctorName)
          } else if (res.results[i].office === '中医科') {
            this.zhongyike.push(res.results[i].doctorName)
          } else if (res.results[i].office === '传染科') {
            this.chuanranke.push(res.results[i].doctorName)
          } else {
            this.jingshenke.push(res.results[i].doctorName)
          }
        }
        // this.tableData = res.results.reverse()
        // this.totalPage = res.results.length
        // this.filterData = res.results
        // this.allPage = res.results.length
        // setTimeout(() => {
        //   this.loading2 = false
        // }, 1000)
      }).catch(err => {
        console.log(err)
      })
      const getOfficeDoctors = Bmob.Query('officeName')
      // 内科
      getOfficeDoctors.get('AC6tEEEQ').then(res => {
        console.log(res)
        res.set('doctors', this.neike)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 外科
      getOfficeDoctors.get('da2P777s').then(res => {
        console.log(res)
        res.set('doctors', this.waike)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 妇产科
      getOfficeDoctors.get('0E853334').then(res => {
        console.log(res)
        res.set('doctors', this.fuchanke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 男科
      getOfficeDoctors.get('NnaD222y').then(res => {
        console.log(res)
        res.set('doctors', this.nanke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 儿科
      getOfficeDoctors.get('6d9pYYYb').then(res => {
        console.log(res)
        res.set('doctors', this.erke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 五官科
      getOfficeDoctors.get('atEB5557').then(res => {
        console.log(res)
        res.set('doctors', this.wuguanke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 肿瘤科
      getOfficeDoctors.get('NtAL333t').then(res => {
        console.log(res)
        res.set('doctors', this.zhongliuke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 皮肤性病科
      getOfficeDoctors.get('EoJT666L').then(res => {
        console.log(res)
        res.set('doctors', this.pifuxingbingke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 中医科
      getOfficeDoctors.get('pyNc4445').then(res => {
        console.log(res)
        res.set('doctors', this.zhongyike)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 传染科
      getOfficeDoctors.get('03Wvdddi').then(res => {
        console.log(res)
        res.set('doctors', this.chuanranke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
      // 精神科
      getOfficeDoctors.get('I40cMMMb').then(res => {
        console.log(res)
        res.set('doctors', this.jingshenke)
        res.save()
        this.getDoctorsName()
      }).catch(err => {
        console.log(err)
      })
    },
    // 将医生姓名显示
    getDoctorsName () {
      this.loading2 = true
      const query = Bmob.Query('officeName')
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
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    search () {
      const searchDoctor = Bmob.Query('officeName')
      searchDoctor.containedIn('office', [this.searchInput])
      searchDoctor.find().then(res => {
        this.tableData = res
        this.totalPage = res.length
        // console.log(res[0])
      })
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
