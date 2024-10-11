import {
    CancellationToken,
    ChatContext,
    ChatRequest,
    ChatRequestHandler,
    ChatResponseMarkdownPart,
    ChatResponseStream,
    ChatResponseTurn,
    env,
    LanguageModelChatMessage,
    lm,
    TabInputText,
    Uri,
    window,
    workspace,
} from 'vscode';
import { formatFilePrompt, MODEL_SELECTOR } from '../consts';

const textDecoder = new TextDecoder();

export const chatRequestHandler: ChatRequestHandler = async (
    request: ChatRequest,
    context: ChatContext,
    stream: ChatResponseStream,
    token: CancellationToken) => {

    console.log(`Received chat request: ${request.prompt}`);

    let userPrompt = request.prompt;

    if (request.command === 'templateArticle') {
        // get the two active editor article contents from left and right
        // where the left is the sourceFile and the right is the targetFile.
        // Then, call the formatFilePrompt function to generate the prompt.
        // Finally, set the userPrompt to the generated prompt.

        let sourceFile = '';

        if (request.references) {
            for (const reference of request.references) {
                if (reference.value instanceof Uri) {
                    const uri = reference.value as Uri;
                    const isMarkdown = uri.path.endsWith('.md');
                    if (isMarkdown === false) {
                        continue;
                    }

                    if (sourceFile === '') {
                        const rawSource = await workspace.fs.readFile(uri);
                        sourceFile = textDecoder.decode(rawSource);
                    }

                    if (sourceFile) {
                        break;
                    }
                }
            }
        } else {
            for (const group of window.tabGroups.all) {
                for (const tab of group.tabs) {
                    if (tab.input instanceof TabInputText) {
                        const doc = tab.input as TabInputText;
                        const uri = doc.uri;
                        const isMarkdown = uri.path.endsWith('.md');
                        if (isMarkdown === false) {
                            continue;
                        }

                        if (sourceFile === '') {
                            const rawSource = await workspace.fs.readFile(uri);
                            sourceFile = textDecoder.decode(rawSource);
                        }

                        if (sourceFile) {
                            break;
                        }
                    }
                }
            }
        }

        if (sourceFile) {
            userPrompt = formatFilePrompt(sourceFile, request.prompt);
        }
    }

    const [model] = await lm.selectChatModels(MODEL_SELECTOR);
    if (model) {
        const messages = [
            LanguageModelChatMessage.User(userPrompt),
        ];

        const previousResponses = context.history.filter(
            requestOrResponse => requestOrResponse instanceof ChatResponseTurn
        );

        previousResponses.forEach(response => {
            let fullMessage = '';
            response.response.forEach((r) => {
                const mdPart = r as ChatResponseMarkdownPart;
                fullMessage += mdPart?.value?.value;
            });
            messages.push(LanguageModelChatMessage.Assistant(fullMessage));
        });

        const chatResponse = await model.sendRequest(messages, {}, token);

        let markdown = '';

        for await (const fragment of chatResponse.text) {
            markdown += fragment;
            stream.markdown(fragment);
        }

        env.clipboard.writeText(markdown);
    }

    return;
};