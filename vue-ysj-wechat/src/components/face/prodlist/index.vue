<template>
  <div class="prod-list">
    <div class="list-show" v-show="listShow">
      <div class="nav-header">
        <!-- <span ></span> -->
        <span :class="typeNow === index ? 'border-bottom-2px' : ''" v-for="(item, index) in category" :key="item.id" @click="_changeType(item.id,index)">{{ item.name }}</span>
      </div>
      <div class="prod-wrapper" v-if="hasData">
        <div class="prod-detail border-bottom-1px" v-for="item in prodList" :key="item.id">
          <router-link :to="{name: 'pordDetail', query: {id: item.id}}">
            <img :src="item.main_pic" alt="">
          </router-link>
        </div>
      </div>
      <div class="prod-wrapper" v-else>
        <p class="tips">暂无此类型产品</p>
      </div>
    </div>
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
        name: 'pord-list',
        tipsStr: '',
        listShow: false, // 页面内容是否显示
        hasData: false, // 当前是否有列表
        typeOfPhone: ['手机', '平板电脑', '其他'], // 所有类型
        typeNow: 0, // 当前选中的类型
        dataOption: {
          cid: '', // 分类id
          pagesize: 30, // 每页显示数量
          page: 1 // 页码
        }
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        category: state => state.category,
        prodList: state => state.prodList
      })
    },
    created () {
      // 利用路由的str来获取token
      var str = this.$route.query.str;
      // console.log(1);
      // 获取个人信息
      // this.$store.dispatch('memberInfo', {token: token});
      // 等待dom加载完毕
      this.$nextTick(() => {
        if (!this.memberLogin.token) {
          this.$refs.loading.showLoad();
          this.$store.dispatch('memberLogin', {str: str}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              // 获取导航分类
              this._getNavList();
            } else {
              this._showTip(res.msg);
            }
          });
        } else {
          // 获取导航分类
          this._getNavList();
        }
      });
    },
    methods: {
      _getNavList () {
        // 获取导航分类
        this.$refs.loading.showLoad();
        this.$store.dispatch('category', {}).then(res => {
          // console.log(res);
          this.dataOption.cid = res.data[0].id;
          this._getList();
        });
      },
      // 切换类型
      _changeType (id, index) {
        if (index !== this.typeNow) {
          this.typeNow = index;
          // 更换商品列表的状态。重新获取列表
          this.dataOption.page = 1;
          this.dataOption.cid = id;
          this.$refs.loading.showLoad();
          this._getList();
        }
      },
      _getList () {
        this._getSubList().then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            if (res.data.lists.length === 0) {
              this.hasData = false;
            } else {
              this.hasData = true;
            }
            this.listShow = true;
          } else {
            this._showTip(res.msg);
          }
        });
      },
      _getSubList () {
        return this.$store.dispatch('getProdList', this.dataOption);
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .prod-list
    .nav-header
      position: fixed
      top: 0
      left: 0
      width: 100%
      overflow: hidden
      background: #303030
      z-index: 88
      span
        position: relative
        float: left
        padding: 0.8rem 0
        width: 33.3%
        text-align: center
        font-size: 0.9rem
        color: #fff
        &.border-bottom-2px
          &:after
            position: absolute
            bottom: 0
            left: 0
            width: 100%
            height: 2px
            background: #fff
            content: ''
    .prod-wrapper
      padding-top: 2.5rem
      width: 100%
      .tips
        margin-top: 8rem
        text-align: center
        font-size: 0.9rem
      .prod-detail
        position: relative
        &.border-bottom-1px
          border-bottom-1px(#ccc)
        img
          display: block
          width: 100%
          height: auto
</style>
