<template>
  <div class="edit-pass-page">
  	<div class="list-wrapper">
      <div class="list-item">
        <i class="icon-two"></i>
        <div class="right-ipt">
          <input type="password" v-model="dataOption.old_password" @input="filter('old_password')" placeholder="请输入旧密码" />
        </div>
      </div>
      <div class="list-item">
        <i class="icon-two"></i>
        <div class="right-ipt">
          <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入新密码" />
        </div>
      </div>
      <div class="list-item">
        <i class="icon-two"></i>
        <div class="right-ipt">
          <input type="password" v-model="dataOption.password_confirmation" @input="filter('password_confirmation')" placeholder="请确认密码" />
        </div>
      </div>
      <div class="submit-btn" @click="_submit">确定</div>
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

  export default {
    data () {
      return {
        pageStr: 'edit-pass',
        tipsStr: '',
        dataOption: {
          token: '',
          old_password: '',
          password: '',
          password_confirmation: ''
        }
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin
      })
    },
    methods: {
      _submit () {
        if (!/^\w{6,18}$/.test(this.dataOption.old_password)) {
          this._showTip('旧密码不能少于6位数');
          return false;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.password)) {
          this._showTip('新密码不能少于6位数');
          return false;
        }
        if (this.dataOption.password !== this.dataOption.password_confirmation) {
          this._showTip('两次密码不一致');
          return false;
        }
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('editPassword', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this.dataOption = {
              token: '',
              old_password: '',
              password: '',
              password_confirmation: ''
            };
            this._showTip('修改成功');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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

  .edit-pass-page
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: #fff
  	.list-wrapper
      padding: 2rem 2rem 0 2rem
      .submit-btn
        margin-top: 2rem
        width: 100%
        text-align: center
        font-size: 0.8rem
        background: #4fccdb
        padding: 0.7rem 0
        border-radius: 4px
        color: #fff
      .list-item
        position: relative
        padding: 0.6rem 0.3rem
        margin: 0.8rem 0
        border: 1px solid #ccc
        border-radius: 4px
        // &.border-bottom-1px
        //   border-bottom-1px(#7f7f7f)
        .none-msg,.has-msg
          font-size: 0.9rem
          color: #fff
        .validate
          display: inline-block
          position: absolute
          top: 0
          right: 0
          width: 7rem
          height: 2.2rem
          font-size: 0.9rem
          line-height: 2.2rem
          color: #7ed7e2
          text-align: center
          &:after
            position: absolute
            content: ''
            top: 10%
            left: 0
            width: 1px
            height: 80%
            background: #fff
            -webkit-transform: scaleX(0.5);
        i
          float:left
          width: 1.4rem
          height:1.4rem
          &.icon-two
            background: url(./icon_two.png) no-repeat
            background-size: 100% 100%
        .right-ipt
          padding: 0 0 0 1.5rem;
          input
            display: inline-block
            width: 96%
            padding: 0 2%
            height: 1.4rem
            line-height: 1.4rem
            font-size: 0.9rem
            color: #333
</style>
