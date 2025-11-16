import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json(
        { error: 'Email text is required' },
        { status: 400 }
      );
    }

    const prompt = `Summarize the following email in 1-2 sentences for a subject line. Be concise and capture the main point.

Email:
${text}

Provide only the subject line, no quotes or explanations.`;

    const { text: summary } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.5,
      maxTokens: 100,
    });

    return Response.json({ summary });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return Response.json(
      { error: 'Failed to summarize email' },
      { status: 500 }
    );
  }
}
