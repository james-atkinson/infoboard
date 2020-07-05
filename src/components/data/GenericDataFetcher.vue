<template>
  <div id="genericDataFetcher"/>
</template>
<script>
import axios from 'axios';
import { serverUrl } from '../../config.json';

export default {
  name: 'GenericDataFetcher',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  created() {
    if (this.config.interval && this.config.interval > 0) {
      setInterval(() => {
        this.fetchData(this.config.fetchUrl);
      }, this.config.interval * 60 * 1000);
    }

    if (this.config.immediate || !this.config.interval || this.config.interval === 0) {
      this.fetchData(this.config.fetchUrl);
    }
  },
  methods: {
    async fetchData(fetchUrl) {
      const fetchResult = await axios.get(`${serverUrl}/api/fetchData?url=${encodeURIComponent(fetchUrl)}`);
      if (fetchResult.status === 200) {
        this.$store.dispatch(this.config.storeAction, {
          key: this.config.storeKey,
          data: fetchResult.data,
        });
      }
    },
  },
};
</script>
