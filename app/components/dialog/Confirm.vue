<template>
    <Base :open="confirmDialogVisible" 
        title="Are you sure?" 
        :description="confirmDialogText" 
        buttons="yesno"
        @close="hideConfirmDialog"
        @confirm="confirmAction">
        <p class="text-gray-700">{{ confirmDialogText }}</p>
    </Base>
</template>

<script setup lang="ts">
    import Base from './Base.vue';
    const { confirmDialogVisible, confirmDialogText, confirmAction, hideConfirmDialog }
            = useConfirm();
</script>
