<script setup lang="ts">
import BaseDataPanel from "@/components/BaseDataPanel.vue";
import SoundcloudIcon from "@/components/icons/SoundcloudIcon.vue";
import SpotifyIcon from "@/components/icons/SpotifyIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";
import TrackAudioFilePanel from "@/components/TrackAudioFilePanel.vue";
import TrackColorsPanel from "@/components/TrackColorsPanel.vue";
import TrackDataPanel from "@/components/TrackDataPanel.vue";
import TrackImagesPanel from "@/components/TrackImagesPanel.vue";
import TrackLinksPanel from "@/components/TrackLinksPanel.vue";
import TrackReviewPanel from "@/components/TrackReviewPanel.vue";
import { useCDNManager } from "@/composables/useCDNManager";
import { useAuthStore } from "@/stores/authStore";
import { useTrackAudioFileStatusStore } from "@/stores/newAudioFileStatusStore";
import { useTrackImageStatusStore } from "@/stores/newTrackImageStatusStore";
import { useTrackStore } from "@/stores/newTrackStore";
import { CreateTrackDto } from "@/utils/CreateTrackDto";
import { UpdateTrackDto } from "@/utils/UpdateTrackDto";
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

const editTrack = async (id: string, track: CreateTrackDto) => {
    try {
        await cdnManager.editTrack(id, new UpdateTrackDto(track));
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

const publishTrack = async (id: string) => {
    await cdnManager.publishTrack(id);

    await cdnManager.getTracks();
};

const deleteTrack = async (id: string) => {
    await cdnManager.deleteTrack(id);

    await cdnManager.getTracks();
};

const newTrackDialog = ref(false);
const editTrackDialog = ref(false);

const openEditTrack = (track: CreateTrackDto) => {
    trackStore.set(track);
    editTrackDialog.value = true;
};

onMounted(() => {
    cdnManager.getTracks();
});

const reviewComponentKey = ref(0);

const resetAll = () => {
    trackStore.reset();
    newTrackDialog.value = false;
    editTrackDialog.value = false;
};

const username = ref("");
const password = ref("");

const auth = useAuthStore();

const login = () => {
    auth.login(username.value, password.value);

    if (auth.get()) {
        toast.add({
            severity: "success",
            summary: "Logged in successfully",
            life: 3000
        });
    } else {
        toast.add({
            severity: "error",
            summary: "Logged in failed",
            detail: "Incorrect username/password combination",
            life: 3000
        });
    }
};
</script>

<template>
    <div class="w-screen h-screen flex justify-center place-items-center" v-if="!auth.get()">
        <div class="flex flex-col gap-4">
            <label for="username">Username</label>
            <pv-input-text id="username" v-model="username" />
            <label for="password">Password</label>
            <pv-password
                id="password"
                toggle-mask
                :feedback="false"
                v-model="password"
                @keydown.exact.enter="login"
            />
            <pv-button label="Log in" icon="pi pi-person" @click="login"></pv-button>
        </div>
    </div>
    <div class="p-20" v-else>
        <pv-toolbar>
            <template #start>
                <pv-button label="New" icon="pi pi-plus" @click="newTrackDialog = true"></pv-button>
            </template>
        </pv-toolbar>
        <pv-data-table :value="cdnManager.tracks">
            <pv-column header="ID" field="id" style="width: 15%" />
            <pv-column header="Title" field="title" style="width: 50%" />
            <pv-column header="Socials" field="links" style="width: 15%">
                <template #body="{ data, field }">
                    <div class="flex flex-row gap-2">
                        <span v-for="link in data[field]" :key="link.platform">
                            <youtube-icon class="w-8 h-8" v-if="link.platform === 'youtube'" />
                            <soundcloud-icon
                                class="w-8 h-8"
                                v-else-if="link.platform === 'soundcloud'"
                            />
                            <spotify-icon class="w-8 h-8" v-else-if="link.platform === 'spotify'" />
                        </span>
                    </div>
                </template>
            </pv-column>
            <pv-column header="Visible" field="visible" style="width: 10%">
                <template #body="{ data, field }">
                    <span @click="publishTrack(data.id)">
                        <i v-if="data[field]" class="pi pi-eye text-2xl text-green-600" />
                        <i v-else class="pi pi-eye-slash text-2xl text-red-600" />
                    </span>
                </template>
            </pv-column>
            <pv-column header="Edit" style="width: 5%">
                <template #body="{ data }">
                    <pv-button
                        outlined
                        icon="pi pi-pencil"
                        label="Edit"
                        @click="openEditTrack(data)"
                    ></pv-button>
                </template>
            </pv-column>
            <pv-column header="Delete" style="width: 5%">
                <template #body="{ data }">
                    <pv-button
                        outlined
                        severity="danger"
                        icon="pi pi-trash"
                        label="Delete"
                        @click="deleteTrack(data.id)"
                    ></pv-button>
                </template>
            </pv-column>
        </pv-data-table>
    </div>

    <pv-dialog
        v-model:visible="newTrackDialog"
        modal
        header="New track"
        class="w-8/12"
        style="height: 80%"
        @close="resetAll"
    >
        <template #default>
            <pv-stepper class="w-full" linear @step-change="() => (reviewComponentKey += 1)">
                <pv-stepper-panel header="Step 1: Track data">
                    <template #content="{ nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step1ButtonDisabled"
                            @next-callback="nextCallback"
                        >
                            <track-data-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 2: Track links">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step2ButtonDisabled"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-links-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 3: Album cover">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step3ButtonDisabled"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-images-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 4: Colors">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step4ButtonDisabled"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-colors-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 5: Audio file">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step5ButtonDisabled"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-audio-file-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 6: Review">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            v-if="submittedState === 'no'"
                            :next-button-disabled="true"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
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
                            :next-button-disabled="true"
                            @next-callback="nextCallback"
                            :prev-button-shown="false"
                            @prev-callback="prevCallback"
                        >
                            <div
                                class="flex flex-col h-full w-full justify-center items-center gap-6"
                            >
                                <i class="pi pi-check-circle text-8xl text-green-500"></i>
                                <h1 class="text-4xl">Track uploaded succesfully</h1>
                            </div>

                            <template #nextButton>
                                <pv-button
                                    label="Close"
                                    icon="pi pi-times"
                                    @click="resetAll"
                                ></pv-button>
                            </template>
                        </base-data-panel>

                        <base-data-panel
                            v-else-if="submittedState === 'error'"
                            :next-button-disabled="true"
                            @next-callback="nextCallback"
                            :prev-button-shown="false"
                            @prev-callback="prevCallback"
                        >
                            <div
                                class="flex flex-col h-full w-full justify-center items-center gap-6"
                            >
                                <i class="pi pi-times-circle text-8xl text-red-500"></i>
                                <h1>Something went wrong while uploading the track</h1>
                            </div>

                            <template #nextButton>
                                <pv-button
                                    label="Close"
                                    icon="pi pi-times"
                                    @click="resetAll"
                                ></pv-button>
                            </template>
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>
            </pv-stepper>
        </template>
    </pv-dialog>

    <pv-dialog
        v-model:visible="editTrackDialog"
        modal
        header="Edit track"
        class="w-8/12"
        style="height: 80%"
        @close="resetAll"
    >
        <template #default>
            <pv-stepper class="w-full" @step-change="() => (reviewComponentKey += 1)">
                <pv-stepper-panel header="Step 1: Track data">
                    <template #content="{ nextCallback }">
                        <base-data-panel @next-callback="nextCallback">
                            <track-data-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 2: Track links">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-links-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 3: Album cover">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-images-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 4: Colors">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-colors-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 5: Audio file">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            :next-button-disabled="step5ButtonDisabled"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-audio-file-panel />
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>

                <pv-stepper-panel header="Step 6: Review">
                    <template #content="{ prevCallback, nextCallback }">
                        <base-data-panel
                            v-if="submittedState === 'no'"
                            @next-callback="nextCallback"
                            :prev-button-shown="true"
                            @prev-callback="prevCallback"
                        >
                            <track-review-panel :key="reviewComponentKey" />

                            <template #nextButton>
                                <pv-button
                                    label="Submit"
                                    icon="pi pi-check"
                                    @click="editTrack(trackStore.get().id, trackStore.get())"
                                ></pv-button>
                            </template>
                        </base-data-panel>

                        <base-data-panel
                            v-else-if="submittedState === 'success'"
                            @next-callback="nextCallback"
                            :prev-button-shown="false"
                            @prev-callback="prevCallback"
                        >
                            <div
                                class="flex flex-col h-full w-full justify-center items-center gap-6"
                            >
                                <i class="pi pi-check-circle text-8xl text-green-500"></i>
                                <h1 class="text-4xl">Track uploaded succesfully</h1>
                            </div>

                            <template #nextButton>
                                <pv-button
                                    label="Close"
                                    icon="pi pi-times"
                                    @click="resetAll"
                                ></pv-button>
                            </template>
                        </base-data-panel>

                        <base-data-panel
                            v-else-if="submittedState === 'error'"
                            @next-callback="nextCallback"
                            :prev-button-shown="false"
                            @prev-callback="prevCallback"
                        >
                            <div
                                class="flex flex-col h-full w-full justify-center items-center gap-6"
                            >
                                <i class="pi pi-times-circle text-8xl text-red-500"></i>
                                <h1>Something went wrong while uploading the track</h1>
                            </div>

                            <template #nextButton>
                                <pv-button
                                    label="Close"
                                    icon="pi pi-times"
                                    @click="resetAll"
                                ></pv-button>
                            </template>
                        </base-data-panel>
                    </template>
                </pv-stepper-panel>
            </pv-stepper>
        </template>
    </pv-dialog>

    <pv-toast />
</template>

<style scoped></style>
