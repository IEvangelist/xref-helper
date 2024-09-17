import { WorkspaceConfiguration } from "vscode";
import { UrlFormat } from "../../commands/types/UrlFormat";
import { StringPair } from "./StringPair";
import { nameof } from "../../utils";

/**
 * Represents the configuration settings for the extension.
 */
export class AppConfig {
    /**
     * The format of the URL to insert.
     * - Default: Only displays the API name.
     * - Full name: Displays the fully qualified name.
     * - Type with name: Displays the type with the name.
     * - Custom name: Allows the user to enter a custom name.
     * @default `undefined`
     */
    defaultUrlFormat: UrlFormat | undefined = undefined;

    /**
     * The default API URL to query.
     * - This URL is used to query the API for search results.
     * @default "https://learn.microsoft.com/api/apibrowser/dotnet/search"
     */
    apiUrl = "https://learn.microsoft.com/api/apibrowser/dotnet/search";

    /**
     * The default query string parameters to include in the API URL.
     * - These parameters are used to filter the search results.
     * @default [ { "api-version": "0.2" }, { "locale": "en-us" } ]
     */
    queryStringParameters: StringPair[] | undefined =
        [
            { "api-version": "0.2" },
            { "locale": "en-us" },
        ];

    constructor(workspaceConfig: WorkspaceConfiguration) {
        this.defaultUrlFormat = workspaceConfig.get<UrlFormat>(nameof<AppConfig>("defaultUrlFormat")) 
            || this.defaultUrlFormat;

        this.apiUrl = workspaceConfig.get<string>(nameof<AppConfig>("apiUrl")) 
            || this.apiUrl;

        this.queryStringParameters = workspaceConfig.get<StringPair[]>(nameof<AppConfig>("queryStringParameters")) 
            || this.queryStringParameters;
    }

    public buildApiUrlWithSearchTerm = (searchTerm: string): string => {
        const queryString = (this.queryStringParameters ?? [])
            .map((pair) => Object.entries(pair).map(([key, value]) => `${key}=${value}`).join("&"))
            .join("&");

        return `${this.apiUrl}?${queryString}&search=${searchTerm}`;
    }
};

