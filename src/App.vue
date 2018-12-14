<template>
<transition :name="transitionName" mode="out-in">
    <router-view/>
</transition>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            transitionName: "",
        };
    },
    watch: {
        $route(to, from) {
            const toDepth = to.path.split('/').length;
            const fromDepth = from.path.split('/').length;
            this.transitionName =
                toDepth > fromDepth ? 'fadeInRight' : 'fadeInLeft';
        },
    },
};
</script>

<style>
</style>
