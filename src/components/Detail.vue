<template>
  <div class="hello">
    <div class="nav" @click="onClickLeft">
      <van-icon name="arrow-left" />返回
    </div>
    <div class="news">
      <div class="n-title">
        {{news.title}}
      </div>
      <div class="top">
        <div class="top-left">
          <van-image :src="picIp+news.image" lazy-load height="70" width="70" round/>
          <div class="user">{{news.userName}}</div>
        </div>
        <div class="top-right">
          <van-button color="#ee0a24" plain size="small" @click="follow">{{followUserLabel}}</van-button>
        </div>
      </div>
      <div class="n-time">
        {{news.time|moment}}
      </div>
      <div class="n-img" v-if="news.type==1">
        <img :src="picIp+news.pictures" alt="">
      </div>
      <div v-if="news.type==2" class="n-img1" @click="preview">
          <van-row gutter="1">
            <van-col span="8" v-for="(item,index) in news.picList" :key="index">
              <img :src="picIp+item.pic" alt="">
            </van-col>
          </van-row>
      </div>
      <div class="n-img2" v-if="news.type==3">
        <video :src="picIp+news.video" alt="" controls></video>
        <div @click="download">
          <van-icon name="down" size="24"/>下载视频
          </div> 
      </div>
      <div class="n-content">
        {{news.content}}
        <h3>评论</h3>
        <div class="comment" v-for="item in commentList" :key="item.commentId"> 
          <div class="comment-left">
              <van-image :src="picIp+item.image" lazy-load height="60" width="60" round/>
          </div>
          <div class="comment-right">
            <div class="comment-user">
              <div class="user-left">
                {{item.userName}}
              </div>
              <div class="user-right">
                <span>674</span>
                <van-icon name="good-job-o" size="18" />
              </div>
            </div>
            <div class="comment-content">
              {{item.content}}
            </div>
            <div class="comment-time">
              {{item.time|moment}}
            </div>
          </div>
        </div>
        <div class="comment-input">
          <van-field
            v-model="content"
            clearable
            placeholder="请输入评论内容"
            @keyup.enter="sendComment"
          >
            <template #button>
              <van-button size="small" type="warning" @click="sendComment">发送</van-button>
            </template>
          </van-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { ImagePreview } from 'vant';
import { Lazyload } from "vant";

Vue.use(Toast);
Vue.use(Toast)
export default {
  name: 'Detail',
  data() {
    return{
      newsId:this.$route.params.value,
      picIp:'http://localhost:8080/pic/',
      pictureList:[],
      news:{},
      commentList:[],
      content:"",
      user:JSON.parse(localStorage.getItem("userInfo")),
      followUserLabel:'关注'
    }
  },
  created(){
    this.axios.get("news/getById?newsId="+this.newsId).then((response)=>{
      this.news=response.data;
      this.isFollow();
    });
    this.getCommentList();
  },
  methods:{
    follow(){
      if(this.user==null){
        Toast("未登录，先登录再关注");
        return;
      }
      let userId=this.user.uid;
      let followUserId=this.news.uid;
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
      let followUserId=this.news.uid;
      this.axios.get("followUser/isFollowUser?userId="+userId+"&followUserId="+followUserId).then(response=>{
          let result=response.data;
          if(result==true){
          this.followUserLabel='已关注'
          }
      });
    },
    download(){
      this.axios.get("news/download?filename="+this.news.video,{responseType: 'blob'}).then(response=>{
      var url=window.URL.createObjectURL(new Blob([response.data]))
      var link=document.createElement("a")
      link.href=url;
      link.style.display='none'
      const fileName=this.news.video;
      link.setAttribute("download",fileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      });
    },
    sendComment(){
      if(this.user==null){
        Toast("您未登录！请登录后再发表评论!");
        this.$router.push("/Mine");
        return;
      }
      if(this.content.trim()==""){
        Toast("未输入评论内容！请输入评论内容后再发表评论！");
        return;
      }
      this.axios.post("comment/add",{
        uid:this.user.uid,
        content:this.content,
        newsId:this.newsId
      }).then(response=>{
        this.content="";
        this.getCommentList();
      })
    },
    getCommentList(){
      this.axios.get("comment/getByNewsid?newsId="+this.newsId).then((response)=>{
        this.commentList=response.data;
      })
    },
    onClickLeft(){
      this.$router.go(-1);
    },
    preview(){
      var arr=[];
      this.news.picList.forEach(item=>{
        arr.push(this.picIp+item.pic)
      })
      ImagePreview(arr);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .news{
    padding: 5px;
    text-align: left;
    line-height: 2;
    margin-bottom: 50px;
  }
  .n-title{
    font-size: 28px;
  }
  .n-content{
    text-indent: 30px;
  }
  .n-img img{
    height: 300px;
    width: 100%;
  }
  .n-user{
    display: flex;
    justify-content: space-between;
  }
  .n-img1 img{
    height: 150;
    width: 100%;
  }
  .n-img2 video{
    height: 150;
    width: 100%;
  }
  h3,.comment{
    text-indent: 0px;
  }
  .comment,.comment-user{
    display:flex;
  }
  .comment-right{
    margin-left: 10px;
    width: 100%;
  }
  .comment-user{
    justify-content: space-between;
    font-size: 14px;
  }
  .user-left{
    font-weight: 800;
  }
  .comment-time{
    font-size: 14px;
    color: #777;
  }
  .comment-input{
    border-top: 0.5px solid #ddd;
  }
</style>
