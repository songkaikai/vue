<template>
  <transition name="datepicker">
    <div class="date-picker" v-if="dialog">
      <div class="ui-dialog">
        <ul>
          <li @click="_submit('cancel')">取消</li>
          <li class="sure-btn" @click="_submit('submit')">确定</li>
        </ul>
        <div class="ui-confirm-title">
          <div class="ui-scroller-mask">
            <div class="ui-scroller">
              <div class="ui-auto">
                <div @touchstart="_touchStart" @touchmove="_touchMove" @touchend="_touchEnd" class="wrapper width-22">
                  <dl i-data="0" style="-webkit-transform: translate(0px,30px)" ref="dateyear">
                    <dd class="" v-for="(item, index) in allYear">{{ item }}</dd>
                  </dl>
                  <div class="date_grid">年</div>
                </div>
                <div @touchstart="_touchStart" @touchmove="_touchMove" @touchend="_touchEnd" class="wrapper width-16">
                  <dl i-data="1" style="-webkit-transform: translate(0px,30px)" ref="datemonth">
                    <dd class="" v-for="(item, index) in 12">{{ item < 10 ? '0' + item : item }}</dd>
                  </dl>
                  <div class="date_grid">月</div>
                </div>
                <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd" class="wrapper width-16">
                  <dl i-data="2" style="-webkit-transform: translate(0px,30px)" ref="dates">
                    <dd class="" v-for="(item, index) in allDate">{{ item < 10 ? '0' + item : item }}</dd>
                  </dl>
                  <div class="date_grid">日</div>
                </div>
                <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd" class="wrapper width-16">
                  <dl i-data="3" style="-webkit-transform: translate(0px,30px)" ref="datehour">
                    <dd class="" v-for="(item, index) in 24">{{ index < 10 ? '0' + index : index }}</dd>
                  </dl>
                  <div class="date_grid">时</div>
                </div>
                <div @touchstart.stop.prevent="_touchStart" @touchmove.stop.prevent="_touchMove" @touchend.stop.prevent="_touchEnd" class="wrapper width-16">
                  <dl i-data="4" style="-webkit-transform: translate(0px,30px)" ref="dateminute">
                    <dd class="" v-for="(item, index) in 60">{{ index < 10 ? '0' + index : index }}</dd>
                  </dl>
                  <div class="date_grid">分</div>
                </div>
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

