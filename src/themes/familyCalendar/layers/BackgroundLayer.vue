<template>
  <div
    class="grid layer background"
    :style="`grid-column-gap: ${config.gridColumnGap || 0};
             grid-row-gap: ${config.gridRowGap || 0};`"
  >
    <component
      v-for="widget in widgets"
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
import BackgroundImageWidget from '../widgets/BackgroundImageWidget.vue';

export default {
  name: 'BackgroundLayer',
  components: { BackgroundImageWidget },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    widgets: [
      {
        id: 'BackgroundImageWidget',
        component: BackgroundImageWidget,
        config: {},
        position: {
          rowStart: 1,
          rowEnd: 13,
          columnStart: 1,
          columnEnd: 13,
        },
      },
    ],
  }),
};
</script>
