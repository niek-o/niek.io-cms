<script setup lang="ts">
import TrackCard from "@/components/TrackCard.vue";
import { useTrackStore } from "@/stores/newTrackStore";

const newTrackStore = useTrackStore();

const newTrack = newTrackStore.get();

const onDateValue = (date: Date) => {
    newTrack.releaseDate = new Date(date.setUTCHours(24, 0, 0, 0));
};
</script>

<template>
    <div class="flex flex-col gap-12">
        <track-card :track="newTrack" />
        <div class="flex flex-col gap-2">
            <label for="releaseDatePicker">Release date</label>
            <pv-calendar
                id="releaseDatePicker"
                :model-value="new Date(newTrack.releaseDate)"
                @update:model-value="onDateValue"
                show-icon
                show-button-bar
                class="w-60"
            />
        </div>
    </div>
</template>

<style scoped></style>
