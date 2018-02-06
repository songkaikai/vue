<template>
	<div class="login-page">
    <div class="login-wrapper">
      <img src="../assets/zkdg_icon.png" alt="" class="lx-icon" />
      <img src="../assets/zkdg_title.png" alt="" class="wel-icon" />
      <div class="inner-wrapper">
        <div class="list-item border-bottom-1px">
          <i class="icon-one"></i>
          <div class="right-ipt">
            <input type="text" v-model="dataOption.mobile" @input="filter('mobile')" placeholder="请输入用户名" maxlength="20" />
          </div>
        </div>
        <div class="list-item border-bottom-1px">
          <i class="icon-two"></i>
          <div class="right-ipt">
            <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" />
          </div>
        </div>
        <div class="other-link"><span class="forget-pwd" @click="_forgetPass">忘记密码</span></div>
        <div class="login-btn" @click="_userlogin">登录</div>
        <a class="register-btn" @click="_userRegister">注册一个新账号</a>
      </div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
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
          mobile: '', // 手机号(用户名)
          password: '' // 密码
        }
      };
    },
    methods: {
      // 用户登录验证
      _userlogin () {
        if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
          this._showTip('请输入正确的手机格式');
          return false;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.password)) {
          this._showTip('密码不能少于6位数');
          return false;
        }
        // 通过验证
        this.$refs.loading.showLoad();
        this.$store.dispatch('memberLogin', this.dataOption).then(res => {
          if (res.code === 1) { // 登录成功进入首页
            this.$store.dispatch('memberInfo', {token: res.data.token}).then(res => {
              this.$refs.loading.hideLoad();
              if (res.code === 1) { // 获取用户信息
                this.$router.replace({name: 'home'});
              } else {
                this._showTip(res.msg);
              }
            });
          } else {
            this.$refs.loading.hideLoad();
            this._showTip(res.msg);
          }
        });
      },
      // 用户注册
      _userRegister () {
        this.$router.push({name: 'register'});
      },
      // 忘记密码
      _forgetPass () {
        // console.log('forget password!');
        this.$router.push({name: 'forget'});
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

<style>
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {color: #c1c1c0;}
  .border-bottom-1px{position: relative;}
  .border-bottom-1px:after{display: block;position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #646c75;content: '';-webkit-transform: scaleY(0.5);}
  .login-page{position:fixed;top:0;left:0;width:100%;height:100%;background: #fff;}
  .login-page .login-wrapper{position: absolute;top: 0;left: 0;right: 0;bottom: 0;width: 16rem;height: 13rem;margin: auto;}
  .login-page .login-wrapper .lx-icon{position: absolute;top: -8.5rem;left: 50%;width: 130%;margin-left: -65%;height: auto;}
  .login-page .login-wrapper .wel-icon{display: block;width: 100%;height: auto;margin-top:1rem;}
  .login-page .login-wrapper .title{padding: 0.6rem 0;text-align: center;color: #fff;font-size: 1.6rem;}
  .login-page .login-wrapper .inner-wrapper{margin-top: 1.5rem;}
  .login-page .login-wrapper .inner-wrapper .other-link{margin-bottom:0.6rem;overflow: hidden;}
  .login-page .login-wrapper .inner-wrapper .other-link span{float:right;font-size: 0.9rem;color:#7ed7e2;padding: 0.8rem 0;}
  .login-page .login-wrapper .inner-wrapper .list-item{position: relative;padding: 0.4rem 0;margin-bottom:0.6rem;overflow: hidden;}
  .login-page .login-wrapper .inner-wrapper .list-item i{float:left;width: 1.4rem;height:1.4rem;}
  .login-page .login-wrapper .inner-wrapper .list-item i.icon-one{background: url(../assets/icon_one.png) no-repeat;background-size: 100% 100%;}
  .login-page .login-wrapper .inner-wrapper .list-item i.icon-two{background: url(../assets/icon_two.png) no-repeat;background-size: 100% 100%;}
  .login-page .login-wrapper .inner-wrapper .list-item .right-ipt{padding: 0 0 0 1.5rem;}
  .login-page .login-wrapper .inner-wrapper .list-item .right-ipt input{display: inline-block;width: 100%;height: 1.4rem;line-height: 1.4rem;font-size: 0.9rem;color: #646c75;}
  .login-page .login-wrapper .inner-wrapper .login-btn{margin:auto;margin-top: 0.5rem;padding: 0.5rem 0;width: 100%;text-align: center;border-radius: 5px;font-size: 1rem;background: #7ed7e2;color:#fff;}
  .login-page .login-wrapper .inner-wrapper .register-btn{margin-top: 1.5rem;padding: 0.5rem 0;display: block;width: 100%;text-align: center;font-size: 0.9rem;color: #858585;}
  .login-page .return-btn{position: absolute;bottom: 1rem;left:1rem;width:6rem;padding: 0.5rem;}

</style>
