<template>
    <FormBase :formData="formData" :breadCrumbTitle="displayName" 
        @cancelChanges="formData = $event" @saveChanges="saveData" :saveSuccess="saveSuccess">
        <FormGrid>
            <FormTextInput required label="Company Name" v-model="formData.name" 
                placeholder="Enter company name" colWidth="half"/>
            <FormTextInput label="Company Code" v-model="formData.code"
                placeholder="Enter company code" colWidth="half"/>
            <FormTextInput label="Address" v-model="formData.address"
                placeholder="Enter address" colWidth="half"/>
            <FormTextInput label="Address 2" v-model="formData.address_2"
                placeholder="Enter address line 2" colWidth="half"/>
            <FormTextInput label="City" v-model="formData.city"
                placeholder="Enter city" colWidth="quarter"/>
            <FormTextInput label="State" v-model="formData.state"
                placeholder="Enter state" colWidth="quarter"/>
            <FormTextInput label="Zip" v-model="formData.zip"
                placeholder="Enter zip code" colWidth="quarter"/>
            <FormTextInput label="Country" v-model="formData.country"
                placeholder="Enter country" colWidth="quarter"/>
            <FormTextInput label="Email" v-model="formData.email"
                placeholder="Enter email address" colWidth="half"/>
            <FormTextInput label="Contact" v-model="formData.contact"
                placeholder="Enter contact name" colWidth="half"/>
       </FormGrid>
    </FormBase>
</template>

<script setup lang="ts">
    const { formData, saveData, displayName, saveSuccess } = await useForm(
        'companies',
        () => {
            if (formData.value.name) {
                return formData.value.name;
            } else return "";
        },
        (formData) => {
            let fd: FormData = new FormData();
            fd.append('company_id', formData.id || '');
            fd.append('name', formData.name || '');
            fd.append('code', formData.code || '');
            fd.append('address', formData.address || '');
            fd.append('address_2', formData.address_2 || '');
            fd.append('city', formData.city || '');
            fd.append('state', formData.state || '');
            fd.append('zip', formData.zip || '');
            fd.append('country', formData.country || '');
            fd.append('email', formData.email || '');
            fd.append('contact', formData.contact || '');
            return fd;            
        }
    );
</script>
