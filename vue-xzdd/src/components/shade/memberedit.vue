<template>
  <transition name="memberedit">
    <div class="memberedit-shade" v-show="membereditShow">
      <div class="memberedit-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
           <div class="list-item">
             <span class="left">昵称：</span>
             <div class="right">
               <input type="text" v-model="nikeName" maxlength="4" @input="filter('nikeName')" />
             </div>
           </div>
           <div class="list-item">
              <a class="sure-btn" @click="closeShade('submit')">确定</a>
              <a class="sure-btn" @click="_editPwd">修改密码</a>
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
        membereditShow: false,
        nikeName: ''
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      memberInfo: state => state.memberInfo
    }),
    methods: {
      showShade () {
        // 获取会员昵称
        this.nikeName = this.memberInfo.nick_name;
        this.membereditShow = true;
      },
      _editPwd () {
        this.$emit('otherShow', 'editpwd');
        this.membereditShow = false;
      },
      // 提交数据
      closeShade (str) {
          if (str === 'submit') {
            if (!/^[\u4e00-\u9fa5\w]{1,4}$/.test(this.nikeName)) {
              this.$emit('showTip', '昵称不能为空');
              return;
            }
            // 验证通过进行提交
           this.$emit('showLoad');
            this.$store.dispatch('editNikeName', {token: this.memberLogin.token, nickName: this.nikeName}).then(res => {
              this.$emit('hideLoad');
              if (res.message === 'OK') {
                this.$emit('showTip', '昵称修改成功');
               } else {
                this.$emit('showTip', '昵称修改失败');
               }
               this.membereditShow = false;
               this.$emit('showMiddle', 'withdraw');
            });
          } else {
            this.membereditShow = false;
            this.$emit('showMiddle', 'withdraw');
          }
       },
       // 过滤空格
       filter (str) {
          this[str] = this[str].replace(/\s/g, '');
       }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .memberedit-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.memberedit-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.memberedit-enter, &.memberedit-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .memberedit-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 7rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .inner-content
        margin-top: 0.8rem
        .list-item
          overflow: hidden
          .sure-btn
            margin-left: 0.9rem
            margin-top: 2rem
            display: inline-block
            width: 5.4rem
            height: 2.12rem
            text-align: center
            line-height: 2.2rem
            background: url(../../assets/blue_center_btn.png) no-repeat
            background-size: 100% 100%
            font-size: 0.9rem
            color: #fff
          .left
            float: left
            width: 4rem
            height: 1.5rem
            line-height: 1.5rem
            text-align: right
            color: #fff
            font-size: 0.9rem
          .right
            padding: 0 0 0 4rem
            input
              display: inline-block
              height: 1.5rem
              padding-left: 4%
              width: 96%
              border-bottom: 1px solid #fff
              border-radius: 0
              color: #fff
      .close-btn
        position: absolute
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          -webkit-transform: scale(1.2, 1.2)
</style>

