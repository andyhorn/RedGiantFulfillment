<template>
  <tr v-b-hover="hover" :class="{ 'bg-hover': hovering }">
    <td><span v-b-tooltip.hover :title="container.Id">{{ shortId }}</span></td>
    <td>{{ serviceName }}</td>
    <td>{{ container.State }}</td>
    <td>{{ container.Status }}</td>
    <td>
      <ul class="list-unstyled">
        <Port v-for="(port, index) in container.Ports" :key="port.PublicPort" :port="port" :isWeb="index == 2"></Port>
      </ul>
    </td>
    <td class="text-center">
      <b-button squared variant="danger" @click="remove">Remove</b-button>
    </td>
  </tr>
</template>

<script>
import bus from "../../bus";
import Port from "./Port";

export default {
  name: "container-row",
  props: ["container"],
  components: {
    Port
  },
  data() {
    return {
      hovering: false
    }
  },
  computed: {
    shortId: function() {
      return this.container.Id.slice(0, 4);
    },
    serviceName: function() {
      return this.container.Labels["com.docker.compose.service"];
    }
  },
  methods: {
    remove() {
      console.log(`removing ${this.container.Id}`);
      bus.$emit("remove", this.container.Id);
    },
    hover(isHovering) {
      this.hovering = isHovering;
    }
  }
};
</script>

<style scoped>
.bg-hover {
  background-color: lightblue;
}
</style>