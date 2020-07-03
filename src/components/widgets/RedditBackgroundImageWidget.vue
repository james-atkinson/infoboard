<template>
  <div
    class="background"
    :style="`background-image: url('${backgroundImageUrl}')`"
  >
    <GenericDataFetcher :config="fetcherConfig" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import GenericDataFetcher from '../data/GenericDataFetcher.vue';

export default {
  name: 'RedditBackgroundImageWidget',
  components: { GenericDataFetcher },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    fetcherConfig: {},
  }),
  created() {
    this.fetcherConfig = {
      immediate: true,
      fetchUrl: `https://www.reddit.com/r/${this.config.subreddit}/hot.json`,
      storeAction: 'setData',
      storeKey: 'RedditBackgroundImageWidget',
      interval: this.config.interval,
    };
  },
  computed: {
    ...mapState({
      canvasConfig: (state) => state.config.canvas,
      redditData: (state) => state?.data?.RedditBackgroundImageWidget?.data?.children,
    }),
    backgroundImageUrl() {
      const aspectRatio = Math.round((this.config.width / this.config.height) * 10) / 10;
      const filteredImages = this.redditData ? this.redditData.filter((item) => {
        const itemAspectRatio = Math.round((item?.data?.preview?.images[0]?.source?.width / item?.data?.preview?.images[0]?.source?.height) * 10) / 10;
        return this.config.ignoreAspectRatio ? true : itemAspectRatio === aspectRatio;
      }).map((item) => ({
        url: item?.data?.url,
        score: item?.data?.score,
      })) : [];

      if (this.config.selectionType === 'highest') {
        const sortedImages = filteredImages.sort((a, b) => b.score - a.score);
        return sortedImages[0]?.url;
      }

      if (this.config.selectionType === 'random') {
        const random = Math.floor(Math.random() * Math.floor(filteredImages.length - 1));
        return filteredImages[random]?.url;
      }

      return filteredImages[0]?.url;
    },
  },
};
</script>
<style lang="scss" scoped>
.background {
  opacity: 0.2;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
