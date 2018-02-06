<template>
  <div class="out-pass-page">
    <div class="edit-pass-page">
      <div class="list-item">
        <input type="password" v-model="dataOption.oldPassword" @input="filter('oldPassword')" placeholder="原密码" />
      </div>
      <div class="list-item">
        <input type="password" v-model="dataOption.newPassword" @input="filter('newPassword')" placeholder="新密码" />
      </div>
      <div class="list-item">
        <input type="password" v-model="dataOption.newPasswordConfirm" @input="filter('newPasswordConfirm')" placeholder="确认原密码" />
      </div>
      <div class="submit-btn" @click="submitPass()">确定</div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
  
</template>

<script>
 import { mapState } from 'vuex';
 // 提示框
 import tips from 'components/plugins/tips';
 import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        tipsStr: '', // 提示字段
        dataOption: {
          token: '', // 会员TOKEN
          oldPassword: '', // 原密码
          newPassword: '', // 新密码
          newPasswordConfirm: '' // 确认新密码
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    methods: {
      submitPass () {
        if (!/^\w{6,18}$/.test(this.dataOption.oldPassword)) {
          this._showTip('旧密码不能少于6位数');
          return;
        }
        if (!/^\w{6,18}$/.test(this.dataOption.newPassword)) {
          this._showTip('新密码不能少于6位数');
          return;
        }
        if (this.dataOption.newPassword !== this.dataOption.newPasswordConfirm) {
          this._showTip('两次密码不一致');
          return;
        }
        // 提交修改密码
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('editPassword', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 200) {
            this.dataOption = {
              token: '', // 会员TOKEN
              oldPassword: '', // 原密码
              newPassword: '', // 新密码
              newPasswordConfirm: '' // 确认新密码
            };
            this._showTip('修改成功');
          } else if (res.code === 401) {
            this._showTip('请重新登录');
          } else if (res.code === 500) {
              this._showTip('服务器内部错误');
          } else {
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
          }
        });
      },
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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

<style>
  .out-pass-page{position: absolute;top:0;right:0;bottom:0;left:0;background: #fff;}
  .edit-pass-page{padding: 2rem 2rem;}
  .edit-pass-page .list-item{width: 100%;margin: 0.6rem 0;}
  .edit-pass-page .list-item input{display:inline-block;width: 90%;padding: 0.6rem 4%;font-size: 0.9rem;border: 1px solid #969494;border-radius: 8px;}
  .edit-pass-page .submit-btn{width: 100%;background: #000000;color:#c5ac81;text-align: center;font-size: 0.9rem;padding: 0.6rem 0;border-radius: 6px;margin-top: 2rem;cursor:pointer;}

</style>
