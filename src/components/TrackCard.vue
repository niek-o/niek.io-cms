<script setup lang="ts">
import SoundcloudIcon from "@/components/icons/SoundcloudIcon.vue";
import SpotifyIcon from "@/components/icons/SpotifyIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";
import type { CreateTrackDto } from "@/utils/CreateTrackDto";

const { track } = defineProps<{
    track: CreateTrackDto;
}>();

const { backgroundColor, accentColor, id, title, subtitle, links } = track;

const cdnUrl = import.meta.env.VITE_CDN_URL;
</script>

<template>
    <pv-card
        class="w-6/12 text-center"
        :pt="{
            root: {
                style: {
                    backgroundColor: backgroundColor
                }
            },
            title: {
                style: {
                    color: accentColor
                }
            },
            subtitle: {
                style: {
                    color: accentColor
                }
            }
        }"
    >
        <template #header>
            <img :src="`${cdnUrl}/images/cover/${id}`" alt="album cover" />
        </template>
        <template #title>
            <h1 class="text-4xl">
                {{ title }}
            </h1>
        </template>
        <template #subtitle>{{ subtitle }}</template>
        <template #content>
            <pv-divider />
            <div class="flex flex-row gap-4 justify-center">
                <a :href="link.url" target="_blank" v-for="link in links" :key="link.platform">
                    <youtube-icon
                        class="w-16 h-16 border-2 border-[#ff0000] rounded-lg p-2"
                        v-if="link.platform === 'youtube'"
                    />
                    <soundcloud-icon
                        class="w-16 h-16 border-2 border-[#f05000] rounded-lg p-2"
                        v-else-if="link.platform === 'soundcloud'"
                    />
                    <spotify-icon
                        class="w-16 h-16 border-2 border-[#2ebd59] rounded-lg p-2"
                        v-else-if="link.platform === 'spotify'"
                    />
                </a>
            </div>
        </template>
    </pv-card>
</template>

<style scoped>
.p-divider::before {
    border-left-color: v-bind(accentColor);
    border-top-color: v-bind(accentColor);
}
</style>
