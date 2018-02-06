<template>
  <div class="login-page">
    <div class="login-wrapper">
      <img src="../assets/lx_icon.png" alt="" class="lx-icon">
      <img src="../assets/welcome.png" alt="" class="wel-icon">
      <!-- <p class="title">欢迎使用</p>
      <p class="content">盱眙龙虾连锁店消费商平台</p> -->
      <!-- 账号登录 -->
      <div class="inner-wrapper">
        <div class="list-item border-bottom-1px">
          <input type="text" v-model="dataOption.username" @input="filter('username')" placeholder="请输入您的用户名" maxlength="20" />
        </div>
        <div class="list-item border-bottom-1px">
          <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" />
        </div>
        <div class="login-btn" @click="_login">登录</div>
        <router-link :to="{name: 'register'}" class="register-btn">注册一个新账号</router-link>
      </div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
   // 提示框
   import tips from 'components/plugins/tips';
   import loading from 'components/plugins/loading';

   export default {
      data () {
        return {
          tipsStr: '',
          dataOption: {
            username: '',
            password: ''
          }
        };
      },
      methods: {
        _login () {
          // 要改成8
          if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.username)) {
            this._showTip('用户名必须是3-20位的数字或英文');
            return;
          }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('密码不能少于6位数');
            return;
          }
        // 验证通过登录
         this.$refs.loading.showLoad();
         this.$store.dispatch('memberLogin', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.data.token) {
              this.$router.replace({name: 'exchangeCode'});
            } else {
              if (res.data.code) {
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
              } else {
                this._showTip('链接失败');
              }
            }
         });
         // setTimeout(() => {
         //    this.$refs.loading.hideLoad();
         //    this.$router.replace({name: 'register'});
         //  }, 1500);
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
  @import "../common/stylus/mixin.styl";

  .login-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: url(../assets/login_bg.jpg) no-repeat
    background-size: 100% 100%
    .login-wrapper
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 16rem
      height: 14rem
      margin: auto
      .lx-icon
        position: absolute
        top: -6rem
        left: 50%
        width: 100%
        margin-left: -50%
        height: auto
      .wel-icon
        margin: 0.8rem 0
        display: block
        width: 100%
        height: auto
      .title
          padding: 0.6rem 0
          text-align: center
          color: #fff
          font-size: 1.6rem
        .content
          text-align: center
          color: #fff
          font-size: 0.8rem
      .inner-wrapper
        margin-top: 0.5rem
        .list-item
          position: relative
          padding: 0.4rem 0
          &.border-bottom-1px
            border-bottom-1px(#fff)
          input
            display: inline-block
            width: 100%
            height: 1.4rem
            line-height: 1.4rem
            font-size: 0.9rem
            color: #fff
        .login-btn
          margin-top: 1rem
          padding: 0.6rem 0
          width: 100%
          text-align: center
          border-radius: 5px
          font-size: 1rem
          background: rgba(74, 161, 254, 0.7)
          color: #fff
        .register-btn
          margin-top: 1rem
          padding: 0.5rem 0
          display: block
          width: 100%
          text-align: center
          font-size: 0.9rem
          color: #4aa1fe
</style>
