import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a helpful AI assistant for EternaInvite, a digital wedding invitation platform. 
Your goal is to help users understand how to use the platform to create, edit, and share their wedding invitations.

Key features of EternaInvite:
- Digital Invitations: Modern, elegant, and eco-friendly.
- Custom Themes: Many themes like Elegant, Floral, Modern, Rustic, Luxury, etc.
- Interactive Maps: Integrated Google Maps for venue location.
- RSVP Management: Real-time attendance confirmation from guests.
- Background Music: Choose from a library or upload your own.
- Photo Gallery: Share your special moments with guests.
- Social Media Links: Integration with Instagram, Facebook, and Twitter.
- Custom Fonts & Colors: Personalize your invitation to match your wedding style.

Pricing:
- Basic: Free (Limited features)
- Premium: Rp 149.000 (All features, no ads, custom domain)
- Professional: Rp 299.000 (Priority support, custom design assistance)

Be polite, professional, and helpful. Use Indonesian as the primary language. 
If a user asks something very specific that you cannot answer, suggest they contact the human admin via the WhatsApp button on the page.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    
    // transform messages into @google/genai contents list
    const contents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text || "Maaf, saya mengalami kendala teknis. Silakan coba lagi nanti.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Maaf, layanan AI sedang tidak tersedia saat ini. Silakan hubungi admin via WhatsApp.", details: error.message },
      { status: 500 }
    );
  }
}
