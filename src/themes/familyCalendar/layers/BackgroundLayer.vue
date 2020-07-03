<template>
  <div
    class="grid layer background"
    :style="`grid-column-gap: ${config.gridColumnGap || 0};
             grid-row-gap: ${config.gridRowGap || 0};`"
  >
    <component
      v-for="widget in displayWidgets"
      :key="widget.id"
      :is="widget.component"
      :ref="`widget-${widget.id}`"
      :style="`
        grid-column: ${widget.position.columnStart} / ${widget.position.columnEnd};
        grid-row: ${widget.position.rowStart} / ${widget.position.rowEnd}`"
      v-bind="widget"
    />
  </div>
</template>
<script>
import * as themeComponents from '../components';
import widgets from '../../../components/widgets';

export default {
  name: 'BackgroundLayer',
  props: {
    config: {
      type: Object,
      required: true,
    },
    widgets: {
      type: Object,
      required: true,
    },
  },
  computed: {
    displayWidgets() {
      const themeWidgets = themeComponents.widgets; // eslint-disable-line
      return Object.keys(this.widgets).map((widgetName) => {
        if (themeWidgets[widgetName]) {
          return {
            id: widgetName,
            component: themeWidgets[widgetName],
            config: this.widgets[widgetName].config,
            position: this.widgets[widgetName].position,
          };
        }

        if (widgets[widgetName]) {
          return {
            id: widgetName,
            component: widgets[widgetName],
            config: this.widgets[widgetName].config,
            position: this.widgets[widgetName].position,
          };
        }

        return {};
      });
    },
  },
};
</script>
