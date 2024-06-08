<script setup lang="ts">
import { useCDNManager } from "@/composables/useCDNManager";
import { useTrackAudioFileStatusStore } from "@/stores/newAudioFileStatusStore";
import { useTrackStore } from "@/stores/newTrackStore";
import type { FileUploadBeforeSendEvent, FileUploadUploadEvent } from "primevue/fileupload";
import { useToast } from "primevue/usetoast";

const newTrackStore = useTrackStore();
const newTrackImageStatusStore = useTrackAudioFileStatusStore();

const toast = useToast();

const track = newTrackStore.get();

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

const cdnUrl = import.meta.env.VITE_CDN_URL;
</script>

<template>
    <div class="w-8/12">
        <pv-file-upload
            @before-send="onBeforeSend"
            @upload="onUpload"
            :url="`${cdnUrl}/audio/${track.id}`"
            :multiple="false"
            accept="audio/*"
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
                <p>Drag and drop audio file to here to upload.</p>
            </template>
        </pv-file-upload>
    </div>
</template>

<style scoped></style>
