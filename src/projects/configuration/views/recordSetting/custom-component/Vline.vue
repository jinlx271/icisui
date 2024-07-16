<template>
  <div class="vline"></div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
.vline {
  width: 100%;
  height: 100%;
  border-color: var(--label-color);
  border-style: solid;
  border: 0;
  border-top: 1px solid var(--label-color);
}
</style>
