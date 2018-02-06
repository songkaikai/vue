export default {
  promisifiedOldGUM (constraints) {
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
  }

  // 旧的浏览器可能无法实现mediadevices可言，所以我们设置一个空的对象第一
  if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
  },

  // Prefer camera resolution nearest to 1280x720.
  constraints : {
      audio: true,
      video: {
          width: 1280,
          height: 720
      }
  },

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                var video = document.querySelector('video');
                video.src = window.URL.createObjectURL(stream);
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ':' + err.message);
            });
        var MediaUtils = {
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
        // 用于存放 MediaRecorder 对象和音频Track，关闭录制和关闭媒体设备需要用到
        var recorder = '';
        var mediaStream = '';

        // 用于存放录制后的音频文件对象和录制结束回调
        var recorderFile = null;
        var stopRecordCallback = null;

        // 用于存放是否开启了视频录制
        var videoEnabled = false;

        // 录制短语音
        function startRecord (enableVideo) {
            videoEnabled = enableVideo;
            MediaUtils.getUserMedia(enableVideo, true, function (err, stream) {
                if (err) {
                    throw err;
                } else {
                    // 通过 MediaRecorder 记录获取到的媒体流
                    recorder = new MediaRecorder(stream);
                    mediaStream = stream;
                    var chunks = [];
                    var startTime = 0;
                    recorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    };
                    recorder.onstop = function (e) {
                        recorderFile = new Blob(chunks, { 'type': recorder.mimeType });
                        chunks = [];
                        if (stopRecordCallback !== null) {
                            stopRecordCallback();
                        }
                    };
                    recorder.start();
                }
            });
        }
};
