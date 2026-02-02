import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QualificationInput {
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface NormalizationResult {
  normalized: {
    degree: string;
    field: string;
    institution: string;
  };
  isValid: boolean;
  validationMessage?: string;
  confidence: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { qualification, existingQualifications }: { 
      qualification: QualificationInput; 
      existingQualifications?: QualificationInput[];
    } = await req.json();

    if (!qualification) {
      return new Response(
        JSON.stringify({ error: "Qualification data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const existingList = existingQualifications?.length 
      ? `\n\nExisting qualifications in the user's profile:\n${existingQualifications.map((q, i) => 
          `${i + 1}. ${q.degree} in ${q.field} from ${q.institution} (${q.startDate} - ${q.endDate})`
        ).join('\n')}`
      : '';

    const prompt = `Analyze this education/qualification entry and respond with JSON only:

Input:
- Degree: "${qualification.degree}"
- Field of Study: "${qualification.field}"
- Institution: "${qualification.institution}"
- Start Date: "${qualification.startDate}"
- End Date: "${qualification.endDate}"
${qualification.gpa ? `- GPA: "${qualification.gpa}"` : ''}
${existingList}

Tasks:
1. NORMALIZE: Fix spelling, grammar, and standardize the degree/field/institution names
   - "Bsc Computer Sci" → "BSc Computer Science"
   - "Havard" → "Harvard"
   - "Bachelors" → "Bachelor's"
   - Capitalize properly, expand abbreviations where helpful

2. VALIDATE: Check if this makes logical sense as an educational qualification
   - Is the degree type real? (BSc, BA, MBA, PhD, etc.)
   - Is the field of study a real academic discipline?
   - Does the institution name seem like a real school/university?
   - Are the dates logical (start before end)?

3. DUPLICATE CHECK: If existing qualifications provided, check for duplicates/similarities
   - Same degree + same field + same institution = definite duplicate
   - Similar degree + same/similar field + same institution = likely duplicate
   - Consider normalized versions for comparison

Respond ONLY with this JSON structure (no markdown, no explanation):
{
  "normalized": {
    "degree": "standardized degree name",
    "field": "standardized field of study",
    "institution": "standardized institution name"
  },
  "isValid": true/false,
  "validationMessage": "message if invalid or has issues (null if valid)",
  "confidence": 0.0-1.0,
  "duplicateOf": null or index number (1-based) of the existing qualification it duplicates,
  "duplicateSimilarity": 0.0-1.0 if similar to existing,
  "duplicateMessage": "message about the duplicate if found"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an education credential validation expert. You normalize academic qualifications to standard formats and detect duplicates. Always respond with valid JSON only, no markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response, handling potential markdown wrapping
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a fallback with original values
      result = {
        normalized: {
          degree: qualification.degree,
          field: qualification.field,
          institution: qualification.institution,
        },
        isValid: true,
        validationMessage: null,
        confidence: 0.5,
        duplicateOf: null,
        duplicateSimilarity: 0,
        duplicateMessage: null,
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Normalize qualification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
