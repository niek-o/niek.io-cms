import { TrackLink } from "@/utils/TrackLink";

interface ICreateTrackDto {
    id: string;
    title: string;
    subtitle: string;
    backgroundColor: string;
    accentColor: string;
    backgroundImage: boolean;
    releaseDate: Date;
    links: TrackLink[];
}

export class CreateTrackDto implements ICreateTrackDto {
    declare id: string;
    declare title: string;
    declare subtitle: string;
    declare backgroundColor: string;
    declare accentColor: string;
    declare backgroundImage: boolean;
    declare releaseDate: Date;
    declare links: TrackLink[];

    constructor(createTrackDto?: ICreateTrackDto) {
        if (createTrackDto) {
            this.id = createTrackDto.id;
            this.title = createTrackDto.title;
            this.subtitle = createTrackDto.subtitle;
            this.backgroundColor = createTrackDto.backgroundColor;
            this.accentColor = createTrackDto.accentColor;
            this.backgroundImage = createTrackDto.backgroundImage;
            this.releaseDate = createTrackDto.releaseDate;
            this.links = createTrackDto.links.map((link) => new TrackLink(link));
        }
    }
}
