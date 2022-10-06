<template>
  <div class="grapes__selects">

  </div>

  <div class="grapes__drawboard">

  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>

body {
  margin: 0px;
}
#app {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;

  display: flex;
}

.grapes__selects {
  width: 432px;
  height: 100%;
  background-color: red;

}

.grapes__drawboard {
  width: calc(100% - 432px);
  height: 100%;
  background-color: yellow;
}
</style>
