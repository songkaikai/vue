<template>
  <div class="login-page">
    <div class="login-edit-wrapper">
      <!-- 头部icon -->
      <div class="ysj-img"><img src="../assets/ysj_login_icon.png" alt=""></div>
      <!-- 登录编辑框 -->
      <div class="edit-inner">
        <div class="list-item">
          <span class="left">用户名：</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.username" @input="filter('username')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">密码：</span>
          <div class="ipt">
            <input type="password" v-model="dataOption.password" @input="filter('password')" />
          </div>
        </div>
        <!-- <div class="list-item">
          <span class="left">验证码：</span>
          <div class="ipt">
            <input type="text" />
          </div>
        </div> -->
        <div class="login-btn" @click="_login">登录</div>
        <!-- 提示框 -->
        <tips :tipsStr="tipsStr" ref="tips"></tips>
        <!-- 等待加载 -->
        <loading ref="loading"></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        tipsStr: '', // 提示字段
        dataOption: {
          username: '', // 用户名
          password: '' // 密码
        }
      };
    },
    methods: {
      _login () {
        if (this.dataOption.username === '') {
          this._showTip('用户名不能为空');
          return;
        }
        if (this.dataOption.password === '') {
          this._showTip('密码不能为空');
          return;
        }
        // 验证通过进行提交
        this.$refs.loading.showLoad();
        this.$store.dispatch('memberLogin', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
              this.$router.replace({name: 'index'});
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
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    min-width: 1280px
    min-height: 720px;
    background: url(../assets/login_page_bg.jpg) center no-repeat
    background-size: 100% 100%
    .login-edit-wrapper
      position: absolute
      top: 50%
      right: 10%
      width: 350px
      // height: 450px
      height: 380px
      -webkit-transform: translateY(-50%)
      border-radius: 6px
      background: rgba(0, 0, 0, 0.6)
      .ysj-img
        img
          display: block
          width: 76%
          height: auto
          margin: 35px auto
      .edit-inner
        .login-btn
          margin: 20px 60px 0 55px
          padding: 12px 0
          text-align: center
          color:#fff
          background: url(../assets/btn_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
          font-size: 16px
        .list-item
          padding: 12px 0
          overflow: hidden
          .left
            float: left
            width: 120px
            height: 30px
            line-height: 30px
            text-align: right
            color: #fff
          .ipt
            padding: 0 60px 0 120px
            input
              display: inline-block
              padding: 8px 5%
              width: 90%
              border-radius: 3px
              background: rgba(245, 245, 245, 0.5)
              color: #fff
              font-size: 14px
</style>
