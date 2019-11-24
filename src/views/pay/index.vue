<template>
<div v-loading="loading2" element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(255, 255, 255, 0.8)">
  <div class="patientInfo">
      <el-form ref="form" :model="form" label-width="80px" inline>
      <el-form-item label="姓名">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="病历号">
        <el-input v-model="form.objectId" disabled></el-input>
      </el-form-item>
      <br />
      <el-form-item label="发药单" style="color: #7c7c7c">
      <div class="textMedicine">
      {{form.dose}}
      </div>
      </el-form-item>
      <el-form-item label="总价格" style="color: #7c7c7c">
      {{sum}}元
      </el-form-item>
      </el-form>
      <!-- <el-button @click='sure'>确认缴费</el-button> -->
      <div class="backBtn">
      <el-button @click="back">返回</el-button>
      </div>
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
      sum: 0,
      theId: [],
      cost: [],
      medNumber: [],
      delMedicine: [], // 储存遍历数组
      loading2: false,
      form: {
        name: '',
        objectId: '',
        dose: []
      }
    }
  },
  mounted () {
    this.getPatient()
    this.sumUp()
  },
  methods: {
    getPatient () {
      this.loading2 = true
      const query = Bmob.Query('patient')
      query.get(this.$route.query.patientId).then(res => {
        console.log(res)
        this.form.name = res.name
        this.form.objectId = res.objectId
        // this.form.dose = JSON.stringify(res.prescription)
        for (let i in res.prescription) {
          console.log('测试', res.prescription[i]['name'] + res.prescription[i]['number'] + res.prescription[i]['unit'])
          this.form.dose.push(res.prescription[i]['name'] + res.prescription[i]['number'] + res.prescription[i]['unit'])
        }
        this.form.dose = this.form.dose.toString()
        setTimeout(() => {
          this.loading2 = false
        }, 1000)
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取药品总价格
    sumUp () {
      const save = Bmob.Query('patient')
      save.get(this.$route.query.patientId).then(res => {
        console.log(res)
        for (let i in res.prescription) {
          //   console.log('删除名字', res.prescription[i]['name'])
          this.delMedicine.push(res.prescription[i]['name'])
          this.delMedicine.push(res.prescription[i]['number'])
          this.medNumber.push(res.prescription[i]['number'])
        }
        console.log('this.delMedicine', this.delMedicine)
        const allMedicine = Bmob.Query('medicine')
        allMedicine.get('').then(res => {
          console.log('all medicine', res)
          for (let j = 0; j < this.delMedicine.length; j++) {
            for (let k = 0; k < res.results.length; k++) {
              if (this.delMedicine[j] === res.results[k]['medName']) {
                console.log('equal?', this.delMedicine[j] + res.results[k]['medName'])
                this.cost.push(res.results[k]['price'])
                console.log('all price', this.cost)
                console.log('all medicine the patient get', this.delMedicine)
                console.log('all medicine number array', this.medNumber)
              }
            }
          }
          for (let x = 0; x < this.medNumber.length; x++) {
            this.sum = parseInt(this.sum) + parseInt(this.cost[x]) * parseInt(this.medNumber[x])
            console.log('sum', this.sum)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 返回
    back () {
      this.$router.push({path: 'registerPay'})
    }
  }
}
</script>
<style>
.textMedicine{
  width: 900px;
  height: 100px;
  /* padding: 30px; */
  border: rgb(228, 231, 237) 1.2px solid;
  border-radius: 5px;
  background-color: rgb(245, 247, 250);
  color: rgb(194, 190, 193);
  padding-left: 10px;
}
.backBtn{
  display: flex;
  justify-content: center;
  padding-top: 30px;
}
</style>
