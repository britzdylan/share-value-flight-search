<template>
  <div class="container mx-auto">
    <PageHeader />
    <Nuxt />
  </div>
</template>
<script>
import Vue from "vue";
import PageHeader from "~/components/shared/header.vue";
export default Vue.extend({
  name: "default",
  components: { PageHeader: PageHeader },
  async created() {
    await this.$store.dispatch("getUserLocation");
    await this.$store.dispatch("getToken");
  },
});
</script>
