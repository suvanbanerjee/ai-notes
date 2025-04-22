import { GoogleGenerativeAI } from '@google/generative-ai';

// Access API key
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

// Create a client with the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Function to get a summary of a note
export async function summarizeNote(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
    Please provide a concise summary of the following note:
    
    "${content}"
    
    Write the summary in 3-5 sentences, highlighting the key points.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error summarizing note:', error);
    return 'Unable to generate summary at this time.';
  }
}