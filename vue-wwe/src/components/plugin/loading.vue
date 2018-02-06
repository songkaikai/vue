<template>
  <transition name="loadingShow">
    <div class="loading-shade" v-show="loadShow">
      <div class="loading-icon"><i class="icon-spinner"></i><p>loading...</p></div>
    </div>
  </transition>
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
