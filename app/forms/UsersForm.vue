<template>
    <FormBase :formData="formData" :breadCrumbTitle="displayName" 
        @cancelChanges="formData = $event" @saveChanges="saveData" :saveSuccess="saveSuccess">
        <FormGrid>
            <FormTextInput required label="First Name" v-model="formData.first_name" 
                placeholder="Enter first name" colWidth="quarter"/>
            <FormTextInput required label="Last Name" v-model="formData.last_name"
                placeholder="Enter last name" colWidth="quarter"/>
            <FormTextInput label="Email" v-model="formData.email" 
                placeholder="Enter email address" colWidth="half"/>
            <FormTextInput label="Employee ID" v-model="formData.employee_no" 
                placeholder="Enter employee ID" colWidth="half"/>
            <FormComboBox label="Company" v-model="formData.company" 
                placeholder="Select a company" colWidth="half" search="companies"/>
            <FormComboBox label="Current Zone" v-model="formData.current_zone" 
                placeholder="Select a zone" colWidth="half" search="user-zones"/>
            <FormTextInput v-if="isNewForm()" label="Badge" v-model="formData.badge_no"
                placeholder="Enter badge number" colWidth="half"/>
        </FormGrid>
    </FormBase>
</template>

<script setup lang="ts">
    const { formData, saveData, displayName, saveSuccess } = await useForm(
        'users',
        () => {
            if (formData.value.first_name && formData.value.last_name) {
                return `${formData.value.first_name} ${formData.value.last_name}`;
            } else return "";
        },
        (formData) => {
            let fd: FormData = new FormData();
            fd.append('user_id', formData.id || '');
            fd.append('first_name', formData.first_name || '');
            fd.append('last_name', formData.last_name || '');
            fd.append('email', formData.email || '');
            fd.append('employee_id', formData.employee_no || '');
            fd.append('company_id', formData.company?.id || '');
            fd.append('zone_id', formData.current_zone?.id || '');
            if (isNewForm()) {
                fd.append('badge_no', formData.badge_no || '');
            }
            return fd;            
        }
    );
</script>
