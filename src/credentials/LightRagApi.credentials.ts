import {
  ICredentialType,
  ICredentialTestRequest,
  ICredentialDataDecryptedObject,
  INodeProperties,
  IHttpRequestOptions,
} from 'n8n-workflow';

export class LightRagApi implements ICredentialType {
  name = 'lightRagApi';
  displayName = 'LightRAG API';
  properties: INodeProperties[] = [
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

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url}}',
      // Adiciona api_key_header_value como query parameter se existir
      url: '=/health{{$credentials.apiKey ? `?api_key_header_value=${$credentials.apiKey}` : ``}}',
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': '={{$credentials.apiKey}}',
      },
      timeout: 10000,
    },
  };

  // Autenticação para todos os requests do node - adiciona header X-API-Key
  authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const apiKey = credentials.apiKey as string;

    if (apiKey?.trim()) {
      // Garante o header accept e adiciona X-API-Key
      requestOptions.headers = {
        accept: 'application/json',
        'X-API-Key': apiKey.trim(), // Adiciona o apiKey como header
        ...requestOptions.headers,
      };
    } else {
      // Garante o header accept apenas se não houver apiKey
      requestOptions.headers = {
        accept: 'application/json',
        ...requestOptions.headers,
      };
    }

    return Promise.resolve(requestOptions);
  }
}