import { TagsLive } from './TagsLive';
export declare class Installation {
    id: number;
    ewonId: string;
    name: string;
    nbIRVE: number;
    battery: boolean;
    abo: number;
    lastSynchroDate: Date;
    address: {
        address: string;
        postalCode: number;
        latitude: string;
        longitude: string;
    }[];
    tagHistory: {
        lastSynchroDate: Date;
        dateReq: Date;
        value: number;
        quality: string;
        alarmHint: string;
    }[];
    tagsLive: TagsLive[];
}
