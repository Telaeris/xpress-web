// middleware/auth.global.ts
let hasRunOnce = false

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on initial load (when 'from' is undefined or hasn't run yet)
    if (hasRunOnce) {
        return
    }

    hasRunOnce = true

    // Define public routes that don't require auth
    const publicRoutes = ['/login', '/']

    if (publicRoutes.includes(to.path)) return;

    // since we cannot read the auth cookie, we check it via an API call
    try {
        await apiFetch('/login', {onResponseError: () => { return; }});
    } catch (error) {
        toast().error('Your session has expired. Redirected to login...');
        return navigateTo('/login');
    }
});
