<template>
  <div class="border"></div>
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
.border{
  width:100%;
  height: 100%;
  border-color:var(--label-color);
  border-style: solid;
}
</style>
