import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodeProperties,
  ICredentialDataDecryptedObject,
  IHttpRequestOptions,
  NodeConnectionType,
} from 'n8n-workflow';
import { text } from 'stream/consumers';

export class LightRagToolInsertText implements INodeType {
    description: INodeTypeDescription = {
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
                type: NodeConnectionType.AiAgent,
                required: true,
            },
        ],
        outputs: [
            {
                displayName: 'Tool',
                type: NodeConnectionType.AiVectorStore,
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
        ] as INodeProperties[],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = (await this.getCredentials(
            'lightRagApi',
        )) as { url: string; apiKey?: string };
        const file_source = this.getNodeParameter('file_source', 0) as string;
        const text = this.getNodeParameter('text', 0) as string;

        const body: any = {
            file_source,
            text,
        };

        const headers: Record<string, string> = {
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
