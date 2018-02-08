<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <!-- close -->
      <div class="close-shade" @click="_cancelChoose"></div>
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <!-- 选择产品参数 -->
          <div class="parameter-wrapper">
            <div class="select-params">
              <div class="prod-img"><img :src="prodPic" alt=""></div>
              <div class="prod-detail">
                <p class="price">￥{{ prodPrice }}</p>
                <p class="stock">库存 {{ prodStock }} 件</p>
                <p class="other">
                  <span>请选择</span>
                  <span>{{ selectValue }}</span>
                </p>
              </div>
            </div>
            <!-- 产品规格 -->
            <div class="prod-params" ref="params">
              <div class="prod-wrapper">
                <div class="params-list" v-for="(item, index) in paramsAll" :key="item.id">
                  <p class="name">{{ item.type }}</p>
                  <div class="list-item">
                    <!-- <span v-for="item in item.params" :key="item.id" :class="[ (item.id, index) | formatDate ? 'none' : '']" @click="_chooseParams(item.id, index)">{{ item.value }}</span> -->
                    <span v-for="item in item.params" :key="item.id" v-bind:class="paramsStrArr | formatDate(item.id, index)" @click="_chooseParams(item.id, item.addVal, index, item.price, item.stock)">{{ item.value }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <p class="tips">* </p> -->
            <div class="blue-btn" @click="_submitChoose">确定</div>
          </div>
          <!-- <div class="close-btn" @click="_cancelChoose"><img src="./close_icon.png" alt=""></div> -->
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    data () {
      return {
        showBomb: false,
        prodPic: null, // 产品图片
        prodPrice: '0.00', // 产品价格
        prodStock: 0, // 产品库存
        paramsScroll: null, // BScroll对象
        paramsStrArr: '', // 当前所有选中的参数
        selectValue: '',
        paramsAll: []
        // paramsAttr: null // 所有参数
      };
    },
    props: {
      bombStr: {
        type: String
      }
    },
    filters: {
      // str为当前已经点击的字符串。id为当前点击的参数的id。index为当前是第几列参数
      formatDate (str, id, index) {
        var arr = String(str).split(',');
        var idStr = '';
        for (var i = 0; i < arr.length; i++) {
          if (i <= index) {
            idStr += i === 0 ? arr[i] : ',' + arr[i];
          } else {
            break;
          }
        }
        if (idStr === String(id)) {
          return 'index';
        } else {
          return '';
        }
        // if (idStr === String(id)) {
        //   return 'index';
        // } else if (String(id).indexOf(idStr) !== 0 && index > 0) {
        //   return 'none';
        // } else {
        //   return '';
        // }
        // let date = new Date(time);
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
        // console.log('str: ' + str, 'id: ' + id, 'index: ' + index);
        // if (parseInt(index) > 0) {
        //   return 'none';
        // } else {
        //   return '';
        // }
      }
    },
    methods: {
      // 显示弹框
      _showBomb (option) {
        this.prodPic = option.pic;
        this.paramsAll = option.params;
        // console.log(option);
        this.showBomb = true;
        this.$nextTick(() => {
          // 滚动
          if (!this.paramsScroll) {
            this.paramsScroll = new BScroll(this.$refs.params, {
              click: true // 允许点击事件
            });
          } else {
            // 重新加载
            this.paramsScroll.refresh();
          }
        });
      },
      _chooseParams (id, value, index, price, stock) {
        this.selectValue = value;
        // console.log(id);
        this.paramsStrArr = String(id);
        if (this.paramsAll.length === index + 1) {
          this.prodStock = stock;
          this.prodPrice = price;
        } else {
          this.prodStock = 0;
          this.prodPrice = '0.00';
        }
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        var subArr = this.paramsStrArr.split(',');
        if (subArr.length !== this.paramsAll.length) {
          this.showTip('请选择完整参数');
          return false;
        }
        this.$emit('submitMsg', {
          numStr: this.paramsStrArr, // 需要上传的字段
          valStr: this.selectValue // 显示的字段
        });
        this.showBomb = false;
      },
      showLoad () {
        this.$emit('showLoad');
      },
      hideLoad () {
        this.$emit('hideLoad');
      },
      // 显示提示框
      showTip (str) {
        // console.log(str);
        this.$emit('showTip', str);
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
    background: rgba(0, 0, 0, 0.8)
    -webkit-transition: all 0.3s
    &.bombox-enter-active
      opacity: 1
    &.bombox-enter,&.bombox-leave-active
      opacity: 0
    .close-shade
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 38
    .bomb-box
      position: absolute
      // top: 0
      left: 0
      bottom: 0
      // right: 0
      // margin: auto
      width: 100%
      height: 18rem
      border-radius: 2px
      z-index: 40
      background: rgba(255, 255, 255, 0.9)
      transition: all 0.3s
      -webkit-transition: all 0.3s
      &.box-enter-active
        transform: translateY(0)
        // -webkit-transform: scale(1, 1)
      &.box-enter,&.box-leave-active
        transform: translateY(18rem )
        // -webkit-transform: scale(1.2, 1.2)
      .close-btn
        position: absolute
        bottom: -3.6rem
        left: 50%
        margin-left: -1.25rem
        width: 2.5rem
        height: 2.5rem
        cursor: pointer
        &:active
          -webkit-transition: all 0.2s
          -webkit-transform: scale(1.2, 1.2)
        img
          display: block
          width: 100%
          height: 100%
      .parameter-wrapper
        padding: 0.8rem 1rem
        .tips
          text-align: center
          font-size: 0.9rem
          color: #c8c9c9
        .blue-btn
          width: 100%
          background: #009fe8
          margin: auto
          margin-top: 0.9rem
          text-align: center
          color: #fff
          font-size: 0.9rem
          border-radius: 5px
          padding: 0.8rem 0
          -webkit-box-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3)
          &:active
            -webkit-transition: all 0.2s
            -webkit-transform: scale(1.05, 1.05)
        .select-params
          position: relative
          .prod-img
            position: absolute
            top: -3rem
            left: 0
            img
              display: block
              width: 5rem
              height: 5rem
              border-radius: 5px
          .prod-detail
            padding: 0 0 0 6rem
            .price
              margin-top: 0.2rem
              font-size: 1.1rem
              color: #009fe8
            .stock
              padding: 0.3rem 0
              font-size: 0.85rem
              color: #333
            .other
              margin-top: 0.2rem
              font-size: 0.85rem
              overflow: hidden
              color: #333
              span
                float: left
                margin-right: 0.2rem
        .prod-params
          overflow: hidden
          margin-top: 0.6rem
          height: 8.6rem
          .prod-wrapper
            .params-list
              padding: 0.3rem 0
              .name
                padding: 0.2rem 0
                font-size: 0.9rem
              .list-item
                margin-top: 0.3rem
                overflow: hidden
                span
                  float: left
                  margin-right: 0.5rem
                  padding: 0.4rem 0.6rem
                  font-size: 0.85rem
                  border-radius: 5px
                  border: 1px solid #666
                  color: #666
                  cursor: pointer
                  &.index
                    border: 1px solid #009fe8
                    color: #009fe8
                  &.none
                    border: 1px solid #969696
                    color: #969696
</style>
