const API_URL = 'https://n8n.offerwise.com/webhook/bot-ia';

export interface ApiResponse {
    output: string; // Adjust based on actual n8n response structure
    [key: string]: any;
}

export const sendMessageToBot = async (text: string, sessionId: string): Promise<string> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': '9ed7996eca9240a74e8ebcaf677338d5'
            },
            body: JSON.stringify({
                message: text,
                sessionId: sessionId
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Assuming the n8n workflow returns a JSON with an 'output' or 'text' field
        // We need to be flexible here as the user didn't specify the exact response schema
        // but mentioned "receba a resposta da IA com o await em formato json"
        return data.output || data.text || data.message || JSON.stringify(data);
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
