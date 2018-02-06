<template>
  <div class="aboutMe">
    <!-- 背景图 -->
    <div class="bg-img"></div>
    <!-- 个人介绍 -->
  	<div class="information">
      <p><i class="icon-spinner"></i> S2K .</p>
      <p><i class="icon-pinterest"></i> 702302400 .</p>
      <p>
        <a href="http://m.weibo.cn/p/1005053752909834?sudaref=login.sina.com.cn">
          <i class="icon-sina"></i> songkaikai .
        </a>
      </p>
  		<p>
        <a href="https://github.com/songkaikai">
          <i class="icon-github"></i> DeanA .
        </a>
      </p>
  	</div>
  </div>
</template>

<script></script>

<style lang="stylus" rel="stylesheet/stylus">
  .aboutMe
    position: absolute
    left: 0
    right: 0
    bottom: 0
    top: 0
    .bg-img
      position: absolute
      left: 0
      right: 0
      bottom: 0
      top: 0
      background: url(./finn_bg.jpg) center no-repeat
      -webkit-filter: blur(4px)
      background-size: cover
    .information
      position: absolute
      left: 0
      right: 0
      bottom: 0
      top: 0
      width: 140px
      height: 200px
      margin: auto
      z-index: 2
      color: #fff
      text-shadow: 0 0 1px #000, 0 0 1px #000, 0 0 2px #000, 0 0 1px #000, 0 0 1px #000, 0 0 2px #000
      text-align: left
      p
        padding: 7px 0
        a
          color: #fff
</style>
