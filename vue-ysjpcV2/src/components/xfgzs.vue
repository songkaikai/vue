<template>
  <div class="sq-wrapper">
    <p class="all-title">消费分期告知书</p>
    <div class="information-wrapper">
      <p>我已确认向&nbsp;"三鼎小贷'&nbsp;贷款<span class="decoration-text money"></span>元，用于购买手机套餐，每月还款<span class="decoration-text">&nbsp;&nbsp;&nbsp; 690 &nbsp;&nbsp;&nbsp;</span>元，共需还款<span class="decoration-text task">&nbsp;&nbsp;&nbsp; 10 &nbsp;&nbsp;&nbsp;</span>个月</p>
    </div>
    <div class="sq-info-wrapper" style="margin-top: 40px;">
      <div class="list-item">
        <!-- <div class="left-item">甲方： HUA</div> -->
        <div class="right-item" style="font-size: 16px;">确认人：<span class="user"></span></div>
      </div>
      <div class="list-item" style="margin-top: 20px;">
        <!-- <div class="left-item">联系方式：13841154120</div> -->
        <div class="right-item"><span class="decoration-text year">&nbsp;&nbsp;&nbsp; 2017 &nbsp;&nbsp;&nbsp;</span>年<span class="decoration-text month">&nbsp;&nbsp;&nbsp; 10 &nbsp;&nbsp;&nbsp;</span>月<span class="decoration-text day">&nbsp;&nbsp;&nbsp; 5 &nbsp;&nbsp;&nbsp;</span>日</div>
      </div>
    </div>
  </div>

</template>

<script>
  import $ from 'jquery';

  export default {
    created () {
      var query = this.$route.query;
      // console.log($('.money'));
      this.$nextTick(() => {
        $('.money').html('&nbsp;&nbsp;&nbsp;' + query.money + '&nbsp;&nbsp;&nbsp;');
        $('.task').html('&nbsp;&nbsp;&nbsp;' + query.task + '&nbsp;&nbsp;&nbsp;');
        $('.user').html(query.name);
        var data = new Date();
        $('.year').html(data.getFullYear());
        $('.month').html(data.getMonth() + 1);
        $('.day').html(data.getDate());
        // 打印
        window.print();
      });
    }
  };
</script>

<style scpoed>
  /*body,p,div{margin:0;padding:0;}*/
  .sq-wrapper{padding: 0 10px;font-size: 15px;background: #fff;}
  .sq-wrapper .all-title{text-align: center;font-size: 20px;padding: 15px 0 35px 0;}
  .sq-wrapper .sq-info-wrapper .list-item{overflow: hidden;}
  .sq-wrapper .sq-info-wrapper .list-item{padding: 2px 0;}
  .sq-wrapper .sq-info-wrapper .list-item .left-item{float: left;width: 50%;}
  .sq-wrapper .sq-info-wrapper .list-item .right-item{float: right;width: 50%;}
  .sq-wrapper .sq-info-wrapper .list-item .right-item .decoration-text{border-bottom:1px solid #000;padding: 0 15px; min-width:100px; text-align: center;}
  .sq-wrapper .information-wrapper{margin-top: 15px;}
  .sq-wrapper .information-wrapper p{text-indent:35px; line-height: 22px;padding-bottom: 12px;}
  .sq-wrapper .information-wrapper p .decoration-text{border-bottom:1px solid #000;padding: 0 15px; min-width:100px; text-align: center;}
  .sq-wrapper .end-wrapper{margin-top: 56px;}
  .sq-wrapper .end-wrapper p{margin-top: 7px;overflow: hidden;}
  .sq-wrapper .end-wrapper p .left{float:left;width:50%;}
  .sq-wrapper .end-wrapper p .right{float:right;width:50%;}
  .sq-wrapper .end-wrapper p .decoration-text{border-bottom:1px solid #000;padding: 0 15px; min-width:100px; text-align: center;}

</style>
