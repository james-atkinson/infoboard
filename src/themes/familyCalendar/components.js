import store from './store';

const layers = {
  BackgroundLayer: () => import('./layers/BackgroundLayer.vue'),
  MainLayer: () => import('./layers/MainLayer.vue'),
  OverlayLayer: () => import('./layers/OverlayLayer.vue'),
};

const widgets = {
  DateTimeWidget: () => import('./widgets/DateTimeWidget.vue'),
  ICalCalendarWidget: () => import('./widgets/ICalCalendarWidget.vue'),
  NewsFeedWidget: () => import('./widgets/NewsFeedWidget.vue'),
};

const data = {};

export {
  data,
  layers,
  widgets,
  store,
};
