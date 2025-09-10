import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en' } = await req.json();
    
    console.log('Received chat request:', { message, language });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompts = {
      en: `You are a helpful AI assistant for Danova Visas, a global visa services company. You specialize in providing information about visa applications, requirements, processing times, and general guidance for Tourist, Student, Work, Business & Family Visas. You provide friendly, professional support to clients. Keep responses concise and helpful. If you cannot help with something specific, suggest they contact human support or apply through the official channels. Always be encouraging about their visa journey.`,
      es: `Eres un asistente de IA útil para Danova Visas, una empresa global de servicios de visa. Te especializas en proporcionar información sobre solicitudes de visa, requisitos, tiempos de procesamiento y orientación general para visas de Turista, Estudiante, Trabajo, Negocios y Familia. Proporcionas soporte amigable y profesional a los clientes. Mantén las respuestas concisas y útiles. Si no puedes ayudar con algo específico, sugiere que contacten con soporte humano o apliquen a través de los canales oficiales. Siempre sé alentador sobre su proceso de visa.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});