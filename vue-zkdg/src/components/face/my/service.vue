<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <p class="up-title">升级服务商</p>
          <div class="detail-wrapper">
            <div class="img-wrapper"><img :src="serverInfo.main_pic" alt=""></div>
            <div class="prod-info">
              <p class="name">{{ serverInfo.goods_name }}</p>
              <p class="price">￥{{ serverInfo.price }}</p>
            </div>
          </div>
          <div class="choose-type border-top-1px">
            <span class="cancel" @click="_cancelChoose">取消</span><span class="submit" @click="_submitChoose">确定</span>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        showBomb: false,
        dataOption: {
          token: '',
          type: 0 // 类型0-服务商产品1-升级渠道商留言
        },
        listOption: {
          token: '',
          id: '' // 当前产品id
        }
      };
    },
    // props: {
    //   bombStr: {
    //     type: String
    //   }
    // },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        serverInfo: state => state.serverInfo
      })
    },
    methods: {
      // 显示弹框
      _showShade () {
        this.$emit('showLoad');
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('postUpgrade', this.dataOption).then(res => {
          this.$emit('hideLoad');
          if (res.code === 1) {
            this.showBomb = true;
            // console.log(res.data);
          } else {
            this.$emit('showTips', res.msg);
          }
        });
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        // this.showBomb = false;
        this.$emit('showLoad');
        this.listOption.token = this.memberLogin.token;
        this.listOption.id = this.serverInfo.id;
        this.$store.dispatch('upgradeServer', this.listOption).then(res => {
          this.$emit('hideLoad');
          this.showBomb = false;
          if (res.code === 1) {
            // this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            // this.$emit('showTips', '升级成功');
            this.$router.push({name: 'orderpay', query: {order_no: res.data.order_no, order_money: res.data.order_money}});
          } else {
            this.$emit('showTips', res.msg);
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../../common/stylus/mixin.styl';

  .bomb-wrapper
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 1000
    background: rgba(0, 0, 0, 0.3)
    -webkit-transition: all 0.3s
    &.bombox-enter-active
      opacity: 1
    &.bombox-enter,&.bombox-leave-active
      opacity: 0
    .bomb-box
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      margin: auto
      width: 15rem
      height: 17.6rem
      border-radius: 8px
      background: #fff
      transition: all 0.2s
      -webkit-transition: all 0.2s
      &.box-enter-active
        transform: scale(1, 1)
        -webkit-transform: scale(1, 1)
      &.box-enter,&.box-leave-active
        transform: scale(1.2, 1.2)
        -webkit-transform: scale(1.2, 1.2)
      .up-title
        position: relative
        padding: 18px 0
        text-align: center
        font-size: 1rem
        color: #333
        border-bottom-1px(#eee)
      .detail-wrapper
        padding: 0.62rem 1rem
        .img-wrapper
          margin-bottom: 0.3rem
          img
            display: block
            width: 8rem
            height: 8rem
            margin: auto
        p
          padding: 0.2rem 0
          font-size: 0.9rem
          &.price
            font-size: 1rem
            color: #4fccdb
      .choose-type
        position: relative
        line-height: 14px
        font-size: 14px
        &.border-top-1px
          border-top-1px(#eee)
        span
          display: inline-block
          padding: 12px 0
          height: 15px
          width: 50%
          text-align: center
        .cancel
          position: relative
          color: #a0a0a0
          border-right-1px(#eee, 0, 100%)
        .submit
          // color: #5197db
          color: #4fccdb
</style>
