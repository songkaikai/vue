<template>
	<div class="member-page">
    <!-- <p>my name is Robot@num - <span>{{ str }}</span> .</p> -->
    <div class="message-wrapper" ref="menuwrapper">
      <div class="message-inner">
        <div class="list-item" v-for="(item, index) in returnMsg">
          <p v-if="item.type == 1 || item.type == 3" class="tips"><span>{{ item.str }}</span></p>
          <div v-else>{{ item.name }} 说： {{ item.str }}</div>
        </div>
      </div>  
    </div>
    <!-- 底部发送信息栏 -->
    <div class="bottom-menu">
      <div class="sub-ipt">
        <input type="text" name="" placeholder="place input..." v-model="textContent" />
      </div>
      <span class="submit-btn" @click="sendMsg">send</span>
    </div>
	</div>
</template>

<script>
  // import BScroll from 'better-scroll';

  export default {
    data () {
      return {
        content: 'Welcome to my chat room.',
        str: '', // 当前登录的是谁my name is Jack.count-*
        textContent: '', // 输入的内容
        ws: null,
        returnMsg: [],
        scrollBar: ''
      };
    },
    created () {
      // 获取当前成员
      this.str = this.$route.query.member;
      this.ws = new WebSocket('ws://192.168.88.125:8001?name=xD' + parseInt(Math.random() * 100));

      this.ws.onopen = () => {
        // 表明已经打开
        // console.log('open');
        // var data = {
        //   type: 'name',
        //   msg: '我是小D'
        // };
        // this.ws.send(JSON.stringify(data));
      };

      this.ws.onmessage = (evt) => {
        console.log(JSON.parse(evt.data));
        // 把json字符串转换为json对象
        this.returnMsg.push(JSON.parse(evt.data));
        // 重新初始化改对象
        // this.scrollBar.refresh();
      };
      this.ws.onclose = (evt) => {
        console.log('WebSocketClosed!');
        // this.returnMsg.push(evt.data);
      };
      this.ws.onerror = (evt) => {
        console.log('WebSocketError!');
      };

      // 创建一个新的滚轮对象
      // this.$nextTick(() => {
      //   this.scrollBar = new BScroll(this.$refs.menuwrapper, {
      //     click: true
      //   });
      // });
    },
    methods: {
      // 发送信息
      sendMsg () {
        this.ws.send(this.textContent);
        // this.textContent = '';
      }
    },
    beforeRouteLeave (to, from, next) {
      // 关闭socket连接
      this.ws.close();
      next();
      // next(false);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .member-page
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: url(../assets/finn_bg.jpg) center no-repeat
    background-zie: 100% 100%
  .message-wrapper
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 2.8rem
    overflow-x: hidden
    // padding: 1rem
    .list-item
      padding: 0.4rem 1rem
      color: #333
      .tips
        text-align: center
        span
          display: inline-block
          padding: 0.3rem 0.6rem
          background: #eee
          border-radius: 3px
          font-size: 0.8rem
          color: #666
  .bottom-menu
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    background: #eee
    overflow: hidden
    .sub-ipt
      float: left
      width: 74%
      text-align: center
      input
        display: inline-block
        background: #fff
        margin-top: 0.4rem
        width: 84%
        font-size: 1rem
        padding: 0.4rem 5%
        border-radius: 5px
    .submit-btn
      float: left
      width: 26%
      height: 2.8rem
      line-height: 2.8rem
      text-align: center
      color: #fff
      // background: rgba(24, 24, 26, 1)
      background: #3a3a3a
    
</style>
