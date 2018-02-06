<template>
  <div class="withdrawbank-page" ref="withdraw" v-scroll="_addList">
    <div class="withdraw-choose border-bottom-1px">
      <span v-for="(item, index) in typeArr" :class="[chooseType === index ? 'index' : '']" @click="_chooseType(index)">{{ item }}</span>
    </div>
    <!-- 申请提现 -->
    <div class="withdraw-wrapper wrapper-absolute" v-if="chooseType === 0">
      <!-- 提现方式 -->
      <div class="choose-sublist">
        <span :class="index === subChooseList ? 'index' : ''" v-for="(item, index) in sublist" @click="_chooseSubList(index)">{{ item }}</span>
      </div>
      <div class="inner-edit">
        <div class="list-item">
          <span class="left">提现金额</span>
          <div class="ipt">
            <input type="tel" v-model="dataOption.drawMoney" @input="filter('drawMoney')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">真实姓名</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.trueName" @input="filter('trueName')" />
          </div>
        </div>
        <div class="list-item" v-if="subChooseList === 0">
          <span class="left">支付宝账号</span>
          <div class="ipt">
            <input type="tel" v-model="dataOption.alipayNo" @input="filter('alipayNo')" />
          </div>
        </div>
        <div class="list-item" v-if="subChooseList === 1">
          <span class="left">开户银行</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.bankName" @input="filter('bankName')" />
          </div>
        </div>
        <div class="list-item" v-if="subChooseList === 1">
          <span class="left">银行卡号</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.cardNo" @input="filter('cardNo')" />
          </div>
        </div>
        <!-- <div class="list-item">
          <span class="left">身份证号</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.idNumber" @input="filter('idNumber')" />
          </div>
        </div> -->
        <div class="submit-btn" @click="_submit">确定</div>
      </div>
      <p class="all-money">当前账号可提现Q蛋：{{ parseInt(memberInfo.point_balance).toFixed(2) }}</p>
      <p class="all-money" style="color:red">*提现金额50的倍数，20%的手续费</p>
    </div>
    <!-- 提现记录 -->
    <div class="withdraw-wrapper" v-if="chooseType === 1">
      <div class="inner-wrapper" v-if="showLists">
        <!-- 提现记录的列表 -->
        <div class="list-wrapper" style="padding: 0 0.8rem">
          <div class="list-item" :class="[withdrawCountList.length - 1 > index ? 'border-bottom-1px' : '']" v-for="(item, index) in withdrawCountList">
            <p class="title">
              <span class="time">{{ item.add_time }}</span>
              <span class="money">{{ item.draw_money }}</span>
            </p>
            <p class="title" style="margin-bottom:0;">
              <span class="time">{{ item.withdraw_type === 'alipay' ? '支付宝' : '银行卡' }}</span>
              <span class="money">{{ item.status_name }}</span>
            </p>
          </div>
        </div>
        <p class="loading-bottom" v-show="loadingShow"><i class="icon-spinner"></i><span>正在加载中...</span></p>
      </div>
      <div v-else style="margin-top: 2.5rem;padding:7rem 0;text-align:center;font-size:0.9rem">暂无记录</div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import $ from 'jquery';

  export default {
    data () {
      return {
         tipsStr: '',
         chooseType: 0,
         typeArr: ['提现', '记录'],
         subChooseList: 0,
         sublist: ['支付宝', '银行卡'],
         dataOption: {
            token: '', // 会员TOKEN
            drawMoney: '', // 提现金额
            withdrawType: '', // 提现方式alipay支付宝bank银行卡
            bankName: '', // 开户行
            cardNo: '', // 卡号
            trueName: '', // 真实姓名
            // idNumber: '', // 身份证号
            alipayNo: '' // 支付宝账号
         },
         mokeOption: {
            sxfMoney: '', // 所需手续费5%
            allMoney: '' // 总共扣除金额
         },
         listOption: {
            token: '', // 会员TOKEN
            pages: 1, // 当前页
            pageSize: 20 // 每页显示数量
         }, // 提现记录提交的参数
         winHei: 0, // window的高度
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         chooseAgain: false, // 是否再次获取
         showLists: false // 列表是否显示
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        // this._getMsg();
      });
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo,
      // 提现日志接口
      withdrawCountList: state => state.withdrawCountList
    }),
    methods: {
      _chooseType (type) {
        if (this.chooseType !== type) {
          this.chooseType = type;
          // 如果是1就是加载提现记录
          if (type === 1) {
            // 重置页数
            this.getAgain = true;
            this.chooseAgain = false;
            this.listOption.pages = 1;
            // console.log(1);
            this._getList();
          }
        }
      },
      // 选择支付方式
      _chooseSubList (index) {
        if (this.subChooseList !== index) {
          this.subChooseList = index;
        }
      },
      // 提交提现信息
      _submit () {
        if (this.dataOption.drawMoney === '') {
           this._showTip('提现金额不能为空');
           return;
        }
        if (this.dataOption.trueName === '') {
           this._showTip('真实姓名不能为空');
           return;
        }
        if (this.subChooseList === 0) {
          if (this.dataOption.alipayNo === '') {
            this._showTip('支付宝账号不能为空');
            return;
          }
          this.dataOption.withdrawType = 'alipay';
        } else if (this.subChooseList === 1) {
          if (this.dataOption.bankName === '') {
            this._showTip('开户银行不能为空');
            return;
          }
          if (this.dataOption.cardNo === '') {
            this._showTip('银卡卡号不能为空');
            return;
          }
          this.dataOption.withdrawType = 'bank';
        }
        // if (this.dataOption.idNumber === '') {
        //    this._showTip('身份证不能为空');
        //    return;
        // }
        // 验证通过进行提交
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('withdrawBank', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 200) {
            this._showTip('提现成功');
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            // 情况数据
            this.dataOption = {
              token: '', // 会员TOKEN
              drawMoney: '', // 提现金额
              withdrawType: '', // 提现方式alipay支付宝bank银行卡
              bankName: '', // 开户行
              cardNo: '', // 卡号
              trueName: '', // 真实姓名
              // idNumber: '', // 身份证号
              alipayNo: '' // 支付宝账号
            };
            this.mokeOption.sxfMoney = '';
            this.mokeOption.allMoney = '';
          } else if (res.code === 401) {
              this._showTip('请重新登录');
          } else if (res.code === 500) {
            this._showTip('服务器内部错误');
          } else {
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
          }
        });
      },
      // 获取提现记录
      _getList () {
        this.$refs.loading.showLoad();
        this._subList().then(res => {
          this.$refs.loading.hideLoad();
          this.chooseAgain = true;
          if (res.data.items.length > 0) {
            this.showLists = true;
          }
          // console.log(res.data.length < this.dataOption.pagesize);
          if (res.data.items.length < this.listOption.pageSize) {
            this.getAgain = false;
          }
        });
      },
      _subList () {
        this.listOption.token = this.memberLogin.token;
        return this.$store.dispatch('withdrawCountList', this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.withdrawbank-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.listOption.pages += 1;
            this._subList().then(res => {
              this.loadingShow = false;
              // console.log(res.data.lists);
              if (res.data.items.length === this.listOption.pageSize) {
                this.getAgain = true;
              }
            });
          }
        }
      },
     // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        if (str === 'drawMoney') {
          this.mokeOption.sxfMoney = (this.dataOption.drawMoney * 0.05).toFixed(2);
          this.mokeOption.allMoney = parseInt(this.dataOption.drawMoney) > 0 ? parseInt(this.dataOption.drawMoney) + parseFloat(this.mokeOption.sxfMoney) : '0.00';
          // console.log(this.dataOption.drawMoney);
        }
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .withdrawbank-page
    .withdraw-choose
        position: fixed
        top: 0
        left: 0
        width: 100%
        z-index: 110
        overflow: hidden
        background: #fff
        font-size: 0.9rem
        &.border-bottom-1px
          border-bottom-1px(#eff1f2)
        span
          float: left
          padding: 0.8rem 0
          width: 50%
          text-align: center
          color: #666
          &.index
            position: relative
            color: rgb(238, 213, 181)
            &:after
              position: absolute
              content: ''
              bottom: 0
              left: 0
              width: 100%
              height: 2px
              background: #ffe0af
    .withdraw-wrapper
      margin-top: 2.5rem
      background: #fff
      &.wrapper-absolute
        padding-bottom: 1.2rem
        // margin: 0
        // position: absolute
        // top: 2.5rem
        // left: 0
        // right: 0
        // bottom: 0
        // background: #fff
      .all-money
        padding: 0.6rem 1rem
        font-size: 0.8rem
        color: #666
      .choose-sublist
        position: relative
        width: 100%
        overflow: hidden
        border-bottom-1px(#eff1f2)
        span
          float: left
          padding: 0.5rem 0
          text-align: center
          font-size: 0.9rem
          width: 50%
          color: #666
          &.index
            color: rgb(238, 213, 181)
      .inner-edit
        padding: 1rem 1rem 0 1rem
        .tips-content
          border-radius: 4px
          margin-top: 0.8rem
          padding: 0.4rem 0.6rem
          background: #f5f5f5
          .title
            font-size: 0.9rem
            color: #828282
          .content
            margin-top: 0.3rem
            font-size: 0.8rem
            line-height: 0.9rem
            color: #828282
        .submit-btn
          margin: auto
          margin-top: 0.6rem
          padding: 0.6rem 0
          width: 100%
          border-radius: 4px
          text-align: center
          background: rgb(238, 213, 181)
          color: #fff
          font-size: 0.9rem
        .list-item
          padding: 0.2rem 0
          overflow: hidden
          .left
            float: left
            width: 7.5rem
            text-align: right
            height: 1.5rem
            line-height: 1.5rem
            font-size: 0.9rem
            color: #666
          .ipt
            padding: 0 0.2rem 0 7.8rem
            input
              display: inline-block
              width: 90%
              padding: 0.3rem 5%
              font-size: 0.9rem
              border: 1px solid #dbdbdb
      .inner-wrapper
        .list-wrapper
          .list-item
            position: relative
            padding: 0.5rem 1rem
            &.border-bottom-1px
              border-bottom-1px(#e6e6e6)
            .title
              overflow: hidden
              margin-bottom: 0.2rem
              font-size: 0.9rem
              .time
                float: left
                color: #333
              .money
                float: right
                color: #f36341
            .desc
              font-size: 0.8rem
              max-height: 1.8rem
              line-height: 0.9rem
              color: #666
              overflow: hidden
        .loading-bottom
          padding: 0.2rem 0
          text-align: center
          font-size: 0.9rem
          height: 1.2rem
          line-height: 1.2rem
          color: #666
          span
            display: inline-block
            height: 1.2rem
            line-height: 1.2rem
          .icon-spinner
            display: inline-block
            margin-right: 4px
            vertical-align: middle
            width: 1.2rem
            height: 1.2rem
            background: url(../../plugins/loading_icon.png) no-repeat
            background-size: 100% 100%
            animation: rotate 1.2s linear infinite
            -webkit-animation: rotates 1.2s linear infinite
          @keyframes rotate
            0%
              transform: rotate(0deg)
            50%
              transform: rotate(180deg)
            100%
              transform: rotate(360deg)
          @-webkit-keyframes rotates
            0%
              -webkit-transform: rotate(0deg)
            50%
              -webkit-transform: rotate(180deg)
            100%
              -webkit-transform: rotate(360deg)
          
</style>

