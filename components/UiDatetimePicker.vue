<template>
  <ui-date-picker
      :type="type"
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
      type: { type: String, default: 'datetime' },
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
