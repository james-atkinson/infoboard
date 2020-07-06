<template>
  <div>
    <Canvas :config="canvasConfig"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Canvas from '@/components/Canvas.vue';

export default {
  name: 'Main',
  components: {
    Canvas,
  },
  data: () => ({
    canvasConfig: {
      width: '1920px',
      height: '1080px',
      backgroundColor: 'black',
    },
  }),
};
</script>
<style lang="scss">
body { background-color: black; }
</style>
