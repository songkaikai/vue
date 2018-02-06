<template>
  <div class="followWith" :class="addLen === 0 ? 'none-add' : ''">
    <!-- 判断当前是否已经哟关注的superstar -->
    <div class="wrapper-list" v-if="addLen > 0">
      <!-- 只显示关注的 -->
      <div class="list-item border-bottom-1px" v-for="(item,index) in superStarList" v-if="item.like">
        <div class="avatat" :style="{background: 'url(' + item.picture + ') center center no-repeat', backgroundSize: 'cover' }"></div>
        <div class="main">
          <p class="name">{{item.name}}</p>
          <span class="remove" @click="_remove(item.id)">remove</span>
        </div>
      </div>
    </div>
    <div class="none-msg" v-else>
      <i class="icon-crying"></i><span>You haven't paid attention to any superstars yet!!!</span>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      // 获取vuex状态树里面的数据
      ...mapState({
        superStarList: state => state.superStarList,
        addLen: state => state.addLen
      })
    },
    created () {
      // console.log(this.superStarList);
      // console.log(this.addLen);
    },
    methods: {
      _remove (id) {
        this.$store.dispatch('changeAdd', id);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .followWith
    position: absolute
    top: 0
    left: 0
    width: 100%
    padding-bottom: 52px
    .list-item
      position: relative
      padding: 15px
      overflow: hidden
      &.border-bottom-1px
        border-bottom-1px(#ccc)
      .avatat
        float: left
        width: 80px
        height: 80px
        border-radius: 3px
      .main
        padding-left: 95px
        .name
          padding: 8px 0 16px 0
          font-size: 18px
        .remove
          display: inline-block
          padding: 5px 8px 7px 8px
          border-radius: 3px
          border: 1px solid red
          font-size: 14px
          // line-height: 12px
          color: red
  .none-add
    top: 0
    bottom: 52px
    left: 0
    right: 0
    .none-msg
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      width: 250px
      height: 60px
      margin: auto
      font-size: 18px
      line-height: 20px
      color: #333
      i
        display: inline-block
        margin-right: 3px
</style>
