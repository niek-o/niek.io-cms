import { ref } from "vue";

const newTrackAudioFileStatus = ref(false);

export const useTrackAudioFileStatusStore = () => {
    const get = () => {
        return newTrackAudioFileStatus.value;
    };

    const set = (status: boolean) => {
        newTrackAudioFileStatus.value = status;
    };

    return { get, set };
};
