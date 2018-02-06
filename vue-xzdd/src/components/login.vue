<template>
    <div class="login-page">
        <div class="shade-bg" :class="[alreadyShow ? 'bg-img' : '']">
          <div class="inner-content">
            <!-- 登录信息 -->
            <div class="member-login">
            <!-- 血战图标 -->
            <div class="head-img">
              <img src="../assets/xzdd_icon.png" alt="">
            </div>
            <div v-show="alreadyShow">
                <div class="list-item">
                  <input type="tel" v-model="login.username" @input="filter('username')" class='add-ipt' maxlength="16" placeholder="手机号" />
                </div>
                <div class="list-item">
                  <input type="password" v-model="login.password" @input="filter('password')" class='add-ipt' maxlength="18" placeholder="密码" />
                </div>
                <div class="sure-btn" @click="_login">登录</div>
                <div class="sure-btn" @click="_test3">test</div>
                <!-- <a href="" class="forget">忘记密码</a> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 注册页 -->
        <!-- <router-link :to="{name: 'invitePage', query: {uid: '8080'}}" class="return-btn"><span>注册</span><i></i></router-link> -->
        <!-- <router-link :to="{name: 'invitePage'}" class="return-btn"><span>注册</span><i></i></router-link> -->
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
          login: {
            username: '13819445301',
            password: '111111'
          },
          imgsArr: [
            'add_ress_icon.png',
            'jian_btn.png',
            'invite_head_pic.png',
            'invite_index_bg.jpg',
            'xzdds_icon.png',
            'jia_btn.png',
            'address_delete.png',
            'address_edit.png',
            'address_title.png',
            'blue_center_btn.png',
            'blue_left_btn.png',
            'blue_right_btn.png',
            'bottom_active_icon.png',
            'bottom_exchange_icon.png',
            'bottom_hobby_icon.png',
            'bottom_invite_icon.png',
            'bottom_tx_icon.png',
            'box_no_blue.png',
            'prod_buy_btn.png',
            'box_yes_ready_yellow.png',
            'box_yes_yellow.png',
            'bx_count_icon.png',
            'choose_has_btn.png',
            'choose_no_btn.png',
            'close_btn_icon.png',
            'count_bg.png',
            'count_lang_bg.png',
            'game_bg_btn.png',
            'game_bg_off.png',
            'game_bg_on.png',
            'gold_count_icon.png',
            'gold_title.png',
            'green_shade_icon.png',
            'index_member_icon.png',
            'index_public_icon.png',
            'index_xuezhan_icon.png',
            'jb_icon.png',
            'jf_title.png',
            'laba_icon.png',
            'moke_head_01.jpg',
            'money_count_icon.png',
            'out_edit_icon.png',
            'shade_bg.png',
            'sure_btn_icon.png',
            'team_title.png',
            'wl_title.png',
            'xz_bg.jpg',
            'name_icon.png',
            'phone_icon.png',
            'address_icon.png',
            'refurbish_icon.png',
            'prods_title.png',
            'index_puba_icon.png',
            'index_pubb_icon.png',
            'prod_title_name.png',
            'moke_prod_100.png',
            'daoshi_icon.png',
            'boxGif.gif',
            'xzdd_icon.png'
          ],
          // 已经加载的图片数量
          imgCount: 0
        };
      },
      created () {
        // console.log(this.$route.query.isApp);
        // 判断当前是不是app登录
        if (this.$route.query.isApp === '1') {
          // alert(1);
          this.$store.dispatch('isApp', {type: 0});
        } else {
          this.$store.dispatch('isApp', {type: 1});
        }
        this.$nextTick(() => {
          this._loadImg();
        });
      },
      methods: {
        _test () {
          this.$store.dispatch('test', {name: 's2k', age: '12'}).then(res => {
            // alert(1);
            console.log(res);
          });
        },
        _test3 () {
          this.$store.dispatch('test3', {username: 's2k', password: '12', 'authKey': '1'}).then(res => {
            // alert(1);
            console.log(res);
          });
        },
        // 预加载图片
        _loadImg () {
          var self = this;
          this.$refs.loading.showLoad();
          var len = this.imgsArr.length;
          for (var i = 0; i < len; i++) {
            var imgObj = new Image();
            imgObj.onload = function () {
              // console.log(self.imgCount);
              if (self.imgCount >= len - 1) {
                  self.$refs.loading.hideLoad();
                  self.alreadyShow = true;
               }
               self.imgCount ++;
            };
            imgObj.onerror = function () {
              if (self.imgCount >= len - 1) {
                  self.$refs.loading.hideLoad();
                  self.alreadyShow = true;
               }
               self.imgCount ++;
            };
            imgObj.src = require('../assets/' + this.imgsArr[i]);
          }
        },
        _login () {
          // 验证手机号码
          if (!/^\d{1,16}$/.test(this.login.username)) {
            this._showTip('手机号码格式错误');
            return;
          }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.login.password)) {
            this._showTip('密码不能少于6位数');
            return;
          }
          // 通过验证进行提交
          this.$refs.loading.showLoad();
          this.$store.dispatch('loginMember', this.login).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
               document.getElementById('myVideo').play();
               // 转跳收获地址页面
               this.$router.replace({name: 'address', params: {id: 'add'}});
               // 跳转首页
               // this.$router.replace({name: 'index'});
             } else {
              // console.log(JSON.parse(resolve.data.message));
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
          this.login[str] = this.login[str].replace(/\s/g, '');
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
      right: 1rem
      color: #fff
      font-size: 0.8rem
      i
        display: inline-block
        vertical-align: middle
        margin: 0 0.3rem
        width: 1.8rem
        height: 1.8rem
        background: url(../assets/blue_right_btn.png) center no-repeat
        background-size: 100% 100%
    .shade-bg
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      padding-top: 1.5rem
      width: 16rem
      height: 10rem
      margin: auto
      &.bg-img
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
