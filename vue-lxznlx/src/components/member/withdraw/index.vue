<template>
  <div class="withdraw-page" ref="withdraw" v-scroll="_addList">
    <div class="withdraw-choose border-bottom-1px">
      <span v-for="(item, index) in typeArr" :class="[chooseType === index ? 'index' : '']" @click="_chooseType(index)">{{ item }}</span>
    </div>
    <!-- 申请提现 -->
    <div class="withdraw-wrapper wrapper-absolute" v-if="chooseType === 0">
      <div class="inner-edit">
        <div class="list-item">
          <span class="left">当前交易价</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.account" disabled="disabled" />
          </div>
        </div>
        <!-- <div class="list-item">
          <span class="left">提现类型</span>
          <div class="ipt">
            <input type="text" v-model="dataOption.name" @input="filter('name')" />
          </div>
        </div> -->
        <div class="list-item">
          <span class="left">提现金额</span>
          <div class="ipt">
            <input type="tel" v-model="dataOption.drawMoney" @input="filter('drawMoney')" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">提现地址(外网)</span>
          <div class="ipt">
            <input type="text" v-model="mokeOption.wAddress" disabled="disabled" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">提现连锁积分数量</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.txCount" disabled="disabled" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">所需手续费(5%)</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.sxfMoney" disabled="disabled" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">总共扣除金额</span>
          <div class="ipt">
            <input type="tel" v-model="mokeOption.allMoney" disabled="disabled" />
          </div>
        </div>
        <div class="list-item">
          <span class="left">交易密码</span>
          <div class="ipt">
            <input type="password" v-model="dataOption.payPass" @input="filter('payPass')" />
          </div>
        </div>
        <div class="submit-btn" @click="_submit">确定</div>
        <div class="tips-content">
          <p class="title">提现说明：</p>
          <p class="content">消费积分提现、分享收益提现、共享收益提现，仅收取5%的手续费。 可用余额提现：提现金额的20%为资金托管管理费进行扣除，提现金额的70%进入交易大盘，提现金额的10%进入消费积分，并收取转入交易大盘部分和转入消费积分部分5%的手续费。</p>
        </div>
      </div>
    </div>
    <!-- 提现记录 -->
    <div class="withdraw-wrapper" v-if="chooseType === 1">
      <div class="inner-wrapper" v-if="showLists">
        <!-- 提现记录的列表 -->
        <div class="list-wrapper" style="padding: 0 0.8rem">
          <div class="list-item" :class="[withdrawCountList.length - 1 > index ? 'border-bottom-1px' : '']" v-for="(item, index) in withdrawCountList">
            <p class="title">
              <span class="time">{{ item.add_time }}</span>
              <span class="money">-{{ item.withdraw_money }}</span>
            </p>
            <p class="title" style="margin-bottom:0;">
              <span class="time">{{ item.address }}</span>
              <span class="money">{{ item.status_name }}</span>
            </p>
            <!-- <p class="desc" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">交易收费提现交易收费提现交易收费提现交易收费提现交易收费提现交提现交易收费提现交提现交易收费提现交易收费提现交易收费提现</p> -->
          </div>
        </div>
        <p class="loading-bottom" v-show="loadingShow"><i class="icon-spinner"></i><span>正在加载中...</span></p>
      </div>
      <div v-else style="margin-top: 2.5rem;padding:7rem 0;text-align:center;font-size:0.9rem">暂无记录</div>
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
         chooseType: 0,
         typeArr: ['提现', '记录'],
         dataOption: {
            token: '', // 会员TOKEN
            drawMoney: '', // 提现金额
            payPass: '' // 支付密码
         },
         mokeOption: {
            account: '', // 当前交易价格
            wAddress: '', // 外网地址
            txCount: '', // 提现连锁积分数量
            sxfMoney: '', // 所需手续费5%
            allMoney: '' // 总共扣除金额
         },
         listOption: {
            token: '', // 会员TOKEN
            pages: 1, // 当前页
            pageSize: 20 // 每页显示数量
         }, // 提现记录提交的参数
         winHei: 0, // window的高度
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         chooseAgain: false, // 是否再次获取
         showLists: false // 列表是否显示
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        this._getMsg();
      });
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo,
      // 提现日志接口
      withdrawCountList: state => state.withdrawCountList
    }),
    methods: {
      _getMsg () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getPrice', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          this.mokeOption = {
              account: res.data, // 当前交易价格
              wAddress: this.memberInfo.outaddress, // 外网地址
              txCount: '', // 提现连锁积分数量
              sxfMoney: '', // 所需手续费5%
              allMoney: '' // 总共扣除金额
           };
        });
      },
      _chooseType (type) {
        if (this.chooseType !== type) {
          this.chooseType = type;
          // 如果是1就是加载提现记录
          if (type === 1) {
            // 重置页数
            this.getAgain = true;
            this.chooseAgain = false;
            this.listOption.pages = 1;
            // console.log(1);
            this._getList();
          }
        }
      },
      // 提交提现信息
      _submit () {
        if (this.dataOption.drawMoney === '') {
           this._showTip('提现金额不能为空');
          return;
        }
        if (this.mokeOption.wAddress === '') {
           this._showTip('请去账户管理编辑外网地址');
          return;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.payPass)) {
           this._showTip('交易密码必须是6-18位数字或英文');
          return;
        }
        // 验证通过进行提交
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('withdrawInfo', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this._showTip('提现成功');
            // 情况数据
            this.dataOption = {
              token: '', // 会员TOKEN
              drawMoney: '', // 提现金额
              payPass: '' // 支付密码
            };
            this.mokeOption.sxfMoney = '';
            this.mokeOption.allMoney = '';
            this.mokeOption.txCount = '';
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
        return this.$store.dispatch('withdrawCountList', this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.withdraw-page').height());
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
        if (str === 'drawMoney') {
          // this.mokeOption = {
          //     account: res.data, // 当前交易价格
          //     wAddress: this.memberInfo.outaddress, // 外网地址
          //     txCount: '', // 提现连锁积分数量
          //     sxfMoney: '', // 所需手续费5%
          //     allMoney: '' // 总共扣除金额
          //  };
          this.mokeOption.sxfMoney = (this.dataOption.drawMoney * 0.05).toFixed(2);
          this.mokeOption.allMoney = parseInt(this.dataOption.drawMoney) > 0 ? parseInt(this.dataOption.drawMoney) + parseFloat(this.mokeOption.sxfMoney) : '0.00';
          this.mokeOption.txCount = parseInt(this.dataOption.drawMoney) > 0 ? (parseInt(this.dataOption.drawMoney) / parseFloat(this.mokeOption.account)).toFixed(4) : '0.00';
          // console.log(this.dataOption.drawMoney);
        }
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
  
  .withdraw-page
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
      margin-top: 2.5rem
      background: #fff
      &.wrapper-absolute
        padding-bottom: 1.2rem
        // margin: 0
        // position: absolute
        // top: 2.5rem
        // left: 0
        // right: 0
        // bottom: 0
        // background: #fff
      .inner-edit
        padding: 1rem 1rem 0 1rem
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
        .list-item
          padding: 0.2rem 0
          overflow: hidden
          .left
            float: left
            width: 7.5rem
            text-align: right
            height: 1.5rem
            line-height: 1.5rem
            font-size: 0.9rem
            color: #1f1f1f
          .ipt
            padding: 0 0.2rem 0 7.8rem
            input
              display: inline-block
              width: 90%
              padding: 0.3rem 5%
              font-size: 0.9rem
              border: 1px solid #dbdbdb
      .inner-wrapper
        .list-wrapper
          .list-item
            position: relative
            padding: 0.5rem 1rem
            &.border-bottom-1px
              border-bottom-1px(#e6e6e6)
            .title
              overflow: hidden
              margin-bottom: 0.2rem
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
