<script setup lang="ts">
import EditTrackDialog from "@/components/EditTrackDialog.vue";
import SoundcloudIcon from "@/components/icons/SoundcloudIcon.vue";
import SpotifyIcon from "@/components/icons/SpotifyIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";
import NewTrackDialog from "@/components/NewTrackDialog.vue";
import { useCDNManager } from "@/composables/useCDNManager";
import { useMobileSite } from "@/composables/useMobileSite";
import { useAuthStore } from "@/stores/authStore";
import { useTrackStore } from "@/stores/newTrackStore";
import { CreateTrackDto } from "@/utils/CreateTrackDto";
import { useWindowSize } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onMounted, ref } from "vue";

const mobileSite = useMobileSite();

onBeforeMount(() => {
    calculateMobileSite();

    window.addEventListener("resize", () => {
        calculateMobileSite();
    });
});

const calculateMobileSite = () => {
    const { width } = useWindowSize();

    mobileSite.set(width.value);
};

const toast = useToast();

const trackStore = useTrackStore();

const cdnManager = useCDNManager();

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

const resetAll = () => {
    newTrackDialog.value = false;
    editTrackDialog.value = false;

    trackStore.reset();
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
    <div v-else>
        <div class="p-20" v-if="!mobileSite.get()">
            <pv-toolbar>
                <template #start>
                    <pv-button
                        label="New"
                        icon="pi pi-plus"
                        @click="newTrackDialog = true"
                    ></pv-button>
                </template>
            </pv-toolbar>
            <pv-data-table :value="cdnManager.tracks">
                <pv-column header="ID" field="id" style="width: 15%" />
                <pv-column header="Title" field="title" style="width: 50%" />
                <pv-column header="Socials" field="links" style="width: 15%">
                    <template #body="{ data, field }">
                        <div class="flex flex-row gap-2">
                            <span v-for="link in data[field]" :key="link.platform">
                                <a
                                    :href="link.url"
                                    :aria-label="`${data.title} on ${link.platform}`"
                                >
                                    <youtube-icon
                                        class="w-8 h-8"
                                        v-if="link.platform === 'youtube'"
                                    />
                                    <soundcloud-icon
                                        v-else-if="link.platform === 'soundcloud'"
                                        class="w-8 h-8"
                                    />
                                    <spotify-icon
                                        class="w-8 h-8"
                                        v-else-if="link.platform === 'spotify'"
                                    />
                                </a>
                            </span>
                        </div>
                    </template>
                </pv-column>
                <pv-column header="Visible" field="visible" style="width: 10%">
                    <template #body="{ data, field }">
                        <span @click="publishTrack(data.id)">
                            <i
                                style="font-size: 1.5rem"
                                v-if="data[field]"
                                class="pi pi-eye text-green-600"
                            />
                            <i
                                style="font-size: 1.5rem"
                                v-else
                                class="pi pi-eye-slash text-red-600"
                            />
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
        <div class="p-10" v-else>
            <pv-toolbar class="mb-10">
                <template #start>
                    <pv-button
                        label="New"
                        icon="pi pi-plus"
                        @click="newTrackDialog = true"
                    ></pv-button>
                </template>
            </pv-toolbar>

            <div class="flex flex-col gap-16 place-items-center">
                <div v-for="track in cdnManager.tracks" :key="track.id" class="w-full">
                    <pv-card>
                        <template #content>
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-1">
                                    <h1 class="font-bold">Title</h1>
                                    <h1>{{ track.title }}</h1>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <h1 class="font-bold">ID</h1>
                                    <h1>{{ track.id }}</h1>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <h1 class="font-bold">Links</h1>
                                    <div class="flex flex-row gap-4">
                                        <span v-for="link in track.links" :key="link.platform">
                                            <a
                                                :href="link.url"
                                                :aria-label="`${track.title} on ${link.platform}`"
                                            >
                                                <youtube-icon
                                                    class="w-10 h-10"
                                                    v-if="link.platform === 'youtube'"
                                                />
                                                <soundcloud-icon
                                                    v-else-if="link.platform === 'soundcloud'"
                                                    class="w-10 h-10"
                                                />
                                                <spotify-icon
                                                    class="w-10 h-10"
                                                    v-else-if="link.platform === 'spotify'"
                                                />
                                            </a>
                                        </span>
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <h1 class="font-bold">Visibility</h1>

                                    <span @click="publishTrack(track.id)">
                                        <i
                                            style="font-size: 2rem"
                                            v-if="track.visible"
                                            class="pi pi-eye text-green-600"
                                        />
                                        <i
                                            style="font-size: 2rem"
                                            v-else
                                            class="pi pi-eye-slash text-red-600"
                                        />
                                    </span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <h1 class="font-bold">Actions</h1>
                                    <div class="flex flex-row gap-4">
                                        <pv-button
                                            outlined
                                            icon="pi pi-pencil"
                                            label="Edit"
                                            @click="openEditTrack(track)"
                                        ></pv-button>

                                        <pv-button
                                            outlined
                                            severity="danger"
                                            icon="pi pi-trash"
                                            label="Delete"
                                            @click="deleteTrack(track.id)"
                                        ></pv-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </pv-card>
                </div>
            </div>

            <pv-data-table :value="cdnManager.tracks">
                <pv-column header="ID" field="id" style="width: 15%" />
                <pv-column header="Title" field="title" style="width: 50%" />
                <pv-column header="Socials" field="links" style="width: 15%">
                    <template #body="{ data, field }">
                        <div class="flex flex-row gap-2">
                            <span v-for="link in data[field]" :key="link.platform">
                                <a
                                    :href="link.url"
                                    :aria-label="`${data.title} on ${link.platform}`"
                                >
                                    <youtube-icon
                                        class="w-8 h-8"
                                        v-if="link.platform === 'youtube'"
                                    />
                                    <soundcloud-icon
                                        v-else-if="link.platform === 'soundcloud'"
                                        class="w-8 h-8"
                                    />
                                    <spotify-icon
                                        class="w-8 h-8"
                                        v-else-if="link.platform === 'spotify'"
                                    />
                                </a>
                            </span>
                        </div>
                    </template>
                </pv-column>
                <pv-column header="Visible" field="visible" style="width: 10%">
                    <template #body="{ data, field }">
                        <span @click="publishTrack(data.id)">
                            <i
                                style="font-size: 1.5rem"
                                v-if="data[field]"
                                class="pi pi-eye text-green-600"
                            />
                            <i
                                style="font-size: 1.5rem"
                                v-else
                                class="pi pi-eye-slash text-red-600"
                            />
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
    </div>

    <!--    <pv-dialog-->
    <!--        v-model:visible="newTrackDialog"-->
    <!--        modal-->
    <!--        header="New track"-->
    <!--        class="w-8/12"-->
    <!--        style="height: 80%"-->
    <!--        @close="resetAll"-->
    <!--    >-->
    <!--        <pv-stepper value="1" class="w-full" linear @step-change="() => (reviewComponentKey += 1)">-->
    <!--            <pv-step-list>-->
    <!--                <pv-step value="1">Step 1: Track data</pv-step>-->
    <!--                <pv-step value="2">Step 2: Track links</pv-step>-->
    <!--                <pv-step value="3">Step 3: Album cover</pv-step>-->
    <!--                <pv-step value="4">Step 4: Colors</pv-step>-->
    <!--                <pv-step value="5">Step 5: Audio file</pv-step>-->
    <!--                <pv-step value="6">Step 6: Review</pv-step>-->
    <!--            </pv-step-list>-->

    <!--            <pv-step-panels>-->
    <!--                <pv-step-panel v-slot="{ activateCallback }" value="1">-->
    <!--                    <base-data-panel-->
    <!--                        :next-button-disabled="step1ButtonDisabled"-->
    <!--                        @next-callback="activateCallback('2')"-->
    <!--                    >-->
    <!--                        <track-data-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="2">-->
    <!--                    <base-data-panel-->
    <!--                        :next-button-disabled="step2ButtonDisabled"-->
    <!--                        @next-callback="activateCallback('3')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('1')"-->
    <!--                    >-->
    <!--                        <track-links-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="3">-->
    <!--                    <base-data-panel-->
    <!--                        :next-button-disabled="step3ButtonDisabled"-->
    <!--                        @next-callback="activateCallback('4')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('2')"-->
    <!--                    >-->
    <!--                        <track-images-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="4">-->
    <!--                    <base-data-panel-->
    <!--                        :next-button-disabled="step4ButtonDisabled"-->
    <!--                        @next-callback="activateCallback('5')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('3')"-->
    <!--                    >-->
    <!--                        <track-colors-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="5">-->
    <!--                    <base-data-panel-->
    <!--                        :next-button-disabled="step5ButtonDisabled"-->
    <!--                        @next-callback="activateCallback('6')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('4')"-->
    <!--                    >-->
    <!--                        <track-audio-file-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="6">-->
    <!--                    <base-data-panel-->
    <!--                        v-if="submittedState === 'no'"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('5')"-->
    <!--                    >-->
    <!--                        <track-review-panel :key="reviewComponentKey" />-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Submit"-->
    <!--                                icon="pi pi-check"-->
    <!--                                @click="submitTrack"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->

    <!--                    <base-data-panel-->
    <!--                        v-else-if="submittedState === 'success'"-->
    <!--                        :prev-button-shown="false"-->
    <!--                    >-->
    <!--                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">-->
    <!--                            <i-->
    <!--                                class="pi pi-check-circle text-green-500"-->
    <!--                                style="font-size: 8rem"-->
    <!--                            ></i>-->
    <!--                            <h1 class="text-4xl">Track uploaded successfully</h1>-->
    <!--                        </div>-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Close"-->
    <!--                                icon="pi pi-times"-->
    <!--                                @click="resetAll"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->

    <!--                    <base-data-panel-->
    <!--                        v-else-if="submittedState === 'error'"-->
    <!--                        :prev-button-shown="false"-->
    <!--                    >-->
    <!--                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">-->
    <!--                            <i class="pi pi-times-circle text-red-500" style="font-size: 8rem"></i>-->
    <!--                            <h1>Something went wrong while uploading the track</h1>-->
    <!--                        </div>-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Close"-->
    <!--                                icon="pi pi-times"-->
    <!--                                @click="resetAll"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->
    <!--            </pv-step-panels>-->
    <!--        </pv-stepper>-->
    <!--    </pv-dialog>-->

    <NewTrackDialog @close="resetAll" v-model="newTrackDialog" />

    <EditTrackDialog @close="resetAll" v-model="editTrackDialog" />

    <!--    <pv-dialog-->
    <!--        v-model:visible="editTrackDialog"-->
    <!--        modal-->
    <!--        header="Edit track"-->
    <!--        class="w-10/12"-->
    <!--        style="height: 80%"-->
    <!--        @close="resetAll"-->
    <!--    >-->
    <!--        <pv-stepper value="1" class="w-full" @step-change="() => (reviewComponentKey += 1)">-->
    <!--            <pv-step-list>-->
    <!--                <pv-step value="1">Step 1: Track data</pv-step>-->
    <!--                <pv-step value="2">Step 2: Track links</pv-step>-->
    <!--                <pv-step value="3">Step 3: Album cover</pv-step>-->
    <!--                <pv-step value="4">Step 4: Colors</pv-step>-->
    <!--                <pv-step value="5">Step 5: Audio file</pv-step>-->
    <!--                <pv-step value="6">Step 6: Review</pv-step>-->
    <!--            </pv-step-list>-->
    <!--            <pv-step-panels>-->
    <!--                <pv-step-panel v-slot="{ activateCallback }" value="1">-->
    <!--                    <base-data-panel @next-callback="activateCallback('2')">-->
    <!--                        <track-data-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="2">-->
    <!--                    <base-data-panel-->
    <!--                        @next-callback="activateCallback('3')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('1')"-->
    <!--                    >-->
    <!--                        <track-links-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="3">-->
    <!--                    <base-data-panel-->
    <!--                        @next-callback="activateCallback('4')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('2')"-->
    <!--                    >-->
    <!--                        <track-images-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="4">-->
    <!--                    <base-data-panel-->
    <!--                        @next-callback="activateCallback('5')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('3')"-->
    <!--                    >-->
    <!--                        <track-colors-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="5">-->
    <!--                    <base-data-panel-->
    <!--                        @next-callback="activateCallback('6')"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('4')"-->
    <!--                    >-->
    <!--                        <track-audio-file-panel />-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->

    <!--                <pv-step-panel v-slot="{ activateCallback }" value="6">-->
    <!--                    <base-data-panel-->
    <!--                        v-if="submittedState === 'no'"-->
    <!--                        :prev-button-shown="true"-->
    <!--                        @prev-callback="activateCallback('5')"-->
    <!--                    >-->
    <!--                        <track-review-panel :key="reviewComponentKey" />-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Submit"-->
    <!--                                icon="pi pi-check"-->
    <!--                                @click="editTrack(trackStore.get().id, trackStore.get())"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->

    <!--                    <base-data-panel-->
    <!--                        v-else-if="submittedState === 'success'"-->
    <!--                        :prev-button-shown="false"-->
    <!--                    >-->
    <!--                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">-->
    <!--                            <i-->
    <!--                                class="pi pi-check-circle text-green-500"-->
    <!--                                style="font-size: 8rem"-->
    <!--                            ></i>-->
    <!--                            <h1 class="text-4xl">Track uploaded successfully</h1>-->
    <!--                        </div>-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Close"-->
    <!--                                icon="pi pi-times"-->
    <!--                                @click="resetAll"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->

    <!--                    <base-data-panel-->
    <!--                        v-else-if="submittedState === 'error'"-->
    <!--                        :prev-button-shown="false"-->
    <!--                    >-->
    <!--                        <div class="flex flex-col h-full w-full justify-center items-center gap-6">-->
    <!--                            <i class="pi pi-times-circle text-red-500" style="font-size: 8rem"></i>-->
    <!--                            <h1>Something went wrong while uploading the track</h1>-->
    <!--                        </div>-->

    <!--                        <template #nextButton>-->
    <!--                            <pv-button-->
    <!--                                label="Close"-->
    <!--                                icon="pi pi-times"-->
    <!--                                @click="resetAll"-->
    <!--                            ></pv-button>-->
    <!--                        </template>-->
    <!--                    </base-data-panel>-->
    <!--                </pv-step-panel>-->
    <!--            </pv-step-panels>-->
    <!--        </pv-stepper>-->
    <!--    </pv-dialog>-->

    <pv-toast />
</template>

<style scoped></style>
