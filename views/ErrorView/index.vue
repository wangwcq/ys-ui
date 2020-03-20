<template>
  <ui-stage>
    <ui-card>
      <ui-flex col center>
        <img src="./illus.svg" alt="" style="width: 250px; max-width: 90%; height: auto;">
        <h3>{{ errorMessage }}</h3>
      </ui-flex>
    </ui-card>
  </ui-stage>
</template>

<script>
  export default {
    name: "ErrorView",
    props: {
      errorMessage: { type: String, default: '找不到指定的内容' },
    },
  }
</script>

<style scoped>

</style>
