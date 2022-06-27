<template>
  <div
    class="card card-compact w-full bg-base-100 shadow-md p-0 flex flex-col md:flex-row items-center justify-between"
  >
    <div class="w-full p-4">
      <template v-for="(itin, indexA) in item.itineraries">
        <div
          class="px-4 mb-4 border-t-4 md:border-l-4 border-accent rounded-sm"
          :key="indexA + '_itinerary'"
        >
          <template v-for="(segment, index) in itin.segments">
            <!-- single trip -->
            <div
              :key="index + '_segment'"
              class="w-full flex flex-col md:flex-row items-center"
            >
              <img
                class="w-8 p-0 mt-3 md:mr-3"
                :src="`https://content.r9cdn.net/rimg/provider-logos/airlines/v/${segment.carrierCode}.png`"
              />
              <div class="w-full">
                <div
                  :key="index + '_segment'"
                  class="grid grid-rows-2 md:grid-cols-2 w-full md:justify-between justify-items-stretch"
                >
                  <div
                    class="m-0 leading-4 font-bold text-md md:flex flex-col md:flex-row items-center text-center w-full block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 inline md:mr-1 mb-1 text-warning"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{
                      prettyDate(segment.departure.at) +
                      " at " +
                      prettyTime(segment.departure.at)
                    }}
                    <br class="md:hidden" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 inline md:ml-4 md:mr-1 mb-1 text-success rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{
                      prettyDate(segment.departure.at) +
                      " at " +
                      prettyTime(segment.arrival.at)
                    }}
                  </div>

                  <p
                    class="m-0 leading-4 font-bold text-md justify-self-center md:justify-self-end"
                  >
                    {{ segment.duration.replace("PT", "") }}
                  </p>
                </div>
                <small
                  class="opacity-70 m-0 text-center md:text-left mt-2 block"
                  >{{ segment.departure.iataCode }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ segment.arrival.iataCode }} -

                  {{ flightOffersDictionaries.aircraft[segment.aircraft.code] }}
                </small>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- price -->
    <div
      class="md:w-1/3 w-full p-4 border-t md:border-l text-center md:text-left"
    >
      <h4 v-show="isBooking" class="m-0 text-primary">Total Price:</h4>
      <h4 class="m-0 text-primary">
        {{ item.price.grandTotal }} {{ item.price.currency }}
      </h4>
      <label
        v-show="!isBooking"
        :class="loading ? 'loading' : null"
        @click="saveFlight"
        for="booking-form"
        class="btn btn-accent w-full btn-sm"
      >
        Make a Booking
      </label>
    </div>
  </div>
</template>
<script>
export default {
  name: "FlightCard",
  props: {
    isBooking: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
    flightOffersDictionaries: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    prettyTime(raw) {
      return this.$dayjs(raw).format("HH:mm");
    },
    prettyDuration(d1, d2) {
      const date1 = this.$dayjs(d1);
      const date2 = this.$dayjs(d2);
      return date2.diff(date1, "h", true).toString().replace(".", ":");
    },
    prettyDate(raw) {
      return this.$dayjs(raw).format("ddd D MMM");
    },
    async saveFlight() {
      this.loading = true;
      const timeOut = setTimeout(async () => {
        try {
          await this.$store.dispatch("saveFlightInfo", { flight: this.item });
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      }, 2000);
    },
  },
};
</script>
<style lang=""></style>
