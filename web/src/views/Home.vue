<template>
  <div class="container">
    <p class="text-danger" v-if="!connected && !connecting">Unable to connect</p>
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
// import http from "../../axios";

export default {
  name: "Home",
  components: {
    ContainerTable
  },
  data() {
    return {
      response: null,
      containers: [],
      connecting: true,
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
      this.$http.get("api").then(response => {
        if (response.data === "Connected") {
          vm.connected = true;
        }
      })
      .catch(err => {
        console.log(err);
        vm.connected = false;
      })
      .finally(() => {
        vm.connecting = false;
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

      bus.$off("license");
      bus.$on("license", (port) => {
        let data = `HOST ${window.location.hostname} ANY ${port}`;
        let blob = new Blob([data], { type: "text" });
        let url = window.URL.createObjectURL(blob);

        let hiddenLink = document.createElement("a");
        hiddenLink.href = url;
        hiddenLink.setAttribute("download", "redgiant-client.primary.lic");
        document.body.appendChild(hiddenLink);
        hiddenLink.click();
        hiddenLink.remove();
      });

      bus.$off("portal");
      bus.$on("portal", (port) => {
        let url = `http://${window.location.hostname}:${port}/home.asp`;
        window.open(url, "_blank");
      })

      this.listening = true;
    }
  }
};
</script>
