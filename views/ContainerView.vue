<template>
  <div>
    <router-view :key="$route && $route.path" />
  </div>
</template>

<script>
export default {
  name: 'ContainerView',
};
</script>
