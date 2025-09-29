/**
 * Sets a global loading state. But the loader component must be added to the layout.
 * 
 * @returns {
 * isLoading: Ref<boolean>; // Reactive loading state
 * startLoading: () => void; // Function to set loading state to true
 * stopLoading: () => void; // Function to set loading state to false
 * }
 */
export const useLoader = () => {
    const isLoading = useState<boolean>('isLoading', () => false);

    const startLoading = () => {
        isLoading.value = true;
    }

    const stopLoading = () => {
        isLoading.value = false;
    }

    return {
        isLoading,
        startLoading,
        stopLoading,
    }
}
