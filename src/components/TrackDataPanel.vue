<script setup lang="ts">
import { useTrackStore } from "@/stores/newTrackStore";

const newTrack = useTrackStore();

const data = newTrack.get();
</script>

<template>
    <div class="flex flex-col gap-6 place-self-start">
        <div class="flex flex-col gap-2">
            <label for="trackId">Track ID</label>
            <pv-input-text
                id="trackId"
                @update:model-value="
                    (value: string) => {
                        data.id = value.replace(' ', '-').toLowerCase();
                    }
                "
                :model-value="data.id.toLowerCase()"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="title">Title</label>
            <pv-input-text
                id="title"
                @update:model-value="
                    (value: string) => {
                        data.title = value.toUpperCase();
                    }
                "
                :model-value="data.title.toUpperCase()"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="subtitle">Subtitle</label>
            <pv-input-text
                id="subtitle"
                @update:model-value="
                    (value: string) => {
                        data.subtitle = value.toUpperCase();
                    }
                "
                :model-value="data.subtitle.toUpperCase()"
            />
        </div>
    </div>
</template>

<style scoped></style>
