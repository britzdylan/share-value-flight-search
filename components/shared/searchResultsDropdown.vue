<template lang="">
  <div class="dropdown dropdown-open absolute top-24">
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 divide-y"
    >
      <template v-for="item in searchResults">
        <template v-for="(ap, index) in item.relationships">
          <li
            @click="emitEvent(item, airPorts[ap.id])"
            :key="index + '_' + item.name"
          >
            <div class="flex flex-row items-start leading-4">
              <p class="m-0">{{ ap.id }}</p>
              <div>
                <p class="m-0 leading-4">
                  {{ airPorts[ap.id].name }}
                </p>
                <small class="text-neutral"
                  >{{ item.name }}, {{ item.address.countryCode }}
                </small>
              </div>
            </div>
          </li>
        </template>
      </template>
      <li v-show="searchResults.length == 0">
        <small>{{
          searchingInput ? "searching..." : "Search for a city name"
        }}</small>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "SearchResultsDropdown",
  props: {
    searchResults: {
      type: Array,
      required: true,
    },
    airPorts: {
      type: Object,
      required: true,
    },
    ctx: {
      type: String,
      required: true,
    },
    searchingInput: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    emitEvent(item, ap) {
      this.$emit("itemSelected", [this.ctx, item, ap]);
    },
  },
};
</script>
<style lang=""></style>
