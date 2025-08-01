"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightRagQuery = void 0;
class LightRagQuery {
    constructor() {
        this.description = {
            displayName: 'LightRAG Query',
            name: 'lightRagQuery',
            icon: 'file:lightRag.svg',
            group: ['transform'],
            version: 1,
            description: 'Query documents via LightRAG',
            defaults: {
                name: 'LightRAG Query',
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
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    default: '',
                    description: 'The question to ask the LightRAG API',
                },
                {
                    displayName: 'Mode',
                    name: 'mode',
                    type: 'options',
                    options: [
                        { name: 'Mix', value: 'mix' },
                        { name: 'Naive', value: 'naive' },
                        { name: 'Global', value: 'global' },
                        { name: 'Hybrid', value: 'hybrid' },
                        { name: 'Local', value: 'local' },
                        { name: 'Bypass', value: 'bypass' },
                    ],
                    default: 'mix',
                    description: 'Select query mode',
                },
                {
                    displayName: 'Response Type',
                    name: 'response_type',
                    type: 'options',
                    options: [
                        { name: 'Multiple Paragraphs', value: 'Multiple Paragraphs' },
                        { name: 'Single Paragraphs', value: 'Single Paragraphs' },
                        { name: 'Bullet Points', value: 'Bullet Points' },
                    ],
                    default: 'Multiple Paragraphs',
                    description: 'Select response type',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Top K',
                            name: 'top_k',
                            type: 'number',
                            default: 40,
                            description: 'Number of top nodes to consider',
                            routing: { send: { type: 'body', property: 'top_k' } },
                        },
                        {
                            displayName: 'Chunk Top K',
                            name: 'chunk_top_k',
                            type: 'number',
                            default: 10,
                            routing: { send: { type: 'body', property: 'chunk_top_k' } },
                        },
                        {
                            displayName: 'Max Entity Tokens',
                            name: 'max_entity_tokens',
                            type: 'number',
                            default: 10000,
                            routing: { send: { type: 'body', property: 'max_entity_tokens' } },
                        },
                        {
                            displayName: 'Max Relation Tokens',
                            name: 'max_relation_tokens',
                            type: 'number',
                            default: 10000,
                            routing: { send: { type: 'body', property: 'max_relation_tokens' } },
                        },
                        {
                            displayName: 'Max Total Tokens',
                            name: 'max_total_tokens',
                            type: 'number',
                            default: 32000,
                            routing: { send: { type: 'body', property: 'max_total_tokens' } },
                        },
                        {
                            displayName: 'Enable Rerank',
                            name: 'enable_rerank',
                            type: 'boolean',
                            default: true,
                            routing: { send: { type: 'body', property: 'enable_rerank' } },
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const credentials = (await this.getCredentials('lightRagApi'));
        const query = this.getNodeParameter('query', 0);
        const mode = this.getNodeParameter('mode', 0);
        const response_type = this.getNodeParameter('response_type', 0);
        const options = this.getNodeParameter('options', 0);
        const body = {
            query,
            mode,
            response_type,
            only_need_context: false,
            only_need_prompt: false,
            stream: false,
            history_turns: 0,
            user_prompt: '',
            conversation_history: [],
        };
        // Merge optional parameters into body
        Object.assign(body, options);
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
exports.LightRagQuery = LightRagQuery;
