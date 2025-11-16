import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { incomingEmail, context = '' } = await request.json();

    if (!incomingEmail) {
      return Response.json(
        { error: 'Incoming email is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional email assistant. Generate a helpful response to this email. 
The response should be:
- Professional and courteous
- Directly address the concerns raised
- Actionable and clear
- Concise but complete

${context ? `Context about the sender or situation: ${context}` : ''}

Incoming email:
${incomingEmail}

Generate a response email. Provide only the email body, starting with an appropriate greeting.`;

    const { text: response } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    return Response.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
