import { ofetch } from 'ofetch'

/**
 * Use this base request to ensure app-wide consistencies.
 */
export const apiFetch = ofetch.create({
    baseURL: '/core',
    headers: {
        accept: 'application/json',
    },
    parseResponse: JSON.parse,
    onResponseError({ request, response, options }) {
        useLoader().stopLoading();
        // Handle global errors here
        if (response.status === 401) {
            // For example, redirect to login page on unauthorized
            navigateTo('/login');
        }

        // You can throw the error to be caught in individual requests if needed
        console.error(response);
        throw new Error(`Request failed with status ${response.status}`);
    }
});

export const formPost = ofetch.create({
    baseURL: '/core',
    method: 'POST',
    headers: {
        accept: 'application/json',
    },
    parseResponse: JSON.parse,
});
