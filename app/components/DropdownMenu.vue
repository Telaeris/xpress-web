<template>
    <div class="absolute border border-gray-300 shadow-md mt-2" :class="class">
        <ul class="bg-white text-black">
            <li v-for="(option, index) in options" :key="index" @click="option.action" class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-stone-700">
                <FontAwesomeIcon v-if="option.icon" :icon="option.icon" class="mr-2"/>
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    interface Option {
        icon?: string; // Optional icon property
        label: string;
        action?: () => void;
    }

    defineProps({
        class: {
            type: String,
            default: '',
        },
        options: {
            type: Array<Option>,
            required: true,
        }
    });
</script>
