<template>
  <div class="choose-page">
    <!-- 顶部导航 -->
    <div class="member-info">
      <!-- <span class="gf-info">工号：25648354358</span> -->
      <span class="name-info">名字：{{ memberLogin.true_name }}</span>
      <div class="edit-all" style="display: inline-block;position: relative;" @mouseover="_showTwo(1)" @mouseout="_showTwo(0)">
        <i class="edit-btn" @click=""></i>
        <!-- 二级弹框 -->
        <div class="edit-bombox" v-show="showTwo">
          <div class="list-item" style="border-bottom: 1px solid #ccc;" @click="_showPassEdit">
            <i class="pass-icon"></i><span>修改密码</span>
          </div>
          <div class="list-item" @click="_logout">
            <i class="exit-icon"></i><span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容选项 -->
    <div class="content-link">
      <div class="list-item" v-if="memberLogin.role.indexOf(1) !== -1">
        <i class="one-icon"></i>
        <!-- <router-link :to="{name: 'payPage'}">付款</router-link> -->
        <a @click="_showType('payPage')">购机</a>
      </div>
      <div class="list-item" v-if="memberLogin.role.indexOf(3) !== -1">
        <i class="two-icon"></i>
        <!-- <router-link :to="{name: 'openCard'}">开卡</router-link> -->
        <a @click="_showType('openCard')">开卡</a>
      </div>
      <!-- <div class="list-item" v-if="memberLogin.role.indexOf(2) !== -1">
        <i class="three-icon"></i>
        <router-link :to="{name: 'receive'}">领机</router-link>
        <a @click="_showType('receive')">领机</a>
      </div> -->
    </div>
    <!-- 输入领机码 -->
    <transition name="echowrapper">
      <div class="echo-all-wrapper" v-show="showEcho">
        <transition name="echoinner">
          <div class="echo-ljcode" v-show="showEcho">
            <i class="close-btn" @click="_closeEcho"></i>
            <img src="../../assets/ljcode_bg.jpg" alt="">
            <div class="code-wrapper">
              <p class="title">输入领机码</p>
              <div class="ipt"><input type="text" v-model="codeOption.orderNo"  @keyup="_test" /></div>
              <!-- <div class="sure-btn" @click="_submit">确定</div> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 修改密码弹框 -->
    <transition name="bombox">
      <div class="bomb-wrapper" v-show="showBomb">
        <transition name="box">
          <div class="bomb-box border-bottom-1px" v-show="showBomb">
            <i class="close-btn" @click="_closeBomb"></i>
            <p class="tips">修改密码</p>
            <div class="pass-wrapper">
              <div class="list-item">
                <span class="left">原密码：</span>
                <div class="ipt">
                  <input type="text" v-model="passOption.oldPassword" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">新密码：</span>
                <div class="ipt">
                  <input type="text" v-model="passOption.newPassword" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">确认密码：</span>
                <div class="ipt">
                  <input type="text" v-model="passOption.newPasswordConfirm" />
                </div>
              </div>
              <div class="submit-btn" @click="_submitPass">确定</div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        tipsStr: '', // 提示字段
        storageStr: '', // 当前存储需要跳转的链接
        showEcho: false, // 显示输入领机码的弹框
        showBomb: false,
        showTwo: false,
        codeOption: {
          token: '', // token
          orderNo: '' // 申请单编号
        },
        passOption: {
          token: '', // token
          oldPassword: '', // 原密码
          newPassword: '', // 新密码
          newPasswordConfirm: '' // 确认新密码
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    // created () {
    //   console.log(this.memberLogin.role);
    //   console.log(this.memberLogin.role.indexOf('1'));
    // },
    methods: {
      _showTwo (type) {
        if (type === 1) {
          this.showTwo = true;
        } else {
          this.showTwo = false;
        }
      },
      // 显示密码修改
      _showPassEdit () {
        this.showBomb = true;
      },
      _closeBomb () {
        this.showBomb = false;
      },
      _submitPass () {
         if (this.passOption.oldPassword === '') {
            this._showTip('原密码不能为空');
            return;
         }
         if (this.passOption.newPassword === '') {
            this._showTip('新密码不能为空');
            return;
         }
         if (this.passOption.newPasswordConfirm === '') {
            this._showTip('确认密码不能为空');
            return;
         }
         // 提交数据
        this.$refs.loading.showLoad();
        this.passOption.token = this.memberLogin.token;
        this.$store.dispatch('changePass', this.passOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.data.result === 'success') {
              this._showTip('修改成功');
              this.passOption = {
                token: '', // token
                oldPassword: '', // 原密码
                newPassword: '', // 新密码
                newPasswordConfirm: '' // 确认新密码
              };
            } else {
              this._showTip(res.data.msg);
            }
            this.showBomb = false;
        });
      },
      // 退出登录
      _logout () {
        this.$router.replace({name: 'login'});
      },
      // 弹出框
      _showType (type) {
        // console.log(this.memberLogin.role);
        this.storageStr = type;
        this.showEcho = true;
        this.$nextTick(() => {
          $('.echo-all-wrapper .ipt input').focus();
        });
      },
      // 关闭输入码弹框
      _closeEcho () {
        this.showEcho = false;
      },
      _submit () {
        if (this.codeOption.orderNo === '') {
          this._showTip('领机码不能为空');
          return;
        }
        // 提交数据
        this.$refs.loading.showLoad();
        this.codeOption.token = this.memberLogin.token;
        this.$store.dispatch('orderCode', this.codeOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.data.result === 'success') {
              // 跳转页面
              this.$router.push({name: this.storageStr});
            } else {
              this._showTip(res.data.msg);
            }
        });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      },
      _test (event) {
        var e = event || window.event;
        if (e && e.keyCode === 13) { // enter键
            this.$refs.loading.showLoad();
            this.codeOption.token = this.memberLogin.token;
            this.$store.dispatch('orderCode', this.codeOption).then(res => {
                this.$refs.loading.hideLoad();
                if (res.data.result === 'success') {
                  // 跳转页面
                  this.$router.push({name: this.storageStr});
                } else {
                  this._showTip(res.data.msg);
                }
            });
        }
        // this.$router.push({name: 'login'});
      }
    },
    components: {
      tips,
      loading
    }
  };
  // document.onkeydown = function (event) {
  //     var e = event || window.event;
  //     if (e && e.keyCode === 13) { // enter键
  //           // 要做的事情
  //           vuxR.methods._test();
  //     }
  // };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  
  .choose-page
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    min-width: 1280px
    min-height: 720px;
    background: url(../../assets/choose_page_bg.jpg) center no-repeat
    background-size: 100% 100%
    .echo-all-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.echowrapper-enter-active
        opacity: 1
      &.echowrapper-enter,&.echowrapper-leave-active
        opacity: 0
      .echo-ljcode
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 320px
        height: 210px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.7)
        background: rgba(255, 255, 255, 0.6)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        &.echoinner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.echoinner-enter,&.echoinner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        .close-btn
            position: absolute
            top: 8px
            right: 8px
            width: 22px
            height: 22px
            background: url(../../assets/close_btn.png) center no-repeat
            background-size: 100% 100%
            cursor: pointer
        img
          display: block
          width: 100%
          height: auto
        .title
          padding: 18px 0
          text-align: center
          font-size: 20px
        .ipt
          padding: 0 50px
          input
            display: inline-block
            width: 90%
            font-size: 14px
            line-height: 14px
            padding: 9px 5%
            background: #fff
            border-radius: 4px
        .sure-btn
          margin: 18px 50px
          text-align: center
          font-size: 18px
          padding: 7px 0
          border-radius: 4px
          background: url(../../assets/btn_progress.png) center no-repeat
          background-size: 100% 100%
          color: #fff
          cursor: pointer
    .edit-bombox
      position: absolute
      top: 40px
      right: 30px
      width: 110px
      // height: 60px
      background: #fff
      border-radius: 5px
      // overflow: hidden
      &:after
        position: absolute
        content: ''
        top: -14px
        left: 50%
        width: 20px
        height: 14px
        background: url(../../assets/small_sjx_icon.png) center no-repeat
        background-size: 100% 100%
      .list-item
        padding: 0.5rem 0
        font-size: 0.9rem
        text-align: center
        cursor: pointer
        i
          display: inline-block
          vertical-align: middle
          margin-right: 5px
          width: 25px
          height: 25px
          &.pass-icon
            background: url(../../assets/clock_icon.png) center no-repeat
            background-size: 100% 100%
          &.exit-icon
            background: url(../../assets/exit_icon.png) center no-repeat
            background-size: 100% 100%
        span
          display: inline-block
          vertical-align: middle
          height: 25px
          line-height: 25px
          color: #2b2b2b
    .bomb-wrapper
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.bombox-enter-active
        opacity: 1
      &.bombox-enter,&.bombox-leave-active
        opacity: 0
      .bomb-box
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        margin: auto
        width: 340px
        height: 240px
        border-radius: 8px
        border: 2px solid rgba(255, 255, 255, 0.7)
        background: rgba(255, 255, 255, 0.5)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        &.box-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.box-enter,&.box-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        .close-btn
          position: absolute
          top: 8px
          right: 8px
          width: 22px
          height: 22px
          background: url(../../assets/close_btn.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .tips
          padding: 15px 0
          text-align: center
          font-size: 20px
          color: #3a3a3a
        .pass-wrapper
          padding:  0 1rem
          .submit-btn
            padding: 8px 0
            margin: 15px 20px 0 10px
            text-align: center
            color: #fff
            background: url(../../assets/btn_progress.png) center no-repeat
            background-size: 100% 100%
            cursor: pointer
          .list-item
            padding: 5px 0
            overflow: hidden
            .left
              float: left
              width: 90px
              height: 26px
              line-height: 26px
              text-align: right
            .ipt
              padding: 0 20px 0 90px
              input
                display: inline-block
                width: 90%
                padding: 6px 5%
                color: #000
                border-radius: 3px
                font-size: 14px
                line-height: 14px
                background: #fff
    .member-info
      margin-top: 25px
      text-align: right
      color: #fff
      .gf-info, .name-info
        display: inline-block
        vertical-align: middle
        margin-right: 25px
        padding: 7px 0
        font-size: 16px
      .edit-btn
        display: inline-block
        vertical-align: middle
        margin-right: 60px
        width: 30px
        height: 30px
        background: url(../../assets/edit_btn.png) center no-repeat
        background-size: 100% 100%
        cursor: pointer
    .content-link
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      width: 680px
      height: 180px
      margin: auto
      overflow: hidden
      text-align: center
      .list-item
        // float: left
        display: inline-block
        width: 32.3%
        text-align: center
        i
          display: block
          margin: auto
          width: 60px
          height: 60px
          &.one-icon
            background: url(../../assets/choose_page_one.png) center no-repeat
            background-size: 100% 100%
          &.two-icon
            background: url(../../assets/choose_page_two.png) center no-repeat
            background-size: 100% 100%
          &.three-icon
            background: url(../../assets/choose_page_three.png) center no-repeat
            background-size: 100% 100%
        a
          display: block
          width: 100px
          height: 100px
          margin: auto
          margin-top: 15px
          line-height: 100px
          font-size: 28px
          text-align: center
          color: #fff
          background: url(../../assets/choose_index_four.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
</style>
