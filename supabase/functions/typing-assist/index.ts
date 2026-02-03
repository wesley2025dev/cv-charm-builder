import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, context, fieldType, validateOnly } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = validateOnly
      ? `You are a CV/resume content validator. Analyze the provided text for a ${context}.

Your task:
1. Check if the text makes logical sense for the given context
2. Check for gibberish, random characters, or meaningless content
3. Check for unprofessional language or inappropriate content
4. Check for obvious factual impossibilities

Respond in JSON format:
{
  "isValid": true/false,
  "validationError": "brief explanation if invalid, null if valid",
  "correctionSuggestion": "suggested correction if invalid and fixable, null otherwise"
}

Be strict about meaningless content but lenient with creative wording if it still makes professional sense.`
      : `You are a real-time CV/resume writing assistant. The user is typing ${context}.

Analyze the text and provide:
1. A brief, natural continuation suggestion (1-5 words max) that completes their thought professionally
2. Validate if the content makes sense and is appropriate

Current text: "${text}"

Respond in JSON format:
{
  "suggestion": "suggested continuation or null if current text is complete",
  "isValid": true/false,
  "validationError": "brief explanation if invalid, null if valid",
  "correctionSuggestion": "improved version of the text if it has issues, null otherwise"
}

Rules for suggestions:
- Only suggest if the text appears incomplete
- Keep suggestions short and professional
- Don't repeat what's already typed
- Return null for suggestion if text seems complete
- For job titles, suggest standard professional titles
- For descriptions, suggest action verbs and achievements

Validation rules:
- Invalid: gibberish, random characters, meaningless text
- Invalid: unprofessional or inappropriate language
- Invalid: logical impossibilities (e.g., "graduated in 2050")
- Valid: creative but meaningful professional content`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 402) {
        return new Response(
          JSON.stringify({ isValid: true, suggestion: null }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      const parsed = JSON.parse(content);
      return new Response(
        JSON.stringify({
          suggestion: parsed.suggestion || null,
          isValid: parsed.isValid !== false,
          validationError: parsed.validationError || null,
          correctionSuggestion: parsed.correctionSuggestion || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({ isValid: true, suggestion: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Typing assist error:", error);
    return new Response(
      JSON.stringify({ isValid: true, suggestion: null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
