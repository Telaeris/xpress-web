<script setup lang="ts">
const route = useRoute();
const formComponent: Component = getModuleFormComponent(route.params.module as string);
if (!formComponent) {
    throw new Error(`Form component for module '${route.params.module}' not found.`);
}
</script>

<template>
    <component :is="formComponent" v-if="formComponent" />
</template>
