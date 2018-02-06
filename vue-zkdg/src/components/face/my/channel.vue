<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <p class="up-title">升级渠道商</p>
          <div class="detail-wrapper">
            <div class="list-item">
              <input type="tel" v-model="dataOption.phone" @input="filter('phone')" placeholder="手机号" />
            </div>
            <div class="list-item">
              <textarea v-model="dataOption.content" @input="filter('content')" placeholder="留言..."></textarea>
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
          type: 1, // 类型0-服务商产品1-升级渠道商留言
          phone: '', // 联系电话
          content: '' // 留言内容
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
        memberLogin: state => state.memberLogin
      })
    },
    methods: {
      // 显示弹框
      _showShade () {
        this.showBomb = true;
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        if (!/^1[34578]\d{9}$/.test(this.dataOption.phone)) {
          this.$emit('showTips', '请输入正确的手机格式');
          return false;
        }
        if (this.dataOption.content === '') {
          this.$emit('showTips', '留言不能为空');
          return false;
        }
        this.$emit('showLoad');
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('postUpgrade', this.dataOption).then(res => {
          this.$emit('hideLoad');
          this.showBomb = false;
          if (res.code === 1) {
            this.dataOption.phone = '';
            this.dataOption.content = '';
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this.$emit('showTips', '升级成功');
          } else {
            this.$emit('showTips', res.msg);
          }
        });
      },
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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
        padding: 0.8rem 1rem
        .list-item
          margin: 0.5rem 0
          padding: 0.4rem 0.8rem
          border: 1px solid #eee
          border-radius: 4px
          input
            display: inline-block
            width: 100%
            font-size: 0.8rem
            height: 1rem
            line-height: 1rem
          textarea
            display: inline-block
            width: 100%
            font-size: 0.8rem
            height: 6rem
            line-height: 1rem
            resize: none
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
