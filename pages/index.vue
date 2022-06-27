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
    <ReturnBookingForm :returnFlight="returnFlight" />
    <div class="grid grid-cols-1 gap-10">
      <template v-for="(item, index) in flightOffers">
        <FlightCard
          :flightOffersDictionaries="flightOffersDictionaries"
          :item="item"
          :key="index + '_flightOffer'"
        />
      </template>
      <img
        v-show="!flightOffers"
        src="plane.svg"
        class="w-full mt-12 opacity-40 mx-auto"
      />

      <h1
        v-show="flightOffers && flightOffers.length == 0"
        class="text-center mt-12"
      >
        Sorry We couldn't find any flights
      </h1>

      <img
        v-show="flightOffers && flightOffers.length == 0"
        src="empty.svg"
        class="w-1/2 opacity-40 mx-auto"
      />
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
  async mounted() {
    await this.$store.dispatch("resetState");
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
