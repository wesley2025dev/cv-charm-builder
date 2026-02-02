import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Education } from "@/types/cv";

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
  validationMessage?: string | null;
  confidence: number;
  duplicateOf?: number | null;
  duplicateSimilarity?: number;
  duplicateMessage?: string | null;
}

interface ValidationState {
  isValidating: boolean;
  result: NormalizationResult | null;
  error: string | null;
}

export function useQualificationValidator() {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    result: null,
    error: null,
  });
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastInput = useRef<string>("");

  const validateQualification = useCallback(
    async (
      qualification: QualificationInput,
      existingQualifications: Education[]
    ): Promise<NormalizationResult | null> => {
      // Don't validate if essential fields are empty
      if (!qualification.degree.trim() || !qualification.institution.trim()) {
        setValidationState({ isValidating: false, result: null, error: null });
        return null;
      }

      // Create a hash of the input to detect changes
      const inputHash = JSON.stringify(qualification);
      if (inputHash === lastInput.current) {
        return validationState.result;
      }
      lastInput.current = inputHash;

      setValidationState((prev) => ({ ...prev, isValidating: true, error: null }));

      try {
        const { data, error } = await supabase.functions.invoke("normalize-qualification", {
          body: {
            qualification,
            existingQualifications: existingQualifications.map((edu) => ({
              degree: edu.degree,
              field: edu.field,
              institution: edu.institution,
              startDate: edu.startDate,
              endDate: edu.endDate,
              gpa: edu.gpa,
            })),
          },
        });

        if (error) {
          console.error("Validation error:", error);
          setValidationState({
            isValidating: false,
            result: null,
            error: "Failed to validate qualification",
          });
          return null;
        }

        const result = data as NormalizationResult;
        setValidationState({
          isValidating: false,
          result,
          error: null,
        });

        return result;
      } catch (error) {
        console.error("Validation error:", error);
        setValidationState({
          isValidating: false,
          result: null,
          error: "Failed to validate qualification",
        });
        return null;
      }
    },
    [validationState.result]
  );

  const validateWithDebounce = useCallback(
    (qualification: QualificationInput, existingQualifications: Education[], delay = 800) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Show loading state immediately
      setValidationState((prev) => ({ ...prev, isValidating: true }));

      debounceTimer.current = setTimeout(() => {
        validateQualification(qualification, existingQualifications);
      }, delay);
    },
    [validateQualification]
  );

  const clearValidation = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    lastInput.current = "";
    setValidationState({
      isValidating: false,
      result: null,
      error: null,
    });
  }, []);

  const checkLocalDuplicate = useCallback(
    (qualification: QualificationInput, existingQualifications: Education[]): Education | null => {
      // Quick local check before AI validation
      const normalizedDegree = qualification.degree.toLowerCase().trim();
      const normalizedField = qualification.field.toLowerCase().trim();
      const normalizedInstitution = qualification.institution.toLowerCase().trim();

      for (const existing of existingQualifications) {
        const existingDegree = existing.degree.toLowerCase().trim();
        const existingField = existing.field.toLowerCase().trim();
        const existingInstitution = existing.institution.toLowerCase().trim();

        // Exact match check
        if (
          existingDegree === normalizedDegree &&
          existingField === normalizedField &&
          existingInstitution === normalizedInstitution
        ) {
          return existing;
        }

        // Partial match check (same institution + similar degree/field)
        if (
          existingInstitution === normalizedInstitution &&
          (existingDegree.includes(normalizedDegree) || normalizedDegree.includes(existingDegree)) &&
          (existingField.includes(normalizedField) || normalizedField.includes(existingField))
        ) {
          return existing;
        }
      }

      return null;
    },
    []
  );

  return {
    validationState,
    validateQualification,
    validateWithDebounce,
    clearValidation,
    checkLocalDuplicate,
  };
}
