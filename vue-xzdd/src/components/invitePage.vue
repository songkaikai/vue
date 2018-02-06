<template>
    <div class="login-page">
        <div class="shade-bg">
          <div class="inner-content">
            <!-- 登录信息 -->
            <div class="member-login">
            <!-- 血战图标 -->
            <!-- <div class="head-img">
              <img src="../assets/xzdd_icon.png" alt="">
            </div> -->
            <div>
                <div class="list-item">
                  <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" class='add-ipt' maxlength="16" placeholder="手机号" />
                </div>
                <div class="list-item">
                  <input type="password" v-model="dataOption.password" @input="filter('password')" class='add-ipt' maxlength="18" placeholder="密码" />
                </div>
                <div class="list-item">
                  <input type="password" v-model="dataOption.confirmPassword" @input="filter('confirmPassword')" class='add-ipt' maxlength="18" placeholder="重复密码" />
                </div>
                <div class="list-item">
                  <input type="text" v-model="dataOption.trueName" @input="filter('trueName')" class='add-ipt' maxlength="4" placeholder="昵称" />
                </div>
                <div class="list-item">
                  <input type="text" v-model="dataOption.recommName" @input="filter('recommName')" class='add-ipt' maxlength="18" placeholder="推荐人手机号或编号" />
                </div>
                <div class="sure-btn" @click="_register">注册</div>
                <!-- <a href="" class="forget">忘记密码</a> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 返回登录 -->
        <!-- <router-link :to="{name: 'login'}" class="return-btn"><i></i><span>登录</span></router-link> -->
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
          alreadyShow: false,
          // 小弹框里面的字段存储的地方13588888888。。55555555
          tipsStr: '',
          dataOption: {
            mobile: '', // 手机号
            password: '', // 密码
            confirmPassword: '', // 确认密码
            trueName: '', // 真实姓名
            recommName: '' // 推荐人手机号或编号
          },
          // 用户手机号
          uname: '',
          pwdAgain: ''
        };
      },
      created () {
        if (this.$route.query.uname !== undefined) {
          // this.dataOption.recommName = this.$route.query.uid;
          // this.uname = this.$route.query.uname;
          this.dataOption.recommName = this.$route.query.uname;
        }
        // console.log(this.$route.query.uid);
        // this.$nextTick(() => {
        //   this._loadImg();
        // });
      },
      methods: {
        // 邀请注册
        _register () {
          // 验证手机号码
          if (!/^\d{1,16}$/.test(this.dataOption.mobile)) {
            this._showTip('手机号码格式错误');
            return;
          }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('密码不能少于6位数');
            return;
          }
          if (this.dataOption.password !== this.dataOption.confirmPassword) {
            this._showTip('两次密码不一致');
            return;
          }
          if (this.dataOption.trueName === '') {
            this._showTip('昵称不能为空');
            return;
          }
          if (this.dataOption.recommName === '') {
            this._showTip('推荐人不能为空');
            return;
          }
          // console.log(this.dataOption);
          // 通过验证进行提交
          this.$refs.loading.showLoad();
          this.$store.dispatch('memberRegister', this.dataOption).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this._showTip('注册成功');
                this.dataOption = {
                  mobile: '', // 手机号
                  password: '', // 密码
                  confirmPassword: '', // 确认密码
                  trueName: '', // 真实姓名
                  recommName: '' // 推荐人手机号或编号
                };
                this.uname = '';
                // 下载页
                this.$router.push({name: 'loadPage'});
             } else {
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
          });
          // setTimeout(() => {
          //   this.$refs.loading.hideLoad();
          //   this.$router.replace({ name: 'address' });
          // }, 1500);
        },
        // 过滤空格
        filter (str) {
          // console.log(this.dataOption[str]);
          this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        },
        /**
        * [_showTip description] 显示提示框
        * @param  {[type]} str [传到提示框的字段]
        * @return {[type]}     [description]
        */
        _showTip (str) {
          this.tipsStr = str;
          this.$refs.tips.showTips();
        }
      },
      components: {
        loading,
        tips
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../common/stylus/mixin.styl';

  .login-page
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .return-btn
      position: absolute
      bottom: 1rem
      left: 1rem
      color: #fff
      font-size: 0.8rem
      i
        display: inline-block
        vertical-align: middle
        margin: 0 0.3rem
        width: 1.8rem
        height: 1.8rem
        background: url(../assets/blue_left_btn.png) center no-repeat
        background-size: 100% 100%
    .shade-bg
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      padding-top: 1.5rem
      width: 16rem
      height: 18.5rem
      margin: auto
      background: url(../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .login-btn
        display: block
        padding: 10px 0
        width: 100%
        margin-top: 15px
        border-radius: 25px
        text-align: center
        background: #ff991d
        color: #fff
      .forget
        float: right
        margin: 18px 10px 0 0
        color: #666
      .member-login
        position: relative
        padding: 0 20px
        .head-img
          position: absolute
          top: -8.9rem
          left: 0
          width: 100%
          img
            display: block
            width: 14rem
            height: auto
            margin: 1rem auto
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
          width: 6.6rem
          height: 2.12rem
          margin: auto
          text-align: center
          line-height: 2.1rem
          margin-top: 0.6rem
          background: url(../assets/sure_btn_icon.png) no-repeat
          background-size: 100% 100%
          font-size: 0.9rem
          color: #fff
          &:active
            transform: scale(1.2, 1.2)
</style>
