import { ModelConfig } from '../components/ConfiguratorPage/Viewer/defaults';

export const getStyleSuggestion = async (prompt: string): Promise<ModelConfig[]> => {
  console.log('Sending prompt:', prompt);
  
  const response = await fetch('/api/style', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API error:', errorData);
    throw new Error('Failed to get style suggestion');
  }

  const result = await response.json();
  console.log('API response:', result);
  
  if (!result.configs) {
    console.error('Missing configs in response:', result);
    throw new Error('Invalid response format');
  }

  return result.configs;
}; 