import { window, QuickPickItem, QuickInputButton, QuickPickItemKind, ThemeIcon, Uri } from "vscode";
import { SearchResult, SearchResults } from "./search-results";

export async function showSearch() {
    const input = await window.showInputBox({
        placeHolder: "Type or member name.",
    });

    if (!input) {
        return;
    }

    // Example URL:
    //   https://learn.microsoft.com/api/apibrowser/dotnet/search?api-version=0.2&search=SmtpClient&locale=en-us&$filter=monikers/any(t:%20t%20eq%20%27net-8.0%27)
    const response = await fetch(
        `https://learn.microsoft.com/api/apibrowser/dotnet/search?api-version=0.2&search=${input}&locale=en-us`, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        window.showWarningMessage(`Failed to search for '${input}'.`);
        return;
    }

    const results: SearchResults = await response.json() as SearchResults;

    const quickPick = window.createQuickPick<SearchResultQuickPickItem>();
    quickPick.items = results.results.map(result => new SearchResultQuickPickItem(result));

    quickPick.show();
}

class SearchResultQuickPickItem implements QuickPickItem {    
    label: string;
    kind?: QuickPickItemKind | undefined;
    iconPath?: Uri | { light: Uri; dark: Uri; } | ThemeIcon | undefined;
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
    buttons?: readonly QuickInputButton[] | undefined;

    constructor(public readonly result: SearchResult) {
        this.label = result.displayName;
        this.description = result.description
    }
}