<script type="text/ecmascript-6">
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        dialog: false,
        parentTop: 0,
        // 保存时间的地方
        allYear: [],
        allDate: 31,
        // 存储年月日时分的数组
        dateArr: [],
        // 开始年份到结束年份的差距年数
        disparityYear: 1
      };
    },
    methods: {
      // 初始化状态
      _showDialog (date) {
        // console.log(date === '');
        // 获取当前的年份
        this.dialog = true;
        this.$nextTick(() => {
          var dt = new Date();
          this.allYear = [dt.getFullYear(), dt.getFullYear() + 1];
          if (date !== '') {
            // 吧当前获取到的日期分割为数组
            this.dateArr = date.replace(/[-:]/g, ' ').split(' ');
            // 转换成整数
            for (var i = 0; i < this.dateArr.length; i++) {
              this.dateArr[i] = parseInt(this.dateArr[i]);
            }
          } else {
            // 获取到年月日时分
            this.dateArr = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes()];
          }
          // 当前年2月的天数
          this.allDate = this.calcDays(this.dateArr[0], this.dateArr[1]);
          // 初始化当前的位置
          var count = 0;
          for (var y = 0; y < this.allYear.length; y++) {
            if (this.allYear[y] === this.dateArr[0]) {
              count = y;
              break;
            }
          }
          this.$refs.dateyear.style['-webkit-transform'] = 'translate(0px,' + ((-count + 1) * 30) + 'px)';
          this.$refs.datemonth.style['-webkit-transform'] = 'translate(0px,' + ((-this.dateArr[1] + 2) * 30) + 'px)';
          this.$refs.dates.style['-webkit-transform'] = 'translate(0px,' + ((-this.dateArr[2] + 2) * 30) + 'px)';
          this.$refs.datehour.style['-webkit-transform'] = 'translate(0px,' + ((-this.dateArr[3] + 1) * 30) + 'px)';
          this.$refs.dateminute.style['-webkit-transform'] = 'translate(0px,' + ((-this.dateArr[4] + 1) * 30) + 'px)';
        });
      },
      // 求月份最大天数
      calcDays (year, month) {
        if (month === 2) {
          // 公元年数可被4整除（但不可被100整除）为闰年但
          // 是正百的年数必须是可以被400整除的才是闰年。其他都是平年
          if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0 && year % 4000 !== 0)) {
            return 29;
          } else {
            return 28;
          }
        } else {
          if (month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
          } else {
            return 31;
          }
        }
      },
      _submit (type) {
        // 传递当前省市区对应的下标
        var str = this.dateArr[0] + '-' + (this.dateArr[1] < 10 ? '0' + this.dateArr[1] : this.dateArr[1]) + '-' + (this.dateArr[2] < 10 ? '0' + this.dateArr[2] : this.dateArr[2]) + ' ' + (this.dateArr[3] < 10 ? '0' + this.dateArr[3] : this.dateArr[3]) + ':' + (this.dateArr[4] < 10 ? '0' + this.dateArr[4] : this.dateArr[4]);
        // console.log(str);
        this.$emit('subDateInfo', {str, type});
        this.dialog = false;
      },
      // 开始滑动触摸到的点
      _touchStart (e) {
        // console.log(e.target.parentNode.style.transform);
        var top = e.target.parentNode.style['-webkit-transform'];
        // 当前父级元素top值
        this.parentTop = parseInt(top.slice(top.indexOf(',') + 1));
        // 获取到当前点坐标位于屏幕的y轴位置
        this.positionY = e.touches[0].screenY;
      },
      // 正在滑动中获取到的点xy坐标
      _touchMove (e) {
        // console.log(e.touches[0].screenY - this.positionY);
        // console.log( e.target.parentNode.style['-webkit-transform']);
        e.target.parentNode.style['-webkit-transform'] = 'translate(0px,' + (this.parentTop + e.touches[0].screenY - this.positionY) + 'px)';
      },
      _touchEnd (e) {
        setTimeout(() => {
          // 获取锚点的父元素
          var parent = e.target.parentNode;
          var top = parent.style['-webkit-transform'];
          // 获取到当前已经拉动以后距离顶部的值
          var ddTop = parseInt(top.slice(top.indexOf(',') + 1));
          // 计算哪个是当前选项的index.获取当前点的坐标
          var nowNumber = ddTop / 30;
          parent.style['-webkit-transform'] = 'translate(0px,' + (Math.round(nowNumber) * 30) + 'px)';
          // 是否到顶部
          if (ddTop > 30) {
            parent.style['-webkit-transform'] = 'translate(0px,30px)';
          }
          // 是否到底部了
          var len = parent.getElementsByTagName('dd').length - 2;
          if (ddTop < -len * 30) {
            parent.style['-webkit-transform'] = 'translate(0px,' + (-len * 30) + 'px)';
          }
          // console.log('nowNumber:' + nowNumber);
          // 获取当前是在哪个部位选择
          var chooseType = parent.attributes[0].nodeValue;
          var tran = parent.style['-webkit-transform'];
          var ttp = -(parseInt(tran.slice(tran.indexOf(',') + 1)) / 30 - 2);
          // 保存当前选中的项到数组
          this.dateArr[chooseType] = parseInt(parent.querySelectorAll('dd')[ttp - 1].innerHTML);
          if (chooseType === '1') {
            this.allDate = this.calcDays(this.dateArr[0], this.dateArr[1]);
            var dates = this.$refs.dates.style['-webkit-transform'];
            var dateTop = parseInt(dates.slice(dates.indexOf(',') + 1));
            // 如果之前选的当前月的日期的个数要大于这个月的个数。要重新调整
            if (dateTop < -(this.allDate - 2) * 30) {
              this.$refs.dates.style['-webkit-transform'] = 'translate(0px,' + (-(this.allDate - 2) * 30) + 'px)';
            }
          }
          // console.log(this.dateArr);
        }, 500);
      }
    },
    computed: mapState({
      // 全国省市区
      nationalRegion: state => state.nationalRegion
    })
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scpoed>
  @import '../../common/stylus/mixin.styl';

  .date-picker
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 88
    background: rgba(0, 0, 0, 0.3)
    -webkit-transition: all .5s
    &.datepicker-enter-active
      opacity: 1
    &.datepicker-enter, &.datepicker-leave-active
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
          // background: green
          -webkit-mask: -webkit-gradient(linear,0 10%,0 100%,from(rgba(222,187,71,1)),to(rgba(36,142,36,0)))
          .ui-auto
            margin: auto
            overflow: hidden
            width: 96%
            .wrapper
              float: left
              width: 32%
              display: inline-block
              padding-right: 4%
              position: relative
              height: 125px
              margin: 0 1%
              overflow: hidden
              // background: red
              &.width-16
                width: 13%
              &.width-22
                width: 18%
              .date_grid
                position: absolute
                top: 30px
                right: 2px
                width: 16px
                height: 30px
                line-height: 30px
                font-size: 16px
            dl
              // position: absolute
              width: 100%
              margin: 0
              // top: 30px
              transition: all 0.5s;
              -webkit-transition: all 0.5s;
              transform: translate(0px, 0px);
              -webkit-transform: translate(0px, 0px);
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
