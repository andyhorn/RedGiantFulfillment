<template>
  <div class="container">
    <p>Connected to API: {{ connected }}</p>
    <div class="text-left p-0">
      <h3 class="mb-0">Containers</h3>
      <a href="#" @click="getContainers"><span style="font-size: 0.8rem;">Refresh</span></a>
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
      connected: false
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
      console.log("initializing bus listener");
      let vm = this;
      bus.$off("remove");
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
