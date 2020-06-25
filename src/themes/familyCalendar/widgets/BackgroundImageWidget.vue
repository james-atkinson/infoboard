<template>
  <div class="background"></div>
</template>
<script>
export default {
  name: 'BackgroundImageWidget',
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
  background-image: url('https://wallpapercave.com/wp/wp3103674.jpg');
}
</style>
