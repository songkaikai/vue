<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" :class="[isShip ? 'lag-wrapper' : '']" v-show="showBomb">
          <!-- 编辑收货地址 -->
          <div class="address-edit">
            <div class="list-item">
              <i class="icon-three"></i>
              <div class="right-ipt">
                <input type="text" name="" v-model="dataOption.consignee" @input="_filter('consignee')" placeholder="请输入收件人姓名" maxlength="6" />
              </div>
            </div>
            <div class="list-item" v-show="isShip">
              <i class="icon-five"></i>
              <div class="right-ipt">
                <input type="text" name="" v-model="dataOption.cardNo" @input="_filter('cardNo')" placeholder="请输入身份证号码" />
              </div>
            </div>
            <div class="list-item">
              <i class="icon-four"></i>
              <div class="right-ipt">
                <input type="tel" name="" v-model="dataOption.mobile" @input="_filter('mobile')" placeholder="请输入收件人手机号码" />
              </div>
            </div>
            <div class="list-item">
              <i class="icon-one"></i>
              <div class="right-ipt">
                <!-- <input type="tel" name="" v-model="dataOption.area" @input="_filter('area')" placeholder="请选择您所属的省市区" /> -->
                <div class="inner-msg" @click="_showDialog">
                  <span class="has-msg" v-if="dataOption.area">{{ areaName }}</span>
                  <span class="none-msg" v-else>请选择您所属的省市区</span>
                </div>
              </div>
            </div>
            <div class="list-item">
              <i class="icon-two"></i>
              <div class="right-ipt">
                <input type="text" name="" v-model="dataOption.address" @input="_filter('address')" placeholder="请输入详细收件地址" />
              </div>
            </div>
            <p class="tips">* 请填写物流所需相关信息</p>
            <div class="blue-btn" @click="_submitChoose">确定</div>
          </div>
          <div class="close-btn" @click="_cancelChoose"><img src="./close_icon.png" alt=""></div>
        </div>
      </transition>
      <!-- 地区选择 -->
      <data-dialog ref="datadialog" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:subInfo="submitInfo"></data-dialog>
    </div>
  </transition>
</template>

<script>
  import dataDialog from 'components/plugins/dialog';

  export default {
    data () {
      return {
        showBomb: false,
        // dataOption: {
        //   consignee: 'song2k', // 收件人
        //   mobile: '13819445301', // 收件人手机号
        //   area: '浙江省金华市义乌', // 地区
        //   address: '飘娜国际电商园3楼翼数据' // 详情地址
        // },
        dataOption: {
          consignee: '', // 收件人
          mobile: '', // 收件人手机号
          area: '', // 地区
          address: '', // 详情地址
          cardNo: '' // 身份证号自提时，需要提交，即is_ship为0
        },
        areaName: '',
        isShip: false // 是否快递1还是自取0
      };
    },
    props: {
      bombStr: {
        type: String
      }
    },
    methods: {
      // 显示弹框
      _showBomb (type) {
        // console.log(type);
        // 选完取货方式.是否快递1是0否
        if (type === 0) {
          this.isShip = true;
        } else if (type === 1) {
          this.isShip = false;
        }
        this.showBomb = true;
      },
      // 关闭弹框
      _cancelChoose () {
        // 初始化数据
        this.dataOption = {
          consignee: '', // 收件人
          mobile: '', // 收件人手机号
          area: '', // 地区
          address: '' // 详情地址
        };
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        if (this.dataOption.consignee === '') {
          this.showTip('收件人不能为空');
          return false;
        }
        // 只有自取才需要验证身份证吗
        if (this.dataOption.cardNo === '' && this.isShip) {
          this.showTip('省份证号不能为空');
          return false;
        }
        if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
          this.showTip('请输入正确的手机格式');
          return;
        }
        if (this.dataOption.area === '') {
          this.showTip('省市区不能为空');
          return false;
        }
        if (this.dataOption.address === '') {
          this.showTip('详细地址不能为空');
          return false;
        }
        // 提交信息
        this.$emit('submitMsg', this.dataOption);
        // this.showBomb = false;
      },
      // 显示地区选择
      _showDialog () {
        var arr = [];
        if (this.dataOption.province_id) {
          arr = [this.dataOption.province_id, this.dataOption.city_id, this.dataOption.district_id];
        }
        this.$refs.datadialog._showDialog(arr);
      },
      // 地址选择传递的数据
      submitInfo (option) {
        // console.log(option);
        // var idArr = option.index.split(',');
        // this.dataOption.province_id = idArr[0];
        // this.dataOption.city_id = idArr[1];
        // this.dataOption.district_id = idArr[2];
        this.dataOption.area = option.index;
        this.areaName = option.str;
      },
      // 过滤空格
      _filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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
    },
    components: {
      dataDialog
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
    .bomb-box
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      margin: auto
      width: 16rem
      height: 20rem
      border-radius: 8px
      background: rgba(255, 255, 255, 0.22)
      transition: all 0.2s
      -webkit-transition: all 0.2s
      &.lag-wrapper
        height: 23rem
      &.box-enter-active
        transform: scale(1, 1)
        -webkit-transform: scale(1, 1)
      &.box-enter,&.box-leave-active
        transform: scale(1.2, 1.2)
        -webkit-transform: scale(1.2, 1.2)
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
      .address-edit
        padding: 1.5rem 1.5rem
        .tips
          font-size: 0.9rem
          text-align: center
          color: #cecece
        .blue-btn
          width: 100%
          background: #009fe8
          margin: auto
          margin-top: 1rem
          text-align: center
          color: #fff
          font-size: 0.9rem
          border-radius: 5px
          padding: 0.6rem 0
          -webkit-box-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3)
          &:active
            -webkit-transition: all 0.2s
            -webkit-transform: scale(1.05, 1.05)
        .list-item
          padding: 0.6rem 0
          overflow: hidden
          i
            float: left
            width: 2rem
            height: 2rem
            &.icon-one
              background: url(./address_icon_one.png) center no-repeat
              background-size: 100% 100%
            &.icon-two
              background: url(./address_icon_two.png) center no-repeat
              background-size: 100% 100%
            &.icon-three
              background: url(./address_icon_three.png) center no-repeat
              background-size: 100% 100%
            &.icon-four
              background: url(./address_icon_four.png) center no-repeat
              background-size: 100% 100%
            &.icon-five
              background: url(./address_icon_five.png) center no-repeat
              background-size: 100% 100%
          .right-ipt
            padding: 0.2rem 0 0 2.4rem
            .inner-msg
              width: 100%
              border-bottom: 1px solid #cecece
              span
                display: inline-block
                padding: 0.3rem 4%
                font-size: 0.9rem
                color: #c1c1c0
                &.has-msg
                  display: block
                  overflow: hidden
                  text-overflow: ellipsis
                  white-space: nowrap
                  color: #fff
            input
              display: inline-block
              width: 92%
              padding: 0.2rem 4%
              font-size: 0.9rem
              border-radius: 0
              // background: red
              color: #fff
              border-bottom: 1px solid #cecece
</style>
