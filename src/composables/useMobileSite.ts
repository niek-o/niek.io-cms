import { ref } from "vue";

const mobileSite = ref(false);

export function useMobileSite() {
    function get() {
        return mobileSite.value;
    }

    function set(width: number) {
        if (width < 1100) {
            mobileSite.value = true;
        } else {
            mobileSite.value = false;
        }
    }

    return { get, set };
}
