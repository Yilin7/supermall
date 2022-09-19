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
    // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

         // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
        
      })

      // 3.请求推荐数据
      getRecommend().then(res => {         
          this.recommends= res.data.list
        })

      // 4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
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
      // 1.获取y值
      const positionY = -position.y

      // 2.positionY和主题中值进行对比
      let length = this.themeTopYs.length
      for(let i=0; i < length - 1; i++) {
        // 2.hack做法
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && 
        positionY < this.themeTopYs[i + 1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }

        // 1.普通做法
        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this
        // .themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY
        // >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }
      // 3.是否显示回到顶部
       this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
    },
    // 加入购物车
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里
      // this.$store.commit('addCart',product)
      // 法一
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
      // 法二
      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res);
        
      // })

      // 3.添加到购物车成功


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