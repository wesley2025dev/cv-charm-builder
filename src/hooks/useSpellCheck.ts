import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CVData } from "@/types/cv";

export function useSpellCheck() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAndCorrectText = useCallback(async (text: string): Promise<string> => {
    if (!text.trim()) return text;

    try {
      const { data, error } = await supabase.functions.invoke("spell-check", {
        body: { text },
      });

      if (error) {
        console.error("Spell check error:", error);
        toast.error("Failed to check spelling");
        return text;
      }

      return data.correctedText || text;
    } catch (error) {
      console.error("Spell check error:", error);
      return text;
    }
  }, []);

  const correctCVData = useCallback(async (cvData: CVData): Promise<CVData> => {
    setIsChecking(true);
    
    try {
      const correctedData = { ...cvData };

      // Correct personal info fields
      if (cvData.personalInfo.summary) {
        correctedData.personalInfo = {
          ...correctedData.personalInfo,
          summary: await checkAndCorrectText(cvData.personalInfo.summary),
        };
      }

      // Correct experience descriptions
      const correctedExperience = await Promise.all(
        cvData.experience.map(async (exp) => ({
          ...exp,
          description: exp.description ? await checkAndCorrectText(exp.description) : exp.description,
        }))
      );
      correctedData.experience = correctedExperience;

      toast.success("AI has polished your CV content!");
      return correctedData;
    } catch (error) {
      console.error("CV correction error:", error);
      toast.error("Failed to polish CV content");
      return cvData;
    } finally {
      setIsChecking(false);
    }
  }, [checkAndCorrectText]);

  return { correctCVData, checkAndCorrectText, isChecking };
}
