<template>
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
              <dl i-data="0" style="top: 30px" ref="first" class="first">
                <dd pid="0" :i-data="item.region_id" class="" v-for="item in areaOneList" :key="item.id">{{ item.region_name }}</dd>
              </dl>
            </div>
            <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
              <dl i-data="1" style="top: 30px" ref="second" class="second">
                <dd pid="1" :i-data="item.region_id" class="" v-for="item in areaTwoList" :key="item.id">{{ item.region_name }}</dd>
              </dl>
            </div>
            <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
              <dl i-data="2" style="top: 30px" ref="third" class="third">
                <dd pid="2" :i-data="item.region_id" class="" v-for="item in areaThreeList" :key="item.id">{{ item.region_name }}</dd>
              </dl>
            </div>
          </div>
          <!-- 两条遮罩线 -->
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import $ from 'jquery';
  // 引入省市区文件
  // import areaJson from 'static/json/area.json';

  export default {
    data () {
      return {
        dialog: false,
        parentTop: 0,
        flag: false,
        // 存储全部当前省市区字段
        areaStr: [],
        // 存储当前省市区坐标的id
        areaArr: []
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 各级省市区
      areaOneList: state => state.areaOneList,
      areaTwoList: state => state.areaTwoList,
      areaThreeList: state => state.areaThreeList
    }),
    methods: {
      _showDialog (areaStr) {
        // console.log(areaStr);
        this.$nextTick(() => {
          if (areaStr.length === 0) {
            this.$emit('showLoad');
            this.$store.dispatch('areaList', {data: {region_id: 1}, type: 0}).then(res => {
              this.$store.dispatch('areaList', {data: {region_id: res[0].region_id}, type: 1}).then(res => {
                this.$store.dispatch('areaList', {data: {region_id: res[0].region_id}, type: 2}).then(res => {
                  this.$emit('hideLoad');
                  this.dialog = true;
                  this.areaStr[0] = this.areaOneList[0].region_name;
                  this.areaStr[1] = this.areaTwoList[0].region_name;
                  this.areaStr[2] = this.areaThreeList[0].region_name;
                  this.areaArr[0] = this.areaOneList[0].region_id;
                  this.areaArr[1] = this.areaTwoList[0].region_id;
                  this.areaArr[2] = this.areaThreeList[0].region_id;
                  // 回顶部
                  $('.first').css('top', '30px');
                  $('.second').css('top', '30px');
                  $('.third').css('top', '30px');
                });
              });
            });
          } else {
            // 负值
            this.areaArr = areaStr;
            // console.log(this.areaArr);
            this.$emit('showLoad');
            this.$store.dispatch('areaList', {data: {region_id: 1}, type: 0}).then(res => {
              var oneLen = this.areaOneList.length;
              var i = 0;
              for (i; i < oneLen; i++) {
                // console.log(this.areaOneList[i].region_id);
                if (parseInt(this.areaOneList[i].region_id) === parseInt(this.areaArr[0])) {
                  break;
                }
              }
              this.$store.dispatch('areaList', {data: {region_id: res[i].region_id}, type: 1}).then(res => {
                  var twoLen = this.areaTwoList.length;
                  var r = 0;
                  for (r; r < twoLen; r++) {
                    if (parseInt(this.areaTwoList[r].region_id) === parseInt(this.areaArr[1])) {
                      break;
                    }
                  }
                  this.$store.dispatch('areaList', {data: {region_id: res[r].region_id}, type: 2}).then(res => {
                      this.$emit('hideLoad');
                      var threeLen = this.areaThreeList.length;
                      var b = 0;
                      for (b; b < threeLen; b++) {
                        if (parseInt(this.areaThreeList[b].region_id) === parseInt(this.areaArr[2])) {
                          break;
                        }
                      }
                      this.dialog = true;
                      this.$nextTick(() => {
                        this.areaStr[0] = this.areaOneList[i].region_name;
                        this.areaStr[1] = this.areaTwoList[r].region_name;
                        this.areaStr[2] = this.areaThreeList[b].region_name;
                        $('.first').css('top', -(i - 1) * 30 + 'px');
                        $('.second').css('top', -(r - 1) * 30 + 'px');
                        $('.third').css('top', -(b - 1) * 30 + 'px');
                      });
                  });
              });
            });
          }
        });
        // console.log(this.areaArr);
      },
      _cancel () {
        this.dialog = false;
      },
      _submit () {
        // console.log({index: this.areaArr.join(','), str: this.areaStr.join('-')});
        // 传递当前省市区对应的下标
        this.$emit('subInfo', {index: this.areaArr.join(','), str: this.areaStr.join('-')});
        this.dialog = false;
      },
      // 开始滑动触摸到的点
      _touchStart (e) {
        // this.dlNo = $(e.path[1]).attr('i-data');
        // alert(1);
        // console.log(e.path[1]);
        // 当前父级元素top值
        this.parentTop = parseInt(e.target.parentNode.style.top);
        // alert(1);
        // console.log(e.target.parentNode);
        // 获取到当前点坐标位于屏幕的y轴位置
        // if (e.screenY) {
        //   this.positionY = e.screenY;
        // } else {
        //   this.positionY = e.touches[0].screenY;
        // }
        this.positionY = e.touches[0].screenY;
        // console.log(e.touches[0].screenY);
        // console.log(this.positionY);
      },
      // 正在滑动中获取到的点xy坐标
      _touchMove (e) {
        var scY = e.touches[0].screenY;
        // console.log(e.touches[0].screenY - this.positionY);
        // console.log(e.target.parentNode.style.top);
        e.target.parentNode.style.top = this.parentTop + scY - this.positionY + 'px';
        // alert(this.parentTop);
        // alert(scY);
        // alert(this.positionY);
        // alert(e.target.parentNode.style.top);
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
        // console.log(endIndex);
        $(parent).attr('i-count', endIndex);
        // i-data的值
        var nodeVal = parent.attributes[0].nodeValue;
        if (nodeVal === '0') {
          // 初始化数据
          this.$emit('showLoad');
          this.$store.dispatch('areaList', {data: {region_id: this.areaOneList[endIndex].region_id}, type: 1}).then(res => {
              this.$store.dispatch('areaList', {data: {region_id: this.areaTwoList[0].region_id}, type: 2}).then(res => {
                  this.$emit('hideLoad');
                  this.areaStr[0] = this.areaOneList[endIndex].region_name;
                  this.areaStr[1] = this.areaTwoList[0].region_name;
                  this.areaStr[2] = this.areaThreeList[0].region_name;
                  this.areaArr[0] = this.areaOneList[endIndex].region_id;
                  this.areaArr[1] = this.areaTwoList[0].region_id;
                  this.areaArr[2] = this.areaThreeList[0].region_id;
                  // 回顶部
                  this.$refs.second.style.top = '30px';
                  this.$refs.third.style.top = '30px';
              });
          });
        } else if (nodeVal === '1') {
          this.$emit('showLoad');
          this.$store.dispatch('areaList', {data: {region_id: this.areaTwoList[endIndex].region_id}, type: 2}).then(res => {
              this.$emit('hideLoad');
              this.areaStr[1] = this.areaTwoList[endIndex].region_name;
              this.areaStr[2] = this.areaThreeList[0].region_name;
              this.areaArr[1] = this.areaTwoList[endIndex].region_id;
              this.areaArr[2] = this.areaThreeList[0].region_id;
              this.$refs.third.style.top = '30px';
          });
        } else if (nodeVal === '2') {
          // console.log(1);
            this.areaStr[2] = this.areaThreeList[endIndex].region_name;
            this.areaArr[2] = this.areaThreeList[endIndex].region_id;
        }
      }
      // console.log(this.areaArr);
      // console.log(this.areaStr);
    }
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
          cursor: pointer
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
            cursor: pointer
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
