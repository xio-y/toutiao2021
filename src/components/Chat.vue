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

        <div class="comment-input">
          <van-field
            v-model="content"
            clearable
            placeholder="请输入评论内容"
            @keyup.enter="send">
            <template #button>
              <van-button size="small" type="warning" @click="send">发送</van-button>  
            </template> 
          </van-field>
        </div> 
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { Lazyload } from "vant";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

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
      user:JSON.parse(localStorage.getItem("userInfo")),
      content:'',
      stompClient:null
    }
  },
  created(){
    this.connect();
  },
  methods:{
    connect(){
      var socket=new SockJS('http://localhost:8080/ws/ep')
      this.stompClient=Stomp.over(socket)
      this.stompClient.connect({},success=>{
        
        //连接成功 订阅消息
        this.stompClient.subscribe("/user/"+this.user.username+"/queue/chat",response=>{
          var msg=JSON.parse(response.body);
          this.list.push(msg)
        })
      })
    },
    send(){
      var msg={
        fromUser:this.user.username,
        toUser:this.author.userName,
        content:this.content,
        date:new Date()
      }
      this.stompClient.send("/chat",{},JSON.stringify(msg))
      this.list.push(msg)
      this.content=''
    },
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
.list{
  margin-bottom: 55px;
}
</style>
