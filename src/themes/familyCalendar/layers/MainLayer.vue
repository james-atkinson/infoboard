<template>
  <div
    class="grid layer main"
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
const components = {
  DateTimeWidget: () => import('../widgets/DateTimeWidget.vue'),
};

export default {
  name: 'MainLayer',
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
      return Object.keys(this.widgets).map((widgetName) => ({
        id: widgetName,
        component: components[widgetName],
        config: this.widgets[widgetName].config,
        position: this.widgets[widgetName].position,
      }));
    },
  },
};
</script>
