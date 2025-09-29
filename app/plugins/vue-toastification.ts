import Toast, { POSITION, type PluginOptions } from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
    const options: PluginOptions = {
        transition: "Vue-Toastification__fade",
        maxToasts: 2,
        newestOnTop: true,
        position: POSITION.BOTTOM_RIGHT,
        timeout: 3000,
        icon: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        showCloseButtonOnHover: false,
        bodyClassName: "text-lg!"
    }

    nuxtApp.vueApp.use(Toast, options);
});
