const qs = require('qs')
export default function ({ $axios, error: nuxtError }) {

    $axios.onError(async (err) => {
        const code = err.response.status
        if (code == 401) {
            delete $axios.defaults.headers.common['Authorization']
            let res = await $axios({
                method: 'post', url: '/v1/security/oauth2/token', data: qs.stringify({ grant_type: 'client_credentials', client_id: 'kKMWisLVDGIJmLo8YrMtFOhZB1IwIXsC', client_secret: 'cygjiKX8rdkJSVlB' })
            })
            $axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
            return { status: 401, retry: true }
        }

        if (code >= 500) {
            nuxtError({
                statusCode: err.response.status,
                message: err.message,
            });
            return Promise.resolve(false);
        }

    })
}