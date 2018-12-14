<template>
  <div class="status">
    <div class="icon">
      <van-icon name="success"/>
    </div>
    <div class="text">绑定成功!</div>
    <div class="btn" v-if="showBtn">
      <van-button plain type="primary" v-tap="{methods: continueBind}">继续绑定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBtn: false
    };
  },
  watch: {},
  methods: {
    continueBind() {
      this.$router.push({
        path: `/form`
      });
    }
  },
  mounted() {},
  created() {
    this.$showLoading();
    this.showBtn = false;
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
        this.showBtn = false;
        return;
      }
      if (res.data && res.data.payCardInfo[0]) {
        this.showBtn = true;
      }
    });
  }
};
</script>
<style scoped lang="scss">
.status {
  .icon {
    font-size: 80px;
    text-align: center;
    color: #4b0;
    margin-top: 50px;
  }
  .text {
    text-align: center;
    font-size: 18px;
    margin-bottom: 1.066667rem;
    position: relative;
    top: -0.433333rem;
  }
  .btn {
    text-align: center;
  }
}
</style>
