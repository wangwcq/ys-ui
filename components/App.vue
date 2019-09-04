<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="less">
  body, html {
    margin: 0;
    padding: 0;
  }
  * {
    font-family: Roboto, "Arial", "PingFang SC", "Microsoft YaHei";
  }
  pre {
    font-family: "Roboto Mono";
    overflow: auto;
    border: solid 1px fadeout(black, 95);
    background: fadeout(black, 98);
    padding: 10px;
    border-radius: 5px;
  }
</style>
