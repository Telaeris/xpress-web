export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/' && false /* TODO: Replace with auth call */) {
        return navigateTo('/profile');
    } else {
        return navigateTo('/login');
    }
})
