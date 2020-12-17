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
import { computed } from 'vue';
import { useStore } from 'vuex';
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
  async setup() {
    const store = useStore();
    const themeName = computed(() => store.state.config.name);
    const canvasConfig = computed(() => store.state.config.canvas);
    const layers = computed(() => store.state.config.layers);
    const storeDataComponents = computed(() => store.state.config.data);

    const configPath = `${serverUrl}/api/config`;
    const serverResponse = await axios.get(configPath);
    const serverResponseGood = serverResponse.status === 200;
    const themeConfig = serverResponseGood ? serverResponse.data : {};

    store.dispatch('setConfig', { config: themeConfig });

    const displayLayers = computed(() => {
      if (!themeName.value) return {};
      if (!themeComponents[themeName.value]) return {};
      return Object.keys(layers.value).map((componentName) => {
        if (themeComponents[themeName.value] && themeComponents[themeName.value].layers[componentName]) {
          return {
            id: componentName,
            component: themeComponents[themeName.value].layers[componentName],
            config: layers.value[componentName].config,
            zIndex: layers.value[componentName].zIndex,
            widgets: layers.value[componentName].widgets,
          };
        }

        if (widgets && widgets[componentName]) {
          return {
            id: componentName,
            component: widgets[componentName],
            config: layers.value[componentName].config,
            zIndex: layers.value[componentName].zIndex,
            widgets: layers.value[componentName].widgets,
          };
        }

        return {};
      });
    });

    const validDataComponents = computed(() => {
      if (!themeName.value) return {};
      if (!themeComponents[themeName.value]) return {};
      if (!storeDataComponents.value) return {};

      const globalDataComponents = dataComponents;
      const themeDataComponents = themeComponents[themeName.value].data;

      const result = Object.keys(storeDataComponents.value).map((componentName) => {
        if (globalDataComponents[componentName]) {
          return {
            id: componentName,
            component: globalDataComponents[componentName],
            config: storeDataComponents.value[componentName].config,
          };
        }

        if (themeDataComponents[componentName]) {
          return {
            id: componentName,
            component: themeDataComponents[componentName],
            config: storeDataComponents.value[componentName].config,
          };
        }

        return false;
      }).filter((component) => component !== false);

      return result;
    });

    const result = {
      // Computeds
      themeName,
      canvasConfig,
      layers,
      storeDataComponents,
      displayLayers,
      validDataComponents,
    };

    return result;
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
