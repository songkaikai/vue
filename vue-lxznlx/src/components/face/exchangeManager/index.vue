<template>
  <div class="exchange-manager-page" ref="exchange" v-scroll="_addList">
    <!-- 交易管理导航 -->
    <div class="exchange-choose border-bottom-1px">
      <!-- , topTypeArr.length - 1 > index : 'border-right-1px' : '' -->
      <div class="list-item" :class="[topType === index ? 'index' : '']" @click="_chooseType(index)" v-for="(item, index) in topTypeArr">
        <i :class="[topTypeClassArr[index]]"></i>
        <p>{{ item }}</p>
      </div>
    </div>
    <div class="all-content-wrapper">
      <!-- 我要消费 -->
      <div class="choose-wrapper" v-if="topType === 0">
        <!-- 我要消费的导航 -->
        <!-- <div class="exchange-sub-choose border-bottom-1px">
          <span v-for="(item, index) in typeSubArr" :class="[chooseSubType === index ? 'index' : '']" @click="_chooseSubType(index)">{{ item }}</span>
        </div> -->
        <!-- 我的余额 -->
        <div class="inner-top-wrapper">
          <!-- <div class="inner-content" v-if="chooseSubType === 0"> -->
          <div class="inner-content">
            <div class="inner-wrapper-padding">
              <div class="list-item border-bottom-1px">
                <span class="left">可用积分</span>
                <span class="right">{{ memberInfo.balance }}</span>
              </div>
              <div class="list-item border-bottom-1px">
                <span class="left">可用激活码</span>
                <span class="right">{{ memberInfo.active_currency }}</span>
              </div>
              <div class="list-item border-bottom-1px">
                <span class="left">消费后积分</span>
                <span class="right">{{ afterYe }}</span>
              </div>
              <div class="list-item">
                <span class="left">剩余激活码</span>
                <span class="right">{{ afterPdb }}</span>
              </div>
            </div>
          </div>
          <!-- 我要消费 -->
          <!-- <div class="inner-content" v-else-if="chooseSubType === 1"> -->
          <div class="inner-content" style="border-top: 0.4rem solid #eee">
            <div class="xf-inner-wrapper">
              <div class="list-item">
                <span class="left">消费套餐</span>
                <!-- 选择套餐 -->
                <div class="right-content">
                  <span class="tc-icon" :class="[chooseTc === index ? 'blue' : '']" @click="_chooseTc(index)" v-for="(item, index) in lcDetailList">{{ item.price }}</span>
                </div>
              </div>
              <div class="list-item">
                <span class="left">选择消费套餐</span>
                <div class="right-content">
                  <input type="text" disabled="disabled" v-model="xftc" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">消耗激活码</span>
                <div class="right-content">
                  <input type="text" disabled="disabled" v-model="xfCount" />
                </div>
              </div>
              <div class="list-item">
                <span class="left">交易密码</span>
                <div class="right-content">
                  <input type="password" v-model="dataOption.payPass" @input="filter('payPass')" />
                </div>
              </div>
              <div class="list-item">
                <span class="left"></span>
                <div class="right-content">
                  <span class="sure-btn" @click="_submit">确定消费</span>
                  <span class="sure-btn" @click="_xflist">消费记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 静态收益 -->
      <div class="choose-wrapper" v-else-if="topType === 1">
        <div class="list-wrapper">
          <div class="list-item" :class="[jtCountList.length - 1 > index ? 'border-bottom-1px' : '']" v-for="(item, index) in jtCountList">
            <p class="one">
              <span class="date">{{ item.add_date }}</span>
              <span class="money">{{ item.type === 1 ? '-' + item.out : '+' + item.in }}</span>
            </p>
            <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.desc }}</p>
          </div>
        </div>
      </div>
      <!-- 分享收益 -->
      <div class="choose-wrapper" v-else-if="topType === 2">
        <div class="list-wrapper">
          <div class="list-item" :class="[fxCountList.length - 1 > index ? 'border-bottom-1px' : '']" v-for="(item, index) in fxCountList">
            <p class="one">
              <span class="date">{{ item.add_date }}</span>
              <span class="money">{{ item.type === 1 ? '-' + item.out : '+' + item.in }}</span>
            </p>
            <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.desc }}</p>
          </div>
        </div>
      </div>
      <!-- 共享收益 -->
      <div class="choose-wrapper" v-else-if="topType === 3">
        <div class="list-wrapper">
          <div class="list-item" :class="[gxCountList.length - 1 > index ? 'border-bottom-1px' : '']" v-for="(item, index) in gxCountList">
            <p class="one">
              <span class="date">{{ item.add_date }}</span>
              <span class="money">{{ item.type === 1 ? '-' + item.out : '+' + item.in }}</span>
            </p>
            <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有数据时显示 -->
    <div class="none-msg-wrapper" v-show="showNoneMsg">
      <div class="none-msg">
        <!-- <i class="none-msg-icon"></i> -->
        <p class="desc">暂无记录</p>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        tipsStr: '', // 错误提示的字段
        topType: 0, // 交易管理顶部导航
        topTypeArr: ['我要消费', '消费收益', '分享收益', '共享收益'], // 交易管理顶部导航显示的字段
        topTypeClassArr: ['one-icon', 'two-icon', 'thre-icon', 'four-icon'], // 交易管理顶部导航icon的class
        // chooseSubType: 0, // 我要消费的子导航
        // typeSubArr: ['我的余额', '我要消费'], // 我要消费子导航的字段
        chooseTc: -1, // 默认为-1什么都不选中
        // tcArr: [2000, 5000, 10000, 30000, 50000], // 我要消费里面的套餐
        listOption: {
            token: '', // 会员TOKEN
            type: '1', // 日志类型1静态收益2分享收益3共享收益6岗位津贴
            pages: 1, // 当前页
            pageSize: 20 // 每页显示数量
         }, // 提现记录提交的参数
         winHei: 0, // window的高度
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         showLists: false, // 列表是否显示
         showNoneMsg: false, // 显示没有任何数据
         chooseAgain: false,
         dataOption: {
            token: '', // 会员TOKEN
            productId: '', // 理财产品ID
            payPass: '' // 支付密码
         },
         afterYe: '0.00', // 消费后计算出的余额
         afterPdb: 0, // 消费后计算出的排单币
         xftc: '', // 消费套餐类型
         xfCount: '' // 消耗的排单币
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        this._getMsgInfo();
        // 如果页面上有查询参数
        var type = this.$route.query.type;
        if (type) {
          this._chooseType(type);
        }
      });
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo,
      // 理财列表
      lcDetailList: state => state.lcDetailList,
      // 静态收益日志
      jtCountList: state => state.jtCountList,
      // 分享收益日志
      fxCountList: state => state.fxCountList,
      // 共享收益日志
      gxCountList: state => state.gxCountList
    }),
    methods: {
      // 获取页面数据
      _getMsgInfo () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('lcDetailList', {token: this.memberLogin.token}).then(() => {
          this.$refs.loading.hideLoad();
        });
      },
      _chooseType (type) {
        if (this.topType !== type) {
          this.topType = type;
          this.showNoneMsg = false;
          this.chooseAgain = false;
          if (type !== 0) {
            // alert(1);
             this.listOption.type = String(type);
             // 获取日志列表
             this._getList();
          }
          // console.log(type);
        }
      },
      // 跳转消费记录
      _xflist () {
        this.$router.push({name: 'xfList'});
      },
      // _chooseSubType (type) {
      //   if (this.chooseSubType !== type) {
      //     this.chooseSubType = type;
      //   }
      // },
      // 选择套餐
      _chooseTc (type) {
        if (this.chooseTc !== type) {
          this.chooseTc = type;
          this.xftc = this.lcDetailList[type].price;
          this.xfCount = this.lcDetailList[type].active_currency;
          // 选中套餐后计算的结果
          this.afterYe = (parseFloat(this.memberInfo.balance) - parseFloat(this.lcDetailList[type].price)).toFixed(2);
          this.afterPdb = parseInt(this.memberInfo.active_currency) - parseInt(this.lcDetailList[type].active_currency);
          // 选中套餐的id
          this.dataOption.productId = parseInt(this.lcDetailList[type].id);
        }
      },
      // 提交消费的套餐
      _submit () {
        if (this.chooseTc === -1) {
          this._showTip('请选择消费的套餐');
          return;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.payPass)) {
          this._showTip('请输入6-18位的交易密码');
          return;
        }
        // if (parseFloat(this.afterYe) < 0) {
        //   this._showTip('余额不足');
        //   return;
        // }
        // if (parseInt(this.afterPdb) < 0) {
        //   this._showTip('排单币不足');
        //   return;
        // }
        // 提交套餐
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('addLcOrder', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this._showTip('消费成功');
            // 清空数据
            this.xftc = '';
            this.xfCount = '';
            this.afterYe = '0.00';
            this.afterPdb = 0;
            this.chooseTc = -1;
            this.dataOption = {
                token: '', // 会员TOKEN
                productId: '', // 理财产品ID
                payPass: '' // 支付密码
             };
          } else {
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
          }
        });
      },
      // 获取提现记录
      _getList () {
        this.$refs.loading.showLoad();
        this._subList().then(res => {
          this.$refs.loading.hideLoad();
          this.chooseAgain = true;
          if (res.data.lists.length === 0) {
            this.showNoneMsg = true;
          }
          if (res.data.lists.length > 0) {
            this.showLists = true;
          }
          // console.log(res.data.length < this.dataOption.pagesize);
          if (res.data.lists.length < this.dataOption.pagesize) {
            this.getAgain = false;
          }
        });
      },
      _subList () {
        this.listOption.token = this.memberLogin.token;
        return this.$store.dispatch('logCountList', this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.exchange-manager-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.listOption.pages += 1;
            this._subList().then(res => {
              this.loadingShow = false;
              // console.log(res.data.lists);
              if (res.data.lists.length === this.listOption.pageSize) {
                this.getAgain = true;
              }
            });
          }
        }
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
      loading,
      tips
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .exchange-manager-page
    padding-bottom: 3.2rem
    .none-msg-wrapper
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: -1
      background: #fff
      .none-msg
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        margin: auto
        width: 8rem
        height: 2rem
        text-align: center
        color: #cacaca
        font-size: 0.8rem
        i
          display: inline-block
          width: 3rem
          height: 3rem
          background: url(./no_msg_icon.png) center no-repeat
          background-size: 100% 100%
    .exchange-choose
        position: fixed
        top: 0
        left: 0
        width: 100%
        padding: 0.5rem 0
        background: #fff
        z-index: 100
        overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#e6e6e6)
        .list-item
          position: relative
          float: left
          width:  25%
          padding: 0.2rem 0
          text-align: center
          font-size: 0.8rem
          color: #cacaca
          &.border-right-1px
            border-right-1px(#f3f3f3)
          i
            display: inline-block
            width: 2rem
            height: 2rem
            margin-bottom: 0.1rem
            &.one-icon
                background: url(./exchange_one.png) center no-repeat
                background-size: 100% 100%
            &.two-icon
                background: url(./exchange_two.png) center no-repeat
                background-size: 100% 100%
            &.thre-icon
                background: url(./exchange_three.png) center no-repeat
                background-size: 100% 100%
            &.four-icon
                background: url(./exchange_three.png) center no-repeat
                background-size: 100% 100%
          &.index
            color: #015cad
            .one-icon
                background: url(./exchange_one_index.png) center no-repeat
                background-size: 100% 100%
            .two-icon
                background: url(./exchange_two_index.png) center no-repeat
                background-size: 100% 100%
            .thre-icon
                background: url(./exchange_three_index.png) center no-repeat
                background-size: 100% 100%
            .four-icon
                background: url(./exchange_three_index.png) center no-repeat
                background-size: 100% 100%
    .all-content-wrapper
      padding-top: 4.4rem
      .choose-wrapper
        margin-top: 0.3rem
        background: #fff
        .list-wrapper
          padding: 0 1rem
          .list-item
            position: relative
            padding: 0.5rem 0
            font-size: 0.9rem
            &.border-bottom-1px
              border-bottom-1px(#e6e6e6)
            .one
              overflow: hidden
              .date
                float: left
                color: #b4b4b4
              .money
                float: right
                color: #f36341
            .desc
              margin-top: 0.2rem
              max-height: 2rem
              line-height: 1rem
              font-size: 0.9rem
              overflow: hidden
        .inner-top-wrapper
          // margin-top: 2.8rem
        .exchange-sub-choose
          position: fixed
          top: 4.7rem
          left: 0
          width: 100%
          z-index: 110
          overflow: hidden
          background: #fff
          font-size: 0.9rem
          &.border-bottom-1px
            border-bottom-1px(#eff1f2)
          span
            float: left
            padding: 0.8rem 0
            width: 50%
            text-align: center
            color: #969696
            &.index
              position: relative
              color: #015cad
              &:after
                position: absolute
                content: ''
                bottom: 0
                left: 0
                width: 100%
                height: 2px
                background: #0c73c3
      .inner-content
        .inner-wrapper-padding
          padding: 0 1.2rem
          .list-item
            position: relative
            padding: 0.8rem 0.2rem
            font-size: 0.9rem
            overflow: hidden
            &.border-bottom-1px
              border-bottom-1px(#e6e6e6)
            .left
              float: left
              color: #1f1f1f
            .right
              float: right
              color: #fe6900
        .xf-inner-wrapper
          padding: 0.3rem 0.5rem
          .list-item
            padding: 0.3rem 0
            overflow: hidden
            .left
              float: left
              width: 6rem
              text-align: right
              padding: 0.3rem 0
              font-size: 0.9rem
              height: 0.9rem
              line-height: 0.9rem
              color: #1f1f1f
            .right-content
              padding: 0 0 0 6.4rem
              .tc-icon
                display: inline-block
                margin: 0 0.3rem 0.3rem 0
                width: 3.3rem
                padding: 0.3rem 0
                height: 0.9rem
                line-height: 0.9rem
                font-size: 0.8rem
                text-align: center
                border-radius: 3px
                border: 1px solid #015cad
                color: #015cad
                &.blue
                  background: #015cad
                  color: #fff
              input
                border: 1px solid #015cad
                padding: 0.25rem 4%
                width: 86%
                height: 0.9rem
                line-height: 0.9rem
                font-size: 0.8rem
              .sure-btn
                display: inline-block
                background: #68a2f4
                height: 2rem
                line-height: 2rem
                width: 4.8rem
                text-align: center
                font-size: 0.8rem
                color: #fff
                border-radius: 3px
</style>
