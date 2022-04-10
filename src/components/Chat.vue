<template>
  <div class="hello">
    <div class="nav" @click="onClickLeft">
      <van-icon name="arrow-left" />返回
    </div>
    <div class="list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <div class="chatlist" v-for="item in list" :key="item.cid">
                <div class="time">
                  {{item.date| moment}}
                </div>
                <div class="chat" :class="{self:item.fromUser==user.username}">
                  <van-image :src="item.fromUser==user.username?picIp+user.image:picIp+author.image" lazy-load height="60" width="60" round/>
                  <div class="content">
                    {{item.content}}
                  </div>
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
      user:JSON.parse(localStorage.getItem("userInfo"))
    }
  },
  created(){
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    onLoad(){
      if(this.refreshing){
        this.list=[];
        this.refreshing=false;
      }
      this.axios.get("chatmsg/list?current="+this.pageNo+"&fromUser="+this.user.username+"&toUser="+this.author.userName).then((response)=>{
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
  }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat{
  display: flex;
  margin: 5px 0;
}
.chatlist .time{
  font-size: 12px;
  margin: 15px 0;
  text-align: center;
}
.chat .content{
  height: 50px;
  line-height: 50px;
  padding: 5px 10px;
  border: 0.5px solid #ddd;
  border-radius: 5px;
  margin: 0 10px;
}
.self{
  flex-direction: row-reverse;
}
.self .content{
  background-color: rgb(214, 218, 230);
}
</style>
