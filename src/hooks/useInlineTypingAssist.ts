import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ValidationResult {
  isValid: boolean;
  reason?: string;
  suggestion?: string;
}

interface TypingAssistState {
  ghostSuggestion: string | null;
  isProcessing: boolean;
  validationError: ValidationResult | null;
  lastValidatedText: string;
}

interface UseInlineTypingAssistOptions {
  fieldType?: "title" | "summary" | "description" | "skill" | "general";
  minLengthForSuggestion?: number;
  debounceMs?: number;
}

export function useInlineTypingAssist(options: UseInlineTypingAssistOptions = {}) {
  const {
    fieldType = "general",
    minLengthForSuggestion = 8,
    debounceMs = 600,
  } = options;

  const [state, setState] = useState<TypingAssistState>({
    ghostSuggestion: null,
    isProcessing: false,
    validationError: null,
    lastValidatedText: "",
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastTextRef = useRef<string>("");

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const getTypingContext = (type: string) => {
    switch (type) {
      case "title":
        return "professional job title for a CV/resume (e.g., 'Senior Software Engineer', 'Marketing Director')";
      case "summary":
        return "professional summary section of a CV/resume - should be clear, impactful, and professional";
      case "description":
        return "job description or responsibility in a CV/resume - use action verbs and quantifiable achievements";
      case "skill":
        return "professional skill or competency for a CV/resume";
      default:
        return "professional content for a CV/resume";
    }
  };

  const processText = useCallback(async (text: string): Promise<{
    suggestion: string | null;
    validation: ValidationResult;
  }> => {
    if (!text.trim() || text.length < minLengthForSuggestion) {
      return { suggestion: null, validation: { isValid: true } };
    }

    try {
      const { data, error } = await supabase.functions.invoke("typing-assist", {
        body: {
          text,
          context: getTypingContext(fieldType),
          fieldType,
        },
      });

      if (error) {
        console.error("Typing assist error:", error);
        return { suggestion: null, validation: { isValid: true } };
      }

      return {
        suggestion: data.suggestion || null,
        validation: {
          isValid: data.isValid !== false,
          reason: data.validationError,
          suggestion: data.correctionSuggestion,
        },
      };
    } catch (error) {
      console.error("Typing assist error:", error);
      return { suggestion: null, validation: { isValid: true } };
    }
  }, [fieldType, minLengthForSuggestion]);

  const onTextChange = useCallback((text: string) => {
    // Clear previous timer and abort any ongoing request
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    // Skip if text is too short or unchanged
    if (!text.trim() || text.length < minLengthForSuggestion) {
      setState(prev => ({
        ...prev,
        ghostSuggestion: null,
        validationError: null,
      }));
      return;
    }

    // Skip if text ends with space (user is typing a new word)
    const shouldProcess = text !== lastTextRef.current && !text.endsWith(" ");
    
    if (!shouldProcess) {
      lastTextRef.current = text;
      return;
    }

    lastTextRef.current = text;

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();
      setState(prev => ({ ...prev, isProcessing: true }));

      const result = await processText(text);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        ghostSuggestion: result.suggestion,
        validationError: result.validation.isValid ? null : result.validation,
        lastValidatedText: text,
      }));
    }, debounceMs);
  }, [minLengthForSuggestion, debounceMs, processText]);

  const acceptSuggestion = useCallback(() => {
    const suggestion = state.ghostSuggestion;
    setState(prev => ({
      ...prev,
      ghostSuggestion: null,
    }));
    return suggestion;
  }, [state.ghostSuggestion]);

  const dismissSuggestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      ghostSuggestion: null,
    }));
  }, []);

  const dismissValidationError = useCallback(() => {
    setState(prev => ({
      ...prev,
      validationError: null,
    }));
  }, []);

  const validateBeforeSave = useCallback(async (text: string): Promise<ValidationResult> => {
    if (!text.trim()) {
      return { isValid: true };
    }

    // If we already validated this exact text, return cached result
    if (text === state.lastValidatedText && state.validationError) {
      return state.validationError;
    }

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const { data, error } = await supabase.functions.invoke("typing-assist", {
        body: {
          text,
          context: getTypingContext(fieldType),
          fieldType,
          validateOnly: true,
        },
      });

      const validation: ValidationResult = {
        isValid: !error && data?.isValid !== false,
        reason: data?.validationError,
        suggestion: data?.correctionSuggestion,
      };

      setState(prev => ({
        ...prev,
        isProcessing: false,
        validationError: validation.isValid ? null : validation,
        lastValidatedText: text,
      }));

      return validation;
    } catch (error) {
      setState(prev => ({ ...prev, isProcessing: false }));
      return { isValid: true };
    }
  }, [fieldType, state.lastValidatedText, state.validationError]);

  const reset = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setState({
      ghostSuggestion: null,
      isProcessing: false,
      validationError: null,
      lastValidatedText: "",
    });
    lastTextRef.current = "";
  }, []);

  return {
    ...state,
    onTextChange,
    acceptSuggestion,
    dismissSuggestion,
    dismissValidationError,
    validateBeforeSave,
    reset,
  };
}
