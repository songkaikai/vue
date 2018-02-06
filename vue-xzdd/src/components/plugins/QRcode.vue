<template>
  <div ref="qrcode" class="qrcode"></div>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    props: ['userId', 'uname'],
    created () {
      this.$nextTick(() => {
        var self = this;
        // 生成二维码
        var data = {
          errorCorrectionLevel: 'low',
          margin: 2,
          scale: 4,
          color: {
            dark: '#000',
            light: '#fff'
          }
        };
        // alert(this.userId);
        QRCode.toCanvas('http://192.168.0.125:8888/invitePage?uid=' + this.userId + '&uname=' + this.uname, data, function (err, canvas) {
          if (err) throw err;
          canvas.style.width = '7rem';
          canvas.style.height = '7rem';
          canvas.style.display = 'inline-block';
          self.$refs.qrcode.appendChild(canvas);
        });
      });
    }
  };
</script>
