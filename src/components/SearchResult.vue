<template>
  <div class="hello">
    <div class="fixed">
      <van-search
        v-model="value"
        shape="round"
        background="#ee0a24"
        placeholder="请输入搜索关键词"
        @click="goSearch"/>
    </div>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
         v-model="loading"
         :finished="finished"
         finished-text="没有更多了"
         @load="onload"
        >
          <div class="card" v-for="item in list" :key="item.newsid" @click="getDetail(item.newsId)">
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
export default {
  name: 'SearchResult',
  data() {
    return {
      value:this.$route.params.value,
      picIp:'http://localhost:8080/pic/', 
      list: [],
      loading:false,
      finished:false,
      refreshing:false,
      page:1
    }
  },
  created(){
    
  },
  methods:{
    goSearch(){
      this.$router.push("/Search");
    },
    onload(){
      if(this.refreshing){
        this.list=[];
        this.refreshing=false;
      }
      this.axios.post("news/getPageNewsByTitle",{
        current:this.page,
        title:this.value
      }).then((response) =>{
        this.list=this.list.concat(response.data.records);
        this.loading=false;
        if(this.page>=response.data.pages){
          this.finished=true;
        }
        this.page++;
      })
    },
    onRefresh(){
      this.finished=false;
      this.Loading=true;
      this.page=1;
      this.onload();
    },
    getDetail(newsid){
      this.$router.push("/Detail/"+newsid)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list{
  margin-top: 50px;
}
</style>
