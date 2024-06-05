import type { Platform } from "@/utils/Platform";

interface ITrackLink {
    url: string;
    platform: Platform;
}

export class TrackLink implements ITrackLink {
    declare url: string;
    declare platform: Platform;

    constructor(trackLink?: ITrackLink) {
        if (trackLink) {
            this.url = trackLink.url;
            this.platform = trackLink.platform;
        }
    }
}
