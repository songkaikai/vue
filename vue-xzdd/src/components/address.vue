<template>
  <div class="login-page">
    <div class="shade-bg">
      <!-- 返回添加地址列表 -->
      <router-link :to="{name: 'addresslist'}" class="close-btn" v-if="showCloas === 1"></router-link>
      <div class="inner-content">
        <!-- <input type="text" v-model="str" /> -->
        <div class="list-item">
          <input type="text" v-model="dataOption.consignee" @input="filter('consignee')" class='add-ipt' placeholder="收件人姓名" maxlength="4" />
        </div>
        <div class="list-item">
          <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" class='add-ipt' placeholder="收件人手机号" />
        </div>
        <div class="list-item">
          <input type="text" v-model="dataOption.area" @input="filter('area')" class='add-ipt' placeholder="请输入地区" />
          <!-- <span class="area-value" @click="_showDialog">{{ dataOption.area === '' ? '请选择地区' : dataOption.area}}</span> -->
        </div>
        <div class="list-item">
          <textarea placeholder="填写详细地址" @input="filter('address')" v-model="dataOption.address" class="add-text" maxlength="50"></textarea>
        </div>
        <div class="sure-btn" @click="closeShade('submit')">确定</div>
        <p class="tips" v-if="showCloas === 0">必须先完善地址，才能继续游戏！</p>
        <p class="tips bottom">请填写真实地址，货收不到概不负责</p>
      </div>
    </div>
    <!-- 地区选择 -->
    <!-- <data-dialog ref="datadialog" v-on:subInfo="submitInfo"></data-dialog> -->
    <data-dialog ref="datadialog"></data-dialog>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
    import { mapState } from 'vuex';
    import dataDialog from 'components/plugins/dialog';
    import tips from 'components/plugins/tips';
    import loading from 'components/plugins/loading';

    export default {
      data () {
        return {
          dataOption: {
            token: '', // 会员TOKEN
            consignee: '', // 收货人小H
            address: '', // 地址hutongli
            mobile: '', // 手机号13741241517
            area: '', // 所在地区北京-东城区-18HAO
            isDefault: 1 // 默认地址1为默认0为不是默认地址
          },
          tipsStr: '',
          showCloas: 1,
          // 0是添加1是修改
          type: 0
        };
      },
      created () {
        // alert(1);
        if (this.$route.params.id === 'add') {
          // 显示返回按钮
          this.showCloas = 0;
        }
        // 修改
        if (this.$route.params.id !== 'add' && this.$route.params.id !== 'edit') {
          this.type = 1;
          // 获取当前选中的地址信息
          var obj = this.addressList[this.$route.params.id];
          // console.log(obj);
          this.dataOption.consignee = obj.consignee;
          this.dataOption.mobile = obj.mobile;
          this.dataOption.area = obj.area;
          this.dataOption.address = obj.address;
          this.dataOption.addressId = obj.id;
        }
      },
      computed: mapState({
        // 获取用户信息
        memberLogin: state => state.memberLogin,
        // 获取用户信息
        addressList: state => state.addressList
      }),
      methods: {
        // 提交地址
        closeShade (str) {
          // 收件人姓名
          if (!/^[\u4e00-\u9fa5\w]{1,4}$/.test(this.dataOption.consignee)) {
            this._showTip('收件人姓名不能为空');
            return;
          }
          // 验证手机号码
          if (!/^\d{1,18}$/.test(this.dataOption.mobile)) {
            this._showTip('手机号码格式错误');
            return;
          }
          // 验证详细地址
          if (this.dataOption.area === '') {
            this._showTip('地址不能为空');
            return;
          }
          // console.log(this.$route.params.id);
          // 验证详细地址
          if (this.dataOption.address === '') {
            this._showTip('详细地址不能为空');
            return;
          }
           // 通过验证进行提交
           this.$refs.loading.showLoad();
           // 判断是否为首次添加
          if (this.$route.params.id === 'add') {
            this.dataOption.isFirst = 1;
          }
          this.dataOption.token = this.memberLogin.token;
          this.$store.dispatch('editAddress', {data: this.dataOption, type: this.type}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.message === 'OK') {
               if (this.$route.params.id === 'add') {
                 this.$router.replace({ name: 'index' });
               } else {
                 this.$router.replace({ name: 'addresslist' });
               }
             } else {
               this._showTip('收获地址添加失败');
             }
          });
          // setTimeout(() => {
          //   this.$refs.loading.hideLoad();
          //   this.$router.replace({ name: 'index' });
          // }, 1500);
        },
        _showTip (str) {
          this.tipsStr = str;
          this.$refs.tips.showTips();
        },
        // 过滤空格
        filter (str) {
          this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        },
        _showDialog () {
          this.$refs.datadialog._showDialog();
          console.log(1);
        }
      },
      components: {
        loading,
        tips,
        dataDialog
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .login-page
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .shade-bg
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 18rem
      padding: 2rem 1.5rem
      margin: auto
      background: url(../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .close-btn
        position: absolute
        // display: block
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
      .inner-content
        position: relative
        .tips
          position: absolute
          bottom: -60px
          left: 0
          width: 100%
          text-align: center
          font-size: 13px
          color: #fff
          &.bottom
            bottom: -85px
        .list-item
          position: relative
          .area-value
            display: block
            margin: 0.35rem 0
            padding: 0.5rem 7%
            background: rgba(26, 122, 183, 0.7)
            border-radius: 25px
            font-size: 0.8rem
            color: #fff
          .add-ipt
            display: inline-block
            margin: 0.35rem 0
            padding: 0.5rem 7%
            width: 86%
            background: rgba(26, 122, 183, 0.7)
            border-radius: 25px
            font-size: 0.8rem
            color: #fff
          .add-text
            display: inline-block
            height: 6rem
            margin: 0.5rem 0
            padding: 0.5rem 7%
            width: 86%
            resize: none
            background: rgba(26, 122, 183, 0.7)
            border-radius: 10px
            font-size: 0.8rem
            line-height: 0.9rem
            color: #fff
        .sure-btn
          width: 6.6rem
          height: 2.12rem
          margin: auto
          text-align: center
          line-height: 2.1rem
          background: url(../assets/sure_btn_icon.png) no-repeat
          background-size: 100% 100%
          font-size: 0.9rem
          color: #fff
          &:active
            transform: scale(1.2, 1.2)
</style>
