<template>
  <div class="address-edit-page">
    <div class="edit-info">
      <div class="list-item border-bottom-1px">
        <input type="text" v-model="dataOption.consignee" maxlength="5" @input="filter('consignee')" placeholder="收货人姓名" />
      </div>
      <div class="list-item border-bottom-1px">
        <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" placeholder="手机号码" />
      </div>
      <div class="list-item border-bottom-1px" @click="_showDialog">
        <span class="none-msg" style="color:#c1c1c0;" v-if="dataOption.province_id === ''">请选择省、市、区</span>
        <span class="has-msg" v-else>{{ areaName }}</span>
      </div>
      <div class="list-item border-bottom-1px">
        <textarea v-model="dataOption.address" @input="filter('address')" placeholder="详细地址"></textarea>
      </div>
      <!-- <div class="list-item" style="margin-top:1rem;" @click="changeSelect()">
        <span class="left-msg">设置为默认地址</span>
        <i class="right-choose" :class="[ parseInt(dataOption.isDefault) === 1 ? 'index' : '' ]"></i>
      </div> -->
    </div>
    <div class="submit-btn" @click="submitSure()">确定</div>
    <!-- 地区选择 -->
    <data-dialog ref="datadialog" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:subInfo="submitInfo"></data-dialog>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
 import { mapState } from 'vuex';
 // 提示框
 import tips from 'components/plugins/tips';
 import loading from 'components/plugins/loading';
 import dataDialog from 'components/plugins/dialog';

 // 引入session
 import Session from 'common/js/sessionStorage';
 const ADDRESS_LIST = 'address_list';

 export default {
    data () {
      return {
        tipsStr: '', // 提示字段
        dataOption: {
          token: '', // 会员TOKEN
          consignee: '', // 收货人姓名
          area: '', // 所在地区
          address: '', // 详细地址
          mobile: '', // 手机号
          province_id: '', // 省
          city_id: '', // shi
          district_id: '' // 区
          // addressId: '' // 地址ID
          // isDefault: 1 // 是否默认地址1/0
        },
        addID: 0, // 地址id
        areaName: '' // 省市区名称
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取地址列表
      addressList: state => state.addressList
    }),
    created () {
      var id = this.$route.query.id;
      if (id === 'add') { // 添加地址
        console.log('+++');
      } else { // 编辑地址
        var addInfo = Session.fetch(ADDRESS_LIST)[id];
        this.dataOption.consignee = addInfo.consignee;
        this.dataOption.mobile = addInfo.mobile;
        this.areaName = addInfo.area.split(' ').join('-');
        this.dataOption.address = addInfo.address;
        // this.dataOption.isDefault = addInfo.is_default;
        this.dataOption.province_id = addInfo.province_id;
        this.dataOption.city_id = addInfo.city_id;
        this.dataOption.district_id = addInfo.district_id;
        this.addID = addInfo.id;
        // console.log(addInfo);
      }
    },
    methods: {
      submitSure () {
        if (this.dataOption.consignee === '') {
          this._showTip('收货人姓名不能为空');
          return;
        }
        if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
          this._showTip('请输入正确的手机格式');
          return;
        }
        if (this.dataOption.province_id === '') {
          this._showTip('省市县不能为空');
          return false;
        }
        if (this.dataOption.address === '') {
          this._showTip('详细地址不能为空');
          return false;
        }
        var edit = this.$route.query.id;
        var editType = 1;
        if (edit !== 'add') { // 如果是编辑地址就添加地址id
          this.dataOption.id = this.addID;
          editType = 2;
        }
         this.dataOption.token = this.memberLogin.token;
         this.$refs.loading.showLoad();
         this.$store.dispatch('editAddress', {data: this.dataOption, type: editType}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this.dataOption = {
                token: '', // 会员TOKEN
                consignee: '', // 收货人姓名
                address: '', // 详细地址
                mobile: '', // 手机号
                province_id: '', // 省
                city_id: '', // shi
                district_id: '' // 区
                // isDefault: 1 // 是否默认地址1/0
              };
              this.$router.go(-1);
            } else {
              this._showTip(res.msg);
            }
         });
      },
      // 设置是否成为默认地址
      changeSelect () {
        if (parseInt(this.dataOption.isDefault) === 1) {
          this.dataOption.isDefault = 0;
        } else {
          this.dataOption.isDefault = 1;
        }
      },
      // 地址选择传递的数据
      submitInfo (option) {
        // console.log(option);
        var idArr = option.index.split(',');
        this.dataOption.province_id = idArr[0];
        this.dataOption.city_id = idArr[1];
        this.dataOption.district_id = idArr[2];
        this.areaName = option.str;
        // console.log(this.dataOption.area);
      },
      // 显示地区选择
      _showDialog () {
        var arr = [];
        if (this.dataOption.province_id) {
          arr = [this.dataOption.province_id, this.dataOption.city_id, this.dataOption.district_id];
        }
        this.$refs.datadialog._showDialog(arr);
      },
      showLoad () {
        this.$refs.loading.showLoad();
      },
      hideLoad () {
        this.$refs.loading.hideLoad();
      },
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
        dataDialog,
        tips,
        loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .address-edit-page{background: #fff;padding: 1.5rem 2rem;position:absolute;top:0;left:0;right:0;bottom:0;}
  .address-edit-page .edit-info .list-item{padding: 0.3rem 0;position:relative;overflow: hidden;}
  .address-edit-page .edit-info .list-item.border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #7f7f7f;content: '';-webkit-transform: scaleY(0.5);}
  .address-edit-page .edit-info .list-item input{display: inline-block;width: 100%;padding: 0.4rem 0;font-size: 0.9rem}
  .address-edit-page .edit-info .list-item .none-msg{font-size: 0.9rem;color: #333;padding: 0.4rem 0;display:inline-block;}
  .address-edit-page .edit-info .list-item .has-msg{font-size: 0.9rem;color: #333;padding: 0.4rem 0;display:inline-block;}
  .address-edit-page .edit-info .list-item textarea{display: inline-block;width: 100%;resize: none;font-size: 0.9rem;height: 4rem;}
  .address-edit-page .submit-btn{text-align: center;background: #4fccdb;color:#fff;font-size: 0.9rem;padding: 0.6rem .0;margin-top: 2rem;border-radius: 4px;cursor:pointer;}
  .address-edit-page .edit-info .list-item .left-msg{float:left;font-size:0.9rem;height:2rem;line-height:2rem;}
  .address-edit-page .edit-info .list-item .right-choose{cursor:pointer;float:right;width:1.6rem;height:1.6rem;padding:0.2rem;background: url(./select_no.png) center no-repeat;background-size:1.6rem 1.6rem;}
  .address-edit-page .edit-info .list-item .right-choose.index{background: url(./select_index.png) center no-repeat;background-size:1.6rem 1.6rem;}
</style>
