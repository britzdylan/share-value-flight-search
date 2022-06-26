import { extend, configure } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

configure({
    classes: {
        valid: 'is-valid',
        invalid: 'input-error',
        dirty: ['is-dirty', 'input-error'], // multiple classes per flag!
    },
})

extend('required', {
    ...required,
    message: '{_field_} is required',
})





