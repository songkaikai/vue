<template>
  <div class="jt-edit-page">
    <!-- 遮罩 -->
    <transition name="editshade">
      <div class="shade" v-show="editShow">
        <!--  -->
         <transition name="editwrapper">
          <div class="edit-wrapper" v-show="editShow">
            <p class="title">津贴设置</p>
            <div class="inner-wrapper">
              <div class="list-item">
                <span class="left">用户名</span>
                <div class="right">
                  <input type="text" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">手机号</span>
                <div class="right">
                  <input type="tel" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">比例</span>
                <div class="right">
                  <input type="text" />
                </div>
                <div class="list-item">
                  <span class="left"></span>
                  <div class="right">
                    <span class="edit-btn sure" @click="_submit">确定</span><span class="edit-btn close" @click="_hideEdit">取消</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        editShow: false,
        dataOption: {
          token: ''
        }
      };
    },
    methods: {
      // 显示弹框
      _showEdit () {
        this.editShow = true;
      },
      // 隐藏弹框
      _hideEdit () {
        this.editShow = false;
      },
      // 提交设置
      _submit () {
        this.$emit('showTips', 'ok');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .shade
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 110
    background: rgba(0, 0, 0, 0.5)
    -webkit-transition: all 0.3s
    &.editshade-enter-active
      opacity: 1
    &.editshade-enter,&.editshade-leave-active
      opacity: 0
    .edit-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      z-index: 112
      width: 15.6rem
      height: 17rem
      margin: auto
      border-radius: 5px
      background: #6baae8
      -webkit-transition: all 0.2s
      &.editwrapper-enter-active
        transform: scale(1, 1)
        -webkit-transform: scale(1, 1)
      &.editwrapper-enter,&.editwrapper-leave-active
        transform: scale(1.2, 1.2)
        -webkit-transform: scale(1.2, 1.2)
      .title
        padding: 0.8rem 0
        text-align: center
        color: #fff
        font-size: 1rem
        height: 1rem
        line-height: 1rem
      .inner-wrapper
        padding-top: 2rem
        background: #fff
        height: 12.4rem
        border-radius: 5px
        .list-item
          padding-bottom: 0.6rem
          overflow: hidden
          .left
            float: left
            width: 4rem
            font-size: 0.9rem
            text-align: right
            height: 1.8rem
            line-height: 1.8rem
            color: #282828
          .right
            padding: 0 0.8rem 0 4.6rem
            input
              display: inline-block
              width: 100%
              font-size: 0.9rem
              height: 1.2rem
              line-height: 1.2rem
              padding: 0.3rem 0
              border: 1px solid #ddebf9
              color: #282828
          .edit-btn
            margin-top: 0.6rem
            margin-right: 0.8rem
            display: inline-block
            padding: 0.4rem 0.8rem
            font-size: 0.9rem
            height: 0.9rem
            line-height: 0.9rem
            color: #62a5e7
            border-radius: 3px
            &.sure
              background: #d9e9f9
</style>
