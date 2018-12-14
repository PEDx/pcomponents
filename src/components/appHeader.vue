<template>
  <div :class="['title-bar']">
    <div class="icon-back"  v-tap="{methods: () => $emit('left-click')}">
    </div>
    <span class="title">
      {{title}}
    </span>
  </div>
</template>
<script>
import Vue from 'vue';
import vueTap from 'v-tap';

Vue.use(vueTap);
export default {
    name: 'appHeader',
    props: {
        title: {
            type: String,
            default: '沣邦',
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>
<style lang="scss">
.title-bar {
    background-color: #fff;
    width: 100%;
    box-shadow: 0 -2px 4px 1px #575757;
    z-index: 10;
    text-align: center;
    .title {
        height: 1.173333rem;
        line-height: 1.173333rem;
        font-size: 0.426667rem;
    }
    .icon-back {
        position: absolute;
        top: 0.35rem;
        left: 0.426667rem;
        display: inline-block;
        width: 0.373333rem;
        height: 0.533333rem;
        background-position: -0.666667rem 0px;
        z-index: 2;
        background-image: url('../assets/icon_group.png');
        background-repeat: no-repeat;
        background-size: 0.96rem 1.12rem;
        cursor: pointer;
    }
}
</style>
