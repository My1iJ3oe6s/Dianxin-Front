<template>
  <div class="juhe-container">
    <!-- 顶部区域 -->
    <!--    <div class="header">-->
    <!--      <h1>电信权益商品聚合平台</h1>-->
    <!--      <p>一站式管理和查询各地电信权益产品</p>-->
    <!--    </div>-->

    <div class="container">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <h2 class="panel-title">权益商品查询</h2>
        <div class="search-box">
          <div class="search-form">
            <div class="search-item">
              <label class="search-label" for="searchKeyword">商品名称</label>
              <input
                type="text"
                id="searchKeyword"
                v-model="searchKeyword"
                placeholder="请输入商品名称"
                @keyup.enter="handleSearch"
              >
            </div>
            <div class="search-item">
              <label class="search-label" for="searchArea">地区选择</label>
              <select
                id="searchArea"
                v-model="selectedArea"
                :disabled="!areas.length"
              >
                <option value="">全部地区</option>
                <option
                  v-for="area in areas"
                  :key="area"
                  :value="area"
                >
                  {{ area }}
                </option>
              </select>
            </div>
            <div class="search-item">
              <label class="search-label">&nbsp;</label>
              <button @click="handleSearch">查询</button>
            </div>
          </div>
        </div>

        <div class="view-toggle">
          <button
            :class="{ active: currentView === 'list' }"
            @click="setViewMode('list')"
            title="列表视图"
          >
            列表视图
          </button>
          <button
            :class="{ active: currentView === 'card' }"
            @click="setViewMode('card')"
            title="卡片视图"
          >
            卡片视图
          </button>
        </div>

        <div id="goodsContainer">
          <div id="goodsCount" style="margin-bottom: 15px; color: #666;">
            共找到 {{ goodsList.length }} 个商品
          </div>
          <div
            id="goodsList"
            :class="['goods-list', currentView + '-view']"
          >
            <div v-if="loading" class="loading fade-in">
              <div class="loading-spinner"></div>
              <p>加载中，请稍候...</p>
            </div>

            <div v-else-if="!goodsList.length" class="empty-state fade-in">
              <div class="empty-icon">🔍</div>
              <p>暂无商品数据</p>
              <p style="font-size: 14px; margin-top: 10px; color: #999;">
                请尝试更换搜索条件
              </p>
            </div>

            <template v-else>
              <div
                v-for="goods in goodsList"
                :key="goods.id"
                class="goods-item fade-in"
                :class="{ selected: selectedGoodsId === goods.id }"
                @click="selectGoods(goods)"
              >
                <img
                  class="goods-img"
                  :src="goods.goodsImg || 'https://via.placeholder.com/300/cccccc/ffffff?text=无图片'"
                  :alt="goods.goodsName"
                >
                <div class="goods-info">
                  <div class="goods-name">{{ goods.goodsName }}</div>
                  <div class="goods-meta">
                    <div class="goods-area">{{ goods.area }}</div>
                    <div class="goods-price">¥{{ (goods.price || 0).toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <h2 class="panel-title">订购信息</h2>
        <div class="order-link">
          <div class="order-title">
            {{ selectedGoods ? selectedGoods.goodsName : '请先选择左侧商品' }}
            <div v-if="selectedGoods" class="area-tag">
              地区: {{ selectedGoods.area || extractAreaFromName(selectedGoods.goodsName) || '未知地区' }}
            </div>
          </div>

          <!-- 新增 iframe 容器 -->
          <div v-if="selectedGoods" class="iframe-container">
            <iframe :src="selectedGoods.goodsUrl" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">© 2023 电信权益聚合平台 版权所有</div>
  </div>
</template>

<script>
import { listArea } from "@/api/juhe/area";
import { listGoods, getOrderUrl } from "@/api/juhe/goods";

export default {
  name: 'Juhe',
  data() {
    return {
      searchKeyword: '',
      selectedArea: '',
      areas: [],
      goodsList: [],
      currentView: 'list',
      selectedGoodsId: null,
      selectedGoods: null,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 加载地区选项
    getList() {
      this.loading = true
      Promise.all([
        this.getAreaList(),
        this.getGoodsList()
      ]).finally(() => {
        this.loading = false
      })
    },

    // 获取地区列表
    getAreaList() {
      return listArea().then(response => {
        if (response.code === 200) {
          this.areas = response.data
        }
      }).catch(error => {
        console.error('加载地区列表失败:', error)
        this.$modal.msgError('加载地区列表失败')
      })
    },

    // 获取商品列表
    getGoodsList() {
      const params = {
        pageNum: 1,
        pageSize: 100,
        keyword: this.searchKeyword,
        area: this.selectedArea
      }

      return listGoods(params).then(response => {
        if (response.code === 200) {
          this.goodsList = response.rows.map(item => ({
            id: item.goodsId,
            goodsName: item.goodsName,
            goodsImg: item.headUrl,
            area: item.restrictedArea || this.extractAreaFromName(item.goodsName),
            price: 0,
            goodsUrl: item.goodsUrl
          }))
        }
      }).catch(error => {
        console.error('获取商品列表失败:', error)
        this.$modal.msgError('获取商品列表失败')
      })
    },

    // 从商品名称中提取地区信息
    extractAreaFromName(name) {
      const areas = ['北京', '上海', '广州', '深圳', '杭州', '武汉', '成都', '重庆',
        '青山', '东西湖', '常青', '光谷', '江夏', '蔡甸', '黄陂']

      for (const area of areas) {
        if (name.includes(area)) {
          return area
        }
      }

      return '未知地区'
    },

    // 设置视图模式
    setViewMode(mode) {
      this.currentView = mode
    },

    // 选择商品
    selectGoods(goods) {
      this.selectedGoodsId = goods.id
      this.selectedGoods = goods
    },

    // 加载订购页面
    loadOrderPage(url) {
      if (!url) {
        this.$modal.msgError('商品链接不存在')
        return
      }

      // 不再打开新窗口，而是直接加载到 iframe 中
      this.selectedGoods.goodsUrl = url
    },

    // 处理搜索
    handleSearch() {
      this.getGoodsList()
    }
  }
}
</script>

<style scoped>
/* 修改容器样式 */
.container {
  display: flex;
  width: 100%;
  height: calc(100vh - 40px);
  flex-direction: row;
  padding: 0;
  margin: 0 auto;
  overflow: hidden;
}

/* 修改左侧面板样式 */
.left-panel {
  flex: 6;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin: 20px;
  border: 1px solid #e8eef7;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow: hidden;
}

/* 修改右侧面板样式 */
.right-panel {
  flex: 4;
  padding: 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin: 20px 20px 20px 0;
  border: 1px solid #e8eef7;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow: hidden;
  position: sticky;
  top: 20px;
}

/* 修改商品列表容器样式 */
#goodsContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

/* 修改商品列表样式 */
#goodsList {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 15px;
  min-height: 0;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* 隐藏商品列表的滚动条 */
#goodsList::-webkit-scrollbar {
  display: none;
}

/* 修改右侧面板内容样式 */
.right-panel .order-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 链接样式 */
.right-panel .order-url {
  margin-top: auto;
  background: #f23f3f;
  border-radius: 0;
  height: 50px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: none;
  text-decoration: none;
}

.right-panel .order-url:hover {
  background: #e02d2d;
}

/* 修改商品详情容器样式 */
#goodsDetailContainer {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* 隐藏商品详情容器的滚动条 */
#goodsDetailContainer::-webkit-scrollbar {
  display: none;
}

/* 移除所有可能的滚动条 */
* {
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

*::-webkit-scrollbar {
  display: none;
}

body {
  font-family: "Microsoft YaHei", sans-serif;
  background-color: #f7f9fc;
  color: #333;
  display: flex;
  flex-direction: column;
}
/* 顶部背景和样式 */
.header {
  background: linear-gradient(135deg, #00449e 0%, #0168fa 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  flex-shrink: 0; /* 防止头部压缩 */
}
.header h1 {
  font-size: 24px;
  margin-bottom: 5px;
}
.header p {
  font-size: 14px;
  opacity: 0.8;
}
.search-box {
  padding: 20px;
  background: linear-gradient(to bottom, #f0f6ff, #f7faff);
  border-radius: 10px;
  margin-bottom: 25px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e7f5;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.search-item {
  flex: 1;
  min-width: 200px;
}
.search-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}
.search-box input, .search-box select {
  padding: 12px 15px;
  width: 100%;
  border: 1px solid #e0e7f5;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}
.search-box input:focus, .search-box select:focus {
  outline: none;
  border-color: #2c5cbe;
  box-shadow: 0 0 0 3px rgba(44, 92, 190, 0.1);
}
.search-box button {
  padding: 12px 25px;
  background: linear-gradient(to bottom, #1a73e8, #0050b3);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 3px 6px rgba(26, 115, 232, 0.2);
  width: 100%;
}
.search-box button:hover {
  background: linear-gradient(to bottom, #0c63d4, #003b8e);
  transform: translateY(-2px);
  box-shadow: 0 5px 8px rgba(26, 115, 232, 0.3);
}
.search-box button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 3px rgba(26, 115, 232, 0.3);
}
.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.view-toggle button {
  background: transparent;
  border: none;
  color: #666;
  padding: 8px 15px;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}
.view-toggle button.active {
  background: rgba(1, 104, 250, 0.1);
  color: #0168fa;
  font-weight: bold;
}
.view-toggle button:hover {
  background: rgba(1, 104, 250, 0.05);
}
.view-toggle button i {
  font-size: 18px;
}
.goods-list {
  margin-top: 15px;
  min-height: 200px;
}
.list-view .goods-item {
  display: flex;
  border: 1px solid #e0e7f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  position: relative;
}
.list-view .goods-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}
.list-view .goods-item.selected {
  border-color: #2c5cbe;
  box-shadow: 0 0 0 2px rgba(44, 92, 190, 0.2);
}
.list-view .goods-item.selected::after {
  content: "✓";
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #2c5cbe;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}
.list-view .goods-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}
.list-view .goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-view .goods-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}
.list-view .goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.list-view .goods-area {
  color: #666;
  font-size: 14px;
  background-color: #f5f8ff;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
}
.list-view .goods-price {
  color: #e64c3c;
  font-size: 18px;
  font-weight: bold;
}
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.card-view .goods-item {
  border: 1px solid #e0e7f5;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  position: relative;
}
.card-view .goods-item:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}
.card-view .goods-item.selected {
  border-color: #2c5cbe;
  box-shadow: 0 0 0 2px rgba(44, 92, 190, 0.2);
}
.card-view .goods-item.selected::after {
  content: "✓";
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #2c5cbe;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
}
.card-view .goods-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.5s;
}
.card-view .goods-item:hover .goods-img {
  transform: scale(1.05);
}
.card-view .goods-info {
  padding: 15px;
}
.card-view .goods-name {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  font-size: 15px;
  line-height: 1.4;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-view .goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.card-view .goods-area {
  color: #666;
  font-size: 13px;
  background-color: #f5f8ff;
  padding: 3px 8px;
  border-radius: 20px;
}
.card-view .goods-price {
  color: #e64c3c;
  font-weight: bold;
  font-size: 16px;
}
.right-panel .order-title {
  background: linear-gradient(135deg, #00449e 0%, #0168fa 100%);
  color: white;
  font-size: 18px;
  padding: 20px;
  margin-bottom: 0;
  text-align: left;
  font-weight: bold;
}
.area-tag {
  color: white;
  font-size: 14px;
  margin-top: 5px;
  font-weight: normal;
}
.goods-price-container {
  margin: 15px 0;
}
.goods-price-label {
  font-size: 16px;
  color: #666;
}
.goods-price-value {
  font-size: 28px;
  color: #f23f3f;
  font-weight: bold;
}
.goods-period {
  color: #666;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.goods-info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.goods-info-table td {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}
.goods-info-table td:first-child {
  color: #666;
  width: 100px;
}
.right-panel .order-url {
  margin-top: auto;
  background: #f23f3f;
  border-radius: 0;
  height: 50px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: none;
}
.right-panel .order-url:hover {
  background: #e02d2d;
}
.right-panel .order-url .arrow {
  display: none;
}
.right-panel .selected-goods-img {
  width: 100%;
  height: auto;
  max-height: 320px;
  object-fit: contain;
  margin-bottom: 30px;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}
.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(44, 92, 190, 0.1);
  border-radius: 50%;
  border-top-color: #2c5cbe;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
.empty-icon {
  font-size: 50px;
  margin-bottom: 20px;
}
.empty-state p {
  font-size: 16px;
  line-height: 1.5;
}
.badge {
  display: inline-block;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 9px;
  background-color: #2c5cbe;
  color: white;
  font-size: 12px;
  text-align: center;
  margin-left: 5px;
}
.copyright {
  flex-shrink: 0; /* 防止底部被压缩 */
  text-align: center;
  padding: 20px 0;
  color: #666;
  background-color: #f5f7fa;
}
/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.error-message {
  background-color: #fff3f3;
  border: 1px solid #ffcccc;
  color: #e74c3c;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 10px 0;
  font-size: 14px;
}
/* 调整右侧文字大小，使其更紧凑 */
#goodsDetailContainer p {
  margin: 12px 0;
  font-size: 16px;
  line-height: 1.5;
}

#goodsDetailContainer p strong {
  display: inline-block;
  min-width: 90px;
  color: #444;
  font-weight: 600;
}

#goodsDetailContainer .price-value {
  color: #e64c3c;
  font-weight: bold;
  font-size: 24px;
  margin-left: 5px;
}

#goodsDetailContainer .order-url {
  display: inline-block;
  padding: 15px 30px;
  margin: 25px 0;
  background: linear-gradient(to bottom, #e74c3c, #c0392b);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
}

/* 调整iframe容器样式，使其铺满剩余空间 */
.iframe-container {
  flex: 1;
  margin-top: 20px;
  border: 1px solid #e0e7f5;
  border-radius: 6px;
  overflow: hidden;
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 返回按钮固定在右侧面板底部 */
.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin: 0;
  background: #f5f7fa;
  color: #333;
  border-top: 1px solid #e0e7f5;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  height: 48px;
}

/* 自定义滚动条样式 */
#goodsList::-webkit-scrollbar,
#goodsDetailContainer::-webkit-scrollbar {
  width: 6px;
}

#goodsList::-webkit-scrollbar-thumb,
#goodsDetailContainer::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

#goodsList::-webkit-scrollbar-track,
#goodsDetailContainer::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 确保媒体查询只在非常小的屏幕上生效 */
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left-panel, .right-panel {
    flex: none;
    width: auto;
    margin: 10px;
    height: auto;
    max-height: none;
  }

  .right-panel {
    min-height: 500px; /* 确保在移动设备上有足够的高度 */
  }
}
/* 统一按钮颜色方案 - 使用蓝色系 */
.button, button,
.search-btn,
.view-btn,
.order-url,
.back-button {
  background: linear-gradient(135deg, #1a73e8 0%, #0050b3 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3);
  text-align: center;
}

/* 统一按钮悬停效果 */
.button:hover, button:hover,
.search-btn:hover,
.view-btn:hover,
.back-button:hover {
  background: linear-gradient(135deg, #0c63d4 0%, #003b8e 100%);
  box-shadow: 0 4px 10px rgba(26, 115, 232, 0.4);
  transform: translateY(-2px);
}

/* 统一按钮激活状态 */
.button:active, button:active,
.search-btn:active,
.view-btn:active,
.back-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(26, 115, 232, 0.3);
}

/* 搜索按钮特定样式 */
.search-btn {
  padding: 10px 20px;
  font-size: 16px;
  height: 44px;
  line-height: 24px;
}

/* 视图按钮样式 */
.view-btn {
  padding: 10px 25px;
  flex: 1;
  font-size: 14px;
}

/* 视图按钮激活状态 */
.view-btn.active {
  background: linear-gradient(135deg, #003b8e 0%, #001a5e 100%);
  font-weight: bold;
}

/* 订购按钮特殊样式和动态效果 */
.order-url {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  margin: 25px 0 0 0;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
  background: #f23f3f;
  color: white;
  border-radius: 0;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: none;
  position: relative;
  cursor: pointer;
  border: none;
}

.order-url:hover {
  background: #e02d2d;
}

/* 移除箭头动画效果 */
.order-url .arrow {
  display: none;
}
/* 重新调整面板标题样式 - 更简洁扁平化 */
.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding: 12px 15px;
  background-color: #f7f9fc;
  color: #333;
  position: relative;
  display: flex;
  align-items: center;
  border-left: 4px solid #1a73e8;
  border-radius: 0;
  box-shadow: none;
}

.panel-title .icon {
  margin-right: 8px;
  font-size: 16px;
  font-weight: normal;
}

/* 左侧面板标题 */
.left-panel .panel-title {
  border-left: 4px solid #d9534f;  /* 红色边框，匹配截图中的风格 */
  background-color: #f8f8f8;
}

/* 右侧面板标题 */
.right-panel .panel-title {
  border-left: 4px solid #d9534f;  /* 红色边框，保持一致性 */
  background-color: #f8f8f8;
}

/* 移除之前添加的伪元素和渐变效果 */
.panel-title::before {
  display: none;
}

/* 修改底部版权样式 */
.copyright {
  flex-shrink: 0; /* 防止底部被压缩 */
  text-align: center;
  padding: 20px 0;
  color: #666;
  background-color: #f5f7fa;
}
</style>
