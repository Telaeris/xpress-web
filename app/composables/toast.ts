import { useToast } from "vue-toastification"

export const toast = () => ({
    info: (message: string) => {
        useToast().info(message);
    },
    success: (message: string) => {
        useToast().success(message);
    },
    error: (message?: string) => {
        useToast().error(message ?? 'An error occurred. Please try again.');
    },
    warning: (message: string) => {
        useToast().warning(message);
    },
});
