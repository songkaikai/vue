<template>
  <div class="loading-shade" v-show="loadShow">
    <div class="loading-icon"><i class="wgf-iconspinner6"></i><p>加载中...</p></div>
  </div>
</template>

<script>
  import './loading.styl';

  export default {
    data () {
      return {
        loadShow: false
      };
    },
    methods: {
      // 显示
      showLoad () {
        this.loadShow = true;
      },
      // 隐藏
      hideLoad () {
        this.loadShow = false;
      }
    }
  };
</script>
