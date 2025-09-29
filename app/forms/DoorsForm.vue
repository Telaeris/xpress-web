<template>
    <FormBase :formData="formData" :breadCrumbTitle="displayName" 
        @cancelChanges="formData = $event" @saveChanges="saveData" :saveSuccess="saveSuccess">
        <FormGrid>
            <FormTextInput required label="Name" v-model="formData.name" 
                placeholder="Enter company name" colWidth="third"/>
            <FormComboBox label="Start Zone" v-model="formData.zone_1"
                colWidth="third" search="zones" placeholder="Select start zone"/>
            <FormComboBox label="End Zone" v-model="formData.zone_2"
                colWidth="third" search="zones" placeholder="Select end zone"/>
       </FormGrid>
    </FormBase>
</template>

<script setup lang="ts">
    const { formData, saveData, displayName, saveSuccess } = await useForm(
        'doors',
        () => {
            if (formData.value.name) {
                return formData.value.name;
            } else return "";
        },
        (formData) => {
            let fd: FormData = new FormData();
            fd.append('door_id', formData.id || '');
            fd.append('name', formData.name || '');
            fd.append('zone_1_id', formData.zone_1?.id || '');
            fd.append('zone_2_id', formData.zone_2?.id || '');
            return fd;            
        }
    );
</script>
