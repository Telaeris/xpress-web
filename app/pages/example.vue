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
                colWidth="quarter" type="date" :max="'2025-09-30'"/>
            <FormCheckboxGroup colWidth="quarter">
                <FormCheckbox label="Option 1" name="option_1" v-model="formData.option_1"/>
                <FormCheckbox label="Option 2" name="option_2" v-model="formData.option_2"/>
            </FormCheckboxGroup>
            <FormComboBox label="MuliSelect Zones" colWidth="half" search="zones"
                placeholder="Select Zones" multiple/>
            <FormTabs :tabs="['Table', 'CheckBoxes', 'Buttons']" :selectedIndex="0">
                <template #table>
                    <div class="col-span-full">
                        <TableInline 
                            :data="tableData"
                            :columns="tableColumns"
                            :sortable="false"
                            :paginated="false"
                            :has-more-data="false"
                        />
                    </div>
                </template>
                <template #checkboxes>
                    <FormGrid>
                        <FormCheckboxGroup colWidth="half">
                            <FormCheckbox label="Option 1" name="option_1" v-model="formData.option_1"/>
                            <FormCheckbox label="Option 2" name="option_2" v-model="formData.option_2"/>
                        </FormCheckboxGroup>
                    </FormGrid>
                </template>
                <template #buttons>
                    <div class="flex gap-2">
                        <FormButton text="Primary" variant="primary" />
                        <FormButton text="Success" variant="success" />
                        <FormButton text="Danger" variant="danger" />
                    </div>
                    <div class="flex gap-2 mt-2">
                        <FormButton text="Hollow" variant="primary" hollow/>
                        <FormButton text="Hollow" variant="success" hollow/>
                        <FormButton text="Hollow" variant="danger" hollow/>
                    </div>
                </template>
            </FormTabs>
        </FormGrid>
    </FormBase>
</template>

<script setup lang="ts">
import { type ColumnDef } from '@tanstack/vue-table';

useHead({
    title: 'Component Examples'
});

const formData = ref<Record<string, any>>({
    text_1: '',
    text_2: '',
    combo_1: {
        id: null,
        name: null,
    },
    date: '',
});

const tableData = ref<Array<Record<string, any>>>([
    {firstName: 'John', lastName: 'Doe', age: 30},
    {firstName: 'Jane', lastName: 'Smith', age: 25},
    {firstName: 'Alice', lastName: 'Johnson', age: 28},
    {firstName: 'Bob', lastName: 'Brown', age: 35},
]);

const tableColumns = ref<ColumnDef<Record<string, any>, any>[]>([
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'age', header: 'Age', cell: info => info.getValue() + ' years old'},
])
</script>
