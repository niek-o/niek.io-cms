<script setup lang="ts">
import { useCDNManager } from "@/composables/useCDNManager";
import { useTrackImageStatusStore } from "@/stores/newTrackImageStatusStore";
import { useTrackStore } from "@/stores/newTrackStore";
import type { FileUploadBeforeSendEvent, FileUploadUploadEvent } from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import { ref, watch } from "vue";

const newTrackStore = useTrackStore();
const newTrackImageStatusStore = useTrackImageStatusStore();

const toast = useToast();

const track = newTrackStore.get();

const customBackground = ref(false);

const cdnManager = useCDNManager();

const onBeforeSend = (event: FileUploadBeforeSendEvent) => {
    const data = event.formData.get("null");

    if (!data) {
        return;
    }

    event.xhr.setRequestHeader("x-api-key", import.meta.env.VITE_API_KEY);

    event.formData.delete("null");

    event.formData.set("file", data);
};

const onUpload = (event: FileUploadUploadEvent) => {
    const fileName = (event.files as File[])[0].name;

    newTrackImageStatusStore.set(true);

    cdnManager.invalidateCache();

    toast.add({
        severity: "success",
        summary: "Image uploaded successfully",
        detail: fileName,
        life: 3000
    });
};

watch(customBackground, (value) => {
    track.backgroundImage = value;
});

const cdnUrl = import.meta.env.VITE_CDN_URL;
</script>

<template>
    <div class="w-8/12">
        <pv-file-upload
            @before-send="onBeforeSend"
            @upload="onUpload"
            :url="`${cdnUrl}/images/cover/${track.id}`"
            :multiple="false"
            accept="image/jpeg"
            auto
        >
            <template #header="{ chooseCallback, uploadedFiles }">
                <div class="w-full">
                    <pv-button
                        :disabled="uploadedFiles.length > 0"
                        @click="chooseCallback"
                        icon="pi pi-upload"
                        label="Upload"
                    >
                    </pv-button>
                </div>
            </template>
            <template #empty>
                <p>Drag and drop album cover to here to upload.</p>
            </template>
        </pv-file-upload>

        <div class="mt-6 flex flex-col gap-2">
            <div class="flex flex-row gap-6">
                <span>Use custom background image</span>
                <pv-input-switch v-model="customBackground" />
            </div>
            <div :class="{ invisible: !customBackground }">
                <pv-file-upload
                    @beforeSend="onBeforeSend"
                    :url="`${cdnUrl}/images/background/${track.id}`"
                    :multiple="false"
                    accept="image/jpeg"
                    auto
                >
                    <template #empty>
                        <p>Drag and drop background image to here to upload.</p>
                    </template>
                </pv-file-upload>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
