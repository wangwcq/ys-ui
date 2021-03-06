<template>
  <div>
    <router-view :key="keyed ? $route && $route.path : 'ContainerView'" />
  </div>
</template>

<script>
export default {
  name: 'ContainerView',
  props: {
    keyed: { type: Boolean, default: true },
  },
};
</script>
