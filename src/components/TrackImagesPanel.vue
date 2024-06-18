<script setup lang="ts">
import { useCDNManager } from "@/composables/useCDNManager";
import { useMobileSite } from "@/composables/useMobileSite";
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

const mobileSite = useMobileSite();
</script>

<template>
    <div class="flex flex-row gap-6">
        <span>Custom background?</span>
        <pv-toggle-switch v-model="customBackground" />
    </div>
    <div class="flex lg:flex-row flex-col gap-8 mt-8">
        <div class="w-full sm:w-96">
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
                    <div
                        class="w-full h-60 p-6 border-dashed border-2 border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] flex flex-col gap-8 place-items-center justify-center"
                    >
                        <p>Drag and drop album cover to here to upload.</p>
                        <i
                            class="pi pi-cloud-upload border-2 rounded-full p-6 border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] text-[var(--p-surface-200)] dark:text-[var(--p-surface-700)]"
                            style="font-size: 2.5rem"
                        ></i>
                    </div>
                </template>

                <template
                    #content="{
                        files,
                        uploadedFiles,
                        removeUploadedFileCallback,
                        removeFileCallback
                    }"
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
                                        <img
                                            role="presentation"
                                            :alt="file.name"
                                            :src="file.objectURL"
                                            width="100"
                                            height="50"
                                        />
                                    </div>

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
                                        <img
                                            role="presentation"
                                            :alt="file.name"
                                            :src="file.objectURL"
                                            width="100"
                                            height="50"
                                        />
                                    </div>
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

        <div
            :class="{
                invisible: !customBackground && !mobileSite.get(),
                hidden: !customBackground && mobileSite.get()
            }"
        >
            <div class="w-full sm:w-96">
                <pv-file-upload
                    @beforeSend="onBeforeSend"
                    :url="`${cdnUrl}/images/background/${track.id}`"
                    :multiple="false"
                    accept="image/jpeg"
                    auto
                    @upload="onUpload"
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
                            <p>Drag and drop background image to here to upload.</p>
                            <i
                                class="pi pi-cloud-upload border-2 rounded-full p-6 border-[var(--p-surface-200)] dark:border-[var(--p-surface-700)] text-[var(--p-surface-200)] dark:text-[var(--p-surface-700)]"
                                style="font-size: 2.5rem"
                            ></i>
                        </div>
                    </template>

                    <template
                        #content="{
                            files,
                            uploadedFiles,
                            removeUploadedFileCallback,
                            removeFileCallback
                        }"
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
                                            <div>
                                                <img
                                                    role="presentation"
                                                    :alt="file.name"
                                                    :src="file.objectURL"
                                                    width="100"
                                                    height="50"
                                                />
                                            </div>
                                        </div>
                                        <pv-badge
                                            class="w-full mt-2"
                                            value="Pending"
                                            severity="warn"
                                        />
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
                                            <div>
                                                <img
                                                    role="presentation"
                                                    :alt="file.name"
                                                    :src="file.objectURL"
                                                    width="100"
                                                    height="50"
                                                />
                                            </div>
                                        </div>
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
        </div>
    </div>
</template>

<style scoped></style>
