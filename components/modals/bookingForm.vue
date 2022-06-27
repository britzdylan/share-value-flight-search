<template>
  <div>
    <input type="checkbox" id="booking-form" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box max-w-none w-full md:w-max md:min-w-[600px]">
        <label for="booking-form" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
        <ul class="md:steps w-full hidden">
          <template v-for="item in adults">
            <li
              :class="item <= step ? 'step-primary' : null"
              :key="'adult_' + item"
              class="step"
            >
              Adult {{ item }}
            </li>
          </template>
          <template v-for="item in children">
            <li
              :class="item + adults <= step ? 'step-primary' : null"
              :key="'child_' + item"
              class="step"
            >
              Child {{ item }}
            </li>
          </template>
          <template v-for="item in infants">
            <li
              :class="item + adults + children <= step ? 'step-primary' : null"
              :key="'infant_' + item"
              class="step"
            >
              Infant {{ item }}
            </li>
          </template>
          <li
            :class="this.totalForms + 1 <= step ? 'step-primary' : null"
            class="step"
          >
            Payment
          </li>
        </ul>
        <template v-for="(item, index) in totalForms">
          <ValidationObserver
            v-show="item == step"
            :key="'form' + index"
            v-slot="{ handleSubmit }"
          >
            <form
              autocomplete="on"
              class="w-full"
              @submit.prevent="handleSubmit(nextStep)"
            >
              <ValidationProvider
                v-slot="{ errors, classes }"
                name="First Name"
                rules="required"
                class="w-full"
              >
                <div class="form-control w-full relative">
                  <label class="label">
                    <span class="label-text">First Name *</span>
                  </label>
                  <input
                    :class="classes"
                    v-model="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    class="input input-bordered input-primary w-full"
                  />
                  <label class="label">
                    <span class="label-text-alt">{{ errors[0] }}</span>
                  </label>
                </div>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors, classes }"
                name="Last Name"
                rules="required"
                class="w-full"
              >
                <div class="form-control w-full relative">
                  <label class="label">
                    <span class="label-text">Last Name *</span>
                  </label>
                  <input
                    :class="classes"
                    v-model="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    class="input input-bordered input-primary w-full"
                  />
                  <label class="label">
                    <span class="label-text-alt">{{ errors[0] }}</span>
                  </label>
                </div>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors, classes }"
                name="Email"
                rules="required"
                class="w-full"
                v-if="item <= 1"
              >
                <div class="form-control w-full relative">
                  <label class="label">
                    <span class="label-text">Email *</span>
                  </label>
                  <input
                    :class="classes"
                    v-model="email"
                    name="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    class="input input-bordered input-primary w-full"
                  />
                  <label class="label">
                    <span class="label-text-alt">{{ errors[0] }}</span>
                  </label>
                </div>
              </ValidationProvider>
              <div class="modal-action flex flex-row items-center w-full">
                <button
                  v-show="step > 1"
                  @click="goBack"
                  for="my-modal"
                  class="btn btn-ghost"
                >
                  Back
                </button>
                <button for="my-modal" class="btn btn-primary ml-auto block">
                  Next!
                </button>
              </div>
            </form>
          </ValidationObserver>
        </template>
        <div v-show="this.step == this.totalForms + 1" class="text-center">
          <h2>Complete your Payment</h2>
          <img src="/payment.svg" alt="" class="w-1/2 mx-auto my-4" />
          <button
            :class="loading ? 'loading' : null"
            @click="submitBooking"
            class="btn btn-lg btn-primary w-2/3"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BookingSettings from "~/components/modals/bookingSettings";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "BookingForm",
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    BookingSettings: BookingSettings,
  },
  props: {
    adults: {
      type: Number,
      default: 1,
    },
    children: {
      type: Number,
      default: 0,
    },
    infants: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      step: 1,
      gender: "",
      first_name: "",
      last_name: "",
      email: "",
      passengerDetails: [],
      loading: false,
    };
  },
  computed: {
    totalForms() {
      return this.adults + this.children + this.infants;
    },
  },
  methods: {
    nextStep() {
      let data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
      };
      if (this.step > 1) {
        delete data.email;
      }
      this.passengerDetails.push(data);
      this.first_name = "";
      this.last_name = "";
      this.email = "";
      this.step++;
    },
    goBack(e) {
      e.preventDefault();
      this.step--;
      let data = this.passengerDetails[this.step - 1];
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.email = data.email;
    },
    submitBooking() {
      this.loading = true;
      let id = uuidv4();
      const timeOut = setTimeout(() => {
        try {
          this.$store.dispatch("saveBookinginformation", {
            passengerDetails: this.passengerDetails,
            id: id,
          });
          this.loading = false;
          this.$router.replace(`/booking/${id}`);
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
