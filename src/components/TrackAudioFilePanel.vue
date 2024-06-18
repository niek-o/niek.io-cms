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
    <div class="w-full sm:w-96">
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
                <div
                    class="w-full h-60 p-6 border-dashed border-2 border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] flex flex-col gap-8 place-items-center justify-center"
                >
                    <p>Drag and drop audio file to here to upload.</p>
                    <i
                        class="pi pi-cloud-upload border-2 rounded-full p-6 border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] text-[var(--p-surface-200)] dark:text-[var(--p-surface-700)]"
                        style="font-size: 2.5rem"
                    ></i>
                </div>
            </template>

            <template
                #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }"
            >
                <div class="flex flex-col gap-8 pt-4">
                    <div v-if="files.length > 0">
                        <div class="flex flex-wrap gap-4">
                            <div
                                v-for="file of files"
                                :key="file.name + file.type + file.size"
                                class="w-full h-60 p-6 rounded-border flex flex-col border border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] items-center gap-4"
                            >
                                <div>
                                    <i class="pi pi-headphones border-2 rounded-full p-3" />
                                </div>
                                <span
                                    class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                                    >{{ file.name }}</span
                                >
                                <pv-badge class="w-full mt-2" value="Pending" severity="warn" />
                                <pv-button
                                    icon="pi pi-times"
                                    @click="removeFileCallback"
                                    class="w-full"
                                    label="Remove"
                                    outlined
                                    severity="danger"
                                />
                            </div>
                        </div>
                    </div>

                    <div v-if="uploadedFiles.length > 0">
                        <div class="flex flex-wrap gap-4">
                            <div
                                v-for="(file, index) of uploadedFiles"
                                :key="file.name + file.type + file.size"
                                class="w-full h-60 p-6 rounded-border flex flex-col border border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] items-center gap-4"
                            >
                                <div>
                                    <i class="pi pi-headphones border-2 rounded-full p-3" />
                                </div>
                                <span class="font-semibold text-ellipsis max-w-60">{{
                                    file.name
                                }}</span>
                                <pv-badge
                                    value="Completed"
                                    class="mt-2 w-full"
                                    severity="success"
                                />
                                <pv-button
                                    icon="pi pi-times"
                                    class="w-full"
                                    @click="removeUploadedFileCallback(index)"
                                    label="Remove"
                                    outlined
                                    severity="danger"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </pv-file-upload>
    </div>
</template>

<style scoped></style>
