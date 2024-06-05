<script setup lang="ts">
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
</script>

<template>
    <div class="w-full">
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
</template>

<style scoped></style>
