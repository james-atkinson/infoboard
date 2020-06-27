<template>
  <div
    class="canvas"
    :style="`
      width: ${config.width};
      height: ${config.height};
      background-color: ${config.backgroundColor};`"
  >
    <component
      v-for="layer in displayLayers"
      :key="layer.id"
      :is="layer.component"
      :ref="`layer-${layer.id}`"
      :style="`z-index: ${layer.zIndex}`"
      v-bind="layer"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { serverUrl } from '../config.json';
import * as themeComponents from '../themes/themeComponents';

export default {
  name: 'Canvas',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      themeName: (state) => state.config.name,
      canvasConfig: (state) => state.config.canvas,
      layers: (state) => state.config.layers,
    }),
    displayLayers() {
      if (!this.themeName) return {};
      if (!themeComponents[this.themeName]) return {};
      return Object.keys(this.layers).map((componentName) => ({
        id: componentName,
        component: themeComponents[this.themeName].layers[componentName],
        config: this.layers[componentName].config,
        zIndex: this.layers[componentName].zIndex,
        widgets: this.layers[componentName].widgets,
      }));
    },
  },
  async created() {
    const configPath = `${serverUrl}/api/config`;
    const serverResponse = await axios.get(configPath);
    const serverResponseGood = serverResponse.status === 200;
    const themeConfig = serverResponseGood ? serverResponse.data.configuredThemeConfig : {};

    this.$store.dispatch('setConfig', { config: themeConfig });
  },
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
