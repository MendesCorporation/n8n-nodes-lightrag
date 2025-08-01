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
      },
      timeout: 10000,
    },
  };

  // Autenticação para todos os requests do node - adiciona query parameter
  authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const apiKey = credentials.apiKey as string;
    
    if (apiKey?.trim()) {
      // Adiciona api_key_header_value como query parameter na URL
      const url = new URL(requestOptions.url!, requestOptions.baseURL || credentials.url as string);
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