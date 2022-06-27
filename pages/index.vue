<template>
  <div class="max-w-6xl mx-auto flex flex-col">
    <h1>
      <span class="text-primary">Hello there,</span> <br />
      Book cheap flights with your one-stop travel shop!
    </h1>
    <div class="flex flex-row items-center justify-between">
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
      <label for="my-modal" class="btn btn-sm btn-accent modal-button"
        >Seats & Passengers</label
      >
    </div>
    <ReturnBookingForm />
    <div class="grid grid-cols-1 gap-10">
      <template v-for="(item, index) in flightOffers">
        <FlightCard
          :flightOffersDictionaries="flightOffersDictionaries"
          :item="item"
          :key="index + '_flightOffer'"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  components: {},
  data() {
    return {
      returnFlight: true,
    };
  },
  computed: {
    flightOffers() {
      return this.$store.getters.getFlightOffers;
    },
    flightOffersMeta() {
      return this.$store.getters.getFlightOffersMeta;
    },
    flightOffersDictionaries() {
      return this.$store.getters.getFlightOffersDictionaries;
    },
  },
  methods: {
    log(value) {
      console.log(value);
    },
    toggleFlightType(value) {
      this.returnFlight = value;
    },
  },
};
</script>
