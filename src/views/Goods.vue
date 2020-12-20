<template>
  <div class="article-box">
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header">
<!--      <el-table-column type="selection" width="55" align="center"></el-table-column>-->
      <el-table-column type="index" :index="getIndex" label="序号" width="55" align="center"></el-table-column>
      <el-table-column prop="goodsTitle" label="商品名" align="center"></el-table-column>
      <el-table-column prop="price" label="单价(元)" align="center"></el-table-column>
      <el-table-column prop="remainNum" label="剩余数量" align="center"></el-table-column>
      <el-table-column prop="createdTime" label="时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-goods" @click="handleBuy(scope.row)">购买</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="query.currentPage"
      :page-size="query.pageSize"
      :total="pageTotal"
      @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="确认购买" :visible.sync="confirmBuyVisible" top="10vh" :show-close="false" :close-on-click-modal="false">
      <el-form :model="good" ref="goodForm"  :inline="true">
        <el-row>
          <el-form-item label="商品名称：">
            <el-input v-model.trim="good.goodsTitle" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品单价：">
            <el-input v-model.trim="good.price" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="购买数量：">
            <el-input v-model.trim="good.num"  placeholder="请输入购买数量" @input="changeTotalMoney"></el-input>
          </el-form-item>
          <el-form-item label="合计价格：" v-show="showTotalMoney">
            <el-input v-model.trim="good.totalMoney"  disabled></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="buy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: {
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      pageTotal: 0,
      loading: false,
      confirmBuyVisible: false,
      good: {},
      showTotalMoney: false
    }
  },
  components: {
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      this.loading = true
      this.postHttp('/goods/list', {'currentPage': this.query.currentPage, 'pageSize': this.query.pageSize}).then((res) => {
        console.log(res)
        if (res.reCode === '0') {
          this.tableData = res.result.goodsList
          this.pageTotal = res.result.pageCount
        } else {
          this.$message.error(res.reInfo)
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleCurrentChange (value) {
      this.query.currentPage = value
      this.getGoodsList()
    },
    getIndex (index) {
      return (this.query.currentPage - 1) * this.query.pageSize + index + 1
    },
    handleBuy (row) {
      console.log(row)
      console.log('handleBuy')
      this.confirmBuyVisible = true
      this.postHttp('/goods/detail', {'goodsId': row.goodsId}).then((res) => {
        console.log(res)
        if (res.reCode === '0') {
          this.good = res.result
        } else {
          this.$message.error(res.reInfo)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    buy () {
      if (!this.good.num) {
        this.$message.warning('请输入购买数量')
        return
      }
      console.log('buy')
      this.postHttp('/goods/buy', this.good).then((res) => {
        console.log(res)
        if (res.reCode === '0') {
          this.$message.success('购买成功')
          // 刷新商品列表和用户余额
          this.query.currentPage = 1
          this.getGoodsList()
          this.$root.$emit('refreshBalance', res.result.balance)
        } else {
          this.$message.error(res.reInfo)
        }
        this.cancel()
      }).catch(err => {
        console.log(err)
        this.cancel()
      })
    },
    cancel () {
      this.confirmBuyVisible = false
      this.good = {}
    },
    changeTotalMoney () {
      console.log('changeTotalMoney')
      this.good.num = this.checkNumber(this.good.num)
      this.good.totalMoney = this.good.num * this.good.price
      if (this.good.totalMoney > 0) {
        this.showTotalMoney = true
      }
    },
    checkNumber (value) {
      // 去掉数字和.以外的内容
      value = value.replace(/[^\d.]/g, '')
      // 不允许.开头
      value = value.replace(/^\./g, '')
      // 不允许0开头
      value = value.replace(/^[0]/g, '')
      // 去掉连续的.
      value = value.replace(/\.{2,}/g, '.')
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
  .article-box {
    width: 100%;
    .el-pagination {
      margin-top: 20px;
    }
    .quill-editor {
      height: 300px;
      margin-bottom: 20px;
    }
  }
</style>
