<template>
    <div class="flex flex-col h-screen">
        <TopBarWrapper>
            <template #title>
                <NuxtLink :to="`/${moduleName}`" class="hover:underline">
                    {{ moduleDisplayName }}
                </NuxtLink> > 
                {{ breadCrumbTitle }}
            </template>
            <template #leftActions>
                <div v-if="dirty">
                    <FontAwesomeIcon icon="fa-solid fa-floppy-disk" size="xl" class="text-label cursor-pointer"
                        @click="emit('saveChanges')"/>
                    <FontAwesomeIcon icon="fa-solid fa-xmark-circle" size="xl" class="text-red-500 cursor-pointer"
                        @click="cancelChanges"/>
                </div>
                <div v-else-if="!isNewForm()">
                    <FontAwesomeIcon icon="fa-solid fa-plus-circle" size="lg" class="text-green-600 cursor-pointer"
                        @click="addNewForm(moduleName)"/>
                    <FontAwesomeIcon icon="fa-solid fa-trash" size="lg" class="text-red-500 cursor-pointer"
                        @click="deleteRecord(moduleName, [formData.id as number])"/>
                </div>
            </template>
        </TopBarWrapper>
        <div class="flex-1 relative" ref="containerRef">
            <Loader :active="useLoader().isLoading.value" :container-ref="containerRef"/>
            <form class="p-4 font-normal" v-if="formVisible">
                <slot></slot>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    const props = defineProps<{
        breadCrumbTitle: string;
        formData: Record<string, any>;
        saveSuccess?: boolean;
    }>();

    type Emits = {
         (e: 'cancelChanges', value: Record<string, any>): boolean;
         (e: 'saveChanges'): void;
    }

    const emit = defineEmits<Emits>();

    const containerRef = useTemplateRef<HTMLElement | null>('containerRef');
    const moduleName = computed(() => useRoute().params.module as string);
    const breadCrumbTitle = formBreadCrumbTitle(props);

    // shallow copy form data prop
    const formData = ref<Record<string, any>>({...props.formData});
    
    // automatically update formData when props change
    // and track dirty state
    let originalFormValue: Record<string, any> = {};
    const dirty = ref<boolean>(false);
    const saveSuccess = ref<boolean>(false);
    watch(() => props.saveSuccess, (newVal) => {
        if (newVal) {
            // update original value to current form data
            dirty.value = false;
            saveSuccess.value = false;
        }
    });
    watch(() => props.formData, (newVal) => {
        formData.value = newVal;

        // set original value for dirtiness check
        if (Object.keys(originalFormValue).length === 0) {
            console.log('setting originalFormValue');
            originalFormValue = {...newVal};
            return;
        }

        // compare object attributes to set dirtiness
        dirty.value = JSON.stringify(newVal) !== JSON.stringify(originalFormValue);
    }, { deep: true });



    const cancelChanges = () => {
        emit('cancelChanges', {...originalFormValue});
    };
    
    const moduleDisplayName = useModuleDisplayName(moduleName);
    const formVisible = showForm(formData);
</script>
