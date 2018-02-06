<template>
  <transition name="withdraw">
    <div class="withdraw-shade" v-show="withdrawShow">
      <div class="withdraw-wrapper">
         <i class="close-btn" @click="_closeShade('')"></i>
         <div class="inner-content">
            <!-- 支付类型 -->
            <ul class="withdraw-type">
              <li @click="_chooseType(0)"><i :class="[typeChoose === 0 ? 'index' : '']"></i><span>支付宝</span></li>
              <li @click="_chooseType(1)"><i :class="[typeChoose === 1 ? 'index' : '']"></i><span>银行卡</span></li>
            </ul>
            <!-- 支付宝 -->
            <div class="list-wrapper" v-show="typeChoose === 0">
                <div class="list-item">
                  <input type="text" v-model="zfbDataOption.trueName" @input="filter('trueName')" class='add-ipt'  placeholder="请填写您的真实姓名" maxlength="6" />
                </div>
                <div class="list-item">
                  <input type="text" v-model="zfbDataOption.alipayNo" @input="filter('alipayNo')" class='add-ipt' placeholder="请填写支付宝账号" />
                </div>
                <div class="list-item">
                  <input type="tel" v-model="zfbDataOption.drawMoney" @input="filter('drawMoney')" class='add-ipt' placeholder="请填写提现金额" />
                </div>
            </div>
            <!-- 银行卡 -->
            <div class="list-wrapper" v-show="typeChoose === 1">
                <div class="list-item">
                  <input type="text" v-model="bankDataOption.bankName" @input="filter('bankName')" class='add-ipt'  placeholder="请填写开户银行" />
                </div>
                <div class="list-item">
                  <input type="text" v-model="bankDataOption.trueName" @input="filter('trueName')" class='add-ipt'  placeholder="请填写您的真实姓名" maxlength="6" />
                </div>
                <div class="list-item">
                  <input type="tel" v-model="bankDataOption.cardNo" @input="filter('cardNo')" class='add-ipt' placeholder="请填写银行卡号" />
                </div>
                <div class="list-item">
                  <input type="tel" v-model="bankDataOption.drawMoney" @input="filter('drawMoney')" class='add-ipt' placeholder="请填写提现金额" />
                </div>
            </div>
            <!-- 确定跟记录按钮 -->
            <div class="btn-wrapper">
              <div class="sure-btn left" @click="_closeShade('submit')">提现</div>
              <div class="sure-btn right" @click="_recode">记录</div>
            </div>
         </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        // 提现类型0为支付宝，1为银行卡
        typeChoose: 0,
        // 当前是否显示邀请弹框
        withdrawShow: false,
        //  支付宝
        zfbDataOption: {
          token: '', // 会员TOKEN
          drawMoney: '', // 提现金额
          withdrawType: 'alipay', // 提现方式alipay支付宝bank银行卡
          trueName: '', // 真实姓名
          alipayNo: '' // 支付宝账号
        },
        // 银行卡
        bankDataOption: {
          token: '', // 会员TOKEN
          bankName: '', // 开户行
          trueName: '', // 真实姓名
          cardNo: '', // 卡号
          withdrawType: 'bank', // 提现方式alipay支付宝bank银行卡
          drawMoney: '' // 提现金额
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    created () {
      // 获取token
      this.zfbDataOption.token = this.memberLogin.token;
      this.bankDataOption.token = this.memberLogin.token;
    },
    methods: {
      showShade () {
        this.withdrawShow = true;
      },
      // 更换提现类型
      _chooseType (num) {
        this.typeChoose = num;
      },
      // 提交数据
      _closeShade (str) {
          if (str === 'submit') {
            if (this.typeChoose === 0) {
              // alert('支付宝');
              if (this.zfbDataOption.trueName === '') {
                this.$emit('showTip', '真实姓名不能为空');
                return;
              }
              if (this.zfbDataOption.alipayNo === '') {
                this.$emit('showTip', '支付宝账号不能为空');
                return;
              }
              if (this.zfbDataOption.drawMoney === '') {
                this.$emit('showTip', '提现金额不能为空');
                return;
              }
            } else if (this.typeChoose === 1) {
              // alert('银行卡');
              if (this.bankDataOption.bankName === '') {
                this.$emit('showTip', '开户银行不能为空');
                return;
              }
              if (this.bankDataOption.trueName === '') {
                this.$emit('showTip', '真实姓名不能为空');
                return;
              }
              if (this.bankDataOption.cardNo === '') {
                this.$emit('showTip', '银行卡账号不能为空');
                return;
              }
              if (this.bankDataOption.drawMoney === '') {
                this.$emit('showTip', '提现金额不能为空');
                return;
              }
            }
            // 加载中提示
            this.$emit('showLoad');
            this.$store.dispatch('withDraw', this.typeChoose === 0 ? this.zfbDataOption : this.bankDataOption).then(res => {
                this.$emit('hideLoad');
                if (!res.data.code) {
                    this.$emit('showTip', '提现成功');
                    // 获取会员基本信息
                    this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
                    if (this.typeChoose === 0) {
                      this.zfbDataOption = {
                        token: '', // 会员TOKEN
                        drawMoney: '', // 提现金额
                        withdrawType: 'alipay', // 提现方式alipay支付宝bank银行卡
                        trueName: '', // 真实姓名
                        alipayNo: '' // 支付宝账号
                      };
                    } else {
                      this.bankDataOption = {
                        token: '', // 会员TOKEN
                        bankName: '', // 开户行
                        trueName: '', // 真实姓名
                        withdrawType: 'bank', // 提现方式alipay支付宝bank银行卡
                        cardNo: '', // 卡号
                        drawMoney: '' // 提现金额
                      };
                    }
                    this.dataOption = {
                       token: '', // 添加会员TOKEN
                       trueName: '', // 昵称
                       mobile: '', // 手机号
                       recommName: '' // 推荐人姓名(手机号)
                    };
                    this.withdrawShow = false;
                    this.$emit('showMiddle', 'withdraw');
                   } else {
                    var obj = JSON.parse(res.data.message);
                    for (var key in obj) {
                       this.$emit('showTip', obj[key]);
                      return;
                    }
                  }
              });
          } else {
            this.withdrawShow = false;
            this.$emit('showMiddle', 'withdraw');
          }
       },
       // 显示提现记录
       _recode () {
          this.withdrawShow = false;
          this.$emit('otherShow', 'drawrecode');
        // this.$emit('showLoad');
        // setTimeout(() => {
        //   this.$emit('hideLoad');
        //   this.withdrawShow = false;
        //   this.$emit('otherShow', 'drawrecode');
        // }, 1000);
        // console.log('recode');
       },
        // 过滤空格
        filter (str) {
          if (this.typeChoose === 0) {
            this.zfbDataOption[str] = this.zfbDataOption[str].replace(/\s/g, '');
          } else {
            this.bankDataOption[str] = this.bankDataOption[str].replace(/\s/g, '');
          }
        }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .withdraw-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.withdraw-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.withdraw-enter, &.withdraw-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .withdraw-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 16rem
      padding: 1rem 1.5rem 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .close-btn
        position: absolute
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
      .inner-content
        // overflow: hidden
        .withdraw-type
          overflow: hidden
          li
            float: left
            padding:  0.8rem 0
            width: 50%
            text-align: center
            font-size: 0.9rem
            color: #fff
            i
              display: inline-block
              vertical-align: middle
              margin-right: 0.3rem
              width: 1.5rem
              height: 1.5rem
              background: url(../../assets/choose_no_btn.png) no-repeat
              background-size: 100% 100%
              &.index
                background: url(../../assets/choose_has_btn.png) no-repeat
                background-size: 100% 100%
        .list-wrapper
          height: 10rem
          .list-item
            position: relative
            .add-ipt
              display: inline-block
              margin: 0.3rem 0
              padding: 0.5rem 7%
              width: 86%
              background: rgba(26, 122, 183, 0.7)
              border-radius: 25px
              font-size: 0.8rem
              color: #fff
        .btn-wrapper
          // overflow: hidden
          .sure-btn
            width: 5.4rem
            height: 2.12rem
            text-align: center
            line-height: 2.1rem
            margin-top: 0.6rem
            background: url(../../assets/sure_btn_icon.png) no-repeat
            background-size: 100% 100%
            font-size: 0.9rem
            color: #fff
            &.left
              float:left
            &.right
              float:right
            &:active
              transform: scale(1.2, 1.2)
</style>
