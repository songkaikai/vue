<template>
  <div ref="qrcode" class="qrcode"></div>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    props: ['uname'],
    created () {
      this.$nextTick(() => {
        var self = this;
        // 生成二维码
        var data = {
          errorCorrectionLevel: 'low',
          margin: 1,
          scale: 4,
          color: {
            dark: '#000',
            light: '#fff'
          }
        };
        // alert(this.userId);
        // http://192.168.0.11:8888/
        QRCode.toCanvas('http://lx.bhsxy.cn/regist?uname=' + this.uname, data, function (err, canvas) {
          if (err) throw err;
          canvas.style.width = '7.5rem';
          canvas.style.height = '7.5rem';
          self.$refs.qrcode.appendChild(canvas);
        });
      });
    }
  };
</script>
