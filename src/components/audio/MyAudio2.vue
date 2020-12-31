<template>
    <div id="myAudio">
      <audio id="audio" ref="audio" :src="song.url" loop="loop" @canplay="canplay"/>
      <!-- 自定义播放控制器 包括控制器，音量，进度条等  -->
      <div class="play-control">
        <el-row type="flex" justify="center" >
          <!-- 封面 -->
          <el-col :span="4">
            <el-image style="width: 60px; height: 60px" :src="song.cover" ></el-image>
          </el-col>
          <el-col :span="4" class="control-icon">
            <i class="el-icon-caret-left play-icon" @click="skipBack" ></i>
            <i :class="playIcon" @click="playAudio"></i>
            <i class="el-icon-caret-right play-icon" @click="skipForward"></i>
<!--          <el-button type="text" style="font-size: 40px" :icon="playIcon" @click="playAudio"></el-button>-->
<!--          <el-slider class="slider" v-model="sliderTime" :format-tooltip="formatProcessToolTip" ></el-slider>-->
          </el-col>
          <el-col :span="12" >
<!--              <el-row class="control-content" >-->
<!--                {{ '突然好想想你 - 程雄' }}-->
<!--              </el-row>-->
              <el-row type="flex" justify="center" class="play-bar" >
                <el-col :span="17">
                  <el-slider class="slider" v-model="sliderTime" :format-tooltip="formatProcessToolTip" ></el-slider>
                </el-col>
                <el-col :span="4">{{'00:00'}}/{{'03:40'}}</el-col>
              </el-row>
          </el-col>
        </el-row>

      </div>
    </div>
</template>

<script>
export default {
  name: "MyAudio2",
  data() {
      return {
        playing: false, // 播放状态
        index: 0,
        currentTime: '00:00', // 当前播放时间
        totalTime: '00:00', // 总播放时间
        playIcon: 'el-icon-video-play',
        playType: 1, // 播放类型：1-列表循环，2-随机播放，3-单曲循环
        audio:{
          maxTime: 200
        },
        sliderTime: 0, //当前播放时间
        song: { //当前播放歌曲信息
          cover: 'http://p2.music.126.net/R4ZP3AJ9xV0vvw8LX7AbMA==/109951163860425334.jpg',
          name: '',
          artist: '',
          time: '',
          // url: "http://m8.music.126.net/20201231111518/b5d17d2e106550728f848c9289cc5cdb/ymusic/5158/0352/070f/f2f7908e014861dc0cee0e869561ea90.mp3"
          url: "http://localhost:8081/sweet.mp3"
        },
        songList: [
          {
            id: 1,
            name: '有点甜',
            time: '04:22',
            artist: '马天宇',
            album: '(*^_^*)',
            cover: 'http://p2.music.126.net/R4ZP3AJ9xV0vvw8LX7AbMA==/109951163860425334.jpg',
            url: 'http://localhost:8081/sweet.mp3',
          },{
            id: 2,
            name: '摘仙',
            time: '04:31',
            artist: '刘珂矣',
            album: '?',
            cover: 'http://img.ytmp3.cn/image/52.jpg',
            url: 'http://localhost:8081/zhaixian.mp3',
          }
        ]
      }
  },
  methods:{
    canplay() { //自动播放，谷歌浏览器不支持，需要用户与页面交互
      this.$refs.audio.play()
      console.log("paused:" + this.$refs.audio.paused)
      debugger
      if (!this.$refs.audio.paused) {
        this.playing = true
        this.playIcon = 'el-icon-video-pause'
      }
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index)
      return this.realFormatSecond(index)
    },
    realFormatSecond (second) {
      var secondType = typeof second
      if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        var hours = Math.floor(second / 3600)
        second = second - hours * 3600
        var mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      } else {
        return '0:00:00'
      }
    },
    // 播放
    playAudio() {
      if (this.playing) {
        this.$refs.audio.pause()
        this.playing = false
        this.playIcon = 'el-icon-video-play'
      }else {
        this.$refs.audio.play()
        this.playing = true
        this.playIcon = 'el-icon-video-pause'
      }
    },
    // 上一首
    skipBack() {
      this.skipFn('skipBack');
    },
    // 下一首
    skipForward() {
      this.skipFn('skipForward');
    },
    //上下首封装
    skipFn(type) {
      switch (this.playType) {
        case 2: // 随机播放
          this.index = Math.floor(Math.random()*this.songList.length);
          break;
        default:
          if (type == 'skipBack') {
            this.index-1>= 0? this.index-- : 0;
          } else {
            this.index = this.index+1>= this.songList.length? this.songList.length-1: this.index+1;
          }
          break;
      }
      this.song = this.songList[this.index];
      this.playing = true;
      setTimeout(() => {
        this.totalTime = '00:00';
        this.$refs.audio.play();
      },100)
    },
  }
}
</script>

<style scoped>
#myAudio{
  /*background-color: #384245*/
  display: flex;
  flex-direction: column;
}
.song-cover {
  width: 60px;
  height: 60px;
  background: #E7E7E7;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}
.slider {
  display: inline-block;
  width: 200px;
  position: relative;
  top: 14px;
  margin-left: 15px;
}
.control-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

i {
  cursor: pointer;
}
.play-icon {
  transition: 0.3s;
}
.play-icon:hover {
  color: black;
}
.play-bar .el-col:last-child {
  margin-left: 0.8rem;
  display: flex;
  align-items: center;
}
  .control-content{
    height: 15px;
    line-height: 10px;
  }
</style>
