<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {

    }
  },
  computed: {

  },
  beforeRouteLeave(to, from, next) {

  },
  mounted() {

  },
  methods: {}
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
  padding:0;
  margin:0;
  background-color: #f5f5f5;
}

</style>
