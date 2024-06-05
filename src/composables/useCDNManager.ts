import { CDNManager } from "@/utils/CDNManager";
import { reactive } from "vue";

const cdnManager = reactive(new CDNManager(import.meta.env.VITE_CDN_URL));

export function useCDNManager() {
    return cdnManager;
}
