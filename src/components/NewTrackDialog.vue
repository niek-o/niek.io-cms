<script setup lang="ts">
import BaseDataPanel from "@/components/BaseDataPanel.vue";
import TrackAudioFilePanel from "@/components/TrackAudioFilePanel.vue";
import TrackColorsPanel from "@/components/TrackColorsPanel.vue";
import TrackDataPanel from "@/components/TrackDataPanel.vue";
import TrackImagesPanel from "@/components/TrackImagesPanel.vue";
import TrackLinksPanel from "@/components/TrackLinksPanel.vue";
import TrackReviewPanel from "@/components/TrackReviewPanel.vue";
import { useCDNManager } from "@/composables/useCDNManager";
import { useTrackAudioFileStatusStore } from "@/stores/newAudioFileStatusStore";
import { useTrackImageStatusStore } from "@/stores/newTrackImageStatusStore";
import { useTrackStore } from "@/stores/newTrackStore";
import { CreateTrackDto } from "@/utils/CreateTrackDto";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref } from "vue";

const toast = useToast();

const trackStore = useTrackStore();
const trackImageStatusStore = useTrackImageStatusStore();
const trackAudioFileStatusStore = useTrackAudioFileStatusStore();

const step1ButtonDisabled = computed(() => {
    const track = trackStore.get();

    return track.title === "" || track.subtitle === "" || track.id === "";
});

const step2ButtonDisabled = computed(() => {
    const track = trackStore.get();

    return track.links.length === 0;
});

const step3ButtonDisabled = computed(() => {
    return !trackImageStatusStore.get();
});

const step4ButtonDisabled = computed(() => {
    const track = trackStore.get();

    return track.backgroundColor === "" || track.accentColor === "";
});

const step5ButtonDisabled = computed(() => {
    return !trackAudioFileStatusStore.get();
});

const submittedState = ref<"no" | "error" | "success">("no");

const cdnManager = useCDNManager();

const submitTrack = async () => {
    const track = new CreateTrackDto(trackStore.get());

    try {
        await cdnManager.submitTrack(track);
        submittedState.value = "success";

        toast.add({
            severity: "success",
            summary: "Track uploaded successfully",
            detail: track.title,
            life: 3000
        });
    } catch (e) {
        submittedState.value = "error";

        toast.add({
            severity: "error",
            summary: "Track upload failed",
            detail: e,
            life: 10000
        });
    }

    await cdnManager.getTracks();
};

const newTrackDialog = defineModel({ required: true, type: Boolean });

onMounted(() => {
    cdnManager.getTracks();
});

const reviewComponentKey = ref(0);

defineEmits(["close"]);
</script>

<template>
    <pv-dialog
        v-model:visible="newTrackDialog"
        modal
        header="New track"
        class="w-8/12"
        style="height: 80%"
        @hide="$emit('close')"
    >
        <pv-stepper value="1" class="w-full" linear @step-change="() => (reviewComponentKey += 1)">
            <pv-step-list>
                <pv-step value="1">Step 1: Track data</pv-step>
                <pv-step value="2">Step 2: Track links</pv-step>
                <pv-step value="3">Step 3: Album cover</pv-step>
                <pv-step value="4">Step 4: Colors</pv-step>
                <pv-step value="5">Step 5: Audio file</pv-step>
                <pv-step value="6">Step 6: Review</pv-step>
            </pv-step-list>

            <pv-step-panels>
                <pv-step-panel v-slot="{ activateCallback }" value="1">
                    <base-data-panel
                        :next-button-disabled="step1ButtonDisabled"
                        @next-callback="activateCallback('2')"
                    >
                        <track-data-panel />
                    </base-data-panel>
                </pv-step-panel>

                <pv-step-panel v-slot="{ activateCallback }" value="2">
                    <base-data-panel
                        :next-button-disabled="step2ButtonDisabled"
                        @next-callback="activateCallback('3')"
                        :prev-button-shown="true"
                        @prev-callback="activateCallback('1')"
                    >
                        <track-links-panel />
                    </base-data-panel>
                </pv-step-panel>

                <pv-step-panel v-slot="{ activateCallback }" value="3">
                    <base-data-panel
                        :next-button-disabled="step3ButtonDisabled"
                        @next-callback="activateCallback('4')"
                        :prev-button-shown="true"
                        @prev-callback="activateCallback('2')"
                    >
                        <track-images-panel />
                    </base-data-panel>
                </pv-step-panel>

                <pv-step-panel v-slot="{ activateCallback }" value="4">
                    <base-data-panel
                        :next-button-disabled="step4ButtonDisabled"
                        @next-callback="activateCallback('5')"
                        :prev-button-shown="true"
                        @prev-callback="activateCallback('3')"
                    >
                        <track-colors-panel />
                    </base-data-panel>
                </pv-step-panel>

                <pv-step-panel v-slot="{ activateCallback }" value="5">
                    <base-data-panel
                        :next-button-disabled="step5ButtonDisabled"
                        @next-callback="activateCallback('6')"
                        :prev-button-shown="true"
                        @prev-callback="activateCallback('4')"
                    >
                        <track-audio-file-panel />
                    </base-data-panel>
                </pv-step-panel>

                <pv-step-panel v-slot="{ activateCallback }" value="6">
                    <base-data-panel
                        v-if="submittedState === 'no'"
                        :prev-button-shown="true"
                        @prev-callback="activateCallback('5')"
                    >
                        <track-review-panel :key="reviewComponentKey" />

                        <template #nextButton>
                            <pv-button
                                label="Submit"
                                icon="pi pi-check"
                                @click="submitTrack"
                            ></pv-button>
                        </template>
                    </base-data-panel>

                    <base-data-panel
                        v-else-if="submittedState === 'success'"
                        :prev-button-shown="false"
                    >
                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">
                            <i
                                class="pi pi-check-circle text-green-500"
                                style="font-size: 8rem"
                            ></i>
                            <h1 class="text-4xl">Track uploaded successfully</h1>
                        </div>

                        <template #nextButton>
                            <pv-button label="Close" icon="pi pi-times"></pv-button>
                        </template>
                    </base-data-panel>

                    <base-data-panel
                        v-else-if="submittedState === 'error'"
                        :prev-button-shown="false"
                    >
                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">
                            <i class="pi pi-times-circle text-red-500" style="font-size: 8rem"></i>
                            <h1>Something went wrong while uploading the track</h1>
                        </div>

                        <template #nextButton>
                            <pv-button label="Close" icon="pi pi-times"></pv-button>
                        </template>
                    </base-data-panel>
                </pv-step-panel>
            </pv-step-panels>
        </pv-stepper>
    </pv-dialog>
</template>

<style scoped></style>
