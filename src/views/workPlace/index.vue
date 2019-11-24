<template>
  <div  v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="patientInfo">
      <el-form ref="form" :model="form" label-width="80px" inline>
      <el-form-item label="姓名">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.sex"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item label="病历号">
        <el-input v-model="form.objectId" disabled></el-input>
      </el-form-item>
      <el-form-item label="挂号时间">
        <el-input v-model="form.Date" disabled></el-input>
      </el-form-item>
      <el-form-item label="接诊科室">
        <el-input v-model="form.office" disabled></el-input>
      </el-form-item>
      <el-form-item label="接诊医生">
        <el-input v-model="form.doctor" disabled></el-input>
      </el-form-item>
      <el-form-item label="过敏病史">
        <el-input v-model="form.allergy"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      </el-form>
    </div>
    <el-form>
      <el-form-item label="病案书写">
        <el-input type="textarea" v-model="form.sickness"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
     <el-form-item label="发药单" style="color: #7c7c7c">
      <div class="textMed" v-if="dosePlace">
      {{form.prescription.toString()}}
      </div>
     </el-form-item>
    </el-form>
    <elx-editable ref="editable" :data.sync="tableData.data" class="inputBlock">
      <!-- <elx-editable-column type="selection" width="55"></elx-editable-column> -->
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="name" label="药品名称" :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="number" label="剂量数" :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="unit" label="给药单位" :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="time" label="开始时间" :edit-render="{name: 'ElDatePicker', attrs: {type: 'date', format: 'yyyy-MM-dd'}}"></elx-editable-column>
      <elx-editable-column prop="days" label="用药天数" :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="remark" label="医嘱备注" :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="save(scope)">保存</el-button>
        </template>
      </elx-editable-column>
    </elx-editable>
    <div class="allBtn">
    <el-button @click="addLine">添加一行</el-button>
    <el-button @click="delLine">删除一行</el-button>
    <el-button @click="upload">提交处方</el-button>
    <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
import Bmob from 'hydrogen-js-sdk'
import Vue from 'vue'
import 'vue-element-extends/lib/index.css'
import { Editable, EditableColumn } from 'vue-element-extends'

Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn', EditableColumn)
export default{
  data () {
    return {
      loading2: false,
      dosePlace: true,
      allData: [], // 全部数据
      tableData: {
        line: null,
        data: [{
          name: '',
          number: '',
          unit: '',
          time: '',
          days: '',
          remark: ''
        }]
      },
      form: {
        name: '',
        sex: '',
        age: '',
        objectId: '',
        Date: '',
        office: '',
        doctor: '',
        allergy: '',
        phone: '',
        sickness: '',
        prescription: []
      }
    }
  },
  mounted () {
    // this.getId()
    this.getPatient()
  },
  methods: {
    back () {
      this.$router.push({path: 'queue'})
    },
    getPatient () {
      this.loading2 = true
      const query = Bmob.Query('patient')
      query.get(this.$route.query.patientId).then(res => {
        console.log(res)
        this.form.name = res.name
        this.form.Date = res.createdAt
        this.form.doctor = res.doctor
        this.form.objectId = res.objectId
        this.form.office = res.office
        this.form.sex = res.sex
        this.form.age = res.age
        this.form.allergy = res.allergy
        this.form.phone = res.phone
        this.form.sickness = res.sickness
        // this.form.prescription = res.prescription
        for (let i in res.prescription) {
          this.form.prescription.push('药品名称：' + res.prescription[i].name + '，剂量数：' + res.prescription[i].number + '，给药单位：' + res.prescription[i].unit + '，开始时间：' + res.prescription[i].time + '，用药天数：' + res.prescription[i].days + '，医嘱备注：' + res.prescription[i].remark)
        }
        if (!this.form.prescription) {
          this.dosePlace = false
        }
        setTimeout(() => {
          this.loading2 = false
        }, 1000)
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加一行药品
    addLine () {
      let i = { 'name': '', 'number': '', 'unit': '', 'time': '', 'days': '', 'remark': '' }
      this.tableData.data.push(i)
      this.tableData.line = JSON.parse(JSON.stringify(i))
      console.log('json', this.tableData.line)
      console.log('all', this.tableData.data)
    },
    // 提交数据
    save (scope) {
      console.log('save', scope)
      console.log('index', scope.$index)
      this.allData = JSON.parse(JSON.stringify(this.tableData.data))
      console.log('allData', this.allData)
    },
    // 删除一行药品
    delLine () {
      this.tableData.data.pop()
    },
    // 提交处方
    upload () {
      if (!this.form.sex || !this.form.age || !this.form.allergy || !this.form.phone || !this.form.sickness) {
        this.$message({
          showClose: true,
          message: '请完善病人病案！',
          type: 'warning'
        })
      } else {
        const query = Bmob.Query('patient')
        query.get(this.$route.query.patientId).then(res => {
          console.log(res)
          this.form.state = '1'
          console.log('上传处方', this.allData)
          res.set('sex', this.form.sex)
          res.set('age', this.form.age)
          res.set('allergy', this.form.allergy)
          res.set('phone', this.form.phone)
          res.set('sickness', this.form.sickness)
          res.set('state', this.form.state)
          console.log(this.allData)
          if (this.allData.length !== 0) {
            res.set('prescription', this.allData)
          }
          res.save()
          this.$router.push({path: 'queue'})
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
<style scoped>
body{
  background-color: white;
  /* background: url('../../assets/background-white.jpg'); */
  background-size: 100%;
  background-repeat:no-repeat;
}
.el-main{
  padding: 0;
}
.patientInfo{
  background-color: rgb(228, 228, 228);
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.el-input__inner{
  width: 100%;
  height: 28px;
}
.el-input{
  width: 200px;
  margin-left: 0px;
}
form{
  /* display: flex;
  justify-content: center; */
  margin-top: 10px;
  padding-left: 100px;
}
.el-textarea__inner{
  width: 90%;
}
.textMed{
  width: 900px;
  height: 100px;
  /* padding: 30px; */
  border: rgb(228, 231, 237) 1.2px solid;
  border-radius: 5px;
  background-color: rgb(245, 247, 250);
  color: rgb(194, 190, 193);
  padding-left: 10px;
}
.allBtn{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.cell > .el-input > .el-input__inner{
  width: 30px;
}
</style>
