<template>
  <transition name="editgame">
    <div class="edit-game-shade" v-show="editgameShow">
      <div class="edit-game-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="list-item">
              <span class="left">音乐：</span>
              <!-- 当前音乐是否开启 -->
              <div class="right-wrapper">
                <div class="bgm-edit" :class="[bgm ? 'index' : '']" @click="_changeBgm">
                  <a></a>
                </div>
              </div>
            </div>
            <div class="list-item">
              <div class="right-btn">
                <!-- <router-link :to="{name: 'login'}" class="sure-btn">注销</router-link> -->
                <a class="sure-btn" @click="_logout">注销</a>
                <!-- <router-link :to="{name: 'address', params: {id: 'edit'}}" class="sure-btn">收货地址</router-link> -->
                <router-link :to="{name: 'addresslist'}" class="sure-btn">收货地址</router-link>
              </div>
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
        editgameShow: false,
        bgm: true
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      isApp: state => state.isApp
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
       // 退出登录
       _logout () {
          // this.$store.dispatch('logout', {token: this.memberLogin.token}).then(() => {
          this.$store.dispatch('logout').then(() => {
            this.$router.replace({name: 'login', query: {isApp: this.isApp === 0 ? '1' : '0'}});
          });
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
      height: 7rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .inner-content
        .list-item
          padding: 0.8rem 0
          overflow: hidden
          .left
            float: left
            width: 5rem
            height: 2.3rem
            line-height: 2.3rem
            text-align: right
            font-size: 0.9rem
            color: #fff
          .right-wrapper
            padding: 0 0 0 5rem
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
