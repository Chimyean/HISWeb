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
      </el-form>
      <div class="twoBtn">
      <el-button @click="save" v-if="doseBtn">确定发药</el-button>
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
      doseBtn: true,
      theId: [],
      afterNumber: [],
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
  },
  methods: {
    back () {
      this.$router.push({path: 'dose'})
    },
    getPatient () {
      this.loading2 = true
      const query = Bmob.Query('patient')
      query.get(this.$route.query.patientId).then(res => {
        if (res.ifDose === '1') {
          this.doseBtn = false
        }
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
    // 在medicine表中删除发的药品数
    save () {
      const save = Bmob.Query('patient')
      save.get(this.$route.query.patientId).then(res => {
        res.set('ifDose', '1')
        res.save()
        console.log(res)
        for (let i in res.prescription) {
          console.log('删除名字', res.prescription[i]['name'])
          this.delMedicine.push(res.prescription[i]['name'])
          this.delMedicine.push(res.prescription[i]['number'])
        }
        console.log('this.delMedicine', this.delMedicine)
        const allMedicine = Bmob.Query('medicine')
        allMedicine.get('').then(res => {
          console.log('all medicine', res)
          for (let j = 0; j < this.delMedicine.length; j++) {
            for (let k = 0; k < res.results.length; k++) {
              if (this.delMedicine[j] === res.results[k]['medName']) {
                console.log('equal?', this.delMedicine[j] + res.results[k]['medName'])
                res.results[k]['medNum'] = res.results[k]['medNum'] - this.delMedicine[j + 1]
                // this.afterNumber = res.results[k]['medNum']
                this.afterNumber.push(res.results[k]['medNum'])
                console.log('number', res.results[k]['medNum'])
                this.theId.push(res.results[k]['objectId'])
                console.log('id', this.theId)
                console.log('the result', this.delMedicine[j] + res.results[k]['medNum'])
                console.log('which?', this.theId[j / 2])
                console.log('medicine number', this.afterNumber)
                const after = Bmob.Query('medicine')
                after.get(this.theId[j / 2]).then(res => {
                  console.log('the objectId medicine', res)
                  res.set('medNum', this.afterNumber[j / 2])
                  console.log('after number and medicine', this.theId)
                  res.save()
                  this.theId = []
                }).catch(err => {
                  console.log(err)
                })
              }
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
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
.twoBtn{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
