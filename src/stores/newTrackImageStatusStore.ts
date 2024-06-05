import { ref } from "vue";

const newTrackImageStatus = ref(false);

export const useTrackImageStatusStore = () => {
    const get = () => {
        return newTrackImageStatus.value;
    };

    const set = (status: boolean) => {
        newTrackImageStatus.value = status;
    };

    return { get, set };
};
