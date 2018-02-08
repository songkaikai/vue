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
        // QRCode.toCanvas('http://192.168.88.125:8080/#/register?uname=' + this.uname, data, function (err, canvas) {
        QRCode.toCanvas('http://h5.xthhly.com/register?uname=' + this.uname, data, function (err, canvas) {
          if (err) throw err;
          canvas.style.width = '9.5rem';
          canvas.style.height = '9.5rem';
          self.$refs.qrcode.appendChild(canvas);
        });
      });
    }
  };
</script>
