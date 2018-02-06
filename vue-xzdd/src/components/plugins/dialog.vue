<template>
  <transition name="dialog">
    <div class="data-dialog" v-if="dialog">
      <div class="ui-dialog">
        <ul>
          <li @click="_cancel">取消</li>
          <li class="sure-btn" @click="_submit">确定</li>
        </ul>
        <div class="ui-confirm-title">
          <div class="ui-scroller-mask">
            <div class="ui-scroller">
              <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
                <dl i-data="0" style="top: 30px" ref="first">
                  <dd pid="0" :i-data="item.region_id" class="" v-for="(item, index) in nationalRegion">{{ item.region_name }}</dd>
                </dl>
              </div>
              <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
                <dl i-data="1" style="top: 30px" ref="second">
                  <dd pid="1" :i-data="item.region_id" class="" v-for="(item, index) in nationalCity">{{ item.region_name }}</dd>
                </dl>
              </div>
              <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
                <dl i-data="2" style="top: 30px" ref="third">
                  <dd pid="2" :i-data="item.region_id" class="" v-for="(item, index) in nationalArea">{{ item.region_name }}</dd>
                </dl>
              </div>
            </div>
            <!-- 两条遮罩线 -->
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  // import { mapState } from 'vuex';

  export default {
    data () {
      return {
        dialog: false,
        parentTop: 0,
        // 存储当前省市区的下标
        indexStr: '',
        // 存储全部当前省市区字段
        areaStr: [],
        // 存储当前省市区坐标的id
        areaArr: [],
        nationalCity: [],
        nationalArea: []
      };
    },
    methods: {
      _showDialog (areaStr) {
        // console.log(areaStr === '');
        this.dialog = true;
        this.$nextTick(() => {
          if (areaStr === '') {
            this.nationalCity = this.nationalRegion[0].son;
            this.nationalArea = this.nationalRegion[0].son[0].pson;
            this.indexStr = this.nationalRegion[0].son[0].pson[0].region_id;
            this.areaStr[0] = this.nationalRegion[0].region_name;
            this.areaStr[1] = this.nationalRegion[0].son[0].region_name;
            this.areaStr[2] = this.nationalRegion[0].son[0].pson[0].region_name;
          } else {
            this.areaArr = areaStr.split(',');
            var natLen = this.nationalRegion.length;
            for (var i = 0; i < natLen; i++) {
              if (this.areaArr[0] === this.nationalRegion[i].region_id) {
                var secLen = this.nationalRegion[i].son.length;
                for (var r = 0; r < secLen; r++) {
                  // console.log(this.nationalRegion[i].son[r].region_id);
                  if (this.areaArr[1] === this.nationalRegion[i].son[r].region_id.split(',')[1]) {
                    var thiLen = this.nationalRegion[i].son[r].pson.length;
                    for (var c = 0; c < thiLen; c++) {
                      if (this.areaArr[2] === this.nationalRegion[i].son[r].pson[c].region_id.split(',')[2]) {
                        this.nationalCity = this.nationalRegion[i].son;
                        this.nationalArea = this.nationalRegion[i].son[r].pson;
                        this.areaStr[0] = this.nationalRegion[i].region_name;
                        this.areaStr[1] = this.nationalRegion[i].son[r].region_name;
                        this.areaStr[2] = this.nationalRegion[i].son[r].pson[c].region_name;
                        // 初始化距离顶部的距离
                        // console.log(this.$refs.second);
                        this.$refs.first.style.top = -(i - 1) * 30 + 'px';
                        this.$refs.second.style.top = -(r - 1) * 30 + 'px';
                        this.$refs.third.style.top = -(c - 1) * 30 + 'px';
                        this.indexStr = this.nationalRegion[i].son[r].pson[c].region_id;
                        // console.log(this.indexStr);
                        // console.log(this.nationalRegion[i].region_name);
                        // console.log(this.nationalRegion[i].son[r].region_name);
                        // console.log(this.nationalRegion[i].son[r].pson[c].region_name);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        });
        // console.log(this.areaArr);
      },
      _cancel () {
        this.dialog = false;
      },
      _submit () {
        // 传递当前省市区对应的下标
        // this.$emit('subInfo', {index: this.indexStr, str: this.areaStr.join('-')});
        this.dialog = false;
      },
      // 开始滑动触摸到的点
      _touchStart (e) {
        // 当前父级元素top值
        this.parentTop = parseInt(e.target.parentNode.style.top);
        // console.log(e.target.parentNode);
        // 获取到当前点坐标位于屏幕的y轴位置
        this.positionY = e.touches[0].screenY;
        // console.log(e.touches[0].screenY);
        // console.log(this.positionY);
      },
      // 正在滑动中获取到的点xy坐标
      _touchMove (e) {
        // console.log(e.touches[0].screenY - this.positionY);
        // console.log(e.target.parentNode.style.top);
        e.target.parentNode.style.top = this.parentTop + e.touches[0].screenY - this.positionY + 'px';
      },
      _touchEnd (e) {
        // 获取锚点的父元素
        var parent = e.target.parentNode;
        // 获取到当前已经拉动以后距离顶部的值
        var ddTop = parseInt(parent.style.top);
        // 计算哪个是当前选项的index.获取当前点的坐标
        var nowNumber = ddTop / 30;
        parent.style.top = Math.round(nowNumber) * 30 + 'px';
        // 是否到顶部
        if (ddTop > 30) {
          parent.style.top = '30px';
        }
        var len = parent.getElementsByTagName('dd').length - 2;
        if (ddTop < -len * 30) {
          parent.style.top = -len * 30 + 'px';
        }
        // 当前index
        var endIndex = -parseInt(parent.style.top) / 30 + 1;
        // console.log(indexNumber);
        // i-data的值
        var nodeVal = parent.attributes[0].nodeValue;
        if (nodeVal === '0') {
          this.nationalCity = this.nationalRegion[endIndex].son;
          this.nationalArea = this.nationalRegion[endIndex].son[0].pson;
          this.indexStr = this.nationalRegion[endIndex].son[0].pson[0].region_id;
          this.areaStr[0] = this.nationalRegion[endIndex].region_name;
          this.areaStr[1] = this.nationalRegion[endIndex].son[0].region_name;
          this.areaStr[2] = this.nationalRegion[endIndex].son[0].pson[0].region_name;
          // 回顶部
          this.$refs.second.style.top = '30px';
          this.$refs.third.style.top = '30px';
        } else if (nodeVal === '1') {
          this.nationalArea = this.nationalCity[endIndex].pson;
          this.indexStr = this.nationalCity[endIndex].pson[0].region_id;
          this.areaStr[1] = this.nationalCity[endIndex].region_name;
          this.areaStr[2] = this.nationalCity[endIndex].pson[0].region_name;
          this.$refs.third.style.top = '30px';
        } else if (nodeVal === '2') {
          this.indexStr = this.nationalArea[endIndex].region_id;
          this.areaStr[2] = this.nationalArea[endIndex].region_name;
        }
        // console.log(this.indexStr);
      }
    }
    // computed: mapState({
    //   // 全国省市区
    //   nationalRegion: state => state.nationalRegion
    // })
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scpoed>
  @import '../../common/stylus/mixin.styl';

  .data-dialog
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 88
    background: rgba(0, 0, 0, 0.3)
    transition: all 0.4s linear
    transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38);
    &.dialog-enter-active
      opacity: 1
    &.dialog-enter, &.dialog-leave-active
      opacity: 0
    .ui-dialog
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      height: 215px
      background: #fff
      ul
        position: relative
        overflow: hidden
        zoom: 1
        background: #eee
        li
          float: left
          width: 50%
          text-align: center
          font-size: 16px
          height: 46px
          line-height: 46px
          color: #747474
          &.sure-btn
            color: #F76A67
      .ui-confirm-title
        text-align: center
        font-size: 14px
        color: #333
        line-height: 25px
        padding: 20px 0 20px 0
        .ui-scroller-mask
          -webkit-mask: -webkit-gradient(linear,0 30%,0 0,from(rgba(222,187,71,1)),to(rgba(36,142,36,0)))
          position: relative
          p
            position: absolute
            top: 29px
            height: 30px
            width: 100%
            margin: 0
            z-index: -1
            border: 1px solid #e2e2e2
            border-left: none
            border-right: none
        .ui-scroller
          -webkit-mask: -webkit-gradient(linear,0 10%,0 100%,from(rgba(222,187,71,1)),to(rgba(36,142,36,0)))
          div
            width: 32%
            display: inline-block
            position: relative
            height: 125px
            overflow: hidden
          dl
            position: absolute
            width: 100%
            margin: 0
            top: 30px
          dd
            padding: 0
            margin: 0
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            width: 100%
            height: 30px
            line-height: 30px
            font-size: 16px
</style>
