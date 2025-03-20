<template>
  <div class="course">
    <course-header></course-header>
    <course-content></course-content>
    <bottom-navi></bottom-navi>
  </div>
</template>

<script>
import CourseHeader from './components/CourseHeader'
import CourseContent from './components/CourseContent'
import BottomNavi from '@/components/BottomNavi'

export default {
  // eslint-disable-next-line
  name: 'Course',
  components: {
    CourseHeader,
    CourseContent,
    BottomNavi
  }
}
</script>

<style lang="scss" scoped></style>
