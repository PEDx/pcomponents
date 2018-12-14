<template>
  <div class="form">
    <div class="content-box">
      <div>
        <div class="base-config info">
          <div class="content-list">
            <van-cell
              title="车型"
              size="large"
              is-link
              arrow-direction="down"
              v-tap="{methods: showActionsheet, type: 1 }"
            >{{form.carType}}</van-cell>
            <van-cell title="姓名" size="large" :value="form.userName"/>
            <van-cell title="身份证号" size="large" :value="form.IDCard"/>
            <van-cell title="手机号" size="large" :value="form.phone"/>
            <van-cell
              title="银行卡名称"
              size="large"
              is-link
              arrow-direction="down"
              v-tap="{methods: showActionsheet, type: 2}"
            >{{form.bankName}}</van-cell>
            <van-cell title="银行卡号" size="large">
              <input type="tel" maxlength="20" placeholder="银行卡号" v-model="form.bankNum">
            </van-cell>
            <van-cell title="验证码" size="large">
              <span
                :class="['f-fr', codeText !== '获取验证码' && 'grey']"
                v-tap="{methods: getCode}"
              >{{codeText}}</span>
              <input
                type="tel"
                maxlength="6"
                placeholder="请输入验证码"
                class="verification f-fr"
                v-model="form.verification"
              >
            </van-cell>
          </div>
        </div>
      </div>
    </div>
    <div class="fix-bottom">
      <a class="myButton" v-tap="{methods: submit}">提交</a>
    </div>
    <van-popup v-model="show" position="bottom" :overlay="true">
      <van-picker
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
        show-toolbar
        value-key="carType"
      />
    </van-popup>
  </div>
</template>

<script>
// 18618310772
export default {
  data() {
    return {
      show: false,
      codeText: "获取验证码",
      columns: [],
      actionType: 1,
      carListArr: [],
      sheetActionValue: {},
      bankListArr: [
        "中国工商银行",
        "中国银行",
        "平安银行",
        "浦发银行",
        "广发银行",
        "中国建设银行",
        "中信银行",
        "兴业银行",
        "光大银行",
        "中国邮政储蓄银行",
        "招商银行",
        "交通银行",
        "中国农业银行"
      ],
      form: {
        userName: "",
        carType: "请选择",
        bankName: "请选择",
        IDCard: "",
        phone: "",
        verification: "",
        bankNum: ""
      }
    };
  },
  methods: {
    submit() {
      if (!this.sheetActionValue.applyNo) {
        this.$toast("没有选定车型");
        return;
      }
      if (this.form.verification.length < 4) {
        this.$toast("请填写完整验证码");
        return;
      }
      if (!this.form.bankNum) {
        this.$toast("请填写银行卡号");
        return;
      }
      this.$showLoading();
      this.$ajax({
        method: "get",
        url: encodeURI(`./agreement/agreement_confirm_binding.jspx?info={
          "openId": "${this.sheetActionValue.applyNo}",
          "name": "${this.form.userName}",
          "certNo": "${this.sheetActionValue.custIdNumber}",
          "reimbBank": "${this.form.bankName}",
          "reimbCardNum": "${this.form.bankNum}",
          "reimbPhone": "${this.form.phone}",
          "ercode": "${this.form.verification}",
          "custType": "${this.sheetActionValue.custType}",
          "applyNO": "${this.sheetActionValue.applyNo}"
        }`),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.$hideLoading();
        if (res.flag === "true") {
          // this.$toast.success("绑定成功");
          // window.location.reload();
          this.$router.push({
            path: `/form/status`
          });
        } else {
          this.$toast(res.message);
        }
      });
    },
    getCode() {
      if (this.codeText !== "获取验证码") return;
      if (this.form.phone.length !== 11) {
        this.$toast("未填写手机号");
        return;
      }
      this.$showLoading();
      this.$ajax({
        method: "get",
        url: encodeURI(`./agreement/gainCodeReadybinding.jspx?info={
          "phoneNo": "${this.form.phone}",
          "bankCardNo": "${this.form.bankNum}",
          "userName": "${this.form.userName}",
          "idCardNo": "${this.form.IDCard}",
          "applyNo": "${this.sheetActionValue.applyNo}",
          "userId": "${this.form.phone}",
          "bankName": "${this.form.bankName}"
        }`),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.$hideLoading();
        if (res.flag === "true") {
          this.$toast("已发送");
          this.countDown();
        } else {
          this.$toast(res.message);
        }
      });
    },
    showActionsheet(e) {
      let type = (this.actionType = e.type);
      if (!this.carListArr.length) {
        this.$toast("没有未绑定的车型");
        return;
      }
      this.columns = type === 1 ? this.carListArr : this.bankListArr;
      this.show = true;
    },
    onCancel() {
      this.show = false;
    },
    onConfirm(picker, index) {
      this.show = false;
      if (!picker.carType && this.actionType === 1) return;
      if (!picker && this.actionType === 2) return;
      if (this.actionType === 1) {
        this.setFormInfo(picker);
      } else {
        this.form.bankName = picker;
        this.form.bankNum = "";
      }
    },
    setFormInfo(info, phone) {
      this.sheetActionValue = info;
      this.form.userName = info.custName;
      this.form.carType = info.carType;
      this.form.bankName = info.payCardBank;
      this.form.IDCard = info.custIdNumber;
      this.form.phone = info.payCardCellphone || "无电话号码";
      this.form.bankNum = info.payCardBankNo;
    },
    countDown() {
      let countTotle = +localStorage.getItem("form_count") || 60;
      this.codeText = "重新获取 " + countTotle + "s";
      let countFunc = () => {
        if (countTotle === 0) {
          this.codeText = "获取验证码";
          return;
        }
        countTotle--;
        localStorage.setItem("form_count", countTotle);
        this.codeText = "重新获取 " + countTotle + "s";
        setTimeout(() => {
          countFunc();
        }, 1000);
      };
      countFunc();
    }
  },
  mounted() {
    if (+localStorage.getItem("form_count")) {
      this.countDown();
    }
  },
  created() {
    this.$showLoading();
    let phoneNum = localStorage.getItem("phone") || "";
    this.$ajax({
      method: "get",
      url: encodeURI(
        `./agreement/gainCustomerVehicle.jspx?info={"phone":"${phoneNum}"}`
      ),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      this.$hideLoading();
      if (res.flag === "false") {
        this.$toast(res.message);
        return;
      }
      if (res.data && res.data.payCardInfo[0]) {
        this.carListArr = res.data.payCardInfo;
        this.setFormInfo(this.carListArr[0], phoneNum);
      }
    });
  }
};
</script>

