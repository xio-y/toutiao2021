<template>
  <div class="hello">
    <div class="fixed">
      <van-search
      v-model="value"
      shape="round"
      background="#ee0a24"
      placeholder="请输入搜索关键词"
      @click="goSearch"/>
      <van-tabs @click="onClick">
        <van-tab v-for="(kind,index) in kindList" :title="kind.content" :key="index">
        </van-tab>
      </van-tabs>
    </div>
    <div class="list kind">
      <div class="video" v-for="item in list" :key="item.newsId" @click="getDetail(item.newsId)">
        <div class="video-top">
          <div class="video">
            <div class="title">{{item.title}}</div>
            <video :src="picIp+item.video" controls></video>
          </div>
        </div>

      <div class="buttom">
        <div class="top">
          <div class="top-left">
            <van-image :src="picIp+item.image" alt="" />
            <div class="user">
              <span>{{item.username}}</span>
              <span class="focus">关注</span>
            </div>
          </div>
          <div class="top-right">
            <van-icon  name="chat-o" size="20"/><span>45</span><van-icon name="ellipsts" size="20"/>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);
export default {
  name: 'Kind',
  data() {
    return {
      show:true,
      picIp:'http://localhost:8080/pic/',
      value:'',
      kindList:[],
      list:[]
    }
  },
  created(){
    this.axios.get("kind/list").then((response) => {
      this.kindList=response.data;
    })
    this.onClick(0,'');
  },
  methods:{
   onClick(name,title){
     console.log(name+','+title);
     this.axios.get("news/getVideosByKindId?kindId="+(name+1)).then((response) =>{
       this.list=response.data;
     })
   },
   goSearch(){
     this.$router.push("/Search");
   },
    getDetail(newsId){
      this.$router.push("/Detail/"+newsId)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .video video{
    height: 260px;
    width: 100%;
  }
  .user{
    margin-left: 5px;
  }
  .video{
    background-color: #fff;
    margin: 3px 0;
    position: relative;
  }
  .video-top .title{
    text-align: left;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    top: 18px;
    left: 5px;
    color: #999;
  }
  .video-top{
    padding: 5px 0;
  }
  .top{
    padding: 0;
  }
  .focus{
    color: #f00;
    margin-left: 5px;
  }
  .top-right span{
    margin: 0 15px 0 5px;
  }
  .top-right{
    margin-right: 10px;
    line-height: 60px;
  }
  .top-left{
    line-height: 60px;
    display: flex;
  }
</style>
