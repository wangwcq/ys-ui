const changePasswordFormDefault = {
  oldPassword: '',
  newPassword: '',
  newPassword2: '',
};
export default {
  data() {
    const changePasswordForm = {
      ...changePasswordFormDefault,
    };
    const changePasswordFields = [
      {
        name: 'oldPassword',
        title: '旧密码',
        type: 'password',
      },
      {
        name: 'newPassword',
        title: '新密码',
        type: 'password',
      },
      {
        name: 'newPassword2',
        title: '新密码',
        type: 'password',
      },
    ];
    return {
      changePasswordForm,
      changePasswordFields,
    };
  },
  methods: {
    async handleSubmitChangePassword() {
      const res = await this.withLoading(this.api('/api/change-password', this.changePasswordForm));
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.changePasswordForm = {
          ...changePasswordFormDefault,
        };
      }
    },
  },
};
