<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <!-- 语法一 -->
      <!-- <div slot="center">购物车({{cartLength}})</div> -->
      <!-- 语法二 -->
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from '../../components/common/navbar/NavBar.vue';
import CartList from './childComps/CartList.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'

import { mapGetters } from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 两种语法
    // 语法一
    // ...mapGetters(['cartLength','cartList'])
    // 语法二
    ...mapGetters({
      length:'cartLength'     
    })
  }
};
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>