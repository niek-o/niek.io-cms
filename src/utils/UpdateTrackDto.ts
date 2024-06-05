import { TrackLink } from "@/utils/TrackLink";

interface IUpdateTrackDto {
    title: string;
    subtitle: string;
    backgroundColor: string;
    accentColor: string;
    backgroundImage: boolean;
    releaseDate: Date;
    links: TrackLink[];
}

export class UpdateTrackDto implements IUpdateTrackDto {
    declare title: string;
    declare subtitle: string;
    declare backgroundColor: string;
    declare accentColor: string;
    declare backgroundImage: boolean;
    declare releaseDate: Date;
    declare links: TrackLink[];

    constructor(updateTrackDto?: IUpdateTrackDto) {
        if (updateTrackDto) {
            this.title = updateTrackDto.title;
            this.subtitle = updateTrackDto.subtitle;
            this.backgroundColor = updateTrackDto.backgroundColor;
            this.accentColor = updateTrackDto.accentColor;
            this.backgroundImage = updateTrackDto.backgroundImage;
            this.releaseDate = updateTrackDto.releaseDate;
            this.links = updateTrackDto.links.map((link) => new TrackLink(link));
        }
    }
}
