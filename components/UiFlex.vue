<template>
  <div
      :class="[
        'ui-flex',
        {
          'ui-flex--row': row,
          'ui-flex--row-reverse': rowReverse,
          'ui-flex--col': column || col,
          'ui-flex--col-reverse': columnReverse || colReverse,
          'ui-flex--justify-start': justifyStart || jStart,
          'ui-flex--justify-end': justifyEnd || jEnd,
          'ui-flex--justify-around': around,
          'ui-flex--justify-between': between,
          'ui-flex--justify-even': even || evenly,
          'ui-flex--justify-stretch': stretch,
          'ui-flex--justify-center': justifyCenter || jCenter || center,
          'ui-flex--align-start': alignStart || aStart,
          'ui-flex--align-end': alignEnd || aEnd,
          'ui-flex--align-center': alignCenter || aCenter || center,
        },
      ]"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "UiFlex",
    props: {
      row: { type: Boolean, default: false },
      rowReverse: { type: Boolean, default: false },
      column: { type: Boolean, default: false },
      col: { type: Boolean, default: false },
      columnReverse: { type: Boolean, default: false },
      colReverse: { type: Boolean, default: false },
      justifyStart: { type: Boolean, default: false },
      jStart: { type: Boolean, default: false },
      justifyEnd: { type: Boolean, default: false },
      jEnd: { type: Boolean, default: false },
      around: { type: Boolean, default: false },
      between: { type: Boolean, default: false },
      even: { type: Boolean, default: false },
      evenly: { type: Boolean, default: false },
      stretch: { type: Boolean, default: false },
      justifyCenter: { type: Boolean, default: false },
      jCenter: { type: Boolean, default: false },
      alignStart: { type: Boolean, default: false },
      aStart: { type: Boolean, default: false },
      alignEnd: { type: Boolean, default: false },
      aEnd: { type: Boolean, default: false },
      alignCenter: { type: Boolean, default: false },
      aCenter: { type: Boolean, default: false },
      center: { type: Boolean, default: false },
    },
  }
</script>

<style lang="less">
  .ui-flex {
    flex: 1 0 auto;
    &--row { display: flex; flex-direction: row; flex: 0 1 auto; }
    &--row-reverse { display: flex; flex-direction: row-reverse; flex: 0 1 auto; }
    &--col { display: flex; flex-direction: column; flex: 0 1 auto; }
    &--col-reverse { display: flex; flex-direction: column-reverse; flex: 0 1 auto; }

    &--justify-start { flex: 0 1 auto; justify-content: flex-start; }
    &--justify-end { flex: 0 1 auto; justify-content: flex-end; }
    &--justify-around { flex: 0 1 auto; justify-content: space-around; }
    &--justify-between { flex: 0 1 auto; justify-content: space-between; }
    &--justify-even { flex: 0 1 auto; justify-content: space-evenly; }
    &--justify-stretch { flex: 0 1 auto; justify-content: stretch; }
    &--justify-center { flex: 0 1 auto; justify-content: center; }

    &--align-start { flex: 0 1 auto; align-items: flex-start; }
    &--align-end { flex: 0 1 auto; align-items: flex-end; }
    &--align-center { flex: 0 1 auto; align-items: center; }
  }
</style>