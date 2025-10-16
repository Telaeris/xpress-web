/**
 * Use this in all form instances to handle data fetching and state management.
 */
export const onFormMounted = (moduleName: string, formData: Ref<Record<string, any> | null>, extraActions: Function | null = null) => {
    const route = useRoute();
    const { startLoading, stopLoading } = useLoader();
    onMounted(async () => {
        // If it's a new form, don't fetch any data
        if (isNewForm()) {
            return;
        }

        // Check to see if data was already fetched from the table
        const { isDataSet, getData } = formDataTransfer();
        if (isDataSet()) {
            formData.value = getData() as Record<string, any>;
            return;
        }

        startLoading();
        // Fetch the data from the API
        formData.value = await getFormData(moduleName, route.params.id as string);
        
        // If there are any extra actions to be performed after data is loaded
        if (extraActions) {
            await extraActions();
            stopLoading();
        } else {
            stopLoading();
        }
    });
}

/**
 * Use this to define the base functionality of saving a form.
 */
export const saveFormData = async (moduleName: string, formData: FormData) => {
    let url = `/core/${moduleName}`;
    if (!isNewForm()) {
        url += `/${useRoute().params.id}`;
    }

    useLoader().startLoading();
    return await formPost<Record<string, any>>(url, {
        body: formData,
        onResponseError({ request, response, options }) {
            if (response.status === 422 || response.status === 400) {
                // handle validations in here
                throw new FormValidationError(response._data.message || 'Invalid data provided.');
            }
        },
        onResponse() {
            useLoader().stopLoading();
        }
    });
}

// TODO: Refactor this to link to each field
export class FormValidationError extends Error {
    error: string;
    constructor(message: string) {
        super(message);
        this.error = message;
        this.name = "ValidationError";
    }
}

interface FormResponse {
    key: string;
    message: string;
    results: {
        details: Record<string, any>;
        extra: Object;
    }
    timestamp: string;
}

export const NEW_FORM_NAME = 'create';

export const addNewForm = (moduleName: string) => {
    navigateTo(`/${moduleName}/create`);
};

export const isNewForm = () => {
    return useRoute().params?.id && useRoute().params.id === NEW_FORM_NAME;
}

export const getFormData = async(moduleName: string, id: string) => {
    const response = await apiFetch<FormResponse>(`${moduleName}/${id}`);
    return response.results.details;
}

export const afterFormCreated = (moduleName: string, id: number) => {
    window.location.href = `/${moduleName}/${id}`; // using href to force a full reload of the
}

export const loadModuleFormWithData = async(moduleName: string, id: number) => {
    // only grab startLoading and stopLoading to avoid unnecessary re-renders
    useLoader().startLoading();

    const response = await getFormData(moduleName, id.toString());

    // Set the form data to be transferred to the form page
    formDataTransfer().setData(response);

    useLoader().stopLoading();
    navigateTo(`/${moduleName}/${id}`);
}

export const formDataTransfer = () => {
    const formData = useState<Record<string, any> | null>('formData', () => null);

    const setData = (data: Record<string, any>) => {
        formData.value = data;
    }

    const isDataSet = () => {
        return formData.value !== null;
    }

    const getData = () => {
        const data = formData.value;
        formData.value = null;
        return data;
    }

    return {
        setData,
        isDataSet,
        getData,
    }
}

export const formBreadCrumbTitle = (props: any) => {
    const bct = ref<string>(props.breadCrumbTitle);
    watch(() => props.breadCrumbTitle, (newVal) => {
        bct.value = newVal;
    });
    return computed(() => {
        if (isNewForm()) {
            return 'Create New';
        }
        return bct.value != "" ? bct.value : '...';
    });
}

export const showForm = (formData: Ref<Record<string, any>>) => {
    return computed(() => {
        if (isNewForm()) {
            return true;
        }
        return Object.keys(formData.value).length > 0;
    });
}

export const deleteRecord = async(moduleName: string, ids: number[]) => {
    if (isNewForm() || !useRoute().params.id) {
        toast().error('Cannot delete an unsaved record.');
        return;
    }
    withConfirm('Are you sure you want to delete this record? This action cannot be undone.', async () => {
        useLoader().startLoading();
        await apiFetch(`${moduleName}/delete`, {
            method: 'DELETE',
            body: {
                ids: ids.join(','),
            }
        });
        useLoader().stopLoading();
        // If we are on the form page, redirect to the list page
        if (!isNewForm() && useRoute().params.id) {
            navigateTo(`/${moduleName}`);
        } else {
            // Otherwise, just reload the current page
            window.location.reload();
        }
    });
}
 
