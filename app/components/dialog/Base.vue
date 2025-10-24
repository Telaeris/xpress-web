<template>
    <TransitionRoot :show="$props.open">
        <Dialog @close="$emit('close')">
            <TransitionChild
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/20 z-20" aria-hidden="true"></div>
            </TransitionChild>
            <div class="fixed inset-0 flex w-screen items-center justify-center">
                <TransitionChild
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <DialogPanel class="w-md rounded-xl bg-white resize shadow-2xl z-30" v-slot="{ open }">
                        <DialogTitle 
                            class="text-2xl border-gray-300 p-4 pb-2"
                            :class="{ 'border-b': $props.bordered }"
                            >{{ props.title }}</DialogTitle>
                        <div class="font-normal px-4 py-2">
                            <slot></slot>
                        </div>
                        <!-- Button Panel -->
                        <div 
                            class="flex justify-end space-x-2 border-gray-300 p-4 pt-2 text-sm"
                            :class="{ 'border-t': props.bordered }"
                            >
                            <FormButton v-if="props.buttons === 'yesno'" 
                                text="Yes"
                                variant="primary"
                                @click="confirm"/>
                            <FormButton v-if="props.buttons === 'yesno'"
                                text="No"
                                variant="danger"
                                @click="$emit('close')"/>
                            <button v-if="props.buttons === 'savecancel'" 
                                class="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover"
                                @click="$emit('confirm')">Save</button>
                            <button v-if="props.buttons === 'savecancel'" 
                                class="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                                @click="$emit('close')">Cancel</button>
                            <button v-if="props.buttons === 'ok'" 
                                class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                @click="$emit('confirm')">OK</button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription, TransitionRoot, TransitionChild} from '@headlessui/vue';
type ModalButtonTypes = 'yesno' | 'savecancel' | 'ok';

type Props = {
    open: boolean,
    bordered?: boolean | false;
    title: string,
    description?: string
    buttons?: ModalButtonTypes,
    
}

const confirm = () => {
    console.log("confirm clicked");
    // emit confirm event
    emit('confirm');
}

type Emits = {
    (e: 'close'): void;
    (e: 'confirm'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

</script>
