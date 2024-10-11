import { LanguageModelChatSelector, QuickPickItem } from "vscode";
import { UrlFormat } from "./commands/types/UrlFormat";

/**
 * The text used to indicate when there are too many search results.
 */
export const tooManyResults: string = "Try a more specific search term...";

/**
 * The name of the tool.
 * @constant `"xrefHelper"`
 */
export const toolName: string = "xrefHelper";

/**
 * The name of the insert API reference link command.
 * @constant `"xrefHelper.insertApiReferenceLink"`
 */
export const insertApiRefLinkCommandName: string = `${toolName}.insertApiReferenceLink`;

/**
 * The name of the insert API reference link command.
 * @constant `"xrefHelper.insertXrefLink"`
 */
export const insertXrefLinkCommandName: string = `${toolName}.insertXrefLink`;

/**
 * The name of the transform xref to the opposite version command.
 * @constant `"xrefHelper.transformXrefToOther"`
 */
export const transformXrefToOtherCommandName: string = `${toolName}.transformXrefToOther`;

/**
 * The quick pick items for selecting the URL format.
 * Excludes the custom name option.
 */
export const urlFormatQuickPickItems: QuickPickItem[] =
    [
        {
            label: `$(check) ${UrlFormat.default}`,
            description: 'Displays only the API name. For example, "Trim".'
        },
        {
            label: `$(bracket-dot) ${UrlFormat.nameWithType}`,
            description: 'Displays the type and name (or namespace and type). For example, "String.Trim".',
        },
        {
            label: `$(array) ${UrlFormat.fullName}`,
            description: 'Displays the fully qualified name. For example, "System.String.Trim".'
        },
    ];

/**
 * The quick pick items for selecting the URL format.
 * Includes the custom name option.
 */
export const allUrlFormatQuickPickItems: QuickPickItem[] =
    [
        ...urlFormatQuickPickItems,
        {
            label: `$(edit) ${UrlFormat.customName}`,
            description: 'Lets you enter custom link text. For example, "The string.Trim() method".'
        }
    ];

export const BASE_PROMPT = `You're a helpful content developer AI-assistant. Your job is to take a single Markdown file as a target style to read from, and then mimic the style, flow, tone, voice, and structure of the article that you'll use as a template for how to create an entirely new Markdown file from another source file that contains the source domain-specific language (DSL) content. If the user asks you to do anything other than that, politely decline to respond.`;

export const MODEL_SELECTOR: LanguageModelChatSelector = {
    vendor: "copilot",
    family: "gpt-4o"
};

export function formatFilePrompt(sourceFile: string, targetDetails: string): string {
    return `Consider the following Markdown article as a source. Notice the order of its headings, the style, flow, and voice:
    
    "${sourceFile}"

    Considering that article, I want you to create a new Markdown file that has the same style, flow, tone, voice, and structure as the source file. But instead use the following details as the content, since they're different:
    
    "${targetDetails}"

    You job is to use the source file as a template to create a new Markdown file. Please ensure that it has the same style, flow, tone, voice, and structure. Finally, always reply with Markdown.`;
}   

// export function formatFilePrompt(sourceFile: string, targetFile: string): string {
//     return `The following Markdown file contains a certain style that I'd like for you to mimic. It has a specific order of headings and sections. It also has a specific and informative way of presenting the information, that's consistent and uses active voice. The overall tone is friendly and helpful. The information is presented in a way that's concise. Here's what you need to mimic:
    
//     "${sourceFile}"

//     Again, please note the order of the headings. The next bit of content is the target file that contains , that the domain-specific language (DSL) content is in the following file and use the earlier source file as a template to create a new Markdown file that has the same style, flow, tone, voice, and structure. Here's it's raw content. "${targetFile}"

//     Now please create a new Markdown file that has the same style, flow, tone, voice, and structure as the source file.`;
// }   
