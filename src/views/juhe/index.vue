<template>
  <div>
    <div class="fullscreen-icon" @click="toggleFullScreen">
      <i class="fas fa-expand"></i>
    </div>
    <iframe
      src="https://xyy.jxschot.com/haoka/stock/"
      style="width: 100%; height: calc(100vh - 84px); border: none;"
      frameborder="0"
      ref="iframeElement">
    </iframe>
  </div>
</template>

<script>
export default {
  methods: {
    toggleFullScreen() {
      const iframe = this.$refs.iframeElement;
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 120px 0;
  position: relative;
  font-size: 64px;
  text-align: center;
}

.fullscreen-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  z-index: 10;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

/* 确保 iframe 在全屏时的样式 */
:fullscreen {
  width: 100%;
  height: 100%;
}

:fullscreen iframe {
  width: 100vw; /* 使用视口宽度 */
  height: 100vh; /* 使用视口高度 */
}
</style>
