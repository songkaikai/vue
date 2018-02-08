<template>
  <transition name="postshade">
    <div class="post-shade" @click="_searchHide" v-show="showSearch">
      <div class="post-script">
        <i class="trigon-icon"></i>
        <ul class="post-ul">
          <li :class="searchItem.length > index ? 'border-bottom-1px' : ''" v-for="(item, index) in searchItem" @click="_chooseItem(index)">{{ item }}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        // 选择框是否显示
        showSearch: false
      };
    },
    props: {
      searchItem: {
        type: Array
      }
    },
    methods: {
      // 显示插件
      searchShow () {
        this.showSearch = true;
      },
      // 隐藏插件
      _searchHide () {
        this.showSearch = false;
      },
      // 传递当前选中的项(触发父组件的函数)
      _chooseItem (index) {
        this.$emit('chooseItem', index);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .post-shade
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 120
    width: 100%
    height: 100%
    -webkit-transition: all 0.3s
    transition: all 0.3s
    &.postshade-enter-active
      opacity: 1
    &.postshade-enter, &.postshade-leave-active
      opacity: 0
    .post-script
      position: absolute
      top: 40px
      right: 10px
      border-radius: 3px
      background: rgba(0, 0, 0, 0.75)
      .trigon-icon
        position: absolute
        right: 10px
        top: -10px
        width: 0
        height: 0
        border: 5px solid
        overflow: hidden
        border-color: transparent transparent rgba(0, 0, 0, 0.75) transparent
        _border-color: tomato tomato rgba(0, 0, 0, 0.75) tomato
        _filter: chroma(color=tomato)
      li
        position: relative
        padding: 14px 18px
        color: #ccc
        &.border-bottom-1px
          border-bottom-1px(#ccc)
</style>
