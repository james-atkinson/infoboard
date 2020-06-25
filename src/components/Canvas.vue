<template>
  <div
    class="canvas"
    :style="`
      width: ${config.width};
      height: ${config.height};
      background-color: ${config.backgroundColor};`"
  >
    <component
      v-for="layer in layers"
      :key="layer.id"
      :is="layer.component"
      :ref="`layer-${layer.id}`"
      v-bind="layer"
    />
  </div>
</template>

<script>
import BackgroundLayer from '../themes/familyCalendar/layers/BackgroundLayer.vue';
import MainLayer from '../themes/familyCalendar/layers/MainLayer.vue';
import OverlayLayer from '../themes/familyCalendar/layers/OverlayLayer.vue';

export default {
  name: 'Canvas',
  components: { BackgroundLayer, MainLayer, OverlayLayer },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    layers: [
      {
        id: 'BackgroundLayer',
        component: BackgroundLayer,
        config: {
          gridColumnGap: '0',
          gridRowGap: '0',
        },
        zIndex: 1000,
      },
      {
        id: 'MainLayer', component: MainLayer, config: { gridColumnGap: '5px', gridRowGap: '5px' }, zIndex: 2000,
      },
      {
        id: 'OverlayLayer', component: OverlayLayer, config: {}, zIndex: 3000,
      },
    ],
  }),
};
</script>

<style lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);

  width: 100%;
  height: 100%;
  margin: auto;
  z-index: 0;
}

.layer {
  position: absolute;
  left: 0;
  top: 0;
}
</style>

<style lang="scss" scoped>
.canvas {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
