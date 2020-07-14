<template>
  <div v-if="canvasConfig">
    <div
      class="canvas"
      :style="`
        width: ${canvasConfig.width};
        height: ${canvasConfig.height};
        background-color: ${canvasConfig.backgroundColor};`"
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
    <component
      v-for="dataComponent in validDataComponents"
      :key="dataComponent.id"
      :is="dataComponent.component"
      :ref="`layer-${dataComponent.id}`"
      v-bind="dataComponent"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { serverUrl } from '../config.json';
import * as themeComponents from '../themes/themeComponents';
import widgets from './widgets';
import dataComponents from './data';

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
      dataComponents: (state) => state.config.data,
    }),
    displayLayers() {
      if (!this.themeName) return {};
      if (!themeComponents[this.themeName]) return {};
      return Object.keys(this.layers).map((componentName) => {
        if (themeComponents[this.themeName] && themeComponents[this.themeName].layers[componentName]) {
          return {
            id: componentName,
            component: themeComponents[this.themeName].layers[componentName],
            config: this.layers[componentName].config,
            zIndex: this.layers[componentName].zIndex,
            widgets: this.layers[componentName].widgets,
          };
        }

        if (widgets && widgets[componentName]) {
          return {
            id: componentName,
            component: widgets[componentName],
            config: this.layers[componentName].config,
            zIndex: this.layers[componentName].zIndex,
            widgets: this.layers[componentName].widgets,
          };
        }

        return {};
      });
    },
    validDataComponents() {
      if (!this.themeName) return {};
      if (!themeComponents[this.themeName]) return {};
      if (!this.dataComponents) return {};

      const globalDataComponents = dataComponents;
      const themeDataComponents = themeComponents[this.themeName].data;

      const result = Object.keys(this.dataComponents).map((componentName) => {
        if (globalDataComponents[componentName]) {
          return {
            id: componentName,
            component: globalDataComponents[componentName],
            config: this.dataComponents[componentName].config,
          };
        }

        if (themeDataComponents[componentName]) {
          return {
            id: componentName,
            component: themeDataComponents[componentName],
            config: this.dataComponents[componentName].config,
          };
        }

        return false;
      }).filter((component) => component !== false);

      return result;
    },
  },
  async created() {
    const configPath = `${serverUrl}/api/config`;
    const serverResponse = await axios.get(configPath);
    const serverResponseGood = serverResponse.status === 200;
    const themeConfig = serverResponseGood ? serverResponse.data : {};

    this.$store.dispatch('setConfig', { config: themeConfig });
  },
};
</script>

<style lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(36, 1fr);
  grid-template-rows: repeat(36, 1fr);

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
