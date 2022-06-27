<template lang="">
  <div>
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <h3 class="m-0">Update your flight settings</h3>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Adults(12+ Yers)</span>
          </label>
          <input
            v-model="adults"
            type="range"
            min="1"
            max="9"
            value="1"
            class="range"
            step="1"
            name="adults"
          />
          <div class="w-full flex justify-between text-xs px-2">
            <template v-for="item in 9">
              <span>{{ item }}</span></template
            >
          </div>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Children(2-11 yrs)</span>
          </label>
          <input
            v-model="children"
            type="range"
            min="0"
            max="8"
            value="0"
            class="range"
            step="1"
            name="children"
          />
          <div class="w-full flex justify-between text-xs px-2">
            <template v-for="item in 9">
              <span>{{ item - 1 }}</span></template
            >
          </div>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Infants(under 2 yers)</span>
          </label>
          <input
            v-model="infants"
            type="range"
            min="0"
            max="6"
            value="0"
            class="range"
            step="1"
            name="infants"
          />
          <div class="w-full flex justify-between text-xs px-2">
            <template v-for="item in 7">
              <span>{{ item - 1 }}</span></template
            >
          </div>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Cabin Class</span>
          </label>
          <select
            v-model="travelClass"
            name="travelClass"
            class="select select-bordered w-full"
          >
            <option selected value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </div>

        <div class="modal-action">
          <label @click="emitEvent" for="my-modal" class="btn">Save</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BookingSettings",
  data() {
    return {
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "ECONOMY",
    };
  },
  methods: {
    emitEvent() {
      this.$emit("UpdateBookingSettings", {
        adults: Number(this.adults),
        children: Number(this.children),
        infants: Number(this.infants),
        travelClass: this.travelClass,
      });
    },
  },
};
</script>
<style lang=""></style>
