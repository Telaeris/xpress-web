<template>
    <Loader :active="loading" :container-ref="null" class="w-full h-full"/>
    <div class="bg-dark-blue w-screen h-screen content-center relative">
        <img :src="getMainLogoPath" class="m-auto mb-6" alt="XPT Logo" />
        <div class="w-100 h-min bg-white rounded-lg m-auto p-6 shadow-xl/20">
            <form @submit.prevent="handleLogin" class="flex flex-col gap-3">
                <h2 class="text-2xl/10 font-normal">
                    Login
                </h2>
                <LoginTextField placeholder="Username/Email" v-model="formData.username"/>
                <LoginTextField placeholder="Password" v-model="formData.password"/>

                <div class="flex justify-around">
                    <div class="inline-flex items-center">
                        <input type="checkbox" id="remember_me" v-model="formData.remember_me" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                        <label for="remember_me" class="ml-2 block text-md text-center text-gray-900 font-normal">
                            Remember Me
                        </label>
                    </div>
                    <button class="font-normal bg-main-blue text-white p-2 rounded-md cursor-pointer" type="submit">Login</button>
                </div>
            </form>
        </div>
        <p class="text-center text-white mt-6 font-normal text-xs">© {{ currentYear }} Telaeris, Inc. All rights reserved.</p>
    </div>
</template>

<script setup lang="ts">
// remove the layout from the login page
definePageMeta({
    layout: false
});

// bring in the theme composable
const { getMainLogoPath } = useTheme();

// container reference for loader
const currentYear = useState('currentYear', () => new Date().getFullYear());

// set the loader state
const loading = ref(false);

// set the formData state
const formData = ref({
    username: '',
    password: '',
    remember_me: false
});

const pWordMessage = ref('Please enter a password.');

// set the validation states for username and password
const uNameValid = useState('uNameValid', () => true);
const pWordValid = useState('pWordValid', () => true);
const formValid = computed(() => {
    return uNameValid.value && pWordValid.value;
});

// set the alert validation state
const alertLoginError = useState('alertLoginError', () => false);
const attemptsRemaining = useState('attemptsRemaining', () => 3);

// handle the login button click
const handleLogin = async () => {
    uNameValid.value = formData.value.username.trim() !== '';
    pWordValid.value = formData.value.password.trim() !== '';

    if (formData.value.password.length < 8 && formData.value.password.trim() !== '') {
        pWordValid.value = false;
        pWordMessage.value = 'Password must be at least 8 characters long.';
    } else {
        pWordMessage.value = 'Please enter a password.';
    }

    console.log(formValid.value);
    if (!formValid.value) { return; }

    loading.value = true;
    const response = await $fetch('/core/login', {
        method: 'POST',
        body: formData.value,
        parseResponse: JSON.parse,
    });

    useUserSidebarStore().setMenuItems((response as Record<string, any>).features);

    // get the CSRF token
    await getCSRF();

    console.log(response);
    loading.value = false;

    // using nuxt, redirect to the dashboard page
    navigateTo('/users');
};

const showLoginValidationError = () => {
    attemptsRemaining.value--;
    alertLoginError.value = true;
    setTimeout(() => {
        alertLoginError.value = false;
    }, 5000);
}
</script>
