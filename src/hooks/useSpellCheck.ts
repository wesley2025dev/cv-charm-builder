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

      // Correct personal info fields in parallel
      const [correctedTitle, correctedSummary] = await Promise.all([
        cvData.personalInfo.title ? checkAndCorrectText(cvData.personalInfo.title) : cvData.personalInfo.title,
        cvData.personalInfo.summary ? checkAndCorrectText(cvData.personalInfo.summary) : cvData.personalInfo.summary,
      ]);

      correctedData.personalInfo = {
        ...correctedData.personalInfo,
        title: correctedTitle,
        summary: correctedSummary,
      };

      // Correct all experience fields including highlights
      const correctedExperience = await Promise.all(
        cvData.experience.map(async (exp) => {
          const [correctedPosition, correctedDescription, correctedHighlights] = await Promise.all([
            exp.position ? checkAndCorrectText(exp.position) : exp.position,
            exp.description ? checkAndCorrectText(exp.description) : exp.description,
            Promise.all(exp.highlights.map(async (h) => h ? await checkAndCorrectText(h) : h)),
          ]);

          return {
            ...exp,
            position: correctedPosition,
            description: correctedDescription,
            highlights: correctedHighlights,
          };
        })
      );
      correctedData.experience = correctedExperience;

      // Correct education fields
      const correctedEducation = await Promise.all(
        cvData.education.map(async (edu) => {
          const [correctedDegree, correctedField] = await Promise.all([
            edu.degree ? checkAndCorrectText(edu.degree) : edu.degree,
            edu.field ? checkAndCorrectText(edu.field) : edu.field,
          ]);

          return {
            ...edu,
            degree: correctedDegree,
            field: correctedField,
          };
        })
      );
      correctedData.education = correctedEducation;

      // Correct skills
      const correctedSkills = await Promise.all(
        cvData.skills.map(async (skill) => skill ? await checkAndCorrectText(skill) : skill)
      );
      correctedData.skills = correctedSkills;

      toast.success("AI has polished your entire CV!");
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
