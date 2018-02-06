<template>
  <div class="pay-page">
    <div class="edit-wrapper">
    <!-- <textarea name="" id="" cols="30" rows="10">{{ dataOption.pic1 }}</textarea> -->
      <div class="list-item">
        <span class="left">姓名：{{ orderCode.true_name }}</span>
        <span class="left" style="color:#e4393c;">订单状态：{{ orderCode.status_name }}</span>
      </div>
      <div class="list-item">
        <span class="left">身份证：{{ orderCode.card_no }}</span>
        <span class="left">订单编号：{{ orderCode.order_no }}</span>
      </div>
      <div class="list-item" style="padding:0;margin:10px 0;">
        <span class="left" style="width: 100%;max-height:34px;line-height: 17px;">地址：{{ orderCode.address }}</span>
      </div>
      <div class="list-item">
        <div class="img-wrapper" style="cursor:pointer;" @click="_showBigPic('card1')">
          <!-- <input type="file" /> -->
          <!-- <img :src="faceImg" alt="" /> -->
          <img :src="orderCode.card1" alt="" />
        </div>
        <div class="img-wrapper" style="cursor:pointer;" @click="_showBigPic('card2')">
          <!-- <input type="file" /> -->
          <!-- <img :src="backendImg" alt="" /> -->
          <img :src="orderCode.card2" alt="" />
        </div>
      </div>
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 31">
        <div class="list-item">
          <span class="inner-left">套餐：</span>
          <div class="choose-btn">
            <span class="select-str">{{ selectStr }}</span>
            <span class="select-btn" @click="_showChoose">请选择</span>
            <!-- <div class="inner-item" :class="[index === tcChooseIndex ? 'index' : '']" v-for="(item, index) in tcStrArr" @click="_changeTcIndex(index)">
              <i></i><span>{{ item }}</span>
            </div> -->
          </div>
        </div>
        <div class="list-item">
          <span class="inner-left">支付方式：</span>
          <div class="choose-btn">
            <div class="inner-item" :class="[index === payChooseIndex ? 'index' : '']" v-for="(item, index) in payStrArr" @click="_changePayIndex(index)">
              <i></i><span>{{ item }}</span>
            </div>
          </div>
        </div>
        <div class="list-item" style="color:#e4393c;" v-if="payChooseIndex === 2 && (parseInt(orderCode.buy_type) === 1)"> * 如果信用卡(POS机)付款，需支付手续费{{ Math.ceil((parseInt(showMarketPrice) + parseInt(showCreditDiffPrice)) * 0.006) }}元&nbsp;(手续费另算)</div>
        <div class="list-item" style="color:#e4393c;" v-if="parseInt(orderCode.buy_type) === 1 && (parseInt(showMarketPrice) - parseInt(showShopPrice) > 0)"> * {{ parseInt(showMarketPrice) - parseInt(showShopPrice) }}元 不参与任务退款</div>
        <div class="list-item" style="color:#e4393c;" v-if="payChooseIndex === 2 && (parseInt(orderCode.buy_type) === 2) && (parseInt(showCreditDiffPrice) !== 0)"> * 如果信用卡(POS机)付款，需支付手续费{{ Math.ceil(parseInt(showCreditDiffPrice) * 0.006) }}元&nbsp;(手续费另算)</div>
        <div class="list-item" v-if="parseInt(orderCode.buy_type) === 1">
          <span class="left">价格：{{ showMarketPrice }}元</span>
        </div>
        <div class="list-item" v-if="parseInt(orderCode.buy_type) === 2">
          <span class="left">贷款金额：{{ showShopPrice }}元</span>
        </div>
        <div class="list-item" v-if="parseInt(orderCode.buy_type) === 2 && (parseInt(showCreditDiffPrice) !== 0)">
          <span class="left">补差价：{{ showCreditDiffPrice }}元</span>
        </div>
        <div class="list-item">
          <span class="inner-left">领机方式：{{ parseInt(orderCode.buy_type) === 1 ? '押金' : '信用' }}</span>
          <!-- <div class="choose-btn">
            <div class="inner-item" :class="[index === ljChooseIndex ? 'index' : '']" v-for="(item, index) in ljStrArr" @click="_changeLjIndex(index)">
              <i></i><span>{{ item }}</span>
            </div>
          </div> -->
        </div>
        <!-- 只有信用方式的才会显示拍照 -->
        <div class="list-item" v-show="parseInt(orderCode.buy_type) === 2">
          <span class="inner-left">拍照：</span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;" @click="_tickPhoto">
            <!-- <input type="file" /> -->
            <img :src="photoImgOut" alt="" />
          </div>
        </div>
        <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submitOne">下一步</span>
          <span class="close-btn" @click="_resetOne">重置</span>
        </div>
      </div>
      <!-- 录视频 -->
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 35">
        <div class="list-item">
          <span class="inner-left" style="width:6rem;">录制视频：</span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;">
            <!-- <input type="file" /> -->
            <img :src="videoImg" alt="" />
          </div>
        </div>
        <div class="list-item">
          <span class="inner-left" style="width:6rem;"></span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;">
            <span class="video-btn" @click="_videoLoad">录制</span>
            <span class="video-btn" @click="_videoPlay">播放</span>
            <span class="video-btn" @click="_openNewWin">消费分期告知书</span>
          </div>
        </div>
         <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submitTwo">下一步</span>
          <span class="sure-btn" @click="_returnBtn(31)">上一步</span> 
          <!-- <span class="close-btn" @click="_resetTwo">重置</span> -->
        </div>
      </div>
      <!-- 领机码 -->
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 36">
        <div class="list-item">
          <span class="left">套餐：{{ orderCode.name }}</span>
        </div>
        <div class="list-item">
          <span class="left">付款方式：支付宝</span>
        </div>
        <div class="list-item">
          <span class="left">价格：{{ orderCode.market_price }}元</span>
        </div>
        <div class="list-item">
          <span class="left">领机方式：{{ parseInt(orderCode.buy_type) === 1 ? '押金' : '信用' }}</span>
        </div>
        <div class="list-item">
          <span class="inner-left" style="height:26px;line-height:26px">领机码：</span>
          <div class="img-wrapper" style="margin-left:10px">
            <input type="text" class="code-ipt" v-model="threeData.pin" />
          </div>
        </div>
        <div class="list-item">
          <span class="inner-left">拍照：</span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;" @click="_tickPhoto">
            <!-- <input type="file" class="file-ipt" /> -->
            <img :src="photoImgThreeOut" alt="" />
          </div>
        </div>
        <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submitThree">下一步</span>
          <span class="sure-btn" @click="_returnBtn(35)">上一步</span>
          <!-- <span class="close-btn" @click="_resetTwo">重置</span> -->
        </div>
      </div>
      <!-- 合同打印 -->
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 38">
        <div class="list-item">
          <span class="inner-left">打印合同：</span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;margin-top:2rem;">
            <a class="video-btn" style="color:#fff;" :href="getHtMsg.purchase" target="_blank" v-if="getHtMsg.purchase">购机合同</a>
            <a class="video-btn" style="color:#fff;" :href="getHtMsg.stages" target="_blank" v-if="getHtMsg.stages">消费分期借款合同</a>
            <a class="video-btn" style="color:#fff;" :href="getHtMsg.withhold" target="_blank" v-if="getHtMsg.withhold">个人账户代扣款项及相关事宜委托授权书</a>
            <a class="video-btn" style="color:#fff;margin-top:1.5rem;" :href="getHtMsg.notice" target="_blank" v-if="getHtMsg.notice">消费分期告知书</a>
          </div>
        </div>
        <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submitFour">下一步</span>
          <span class="sure-btn" @click="_returnBtn(36)">上一步</span>
          <!-- <span class="close-btn" @click="_resetTwo">重置</span> -->
        </div>
      </div>
    </div>
    <!-- 录制视频 -->
    <div class="jiequ-btn" v-show="videoShow">
      <div class="video-wrapper">
        <div class="video-tick">
          <video id="videoLz" width="640" height="480" autoplay controls></video>
        </div>
        <div class="video-btn"><a @click="_submitVideo">确定</a><a style="margin-left: 6rem;" @click="_resetCloseVideo">取消</a></div>
      </div>
    </div>
    <!-- 播放视频 -->
    <div class="jiequ-btn bofang-video" v-show="videoPlayShow">
      <div class="video-wrapper">
        <div class="video-tick">
          <!-- <video id="videoLz" width="640" height="480" autoplay controls></video> -->
        </div>
        <div class="video-btn"><a @click="_closePlayVideo">关闭</a></div>
      </div>
    </div>
    <!-- 拍照 -->
    <div class="jiequ-btn" v-show="tickShow">
      <div class="video-wrapper">
        <div class="video-tick">
          <video id="video" width="640" height="480"></video>
          <canvas width="640" height="480" id="canvas" style="position:absolute;top:0;left:0;z-index:-1;"></canvas>
        </div>
        <div class="video-btn"><a @click="_submitPic">截取</a></div>
      </div>
    </div>
    <!-- 套餐类型选择 -->
    <transition name="chooseout">
      <div class="choose-wrapper" v-show="showChoose">
        <transition name="chooseinner">
          <div class="choose-inner" v-show="showChoose">
            <i class="close-btn" @click="_closeChoose"></i>
            <div class="tc-all">
              <div class="inner-item" :class="[index === tcChooseIndex ? 'index' : '']" v-for="(item, index) in prodList" v-if="parseInt(item.stock) > 0" @click="_changeTcIndex(index)">
                <i></i><span>{{ item.name }}</span>
              </div>
            </div>
            <div class="submit-btn" @click="_submitTc">确定</div>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 倒计时返回弹框 -->
    <transition name="returnout">
      <div class="return-wrapper" v-show="showReturn">
        <transition name="returninner">
          <div class="return-inner" v-show="showReturn">
            <p class="title">数据提交成功...</p>
            <router-link :to="{name: 'index'}">{{ closeCount }}秒后跳转首页</router-link>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 显示大图片 -->
    <transition name="picout">
      <div class="bigpic-wrapper" @click="_closeBigPic" v-show="showBigPic">
        <transition name="picinner">
          <div class="bigpic-inner" v-show="showBigPic">
            <img :src="bigPic" alt="" />
          </div>
        </transition>
      </div>
    </transition>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import $ from 'jquery';
  
  // 引入session
  import Session from 'common/js/sessionStorage';

  const ORDER_CODE_STR = 'order_code_str';

  export default {
    data () {
      return {
        videoPlayShow: false, // 显示播放video
        videoShow: false, // 录制视频的video是否显示
        tickShow: false,
        tipsStr: '', // 提示字段
        selectStr: '无', // 当前套餐选择的字段
        faceImg: require('../../assets/card_on_img.png'), // 身份证正面照
        backendImg: require('../../assets/card_bottom_img.png'), // 身份证反面照
        photoImg: require('../../assets/proto_img.png'), // 拍照的图片
        photoImgThreeOut: require('../../assets/proto_img.png'), // 拍照的图片
        videoImg: require('../../assets/video_img.png'), // 视频的图片
        showBigPic: false, // 显示放大的图片
        bigPic: '', // 存放大图片地址的地方
        showChoose: false,
        showReturn: false,
        closeCount: 3, // 距离关闭的秒速
        time: null,
        tcChooseIndex: 0,
        // tcStrArr: ['套餐1', '套餐2', '套餐3'],
        payChooseIndex: 0,
        payStrArr: ['支付宝', '微信', 'POS机', '现金'],
        // allMoneySxf: 2499, // 如果是pos机支付方式就显示
        // ljChooseIndex: 0,
        // ljStrArr: ['信用', '押金'],
        dataOption: {
          token: '', // 员工登录TOKEN
          registerId: '', // 申请单ID
          payType: 0, // 支付方式
          productId: '', // 套餐类型
          pic1: require('../../assets/proto_img.png') // 照片1
        },
        photoImgOut: require('../../assets/proto_img.png'),
        hasProto: false,
        hasProtoThree: false, // 第三步的照片
        showMarketPrice: '',
        showCreditDiffPrice: '',
        showShopPrice: '',
        webcam: true, // 有没有摄像头

        videoEnabled: false, // 用于存放是否开启了视频录制
        MediaUtils: null, // 媒体设备单元
        recorder: null, // 用于存放 MediaRecorder 对象和音频Track，关闭录制和关闭媒体设备需要用到
        mediaStream: '', // 关闭媒体流需要关闭的流
        recorderFile: null, // 用于存放录制后的音频文件对象和录制结束回调
        stopRecordCallback: null,
        threeData: {
          token: '', // 员工TOKEN
          registerId: '', // 申请单ID
          pin: '', // 手机机器码
          pic1: '' // 拍的图片
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      orderCode: state => state.orderCode,
      prodList: state => state.prodList,
      getHtMsg: state => state.getHtMsg
    }),
    created () {
      var th = this;
      // 当前套餐选中的字段以及id
      this.selectStr = this.orderCode.name;
      this.dataOption.productId = this.orderCode.sel_product;
      this.showMarketPrice = this.orderCode.market_price;
      this.showCreditDiffPrice = this.orderCode.credit_diff_price;
      this.showShopPrice = this.orderCode.shop_price;
      this.$nextTick(() => {
        if (parseInt(this.orderCode.status) === 36) {
          $('.pay-page .code-ipt').focus();
        } else if (parseInt(this.orderCode.status) === 38) {
          this.$store.dispatch('getHtMsg', {token: this.memberLogin.token, registerId: this.orderCode.id}).then(res => {
             // this.$refs.loading.hideLoad();
             // console.log(res);
          });
        }
        this._getList();
        // 调用摄像头
        var video = document.getElementById('video');
         // console.log(video);
        // canvas = document.getElementById('canvas'),
        // snap = document.getElementById('tack'),
        // img = document.getElementById('img'),
        var vendorUrl = window.URL || window.webkitURL;
        // 媒体对象
       window.navigator.getMedia = window.navigator.getUserMedia ||
                             window.navagator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia;
       window.navigator.getMedia({
            video: true, // 使用摄像头对象
            audio: false  // 不适用音频
        }, function (strem) {
            video.src = vendorUrl.createObjectURL(strem);
            video.play();
        }, function (err) {
            console.log(err);
            alert('请插入摄像头');
            th.webcam = false;
        });
       // 初始化录像
        this._resetVideo();
      });
    },
    methods: {
      _promisifiedOldGUM (constraints) {
          // 第一个拿到getUserMedia，如果存在
          var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

          // 有些浏览器只是不实现它-返回一个不被拒绝的承诺与一个错误保持一致的接口
          if (!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser-getUserMedia是不是在这个浏览器实现'));
          }

          // 否则，调用包在一个旧navigator.getusermedia承诺
          return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
          });
      },
      _startRecord (enableVideo) {
          var th = this;
          this.videoEnabled = enableVideo;
          this.MediaUtils.getUserMedia(enableVideo, true, function (err, stream) {
              if (err) {
                  throw err;
              } else {
                  // 通过 MediaRecorder 记录获取到的媒体流
                  // console.log(1);
                  th.recorder = new MediaRecorder(stream);
                  th.mediaStream = stream;
                  var chunks = [];
                  // var startTime = 0;
                  th.recorder.ondataavailable = function (e) {
                      chunks.push(e.data);
                  };
                  th.recorder.onstop = function (e) {
                      th.recorderFile = new Blob(chunks, { 'type': th.recorder.mimeType });
                      chunks = [];
                      if (th.stopRecordCallback !== null) {
                          th.stopRecordCallback();
                      }
                  };
                  // console.log(2);
                  th.recorder.start();
              }
          });
      },
      // 停止录制
      _stopRecord (callback) {
          this.stopRecordCallback = callback;
          // 终止录制器
          this.recorder.stop();
          // 关闭媒体流
          this.MediaUtils.closeStream(this.mediaStream);
      },
      // 播放录制的音频
      _playRecord () {
          var url = URL.createObjectURL(this.recorderFile);
          var dom = document.createElement(this.videoEnabled ? 'video' : 'audio');
          dom.autoplay = true;
          dom.controls = true;
          dom.src = url;
          if (this.videoEnabled) {
              // dom.width = 640;
              // dom.height = 480;
              // dom.style.zIndex = '9999999';
              // dom.style.position = 'fixed';
              // dom.style.left = '0';
              // dom.style.right = '0';
              // dom.style.top = '0';
              // dom.style.bottom = '0';
              // dom.style.margin = 'auto';
              $('.bofang-video .video-tick').append(dom); // 情况
              // document.body.appendChild(dom);
          }
      },
      _resetVideo () {
        // 旧的浏览器可能无法实现mediadevices可言，所以我们设置一个空的对象第一
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        // 一些浏览器部分实现mediadevices。我们不能只指定一个对象
        // 随着它将覆盖现有的性能getUserMedia
        // 在这里，我们就要错过添加getUserMedia财产
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = this._promisifiedOldGUM;
        }

        // Prefer camera resolution nearest to 1280x720.
        var constraints = {
            audio: true,
            video: {
                width: 1280,
                height: 720
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                var video = $('#videoLz').attr('src', window.URL.createObjectURL(stream));
                // console.log(window.URL.createObjectURL(stream));
                // video.src = window.URL.createObjectURL(stream);
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ':' + err.message);
            });
        this.MediaUtils = {
            /**
             * 获取用户媒体设备(处理兼容的问题)
             * @param videoEnable {boolean} - 是否启用摄像头
             * @param audioEnable {boolean} - 是否启用麦克风
             * @param callback {Function} - 处理回调
             */
            getUserMedia: function (videoEnable, audioEnable, callback) {
                window.navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.getUserMedia;
                var constraints = {video: videoEnable, audio: audioEnable};
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        callback(false, stream);
                    })['catch'](function (err) {
                        callback(err);
                    });
                } else if (navigator.getUserMedia) {
                    navigator.getUserMedia(constraints, function (stream) {
                        callback(false, stream);
                    }, function (err) {
                        callback(err);
                    });
                } else {
                    callback(new Error('Not support userMedia'));
                }
            },

            /**
             * 关闭媒体流
             * @param stream {MediaStream} - 需要关闭的流
             */
            closeStream: function (stream) {
                if (typeof stream.stop === 'function') {
                    stream.stop();
                } else {
                    let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

                    for (let i = 0; i < trackList.length; i++) {
                        let tracks = trackList[i];
                        if (tracks && tracks.length > 0) {
                            for (let j = 0; j < tracks.length; j++) {
                                let track = tracks[j];
                                if (typeof track.stop === 'function') {
                                    track.stop();
                                }
                            }
                        }
                    }
                }
            }
        };
        // this._startRecord(true);
        // setTimeout(() => {
        //     // $('#video').hide();
        //     // 结束
        //     this._stopRecord(function () {
        //         // 播放
        //         this._playRecord();
        //     });
        // }, 1000);
      },
      // 开始录制视频
      _videoLoad () {
        this.videoShow = true;
        this._startRecord(true);
      },
      // 截取录制完视频
      _submitVideo () {
        this._stopRecord(() => {
            this.videoShow = false;
            this._showTip('录制成功');
            // 播放
            // this._playRecord();
        });
      },
      // 取消视频录制
      _resetCloseVideo () {
        this._stopRecord(() => {
            this.videoShow = false;
            this.recorder = null;
        });
      },
      // 播放录制的视频
      _videoPlay () {
        // 如果视频对象是空的就直接提示错误
        if (!this.recorder) {
          this._showTip('请先录制视频');
          return false;
        }
        this.videoPlayShow = true; // 显示播放视频
        this._playRecord();
        // console.log(1);
      },
      _closePlayVideo () {
        $('.bofang-video .video-tick').empty(); // 情况
        this.videoPlayShow = false;
      },
      // 重置第一步
      _resetOne () {
        this.hasProto = false;
        this.payChooseIndex = 0;
        this.photoImgOut = this.photoImg;
        this.dataOption.pic1 = '';
        this.selectStr = this.orderCode.name;
        this.dataOption.productId = this.orderCode.sel_product;
        this.showMarketPrice = this.orderCode.market_price;
        this.showCreditDiffPrice = this.orderCode.credit_diff_price;
        this.showShopPrice = this.orderCode.shop_price;
        var len = this.prodList.length;
        for (var i = 0; i < len; i++) {
          if (parseInt(this.prodList[i].id) === parseInt(this.orderCode.sel_product)) {
            // 当前套餐所在的位置
            this.tcChooseIndex = i;
            break;
          }
        }
      },
      // 拍照
      _tickPhoto () {
        this.tickShow = true;
        // $('.web-wrapper').show();
      },
      _submitPic () {
        // setTimeout(() => {
        //   this.photoImgOut = document.getElementById('canvas').toDataURL('image/png');
        // }, 150);
        // setTimeout(() => {
        //   $('.web-wrapper').hide();
        //   this.tickShow = false;
        //  }, 850);
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        // 绘制canvas图形
        canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
        // 把canvas图像转为img图片
        if (parseInt(this.orderCode.status) === 31) {
          this.photoImgOut = canvas.toDataURL('image/png');
          this.hasProto = true;
        } else if (parseInt(this.orderCode.status) === 36) {
          this.photoImgThreeOut = canvas.toDataURL('image/png');
          this.hasProtoThree = true;
        }
        this.tickShow = false;
      },
      // 返回上一步
      _returnBtn (statusCode) {
        var returnData = { // 返回上一步需要的数据
          token: this.memberLogin.token, // 员工TOKEN
          registerId: this.orderCode.id, // 申请单ID
          newStatus: statusCode // 要返回的状态
        };
        this.$refs.loading.showLoad();
        this.$store.dispatch('returnPrev', returnData).then(res => {
            if (res.data.result === 'success') {
              this.$store.dispatch('orderCode', {token: this.memberLogin.token, orderNo: Session.fetch(ORDER_CODE_STR)}).then(res => {
                  this.$refs.loading.hideLoad();
                  if (res.data.result !== 'success') {
                    this._showTip(res.data.msg);
                  }
              });
              // this._showReturn();
            } else {
              this.$refs.loading.hideLoad();
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
        });
      },
      // 提交订单
      _submitOne () {
        if (!this.webcam) {
          this._showTip('请插入摄像头,插入摄像头后,请按F5刷新页面');
          return;
        }
        if (!this.hasProto && (parseInt(this.orderCode.buy_type) === 2)) {
          this._showTip('必须上传照片');
          return;
        }
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.dataOption.registerId = this.orderCode.id;
        this.dataOption.payType = parseInt(this.payChooseIndex) + 1;
        this.dataOption.pic1 = this.photoImgOut;
        // 替换加号
        // this.dataOption.pic1 = this.dataOption.pic1.replace('+', '%2B');
        // url编码
        this.dataOption.pic1 = encodeURIComponent(this.dataOption.pic1);
        // console.log(this.dataOption);
        this.$store.dispatch('postPay', this.dataOption).then(res => {
            if (res.data.result === 'success') {
              this.$store.dispatch('orderCode', {token: this.memberLogin.token, orderNo: Session.fetch(ORDER_CODE_STR)}).then(res => {
                  this.$refs.loading.hideLoad();
                  if (res.data.result !== 'success') {
                    this._showTip(res.data.msg);
                  }
              });
              // this._showReturn();
            } else {
              this.$refs.loading.hideLoad();
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
        });
      },

      // 提交第二部
      _submitTwo () {
        if (!this.recorder) {
          this._showTip('请先录制视频');
          return false;
        }
        var th = this;
        // console.log(2);
        var data = new FormData();
        data.append('token', this.memberLogin.token);
        data.append('registerId', this.orderCode.id);
        data.append('video', this.recorderFile);
        this.$refs.loading.showLoad();
        $.ajax({
              type: 'POST',
              // url: 'http://staffv2.megglife.com/v2/registers/video',
              url: 'https://newstaffapi.megglife.com/v2/registers/video',
              // data to be added to query string:
              data: data,
              // type of data we are expecting in return:
              dataType: 'json',
              processData: false,   //  告诉jquery不要处理发送的数据
              contentType: false,    // 告诉jquery不要设置content-Type请求头
              // headers: {'Authorization': 'APPCODE 1776380a0d6a4ed097634f4d64a88927'},
              // timeout: 300,
              // context: $('body'),
              success: function (res) {
                // console.log(res.data.result);
                if (res.data.result === 'success') {
                    th.recorder = null;
                    th.$store.dispatch('orderCode', {token: th.memberLogin.token, orderNo: Session.fetch(ORDER_CODE_STR)}).then(res => {
                        th.$refs.loading.hideLoad();
                        if (res.data.result !== 'success') {
                          th._showTip(res.data.msg);
                        }
                        th.$nextTick(() => {
                          $('.pay-page .code-ipt').focus();
                        });
                    });
                    // this._showReturn();
                } else {
                  th.$refs.loading.hideLoad();
                  var obj = JSON.parse(res.data.message);
                  for (var key in obj) {
                    th._showTip(obj[key]);
                    return;
                  }
                }
              },
              error: function (xhr, type) {
                console.log(xhr);
                  // alert('Ajax error!')
                  // this.$refs.loading.hideLoad();
                  // var obj = JSON.parse(res.data.message);
                  // for (var key in obj) {
                  //     this._showTip(obj[key]);
                  //     return;
                  // }
              }
        });
      },
      // 重置第二步
      // _resetTwo () {
      //   console.log(2);
      // },
      // 第三步提交
      _submitThree () {
          if (this.threeData.pin === '') {
            this._showTip('领机码不能为空');
            return false;
          }
          if (!this.hasProtoThree) {
            this._showTip('必须上传照片');
            return;
          }
          // 提交数据
          this.$refs.loading.showLoad();
          this.threeData.token = this.memberLogin.token;
          this.threeData.registerId = this.orderCode.id;
          // 替换加号
          // this.dataOption.pic1 = this.dataOption.pic1.replace('+', '%2B');
          // url编码
          this.threeData.pic1 = this.photoImgThreeOut;
          this.threeData.pic1 = encodeURIComponent(this.threeData.pic1);
          this.$store.dispatch('postLing', this.threeData).then(res => {
              if (res.data.result === 'success') {
                this.$store.dispatch('orderCode', {token: this.memberLogin.token, orderNo: Session.fetch(ORDER_CODE_STR)}).then(rest => {
                    if (rest.data.result === 'success') {
                      // 获取购机合同
                      this.$store.dispatch('getHtMsg', {token: this.memberLogin.token, registerId: this.orderCode.id}).then(res2 => {
                         this.$refs.loading.hideLoad();
                         // console.log(res);
                      });
                    } else {
                      this._showTip(res.data.msg);
                    }
                });
                // this._showReturn();
              } else {
                this.$refs.loading.hideLoad();
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
              }
          });
      },

      _submitFour () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('dayingHt', {token: this.memberLogin.token, registerId: this.orderCode.id}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.data.result === 'success') {
            this._showReturn();
          } else {
            this._showTip('提交失败');
          }
        });
      },

      // 最后一步 返回主页面
      _showReturn () {
        this.showReturn = true;
        this._djs();
      },
      // 倒计时
      _djs () {
        // console.log(this.closeCount > 0);
        if (this.closeCount === 0) {
          this.time = null;
          this.$router.replace({name: 'index'});
        } else {
          this.time = setTimeout(() => {
            this.closeCount--;
            this._djs();
          }, 1000);
        }
      },
      _getList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('prodList', {token: this.memberLogin.token}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.data.result === 'success') {
              var len = res.data.cnt.length;
              for (var i = 0; i < len; i++) {
                if (parseInt(res.data.cnt[i].id) === parseInt(this.orderCode.sel_product)) {
                  // 当前套餐所在的位置
                  this.tcChooseIndex = i;
                  break;
                }
              }
            } else {
              this._showTip('数据获取失败');
            }
        });
      },
      // 改变套餐
      _changeTcIndex (index) {
        if (this.tcChooseIndex !== index) {
          this.tcChooseIndex = index;
        }
      },
      // 提交套餐选项
      _submitTc () {
        this.selectStr = this.prodList[this.tcChooseIndex].name;
        this.dataOption.productId = this.prodList[this.tcChooseIndex].id; // 产品id
        this.showMarketPrice = this.prodList[this.tcChooseIndex].market_price; // 押金金额
        this.showShopPrice = this.prodList[this.tcChooseIndex].shop_price; // 贷款金额
        this.showCreditDiffPrice = this.prodList[this.tcChooseIndex].credit_diff_price; // 补差价
        this.showChoose = false;
      },
      // 改变支付方式
      _changePayIndex (index) {
        if (this.payChooseIndex !== index) {
          this.payChooseIndex = index;
        }
      },
      // 消费分期告知书
      _openNewWin () {
        var countTask = parseInt(this.orderCode.buy_type) === 1 ? parseInt(this.orderCode.task_count) : parseInt(this.orderCode.credit_task_count);
        // console.log(parseInt(this.orderCode.buy_type) === 1 ? parseInt(this.orderCode.task_count) : parseInt(this.orderCode.credit_task_count));
        // window.open('http://192.168.88.125:3500/xfgzs?money=' + parseInt(this.orderCode.shop_price) + '&task=' + parseInt(this.orderCode.task_count) + '&name=' + this.orderCode.true_name);
        window.open('https://companynew.megglife.com/xfgzs?money=' + parseInt(this.orderCode.shop_price) + '&task=' + countTask + '&name=' + this.orderCode.true_name);
        // console.log(this.orderCode.task_count);
        // console.log(parseInt(this.orderCode.shop_price));
      },
      // 改变领机方式
      // _changeLjIndex (index) {
      //   if (this.ljChooseIndex !== index) {
      //     this.ljChooseIndex = index;
      //   }
      // },
      _showChoose () {
        this.showChoose = true;
      },
      _closeChoose () {
        this.showChoose = false;
      },
      // 显示大图
      _showBigPic (type) {
        this.bigPic = this.orderCode[type];
        this.showBigPic = true;
      },
      _closeBigPic () {
        this.showBigPic = false;
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
  @import "../../common/stylus/mixin.styl";
  
  .pay-page
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    min-width: 1280px
    min-height: 720px;
    background: url(../../assets/pay_page_bg.jpg) center no-repeat
    background-size: 100% 100%
    .jiequ-btn
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      margin: auto
      background: rgba(0, 0, 0, 0.6)
      z-index: 11111111111111111
      .video-wrapper
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        margin: auto
        width: 640px
        height: 522px
        background: #fff
        .video-tick
          height: 480px
        .video-btn
          padding: 6px 0 
          background: #fff
          text-align: center
          // color: #fff
          a
            display: inline-block
            text-align: center
            width: 120px
            height: 30px
            line-height: 30px
            background: #333
            color:#fff
            border-radius: 5px
            cursor: pointer
    // .jiequ-btn
    //   position: fixed
    //   top: 400px
    //   left: 0
    //   right: 0
    //   bottom: 0
    //   margin: auto
    //   // margin-top: 0px
    //   width: 506px
    //   height: 40px
    //   padding: 10px 0 5px 0
    //   text-align: center
    //   background: #fff
    //   z-index: 11111111111111111
    //   a
    //     display: inline-block
    //     text-align: center
    //     width: 120px
    //     height: 30px
    //     line-height: 30px
    //     background: #333
    //     color:#fff
    //     border-radius: 5px
    .bigpic-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.picout-enter-active
        opacity: 1
      &.picout-enter,&.picout-leave-active
        opacity: 0
      .bigpic-inner
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 500px
        height: 320px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.4)
        background: rgba(255, 255, 255, 0.8)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        cursor: pointer
        &.picinner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.picinner-enter,&.picinner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        img
          display: block
          width: 100%
          height: auto
    .return-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.returnout-enter-active
        opacity: 1
      &.returnout-enter,&.returnout-leave-active
        opacity: 0
      .return-inner
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 160px
        height: 70px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.4)
        background: rgba(255, 255, 255, 0.8)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        &.returninner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.returninner-enter,&.returninner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        .title
          padding: 12px 0
          text-align: center
        a
          display: block
          width: 100%
          text-align: center
          color: #000
          // border-bottom: 1px solid #000
    .choose-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.chooseout-enter-active
        opacity: 1
      &.chooseout-enter,&.chooseout-leave-active
        opacity: 0
      .choose-inner
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 460px
        height: 380px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.4)
        background: rgba(0, 0, 0, 0.8)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        &.chooseinner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.chooseinner-enter,&.chooseinner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        .close-btn
          position: absolute
          top: 8px
          right: 8px
          width: 22px
          height: 22px
          background: url(../../assets/close_btn.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .submit-btn
          margin-left: 35px
          color: #fff
          width: 120px
          height: 36px
          line-height: 36px
          text-align: center
          background: url(../../assets/blue_small_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .tc-all
          padding: 36px 20px 0 20px
          height: 290px
          overflow: hidden
          .inner-item
            float: left
            margin-left: 14px
            margin-bottom: 8px
            cursor: pointer
            span
              margin-left: 4px
              display: inline-block
              vertical-align: middle
              line-height: 20px
              height: 20px
              color: #fff
            i
              display: inline-block
              vertical-align: middle
              width: 20px
              height: 20px
              background: url(../../assets/choose_icon.png) center no-repeat
              background-size: 100% 100%
            &.index
              i
                background: url(../../assets/choose_index_icon.png) center no-repeat
                background-size: 100% 100%
    .edit-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      margin: auto
      width: 600px
      height: 670px
      padding: 20px 60px
      background: url(../../assets/inner_back_bg.png) center no-repeat
      background-size: 100% 100%
      .list-item
        font-size: 16px
        padding: 10px 0
        color: #fff
        overflow: hidden
        .sure-btn
          display: inline-block
          margin-top: 8px
          margin-right: 60px
          width: 120px
          height: 36px
          line-height: 36px
          font-size: 16px
          background: url(../../assets/blue_small_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .close-btn
          display: inline-block
          margin-top: 8px
          width: 120px
          height: 36px
          line-height: 36px
          font-size: 16px
          background: url(../../assets/white_small_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .left
          float: left
          width: 50%
        .inner-left
          float: left
          line-height: 20px
          height: 20px
        .choose-btn
          float: left
          .select-str
            display: inline-block
            vertical-align: middle
            margin: 0 10px
            height: 20px
            line-height: 20px
            color: #fff
          .select-btn
            display: inline-block
            vertical-align: middle
            height: 20px
            line-height: 20px
            color: #3fc4ec
            border-bottom: 1px solid #3fc4ec
            cursor: pointer
          .inner-item
            float: left
            margin-left: 14px
            cursor: pointer
            span
              margin-left: 4px
              display: inline-block
              vertical-align: middle
              line-height: 20px
              height: 20px
            i
              display: inline-block
              vertical-align: middle
              width: 20px
              height: 20px
              background: url(../../assets/choose_icon.png) center no-repeat
              background-size: 100% 100%
            &.index
              i
                background: url(../../assets/choose_index_icon.png) center no-repeat
                background-size: 100% 100%
        .img-wrapper
          position: relative
          float: left
          margin-left: 40px
          overflow: hidden
          .code-ipt
            display: inline-block
            padding: 5px
            font-size: 16px
            line-height: 16px
            border-radius: 3px
            background: rgba(190, 188, 187, 1)
            color: #fff
          .video-btn
            display: inline-block
            border: 1px solid #fff
            padding: 0.4rem 0.6rem
            font-size: 0.9rem
            margin-right: 1rem
            border-radius: 3px
            cursor: pointer
          img
            display: block
            width: 180px
            height: 120px
          // input
          //   position: absolute
          //   display: block
          //   top: 0
          //   left: 0
          //   right: 0
          //   bottom: 0
          //   opacity: 0
          //   cursor: pointer
</style>
