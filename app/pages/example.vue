<!-- This is to give a place to demonstrate all components -->

<template>
    <FormBase :formData="formData" breadCrumbTitle="Example Form" 
        :saveSuccess="true">
        <FormGrid>
            <FormTextInput label="Example Input" v-model="formData.text_1" 
                placeholder="Enter example input" colWidth="quarter"/>
            <FormTextInput label="Another Input" v-model="formData.text_2" 
                placeholder="Enter another input" colWidth="quarter"/>
            <FormComboBox label="Ex. Select (Users)" v-model="formData.combo_1" 
                placeholder="Select an option" colWidth="half" search="users"/>
            <FormTextInput label="Example Date" v-model="formData.date" 
                colWidth="quarter" type="date"/>
        </FormGrid>
    </FormBase>
</template>

<script setup lang="ts">
const formData = ref<Record<string, any>>({
    text_1: '',
    text_2: '',
    combo_1: {
        id: null,
        name: null,
    },
    date: '',
});
</script>
