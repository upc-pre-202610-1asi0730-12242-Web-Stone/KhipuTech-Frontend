import SignInForm from './sign-in-form.vue'

export default [
    { path: '/sign-in', component: SignInForm },
    { path: '/', redirect: '/sign-in' }
]