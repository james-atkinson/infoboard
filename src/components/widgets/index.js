import { defineAsyncComponent } from 'vue';

const widgets = {
  RedditBackgroundImageWidget: defineAsyncComponent(() => import('./RedditBackgroundImageWidget.vue')),
  StaticBackgroundImageWidget: defineAsyncComponent(() => import('./StaticBackgroundImageWidget.vue')),
};

export default widgets;