<style scoped lang="scss">
.form {
  background-color: #f8f8f8;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 1.6rem; // overflow: hidden;
  .content-box {
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
}

.base-config {
  .title {
    padding: 0 0.32rem;
    box-sizing: border-box;
    height: 1.333333rem;
    line-height: 1.333333rem;
    font-size: 0.426667rem;
  }
  .content-list {
    background-color: #fff;
    overflow: hidden;
    margin-top: 0.266667rem;
    input {
      display: inline-block;
      height: 100%;
      width: 100%;
      border: 0;
      font-size: 14px;
      text-align: right;
      color: #808080;
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: rgba(128, 128, 128, 0.2);
        letter-spacing: 0px;
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: rgba(128, 128, 128, 0.2);
        letter-spacing: 0px;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: rgba(128, 128, 128, 0.2);
        letter-spacing: 0px;
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: rgba(128, 128, 128, 0.2);
        letter-spacing: 0px;
      }
    }
    .verification {
      width: 94px;
      margin-right: 9px;
      letter-spacing: 6px;
      box-sizing: border-box;
    }
    span {
      padding-left: 9px;
      border-left: 1px solid rgba(151, 151, 151, 0.19);
      color: #3b77c3;
    }
    .grey {
      color: #6d6d6d;
    }
  }
}
.fix-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 1.173333rem;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  text-align: center;
  .myButton {
    width: 100%;
    height: 100%;
    display: inline-block;
    border-radius: 0;
    box-shadow: 0 2px 4px rgba(87, 87, 87, 0.4);
  }
}
</style>
<style>
html,
body {
  height: 100%;
  overflow: hidden;
}
.van-cell--large {
  padding-top: 13px;
  padding-bottom: 13px;
}
.van-cell--large,
.van-cell__title {
  font-size: 14px !important;
  color: #808080;
}
.van-cell__title {
  width: 100px;
  color: #575757;
  flex: none;
}
</style>
