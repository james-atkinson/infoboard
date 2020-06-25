<template>
  <div class="grid layer overlay"></div>
</template>
<script>
export default {
  name: 'OverlayLayer',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
};
</script>
