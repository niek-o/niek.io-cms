<script setup lang="ts">
import { useTrackStore } from "@/stores/newTrackStore";

const newTrack = useTrackStore();

const data = newTrack.get();
</script>

<template>
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-8">
        <pv-panel header="Background color">
            <div class="flex flex-col gap-2">
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
                        preview: {
                            style: {
                                width: '100%',
                                border: '1px solid black'
                            }
                        },
                        panel: {
                            style: {
                                display: 'none'
                            }
                        }
                    }"
                    :model-value="data.backgroundColor"
                    format="hex"
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
                        panel: {
                            style: {
                                width: '100%',
                                display: 'flex'
                            }
                        }
                    }"
                    :model-value="data.backgroundColor"
                    format="hex"
                    inline
                />
            </div>
        </pv-panel>

        <pv-panel header="Accent color">
            <div class="flex flex-col gap-2">
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
                        preview: {
                            style: {
                                width: '100%',
                                border: '1px solid black'
                            }
                        },
                        panel: {
                            style: {
                                display: 'none'
                            }
                        }
                    }"
                    :model-value="data.accentColor"
                    format="hex"
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
                        panel: {
                            style: {
                                width: '100%',
                                display: 'flex'
                            }
                        }
                    }"
                    :model-value="data.accentColor"
                    format="hex"
                    inline
                />
            </div>
        </pv-panel>
    </div>
</template>

<style scoped></style>
