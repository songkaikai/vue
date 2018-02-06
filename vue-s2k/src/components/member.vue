<template>
	<div class="member-page">
		{{ content }}
	</div>
</template>

<script>
  export default {
    data () {
      return {
        content: 'welcome to my chat room.',
        str: '' // 当前登录的是谁my name is Jack.count-*
      };
    },
    created () {
      // 获取当前成员
      this.str = this.$route.query.member;
    }
  };
</script>
