<template>
  <div
    class="background"
    :style="`background-image: url('${backgroundImageData.url}')`"
  >
    <div class="background__credit">{{ backgroundImageData.credit }}</div>
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
    backgroundImageData() {
      const aspectRatio = Math.round((this.config.width / this.config.height) * 10) / 10;
      const filteredImages = this.redditData ? this.redditData.filter((item) => {
        const itemAspectRatio = Math.round((item?.data?.preview?.images[0]?.source?.width / item?.data?.preview?.images[0]?.source?.height) * 10) / 10;
        return this.config.ignoreAspectRatio ? true : itemAspectRatio === aspectRatio;
      })
        .filter((item) => !item?.data?.url.includes('gallery'))
        .filter((item) => item?.data?.preview?.images.length > 0)
        .map((item) => ({
          url: item?.data?.url,
          title: item?.data?.title,
          author: item?.data?.author,
          score: item?.data?.score,
        })) : [];

      if (this.config.selectionType === 'highest') {
        const sortedImages = filteredImages.sort((a, b) => b.score - a.score);
        return { url: sortedImages[0]?.url, credit: `${sortedImages[0]?.title} by ${sortedImages[0]?.author}` };
      }

      if (this.config.selectionType === 'random') {
        const random = Math.floor(Math.random() * Math.floor(filteredImages.length - 1));
        const image = filteredImages[random];
        return { url: image?.url, credit: `${image?.title} by ${image?.author}` };
      }

      return {
        url: filteredImages[0]?.url,
        credit: `${filteredImages[0]?.title} by ${filteredImages[0]?.author}`,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.background {
  opacity: 0.3;
  background-repeat: no-repeat;
  background-size: cover;

  &__credit {
    color: white;
    text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
    font-weight: 600;
    position: absolute;
    bottom: 1rem;
    right: 1rem;;
    font-size: 1.2rem;
  }
}
</style>
