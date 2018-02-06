<template>
  <div class="home-page">
    <!-- 头部信息 -->
    <div class="home-head">
      <!-- <div>{{ memberInfo }}</div> -->
      <p class="title">欢迎您，<span class="name">{{ memberInfo.uname }}</span></p>
      <p class="money-count">可用余额 <span>{{ memberInfo.balance }}</span> 元<i class="wen-icon"></i></p>
      <p class="lever">{{ memberLevel[memberInfo.level] }}</p>
      <p class="lever" style="padding-bottom:0.5rem">推荐人：{{ memberInfo.recommend }}</p>
      <div class="head-btn">
        <router-link :to="{name: 'activationCode'}" class="changeJhm">转账</router-link><a @click="_chooseTx" class="withdraw">提现</a>
        <!-- <router-link :to="{name: 'withdraw'}" class="withdraw">提现</router-link> -->
      </div>
      <div class="head-btn" style="margin-top:0.6rem;">
        <router-link :to="{name: 'getLxcode'}" class="changeJhm">获得激活码</router-link>
      </div>
      <router-link :to="{name: 'qrCode'}" class="qrcode-icon"></router-link>
    </div>
    <!-- 积分 -->
    <div class="count-wrapper">
      <div class="first-wrapper border-bottom-1px">
        <a class="border-right-1px" style="height: 7.9rem">
          <p class="title" style="margin-top:0.2rem"><span class="blue">消费总额</span><i class="wen-icon"></i></p>
          <p class="count">{{ parseInt(memberInfo.investment).toFixed(2) }}</p>
          <p class="title" style="margin-top:0.4rem"><span class="orange">收益总额</span><i class="wen-icon"></i></p>
          <p class="count">{{ parseInt(memberInfo.integral_balance).toFixed(2) }}</p>
          <p style="margin-top: 0.2rem;margin-bottom:0.2rem;font-size: 0.8rem">数据截止至</p>
          <p style="font-size: 0.8rem">{{ todayStr }}</p>
        </a>
        <a class="border-bottom-1px">
          <p class="title"><span class="orange">冻结收益</span><i class="wen-icon"></i></p>
          <p class="count">{{ memberInfo.integral_freeze }}</p>
        </a>
        <!-- <a class="">
          <p class="title"><span class="orange">今日收益</span><i class="wen-icon"></i></p>
          <p class="count orange">+{{ memberInfo.day_fenghong }}</p>
        </a> -->
        <a class="">
          <p class="title"><span class="black">增值积分</span><i class="wen-icon"></i></p>
          <p class="count orange">{{ memberInfo.increment }}</p>
          <p class="desc blue">可用于购买公司股权</p>
        </a>
      </div>
      <a class="border-bottom-1px border-right-1px">
        <!-- <p class="title"><span class="black">可用蓝享币</span><i class="wen-icon"></i></p> -->
        <p class="title"><span class="black">可用激活码</span><i class="wen-icon"></i></p>
        <p class="count">{{ memberInfo.active_currency }}</p>
        <p class="desc orange">激活码用于排单</p>
      </a>
      <a class="border-bottom-1px">
        <p class="title"><span class="black">消费积分</span><i class="wen-icon"></i></p>
        <!-- 消费积分就是商城积分 -->
        <p class="count">{{ memberInfo.shop_integral }}</p>
        <p class="desc blue">可用于商城消费</p>
      </a>
      
    </div>
    <!-- 分享积分 -->
    <router-link :to="{name: 'exchangeManager', query: {type: 2}}" class="share-count">
      <div class="left">
        <p class="title">分享积分<i class="wen-icon"></i></p>
        <p class="count">{{ memberInfo.jiang2 }}</p>
        <p class="detail">(奖励组成)</p>
      </div>
      <div class="other">
        <div class="list-item">
          <span class="progress"><i class="red"></i></span>
          <span class="descs red">向好友推荐消费，按自己 投资1:1计算资金（60%）</span>
        </div>
        <div class="list-item" style="margin-top:0.2rem;">
          <span class="progress"><i class="blue"></i></span>
          <span class="descs" style="padding-top:0.2rem;height: 2.7rem;">消费积分（20%）<br/>可用于购买公司股权(20%)</span>
        </div>
      </div>
    </router-link>
    <!-- 分享积分 -->
    <router-link :to="{name: 'exchangeManager', query: {type: 1}}" class="share-count">
      <div class="left">
        <p class="title">消费积分<i class="wen-icon"></i></p>
        <p class="count">{{ memberInfo.jiang1 }}</p>
        <p class="detail">(奖励组成)</p>
      </div>
      <div class="other">
        <div class="list-item">
          <span class="progress"><i class="red"></i></span>
          <span class="descs red">7天一轮投资的 静态收益（60%）</span>
        </div>
        <div class="list-item" style="margin-top:0.2rem;">
          <span class="progress"><i class="blue"></i></span>
          <span class="descs" style="padding-top:0.2rem;height: 2.7rem;">消费积分（20%）<br/>可用于购买公司股权(20%)</span>
        </div>
      </div>
    </router-link>
    <!-- 共享积分 -->
    <router-link :to="{name: 'exchangeManager', query: {type: 3}}" class="share-count">
      <div class="left">
        <p class="title">共享积分<i class="wen-icon"></i></p>
        <p class="count">{{ memberInfo.jiang3 }}</p>
        <p class="detail">(奖励组成)</p>
      </div>
      <div class="other">
        <div class="list-item">
          <span class="progress"><i class="red"></i></span>
          <span class="descs red">共享收益（60%）</span>
        </div>
        <div class="list-item" style="margin-top:0.2rem;">
          <span class="progress"><i class="blue"></i></span>
          <span class="descs" style="padding-top:0.2rem;height: 2.7rem;">消费积分（20%）<br/>可用于购买公司股权(20%)</span>
        </div>
      </div>
    </router-link>
    <!-- 岗位津贴 -->
    <div class="share-count">
      <div class="left">
        <p class="title">岗位津贴<i class="wen-icon"></i></p>
        <p class="count">{{ memberInfo.jiang4 }}</p>
      </div>
      <div class="other">
        <!-- <span class="edit-icon" @click="_setTj('edit')">设置</span> -->
        <span class="edit-icon" @click="_setTj('list')">记录</span>
        <span class="edit-icon" @click="_setTj('team')">团队</span>
      </div>
    </div>
    <!-- 自动单排 -->
    <div class="share-count">
      <div class="left">
        <p class="title">自动排单<i class="wen-icon"></i></p>
      </div>
      <div class="other-edit">
        <div class="list-item">
          <div class="sub-btn" @click="_editDp(index)" v-for="(item, index) in dpArr"><i class="choose-icon" :class="[ infoOption.isAuto === index? 'index' :'']"></i><span>{{ item }}</span></div>
          <span class="right" @click="_subDpBtn">确定修改</span>
        </div>
        <!-- <div class="list-item"> -->
          <!-- <input type="password" class="pass-ipt" /> -->
          <!-- <span class="right" @click="_subDpBtn">确定修改</span> -->
        <!-- </div> -->
      </div>
    </div>
    <!-- 团队业绩 -->
    <!-- <div class="team-yeji">
      <div class="title border-bottom-1px">
        <div class="name"><span>团队业绩</span><i class="wen-icon"></i></div>
        <router-link :to="{name: 'team'}" class="search-team">查看团队</router-link>
      </div>
      <div class="detail-wrapper">
        <ul class="detail-head">
          <li>类型</li>
          <li>人数</li>
          <li>总额</li>
        </ul>
        <ul class="detail-content" v-for="(item, index) in 3">
          <li>1好</li>
          <li>234</li>
          <li>1234100.00</li>
        </ul>
      </div>
    </div> -->
    <!-- 津贴弹框 -->
    <jt-edit ref="jtedit" v-on:showTips="showTips"></jt-edit>
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
  import jtEdit from './jtEdit';
  import Local from 'common/js/localStorage';
  // 要会议存储的字段key
  const MEMBER_LOGIN = 'member_login';

  export default {
    data () {
      return {
        todayStr: '', // 当天日志的字符串
        tipsStr: '', // 错误提示的字段
        // timeStep: null, // 定时器
        memberLevel: ['注册会员', '一星会员', '二星会员', '三星会员', '四星会员', '五星会员', '六星会员'], // 显示会员等级的字段
        dpArr: ['关闭', '开启'], // 显示开启关闭单排的字段
        // 设置会员的基本信息
        infoOption: {
          token: '', // 会员TOKEN
          nickName: '', // 会员昵称
          trueName: '', // 会员真实姓名
          isAuto: '' // 是否自动复投
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      // 获取当天日期
      var date = new Date();
      var month = parseInt(date.getMonth()) + 1 < 10 ? '0' + (parseInt(date.getMonth()) + 1) : parseInt(date.getMonth()) + 1;
      var day = parseInt(date.getDate()) < 10 ? '0' + parseInt(date.getDate()) : date.getDate();
      this.todayStr = date.getFullYear() + '-' + month + '-' + day;
      // 获取会员数据
      this._getInfo();
      // 验证token有没有过期
      // this._timeStemp();
    },
    methods: {
      // 验证token有没有过期
      _timeStemp () {
        // console.log(1);
        if (!Local.fetch(MEMBER_LOGIN)) {
          // console.log(1);
          // 清除定时器
          this.timeStep = null;
          this.$router.replace({name: 'login'});
        }
        this.timeStep = setTimeout(() => {
          this._timeStemp();
        }, 500);
      },
      // 切换单排是否开启
      _editDp (type) {
        if (this.infoOption.isAuto !== type) {
          this.infoOption.isAuto = type;
        }
      },
      // 判断是否有外网地址去体现
      _chooseTx () {
        this.$router.push({name: 'withdrawBank'});
        // if (this.memberInfo.outaddress) {
        //   this.$router.push({name: 'withdraw'});
        // } else {
        //   this._showTip('请先在账户管理设置外网地址');
        // }
      },
      // 提交开启关闭单排选项
      _subDpBtn () {
        // 提交数据
        this.$refs.loading.showLoad();
        this.$store.dispatch('editInfo', this.infoOption).then((res) => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this._showTip('修改成功');
             } else {
                // console.log(JSON.parse(resolve.data.message));
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
        });
      },
      _getInfo () {
        this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(() => {
          this.infoOption = {
            token: this.memberLogin.token, // 会员TOKEN
            nickName: this.memberInfo.nick_name, // 会员昵称
            trueName: this.memberInfo.true_name, // 会员真实姓名
            isAuto: parseInt(this.memberInfo.is_auto) // 是否自动复投
          };
        });
      },
      // 打开津贴弹框
      _setTj (type) {
        if (type === 'edit') {
          this.$refs.jtedit._showEdit();
        } else if (type === 'list') {
          this.$router.push({name: 'tjList'});
        } else if (type === 'team') {
          this.$router.push({name: 'teamList'});
        }
      },
      // 从子弹框传递过来的错误提示
      showTips (str) {
        this._showTip(str);
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
      jtEdit
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .home-page
    padding-bottom: 3.2rem
    .home-head
      position: relative
      padding: 1rem 0
      text-align: center
      background: #015cad
      color: #fff
      .title
        padding: 0.5rem 0
        height: 1.2rem
        line-height: 1.2rem
        font-size: 1.2rem
        .name
          color: #75c9ff
      .money-count
        padding: 0.4rem 0
        height: 0.9rem
        line-height: 0.9rem
        font-size: 0.9rem
        color: rgba(241, 235, 235, 0.63)
        span
          color: rgba(117, 201, 255, 0.63)
        .wen-icon
          display: inline-block
          vertical-align: bottom
          margin-left: 0.1rem
          width: 0.7rem
          height: 0.7rem
          background: url(../../../assets/wenhao_icon.png) no-repeat
          background-size: 100% 100%
      .lever
        padding: 0.6rem 0 0.2rem 0
        font-size: 0.8rem
      .head-btn
        // overflow: hidden
        .changeJhm
          display: inline-block
          width: 5rem
          padding: 0.5rem 0
          border-radius: 4px
          background: rgba(255, 255, 255, 0.24)
          color: #fff
          font-size: 0.8rem
        .withdraw
          margin-left: 1.2rem
          display: inline-block
          width: 4.8rem
          padding: 0.4rem 0
          border-radius: 4px
          border: 0.1rem solid rgba(255, 255, 255, 0.24)
          color: #fff
          font-size: 0.8rem
      .qrcode-icon
        position: absolute
        top: 0.8rem
        right: 0.8rem
        display: inline-block
        width: 2.4rem
        height: 2.4rem
        background: url(./qrcode_icon.png) no-repeat
        background-size: 100% 100%
    .count-wrapper
      position: relative
      padding-top: 0.6rem
      background: #fff
      overflow: hidden
      &:after
        position: absolute
        content: ''
        top: 0
        left: 0
        width: 100%
        height: 0.6rem
        background: rgba(1, 92, 173, 0.5)
      .first-wrapper
        position: relative
        overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#ccc)
      a
        position: relative
        float: left
        width: 40%
        padding: 1.2rem 5%
        color: #b2b7ba
        font-size: 0.9rem
        &.border-bottom-1px
          border-bottom-1px(#ccc)
        &.border-right-1px
          border-right-1px(#ccc)
        .title
          .blue
            color: #61a5e7
          .orange
            color: #fe772a
          .black
            color: #2d2d2d
          .wen-icon
            display: inline-block
            vertical-align: bottom
            margin-left: 0.1rem
            width: 0.7rem
            height: 0.7rem
            background: url(../../../assets/wenhao_icon.png) no-repeat
            background-size: 100% 100%
        .count
          margin-top: 0.4rem
        .desc
          margin-top: 0.4rem
          font-size: 0.8rem
          &.orange
            color: #fe772a
          &.blue
            color: #61a5e7
    .share-count
      display: block
      padding: 0.8rem 0.5rem
      margin-top: 0.6rem
      background: #fff
      overflow: hidden
      .left
        float: left
        width: 5rem
        .title
          color: #2d2d2d
          font-size: 1rem
          .wen-icon
            display: inline-block
            vertical-align: bottom
            margin-left: 0.1rem
            width: 0.7rem
            height: 0.7rem
            background: url(../../../assets/wenhao_icon.png) no-repeat
            background-size: 100% 100%
        .count
          margin-top: 0.3rem
          color: #f36342
          font-size: 0.95rem
        .detail
          margin-top: 0.3rem
          color: #898988
          font-size: 0.8rem
      .other-edit
        float: left
        width: 100%
        padding: 0.6rem 0
        .list-item
          padding: 0.3rem 2.5rem
          overflow: hidden
          .sub-btn
            float: left
            width: 32%
            .choose-icon
              display: inline-block
              vertical-align: middle
              width: 1.2rem
              height: 1.2rem
              margin-right: 0.2rem
              background: url(./choose_index.png) center no-repeat
              background-size: 100% 100%
              &.index
                background: url(./choose_index_icon.png) center no-repeat
                background-size: 100% 100%
            span
              display: inline-block
              vertical-align: middle
              height: 1.2rem
              line-height: 1.2rem
              font-size: 0.9rem
          .pass-ipt
            display: inline-block
            width: 54%
            border: 1px solid #b0d2f3
            border-radius: 3px
            font-size: 0.9rem
            padding: 0.2rem 3%
            height: 1.1rem
            line-height: 1.1rem
          .right
            float: left
            width: 4.5rem
            font-size: 0.9rem
            height: 1.6rem
            line-height: 1.6rem
            text-align: center
            border-radius: 3px
            background: #d9e9f9
            color: #62a5e7
      .other
        padding: 0 0 0 5rem
        .edit-icon
          margin-top: 0.5rem
          margin-left: 1rem
          display: inline-block
          width: 4rem
          height: 1.5rem
          line-height: 1.5rem
          text-align: center
          border-radius: 3px
          font-size: 0.85rem
          color: #62a5e7
          background: #d9e9f9
        .list-item
          overflow: hidden
          .progress
            float: left
            width: 38%
            padding-right: 2%
            height: 1.6rem
            text-align: right
            i
              display: inline-block
              vertical-align: bottom
              height: 0.8rem
              border-radius: 3px
              &.red
                width: 70%
                background: #f79d88
              &.blue
                width: 30%
                background: #95bfed
           .descs
             float: left
             width: 60%
             // padding: 0 0 0 40%
             font-size: 0.7rem
             line-height: 0.8rem
             // height: 1.6rem
             color: #828282
             &.red
               color: #ff6600
    .team-yeji
      margin-top: 0.6rem
      background: #fff
      .title
        position: relative
        padding: 0.4rem 1rem
        overflow: hidden
        font-size: 0.9rem
        &.border-bottom-1px
          border-bottom-1px(#ccc)
        .name
          float: left
          height: 1.7rem
          line-height: 1.7rem
          color: #2d2d2d
        .search-team
          float: right
          border-radius: 3px
          padding: 0.4rem 0.6rem
          background: #d9e9f9
          color: #62a5e7
      .detail-wrapper
        .detail-head
          overflow: hidden
          li
            float: left
            padding: 0.6rem 0
            width: 33.3%
            text-align: center
            font-size: 0.9rem
            color: #898988
        .detail-content
          overflow: hidden
          li
            float: left
            padding: 0.25rem 0
            width: 33.3%
            text-align: center
            font-size: 0.9rem
            color: #95bfed
</style>
