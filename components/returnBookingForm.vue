<template>
  <section class="py-6 px-0">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        autocomplete="off"
        class="w-full"
        @submit.prevent="handleSubmit(searchFlights)"
      >
        <div class="flex flex-row w-full items-end justify-between">
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
                class="input focus:outline-none input-bordered input-primary w-full rounded-tr-none rounded-br-none"
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
                class="input focus:outline-none input-bordered input-primary w-full rounded-none"
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
            <div class="form-control w-min">
              <label class="label">
                <span class="label-text">Departure</span>
              </label>
              <input
                :class="classes"
                v-model="departureDate"
                type="date"
                placeholder="Departure"
                class="input focus:outline-none input-bordered input-primary max-w-xs rounded-none"
              />
            </div>
          </ValidationProvider>
          <!-- return date -->
          <ValidationProvider
            v-slot="{ classes }"
            name="Return Date"
            rules="required"
          >
            <div class="form-control w-min">
              <label class="label">
                <span class="label-text">Return</span>
              </label>
              <input
                :class="classes"
                v-model="returnDate"
                type="date"
                placeholder="Return"
                class="input focus:outline-none input-bordered input-primary max-w-xs rounded-none"
              />
            </div>
          </ValidationProvider>
          <!-- submit -->
          <button
            :class="loading ? 'loading' : null"
            class="btn btn-primary rounded-l-none"
          >
            {{ !loading ? "Search Flights" : "searching..." }}
          </button>
        </div>
      </form>
    </ValidationObserver>
    <BookingSettings @UpdateBookingSettings="setFlightInfo" />
  </section>
</template>
<script>
import SearchResultsDropdown from "/components/shared/searchResultsDropdown";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BookingSettings from "~/components/modals/bookingSettings";

export default {
  name: "returnBookingForm",
  components: {
    SearchResultsDropdown,
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    BookingSettings: BookingSettings,
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
      children: 1,
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
      try {
        let res = await this.$store.dispatch("searchFlightOffers", payload);
        this.loading = false;
      } catch (error) {
        alert("Oops something went wrong");
      }
    },

    async setLocationInfo(e) {
      console.log(e);
      this[e[0]] = e[1].iataCode;
      this.searchResults = [];
      this.airPorts = {};
      document.activeElement.blur();
      switch (this.ctx) {
        case "originLocationCode":
          this.from = `${e[1].iataCode} - ${e[2].name}, ${e[1].name}, ${e[2].address.countryCode}`;
          break;

        case "destinationLocationCode":
          this.to = `${e[1].iataCode} - ${e[2].name}, ${e[1].name}, ${e[2].address.countryCode}`;

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
