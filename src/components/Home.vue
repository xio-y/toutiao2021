<template>
  <div class="hello">
    <div class="fixed">
   <van-search
  v-model="value"
  shape="round"
  background="rgb(238, 32, 101)"
  placeholder="请输入搜索关键词"
  @click="goSearch"
/>
    </div>
<van-swipe :autoplay="3000">
  <van-swipe-item v-for="(image, index) in images" :key="index">
    <img v-lazy="picIp+image.pictures" />
  </van-swipe-item>
</van-swipe>

<div class="list">
<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
 <div class="card" v-for="item in list" :key="item.newsId" @click="getDetail(item.newsId)">
   <div class="card-left">
     <div class="title">{{item.title}}</div>
   <div class="time">
     <span>{{item.time| moment}}</span>
     <span>{{item.source}}</span>
     <span>10评论</span>
   </div>
   </div>
   <div class="card-right">
     <img :src="picIp+item.pictures" alt="">
   </div>

 </div>
  </van-list>

</van-pull-refresh>
</div>
  </div>

</template>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';

Vue.use(Lazyload);

export default {
  name: 'Home',
  data () {
    return {
      value:'',
      picIp:'http://localhost:8080/pic/',
      images: [],
      list: [],
      loading:false,
      finished:false,
      refreshing:false,
      page:1
    }
  },
  methods: {
      getSwipeList(){
        this.axios.get("news/getSwipeNews").then((response) => {
          //console.log(response.data)
          this.images=response.data.records;
        })
      },
      onLoad() {
        //上拉加载，获取下一页数据
          if(this.refreshing){
            this.list=[];
            this.refreshing=false;
          }
          this.axios.get("news/getPageNews?current="+this.page).then((response) => {
            this.list=this.list.concat(response.data.records);
            this.loading=false;
            if(this.page>=response.data.pages){
              this.finished=true;
            }
            this.page++;
          })
         },
      onRefresh(){
          //下拉刷新
          this.finished=false;
          //重新加载数据
          //将loading设置为true,表示处于加载状态
          this.loading=true;
          this.page=1;
          this.onLoad();
        },
      goSearch(){
        this.$router.push("/Search");
      },
      getDetail(newsId){
        this.$router.push("/Detail/"+newsId)
      },
    },
    created(){
  this.getSwipeList();
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.van-swipe{
  height: 250px;
  margin-top: 50px;
}
.van-swipe img{
  height: 98%;
  width: 98%;
}
.van-search{
  height: 60px;
}
.list{
    background-color: #eee;
  }
  .card{
    display: flex;
    margin: 5px 1px;
    background-color: #fff;
  
  }
  .card-left{
    flex: 8;
    text-align: left;
    padding:5px;
  }
  .card-left .title{
    font-size: 17px;
    color: #111;
    margin-top: 10px;
  }
  .card-left .time{
    font-size: 12px;
    color: #aaa;
    margin-top: 60px;
  }
  .card-left .time span{
    margin: 0 2px;
  }
  .card-right{
    flex: 2;
  }
  .card-right img{
    height: 90px;
    width: 120px;
  }
  .fixed{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }
  .kind{
    margin-top: 99px;
  }
  .nav{
    background-color:#fa7093;
    color: #fff;
    height: 45px;
    width: 100%;
    text-align: left;
    line-height: 45px;
    font-size: 16px;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
}
.nav .van-icon{
    margin-left: 5px;
}
.top{
  display: flex;
  padding: 10px;
}
.top-left{
  flex: 7;
  text-align: left;
}
.top-left img{
  height: 60px;
  width: 60px;
  border-radius: 50%;
  vertical-align: middle;
}
.top-right{
  flex: 3;
  text-align: right;
}
.top-right{
  line-height: 50px;
}
</style>
