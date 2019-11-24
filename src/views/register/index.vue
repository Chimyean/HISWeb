<template>
  <div v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="underHeader">
      <el-button @click="dialogVisible = true">新增病人</el-button>
      <!--录入病人信息-->
      <el-dialog
      title="新增病人信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form>
      <el-form-item label="病人姓名：">
      <el-input placeholder="请输入病人姓名" size="medium" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="疾病类型：">
      <el-input placeholder="请输入疾病类型" size="medium" v-model="form.diseaseType"></el-input>
      </el-form-item>
      <!-- <el-form-item label="就诊科室：">
      <el-input placeholder="请输入就诊科室" size="medium" v-model="form.office"></el-input>
      </el-form-item> -->
      <el-form-item label="就诊科室：">
      <el-select v-model="getDoctorName" placeholder="请选择">
      <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="就诊医师：">
      <!-- <el-input placeholder="请输入就诊医师" size="medium" v-model="form.doctor"></el-input> -->
      <el-select v-model="form.doctor" clearable placeholder="请选择">
      <el-option
      v-for="item in doctorInOffice"
      :label="item"
      :key="item"
      :value="item">
      </el-option>
      </el-select>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addPatient">录 入</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
      </el-dialog>
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
      <el-table-column
      align="center"
      prop="diseaseType"
      label="疾病类型">
      <template slot-scope="scope">{{scope.row.diseaseType}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="病历号">
      <template slot-scope="scope">{{scope.row.objectId}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="就诊科室">
      <template slot-scope="scope">{{scope.row.office}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="就诊医师">
      <template slot-scope="scope">{{scope.row.doctor}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="挂号时间">
      <template slot-scope="scope">{{scope.row.createdAt}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="就诊状态"
      width="200">
      <!-- <template slot-scope="scope">{{scope.row.state}}</template> -->
      <template v-show="scope.row.state" slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-text="已接诊"
            inactive-text="未接诊"
            inactive-value="-1"
            active-value="1"
            disabled/>
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
      doctorInOffice: [],
      getDoctorName: '',
      nowPatientNum: 0,
      saveId: '',
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
    },
    getDoctorName () {
      const getPersonNum = Bmob.Query('officeName')
      // getPersonNum.get('AC6tEEEQ').then(res => {
      //   console.log('www', res.personNum)
      //   this.neikePerson = res.personNum
      // }).catch(err => {
      //   console.log(err)
      // })
      if (this.getDoctorName === '内科') {
        getPersonNum.get('AC6tEEEQ').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '外科') {
        getPersonNum.get('da2P777s').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '妇产科') {
        getPersonNum.get('0E853334').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '男科') {
        getPersonNum.get('NnaD222y').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '儿科') {
        getPersonNum.get('6d9pYYYb').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '五官科') {
        getPersonNum.get('atEB5557').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '肿瘤科') {
        getPersonNum.get('NtAL333t').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '皮肤性病科') {
        getPersonNum.get('EoJT666L').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '中医科') {
        getPersonNum.get('pyNc4445').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '传染科') {
        getPersonNum.get('03Wvdddi').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '精神科') {
        getPersonNum.get('I40cMMMb').then(res => {
          this.doctorInOffice = res.doctors
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  mounted () {
    this.getPatient()
  },
  methods: {
    getPatient () {
      this.loading2 = true
      const query = Bmob.Query('patient')
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
    getPersonNum () {
      const getPersonNum = Bmob.Query('officeName')
      // getPersonNum.get('AC6tEEEQ').then(res => {
      //   console.log('www', res.personNum)
      //   this.neikePerson = res.personNum
      // }).catch(err => {
      //   console.log(err)
      // })
      if (this.getDoctorName === '内科') {
        getPersonNum.get('AC6tEEEQ').then(res => {
          console.log('www', res.personNum)
          this.neikePerson = res.personNum
          res.set('personNum', parseInt(++this.neikePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '外科') {
        getPersonNum.get('da2P777s').then(res => {
          this.waikePerson = res.personNum
          res.set('personNum', parseInt(++this.waikePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '妇产科') {
        getPersonNum.get('0E853334').then(res => {
          this.fuchankePerson = res.personNum
          res.set('personNum', parseInt(++this.fuchankePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '男科') {
        getPersonNum.get('NnaD222y').then(res => {
          this.nankePerson = res.personNum
          res.set('personNum', parseInt(++this.nankePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '儿科') {
        getPersonNum.get('6d9pYYYb').then(res => {
          this.erkePerson = res.personNum
          res.set('personNum', parseInt(++this.erkePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '五官科') {
        getPersonNum.get('atEB5557').then(res => {
          this.wuguankePerson = res.personNum
          res.set('personNum', parseInt(++this.wuguankePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '肿瘤科') {
        getPersonNum.get('NtAL333t').then(res => {
          this.zhongliukePerson = res.personNum
          res.set('personNum', parseInt(++this.zhongliukePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '皮肤性病科') {
        getPersonNum.get('EoJT666L').then(res => {
          this.pifuxingbingkePerson = res.personNum
          res.set('personNum', parseInt(++this.pifuxingbingkePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '中医科') {
        getPersonNum.get('pyNc4445').then(res => {
          this.zhongyikePerson = res.personNum
          res.set('personNum', parseInt(++this.zhongyikePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '传染科') {
        getPersonNum.get('03Wvdddi').then(res => {
          this.chuanrankePerson = res.personNum
          res.set('personNum', parseInt(++this.chuanrankePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.getDoctorName === '精神科') {
        getPersonNum.get('I40cMMMb').then(res => {
          this.jingshenkePerson = res.personNum
          res.set('personNum', parseInt(++this.jingshenkePerson))
          res.save()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    change () {
      const changePatientNum = Bmob.Query('doctorWork')
      changePatientNum.get('').then(res => {
        // console.log(res)
        for (let i = 0; i < res.results.length; i++) {
          // console.log('!!', res.results[i]['doctorName'])
          // console.log('!!!', this.form.doctor)
          if (this.form.doctor === res.results[i]['doctorName']) {
            this.saveId = res.results[i]['objectId']
            const add = Bmob.Query('doctorWork')
            add.get(this.saveId).then(res => {
              console.log('which', res)
              this.nowPatientNum = ++res.patientNum
              res.set('patientNum', this.nowPatientNum.toString())
              res.save()
              this.form.doctor = ''
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addPatient () {
      if (!this.form.name || !this.form.diseaseType || !this.getDoctorName || !this.form.doctor) {
        this.$message({
          showClose: true,
          message: '请完善病人信息！',
          type: 'warning'
        })
      } else {
        this.getPersonNum()
        const query = Bmob.Query('patient')
        query.get('').then(res => {
          this.getTableData = res.results.length
          query.set('name', this.form.name)
          query.set('diseaseType', this.form.diseaseType)
          query.set('office', this.getDoctorName)
          query.set('doctor', this.form.doctor)
          query.save().then(res => {
            this.change()
            console.log(res)
            this.dialogVisible = false
            this.form.name = ''
            this.form.diseaseType = ''
            this.getDoctorName = ''
            // this.form.doctor = ''
            this.getPatient()
          }).catch(err => {
            console.log(err)
          })
        })
      }
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
  justify-content: space-between;
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
