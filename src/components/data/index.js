import { defineAsyncComponent } from 'vue';

const dataComponents = {
  GenericDataFetcher: defineAsyncComponent(() => import('./GenericDataFetcher.vue')),
};

export default dataComponents;
