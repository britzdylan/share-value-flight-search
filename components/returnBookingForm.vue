<template>
  <section class="py-6 px-0">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        autocomplete="off"
        class="w-full"
        @submit.prevent="handleSubmit(searchFlights)"
      >
        <div class="md:flex flex-row w-full items-end justify-between">
          <!-- from destination -->
          <ValidationProvider
            v-slot="{ classes }"
            name="From Destionation"
            rules="required"
            class="w-full"
          >
            <div class="form-control w-full relative">
              <label class="label">
                <span class="label-text">From</span>
              </label>
              <input
                :class="classes"
                v-model="from"
                @focus="setCtx"
                @input="search"
                name="originLocationCode"
                type="text"
                placeholder="City Name"
                class="input focus:outline-none input-bordered input-primary w-full md:rounded-r-none"
              />

              <SearchResultsDropdown
                v-show="ctx == 'originLocationCode'"
                :searchResults="searchResults"
                :airPorts="airPorts"
                :ctx="ctx"
                :searchingInput="searchingInput"
                @itemSelected="setLocationInfo"
              />
            </div>
          </ValidationProvider>
          <!-- To destination -->
          <ValidationProvider
            class="w-full"
            v-slot="{ classes }"
            name="To Destionation"
            rules="required"
          >
            <div class="form-control w-full relative">
              <label class="label">
                <span class="label-text">To:</span>
              </label>
              <input
                :class="classes"
                v-model="to"
                @input="search"
                @focus="setCtx"
                name="destinationLocationCode"
                type="text"
                placeholder="City Name"
                class="input focus:outline-none input-bordered input-primary w-full md:rounded-none"
              />

              <SearchResultsDropdown
                v-show="ctx == 'destinationLocationCode'"
                :searchingInput="searchingInput"
                :searchResults="searchResults"
                :airPorts="airPorts"
                :ctx="ctx"
                @itemSelected="setLocationInfo"
              />
            </div>
          </ValidationProvider>
          <!-- departure date -->
          <ValidationProvider
            v-slot="{ classes }"
            name="Departure Date"
            rules="required"
          >
            <div class="form-control md:w-min">
              <label class="label">
                <span class="label-text">Departure</span>
              </label>
              <input
                :class="classes"
                v-model="departureDate"
                type="date"
                placeholder="Departure"
                class="input focus:outline-none input-bordered input-primary md:max-w-xs md:rounded-none"
              />
            </div>
          </ValidationProvider>
          <!-- return date -->
          <ValidationProvider
            v-slot="{ classes }"
            name="Return Date"
            rules="required"
            v-if="returnFlight"
          >
            <div class="form-control md:w-min">
              <label class="label">
                <span class="label-text">Return</span>
              </label>
              <input
                :class="classes"
                v-model="returnDate"
                type="date"
                placeholder="Return"
                class="input focus:outline-none input-bordered input-primary md:max-w-xs md:rounded-none"
              />
            </div>
          </ValidationProvider>
          <!-- submit -->
          <button
            :class="loading ? 'loading' : null"
            class="btn btn-primary md:rounded-l-none w-full md:w-auto mt-6 md:mt-0"
          >
            {{ !loading ? "Search Flights" : "searching..." }}
          </button>
        </div>
      </form>
    </ValidationObserver>
    <div class="flex flex-row flex-wrap items-center md:justify-end py-2">
      <template v-for="(item, key) in flightSettings">
        <div :key="'badge_' + key" class="badge badge-accent badge-md ml-2 mt-2 md:mt-0">
          {{ key.toUpperCase() + " : " + item }}
        </div>
      </template>
    </div>
    <BookingSettings @UpdateBookingSettings="setFlightInfo" />
    <BookingForm :adults="adults" :children="children" :infants="infants" />
  </section>
</template>
<script>
import searchResultsDropdown from "/components/shared/searchResultsDropdown";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BookingSettings from "~/components/modals/bookingSettings";
import BookingForm from "~/components/modals/bookingForm";
export default {
  name: "returnBookingForm",
  components: {
    BookingForm: BookingForm,
    SearchResultsDropdown: searchResultsDropdown,
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    BookingSettings: BookingSettings,
  },
  props: {
    returnFlight: {
      type: Boolean,
    },
  },
  data() {
    return {
      searchingInput: false,
      loading: false,
      from: "",
      to: "",
      originLocationCode: "",
      destinationLocationCode: "",
      departureDate: "",
      returnDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "ECONOMY",
      timeoutQuery: null,
      searchResults: [],
      airPorts: {},
      ctx: "",
    };
  },
  computed: {
    currencyCode() {
      return this.$store.getters.getUserCurrencyCode;
    },
    flightSettings() {
      return {
        adults: this.adults,
        children: this.children,
        infants: this.infants,
        travelClass: this.travelClass,
      };
    },
  },
  methods: {
    setCtx(e) {
      this.ctx = e.target.name;
    },

    async search(e) {
      e.preventDefault();
      if (e.target.value.length < 4) return;
      this.searchingInput = true;
      if (this.timeoutQuery) {
        clearTimeout(this.timeoutQuery);
      }

      this.timeoutQuery = setTimeout(async () => {
        let res = await this.$store.dispatch("findAirports", e.target.value);
        this.searchResults = [...res.data.data];
        this.airPorts = { ...res.data.included.airports };
        this.searchingInput = false;
      }, 500);
    },

    async searchFlights() {
      this.loading = true;
      const payload = {
        originLocationCode: this.originLocationCode,
        destinationLocationCode: this.destinationLocationCode,
        departureDate: this.departureDate,
        returnDate: this.returnDate,
        adults: this.adults,
        children: this.children,
        infants: this.infants,
        travelClass: this.travelClass,
        currencyCode: this.currencyCode,
        max: 10,
      };
      if (!this.returnFlight) {
        delete payload.returnDate;
      }
      try {
        await this.$store.dispatch("searchFlightOffers", payload);
        this.loading = false;
      } catch (error) {
        alert("Oops something went wrong");
      }
    },

    async setLocationInfo(e) {
      console.log(e);
      this[e[0]] = e[2].iataCode;
      this.searchResults = [];
      this.airPorts = {};
      document.activeElement.blur();
      switch (this.ctx) {
        case "originLocationCode":
          this.from = `${e[2].iataCode} - ${e[2].name}, ${e[1].name}, ${e[2].address.countryCode}`;
          break;

        case "destinationLocationCode":
          this.to = `${e[2].iataCode} - ${e[2].name}, ${e[1].name}, ${e[2].address.countryCode}`;

          break;
      }
      this.ctx = "";
    },
    async setFlightInfo(e) {
      this.adults = e.adults;
      this.children = e.children;
      this.infants = e.infants;
      this.travelClass = e.travelClass;
    },
    log(e) {
      console.log(e);
    },
  },
};
</script>
<style lang=""></style>
