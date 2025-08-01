"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightRagToolInsertText = void 0;
class LightRagToolInsertText {
    constructor() {
        this.description = {
            displayName: 'Light Rag Insert Text',
            name: 'LightRagToolInsertText',
            icon: 'file:lightRag.svg',
            group: ['Vector Store'],
            version: 1,
            description: 'Expose a lightRag text insertion as a Tool for AI Chatflows',
            defaults: { name: 'Light Rag Insert Text' },
            usableAsTool: true,
            inputs: [
                {
                    displayName: 'AI Chat',
                    type: "ai_agent" /* NodeConnectionType.AiAgent */,
                    required: true,
                },
            ],
            outputs: [
                {
                    displayName: 'Tool',
                    type: "ai_vectorStore" /* NodeConnectionType.AiVectorStore */,
                },
            ],
            credentials: [
                { name: 'lightRagApi', required: true },
            ],
            properties: [
                {
                    displayName: 'File Source (Optional)',
                    name: 'file_source',
                    type: 'string',
                    default: '',
                    description: 'name of the file source to use for this text',
                },
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    default: '',
                    description: 'text to insert into LightRAG',
                    required: true,
                },
            ],
        };
    }
    async execute() {
        const credentials = (await this.getCredentials('lightRagApi'));
        const file_source = this.getNodeParameter('file_source', 0);
        const text = this.getNodeParameter('text', 0);
        const body = {
            file_source,
            text,
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        let queryUrl = `${credentials.url}/query`;
        if (credentials.apiKey && credentials.apiKey.trim() !== '') {
            queryUrl += `?api_key_header_value=${encodeURIComponent(credentials.apiKey)}`;
        }
        const responseData = await this.helpers.request({
            method: 'POST',
            uri: queryUrl,
            body,
            headers,
            json: true,
        });
        return [this.helpers.returnJsonArray(responseData)];
    }
}
exports.LightRagToolInsertText = LightRagToolInsertText;
