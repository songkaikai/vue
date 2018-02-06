<template>
  <div class="help-center-page">
    <!-- 帮助中心导航 -->
    <div class="team-top-choose">
      <div class="list-item border-right-1px" :class="[topType === 0 ? 'index' : '']" @click="_chooseTopType(0)">
        <i class="about-icon"></i>
        <p>关于我们</p>
      </div>
      <div class="list-item border-right-1px" :class="[topType === 1 ? 'index' : '']" @click="_chooseTopType(1)">
        <i class="gg-icon"></i>
        <p>公告</p>
      </div>
      <div class="list-item" :class="[topType === 2 ? 'index' : '']" @click="_chooseTopType(2)">
        <i class="question-icon"></i>
        <p>常见问题</p>
      </div>
    </div>
    <!-- 底部信息 -->
    <div class="sub-content-wrapper">
      <!-- 关于我们 -->
      <div class="sub-wrapper" v-if="topType === 0">
        <div class="content-wrapper">
          <div v-if="helpArticalDetail.title">
            <p class="title border-bottom-1px">{{ helpArticalDetail.title }}</p>
            <div class="inner-content">
              <!-- <p class="detail"></p> -->
              <!-- {{ helpArticalDetail.cnt }} -->
            </div>
          </div>
          <!-- <p class="title border-bottom-1px">公司简介</p>
          <div class="inner-content">
            <p class="detail">贝兴网络科技有限公司成立于2017年，注册资金6800万，办公面积2000平米，在职员工80余人。在全国各省市与地区形成忠诚粉丝核心团队逾20000个，其粉丝基础更是超过30万。</p>
            <p class="detail">公司与业内一流企业、品牌达成战略合作，以行业领先、全国首创“双模式、双系统”的深蓝时代商城，携手森山铁皮枫斗、币股园、云数网等实力品牌与金融平台，千军万马 一促即发，开创未来创投新方向。</p>
            <p class="detail">贝兴网络科技有限公司以“做大健康产业，让会员拥有健康身体；创新产融模式，让会员拥抱财富自由”为使命，秉承“新购物、新思路、新创新、新积分”的经营宗旨，以及“帮扶中国好企业，捧红民族好品牌”的商业理念，立足大健康产业，首创“双模式、双系统”的行业第一实体落地深蓝时代商城。</p>
            <p class="detail">公司打破了传统商业的业态格局，拓展出电子商务新服务业业态，通过推广全面支付环境，整合物联网产业链，为经济增长方式的革新，优化产业结构，打造自主品牌，提高运行效率提供了积极的促进作用，逐步形成了最适合贝兴网络科技的可持续发展道路。</p>
          </div>
          <p class="title border-bottom-1px">产品介绍</p>
          <div class="inner-content">
            <p class="detail">贝兴网络科技有限公司成立于2017年，注册资金6800万，办公面积2000平米，在职员工80余人。在全国各省市与地区形成忠诚粉丝核心团队逾20000个，其粉丝基础更是超过30万。</p>
          </div> -->
        </div>
      </div>
      <!-- 盱眙公告 -->
      <div class="sub-wrapper" v-if="topType === 1">
        <div class="content-wrapper">
          <div v-for="(item, index) in typeOneList">
            <router-link :to="{name: 'announcement', params: {'id': item.id}}" class="public-list border-bottom-1px">
              <span class="name">{{ item.title }}</span>
              <span class="date">{{ item.created_at }}</span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 常见问题 -->
      <div class="sub-wrapper" v-if="topType === 2">
        <div class="content-wrapper">
          <div class="list-item border-bottom-1px" v-for="(item, index) in typeTwoList">
            <router-link :to="{name: 'announcement', params: {'id': item.id}}" class="public-list border-bottom-1px">
              <span class="name">{{ item.title }}</span>
              <span class="date">{{ item.created_at }}</span>
            </router-link>
            <!-- <p class="titles">{{ item.title }}</p>
            <p class="content">{{ item.content }}</p> -->
          </div>
        </div>
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
        topType: 0,
        typeOneList: [],
        typeTwoList: [],
        cjQuesArr: [
            {
              'title': '如何获得电子积分？',
              'content': '电子积分可以用你绑定的电子钱包转入平台，首先保证你绑定的电子钱包里有足够的积分。'
            },
            {
              'title': '关于复消积分的问题',
              'content': '复消积分是平台返回跟会员的一部分用于消费商品的积分，复消积分不能用于提现或者转账，并且购买商品不会产生原始积分。'
            },
            {
              'title': '如何购买商品？',
              'content': '目前购买商品只能有两种方式，使用电子积分或者复消积分，在积分商城中选择你要购买的商品，并在购物车完成支付。'
            },
            {
              'title': '如何修改电子钱包账户？',
              'content': '电子钱包账户在你初次注册时完成了绑定，为了防止会员恶意刷积分奖励目前不支持修改电子钱包账户，如果是填写错误或者注销的电子账户请联系客服并提供相关资料完成审核。'
            },
            {
              'title': '我购买了商品多长时间发货？',
              'content': '会员购买的商品，可以在 交易管理->商城购买->我的订单 中查看发货状态。'
            },
            {
              'title': '周消模式是怎么样的？',
              'content': '周消模式是按7天为一个周期计算，消费一次需要消耗本金的1%消费积分，每天赠送本金的1.5%积分，一个周期结束后本息可一次性提现，所得收益70%可提现，20%作为复消积分，5%管理费。5%公益积分。本金80%提现，20%作为复消积分。'
            },
            {
              'title': '月消模式是怎么样的？',
              'content': '月消模式是以30天为一个周期计算，消费一次需要消耗本金的1%消费积分，赠送额度加30%的积分，分30天平均返还。'
            }
        ]
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 帮助中心-获取文章类别
      helpArticalDetail: state => state.helpArticalDetail
      // helpArticalList: state => state.helpArticalList
    }),
    created () {
      this.$nextTick(() => {
        this._getTopList();
      });
    },
    methods: {
      _chooseTopType (type) {
        this.topType = type;
        // console.log(type);
        var data = {
          classId: 0,
          type: type
        };
        if (type === 2) {
          data.classId = 3;
        } else if (type === 1) {
          data.classId = 4;
        }
        this._getDefault(data);
      },
      _getTopList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('helpArticalType', {token: this.memberLogin.token}).then(() => {
          this.$refs.loading.hideLoad();
          this._getDefault({classId: 3, type: 0});
        });
      },
      _getDefault (data) {
        if (data.type === 0) {
          this.$store.dispatch('helpArticalDetail', {token: this.memberLogin.token, newsId: 1}).then(() => {
            $('.inner-content').html(this.helpArticalDetail.cnt);
          });
        } else {
          this.$store.dispatch('helpArticalList', {token: this.memberLogin.token, classId: data.classId}).then(res => {
            if (data.type === 1) {
              // console.log(res.data);
              this.typeOneList = res.data.lists;
            } else if (data.type === 2) {
              this.typeTwoList = res.data.lists;
            }
          });
        }
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
  
  .help-center-page
     .team-top-choose
        position: fixed
        top: 0
        left: 0
        width: 100%
        padding: 0.5rem 0
        background: #fff
        z-index: 110
        overflow: hidden
        .list-item
          position: relative
          float: left
          width:  33.3%
          padding: 0.2rem 0
          text-align: center
          font-size: 0.8rem
          color: #cacaca
          &.border-right-1px
            border-right-1px(#f3f3f3)
          i
            display: inline-block
            width: 1.7rem
            height: 1.7rem
            margin-bottom: 0.1rem
            &.about-icon
                background: url(./help_one.png) center no-repeat
                background-size: 100% 100%
            &.gg-icon
                background: url(./help_two.png) center no-repeat
                background-size: 100% 100%
            &.question-icon
                background: url(./help_three.png) center no-repeat
                background-size: 100% 100%
          &.index
            color: #015cad
            .about-icon
                background: url(./help_index_one.png) center no-repeat
                background-size: 100% 100%
            .gg-icon
                background: url(./help_index_two.png) center no-repeat
                background-size: 100% 100%
            .question-icon
                background: url(./help_index_three.png) center no-repeat
                background-size: 100% 100%
     .sub-content-wrapper
       padding: 4rem 0 3.2rem 0
       .content-wrapper
         margin-top: 0.5rem
         background: #fff
         .title
           position: relative
           padding: 0.5rem 1rem
           font-size: 0.9rem
           color: #282828
           &.border-bottom-1px
             border-bottom-1px(#ccc)
         .inner-content
           padding: 0 1.2rem
           font-size: 0.8rem
           line-height: 0.9rem
           padding: 0.5rem 1.2rem
           p
             padding: 0.5rem 0
             line-height: 0.9rem
             color: #3c3c3c
         .list-item
           position: relative
           padding: 1rem
           font-size: 0.9rem
           &.border-bottom-1px
             border-bottom-1px(#eff1f2)
           .titles
             color: #015cad
             margin-bottom: 0.4rem
            .content
              line-height: 1rem
              color: #3c3c3c
         .public-list
           position: relative
           display: block
           padding: 0.8rem 1rem
           font-size: 0.8rem
           overflow: hidden
           &.border-bottom-1px
             border-bottom-1px(#eff1f2)
           .name
             float: left
             color: #3c3c3c
           .date
             float: right
             color: #969696
</style>
