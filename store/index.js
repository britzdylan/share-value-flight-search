const qs = require('qs')

export const state = () => ({
  user_country: null,
  user_currency: null,
  flightOffers: {
  },
  bookingInfo: {}
});

export const getters = {
  getUserCurrencyCode(state) {
    return state.user_currency;
  },
  getFlightOffers(state) {
    return state.flightOffers.data
  },
  getFlightOffersMeta(state) {
    return state.flightOffers.meta
  },
  getFlightOffersDictionaries(state) {
    return state.flightOffers.dictionaries ? state.flightOffers.dictionaries : JSON.parse(window.localStorage.getItem('dictionaries'))
  },
  getPassenegerDetails(state) {
    return state.bookingInfo.passengerDetails
  },
  getFlightBookingDetails(state) {
    return state.bookingInfo.flight
  }
};

export const mutations = {
  increment(state) {
    state.counter++;
  },
  setUserLocation(state, payload) {
    state.user_country = payload
  },
  setUserCurrency(state, payload) {
    state.user_currency = Object.keys(payload)[0]
  },
  setOffersSearchResponse(state, payload) {
    window.localStorage.setItem('dictionaries', JSON.stringify(payload.dictionaries))
    state.flightOffers = payload
  },
  updateBookingInfo(state, payload) {
    state.bookingInfo = { ...payload, ...state.bookingInfo }
    payload.id ? window.localStorage.setItem(payload.id, JSON.stringify(state.bookingInfo)) : null
  }
};

export const actions = {
  async getUserLocation(ctx) {
    fetch('http://ip-api.com/json/')
      .then(response => response.json())
      .then(data => {
        ctx.dispatch('getUserCurrency', data.countryCode)
        ctx.commit('setUserLocation', data.countryCode)
      });
  },
  async getUserCurrency(ctx, payload) {
    fetch(`https://restcountries.com/v3.1/alpha/${payload}`)
      .then(response => response.json())
      .then(data => {
        ctx.commit('setUserCurrency', data[0].currencies)
        return true
      });
  },
  async getToken(ctx) {
    delete this.$axios.defaults.headers.common['Authorization']
    try {
      let res = await this.$axios({
        method: 'post', url: '/v1/security/oauth2/token', data: qs.stringify({ grant_type: 'client_credentials', client_id: 'kKMWisLVDGIJmLo8YrMtFOhZB1IwIXsC', client_secret: 'cygjiKX8rdkJSVlB' })
      })
      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
      return res
    } catch (error) {
      console.log(error);
      return error
    }

  },
  async searchFlightOffers(ctx, payload) {
    const res = await this.$axios.get(`/v2/shopping/flight-offers`, {
      params: { ...payload }
    })
    ctx.commit('setOffersSearchResponse', res.data)
    return res
  },
  async findAirports(ctx, payload) {

    return await this.$axios.get(`/v1/reference-data/locations/cities?keyword=${payload}&max=10&include=AIRPORTS`)

  },
  async saveBookinginformation(ctx, payload) {
    await ctx.commit('updateBookingInfo', payload)
  },
  async saveFlightInfo(ctx, payload) {
    await ctx.commit('updateBookingInfo', payload)
  },
  async getBooking(ctx, id) {
    const payload = JSON.parse(window.localStorage.getItem(id))
    await ctx.commit('updateBookingInfo', payload)
  }
};
