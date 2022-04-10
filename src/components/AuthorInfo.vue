<template>
  <div class="hello">
    <div class="nav" @click="onClickLeft">
      <van-icon name="arrow-left" />返回
    </div>
    <div class="top">
        <div class="top-left">
          <van-image :src="picIp+author.image" lazy-load height="70" width="70" round/>
          <div class="user">{{author.userName}}</div>
        </div>
        <div class="top-right">
          <van-button color="#ee0a24" plain size="small" @click="follow">{{followUserLabel}}</van-button>
          <van-button color="#ee0a24" plain size="small" @click="chat" v-if="followUserLabel=='已关注'">私聊</van-button>
        </div>
      </div>
      <van-tabs v-model="active">
        <van-tab title="全部"></van-tab>
        <van-tab title="文章"></van-tab>
        <van-tab title="视频"></van-tab>
        <van-tab title="问答"></van-tab>
      </van-tabs>
      <div class="list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <div class="card" v-for="(news,index) in list" :key="index" @click="getDetail(news.newsId)">
              <div class="card-left">
                <div class="title">
                  {{news.title}}
                </div>
                <div class="time">
                  <span>{{news.time|moment}}</span>
                  <span>{{news.source}}</span>
                </div>
              </div>
              <div class="card-right">
                <img :src="picIp+news.pictures">
              </div>
            </div>
          </van-list>
        </van-pull-refresh>    
      </div>
  </div>  
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { Lazyload } from "vant";

Vue.use(Lazyload);
Vue.use(Toast)
export default {
  name: 'Mine',
  data() {
    return{
      author:this.$route.query,
      picIp:'http://localhost:8080/pic/',
      list:[],
      loading:false,
      finished:false,
      refreshing:false,
      pageNo:1,
      active:1,
      user:JSON.parse(localStorage.getItem("userInfo")),
      followUserLabel:'关注'
    }
  },
  created(){
      this.isFollow();
  },
  methods:{
    chat(){
      this.$router.push({
        name:'Chat',
        query:{
          uid:this.author.uid,
          userName:this.author.userName,
          image:this.author.image
        }
      })
    },
    getDetail(newsid){
      this.$router.push("/Detail/"+newsid);
    },
    onLoad(){
      if(this.refreshing){
        this.list=[];
        this.refreshing=false;
      }
      this.axios.get("news/getByUid?current="+this.pageNo+"&uid="+this.author.uid)
        .then((response) =>{
        this.list=this.list.concat(response.data.records);
        this.loading=false;
        if(this.pageNo>=response.data.pages){
          this.finished=true;
        }
        this.pageNo++;
      })
    },
    onRefresh(){
      this.finished=false;
      this.loading=true;
      this.pageNo=1;
      this.onLoad();
    },
    follow(){
      if(this.user==null){
        Toast("未登录，先登录再关注");
        return;
      }
      let userId=this.user.uid;
      let followUserId=this.author.uid;
      if( this.followUserLabel=='已关注'){
        this.axios.get("followUser/disFollowUser?userId="+userId+"&followUserId="+followUserId).then(response=>{
          this.followUserLabel='关注'
        });
      }else{
        this.axios.get("followUser/followUser?userId="+userId+"&followUserId="+followUserId).then(response=>{
          this.followUserLabel='已关注'
      });
      }
    },
    isFollow(){
      if(this.user==null){
        return;
      }
      let userId=this.user.uid;
      let followUserId=this.author.uid;
      this.axios.get("followUser/isFollowUser?userId="+userId+"&followUserId="+followUserId).then(response=>{
          let result=response.data;
          if(result==true){
          this.followUserLabel='已关注'
          }
      });
    },
    onClickLeft(){
      this.$router.go(-1);
    }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
