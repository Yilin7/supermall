<template>
   <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3"
            @scroll="contentScroll">
      <!-- <ul>
        <li v-for="item in $store.state.cartList">
          {{item}}
        </li>
      </ul> -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/> 
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/> 
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue"
import DetailSwiper from "./childComps/DetailSwiper.vue"
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'


import {getDetail, Goods, Shop,GoodsParam,getRecommend} from "network/detail";
import { itemListenerMinxin,backTopMinxin} from "common/mixin.js";
import { debounce } from '../../common/utils'
import {BACKTOP_DISTANCE} from "common/const"

import { mapActions } from 'vuex'

export default {
  name:"Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast,

  },
  mixins:[itemListenerMinxin, backTopMinxin],
  data(){
    return {
      iid:null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex: 0,
      // message:'',
      // show:false
    }
  },
  created(){
    // 1.???????????????iid
      this.iid = this.$route.params.iid

      // 2.??????iid??????????????????
      getDetail(this.iid).then(res => {
        // 1.?????????????????????????????????
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

         // 2.??????????????????
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.???????????????????????????
        this.shop = new Shop(data.shopInfo)

        // 4.???????????????????????????
        this.detailInfo = data.detailInfo;

        // 5.?????????????????????
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.??????????????????
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
        
      })

      // 3.??????????????????
      getRecommend().then(res => {         
          this.recommends= res.data.list
        })

      // 4.???getThemeTopY??????(??????this.themeTopYs???????????????????????????)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
      },100)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      // this.newRefresh()
      this.getThemeTopY()
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position) {
      // 1.??????y???
      const positionY = -position.y

      // 2.positionY???????????????????????????
      let length = this.themeTopYs.length
      for(let i=0; i < length - 1; i++) {
        // 2.hack??????
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && 
        positionY < this.themeTopYs[i + 1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }

        // 1.????????????
        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this
        // .themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY
        // >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }
      // 3.????????????????????????
       this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
    },
    // ???????????????
    addToCart() {
      // 1.????????????????????????????????????
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.??????????????????????????????
      // this.$store.commit('addCart',product)
      // ??????
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''
        // },1500)

        this.$toast.show(res)
        // console.log(this.$toast);
        
      })
      // ??????
      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res);
        
      // })

      // 3.????????????????????????


    }
  },
  mounted() {
  
   
  },
  destroyed() {
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
 #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 93px);
    overflow: hidden;
  }
</style>