<template>
  <div class="widget datetimewidget">
    <div class="datetimewidget__date">Thursday, December 25, 2020</div>
    <div class="datetimewidget__time">8:59</div>
  </div>
</template>
<script>
import { format } from 'date-fns';

export default {
  name: 'DateTimeWidget',
  data: () => ({
    date: format(new Date(), 'iiii LLL do, yyyy'),
    time: format(new Date(), 'h:mm a'),
  }),
};
</script>
<style lang="scss" scoped>
.datetimewidget {
  color: white;
  background-color: transparent;
  text-align: left;
  margin-left: 0.3rem;
  margin-top: 1rem;

  &__time {
    font-size: 8rem;
    line-height: 7.4rem;
    padding-left: 0.3rem;
  }

  &__date {
    font-size: 2rem;
    padding-left: 0.6rem;
  }
}
</style>
