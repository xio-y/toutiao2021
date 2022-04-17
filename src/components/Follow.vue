<template>
  <div class="hello">
    <div class="nav" @click="onClickLeft">
      <van-icon name="arrow-left" />返回
    </div>
    <div class="top">
        <div class="top-left">
          <van-image :src="picIp+user.image" lazy-load height="70" width="70" round/>
          <div class="user">{{user.userName}}</div>
        </div>
        <div class="top-right">   
        </div>
      </div>
      <van-tabs v-model="active" @click="getUsers">
        <van-tab title="关注我的"></van-tab>
        <van-tab title="我关注的"></van-tab>
      </van-tabs>
      <div class="list">
        <div class="ulist" v-for="item in list" :key="item.uid">
          <div class="ulist-left">
            <van-image :src="picIp+item.image" lazy-load height="60" width="60" round/>
                  <div class="content">
                    {{item.username}}
                  </div>
          </div>
          <div class="ulist-right">
              <van-button type="info" size="small" @click="chat(item)">聊天</van-button>
              <van-button type="primary" size="small" @click="getInfo(item)">查看详情</van-button>              
          </div>
        </div>
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
      active:1,
      user:JSON.parse(localStorage.getItem("userInfo")),
    }
  },
  created(){
      this.getUsers(1,'');
  },
  methods:{
    getUsers(name,title){
      this.list=[];
      var url="";
      if(this.user==null){
        Toast("您未登录");
        return;
      }
      if(name==0){
        url="followUser/getUsersByFollowUid?followUserId="+this.user.uid;
      }else{
        url="followUser/getFollowUsersByUid?userId="+this.user.uid;
      }
      this.axios.get(url).then(response=>{
        this.list=response.data;
      })
    },
    chat(item){
      this.$router.push({
        name:'Chat',
        query:{
          uid:item.uid,
          userName:item.username,
          image:item.image
        }
      })
    },
    getInfo(item){
      this.$router.push({
        name:"AuthorInfo",
        query:{
          uid:item.uid,
          userName:item.usename,
          image:item.image
        }
      })
    },
    onClickLeft(){
      this.$router.go(-1);
    }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list{
  margin-top: 50px;
}
.ulist{
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
}
.ulist .content{
  height: 50px;
  line-height: 50px;
  padding: 5px 10px;
  margin: 0 10px;
}
.ulist-left{
  display: flex;
}
.ulist-right{
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding:5px 0;
}
</style>
