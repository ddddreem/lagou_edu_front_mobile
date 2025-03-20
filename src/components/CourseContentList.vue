<template>
  <div class="course-content-list">
    <!-- 下拉刷新组件 -->
    <van-pull-refresh
      v-model="isRefreshing"
      @refresh="onRefresh"
    >
      <!-- 课程列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item.id"
          @click="$router.push({
            name: 'course-info',
            params: {
              courseId: item.id
            }
          })"
        >
          <div>
            <!-- 所有商品与已购商品接口响应的图片地址属性名不同，需要检测 -->
            <img :src="item.courseImgUrl || item.image" alt="">
          </div>
          <div class="course-info">
            <!-- 课程名称检测 -->
            <h3 v-text="item.courseName || item.name"></h3>
            <p class="course-preview" v-html="item.previewFirstField"></p>
            <!-- 检测是否有价格，如果没有，说明为已购商品，不展示价格区域 -->
            <p
              v-if="item.price"
              class="price-container"
            >
              <span class="course-discounts">￥{{item.discounts}}</span>
              <s class="course-price">￥{{item.price}}</s>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

export default {
  name: 'CourseContentList',
  props: {
    //  用于请求数据的函数
    fetchData: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      // 数据列表
      list: [],
      // 是否加载完毕
      finished: false,
      // 数据分页，当前页数
      currentPage: 1,
      // 下拉刷新状态
      isRefreshing: false,
      // 是否要进行加载
      loading: false
    }
  },
  methods: {
    async onRefresh () {
      // 设置页数为第一页
      this.currentPage = 1
      // 重新请求数据
      const { data } = await this.fetchData({
        currentPage: this.currentPage,
        pageSize: 10,
        status: 1
      })
      // 渲染页面数据
      // 如果存在数据，清空并课程数据，否则结束
      if (data.data && data.data.records && data.data.records.length !== 0) {
        this.list = data.data.records
      } else if (data.content && data.content.length !== 1) {
        this.list = data.content
      } else {
        this.finished = true
      }
      // 提示
      this.$toast('刷新成功')
      // 关闭下拉提示框
      this.isRefreshing = false
    },
    async onLoad () {
      // 重新请求数据
      const { data } = await this.fetchData({
        currentPage: this.currentPage,
        pageSize: 10,
        status: 1
      })
      // 检测，如果没有数据了，结束，如果有则保存
      if (data.data && data.data.records && data.data.records.length !== 0) {
        this.list.push(...data.data.records)
      } else if (data.content && data.content.length !== 0) {
        this.list.push(...data.content)
      } else {
        this.finished = true
      }
      // 下次请求下一页

      // 加载状态结束

      // 数据加载完成
    }
  }
}
</script>

<style lang="scss" scoped></style>
