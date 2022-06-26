const qs = require('qs')

export const state = () => ({
  user_country: null,
  user_currency: null
});

export const getter = {
  getCounter(state) {
    return state.counter;
  },
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
    console.log(payload);
    const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults, max } = payload
    // make request
    return await this.$axios.get(`/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=${max}`)
  },

  async findAirports(ctx, payload) {

    return await this.$axios.get(`/v1/reference-data/locations/cities?keyword=${payload}&max=10&include=AIRPORTS`)

  }
};
