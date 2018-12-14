<template>
  <div :class="['login', screenFocus && 'screenFocus']">
    <div>
      <img src="../assets/background.png" alt class="bk">
      <img src="../assets/logo_white.png" alt class="logo">
    </div>
    <div class="login-form">
      <div class="form-item">
        <input
          type="tel"
          name
          id
          placeholder="请输入手机号"
          maxlength="11"
          v-model="phoneNum"
          @focus="handleFocus"
          @blur="handleBlur"
        >
        <div class="line"></div>
        <div class="clean" v-show="showClean" v-tap="{methods: cleanPhone}"></div>
      </div>
      <div class="form-item verification">
        <input
          type="tel"
          name
          maxlength="6"
          v-model="verification"
          @focus="handleFocus"
          @blur="handleBlur"
          placeholder="请输入验证码"
        >
        <div
          :class="['acquire']"
          v-show="showAcquire && phoneNumComplete"
          v-tap="{methods: acquire}"
        >获取验证码</div>
        <div class="re-acquire" v-show="showReAcquire">重新获取 {{count}}s</div>
        <div class="line"></div>
      </div>
      <div :class="['btn', complete && 'complete']">
        <button v-tap="{methods: login}">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showClean: false,
      showAcquire: true,
      showReAcquire: false,
      complete: false,
      screenFocus: false,
      phoneNumComplete: false,
      count: 60,
      phoneNum: "",
      verification: ""
    };
  },
  watch: {
    phoneNum(newVal, oldVal) {
      if (newVal.length) {
        this.showClean = true;
      } else {
        this.showClean = false;
      }
      if (newVal.length === 11) {
        this.phoneNumComplete = true;
      } else {
        this.phoneNumComplete = false;
      }

      this.complete = false;
      if (this.verification.length === 6 && this.phoneNumComplete) {
        this.complete = true;
      } else {
        this.complete = false;
      }
    },
    verification(newVal, oldVal) {
      this.complete = false;
      if (newVal.length === 6 && this.phoneNumComplete) {
        this.complete = true;
      } else {
        this.complete = false;
      }
    }
  },
  methods: {
    cleanPhone() {
      this.phoneNum = "";
    },
    handleFocus() {
      this.screenFocus = true;
    },
    handleBlur() {
      this.screenFocus = false;
    },
    acquire() {
      if (!this.phoneNumComplete) {
        this.$toast("请输入完整手机号");
        return;
      }
      this.$showLoading();
      this.$ajax({
        method: "get",
        url: encodeURI(
          `./agreement/gainVerifyCode.jspx?info={"phone":"${
            this.phoneNum
          }"}`
        ),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.$hideLoading();
        if (res.flag === "true") {
          this.$toast("验证码已发送");
          this.countDown();
        }
      });
    },
    login() {
      if (!this.phoneNum) {
        this.$toast("请输入手机号");
        return;
      }
      if (!this.verification) {
        this.$toast("请输入验证码");
        return;
      }
      this.$showLoading();
      this.$ajax({
        method: "get",
        url: encodeURI(
          `./agreement/VerifyMessageCode.jspx?info={"phone":"${
            this.phoneNum
          }","verCode":"${this.verification}"}`
        ),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.$hideLoading();
        if (res.flag === "false") {
          this.$toast("验证码有误，请重新输入");
          return;
        }
        localStorage.setItem("phone", this.phoneNum);
        this.$toast("登陆成功");
        this.$router.push({
          path: `/form`
        });
      });
    },
    countDown() {
      let countTotle = +localStorage.getItem("count") || 60;
      this.showAcquire = false;
      this.showReAcquire = true;
      let countFunc = () => {
        if (countTotle <= 0) {
          this.showAcquire = true;
          this.showReAcquire = false;
          return;
        }
        countTotle--;
        localStorage.setItem("count", countTotle);
        this.count = countTotle;
        setTimeout(() => {
          countFunc();
        }, 1000);
      };
      countFunc();
    }
  },
  mounted() {
    if (+localStorage.getItem("count")) {
      this.countDown();
    }
  },
  created() {
    localStorage.setItem("phone", "");
  }
};
</script>
<style scoped lang="scss">
.login {
  height: 100%;
  & > div {
    position: relative;
  }
  .bk {
    display: inline-block;
    height: 4.426667rem;
    width: 100%;
    transition: all 0.2s;
  }
  .logo {
    position: absolute;
    bottom: 1.546667rem;
    left: 50%;
    margin-left: -2.666667rem;
    margin-top: -0.533333rem;
    width: 5.333333rem;
    height: 1.493333rem;
    transition: all 0.2s;
  }
  .login-form {
    margin-top: 1.066667rem;
  }
  .btn {
    width: 6.933333rem;
    margin: 0 auto;

    & > button {
      display: inline-block;
      width: 6.933333rem;
      height: 1.226667rem;
      font-size: 18px;
      color: #fff;
      opacity: 0.5;
      background-image: linear-gradient(270deg, #e3a861 0%, #f4deb7 100%);
      border-radius: 24px;
      border: 0;
      &:active {
        position: relative;
        top: 1px;
      }
    }
  }
  .complete button {
    opacity: 1;
    background-image: linear-gradient(270deg, #e3a861 0%, #f4deb7 100%);
  }
  .verification {
    input {
      letter-spacing: 0.113333rem;
      &::-webkit-input-placeholder {
        letter-spacing: 0;
        font-size: .426667rem;
      }
      &:-moz-placeholder {
        letter-spacing: 0;
        font-size: .426667rem;
      }
      &::-moz-placeholder {
        letter-spacing: 0;
        font-size: .426667rem;
      }
      &:-ms-input-placeholder {
        letter-spacing: 0;
        font-size: .426667rem;
      }
    }
  }
  .form-item {
    position: relative;
    width: 6.4rem;
    height: 0.96rem;
    margin: 0 auto;
    margin-bottom: 0.746667rem;
    color: #575757;
    .clean {
      cursor: pointer;
      position: absolute;
      top: 0.106667rem;
      right: 0.133333rem;
      width: 0.693333rem;
      height: 0.693333rem;
      background: url("../assets/cross.png") no-repeat;
      background-size: 0.346667rem 0.346667rem;
      background-position: 50% 50%;
    }
    .re-acquire,
    .acquire {
      position: absolute;
      top: 0.36rem;
      right: -0.133333rem;
      color: #3b77c3;
    }
    .re-acquire {
      right: -0.433333rem;
      color: #808080;
    }
    input {
      display: inline-block;
      width: 100%;
      height: 0.96rem;
      line-height: 0.96rem;
      text-align: center;
      font-size: .533333rem;
      color: #575757;
      border: 0;
      outline: 0;
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: rgba(128, 128, 128, 0.2);
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: rgba(128, 128, 128, 0.2);
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: rgba(128, 128, 128, 0.2);
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: rgba(128, 128, 128, 0.2);
      }
    }
    .line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-image: url("../assets/line.png");
      background-size: 100% 100%;
    }
  }
}

.screenFocus {
  .logo {
    margin-left: -73px;
    width: 145px;
    height: 40px;
    bottom: 42px;
  }
}
</style>
<style>
html,
body {
  height: 100%;
}
</style>
