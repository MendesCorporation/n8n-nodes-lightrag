"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightRagApi = void 0;
class LightRagApi {
    constructor() {
        this.name = 'lightRagApi';
        this.displayName = 'LightRAG API';
        this.properties = [
            {
                displayName: 'API Base URL',
                name: 'url',
                type: 'string',
                default: 'http://localhost:9621',
                placeholder: 'http://your-lightRag-server:9621',
                description: 'Base URL of your LightRAG instance',
            },
            {
                displayName: 'API Key (Optional)',
                name: 'apiKey',
                type: 'string',
                default: '',
                description: 'Optional API key if secured',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.url}}',
                // Adiciona api_key_header_value como query parameter se existir
                url: '=/health{{$credentials.apiKey ? `?api_key_header_value=${$credentials.apiKey}` : ``}}',
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
                timeout: 10000,
            },
        };
    }
    // Autenticação para todos os requests do node - adiciona query parameter
    authenticate(credentials, requestOptions) {
        const apiKey = credentials.apiKey;
        if (apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()) {
            // Adiciona api_key_header_value como query parameter na URL
            const url = new URL(requestOptions.url, requestOptions.baseURL || credentials.url);
            url.searchParams.set('api_key_header_value', apiKey.trim());
            requestOptions.url = url.pathname + url.search;
        }
        // Garante o header accept
        requestOptions.headers = {
            accept: 'application/json',
            ...requestOptions.headers,
        };
        return Promise.resolve(requestOptions);
    }
}
exports.LightRagApi = LightRagApi;
