<template>
  <tr v-b-hover="hover" :class="{ 'bg-hover': hovering }">
    <td><span v-b-tooltip.hover :title="container.Id">{{ shortId }}</span></td>
    <td>{{ serviceName }}</td>
    <td>{{ container.State }}</td>
    <td>{{ container.Status }}</td>
    <td class="d-flex flex-row justify-content-between">
      <div>
        <b-button class="mx-1" squared variant="success" @click="open">Open Portal</b-button>
        <b-button class="mx-1" squared variant="primary" @click="license">Get License</b-button>
      </div>
      <b-button class="ml-2" squared variant="danger" @click="remove">Remove</b-button>
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
    },
    license() {
      let port = this.container.Ports.find(p => p.PrivatePort == "5053");
      bus.$emit("license", port.PublicPort);
    },
    open() {
      let port = this.container.Ports.find(p => p.PrivatePort == "5054");
      bus.$emit("portal", port.PublicPort);
    }
  }
};
</script>

<style scoped>
.bg-hover {
  background-color: lightblue;
}
</style>