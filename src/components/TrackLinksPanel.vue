<script setup lang="ts">
import { useMobileSite } from "@/composables/useMobileSite";
import { useTrackStore } from "@/stores/newTrackStore";
import type { Platform } from "@/utils/Platform";
import { TrackLink } from "@/utils/TrackLink";
import type { DataTableCellEditCompleteEvent } from "primevue/datatable";
import { ref } from "vue";

const newTrack = useTrackStore();

const data = newTrack.get();

const platforms = ref<{ name: string; value: Platform }[]>([
    {
        name: "Youtube",
        value: "youtube"
    },
    {
        name: "Soundcloud",
        value: "soundcloud"
    },
    {
        name: "Spotify",
        value: "spotify"
    }
]);

// const trackLinksStore = useNewTracklinksStore()

const onCellEditComplete = (event: DataTableCellEditCompleteEvent) => {
    const { data, newValue, field } = event;

    data[field] = newValue;
};

const trackLinksAdd = () => {
    data.links.push(new TrackLink());
};

const trackLinksRemove = (index: number) => {
    if (data.links.length > 0) {
        data.links.splice(index, 1);
    } else {
        data.links.length = 0;
    }
};

const mobileSite = useMobileSite();
</script>

<template>
    <div class="w-full" v-if="!mobileSite.get()">
        <pv-toolbar>
            <template #start>
                <pv-button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    @click="trackLinksAdd"
                />
            </template>
        </pv-toolbar>
        <pv-data-table :value="data.links" editMode="cell" @cell-edit-complete="onCellEditComplete">
            <pv-column field="platform" header="Platform" class="w-4/12">
                <template #body="{ data, field }">
                    <pv-dropdown
                        id="platform"
                        v-model="data[field]"
                        :options="platforms"
                        option-label="name"
                        option-value="value"
                        class="w-full"
                    />
                </template>
            </pv-column>
            <pv-column field="url" header="URL" class="w-7/12">
                <template #body="{ data, field }">
                    <span class="text-blue-500 underline">{{ data[field] }}</span>
                </template>
                <template #editor="{ data, field }">
                    <pv-input-text v-model="data[field]" class="w-full" autofocus />
                </template>
            </pv-column>
            <pv-column class="w-1/12">
                <template #body="{ index }">
                    <span class="pi pi-trash text-red-500" @click="trackLinksRemove(index)"></span>
                </template>
            </pv-column>
        </pv-data-table>
    </div>

    <div class="w-full" v-else>
        <pv-toolbar class="mb-10">
            <template #start>
                <pv-button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    @click="trackLinksAdd"
                />
            </template>
        </pv-toolbar>

        <div class="flex flex-col gap-8">
            <div v-for="(link, index) in data.links" :key="link.platform" class="">
                <pv-card>
                    <template #content>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-1">
                                <h1 class="font-bold">Platform</h1>
                                <pv-dropdown
                                    id="platform"
                                    v-model="link.platform"
                                    :options="platforms"
                                    option-label="name"
                                    option-value="value"
                                    class="w-full"
                                />
                            </div>

                            <div class="flex flex-col gap-1">
                                <h1 class="font-bold">URL</h1>
                                <pv-input-text v-model="link.url" class="w-full" autofocus />
                            </div>

                            <div class="flex flex-col gap-1">
                                <h1 class="font-bold">Actions</h1>
                                <pv-button
                                    @click="trackLinksRemove(index)"
                                    severity="danger"
                                    outlined
                                    icon="pi pi-trash"
                                ></pv-button>
                            </div>
                        </div>
                    </template>
                </pv-card>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
