<template>
  <transition name="moneytransfer">
    <div class="money-transfer-shade" v-show="moneytransferShow">
      <div class="money-transfer-wrapper">
         <i class="close-btn" @click="_closeShade('')"></i>
          <div class="inner-content">
          <div class="list-item">
            <input type="tel" v-model="dataOption.targetMobile" @input="filter('targetMobile')" class='add-ipt' maxlength="16" placeholder="手机号" @blur="_getName" />
          </div>
          <div class="list-item">
            <input type="tel" v-model="nikeName" @input="filter('targetMobile')" class='add-ipt'  placeholder="昵称" disabled="disabled" />
          </div>
          <div class="list-item">
            <input type="tel" v-model="dataOption.money" @input="filter('money')" class='add-ipt' placeholder="金币数量" />
          </div>
          <div class="list-item">
            <input type="text" v-model="dataOption.desc" @input="filter('desc')" class='add-ipt' maxlength="6" placeholder="转币说明" />
          </div>
          <!-- 确定跟转币按钮 -->
          <div class="btn-wrapper">
            <div class="sure-btn left" @click="_closeShade('submit')">确定</div>
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
        // 当前是否显示邀请弹框
        moneytransferShow: false,
        dataOption: {
          token: '', // 会员TOKEN
          targetMobile: '', // 收款人手机号
          money: '', // 转账金额
          desc: '' // 转账说明
        },
        // 会员搜索到的昵称
        nikeName: '',
        searchName: {
          token: '', // 会员TOKEN
          mobile: '' // 会员手机号
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    methods: {
      showShade () {
        this.moneytransferShow = true;
      },
      // 提交数据
      _closeShade (str) {
        if (str === 'submit') {
          // 验证手机号码
          // if (!/^1[34578]\d{9}$/.test(this.dataOption.targetMobile)) {
          if (!/^\d{1,16}$/.test(this.dataOption.targetMobile)) {
            this.$emit('showTip', '手机号码格式错误');
            return false;
          }
          // 确认收款人
          // if (this.nikeName === '') {
          //   this.$emit('showTip', '收款人昵称不能为空');
          //   return false;
          // }
          // console.log(this.dataOption.money % 100)
          if (this.dataOption.money % 10 !== 0) {
            this.$emit('showTip', '转币必须是10的倍数');
            return false;
          }
          if (this.dataOption.money < 20) {
            this.$emit('showTip', '转币必须大于20');
            return false;
          }
          // 加载中提示
          this.dataOption.token = this.memberLogin.token;
          this.$emit('showLoad');
          this.$store.dispatch('exchangeMoney', this.dataOption).then(res => {
            this.$emit('hideLoad');
             if (!res.data.code) {
                this.$emit('showTip', '转币成功');
                // 获取会员基本信息
                this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
                this.dataOption = {
                   token: '', // 会员TOKEN
                   targetMobile: '', // 收款人手机号
                   money: '', // 转账金额
                   desc: '' // 转账说明
                };
                this.moneytransferShow = false;
                this.$emit('showMiddle', 'moneytransfer');
             } else {
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this.$emit('showTip', obj[key]);
                  return;
                }
                // this.$emit('showTip', JSON.parse(res.data.message));
             }
          });
          // setTimeout(() => {
          //   this.$emit('hideLoad');
          //   this.moneytransferShow = false;
          //   this.$emit('showMiddle', 'invite');
          // }, 1500);
        } else {
            this.moneytransferShow = false;
            this.$emit('showMiddle', 'moneytransfer');
        }
       },
        // 过滤空格
        filter (str) {
          this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        },
        _getName () {
          this.searchName.token = this.memberLogin.token;
          this.searchName.mobile = this.dataOption.targetMobile;
          this.$store.dispatch('getName', this.searchName).then(res => {
            if (res.data.code === 422) {
              this.nikeName = '';
            } else {
              this.nikeName = res.data.nick_name;
            }
            // console.log(res);
          });
        }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .money-transfer-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.moneytransfer-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.moneytransfer-enter, &.moneytransfer-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .money-transfer-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 13.5rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .list-item
        position: relative
        .add-ipt
          display: inline-block
          margin: 0.5rem 0
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
          background: url(../../assets/sure_btn_icon.png) no-repeat
          background-size: 100% 100%
          font-size: 0.9rem
          color: #fff
          margin: 0.6rem auto 0 auto
          &:active
            transform: scale(1.2, 1.2)
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
</style>
