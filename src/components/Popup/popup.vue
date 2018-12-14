<template>
<div class="popup">
  <div class="popup-mask" v-show="showPopup" ref="popupMask" v-tap="{methods: closePopup}"></div>
    <transition name="slideInUp" mode="out-in">
      <div class="fix-popup-bottom" v-show="showPopup" ref="popup">
        <div class="close-btn" v-tap="{methods: closePopup}"></div>
        <slot></slot>
      </div>
    </transition>
</div>
</template>
<script>
export default {
    data() {
        return {
            showPopup: false,
        };
    },
    mounted() {
        this.$refs.popupMask.ontouchmove = e => {
            e.preventDefault();
        };
        this.$refs.popup.ontouchmove = e => {
            e.preventDefault();
        };
    },
    methods: {
        closePopup() {},
        confirm() {},
    },
};
</script>
<style lang="scss" scoped>
.popup-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2;
}

.fix-popup-bottom {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
    z-index: 3;
    color: #575757;
    .close-btn {
        position: absolute;
        top: 0.053333rem;
        right: 0;
        width: 0.373333rem;
        height: 0.373333rem;
        background: url('../../assets/close_grey.png') no-repeat;
        background-size: 0.373333rem;
        background-origin: content-box;
        z-index: 99;
        padding: 0.32rem;
    }
}
</style>
