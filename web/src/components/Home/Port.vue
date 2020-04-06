<template>
    <li v-if="!isWeb">
        External: {{ port.PublicPort }} >> Internal: {{ port.PrivatePort }}
    </li>
    <li v-else>
        External: <span @click="open">{{ port.PublicPort }}</span> >> Internal: {{ port.PrivatePort }}
    </li>
</template>

<script>
export default {
    name: 'port',
    props: ['port', 'isWeb'],
    methods: {
        open() {
            let host = window.location.hostname;
            let url = `http://${host}:${this.port.PublicPort}`;
            window.open(url, "_blank");
        }
    }
}
</script>

<style scoped>
span {
    color: blue;
    text-decoration: underline;
}
span:hover {
    cursor: pointer;
}
</style>