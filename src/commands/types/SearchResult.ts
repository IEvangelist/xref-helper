import { ItemType } from "./types/ItemType";


export type SearchResult = {
    description: string;
    displayName: string;
    itemType: ItemType;
    url: string;
    "@rawHtml": string | undefined;
};
