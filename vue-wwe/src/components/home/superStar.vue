<template>
  <div class="superStar" ref="superstar" v-scroll="_addList">
    <transition name="starlist">
      <div class="list-wrapper" v-if="StarListShow && superStarList.length > 0">
        <div class="list-item" v-for="(item, index) in superStarList">
          <router-link :to="{name: 'detail', params: {id: item.id}}">
            <!-- <img :src="item.picture" alt=""> -->
            <img v-lazy="item.picture" alt="" />
            <p class="name">{{ item.name }}</p>
            <p class="title" v-if="item.title !== 'none'">{{ item.title }}</p>
          </router-link>
        </div>
        <p class="loading-bottom" v-show="loadingShow"><i class="icon-spinner"></i><span>loading...</span></p>
      </div>
    </transition>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import './superStar.styl';
  import { mapState } from 'vuex';
  // 引入session一次会话存储
  import Session from 'common/js/sessionStorage';
  // 引入loading组件
  import loading from '@/components/plugin/loading';

  const SUPERSTARLIST = 'super_star_list';

  export default {
    data () {
      return {
        winHei: 0,
        // 是否能再次获取
        getAgain: true,
        loadingShow: false,
        dataOption: {
          page: 1,
          pageSize: 6
        }
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        if (!Session.fetch(SUPERSTARLIST)) {
          this.getList();
        }
      });
    },
    computed: {
      // 获取vuex状态树里面的数据
      ...mapState({
        superStarList: state => state.superStarList,
        StarListShow: state => state.StarListShow,
        getListAgain: state => state.getListAgain
      })
    },
    methods: {
      getList () {
        this.$refs.loading.showLoad();
        // 开始获取数据
        this._subList().then(() => {
          this.$refs.loading.hideLoad();
          // 显示超级巨星列表
          this.StarListShow = true;
          // console.log(this.dataOption);
        });
      },
      _addList () {
        if (this.getAgain && this.getListAgain) {
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.superstar, null).height);
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.dataOption.page += 1;
            this._subList().then(() => {
              this.loadingShow = false;
            });
          }
        }
      },
      _subList () {
        return this.$store.dispatch('superStarList', this.dataOption);
      }
    },
    components: {
      loading
    }
  };
</script>
