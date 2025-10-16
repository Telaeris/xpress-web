export const useCSRF = () => {
    const csrfToken = useState('csrfToken', () => '');

    const setToken = (token: string) => {
        console.log("Setting CSRF token:", token);
        csrfToken.value = token;

        // set in localStorage for persistence across reloads
        localStorage.setItem('csrfToken', token);
    }

    const getToken = async () => {
        if (!csrfToken.value) {
            // try to load from localStorage
            const token = localStorage.getItem('csrfToken');
            if (token) {
                csrfToken.value = token;
            }
            return token;
        }

        // refetch if token is expired
        await getCSRF();
        return csrfToken.value;
    }

    const clearToken = () => {
        csrfToken.value = '';
        localStorage.removeItem('csrfToken');
    }

    return {
        setToken,
        getToken,
        clearToken,
    }
}
