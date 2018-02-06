<template>
  <div class="team-page">
    <!-- 团队顶部导航 -->
    <div class="team-top-choose border-bottom-1px">
      <div class="list-item border-right-1px" :class="[topType === 0 ? 'index' : '']" @click="_chooseTopType(0)">
        <i class="gaikuang"></i>
        <p>团队概况</p>
      </div>
      <div class="list-item" :class="[topType === 1 ? 'index' : '']" @click="_chooseTopType(1)">
        <i class="yeji"></i>
        <p>团队业绩</p>
      </div>
    </div>
    <!-- 团队概况的子菜单导航 -->
    <div class="team-sub-choose border-bottom-1px" v-if="topType === 0">
      <span v-for="(item, index) in subOneArr" :class="[subOneTopType === index ? 'index' : '']" @click="_subOneChooseType(index)">{{ item }}</span>
    </div>
    <!-- <div class="team-sub-choose border-bottom-1px" v-else-if="topType === 1">
      <span v-for="(item, index) in subTwoArr" :class="[subTwoTopType === index ? 'index' : '']" @click="_subTwoChooseType(index)" style="width:50%;">{{ item }}</span>
    </div> -->
    <!-- 团队概况 -->
    <div class="sub-content-wrapper" v-if="topType === 0">
        <!-- 会员管理 -->
        <div class="sub-wrapper" v-if="subOneTopType === 0">
          <div class="inner-wrapper">
            <div class="list-item border-bottom-1px">
              <div class="sub-list">
                <p class="title">{{ memberInfo.uno }}</p>
                <p class="desc">会员编号</p>
              </div>
              <div class="sub-list">
                <p class="title">{{ memberInfo.true_name || '无' }}</p>
                <p class="desc">姓名</p>
              </div>
              <div class="sub-list">
                <p class="title">{{ parseInt(memberInfo.investment).toFixed(2) }}</p>
                <p class="desc">最近投资</p>
              </div>
            </div>
            <div class="list-item border-bottom-1px">
              <!-- <div class="sub-list">
                <p class="title">0</p>
                <p class="desc">团队人数</p>
              </div> -->
              <div class="sub-list">
                <p class="title orange">{{ parseFloat(memberInfo.team_money).toFixed(2) }}</p>
                <p class="desc">团队业绩</p>
              </div>
              <div class="sub-list">
                <p class="title orange">{{ parseFloat(memberInfo.investment).toFixed(2) }}</p>
                <p class="desc">个人业绩</p>
              </div>
              <div class="sub-list">
                <!-- <p class="title blue">已激活</p> -->
                <p class="title blue">{{ parseInt(memberInfo.level) > 0 ? '已激活' : '未激活' }}</p>
                <p class="desc">状态 </p>
              </div>
            </div>
            <div class="list-item">
              <div class="sub-list">
                <p class="title">{{ memberInfo.reg_time }}</p>
                <p class="desc">注册时间</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 激活会员 -->
        <!-- <div class="sub-wrapper" v-if="subOneTopType === 1">
          <div class="inner-wrapper">
            <div class="hy-item border-bottom-1px">
              <span class="left">团队总人数</span>
              <span class="right">270人</span>
            </div>
            <div class="hy-item border-bottom-1px">
              <span class="left">已激活人数</span>
              <span class="right">27人</span>
            </div>
            <div class="hy-item border-bottom-1px">
              <span class="left">可激活人数</span>
              <span class="right">2人</span>
            </div>
            <div class="hy-item">
              <span class="left">可用激活币</span>
              <span class="right">270.00</span>
            </div>
          </div>
          <div class="wait-wrapper">
            <p class="title border-bottom-1px">待激活</p>
            <div class="content-wrapper">
              <div class="none-msg">
                <i class="none-msg-icon"></i>
                <p class="desc">暂无记录</p>
              </div>
            </div>
          </div>
        </div> -->
        <!-- 等级详情 -->
        <div class="sub-wrapper" v-if="subOneTopType === 1">
          <div class="inner-wrapper">
            <!-- <div class="hy-item border-bottom-1px">
              <span class="left">有效直推</span>
              <span class="right">12</span>
            </div>
            <div class="hy-item border-bottom-1px">
              <span class="left">团队总人数</span>
              <span class="right">270</span>
            </div> -->
            <div class="hy-item border-bottom-1px" v-for="(item, index) in memberInfo.team">
              <!-- <span>{{ countArr[] }}</span> -->
              <span class="left">{{ index }}</span>
              <span class="right">{{ parseFloat(item).toFixed(2) }}</span>
            </div>
            <!-- <div class="hy-item">
              <span class="left">小区业绩</span>
              <span class="right">{{ memberInfo.team[1] ? parseFloat(memberInfo.team[1]).toFixed(2) : '0.00' }}</span>
            </div> -->
          </div>
         <!--  <div class="tip-content">
            <p class="title">温馨细则提示</p>
            <div class="tip-wrapper">
              <p class="content">1.  奖车计划，分阶段进行，只限每个月最先达到业绩的前十名，先到先得。</p>
              <p class="content"> 2. 业绩奖励与福利奖励只计算新增业绩。</p>
              <p class="content">3.对于恶意刷奖的行为，盱眙积分保留取消用户奖励的权利。奖励活动遵循盱眙积分法律声明，最终解释权归盱眙积分所有</p>
            </div>
        </div> -->
      </div>
    </div>
    <!-- 团队业绩 -->
    <div class="sub-content-wrapper" style="padding-top: 4.35rem" v-if="topType === 1">
      <!-- 总业绩 -->
      <div class="sub-wrapper" v-if="subTwoTopType === 0">
        <div class="inner-wrapper">
         <!-- 标题字段 -->
          <div class="zyj-item border-bottom-1px">
            <p class="one">
              <span class="name">姓名</span>
              <span class="money">投资金额</span>
            </p>
            <p class="two">
              <span class="left">会员编号</span>
              <span class="right">时间</span>
            </p>
          </div>
          <!-- 循环获取到的内容 -->
          <div class="zyj-item border-bottom-1px" v-for="(item, index) in teamYjList">
            <p class="one">
              <span class="name">{{ item.nick_name }}</span>
              <span class="money">{{ item.investment }}</span>
            </p>
            <p class="two">
              <span class="left">{{ item.uname }}</span>
              <span class="right">{{ item.reg_time }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 推荐有奖 -->
      <!-- <div class="sub-wrapper" v-if="subTwoTopType === 1">
        <div class="copy-wrapper">
          <p class="title">复制链接发给好友</p>
          <div class="link-content">https://shenlan001.com/reg?r=9abacc18ef66de7cebb</div>
          <div class="copy-btn" @click="_copyLink">复制链接</div>
        </div>
        <div class="copy-wrapper">
          <p class="title">复制链接发给好友</p>
          <div class="copy-content">
            <div class="copy-pic">
              <img src="./moke_pic_01.png" alt="">
            </div>
            <div class="right">
              <p class="desc">第一步：打开微信，点击右上角“+”号，点击扫一扫</p>
              <p class="desc">第二步：发送给好友，分享盱眙梦想</p>
            </div>
          </div>
        </div>
        <div class="copy-wrapper">
          <p class="title">有效邀请关键确认点</p>
          <p class="orange">好友通过您的链接注册，对方注册界面会显示邀请人，为“您的会员编号”！</p>
          <div class="copy-content">
            <div class="one">对方邀请人是你会员编号 才说明邀请有效！</div>
            <div class="two">
              <img src="./default_img_01.jpg" alt="" />
            </div>
          </div>
        </div>
        <div class="tip-content">
            <p class="title">温馨细则提示</p>
            <div class="tip-wrapper">
              <p class="content">1.  奖车计划，分阶段进行，只限每个月最先达到业绩的前十名，先到先得。</p>
              <p class="content"> 2. 业绩奖励与福利奖励只计算新增业绩。</p>
              <p class="content">3.对于恶意刷奖的行为，盱眙积分保留取消用户奖励的权利。奖励活动遵循盱眙积分法律声明，最终解释权归盱眙积分所有</p>
            </div>
        </div>
      </div> -->
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
        countArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tipsStr: '', // 提示字段
        topType: 0, // 团队顶部导航
        subOneTopType: 0, // 团队概况里面的子导航
        // subOneArr: ['会员管理', '激活会员', '等级详情'], // 团队概况子导航字段
        subOneArr: ['会员管理', '等级详情'], // 团队概况子导航字段
        subTwoTopType: 0, // 团队业绩里面的子导航
        subTwoArr: ['总业绩', '推荐有奖'], // 团队业绩子导航字段
        listOption: {
            token: '', // 会员TOKEN
            pages: 1, // 当前页
            pageSize: 12000000 // 每页显示数量
         }, // 各个记录提交的参数
         winHei: 0, // window的高度
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         chooseAgain: false,
         showLists: false // 列表是否显示
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo,
      // 团队业绩管理
      teamYjList: state => state.teamYjList
    }),
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
    },
    methods: {
      _chooseTopType (type) {
        if (this.topType !== type) {
          this.topType = type;
          if (type === 1 && this.teamYjList.length === 0) {
            // console.log(1);
            this._getList();
          }
        }
      },
      _subOneChooseType (type) {
        if (this.subOneTopType !== type) {
          this.subOneTopType = type;
        }
      },
      _subTwoChooseType (type) {
        if (this.subTwoTopType !== type) {
          this.subTwoTopType = type;
        }
      },
      // 获取提现记录
      _getList () {
        this.$refs.loading.showLoad();
        this._subList().then(res => {
          this.$refs.loading.hideLoad();
          if (res.data.lists.length > 0) {
            this.showLists = true;
          }
          this.chooseAgain = true;
          // console.log(res.data.length < this.dataOption.pagesize);
          if (res.data.lists.length < this.listOption.pageSize) {
            this.getAgain = false;
          }
        });
      },
      _subList () {
        this.listOption.token = this.memberLogin.token;
        return this.$store.dispatch('teamYjList', this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.team-page').height());
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
      // 复制链接
      // _copyLink () {
      //   this._showTip('链接复制成功');
      // },
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
  
  .team-page
    padding-bottom: 3.2rem
    .team-top-choose
      position: fixed
      top: 0
      left: 0
      width: 100%
      z-index: 110
      padding: 0.5rem 0
      background: #fff
      overflow: hidden
      &.border-bottom-1px
        border-bottom-1px(#f3f3f3)
      .list-item
        position: relative
        float: left
        width:  50%
        padding: 0.2rem 0
        text-align: center
        font-size: 0.9rem
        color: #cacaca
        &.border-right-1px
          border-right-1px(#f3f3f3)
        i
          display: inline-block
          width: 1.8rem
          height: 1.8rem
          margin-bottom: 0.1rem
          &.gaikuang
            background: url(./team_one_icon.png) center no-repeat
            background-size: 100% 100%
          &.yeji
            background: url(./team_two_icon.png) center no-repeat
            background-size: 100% 100%
        &.index
          color: #015cad
          .gaikuang
            background: url(./team_one_index_icon.png) center no-repeat
            background-size: 100% 100%
          .yeji
            background: url(./team_two_index_icon.png) center no-repeat
            background-size: 100% 100%
    .team-sub-choose
      position: fixed
      top: 3.8rem
      left: 0
      width: 100%
      z-index: 100
      margin-top: 0.5rem
      overflow: hidden
      background: #fff
      font-size: 0.9rem
      &.border-bottom-1px
        border-bottom-1px(#eff1f2)
      span
        float: left
        padding: 0.8rem 0
        // width: 33.3%
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
    .sub-content-wrapper
      padding-top: 6.8rem
      .tip-content
        background: #fff
        margin-top: 0.6rem
        .title
          padding: 0.5rem 2rem
          font-size: 0.9rem
          color: #969696
        .tip-wrapper
          padding: 0 1.2rem 1rem 1.2rem
          .content
            line-height: 0.9rem
            font-size: 0.8rem
            color: #969696
      .wait-wrapper
        margin-top: 0.4rem
        background: #fff
        .title
          padding: 0.5rem 1rem
          font-size: 0.9rem
          position: relative
          &.border-bottom-1px
            border-bottom-1px(#eff1f2)
        .content-wrapper
          .none-msg
            padding: 1rem 0
            text-align: center
            color: #cacaca
            font-size: 0.8rem
            i
              display: inline-block
              width: 3rem
              height: 3rem
              background: url(./no_msg_icon.png) center no-repeat
              background-size: 100% 100%
      .copy-wrapper
        background: #fff
        padding: 1rem
        margin-bottom: 0.5rem
        .orange
          margin: 0.6rem 0
          font-size: 0.8rem
          line-height: 0.9rem
          color: #fe772a
        .title
          font-size: 0.9rem
          color: #282828
        .link-content
          margin: 0.7rem 0
          border: 1px solid #e5edfd
          padding: 0.3rem 0.4rem
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          font-size: 0.8rem
          color: #cacaca
        .copy-btn
          border-radius: 3px
          text-align: center
          background: #8fb4f8
          padding: 0.5rem 0
          color: #fff
          line-height: 0.9rem
          font-size: 0.9rem
        .copy-content
          margin-top: 0.6rem
          overflow: hidden
          .one
            float: left
            width: 8rem
            margin-top: 0.2rem
            padding: 0.5rem 0.8rem
            background: #edf3fe
            line-height: 0.9rem
            font-size: 0.8rem
            border-radius: 5px
            color: #8fb4f8
          .two
            padding: 0 0 0 10rem
            img
              display: block
              width: 100%
              height: auto
          .copy-pic
            float: left
            width: 4rem
            height: 4rem
            img
              display: block
              width: 4rem
              height: 4rem
          .right
            padding: 0 0 0 4.8rem
            font-size: 0.75rem
            color: #969696
            .desc
              margin-top: 0.2rem
              line-height: 0.9rem
      .inner-wrapper
        padding: 0 0.8rem
        background: #fff
        .zyj-item
          position: relative
          padding: 0.4rem 0.6rem
          font-size: 0.9rem
          &.border-bottom-1px
            border-bottom-1px(#eff1f2)
          .one
            overflow: hidden
            .name
              float: left
              color: #282828
            .money
              float: right
              color: #fe6900
          .two
            margin-top: 0.3rem
            overflow: hidden
            color: #cacaca
            .left
              float: left
            .right
              float: right
        .list-item
          position: relative
          padding: 0.9rem 0
          overflow: hidden
          &.border-bottom-1px
            border-bottom-1px(#ccc)
          .sub-list
            float: left
            width: 33.3%
            text-align: center
            font-size: 0.8rem
            .title
              margin-bottom: 0.4rem
              color: #282828
              &.orange
                color: #fe6900
              &.blue
                color: #8fb4f8
            .desc
              color: #cacaca
        .hy-item
          position: relative
          padding: 0.5rem 0.8rem
          overflow: hidden
          font-size: 0.9rem
          &.border-bottom-1px
            border-bottom-1px(#eff1f2)
          span
            float: left
            width: 50%
            text-align: center
          // .left
          //   float: left
          //   color: #3c3c3c
          // .right
          //   float: right
          //   color: #fe772a
</style>
