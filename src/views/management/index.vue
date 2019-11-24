<template>
  <div v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="underHeader">
      <el-button @click="dialogVisible = true">录 入</el-button>
      <!--录入药品-->
      <el-dialog
      title="录入药品"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form>
      <el-form-item label="药品名称：">
      <el-input placeholder="请输入药品名称" size="medium" v-model="form.medicine"></el-input>
      </el-form-item>
      <el-form-item label="药品单价：">
      <el-input placeholder="请输入药品单价" size="medium" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="药品剂量数：">
      <el-input placeholder="请输入药品剂量数" size="medium" v-model="form.number"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addMedicine">录 入</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
      </el-dialog>
      <!--修改药品-->
      <el-dialog
      title="修改药品"
      :visible.sync="changeDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form>
      <el-form-item label="药品名称：">
      <el-input placeholder="请输入药品名称" size="medium" v-model="changeMedicine"></el-input>
      </el-form-item>
      <el-form-item label="药品单价：">
      <el-input placeholder="请输入药品单价" size="medium" v-model="price"></el-input>
      </el-form-item>
      <el-form-item label="药品剂量数：">
      <el-input placeholder="请输入药品剂量数" size="medium" v-model="changeNum"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="correctMedicine">修 改</el-button>
      <el-button @click="changeDialogVisible = false">取 消</el-button>
      </span>
      </el-dialog>
      <span>
        <el-input v-model="searchInput"
        placeholder="请输入要搜索的药品名"
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
      prop="medName"
      label="药品名称">
      <template slot-scope="scope">{{scope.row.medName}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="price"
      label="单价">
      <template slot-scope="scope">{{scope.row.price}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="medNum"
      label="库存">
      <template slot-scope="scope">{{scope.row.medNum}}</template>
      </el-table-column>
      <el-table-column
      align="center"
      label="操作">
      <template slot-scope="scope">
      <span class="btnBox">
        <el-button size="small" @click="alertMedicine(scope)">修改</el-button>
        <el-button size="small" @click="delMedicine(scope)">删除</el-button>
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
      price: '',
      changeDialogVisible: false,
      changeMedicine: '',
      changeNum: '',
      changeId: '',
      form: {
        medicine: '',
        id: ''
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
    this.getMedicine()
  },
  methods: {
    getMedicine () {
      this.loading2 = true
      const query = Bmob.Query('medicine')
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
    addMedicine () {
      const query = Bmob.Query('medicine')
      query.get('').then(res => {
        this.getTableData = res.results.length
        for (let i = 0; i < this.getTableData; i++) {
          if (this.form.medicine === res.results[i].medName) {
            this.$message({
              message: '该药品已添加！',
              type: 'warning'
            })
            this.ifExist = 1
            this.form.medicine = ''
            this.form.number = ''
            this.form.price = ''
            break
          }
        }
        // console.log(this.ifExist)
        if (this.ifExist === 0) {
          query.set('medName', this.form.medicine)
          query.set('price', this.form.price)
          query.set('medNum', parseInt(this.form.number))
          query.save().then(res => {
            console.log(res)
            this.dialogVisible = false
            this.form.medicine = ''
            this.form.number = ''
            this.form.price = ''
            this.getMedicine()
          }).catch(err => {
            console.log(err)
          })
        }
      })
      // console.log(this.getTableData)
      // query.set('medName', this.form.medicine)
      // query.set('medNum', parseInt(this.form.number))
      // query.save().then(res => {
      //   console.log(res)
      //   this.dialogVisible = false
      //   this.getMedicine()
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    delMedicine (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          const del = Bmob.Query('medicine')
          del.destroy(scope.row.objectId).then(res => {
            console.log(res)
            this.getMedicine()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(_ => {})
    },
    alertMedicine (scope) {
      this.changeDialogVisible = true
      const getMed = Bmob.Query('medicine')
      getMed.get(scope.row.objectId).then(res => {
        this.changeId = res.objectId
        this.changeMedicine = res.medName
        this.changeNum = res.medNum
        this.price = res.price
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    correctMedicine () {
      const correctMed = Bmob.Query('medicine')
      correctMed.set('id', this.changeId)
      correctMed.set('medName', this.changeMedicine)
      correctMed.set('medNum', parseInt(this.changeNum))
      correctMed.set('price', this.price)
      correctMed.save().then(res => {
        console.log(res)
        this.changeDialogVisible = false
        this.getMedicine()
      }).catch(err => {
        console.log(err)
      })
    },
    search () {
      const searchMedicine = Bmob.Query('medicine')
      searchMedicine.containedIn('medName', [this.searchInput])
      searchMedicine.find().then(res => {
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
