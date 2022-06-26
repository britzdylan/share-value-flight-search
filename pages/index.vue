<template>
  <div class="max-w-6xl mx-auto flex flex-col">
    <h1>
      <span class="text-primary">Hello there,</span> <br />
      Book cheap flights with your one-stop travel shop!
    </h1>
    <div class="tabs">
      <a
        @click="toggleFlightType(true)"
        class="tab tab-bordered"
        :class="returnFlight ? 'tab-active' : null"
        >Return Flight</a
      >
      <a
        @click="toggleFlightType(false)"
        class="tab tab-bordered"
        :class="!returnFlight ? 'tab-active' : null"
        >One Way</a
      >
    </div>
    <ReturnBookingForm />
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "IndexPage",
  components: {},
  data() {
    return {
      returnFlight: true,
    };
  },
  methods: {
    log(value) {
      console.log(value);
    },
    toggleFlightType(value) {
      this.returnFlight = value;
    },
  },
});
</script>
