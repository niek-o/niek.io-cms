import type { CreateTrackDto } from "@/utils/CreateTrackDto";
import { reactive } from "vue";

const emptyTrack: CreateTrackDto = {
    id: "",
    title: "",
    subtitle: "",
    backgroundColor: "",
    accentColor: "",
    backgroundImage: false,
    releaseDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    links: []
};

const newTrack = reactive(emptyTrack);

export const useTrackStore = () => {
    const get = () => {
        return newTrack;
    };

    const set = (track: CreateTrackDto) => {
        Object.assign(newTrack, track);
    };

    const reset = () => {
        Object.assign(newTrack, emptyTrack);
    };

    return { get, set, reset };
};
