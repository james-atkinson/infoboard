import { defineAsyncComponent } from 'vue';
import store from './store';

const layers = {
  BackgroundLayer: defineAsyncComponent(() => import('./layers/BackgroundLayer.vue')),
  MainLayer: defineAsyncComponent(() => import('./layers/MainLayer.vue')),
  OverlayLayer: defineAsyncComponent(() => import('./layers/OverlayLayer.vue')),
};

const widgets = {
  DateTimeWidget: defineAsyncComponent(() => import('./widgets/DateTimeWidget.vue')),
  EventsWidget: defineAsyncComponent(() => import('./widgets/EventsWidget.vue')),
  ICalCalendarWidget: defineAsyncComponent(() => import('./widgets/ICalCalendarWidget.vue')),
  NewsFeedWidget: defineAsyncComponent(() => import('./widgets/NewsFeedWidget.vue')),
  WeatherWidget: defineAsyncComponent(() => import('./widgets/WeatherWidget.vue')),
  WeatherRadarWidget: defineAsyncComponent(() => import('./widgets/WeatherRadarWidget.vue')),
};

const data = {};

export {
  data,
  layers,
  widgets,
  store,
};
