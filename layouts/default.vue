<template>
  <div class="container mx-auto pb-12">
    <PageHeader />
    <Nuxt />
  </div>
</template>
<script>
import Vue from "vue";
import PageHeader from "~/components/shared/header";
export default Vue.extend({
  name: "default",
  components: { PageHeader: PageHeader },
  async created() {
    await this.$store.dispatch("getUserLocation");
    await this.$store.dispatch("getToken");
  },
});
</script>
