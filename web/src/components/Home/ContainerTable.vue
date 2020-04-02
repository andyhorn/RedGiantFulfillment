<template>
  <div class="mt-5 text-left">
    <table v-if="containers.length" class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Service Name</th>
          <th>State</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <ContainerRow
          v-for="container in containers"
          :key="container.Id"
          :container="container"
        ></ContainerRow>
      </tbody>
    </table>
    <div v-else>
      <p>No containers running.</p>
    </div>
  </div>
</template>

<script>
import ContainerRow from "./ContainerRow";

export default {
  name: "container-table",
  props: ["containers"],
  components: {
    ContainerRow
  }
};
</script>

<style scoped></style>
