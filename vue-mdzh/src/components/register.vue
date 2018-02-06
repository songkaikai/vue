<template>
  <div class="register-page">
    <div class="register-wrapper">
      <img src="../assets/mdzh_logo.png" alt="" class="lx-icon">
      <img src="../assets/register_title.png" alt="" class="wel-icon">
      <!-- 账号登录 -->
      <div class="inner-wrapper">
        <div class="prev-page">
          <div class="list-item border-bottom-1px">
            <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" placeholder="请输入您的手机号" />
          </div>
          <div class="list-item border-bottom-1px">
            <input type="tel" v-model="dataOption.code" @input="filter('code')" placeholder="请输入验证码" maxlength="6" />
            <span class="validate" @click="_getValidateCode">{{ validateStr }}</span>
          </div>
          <div class="list-item border-bottom-1px">
            <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" />
          </div>
          <div class="list-item border-bottom-1px">
            <input type="password" v-model="dataOption.confirmPassword" @input="filter('confirmPassword')" placeholder="请确认密码" />
          </div>
          <div class="list-item border-bottom-1px">
            <!-- <input type="tel" v-model="dataOption.recommender" @input="filter('recommender')" placeholder="推荐人手机号或编号" maxlength="20" /> -->
            <input type="text" v-model="dataOption.recommender" @input="filter('recommender')" placeholder="请输入推荐人" maxlength="20" />
          </div>
        </div>
        <p class="tips-login">* 免蛋会员可直接登录</p>
        <div class="register-btn" @click="_register">注册</div>
        <!-- <p class="tip">已经有账户了？<router-link :to="{name: 'login'}" class="login-btn">点此登录</router-link></p> -->
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
  // import regional from 'static/js/regional';

  export default {
    data () {
      return {
        tipsStr: '',
        dataOption: {
          mobile: '', // 手机号
          password: '', // 密码
          confirmPassword: '', // 确认密码
          code: '', // 手机验证码
          recommender: '' // 推荐人手机号或编号
        },
        registerTrue: false, // 当前是否注册成功true为成功
        canGetCode: 1, // 能否再次获取验证码
        validateStr: '获取验证码', // 验证码提示字段
        generatorCode: '', // 前端生成的6位数验证码
        timeOut: null
      };
    },
    created () {
        // 获取当前路径的参数
        if (this.$route.query.uname !== undefined) {
          this.dataOption.recommender = this.$route.query.uname;
        }
        // console.log(regional[1]);
    },
    methods: {
        // 发送验证码等待的剩余时间
        _waitTime (time) {
          var nowTime = time - 1;
          this.validateStr = nowTime + 's后重新发送';
          // 如果是不能获取验证码或者时间已经变成0或者已经注册成功
          if (this.canGetCode === 1 || nowTime < 0 || this.registerTrue) {
            this.canGetCode = 1;
            this.validateStr = '获取验证码';
            // 清空定时器
            this.timeOut = null;
          } else {
            this.timeOut = setTimeout(() => {
              this._waitTime(nowTime);
            }, 1000);
          }
        },
        // 随机生成6位小数
        _sixMath () {
          var arr = [];
          while (arr.length < 6) {
            arr.push(Math.round(Math.random() * 9));
          }
          return arr.join('');
        },
        // 获取验证码
        _getValidateCode () {
          if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return;
          }
          // 判断在用户能否点击
          if (this.canGetCode === 1) {
            // console.log('我正在点击...');
            // 禁止用户再次点击
            this.canGetCode = 0;
            // 生成6位数的验证码
            // this.generatorCode = this._sixMath();
            // console.log(this.generatorCode);
            this.$refs.loading.showLoad();
            this.$store.dispatch('getValidateCode', {mobile: String(this.dataOption.mobile)}).then(res => {
              this.$refs.loading.hideLoad();
              if (res.code === 200) {
                this.registerTrue = false;
                this._showTip('获取验证码成功');
                // 获取验证码成功等待60s
                this._waitTime(60);
              } else {
                this.canGetCode = 1;
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
              }
            });
          }
        },
        // 登录
        _register () {
          if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return false;
          }
          if (this.dataOption.code === '') {
            this._showTip('验证码不能为空');
            return false;
          }
          // if (parseInt(this.dataOption.code) !== parseInt(this.generatorCode)) {
          //   this._showTip('验证码不正确');
          //   return;
          // }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('密码不能少于6位数');
            return false;
          }
          if (this.dataOption.password !== this.dataOption.confirmPassword) {
            this._showTip('两次密码不一致');
            return false;
          }
          if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.recommender)) {
            this._showTip('推荐码必须是3-20位的数字或英文');
            return false;
          }
          this.$refs.loading.showLoad();
          this.$store.dispatch('memberRegister', this.dataOption).then(res => {
            if (res.code === 200) {
              this.$store.dispatch('memberLogin', {username: this.dataOption.mobile, password: this.dataOption.password}).then(rest => {
                this.dataOption = {
                  mobile: '', // 手机号
                  password: '', // 密码
                  confirmPassword: '', // 确认密码
                  code: '', // 手机验证码
                  recommender: '' // 推荐人手机号或编号
                };
                this.registerTrue = true;
                this.$refs.loading.hideLoad();
                if (rest.code === 200) {
                  // 跳转首页
                  this.$router.replace({name: 'home'});
                } else if (rest.code === 500) {
                  this._showTip('服务器内部错误');
                } else {
                  var obj = JSON.parse(rest.data.message);
                  for (var key in obj) {
                    this._showTip(obj[key]);
                    return;
                  }
                }
              });
            } else if (res.code === 500) {
                  this._showTip('服务器内部错误');
            } else {
              this.$refs.loading.hideLoad();
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
          });
        },
        showLoad () {
          this.$refs.loading.showLoad();
        },
        hideLoad () {
          this.$refs.loading.hideLoad();
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
  
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
    color: #c1c1c0; 
  } 
  .register-page
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    // background: url(../assets/login_bg.jpg) no-repeat
    background-size: 100% 100%
    .register-wrapper
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 16rem
      height: 33rem
      margin: auto
      .wel-icon
        display: block
        width: 100%
        height: auto
      .lx-icon
        display: block
        margin: auto
        margin-top: 1rem
        width: 100%
        // position: absolute
        // top: 2rem
        // left: 50%
        // width: 100%
        // margin-left: -50%
        // height: auto
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
        margin-top: 1.2rem
        .list-item
          position: relative
          padding: 0.4rem 0
          margin: 0.2rem 0
          &.border-bottom-1px
            border-bottom-1px(#7f7f7f)
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
            color: #000000
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
          input
            display: inline-block
            width: 96%
            padding: 0 2%
            height: 1.4rem
            line-height: 1.4rem
            font-size: 0.9rem
            color: #333
        .register-btn
          margin-top: 1.4rem
          padding: 0.6rem 0
          width: 100%
          text-align: center
          border-radius: 5px
          font-size: 1rem
          background: #e5cba6
          color: #fff
         .tips-login
          margin-top: 1.8rem;
          font-size: 0.9rem;
          text-align: center
          color: #e5cba6
        .tip
          margin-top: 0.3rem
          padding: 0.5rem 0
          display: block
          width: 100%
          text-align: center
          font-size: 0.9rem
          color: #4aa1fe
          .login-btn
            color: #fff
</style>
