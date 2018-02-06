<template>
  <div class="activation-code-page" ref="activation" v-scroll="_addList">
    <div class="withdraw-choose border-bottom-1px">
      <span v-for="(item, index) in typeArr" :class="[chooseType === index ? 'index' : '']" @click="_chooseType(index)">{{ item }}</span>
    </div>
    <!-- 申请提现 -->
    <div class="withdraw-wrapper wrapper-absolute" style="background:#fff;margin-top: 2.4rem" v-if="chooseType === 0">
      <!-- 显示当前账户的积分 -->
      <div class="other-count">
        <div class="list-item border-right-1px" :class="[ dataOption.transType === 3 ? 'index' : '']" @click='_changeSubType(0)'>
          <p class="name">激活码</p>
          <p class="money">{{ memberInfo.active_currency }}</p>
        </div>
        <div class="list-item border-right-1px" :class="[ dataOption.transType === 1 ? 'index' : '']" @click='_changeSubType(1)'>
          <p class="name">余额</p>
          <p class="money">{{ memberInfo.balance }}</p>
        </div>
        <div class="list-item border-right-1px" :class="[ dataOption.transType === 2 ? 'index' : '']" @click='_changeSubType(2)'>
          <p class="name">收益</p>
          <p class="money">{{ memberInfo.integral_balance }}</p>
        </div>
        <div class="list-item" :class="[ dataOption.transType === 4 ? 'index' : '']" @click='_changeSubType(3)'>
          <p class="name">商城积分</p>
          <p class="money">{{ memberInfo.shop_integral }}</p>
        </div>
      </div>
      <div class="inner-edit">
        <div class="list-item">
          <span class="left">用户名</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.targetMobile" @input="filter('targetMobile', 'dataOption')" @blur="_searchMember" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">账户</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.trueName" disabled="disabled" @input="filter('trueName', 'mokeOption')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">手机号</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.mobile" disabled="disabled" @input="filter('mobile', 'mokeOption')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">积分类型</span>
          <div class="ipt">
            <input type="text" v-model="codeStr" disabled="disabled" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">转出数量</span>
          <div class="ipt">
            <input type="tel" v-model="dataOption.transCount" @input="filter('transCount', 'dataOption')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">转账说明</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.remark" @input="filter('remark', 'dataOption')" maxlength="30" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">交易密码</span>
          <div class="ipt">
            <input type="password" v-model="dataOption.payPass" @input="filter('payPass', 'dataOption')" />
          </div>
        </div>
        <div class="submit-btn" @click="_submit">确定</div>
        <!-- 只有选中蓝享币才能显示 -->
        <p class="tips" v-if="dataOption.transType === 3">* 激活码只能同一网络互转</p>
        <!-- 只有余额选中才能显示 -->
        <p class="tips" v-if="dataOption.transType === 1">* 余额只能同一网络互转</p>
        <p class="tips" v-if="dataOption.transType === 2">* 收益只能同一网络互转</p>
        <p class="tips" v-if="dataOption.transType === 4">* 商城积分只能同一网络互转</p>
      </div>
    </div>
    <!-- 转账记录 -->
    <div class="withdraw-wrapper" v-if="chooseType === 1">
      <div class="transwrapper border-bottom-1px">
        <span v-for="(item, index) in exCodeArr" :class="[ chooseList === index ? 'index' : '']" @click="_changeListShow(index)">{{ item }}</span>
      </div>
      <div v-if="showLists" style="z-index:-1;">
        <div class="inner-wrapper">
          <div class="list-wrapper" style="padding: 0 0.8rem" v-if="!showNoneMsg">
            <div class="list-item border-bottom-1px">
              <p class="title">
                <span class="time">时间</span>
                <span class="money">金额</span>
              </p>
              <p class="title">
                <span class="time">付款人用户名</span>
                <span class="money">收款人用户名</span>
              </p>
              <p class="desc">日志详情</p>
            </div>
          </div>
          <!-- 提现记录的列表 -->
          <div class="list-wrapper" style="padding: 0 0.8rem" v-if="chooseList === 0">
            <div class="list-item border-bottom-1px" v-for="(item, index) in jhbCountList">
              <p class="title">
                <span class="time">{{ item.add_time }}</span>
                <span class="money">{{ item.trans_type === 1 ? '-' + item.trans_count : '+' + item.trans_count}}</span>
              </p>
              <p class="title">
                <span class="time">{{ item.source_name }}</span>
                <span class="money">{{ item.target_name}}</span>
              </p>
              <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.remark }}</p>
            </div>
          </div>
          <div class="list-wrapper" style="padding: 0 0.8rem" v-if="chooseList === 1">
            <div class="list-item border-bottom-1px" v-for="(item, index) in yeCountList">
              <p class="title">
                <span class="time">{{ item.add_time }}</span>
                <span class="money">{{ item.trans_type === 1 ? '-' + item.trans_count : '+' + item.trans_count}}</span>
              </p>
              <p class="title">
                <span class="time">{{ item.source_name }}</span>
                <span class="money">{{ item.target_name}}</span>
              </p>
              <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.remark }}</p>
            </div>
          </div>
          <div class="list-wrapper" style="padding: 0 0.8rem" v-if="chooseList === 2">
            <div class="list-item border-bottom-1px" v-for="(item, index) in syCountList">
              <p class="title">
                <span class="time">{{ item.add_time }}</span>
                <span class="money">{{ item.trans_type === 1 ? '-' + item.trans_count : '+' + item.trans_count}}</span>
              </p>
              <p class="title">
                <span class="time">{{ item.source_name }}</span>
                <span class="money">{{ item.target_name}}</span>
              </p>
              <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.remark }}</p>
            </div>
          </div>
           <div class="list-wrapper" style="padding: 0 0.8rem" v-if="chooseList === 3">
            <div class="list-item border-bottom-1px" v-for="(item, index) in jfCountList">
              <p class="title">
                <span class="time">{{ item.add_time }}</span>
                <span class="money">{{ item.trans_type === 1 ? '-' + item.trans_count : '+' + item.trans_count}}</span>
              </p>
              <p class="title">
                <span class="time">{{ item.source_name }}</span>
                <span class="money">{{ item.target_name}}</span>
              </p>
              <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.remark }}</p>
            </div>
          </div>
        </div>
        <p class="loading-bottom" v-show="loadingShow"><i class="icon-spinner"></i><span>正在加载中...</span></p>
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
         tipsStr: '',
         chooseType: 0, // 顶部导航栏的选项
         typeArr: ['转账管理', '转账记录'],
         dataOption: {
            token: '', // 会员TOKEN
            transType: 3, // 转账类型1余额转账2收益转账3蓝享币转账
            targetMobile: '', // 收款人手机号
            transCount: '', // 转账个数
            remark: '', // 备注
            payPass: '' // 支付密码
         },
         // 当前搜索到的用户
         mokeOption: {
             trueName: '',
             mobile: ''
         },
         optArr: [3, 1, 2, 4], // 转账类型1余额转账2收益转账3蓝享币转账
         exCodeArr: ['激活码', '余额', '收益', '商城积分'],
         codeStr: '激活码',
         listGetAgian: true, // 只有进入页面第一次进来才能触发成为false
         getListPathList: ['jhbCountList', 'yeCountList', 'syCountList', 'jfCountList'], // 获取列表需要的接口地址
         listOption: {
            token: '', // 会员TOKEN
            pages: 1, // 当前页
            pageSize: 20 // 每页显示数量
         }, // 各个记录提交的参数
         chooseList: 0, // 当前选中的是哪个记录列表
         showNoneMsg: false, // 显示没有任何数据
         winHei: 0, // window的高度
         chooseAgain: true,
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         showLists: false // 列表是否显示
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo,
      jhbCountList: state => state.jhbCountList,
      yeCountList: state => state.yeCountList,
      syCountList: state => state.syCountList,
      jfCountList: state => state.jfCountList
    }),
    methods: {
      _changeSubType (type) {
        if (this.codeStr !== this.exCodeArr[type]) {
          // console.log(type);
          this.codeStr = this.exCodeArr[type];
          this.dataOption.transType = this.optArr[type];
          // console.log(this.dataOption.transType);
        }
      },
      // 查找当前用户是否存在
      _searchMember () {
        if (!/^[A-Za-z0-9]{3,11}$/.test(this.dataOption.targetMobile)) {
          this._showTip('用户名必须是3-8位的数字或英文');
          return;
        }
        // 进行查询
        this.$refs.loading.showLoad();
        this.$store.dispatch('getBuyUname', {token: this.memberLogin.token, userName: this.dataOption.targetMobile}).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this._showTip('获取用户信息成功');
            this.mokeOption = {
               trueName: res.data.nick_name,
               mobile: res.data.mobile
            };
          } else {
            // 清空用户数据
            this.mokeOption = {
               trueName: '',
               mobile: ''
            };
            this._showTip(res.data.message.replace(/["]/g, ''));
            return;
          }
        });
      },
      _chooseType (type) {
        if (this.chooseType !== type) {
          this.chooseType = type;
          // 如果是1就是加载提现记录
          // if (type === 1 && this.listGetAgian) {
          if (type === 1) {
            // this.listGetAgian = false;
            // console.log(1);
            this._getList();
          }
        }
      },
      // 提交信息
      _submit () {
        if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.targetMobile)) {
          this._showTip('用户名必须是3-20位的数字或英文');
          return;
        }
        if (this.dataOption.transCount === '') {
          this._showTip('转出数量不能为空');
          return;
        }
        if (this.dataOption.transCount === '') {
          this._showTip('转出数量不能为空');
          return;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.payPass)) {
          this._showTip('交易密码不能少于6位数');
          return;
        }
        // 选中当前转账的类型
        if (this.dataOption.transType === 3) {
          if (parseInt(this.memberInfo.active_currency) < this.dataOption.transCount) {
            this._showTip('激活码数量不足');
            return;
          }
        } else if (this.dataOption.transType === 1) {
          if (parseInt(this.memberInfo.balance) < this.dataOption.transCount) {
            this._showTip('余额不足');
            return;
          }
        } else if (this.dataOption.transType === 2) {
          if (parseInt(this.memberInfo.integral_balance) < this.dataOption.transCount) {
            this._showTip('收益不足');
            return;
          }
        } else if (this.dataOption.transType === 4) {
          // console.log(1);
          if (parseInt(this.memberInfo.shop_integral) < this.dataOption.transCount) {
            this._showTip('商城积分不足');
            return;
          }
        }
        // 提交数据
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('transOrderDetail', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this._showTip('转账成功');
            // 重新获取用户资料
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this.dataOption = {
                token: '', // 会员TOKEN
                transType: this.codeStr === '激活码' ? 3 : this.codeStr === '余额' ? 1 : this.codeStr === '收益' ? 2 : 4, // 转账类型1余额转账2收益转账3蓝享币转账
                targetMobile: '', // 收款人手机号
                transCount: '', // 转账个数
                remark: '', // 备注
                payPass: '' // 支付密码
            };
            this.mokeOption = {
               trueName: '',
               mobile: ''
            };
            // this.
          } else {
            // this._showTip(res.data.message.replace(/["]/g, ''));
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
          }
        });
      },
      // 当前显示的记录是哪个分类
      _changeListShow (type) {
        if (this.chooseList !== type) {
          // console.log(type);
          this.chooseList = type;
          this.showNoneMsg = false;
          // 加载中关闭显示
          this.loadingShow = false;
          this.showLists = false;
          this.getAgain = true;
          this.chooseAgain = false;
          this.listOption.pages = 1;
          this._getList();
        }
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
          if (res.data.lists.length < this.listOption.pageSize) {
            this.getAgain = false;
          }
        });
      },
      _subList () {
        this.listOption.token = this.memberLogin.token;
        return this.$store.dispatch(this.getListPathList[this.chooseList], this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.activation-code-page').height());
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
      filter (str, type) {
        this[type][str] = this[type][str].replace(/\s/g, '');
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
  
  .activation-code-page
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
    .withdraw-choose
        position: fixed
        top: 0
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
    .withdraw-wrapper
      margin-top: 5rem
      // background: #fff
      // &.wrapper-absolute
      //   margin: 0
      //   position: absolute
      //   top: 2.5rem
      //   left: 0
      //   right: 0
      //   bottom: 0
      //   background: #fff
      .transwrapper
        position: fixed
        top: 2.45rem
        left: 0
        width: 100%
        z-index: 130
        background: #fff
        overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#eff1f2)
        span
          position: relative
          float: left
          padding: 0.8rem 0
          width: 25%
          text-align: center
          font-size: 0.85rem
          color: #666
          &.index
            color: red
            &:after
              position: absolute
              content: ''
              bottom: 0
              left: 10%
              width: 80%
              height: 2px
              background: #fe772a
      .other-count
        border-top: 0.5rem solid #f2f6f9
        border-bottom: 0.3rem solid #f2f6f9
        overflow: hidden
        .list-item
          position: relative
          float: left
          padding: 0.8rem 0
          width: 25%
          text-align: center
          &.border-right-1px
            border-right-1px(#f2f6f9)
          &.index:after
            position: absolute
            content: ''
            bottom: 0
            left: 10%
            width: 80%
            height: 2px
            background: #fe772a
          .name
            margin-bottom: 0.4rem
            color: #1f1f1f
            font-size: 0.9rem
          .money
            color: #fe772a
            font-size: 0.75rem
      .inner-edit
        padding: 1rem 1rem 1.5rem 1rem
        .tips-content
          border-radius: 4px
          margin-top: 0.8rem
          padding: 0.4rem 0.6rem
          background: #f5f5f5
          .title
            font-size: 0.9rem
            color: #828282
          .content
            margin-top: 0.3rem
            font-size: 0.8rem
            line-height: 0.9rem
            color: #828282
        .submit-btn
          margin: auto
          margin-top: 0.6rem
          padding: 0.6rem 0
          width: 100%
          border-radius: 4px
          text-align: center
          background: #62a5e7
          color: #fff
          font-size: 0.9rem
        .tips
          margin-top: 0.8rem
          color: #fe772a
          font-size: 0.9rem
        .list-item
          padding: 0.2rem 0
          overflow: hidden
          .left
            float: left
            width: 4.5rem
            text-align: right
            padding: 0.14rem 0
            height: 1.5rem
            line-height: 1.5rem
            font-size: 0.9rem
            color: #1f1f1f
          .ipt
            padding: 0 0.2rem 0 5.5rem
            input
              display: inline-block
              width: 90%
              padding: 0.3rem 5%
              font-size: 0.9rem
              border: 1px solid #dbdbdb
      .inner-wrapper
        background: #fff
        .list-wrapper
          .list-item
            position: relative
            padding: 0.5rem 1rem
            &.border-bottom-1px
              border-bottom-1px(#e6e6e6)
            .title
              overflow: hidden
              margin-bottom: 0.4rem
              font-size: 0.9rem
              .time
                float: left
                color: #333
              .money
                float: right
                color: #f36341
            .desc
              font-size: 0.8rem
              max-height: 1.8rem
              line-height: 0.9rem
              color: #666
              overflow: hidden
      .loading-bottom
        padding: 0.2rem 0
        text-align: center
        font-size: 0.9rem
        height: 1.2rem
        line-height: 1.2rem
        color: #666
        span
          display: inline-block
          height: 1.2rem
          line-height: 1.2rem
        .icon-spinner
          display: inline-block
          margin-right: 4px
          vertical-align: middle
          width: 1.2rem
          height: 1.2rem
          background: url(../../plugins/loading_icon.png) no-repeat
          background-size: 100% 100%
          animation: rotate 1.2s linear infinite
          -webkit-animation: rotates 1.2s linear infinite
        @keyframes rotate
          0%
            transform: rotate(0deg)
          50%
            transform: rotate(180deg)
          100%
            transform: rotate(360deg)
        @-webkit-keyframes rotates
          0%
            -webkit-transform: rotate(0deg)
          50%
            -webkit-transform: rotate(180deg)
          100%
            -webkit-transform: rotate(360deg)
</style>
