<template>
  <div class="container text-left">
    <h1>hello world!</h1>
    <b-form @submit="submit">
      <b-form-group
        id="name"
        label="Customer name"
        label-for="cust_name"
        description="Customer/Account Name"
      >
        <b-form-input
          id="cust_name"
          v-model="name"
          required
          placeholder="Customer name"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="files"
        label="License files"
        label-for="license_files"
        description="Red Giant license (.lic) files"
      >
        <b-form-file
          v-model="files"
          :state="Boolean(files.length)"
          placeholder="Choose files"
          multiple
          required
          ref="files"
          accept=".lic"
          :file-name-formatter="formatNames"
        ></b-form-file>
      </b-form-group>
      <div class="d-flex align-items-center">
        <b-button :class="{ 'disabled': working }" variant="outline-success" type="submit">Submit</b-button>
        <b-icon-gear class="mx-2" v-if="working" animation="spin" font-scale="2"></b-icon-gear>
      </div>
    </b-form>
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import bus from "../bus";

export default {
  name: "new",
  data() {
    return {
      files: [],
      name: null,
      working: false,
      error: null,
      headers: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    };
  },
  watch: {
    name(text) {
      this.name = text.replace(" ", "_");
    }
  },
  methods: {
    makeFormData() {
      let formData = new FormData();

      formData.append("name", this.name);

      for (let file of this.files) {
        console.log(`Appending file ${file.name}`);
        formData.append("files", file, file.name);
      }

      return formData;
    },
    submit() {
      this.working = true;
      let formData = this.makeFormData();

      console.log("Submitting form data:");
      console.log(formData);

      let vm = this;
      this.$http
        .post("api/docker", formData)
        .then(response => {
          console.log(response);
          this.$router.push({ name: "Home" });
        })
        .catch(err => {
          console.log(err);
          vm.error = err;
        })
        .finally(() => {
          vm.working = false;
        });
    },
    formatNames() {
      if (this.files.length === 1) {
        return this.files[0].name;
      } else {
        return `${this.files[0].name} + ${this.files.length - 1} more`;
      }
    }
  }
};
</script>

<style scoped></style>
