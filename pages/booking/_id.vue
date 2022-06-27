<template>
  <main v-if="flightDetails" class="container">
    <h1 class="leading-4">
      Thank you for your booking
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 inline text-success"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </h1>
    <h5 class="opacity-60 m-0">Please see your booking details below</h5>
    <small>Booking Reference: {{ this.$route.params.id }} </small>
    <h3>Flight Details</h3>
    <FlightCard
      :flightOffersDictionaries="flightOffersDictionaries"
      :item="flightDetails"
      :isBooking="true"
    />
    <h3>Passenger Details</h3>
    <div class="grid grid-cols-4 gap-12">
      <template v-for="(item, index) in passenegerDetails">
        <div
          :key="'passenger_info_' + index"
          class="card w-full bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <h4 class="m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 inline"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Passenger {{ index + 1 }}:
            </h4>
            <hr />
            <ul>
              <li :key="key + ':' + value" v-for="(value, key) in item">
                <p class="leading-3">
                  <span class="font-bold capitalize">{{
                    key.replace("_", " ")
                  }}</span>
                  : {{ value }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
<script>
export default {
  name: "BookingConfirmation",
  created() {
    this.$store.dispatch("getBooking", this.$route.params.id);
  },
  computed: {
    flightDetails() {
      return this.$store.getters.getFlightBookingDetails;
    },
    passenegerDetails() {
      return this.$store.getters.getPassenegerDetails;
    },
    flightOffersDictionaries() {
      return this.$store.getters.getFlightOffersDictionaries;
    },
  },
};
</script>
<style lang=""></style>
