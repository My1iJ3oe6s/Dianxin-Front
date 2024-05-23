<template>
  <div class="dashboard-editor-container">
    <img :src="welComeImg" />
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
