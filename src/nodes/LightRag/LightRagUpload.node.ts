import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodeProperties,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import * as fs from 'fs';

export class LightRagUpload implements INodeType {
  description: INodeTypeDescription = {
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
      { type: NodeConnectionType.Main, displayName: 'Input' },
    ],
    outputs: [
      { type: NodeConnectionType.Main, displayName: 'Output' },
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
      } as INodeProperties,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // 1) Credenciais e parâmetros
    const creds = (await this.getCredentials('lightRagApi')) as { url: string; apiKey?: string };
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;

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
    const formData: IDataObject = {
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
    if (creds.apiKey?.trim()) {
      uploadUrl += `?api_key_header_value=${encodeURIComponent(creds.apiKey)}`;
    }

    // 6) Chamada HTTP multipart
    const response = await this.helpers.request({
      method: 'POST',
      uri: uploadUrl,
      formData,
      json: true,
    } as any /* o n8n typings não expõe formData, mas funciona */);

    // 7) Retorna JSON
    return [this.helpers.returnJsonArray(response)];
  }
}
