import { SearchResult } from "./SearchResult";

export type SearchResults = {
    "@nextLink"?: string | undefined;
    count: number;
    results: SearchResult[];
};

export default class EmptySearchResults implements SearchResults {
    "@nextLink"?: string | undefined = undefined;
    count: number = 0;
    results: SearchResult[] = [];
    isEmpty: boolean = true;

    private static readonly _instance: EmptySearchResults = new EmptySearchResults();

    public static get instance(): EmptySearchResults {
        return EmptySearchResults._instance;
    }

    private constructor() { }
};