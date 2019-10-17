<template>
  <ui-date-picker
      type="datetime"
      :picker-options="pickerOptions"
      v-bind="$attrs"
      v-on="$listeners"
  />
</template>

<script>
  import moment from 'moment';

  export default {
    name: "UiDatetimePicker",
    props: {
      pickerOptions: {
        type: Object,
        default: () => ({
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', moment().valueOf());
              },
            },
            {
              text: '昨天',
              onClick(picker) {
                picker.$emit('pick', moment().subtract(1, 'days').valueOf());
              },
            },
          ],
        }),
      },
    },
  }
</script>

<style scoped>

</style>
