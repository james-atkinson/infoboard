<template>
  <div class="weatherradar">
    <img :style="`width: ${config.width}; z-index: ${config.zIndex + 1};`" src="https://weather.gc.ca/cacheable/images/radar/layers/additional_cities/whk_towns.gif" />
    <img :style="`width: ${config.width}; z-index: ${config.zIndex};`" :src="radarImageUrl" />
    <GenericDataFetcher :config="fetcherConfig" />
  </div>
</template>
<script>
import { format } from 'date-fns';
import GenericDataFetcher from '../../../components/data/GenericDataFetcher.vue';

export default {
  name: 'WeatherRadarWidget',
  components: { GenericDataFetcher },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    fetcherConfig: {
      immediate: true,
      fetchUrl: 'https://weather.gc.ca/radar/xhr.php?action=retrieve&target=images&region=WHK&product=PRECIP_RAIN&lang=en-CA&format=json&rand=0.8177566381309926',
      storeAction: 'familyCalendar/setData',
      storeKey: 'radar',
    },
  }),
  computed: {
    radarImageUrl() {
      const currentDateTime = new Date();
      const currentYear = format(currentDateTime, 'yyyy');
      const currentMonth = format(currentDateTime, 'MM');
      const currentDay = format(currentDateTime, 'dd');

      const getNearestImageTime = (currentTime) => {
        const currentUTCHour = currentTime.getHours() + (currentTime.getTimezoneOffset() / 60);
        const currentMinute = currentTime.getMinutes();
        let imageHour = currentUTCHour;
        let imageMinute = 50;

        if (currentMinute < 10) {
          imageHour = currentUTCHour - 1;
        } else if (currentMinute > 10 < 30) {
          imageMinute = 10;
        } else if (currentMinute > 30 < 50) {
          imageMinute = 30;
        }

        return `${imageHour}_${imageMinute}`;
      };

      return `https://weather.gc.ca/data/radar/temp_image/WHK/WHK_PRECIP_RAIN_${currentYear}_${currentMonth}_${currentDay}_${getNearestImageTime(currentDateTime)}.GIF`;
    },
  },
};
</script>
<style lang="scss" scoped>
.weatherradar{
  img {
    left: 1;
    right: 0;
    position: absolute;
  }
}
</style>
