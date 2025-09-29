/**
 * Base composable for module forms. Includes common form logic/state.
 * 
 * @param moduleName The module name, e.g. 'users'
 * @param getDisplayName A function that returns the display name of the form, using the formData ref.
 * @param beforeSave A function that takes the form data and returns a FormData object to be sent to the server.
 * @param afterSave An optional function that is called after a successful save, with the saved record as argument.
 * @returns {
 * formData: Ref<Record<string, any>>; // The form data object
 * saveData: () => Promise<void>; // Function to save the form data
 * displayName: ComputedRef<string>; // The display name of the form
 * saveSuccess: Ref<boolean>; // Indicates if the last save was successful
 * }
 */
export const useForm = (
    moduleName: string, 
    getDisplayName: () => string,
    beforeSave: (r: Record<string, any>) => FormData,
    afterSave?: (r: Record<string, any>) => void) => {

    const formData = ref<Record<string, any>>({});
    const saveSuccess = ref(false);

    const displayName = computed(() => getDisplayName());
    
    onFormMounted(moduleName, formData);
    
    const saveData = async () => {
        const { startLoading, stopLoading } = useLoader();
        startLoading();
        saveSuccess.value = false;
        try {
            const payload = beforeSave(formData.value);
            if (!isNewForm()) {
                payload.append('_method', 'PUT'); // Laravel expects this for PUT requests
            }
            const response = await saveFormData(moduleName, payload);
            saveSuccess.value = true;
            if (afterSave) {
                afterSave(response);
            }
            stopLoading();
            if (isNewForm()) {
                // store the current data in the form data transfer
                formDataTransfer().setData(response.results.details);
                // navigate to the edit page
                navigateTo(`/${moduleName}/${response.results.details.id}`);
            }
            toast().success('Saved successfully');
        } catch (error: any) {
            if (error instanceof FormValidationError) {
                toast().error(error.error);
            } else {
                console.error(error);
                toast().error();
            }    
        }
    }

    return {
        formData,
        saveData,
        displayName,
        saveSuccess,
    };
}
