import { CreateTrackDto } from "@/utils/CreateTrackDto";
import { UpdateTrackDto } from "@/utils/UpdateTrackDto";

const apiKey = import.meta.env.VITE_API_KEY;

export class CDNManager {
    baseURL: string;
    tracks: CreateTrackDto[] = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async get(path: string) {
        return await fetch(`${this.baseURL}${path}`, {
            headers: {
                "x-api-key": apiKey
            }
        });
    }

    private async postJSON<T>(path: string, data: T, ...params: string[]) {
        return fetch(`${this.baseURL}${path}${params}`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify(data)
        });
    }

    private async putJSON<T>(path: string, id: string, data: T, ...params: string[]) {
        return fetch(`${this.baseURL}${path}/${id}${params}`, {
            method: "PUT", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify(data)
        });
    }

    private async patch(path: string, id: string, ...params: string[]) {
        return await fetch(`${this.baseURL}${path}/${id}${params}`, {
            method: "PATCH", // or 'PUT',
            headers: {
                "x-api-key": apiKey
            }
        });
    }

    private async delete(path: string, ...params: string[]) {
        return await fetch(`${this.baseURL}${path}/${params}`, {
            method: "DELETE", // or 'PUT'
            headers: {
                "x-api-key": apiKey
            }
        });
    }

    async submitTrack(track: CreateTrackDto) {
        const response = await this.postJSON("/track", track);

        return await response.json();
    }

    async editTrack(id: string, track: UpdateTrackDto) {
        const response = await this.putJSON("/track", id, track);

        await this.invalidateCache();

        return await response.json();
    }

    async publishTrack(id: string) {
        const response = await this.patch("/track", id, "/publish");

        return await response.json();
    }

    async deleteTrack(id: string) {
        const response = await this.delete("/track", `/${id}`);

        return await response.json();
    }

    async getTracks() {
        const response = await this.get("/tracks");

        const json = await response.json();

        this.tracks = json;

        return json;
    }

    async invalidateCache() {
        const response = await this.delete("/images/cache");

        return response.ok;
    }
}
