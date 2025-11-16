import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { subject, body, recipientName } = await request.json();

    const prompt = `You are an expert email writer. Given the following email information, generate a professional, polished version that sounds natural and is ready to send.

Subject: ${subject}
Initial message: ${body}
${recipientName ? `Recipient name: ${recipientName}` : ''}

Generate a refined version of this email that:
- Maintains the original intent and tone
- Is professional but personable
- Uses proper greeting and closing
- Is concise but complete
- Sounds authentic, not robotic

Provide only the email body text, ready to send.`;

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    return Response.json({ draft: text });
  } catch (error) {
    console.error('Error generating draft:', error);
    return Response.json(
      { error: 'Failed to generate draft' },
      { status: 500 }
    );
  }
}
