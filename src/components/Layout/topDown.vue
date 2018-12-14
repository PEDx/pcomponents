<template>
  <div :class="['layout-top-down', isIos ? 'layout-top-down-ios' : 'layout-top-down-android', isIphoneX ? 'layout-top-down-iosx' : '']">
    <app-header :title="title"  @left-click="leftClickEvent" class="fix-top-bar"></app-header>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import appHeader from '../../components/appHeader';

export default {
    name: 'topDown',
    components: {
        appHeader,
    },
    props: {
        title: {
            type: String,
            default: () => '沣邦',
        },
    },
    data() {
        return {};
    },
    computed: {
        isIos() {
            return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        },
        isIphoneX() {
            return (
                /iphone/gi.test(navigator.userAgent) &&
                (screen.height == 812 && screen.width == 375)
            );
        },
    },
    methods: {
        leftClickEvent() {
            this.$emit('left-click');
        },
    },
};
</script>
<style lang="scss">
.layout-top-down {
    height: 100%;
    overflow: scroll;
    .fix-top-bar {
        height: 1.173333rem;
        position: absolute;
        top: 0;
        left: 0;
    }
    .content {
        height: 100%;
        box-sizing: border-box;
        padding-top: 1.173333rem;
    }
}
.layout-top-down-ios {
    .fix-top-bar {
        padding-top: 0.586667rem;
        .icon-back {
            top: 0.9rem;
        }
    }
    .content {
        padding-top: 1.173333rem + 0.586667rem;
    }
}
.layout-top-down-iosx {
    .fix-top-bar {
        padding-top: 1.173333rem;
        .icon-back {
            top: 1.48rem;
        }
    }
    .content {
        padding-top: 1.173333rem + 1.173333rem;
    }
}
.layout-top-down-android {
    .fix-top-bar {
        padding-top: .666667rem;
        .icon-back {
            top: 1rem;
        }
    }
    .content {
        padding-top: 1.173333rem + .666667rem;
    }
}
</style>
