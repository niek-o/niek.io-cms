<script setup lang="ts">
defineProps<{
    nextButtonDisabled?: boolean;
    prevButtonShown?: boolean;
}>();

const emit = defineEmits(["nextCallback", "prevCallback"]);
</script>

<template>
    <div class="flex flex-col h-full">
        <div
            class="border-2 border-dashed surface-border rounded-lg bg-gray-100 flex-col justify-center flex items-center font-medium p-20 min-h-[33rem]"
        >
            <slot></slot>
        </div>
        <div class="flex pt-6 justify-between">
            <pv-button
                label="Back"
                icon="pi pi-arrow-left"
                iconPos="left"
                severity="secondary"
                :class="{ 'visibility-hidden': !prevButtonShown }"
                @click="emit('prevCallback')"
            />
            <div v-if="$slots.nextButton">
                <slot name="nextButton" />
            </div>
            <pv-button
                v-else
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                :disabled="nextButtonDisabled"
                @click="emit('nextCallback')"
            />
        </div>
    </div>
</template>

<style scoped></style>
