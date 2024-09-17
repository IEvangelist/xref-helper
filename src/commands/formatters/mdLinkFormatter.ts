import { window } from "vscode";
import { SearchResult } from "../types/SearchResult";
import { UrlFormat } from "../types/UrlFormat";

/**
 * When MD links are enabled, the URL should be in the format:
 *   `[name](url)`, where name is the name of the type or member and url is the URL.
 *   For example, `[String](/dotnet/api/system.string)`.
 * @param urlFormat 
 * @param searchResult 
 * @returns A `string` that represents the XREF link as a Promise.
 */
export const mdLinkFormatter = async (
    urlFormat: UrlFormat,
    searchResult: SearchResult): Promise<string | undefined> => {

    const { displayName, url } = searchResult;

    // TODO:
    // 1. Construct the learn.microsoft.com URL from the search result.
    // 2. Fetch the HTML content and parse:
    //    <meta name="gitcommit" content="https://github.com/{owner}/{repo}/blob/{sha}/path/to.xml">
    // 3. Request the raw XML file from GitHub.
    // 4. Parse the XML file and return the DocId's that are closest to the search result.

    switch (urlFormat) {
        // Displays the API name: 
        //   [SmtpClient](/dotnet/api/system.net.mail.smtpclient)
        case UrlFormat.default:
            return `[${displayName.substring(displayName.lastIndexOf('.') + 1)}](${url})`;

        // Displays the fully qualified name:
        //   [System.Net.Mail.SmtpClient](/dotnet/api/system.net.mail.smtpclient)
        case UrlFormat.fullName:
            return `[${displayName}](${url})`;

        // Displays the type with the name:
        //   [Class SmtpClient](/dotnet/api/system.net.mail.smtpclient)
        case UrlFormat.typeWithName:
            {
                const [type, ...name] = displayName.split('.');
                return `[${type} ${name.join('.')}](${url})`;
            }

        // Allows the user to enter a custom name:
        //   [the .NET SmtpClient class](/dotnet/api/system.net.mail.smtpclient)                                
        case UrlFormat.customName:
            {
                // Try getting the selected text from the active text editor
                const selectedText: string | undefined = window.activeTextEditor?.document.getText(
                    window.activeTextEditor?.selection);

                // Default to the display name of the search result
                let fallbackDisplayName = searchResult.displayName;

                // If there isn't selected text, prompt the user to enter a custom name
                if (!selectedText) {
                    const inputDisplayName = await window.showInputBox({
                        title: 'Enter a custom name',
                        placeHolder: 'Enter a custom name for the link.'
                    });

                    return `[${inputDisplayName ?? fallbackDisplayName}](${url})`;
                }

                return `[${fallbackDisplayName}](${url})`;
            }

        default:
            return undefined;
    }
};