<template>
  <transition name="editgame">
    <div class="edit-game-shade" v-show="editgameShow">
      <div class="edit-game-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="list-item">
              <!-- <div class="page-btn">
                <i class="blue_left_btn" @click="_changePage('prev')"></i><span>{{ dataOption.rechargeMoney }}</span><i class="blue_right_btn" @click="_changePage('next')"></i>
              </div> -->
              <input type="tel" class="add-ipt" v-model="dataOption.rechargeMoney" maxlength="6" placeholder="请输入金额" />
             <!-- <p class="tips">每次增加或减少100</p> -->
            </div>
            <div class="list-item">
              <div class="right-btn">
                <!-- <router-link :to="{name: 'login'}" class="sure-btn">注销</router-link> -->
                <a class="sure-btn" @click="_cz">充值</a>
                <!-- <router-link :to="{name: 'address', params: {id: 'edit'}}" class="sure-btn">收货地址</router-link> -->
                <a class="sure-btn" @click="_recode">记录</a>
              </div>
            </div>
         </div>
      </div>
      <div id="form-data"></div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex';
  import $ from 'jquery';

  export default {
    data () {
      return {
        // 当前是否显示邀请弹框
        editgameShow: false,
        dataOption: {
          token: '', // 会员TOKEN
          rechargeMoney: '' // 充值金额
        },
        moneyCount: 1
      };
    },
    created () {
      this.dataOption.token = this.memberLogin.token;
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    methods: {
      showShade () {
        this.editgameShow = true;
      },
      // 提交数据
      closeShade (str) {
          this.editgameShow = false;
          this.$emit('showMiddle', 'withdraw');
       },
       _changePage (type) {
        if (type === 'next') {
          if (this.dataOption.rechargeMoney < 1500) {
            this.moneyCount ++;
            this.dataOption.rechargeMoney = this.moneyCount * 100;
          }
        } else if (type === 'prev') {
          if (this.dataOption.rechargeMoney > 100) {
            this.moneyCount --;
            this.dataOption.rechargeMoney = this.moneyCount * 100;
          }
        }
       },
       // 切换音乐是否开启
       _changeBgm () {
          // console.log(document.getElementById('myVideo'));
          this.bgm = !this.bgm;
          if (this.bgm) {
            document.getElementById('myVideo').play();
          } else {
            document.getElementById('myVideo').pause();
          }
       },
       // 金币充值
       _cz () {
          // console.log(this.dataOption.rechargeMoney >= 20);
          if (this.dataOption.rechargeMoney < 20) {
            this.$emit('showTip', '充值金额必须大于20');
            return false;
          }
          if (this.dataOption.rechargeMoney > 2000) {
            this.$emit('showTip', '充值金额必须小于2000');
            return false;
          }
          // return false;
          this.$emit('showLoad');
          // 测试
          // this.dataOption.rechargeMoney = 1;
          this.$store.dispatch('xzCz', this.dataOption).then(res => {
            this.$emit('hideLoad');
            // console.log(res.message);
            if (!res.data.code) {
              // console.log(1);
              $('#form-data').append(res.data.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
            } else {
              this.$emit('showTip', '充值失败');
            }
          });
       },
       _recode () {
        this.editgameShow = false;
        // console.log(1);
        this.$emit('otherShow', 'czrecode');
       }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .edit-game-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.editgame-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.editgame-enter, &.editgame-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .edit-game-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 6.5rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .inner-content
        .list-item
          padding: 0.4rem 0
          overflow: hidden
          .tips
            margin-top: 0.8rem
            color: #fff
            text-align: center
            font-size: 0.8rem
          .page-btn
            // margin-top: 0.8rem
            text-align: center
            font-size: 0.9rem
            color: #fff
            span
              display: inline-block
              vertical-align: middle
              width: 4rem
              text-align: center
            i
              display: inline-block
              vertical-align: middle
              margin: 0 0.3rem
              width: 2rem
              height: 2rem
              &.blue_left_btn
                background: url(../../assets/jian_btn.png) center no-repeat
                background-size: 100% 100%
              &.blue_right_btn
                background: url(../../assets/jia_btn.png) center no-repeat
                background-size: 100% 100%
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
              margin-left: 0.6rem
              display: inline-block
              width: 5.4rem
              height: 2.12rem
              text-align: center
              line-height: 2.2rem
              background: url(../../assets/blue_center_btn.png) no-repeat
              background-size: 100% 100%
              font-size: 0.9rem
              color: #fff
              &:active
                -webkit-transform: scale(1.2, 1.2)
            .bgm-edit
              position: relative
              margin-left: 10px
              width: 5rem
              height: 2.3rem
              background: url(../../assets/game_bg_on.png) no-repeat
              background-size: 100% 100%
              a
                position: absolute;
                top: -0.05rem;
                left: -0.55rem;
                height: 2.4rem;
                width: 2.4rem;
                background: url(../../assets/game_bg_btn.png) no-repeat;
                background-size: 100% 100%;
                -webkit-transition: all 0.3s;
                transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.3)
              &.index
                background: url(../../assets/game_bg_off.png) no-repeat
                background-size: 100% 100%
                a
                  left: 3.25rem
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
