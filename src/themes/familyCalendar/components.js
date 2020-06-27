const layers = {
  BackgroundLayer: () => import('./layers/BackgroundLayer.vue'),
  MainLayer: () => import('./layers/MainLayer.vue'),
  OverlayLayer: () => import('./layers/OverlayLayer.vue'),
};

const widgets = {
  DateTimeWidget: () => import('./widgets/DateTimeWidget.vue'),
};

export {
  layers,
  widgets,
};
