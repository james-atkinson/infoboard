<template>
  <div
    class="background"
    :style="`background-image: url('${config.backgroundImageUrl}')`"
  ></div>
</template>
<script>
export default {
  name: 'StaticBackgroundImageWidget',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.background {
  opacity: 0.2;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
