<script setup lang="ts">
import { useTrackStore } from "@/stores/newTrackStore";

const newTrack = useTrackStore();

const data = newTrack.get();
</script>

<template>
    <div class="grid grid-cols-2 gap-8">
        <pv-panel header="Background color">
            <div class="flex flex-col w-48">
                <pv-input-text
                    :model-value="data.backgroundColor"
                    @update:model-value="
                        (value: string) => {
                            data.backgroundColor = value.startsWith('#')
                                ? value.toUpperCase()
                                : '#' + value.toUpperCase();
                        }
                    "
                />
                <pv-color-picker
                    @update:model-value="
                        (value: string) => {
                            data.backgroundColor = value.startsWith('#')
                                ? value.toUpperCase()
                                : '#' + value.toUpperCase();
                        }
                    "
                    :pt="{
                        input: {
                            style: {
                                width: '100%'
                            }
                        }
                    }"
                    :model-value="data.backgroundColor"
                    format="hex"
                />
            </div>
        </pv-panel>

        <pv-panel header="Accent color">
            <div class="flex flex-col w-48">
                <pv-input-text
                    :model-value="data.accentColor"
                    @update:model-value="
                        (value: string) => {
                            data.accentColor = value.startsWith('#')
                                ? value.toUpperCase()
                                : '#' + value.toUpperCase();
                        }
                    "
                />
                <pv-color-picker
                    @update:model-value="
                        (value: string) => {
                            data.accentColor = value.startsWith('#')
                                ? value.toUpperCase()
                                : '#' + value.toUpperCase();
                        }
                    "
                    :pt="{
                        input: {
                            style: {
                                width: '100%'
                            }
                        }
                    }"
                    :model-value="data.accentColor"
                    format="hex"
                />
            </div>
        </pv-panel>
    </div>
</template>

<style scoped></style>
