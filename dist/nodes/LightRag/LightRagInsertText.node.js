"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightRagInsertText = void 0;
class LightRagInsertText {
    constructor() {
        this.description = {
            displayName: 'LightRAG Insert Text',
            name: 'LightRagInsertText',
            icon: 'file:lightRag.svg',
            group: ['transform'],
            version: 1,
            description: 'Insert text into LightRAG for indexing',
            defaults: {
                name: 'LightRAG Insert Text',
            },
            inputs: [
                { type: "main" /* NodeConnectionType.Main */, displayName: 'Input' },
            ],
            outputs: [
                { type: "main" /* NodeConnectionType.Main */, displayName: 'Output' },
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
        // Merge optional parameters into body
        // Object.assign(body, options); // 'options' is not defined in your code, consider removing or defining it
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
exports.LightRagInsertText = LightRagInsertText;
