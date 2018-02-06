<template>
  <div class="address-page">
    <div class="address-wrapper" v-if="addressList[0]">
      <div class="list-item border-bottom-1px" v-for="(item, index) in addressList" >
        <div class="inner-msg">
            <div class="one-line">
              <i class="icon-one"></i>
              <p class="address">{{ item.area | formatDate }} {{ item.address }}</p>
            </div>
            <div class="two-line">
              <i class="icon-two"></i><span>{{ item.mobile }}</span><i class="icon-three"></i><span>{{ item.consignee }}</span>
            </div>
        </div>
        <div class="edit-all">
          <div class="left-choose" @click="chooseDefault(item.id)">
            <i :class="[item.is_default === 1 ? 'index': '']"></i><span>默认地址</span>
          </div>
          <div class="right-choose" @click="deleteAdd(item.id)">
            <i class="del-btn"></i><span>删除</span>
          </div>
          <div class="right-choose" @click="addAddress(index)">
            <i class="edit-btn"></i><span>编辑</span>
          </div>
        </div>
      </div>
    </div>
    <div id="none-list-msg" v-else>暂无收货地址</div>
    <!-- <div id="none-list-msg">暂无收货地址</div> -->
    <div class="add-btn" @click="addAddress('add')"><i class="add-address"></i><span>+ 添加地址</span></div>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
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
 import bombBox from 'components/plugins/bombBox';

  export default {
    data () {
      return {
        showList: false,
        bombStr: '您确定要删除地址吗？',
        tipsStr: '', // 提示字段
        delId: '' // 需要删除的地址id
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取地址列表
      addressList: state => state.addressList
    }),
    created () {
      this.$nextTick(() => {
        this.getList();
      });
    },
    filters: {
      formatDate (area) {
        return area.split(' ').join('-');
      }
    },
    methods: {
      getList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('addressList', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          // console.log(res);
          if (res.code === 1) {
            this.showList = true;
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 添加、编辑收货地址
      addAddress (type) {
        this.$router.push({name: 'addEdit', query: {id: type}});
      },
      // 删除收货地址
      deleteAdd (id) {
        // 先保存当前地址id
        this.delId = id;
        this.$refs.bombbox._showBomb();
      },
      submitMsg () {
        // 弹框确定回调按钮
        this.$refs.loading.showLoad();
        this.$store.dispatch('delAddress', {token: this.memberLogin.token, id: this.delId}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this.getList();
              this._showTip('删除地址成功');
            } else {
              this._showTip(res.msg);
            }
         });
      },
      // 设置为默认地址
      chooseDefault (id) {
        this.$refs.loading.showLoad();
        this.$store.dispatch('chooseDefault', {token: this.memberLogin.token, id: id, is_default: 1}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this.getList();
              this._showTip('修改成功');
            } else {
              this._showTip(res.msg);
            }
         });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
        tips,
        loading,
        bombBox
    }
  };
</script>

<style scoped>
  .address-page{}
  .address-page .add-btn{position: fixed;bottom: 0;left:0;width:100%;background: #4fccdb;text-align: center;padding: 0.8rem 0;z-index: 111;}
  /*.address-page .add-btn .add-address{display: inline-block;vertical-align: middle;width: 1.6rem;height:1.6rem;background: url(./address_add_icon.png) no-repeat;background-size: 100% 100%;}*/
  .address-page .add-btn span{display: inline-block;vertical-align: middle;font-size: 0.9rem;color:#fff;}
  .address-page .address-wrapper{padding-bottom: 2.6rem;color:#555555;background: #fff;}
  .address-page .address-wrapper .list-item{position: relative;}
  .address-page .address-wrapper .list-item.border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .address-page .address-wrapper .list-item{position: relative;padding: 0.5rem 0.5rem 0 0.5rem;}
  .address-page .address-wrapper .inner-msg{background: url(./address_bg.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .inner-msg .one-line{overflow: hidden;padding: 0.4rem 0.6rem;position: relative;}
  .address-page .address-wrapper .inner-msg .one-line:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .address-page .address-wrapper .inner-msg .icon-one{float:left;width: 1.4rem;height:1.4rem;background: url(./add_icon_one.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .inner-msg .address{font-size: 0.9rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;margin-top: 0.15rem;height: 1.1rem;line-height: 1.1rem;}
  .address-page .address-wrapper .inner-msg .two-line{overflow: hidden;padding: 0.6rem 0.6rem;font-size: 0.9rem;}
  .address-page .address-wrapper .inner-msg .icon-two{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./address_icon_two.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .inner-msg .icon-three{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./address_icon_three.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .inner-msg span{display: inline-block;vertical-align: middle;}
  .address-page .address-wrapper .edit-all{overflow: hidden;padding: 0.6rem;font-size: 0.9rem;}
  .address-page .address-wrapper .edit-all .left-choose{float:left;cursor:pointer;}
  .address-page .address-wrapper .edit-all .left-choose i{vertical-align: middle;display: inline-block;width: 1.5rem;height:1.5rem;background: url(./select_no.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .edit-all .left-choose i.index{background: url(./select_index.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .edit-all .left-choose span{vertical-align: middle;display: inline-block;}
  .address-page .address-wrapper .edit-all .right-choose span{vertical-align: middle;display: inline-block;}
  .address-page .address-wrapper .edit-all .right-choose{float:right;margin-left: 0.8rem;cursor:pointer;}
  .address-page .address-wrapper .edit-all .right-choose i{vertical-align: middle;display: inline-block;width: 1.5rem;height:1.5rem;background: url(./address_edit.png) no-repeat;background-size: 100% 100%;}
  .address-page .address-wrapper .edit-all .right-choose i.del-btn{background: url(./address_del.png) no-repeat;background-size: 100% 100%;}
  
</style>
