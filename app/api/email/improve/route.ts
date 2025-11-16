import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { text, tone = 'professional' } = await request.json();

    if (!text) {
      return Response.json(
        { error: 'Email text is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert email editor. Improve the following email while maintaining its core message. 
Make it:
- More ${tone}
- Clear and concise
- Well-structured with proper paragraphs
- Engaging but not overly casual

Original email:
${text}

Provide only the improved email text, no explanations.`;

    const { text: improvedText } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    return Response.json({ improved: improvedText });
  } catch (error) {
    console.error('Error improving email:', error);
    return Response.json(
      { error: 'Failed to improve email' },
      { status: 500 }
    );
  }
}
