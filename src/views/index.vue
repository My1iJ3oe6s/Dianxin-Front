<template>
  <div>
    <el-image
      style="width: 100%;height: calc(100vh - 84px);margin-bottom: -48px;"
      :src="welComeImg"
      :fit="cover"></el-image>
    fit="cover"></el-image>
  </div>
</template>

<script>
import welComeImg from '@/assets/images/welcome.png';
export default {
  data() {
    return {
      welComeImg
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
