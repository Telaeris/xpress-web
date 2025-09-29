import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('on-click-outside', {
        mounted(el, binding, vnode) {
            el.__clickOutsideHandler__ = (event: MouseEvent) => {
                if (!(el === event.target || el.contains(event.target as Node))) {
                    // Emit a custom Vue event on the component
                    const vm = vnode.component
                    if (vm) {
                        vm.emit('click-outside', event)
                    }
                    // Also call the binding function directly if provided
                    if (typeof binding.value === 'function') {
                        binding.value(event)
                    }
                }
            }
            document.addEventListener('click', el.__clickOutsideHandler__)
        },
        unmounted(el) {
            document.removeEventListener('click', el.__clickOutsideHandler__)
            delete el.__clickOutsideHandler__
        },
    })
})
