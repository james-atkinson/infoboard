<template>
  <div class="widget datetimewidget">
    <div class="datetimewidget__date">{{ date }}</div>
    <div class="datetimewidget__time">{{ time }}</div>
  </div>
</template>
<script>
import { format } from 'date-fns';

const dateFormat = 'iiii LLLL do, yyyy';
const timeFormat = 'h:mm';

export default {
  name: 'DateTimeWidget',
  data: () => ({
    date: format(new Date(), dateFormat),
    time: format(new Date(), timeFormat),
  }),
  created() {
    setInterval(() => {
      this.date = format(new Date(), dateFormat);
      this.time = format(new Date(), timeFormat);
    }, 30000);
  },
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
    font-size: 1.5rem;
    padding-left: 0.6rem;
  }
}
</style>
