import { ofetch } from 'ofetch'

/**
 * Use this base request to ensure app-wide consistencies.
 */
export const apiFetch = ofetch.create({
    baseURL: '/core',
    headers: {
        accept: 'application/json',
    },
    credentials: 'include',
    parseResponse: JSON.parse,
    async onResponseError({ request, response, options }) {
        useLoader().stopLoading();
        // Handle global errors here
        if (response.status === 401) {
            // For example, redirect to login page on unauthorized
            navigateTo('/login');
            return;
        }

        // handle CSRF token expiration
        if (response.status === 419) {
            await getCSRF();
            // Retry the original request
            await ofetch(request, options);
            return;
        }

        // You can throw the error to be caught in individual requests if needed
        console.error(response);
        throw new Error(`Request failed with status ${response.status}`);
    }
});

export const getCSRF = async () => {
    const response = await apiFetch('/csrf');
    useCSRF().setToken(response.csrf_token);
}

export const formPost = ofetch.create({
    baseURL: '/core',
    method: 'POST',
    headers: {
        accept: 'application/json',
    },
    async onRequest({ options }) {
        options.headers = {
            ...(options.headers),
            'X-CSRF-TOKEN': await useCSRF().getToken(),
        } as Headers;
    },
    parseResponse: JSON.parse,
});
