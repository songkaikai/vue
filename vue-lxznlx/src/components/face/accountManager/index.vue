<template>
  <div class="account-manager-page">
    <div class="active-wrapper border-bottom-1px" :class="[chooseType !== 8 ? 'margin-bottom': '']">
      <div class="left-pic">
        <img src="./center_icon_six.png" alt="" />
      </div>
      <div class="right">
        <p class="title">编辑资料  <span @click="_chooseType(8)">修改</span></p>
      </div>
    </div>
    <div class="edit-wrapper" v-if="chooseType === 8">
      <div class="inner-wrapper">
        <div class="list-item">
          <span class="name">昵称</span>
          <div class="ipt">
            <input type="text" v-model="infoOption.nickName" @input="filter('nickName', 'infoOption')" maxlength="6" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">真实姓名</span>
          <div class="ipt">
            <input type="text" v-model="infoOption.trueName" @input="filter('trueName', 'infoOption')" maxlength="6" />
          </div>
        </div>
        <!-- <div class="list-item">
          <span class="name">内网地址</span>
          <div class="ipt">
            <input type="text" v-model="innerAddress" id="cpbtn" maxlength="100" /> -->
            <!-- <span style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:20;"></span> -->
            <!-- <span class="copy-btn" data-clipboard-action="copy" data-clipboard-target="#cpbtn">复制</span> -->
            <!-- <span class="copy-btn" @click="_copy">复制</span> -->
            <!-- <span class="copy-btn" v-clipboard="innerAddress">复制</span> -->
         <!--  </div>
        </div> -->
        <!-- <div class="list-item">
          <span class="name">外网地址</span>
          <div class="ipt">
            <input type="text" v-model="infoOption.outAddress" @input="filter('outAddress', 'infoOption')" maxlength="100" />
          </div>
        </div> -->
        <!-- <div class="list-item">
          <span class="name">自动复投</span>
          <div class="ipt">
            <div class="sub-btn" @click="_changeChoose(1)"><i class="choose-icon" :class="[infoOption.isAuto === 1 ? 'index' : '']"></i><span>是</span></div>
            <div class="sub-btn" @click="_changeChoose(0)"><i class="choose-icon" :class="[infoOption.isAuto === 0 ? 'index' : '']"></i><span>否</span></div>
          </div>
        </div> -->
        <div class="list-item">
          <span class="name"></span>
          <div class="ipt">
            <div class="submit-btn" @click="_infoSubmit">确定</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改昵称 -->
    <!-- <div class="active-wrapper border-bottom-1px" :class="[chooseType !== 0 ? 'margin-bottom': '']">
      <div class="left-pic">
        <img src="./center_icon_five.png" alt="" />
      </div>
      <div class="right">
        <p class="title">昵称  <span @click="_chooseType(0)">修改</span></p>
      </div>
    </div>
    <div class="edit-wrapper" v-if="chooseType === 0">
      <div class="inner-wrapper">
        <div class="list-item">
          <span class="name">昵称</span>
          <div class="ipt">
            <input type="text" v-model="nameOption.nickName" @input="filter('nickName', 'nameOption')" maxlength="6" />
          </div>
        </div>
        <div class="list-item">
          <span class="name"></span>
          <div class="ipt">
            <div class="submit-btn" @click="_nameSubmit">确定</div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="active-wrapper border-bottom-1px" :class="[chooseType !== 1 ? 'margin-bottom': '']">
      <div class="left-pic">
        <img src="./center_icon_one.png" alt="" />
      </div>
      <div class="right">
        <p class="title">登录密码  <span @click="_chooseType(1)">修改</span></p>
        <p class="content">登录蓝享智能物联网账户时需要输入的密码</p>
      </div>
    </div>
    <!-- 修改密码显示 -->
    <div class="edit-wrapper" v-if="chooseType === 1">
      <div class="inner-wrapper">
        <div class="list-item">
          <span class="name">旧密码</span>
          <div class="ipt">
            <input type="password" v-model="passwordOption.oldPassword" @input="filter('oldPassword', 'passwordOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">新密码</span>
          <div class="ipt">
            <input type="password" v-model="passwordOption.newPassword" @input="filter('newPassword', 'passwordOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">重复新密码</span>
          <div class="ipt">
            <input type="password" v-model="passwordOption.newPasswordConfirm" @input="filter('newPasswordConfirm', 'passwordOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name"></span>
          <div class="ipt">
            <div class="submit-btn" @click="_passSubmit">确定</div>
          </div>
        </div>
      </div>
    </div>
    <div class="active-wrapper border-bottom-1px" :class="[chooseType !== 2 ? 'margin-bottom': '']">
      <div class="left-pic">
        <img src="./center_icon_two.png" alt="" />
      </div>
      <div class="right">
        <p class="title">交易密码  <span @click="_chooseType(2, 'edit')">修改</span> <span @click="_chooseType(2, 'forget')">忘记密码</span></p>
        <p class="content">保证您在蓝享智能物联网平台的交易安全，请妥善保管，勿使用 银行卡支付密码或生日作为密码</p>
      </div>
    </div>
    <!-- 修改交易密码 -->
    <div class="edit-wrapper" v-if="chooseType === 2 && payType === 1">
      <div class="inner-wrapper">
        <div class="list-item">
          <span class="name">旧密码</span>
          <div class="ipt">
            <input type="password" v-model="payOption.oldPass" @input="filter('oldPass', 'payOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">新密码</span>
          <div class="ipt">
            <input type="password" v-model="payOption.password" @input="filter('password', 'payOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">重复新密码</span>
          <div class="ipt">
            <input type="password" v-model="payOption.confirmPass" @input="filter('confirmPass', 'payOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name"></span>
          <div class="ipt">
            <div class="submit-btn" @click="_paySubmit">确定</div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-wrapper" v-if="chooseType === 2 && payType === 2">
      <div class="inner-wrapper">
        <div class="list-item">
          <span class="name">手机号</span>
          <div class="ipt">
            <input type="tel" v-model="exchangeOption.mobile" @input="filter('mobile', 'exchangeOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">验证码</span>
          <div class="ipt">
            <input type="tel" v-model="editPayOption.code" @input="filter('code', 'editPayOption')" maxlength="6" />
            <span class="validate-icon" @click="_getValidateCode">{{ validateStr }}</span>
          </div>
        </div>
        <div class="list-item">
          <span class="name">新密码</span>
          <div class="ipt">
            <input type="password" v-model="editPayOption.password" @input="filter('password', 'editPayOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name">重复新密码</span>
          <div class="ipt">
            <input type="password" v-model="editPayOption.confirmPass" @input="filter('confirmPass', 'editPayOption')" maxlength="18" />
          </div>
        </div>
        <div class="list-item">
          <span class="name"></span>
          <div class="ipt">
            <div class="submit-btn" @click="_forgetPassSubmit">确定</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 钱包。手机绑定 -->
    <!-- <div class="active-wrapper border-bottom-1px" :class="[chooseType !== 3 ? 'margin-bottom': '']">
      <div class="left-pic">
        <img src="./center_icon_three.png" alt="" />
      </div>
      <div class="right">
        <p class="title">电子钱包绑定  <span>已绑定</span></p>
        <p class="content">保证账户与资金安全，请使用本人真实信息，提现时账户 信息与姓名需一致</p>
      </div>
    </div>
    <div class="active-wrapper" :class="[chooseType !== 4 ? 'margin-bottom': '']" >
      <div class="left-pic">
        <img src="./center_icon_four.png" alt="" />
      </div>
      <div class="right">
        <p class="title">手机号码绑定  <span>151****3775</span></p>
        <p class="content">绑定手机，账户资金变动实时通知</p>
      </div>
    </div> -->
    <div class="logout-btn" @click="_logout">退出登录</div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import bombBox from 'components/plugins/bombBox';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        bombStr: '您确定要退出登录吗？',
        payType: 0, // 1显示修改交易密码2显示忘记密码
        tipsStr: '', // 错误提示字段
        chooseType: -1, // 当前选中显示的区域-1为全部都不显示
        passwordOption: {
          token: '', // 会员TOKEN
          oldPassword: '', // 原密码
          newPassword: '', // 新密码
          newPasswordConfirm: '' // 确认新密码
        },
        nameOption: {
          token: '', // 会员TOKEN
          nickName: '' // 会员昵称
        },
        // 设置会员的基本信息
        infoOption: {
          token: '', // 会员TOKEN
          nickName: '', // 会员昵称
          trueName: '', // 会员真实姓名
          outAddress: '', // 外网地址
          isAuto: '' // 是否自动复投
        },
        innerAddress: '', // 内网地址
        // 修改交易密码
        payOption: {
          token: '', // 会员token
          oldPass: '', // 原密码
          password: '', // 新密码
          confirmPass: '' // 确认密码
        },
        // 忘记交易密码
        editPayOption: {
          token: '', // 会员token
          code: '', // 手机验证码
          password: '', // 新密码
          confirmPass: '' // 确认密码
        },
        // 获取交易密码的手机验证码
        exchangeOption: {
          token: '', // 会员token
          mobile: '' // 存储手机号的地方
        },
        registerTrue: false, // 当前是否注册成功true为成功
        canGetCode: 1, // 能否再次获取验证码
        validateStr: '获取验证码', // 验证码提示字段
        generatorCode: '', // 前端生成的6位数验证码
        timeOut: null // 清空定时器
      };
    },
    created () {
      this.$nextTick(() => {
        this.infoOption = {
          token: this.memberLogin.token, // 会员TOKEN
          nickName: this.memberInfo.nick_name, // 会员昵称
          trueName: this.memberInfo.true_name, // 会员真实姓名
          outAddress: this.memberInfo.outaddress, // 外网地址
          isAuto: parseInt(this.memberInfo.is_auto) // 是否自动复投
        };
        this.innerAddress = this.memberInfo.myaddress;
        // this.innerAddress = 'http://www.baidu.com';
        this.nameOption = {
          token: this.memberLogin.token, // 会员TOKEN
          nickName: this.memberInfo.nick_name // 会员昵称
        };
      });
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo
    }),
    methods: {
      _copy () {
        this._showTip('复制成功');
        // 复制内网
        // this.$clipboard(this.memberInfo.myaddress);
        this.$clipboard('http://www.baidu.com');
      },
      _chooseType (type, str) {
        if (this.chooseType === type) {
          this.chooseType = -1;
        } else {
          if (str !== '') {
            this.payType = str === 'edit' ? 1 : 2;
            // console.log(this.payType);
          }
          this.chooseType = type;
        }
      },
      // 更改是否自动复投
      _changeChoose (type) {
        if (this.infoOption.isAuto !== type) {
          this.infoOption.isAuto = type;
        }
      },
      // 提交个人资料
      _infoSubmit () {
        if (this.infoOption.nickName === '') {
          this._showTip('昵称不能为空');
          return;
        }
        if (!this.infoOption.trueName) {
          this._showTip('真实姓名为空');
          return;
        }
        if (this.infoOption.outAddress === '') {
          this._showTip('外网地址不能为空');
          return;
        }
        // 提交资料
        this.$refs.loading.showLoad();
        this.$store.dispatch('editInfo', this.infoOption).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this._showTip('修改成功');
             } else {
                // console.log(JSON.parse(resolve.data.message));
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
          });
      },
      // 修改密码提交
      _passSubmit () {
         if (!/^\w{6,18}$/.test(this.passwordOption.oldPassword)) {
            this._showTip('旧密码不能少于6位数');
            return;
          }
          if (!/^\w{6,18}$/.test(this.passwordOption.newPassword)) {
            this._showTip('新密码不能少于6位数');
            return;
          }
          if (this.passwordOption.newPassword !== this.passwordOption.newPasswordConfirm) {
            this._showTip('两次密码不一致');
            return;
          }
          // 验证通过提交
          this.passwordOption.token = this.memberLogin.token;
          this.$refs.loading.showLoad();
          this.$store.dispatch('editPassword', this.passwordOption).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this._showTip('登录密码修改成功');
                this.passwordOption = {
                    token: '', // 会员TOKEN
                    oldPassword: '', // 原密码
                    newPassword: '', // 新密码
                    newPasswordConfirm: '' // 确认新密码
                };
             } else {
                // console.log(JSON.parse(resolve.data.message));
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
          });
      },
      // 修改昵称
      _nameSubmit () {
        if (this.nameOption.nickName === '') {
          this._showTip('昵称不能为空');
          return;
        }
        // 提交数据
        this.nameOption.token = this.memberLogin.token;
        this.$refs.loading.showLoad();
        this.$store.dispatch('editNickName', this.nameOption).then((res) => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this._showTip('昵称修改成功');
            this.nameOption = {
              token: '', // 会员TOKEN
              nickName: '' // 会员昵称
            };
          } else {
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
          }
        });
      },
      // 修改交易密码
      _paySubmit () {
         if (!/^\w{6,18}$/.test(this.payOption.oldPass)) {
            this._showTip('旧密码不能少于6位数');
            return;
          }
          if (!/^\w{6,18}$/.test(this.payOption.password)) {
            this._showTip('新密码不能少于6位数');
            return;
          }
          if (this.payOption.password !== this.payOption.confirmPass) {
            this._showTip('两次密码不一致');
            return;
          }
          // 验证通过提交
          this.payOption.token = this.memberLogin.token;
          this.$refs.loading.showLoad();
          this.$store.dispatch('payPassword', this.payOption).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this._showTip('交易密码修改成功');
                this.payOption = {
                    token: '', // 会员TOKEN
                    oldPass: '', // 原密码
                    password: '', // 新密码
                    confirmPass: '' // 确认新密码
                };
             } else {
                // console.log(JSON.parse(resolve.data.message));
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
          });
      },
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
          if (!/^1[34578]\d{9}$/.test(this.exchangeOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return;
          }
          // 判断在用户能否点击
          if (this.canGetCode === 1) {
            // console.log('我正在点击...');
            // 禁止用户再次点击
            this.canGetCode = 0;
            // 生成6位数的验证码
            this.generatorCode = this._sixMath();
            // console.log(this.generatorCode);
            this.$refs.loading.showLoad();
            this.exchangeOption.token = this.memberLogin.token;
            this.$store.dispatch('getExchangeCode', this.exchangeOption).then(res => {
              this.$refs.loading.hideLoad();
              if (!res.data.code) {
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
      // 忘记交易密码
      _forgetPassSubmit () {
         if (!/^1[34578]\d{9}$/.test(this.exchangeOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return;
          }
          if (this.editPayOption.code === '') {
            this._showTip('验证码不能为空');
            return;
          }
          if (this.editPayOption.code === this.generatorCode) {
            this._showTip('验证码不正确');
            return;
          }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.editPayOption.password)) {
            this._showTip('交易密码不能少于6位数');
            return;
          }
          if (this.editPayOption.password !== this.editPayOption.confirmPass) {
            this._showTip('两次交易密码不一致');
            return;
          }
          // 验证通过。交易密码提交
           this.$refs.loading.showLoad();
           this.editPayOption.token = this.memberLogin.token;
           this.$store.dispatch('editExchangeCode', this.editPayOption).then(res => {
              this.$refs.loading.hideLoad();
              if (!res.data.code) {
                this._showTip('交易密码设置成功');
                this.editPayOption = {
                  token: '', // 会员token
                  code: '', // 手机验证码
                  password: '', // 新密码
                  confirmPass: '' // 确认密码
                };
                this.exchangeOption = {
                  token: '', // 会员token
                  mobile: '' // 存储手机号的地方
                };
                this.registerTrue = true;
              } else {
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
              }
           });
      },
      // 退出登录
      _logout () {
        this.$refs.bombbox._showBomb();
      },
      // 弹框确认以后的操作
      submitMsg () {
        // 退出登录
        this.$router.replace({name: 'login'});
        // this.$store.dispatch('logout', {token: this.memberLogin.token}).then(res => {
        //   if (!res.data.code) {
        //     this.$router.replace({name: 'login'});
        //   } else {
        //       var obj = JSON.parse(res.data.message);
        //       for (var key in obj) {
        //         this._showTip(obj[key]);
        //         return;
        //       }
        //   }
        // });
      },
      filter (str, type) {
          this[type][str] = this[type][str].replace(/\s/g, '');
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
      tips,
      bombBox
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .account-manager-page
    padding-bottom: 4rem
    .active-wrapper
        position: relative
        padding: 0.7rem 1rem
        background: #fff
        overflow: hidden
        &.margin-bottom
          margin-bottom: 0.4rem
        .left-pic
          float: left
          width: 3.5rem
          height: 3.5rem
          img
            display: block
            width: 3.5rem
            height: 3.5rem
        .right
          padding: 0 0 0 3.8rem
          font-size: 0.9rem
          .title
            margin-top: 0.45rem
            color: #1d1d1d
            span
              color: #015cad
          .content
            margin-top: 0.2rem
            line-height: 0.9rem
            font-size: 0.7rem
            color: #838383
    .logout-btn
      width: 80%
      margin: auto
      margin-top: 2rem
      text-align: center
      padding: 0.5rem 0
      color: #fff
      border-radius: 4px
      font-size: 0.9rem
      line-height: 1rem
      background: #015cad
    .edit-wrapper
      padding: 0 1rem
      .inner-wrapper
        padding: 0.8rem 0
        background: #d9e9f9
        .list-item
          padding: 0.2rem 0
          overflow: hidden
          color: #1e1e1e
          .name
            float: left
            width: 5.6rem
            text-align: right
            height: 1.8rem
            line-height: 1.8rem
            font-size: 0.9rem
          .ipt
            position: relative
            padding: 0 0.8rem 0 6rem
            // overflow: hidden
            .copy-btn
              position: absolute
              top: 0
              right: 0.8rem
              height: 1.8rem
              line-height: 1.8rem
              font-size: 0.8rem
              z-index: 66
              background: #68a2f4
              color: #fff
              width: 3rem
              text-align: center
              border-top-right-radius: 3px
              border-bottom-right-radius: 3px
            .sub-btn
              float: left
              padding-top: 0.3rem
              width: 50%
              .choose-icon
                display: inline-block
                vertical-align: middle
                width: 1.2rem
                height: 1.2rem
                margin-right: 0.2rem
                background: url(./choose_index.png) center no-repeat
                background-size: 100% 100%
                &.index
                  background: url(./choose_index_icon.png) center no-repeat
                  background-size: 100% 100%
              span
                display: inline-block
                vertical-align: middle
                height: 1.2rem
                line-height: 1.2rem
                font-size: 0.9rem
            input
              display: inline-block
              width: 90%
              padding: 0.3rem 5%
              height: 1.2rem
              line-height: 1.2rem
              font-size: 0.9rem
              background: #fff
              border-radius: 3px
          .validate-icon
            position: absolute
            top: 0
            right: 0.8rem
            width: 6rem
            text-align: center
            border-left: 1px solid #eee
            height: 1.8rem
            font-size: 0.8rem
            line-height: 1.8rem
          .submit-btn
            width: 5rem
            text-align: center
            background: #68a2f4
            color: #fff
            border-radius: 4px
            padding: 0.5rem 0
            font-size: 0.9rem
</style>
