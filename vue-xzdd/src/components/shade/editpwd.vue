<template>
  <transition name="editpwd">
    <div class="editpwd-shade" v-show="editpwdShow">
      <div class="editpwd-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
           <div class="list-item">
              <input type="tel" v-model="dataOption.oldPassword" @input="filter('oldPassword')" class='add-ipt' maxlength="18" placeholder="原密码" />
            </div>
            <div class="list-item">
              <input type="text" v-model="dataOption.newPassword" @input="filter('newPassword')" class='add-ipt' maxlength="18" placeholder="新密码" />
            </div>
            <div class="list-item">
              <input type="text" v-model="dataOption.newPasswordConfirm" @input="filter('newPasswordConfirm')" class='add-ipt' maxlength="18" placeholder="确认新密码" />
            </div>
           <div class="list-item">
              <a class="sure-btn" @click="closeShade('submit')">确定</a>
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
        editpwdShow: false,
        dataOption: {
          token: '', // 会员TOKEN
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
    methods: {
      showShade () {
        this.editpwdShow = true;
      },
     // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
      },
      // 提交数据
      closeShade (str) {
          if (str === 'submit') {
            if (!/^\w{6,18}$/.test(this.dataOption.oldPassword)) {
              this.$emit('showTip', '原密码不能少于6位数');
              return;
            }
            if (!/^\w{6,18}$/.test(this.dataOption.newPassword)) {
              this.$emit('showTip', '新密码不能少于6位数');
              return;
            }
            if (this.dataOption.newPassword !== this.dataOption.newPasswordConfirm) {
              this.$emit('showTip', '两次密码不一致');
              return;
            }
            // 验证通过进行提交
            this.dataOption.token = this.memberLogin.token;
            this.$emit('showLoad');
            this.$store.dispatch('editNewPwd', this.dataOption).then(res => {
              this.$emit('hideLoad');
              if (res.message === 'OK') {
                this.$emit('showTip', '密码修改成功');
                this.dataOption = {
                  token: '', // 会员TOKEN
                  oldPassword: '', // 原密码
                  newPassword: '', // 新密码
                  newPasswordConfirm: '' // 确认新密码
                };
                this.editpwdShow = false;
                this.$emit('showMiddle', 'withdraw');
               } else {
                this.$emit('showTip', '密码修改失败');
               }
            });
          } else {
            this.editpwdShow = false;
            this.$emit('showMiddle', 'withdraw');
          }
       }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .editpwd-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.editpwd-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.editpwd-enter, &.editpwd-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .editpwd-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 11rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .inner-content
        // margin-top: 0.8rem
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
          .sure-btn
            display: block
            width: 5.4rem
            height: 2.12rem
            margin: auto
            margin-top: 0.7rem
            text-align: center
            line-height: 2.2rem
            background: url(../../assets/blue_center_btn.png) no-repeat
            background-size: 100% 100%
            font-size: 0.9rem
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

