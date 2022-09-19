/**
 * 防抖minxin封装
 * 混入
 */
import { debounce } from "./utils";
export const itemListenerMinxin = {
  data() {
    return {
      itemImgListener: null,
      // newRefresh:null
    };
  },
  mounted() {
    // 防抖
    let newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = () => {
       //利用 $bus 事件监听，去刷新 scroll的高度
        newRefresh()
      }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    
  }
};

/**
 * 回到顶部minxin封装
 */
 import BackTop from 'components/content/backTop/BackTop'
export const backTopMinxin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    };
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
};

import {POP, NEW, SELL} from "./const";
export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
