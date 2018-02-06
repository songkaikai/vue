<template>
	<div class="return-express-page">
    <div class="express-page">
      <div class="expree-header">
        <p class="order">订单号：<span>{{ dataOption.order_no }}</span></p>
      </div>
      <div class="input-wrapper">
        <div class="list-item">
          <select class="shipper_code" v-model="dataOption.code">
            <option value="0">请选择 ---- 快递公司</option>
            <option :value="item.code" v-for="(item, index) in expressCode">{{ item.company }}</option>
          </select>
          <!-- <input type="text" class="shipper_code" placeholder="快递公司" /> -->
        </div>
        <div class="list-item">
          <input type="text" v-model="dataOption.waybill_id" @input="filter('waybill_id')" placeholder="快递单号" />
        </div>
        <!-- <div class="list-item">
          <input type="text" @input="filter('mobile')" placeholder="退货留言..." />
        </div> -->
      </div>
      <!--  -->
      <div class="submit-btn" @click="_submit">提交</div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading> 
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  // import $ from 'jquery';

  export default {
    data () {
      return {
        pageStr: '',
        tipsStr: '',
        timer: null, // 定时器
        dataOption: {
          token: '',
          order_no: '', // 订单编号
          code: 0, // 快递编码
          waybill_id: '' // 快递单号
        }
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        expressCode: state => state.expressCode
      })
    },
    created () {
      this.dataOption.token = this.memberLogin.token;
      this.dataOption.order_no = this.$route.query.orderNo;
      this.$nextTick(() => {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getExpressCode').then(res => {
          this.$refs.loading.hideLoad();
          // console.log(res.data);
          if (res.code !== 1) {
            this._showTip(res.msg);
          }
        });
      });
    },
    methods: {
      // 提交订单
      _submit () {
        if (parseInt(this.dataOption.code) === 0) {
          this._showTip('请选择快递公司');
          return false;
        }
        if (!this.dataOption.waybill_id) {
          this._showTip('请填写快递单号');
          return false;
        }
        this.$refs.loading.showLoad();
        this.$store.dispatch('postExpress', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          // console.log(res.data);
          if (res.code === 1) {
            this._showTip('提交成功');
            this.timer = setTimeout(() => {
              // 返回上一页
              this.$router.go(-1);
              this.timer = null; // 清空定时器
            }, 1500);
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 过滤空格
      filter (str) {
        // console.log(this.dataOption[str]);
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
      },
      /**
       * [_showTip description] 显示提示框
       * @param  {[type]} str [传到提示框的字段]
       * @return {[type]}     [description]
       */
       _showTip (str) {
         this.tipsStr = str;
         this.$refs.tips.showTips();
       }
    },
    components: {
      loading,
      tips
    }
  };
</script>

<style lang="stylus">
  .return-express-page{position: absolute;top:0;right:0;bottom:0;left:0;background:#fff;}
  .expree-header{padding: 2rem 2rem 1rem 2rem;background: #fff;}
  .expree-header p{font-size: 0.9rem;color:#000;padding:0.25rem 0;}
  .express-page .input-wrapper{overflow: hidden;padding: 0.6rem 2rem 1.4rem 2rem;background: #fff;}
  .express-page .input-wrapper .list-item{margin: 0.4rem 0;position: relative;border:1px solid #eee;border-radius:3px;}
  .express-page .input-wrapper .list-item input{display: block;width:94%;font-size: 0.9rem;padding: 0.45rem 3%;}
  .express-page .input-wrapper .list-item select{display: block;width:100%;font-size: 0.9rem;padding: 0.45rem 3%;}
  .express-page .input-wrapper .list-item .validate{position: absolute;top: 0.1rem;right:0;font-size: 0.9rem;color:#1180e9;padding: 0.36rem 0;width: 7.4rem;text-align: center;}
  .submit-btn{font-size: 0.9rem;color:#fff;padding: 0.7rem 0;width: 80%;text-align: center;background: #1180e9;border-radius: 4px;margin:auto;margin-top: 3rem;}

</style>
