<template>
  <transition name="invite">
    <div class="invite-shade" v-show="inviteShow">
      <div class="invite-wrapper">
        <i class="close-btn" @click="closeShade('')"></i>
        <div class="inner-content">
          <div class="list-item">
            <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" class='add-ipt' maxlength="16" placeholder="手机号" />
          </div>
          <div class="list-item">
            <input type="text" v-model="dataOption.trueName" @input="filter('trueName')" class='add-ipt' maxlength="4" placeholder="昵称" />
          </div>
          <div class="list-item" v-if="memberLogin.report_center === 1">
            <input type="text" v-model="dataOption.recommName" @input="filter('recommName')" class='add-ipt' maxlength="4" placeholder="邀请人" />
          </div>
        </div>
        <div class="btn-wrapper">
            <div class="sure-btn left" @click="closeShade('submit')">邀请</div>
            <div class="sure-btn right" @click="_exchange">转币</div>
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
        inviteShow: false,
        dataOption: {
          token: '', // 添加会员TOKEN
          trueName: '', // 昵称
          mobile: '', // 手机号
          recommName: '' // 推荐人姓名(手机号)
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    methods: {
      showShade () {
        this.inviteShow = true;
      },
      // 提交数据
      closeShade (str) {
        if (str === 'submit') {
          // 验证手机号码
          if (!/^\d{1,16}$/.test(this.dataOption.mobile)) {
            this.$emit('showTip', '手机号码格式错误');
            return;
          }
          if (!/^[\u4e00-\u9fa5\w]{1,4}$/.test(this.dataOption.trueName)) {
            this.$emit('showTip', '请输入昵称');
            return;
          }
          // 加载中提示
          this.dataOption.token = this.memberLogin.token;
          this.$emit('showLoad');
          this.$store.dispatch('inviteMember', this.dataOption).then(res => {
            this.$emit('hideLoad');
            if (!res.data.code) {
                this.$emit('showTip', '邀请好友成功');
                // 获取会员基本信息
                this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
                this.dataOption = {
                   token: '', // 添加会员TOKEN
                   trueName: '', // 昵称
                   mobile: '', // 手机号
                   recommName: '' // 推荐人姓名(手机号)
                };
                this.inviteShow = false;
                this.$emit('showMiddle', 'invite');
               } else {
                  // console.log(res.message);
                  var obj = JSON.parse(res.data.message);
                  for (var key in obj) {
                    this.$emit('showTip', obj[key]);
                    return;
                  }
               }
          });
          // setTimeout(() => {
          //   this.$emit('hideLoad');
          //   this.inviteShow = false;
          //   this.$emit('showMiddle', 'invite');
          // }, 1500);
        } else {
            this.inviteShow = false;
            this.$emit('showMiddle', 'invite');
        }
       },
       // 转币弹框显示
       _exchange () {
        this.inviteShow = false;
        // console.log(1);
        this.$emit('otherShow', 'moneytransfer');
       },
        // 过滤空格
        filter (str) {
          this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .invite-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.invite-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.invite-enter, &.invite-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .invite-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 10.5rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .inner-content
        height: 8.4rem
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
