<template>
  <div>
    <ui-button
        type="primary"
        @click="handleChangePassword"
    >修改密码</ui-button>
  </div>
</template>

<script>
export default {
  name: "UiChangePassword",
  props: {
    url: { type: String, default: '/api/users/change-password' },
    id: { type: [String, Number], default: '' },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    async handleChangePassword() {
      try {
        const { value } = await this.$prompt('请输入新密码', '修改密码', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
        });
        const res = await this.withLoading(this.api(this.url, {
          id: this.id,
          password: value,
        }));
        if (res) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
        }
      } catch(e) {
        return;
      }
    },
  },
}
</script>
