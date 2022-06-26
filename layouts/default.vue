<template>
  <div>
    <PageHeader />
    <Nuxt />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import PageHeader from "~/components/shared/header.vue";
export default Vue.extend({
  name: "default",
  components: { PageHeader: PageHeader },
});
</script>
