<template>
  <div>
    <template v-if="error">
      <error-view :error-message="error" />
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
  import ErrorView from '../views/ErrorView';

  export default {
    name: 'UiWithErrorView',
    props: {
      error: { type: String, default: '' },
    },
    components: {
      ErrorView,
    },
  };
</script>
