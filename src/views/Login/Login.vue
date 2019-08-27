<template>
  <div class="login">
    <div class="login__box">
      <div>
        <div class="login__title">
          <slot>
            {{title}}
          </slot>
        </div>
        <div class="login__form">
          <div class="login__form__title">
            <ui-link :underline="false" type="primary">账户密码登录</ui-link>
          </div>
          <div class="login__form__username">
            <ui-input
                type="text"
                placeholder="登录名"
                v-model="login.username"
                prefix-icon="el-icon-user"
            ></ui-input>
          </div>
          <div class="login__form__password">
            <ui-input
                type="password"
                placeholder="密码"
                v-model="login.password"
                prefix-icon="el-icon-lock"
            ></ui-input>
          </div>
          <div class="login__form__button">
            <ui-button
                type="primary"
                @click="doLogin"
            >登录</ui-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    props: {
      title: { type: String, default: '欢迎管理员登录' },
      auth: { type: Function, default: null },
    },
    data() {
      return {
        login: {
          username: '',
          password: '',
        },
      };
    },
    methods: {
      async doLogin() {
        this.withLoading(this.auth ? this.auth(this) : async () => {
          let res = await axios.post('/api/login', {
            username: this.login.username,
            password: this.login.password,
          });
          console.log(res);
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  .login {
    background-color: #F0F3F7;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    &__box {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: url('./login-bg.png') no-repeat center center;
      background-size: 951px 534px;
      width: 951px;
      height: 534px;
      box-sizing: border-box;
      padding: 20px 172px 20px 139px;
      text-align: center;
    }
    &__title {
      font-size: 26px;
      line-height: 42px;
      margin-bottom: 85px;
      image {
        display: inline-block;
        margin: 0 30px;
        height: 42px;
        width: auto;
        vertical-align: middle;
      }
    }
    &__form {
      &__title {
        .el-link {
          display: inline-block;
          font-size: 16px;
          padding: 8px 20px;
          border-bottom: solid #1890FF 2px;
          margin-bottom: 34px;
        }
      }
      &__username, &__password {
        width: 368px;
        margin-bottom: 24px;
      }
      &__button {
        .el-button {
          width: 100%;
        }
      }
    }
  }
</style>