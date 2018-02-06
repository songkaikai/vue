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
                <dd pid="0" :i-data="item.id" class="" v-for="(item, index) in areaOneList">{{ item.name }}</dd>
              </dl>
            </div>
            <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
              <dl i-data="1" style="top: 30px" ref="second" class="second">
                <dd pid="1" :i-data="item.id" class="" v-for="(item, index) in areaTwoList">{{ item.name }}</dd>
              </dl>
            </div>
            <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd">
              <dl i-data="2" style="top: 30px" ref="third" class="third">
                <dd pid="2" :i-data="item.id" class="" v-for="(item, index) in areaThreeList">{{ item.name }}</dd>
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
  // import { mapState } from 'vuex';
  import $ from 'jquery';
  // 引入省市区文件
  import areaJson from 'static/json/area.json';

  export default {
    data () {
      return {
        dialog: false,
        parentTop: 0,
        flag: false,
        dlNo: '', // 记录当前是第几个
        // 存储当前省市区的下标
        indexStr: '',
        // 存储全部当前省市区字段
        areaStr: [],
        // 存储当前省市区坐标的id
        areaArr: [],
        areaOneList: [], // 省
        areaTwoList: [], // 市
        areaThreeList: [] // 区
      };
    },
    // computed: mapState({
    //   // 获取用户token
    //   memberLogin: state => state.memberLogin,
    //   // 各级省市区
    //   areaOneList: state => state.areaOneList,
    //   areaTwoList: state => state.areaTwoList,
    //   areaThreeList: state => state.areaThreeList
    // }),
    methods: {
      _showDialog (areaStr) {
        // console.log(areaStr === '');
        this.$nextTick(() => {
          this.areaOneList = []; // 省
          this.areaTwoList = []; // 市
          this.areaThreeList = []; // 区
          this.dialog = true;
          var len = areaJson.length;
          if (areaStr === '') {
            for (var i = 0; i < len; i++) {
              this.areaOneList.push({name: areaJson[i].name, id: areaJson[i].id});
            }
            var twoArea = areaJson[0].child;
            var twoLen = twoArea.length;
            for (var r = 0; r < twoLen; r++) {
              this.areaTwoList.push({name: twoArea[r].name, id: twoArea[r].id});
            }
            var threeArea = twoArea[0].child;
            var threeLen = threeArea.length;
            for (var c = 0; c < threeLen; c++) {
              this.areaThreeList.push({name: threeArea[c].name, id: threeArea[c].id});
            }
            this.areaStr[0] = areaJson[0].name;
            this.areaStr[1] = twoArea[0].name;
            this.areaStr[2] = threeArea[0].name;
            this.areaArr[0] = areaJson[0].id;
            this.areaArr[1] = twoArea[0].id;
            this.areaArr[2] = threeArea[0].id;
            // 回顶部
            // $('.first').css('top', '30px');
            // $('.first').attr('i-count', 0);
            // $('.second').css('top', '30px');
            // $('.second').attr('i-count', 0);
            // $('.third').css('top', '30px');
            // $('.third').attr('i-count', 0);
            $('.first').css('top', '30px').attr('i-count', 0);
            $('.second').css('top', '30px').attr('i-count', 0);
            $('.third').css('top', '30px').attr('i-count', 0);
          } else {
            this.areaArr = areaStr.split(',');
            // console.log(this.areaArr);
            var countOne = 0;
            var countTwo = 0;
            var countThree = 0;
            for (var a = 0; a < len; a++) {
              if (parseInt(this.areaArr[0]) === parseInt(areaJson[a].id)) {
                countOne = a; // 当前第几个
              }
              this.areaOneList.push({name: areaJson[a].name, id: areaJson[a].id});
            }
            var oTlist = areaJson[countOne].child;
            var otLen = oTlist.length;
            for (var b = 0; b < otLen; b++) {
              if (parseInt(this.areaArr[1]) === parseInt(oTlist[b].id)) {
                countTwo = b; // 当前第几个
              }
              this.areaTwoList.push({name: oTlist[b].name, id: oTlist[b].id});
            }
            var oTreelist = oTlist[countTwo].child;
            // console.log(oTreelist);
            var otrLen = oTreelist.length;
            for (var f = 0; f < otrLen; f++) {
              if (parseInt(this.areaArr[2]) === parseInt(oTreelist[f].id)) {
                countThree = f; // 当前第几个
              }
              this.areaThreeList.push({name: oTreelist[f].name, id: oTreelist[f].id});
            }
            this.$nextTick(() => {
              this.areaStr[0] = areaJson[countOne].name;
              this.areaStr[1] = oTlist[countTwo].name;
              this.areaStr[2] = oTreelist[countThree].name;
              this.areaArr[0] = areaJson[countOne].id;
              this.areaArr[1] = oTlist[countTwo].id;
              this.areaArr[2] = oTreelist[countThree].id;
              $('.first').css('top', -(countOne - 1) * 30 + 'px').attr('i-count', countOne);
              $('.second').css('top', -(countTwo - 1) * 30 + 'px').attr('i-count', countTwo);
              $('.third').css('top', -(countThree - 1) * 30 + 'px').attr('i-count', countThree);
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
          this.areaTwoList = [];
          this.areaThreeList = [];
          var twoArr = areaJson[endIndex].child;
          var twoLen = twoArr.length;
          for (var i = 0; i < twoLen; i++) {
            this.areaTwoList.push({name: twoArr[i].name, id: twoArr[i].id});
          }
          var threeArr = twoArr[0].child;
          var threeLen = threeArr.length;
          for (var r = 0; r < threeLen; r++) {
            this.areaThreeList.push({name: threeArr[r].name, id: threeArr[r].id});
          }
          this.areaStr[0] = this.areaOneList[endIndex].name;
          this.areaStr[1] = twoArr[0].name;
          this.areaStr[2] = threeArr[0].name;
          this.areaArr[0] = this.areaOneList[endIndex].id;
          this.areaArr[1] = twoArr[0].id;
          this.areaArr[2] = threeArr[0].id;
          // 回顶部
          this.$refs.second.style.top = '30px';
          this.$refs.third.style.top = '30px';
        } else if (nodeVal === '1') {
          // 初始化数据
          this.areaThreeList = [];
          // console.log(this.areaArr[0]);
          var count = $('.ui-scroller dl').eq(0).attr('i-count');
          // console.log(count);
          var threeArrOther = areaJson[count].child[endIndex].child;
          var threeLenOther = threeArrOther.length;
          for (var d = 0; d < threeLenOther; d++) {
            this.areaThreeList.push({name: threeArrOther[d].name, id: threeArrOther[d].id});
          }
          this.areaStr[1] = this.areaTwoList[endIndex].name;
          this.areaStr[2] = threeArrOther[0].name;
          this.areaArr[1] = this.areaTwoList[endIndex].id;
          this.areaArr[2] = threeArrOther[0].id;
          this.$refs.third.style.top = '30px';
        } else if (nodeVal === '2') {
          // console.log(1);
          this.areaStr[2] = this.areaThreeList[endIndex].name;
          this.areaArr[2] = this.areaThreeList[endIndex].id;
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
