<template>
  <div class="home container">
    <p>Connected to API: {{ connected }}</p>
    <div class="text-left d-flex flex-row align-items-begin p-0">
      <h3 class="d-inline p-0 mr-2">Containers</h3>
      <b-button squared size="sm" class="m-0" variant="outline-info" @click="getContainers">Refresh</b-button>
    </div>
      <ContainerTable :containers="containers"></ContainerTable>
  </div>
</template>

<script>
import ContainerTable from "../components/Home/ContainerTable";
import bus from "../bus";

export default {
  name: "Home",
  components: {
    ContainerTable
  },
  data() {
    return {
      response: null,
      containers: [],
      connected: false,
      listening: false
    };
  },
  watch: {
    connected() {
      if (this.connected) {
        this.getContainers();
      }
    }
  },
  mounted() {
    this.testConnection();
    this.listen();
  },
  methods: {
    getContainers() {
      let url = "api/docker";
      let vm = this;
      this.$http.get(url).then(response => {
        vm.containers = response.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    testConnection() {
      let vm = this;
      vm.$http.get("api").then(response => {
        if (response.data === "Connected") {
          vm.connected = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    listen() {
      if (this.listening) return;

      console.log("initializing bus listener");
      let vm = this;
      bus.$on("remove", (id) => {
        console.log("remove event caught, sending delete request");
        this.$http.delete(`api/docker/${id}`)
          .then(response => {
            console.log(response);
            vm.getContainers();
          })
          .catch(err => {
            console.log(err);
          });
      });

      this.listening = true;
    }
  }
};
</script>
