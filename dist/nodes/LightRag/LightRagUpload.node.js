"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightRagUpload = void 0;
class LightRagUpload {
    constructor() {
        this.description = {
            displayName: 'LightRAG Upload',
            name: 'LightRagUpload',
            icon: 'file:lightRag.svg',
            group: ['transform'],
            version: 1,
            description: 'Upload file to LightRAG for indexing',
            defaults: {
                name: 'LightRAG Upload',
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
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    placeholder: 'data',
                    default: 'data',
                    description: 'Name of the binary property that contains the file to upload',
                    required: true,
                },
            ],
        };
    }
    async execute() {
        var _a;
        // 1) Credenciais e parâmetros
        const creds = (await this.getCredentials('lightRagApi'));
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
        // 2) Recupera o binário do item
        const item = this.getInputData()[0];
        if (!item.binary || !item.binary[binaryPropertyName]) {
            throw new Error(`Binary data "${binaryPropertyName}" not found on item`);
        }
        // 3) Monta o buffer e metadata
        const binaryData = await this.helpers.getBinaryDataBuffer(0, binaryPropertyName);
        const filename = item.binary[binaryPropertyName].fileName || 'file.dat';
        const mimeType = item.binary[binaryPropertyName].mimeType || 'application/octet-stream';
        // 4) Prepara formData
        const formData = {
            file: {
                value: binaryData,
                options: {
                    filename,
                    contentType: mimeType,
                },
            },
        };
        // 5) URL e autenticação
        let uploadUrl = `${creds.url.replace(/\/$/, '')}/documents/upload`;
        if ((_a = creds.apiKey) === null || _a === void 0 ? void 0 : _a.trim()) {
            uploadUrl += `?api_key_header_value=${encodeURIComponent(creds.apiKey)}`;
        }
        // 6) Chamada HTTP multipart
        const response = await this.helpers.request({
            method: 'POST',
            uri: uploadUrl,
            formData,
            json: true,
        } /* o n8n typings não expõe formData, mas funciona */);
        // 7) Retorna JSON
        return [this.helpers.returnJsonArray(response)];
    }
}
exports.LightRagUpload = LightRagUpload;
