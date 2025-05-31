import { InferenceClient } from '@huggingface/inference';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_API_KEY);

export const getCodeSuggestions = async (prompt) => {
  try {
    const response = await hfClient.chatCompletion({
      provider: 'auto',
      model: 'deepseek-ai/DeepSeek-V3-0324',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching code suggestions:', error);
    return '';
  }
};

export const executeCode = async (code, language, terminalLines) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: language.id,
        stdin: terminalLines.filter(l => l.type === 'input').map(l => l.text).join('\n'),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    let outputText = '';
    
    if (result.stdout) outputText += result.stdout;
    if (result.stderr) outputText += result.stderr;
    if (result.compile_output) outputText += `Compilation Output:\n${result.compile_output}`;
    if (!outputText && result.status && result.status.description) {
      outputText = `Status: ${result.status.description}`;
    }

    return outputText || 'No output';
  } catch (error) {
    throw new Error(`${error.message}\n\nMake sure the backend server is running on http://localhost:8000`);
  }
};

export const isInteractiveLanguage = (languageName) => {
  return ['Python', 'Java', 'C', 'C++'].includes(languageName);
};

export const getChatResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Create system prompt to guide AI behavior
    const systemPrompt = {
      role: 'system',
      content: `You are a helpful AI coding assistant. You can help with programming questions, code explanations, debugging, and general coding assistance. 

When responding:
- If the user asks for code, wrap it in code blocks with the appropriate language identifier (e.g., \`\`\`javascript, \`\`\`python, etc.)
- For explanations, use clear and concise language
- Be helpful and informative
- If asked to debug code, provide specific suggestions
- Keep responses focused on programming and development topics`
    };

    // Prepare messages including conversation history
    const messages = [
      systemPrompt,
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await hfClient.chatCompletion({
      provider: 'auto',
      model: 'deepseek-ai/DeepSeek-V3-0324',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again.';
  }
};
