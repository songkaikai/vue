<template>
  <div class="address-list">
    <router-link :to="{name: 'index'}" class="return-btn"><i></i><span>返回</span></router-link>
    <div class="address-list-wrapper">
      <div class="address-title"></div>
      <div class="list-wrapper">
        <div class="list-item" v-for="(item, index) in addressList">
          <div class="item">
             <span class="left">{{ item.consignee }}</span><span class="right">{{ item.mobile }}</span>
          </div>
         <div class="item address">{{ item.area }} {{ item.address }}</div>
         <div class="item">
           <a class="delete-icon" @click="_deleteAdd(item.id)" v-if="addressList.length !== 1"></a>
           <router-link :to="{name: 'address', params: {id: index}}" class="edit-icon"></router-link>
         </div>
        </div>
      </div>
    </div>
    <router-link :to="{name: 'address', params: {id: 'edit'}}" class="sure-btn" v-if="addressList.length < 3"></router-link>
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

  export default {
    data () {
      return {
        tipsStr: ''
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      addressList: state => state.addressList
    }),
    created () {
      this.$nextTick(() => {
        this.getList();
      });
    },
    methods: {
      getList () {
         this.$refs.loading.showLoad();
         this.$store.dispatch('addressList', {token: this.memberLogin.token}).then(() => {
            this.$refs.loading.hideLoad();
         });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      },
      _deleteAdd (id) {
        this.$refs.loading.showLoad();
         this.$store.dispatch('removeAdd', {token: this.memberLogin.token, addressId: id}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.message === 'OK') {
              this._showTip('删除成功');
              // 重新获取地址
              this.getList();
            } else {
              this._showTip('删除失败');
            }
         });
      }
    },
    components: {
      loading,
      tips
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .address-list
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      background: url(../assets/xz_bg.jpg) no-repeat
      background-size: 100% 100%
      .return-btn
        position: absolute
        top: 1rem
        left: 1rem
        color: #fff
        font-size: 0.8rem
        i
          display: inline-block
          vertical-align: middle
          margin: 0 0.3rem
          width: 1.8rem
          height: 1.8rem
          background: url(../assets/blue_left_btn.png) center no-repeat
          background-size: 100% 100%
      .address-list-wrapper
          position: absolute
          top: 0
          left: 0
          bottom: 0
          right: 0
          width: 13rem
          height: 20rem
          padding: 1.2rem 1.5rem 2rem 1.5rem
          margin: auto
          background: url(../assets/shade_bg.png) no-repeat
          background-size: 100% 100%
      .sure-btn
          position: absolute
          bottom: 1.8rem
          left: 50%
          width: 12rem
          height: 2.5rem
          margin-left: -6rem
          background: url(../assets/add_ress_icon.png) no-repeat
          background-size: 100% 100%
      .address-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../assets/address_title.png) no-repeat
          background-size: 100% 100%
      .list-item
        margin: 1.2rem 0
        font-size: 0.85rem
        color: #fff
        .item
          overflow: hidden
          padding: 0.1rem 0
          word-wrap:break-word
          &.address
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
          .left
            float: left
          .right
            float: right
            line-height: 0.95rem
          a
            float: right
            margin: 0.3rem 0 0.3rem 0.5rem
            width: 1.8rem
            height: 1.8rem
            &.edit-icon
              background: url(../assets/address_edit.png) no-repeat
              background-size: 100% 100%
            &.delete-icon
              background: url(../assets/address_delete.png) no-repeat
              background-size: 100% 100%
</style>
