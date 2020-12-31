<template>
  <div>
    <audio id="audio" ref="audio" :src="audio.url"
           autoplay="autoplay"
           loop="loop"
           @canplay="canplay"
           :preload="audio.preload"></audio>
    <div>
      <el-button :icon="playIcon" style="font-size: 30px" type="text" @click="startPlayOrPause"></el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "MyAudio",
        data () {
          return {
            audio: {
              url: "http://m8.music.126.net/20201231111518/b5d17d2e106550728f848c9289cc5cdb/ymusic/5158/0352/070f/f2f7908e014861dc0cee0e869561ea90.mp3",
              preload: "auto",
              playing: false,
            },
            playIcon:"el-icon-video-play"
          }
        },
      methods: {
        canplay() { //自动播放，谷歌浏览器不支持，需要用户与页面交互
          this.$refs.audio.play()
          console.log("paused:" + this.$refs.audio.paused)
          if (!this.$refs.audio.paused) {
            this.audio.playing = true
            this.playIcon = 'el-icon-video-pause'
          }
        },
        startPlayOrPause() {
          console.log(this.$refs.audio)
          return this.audio.playing ? this.pausePlay() : this.startPlay()
        },
        startPlay() {
          this.$refs.audio.play()
          this.audio.playing = true
          this.playIcon = 'el-icon-video-pause'
        },
        pausePlay() {
          this.$refs.audio.pause()
          this.audio.playing = false
          this.playIcon = 'el-icon-video-play'
        },
      },
      mounted() {
      },
      created() {
      },
      filters: {
      }
    }
</script>

<style scoped>

</style>
