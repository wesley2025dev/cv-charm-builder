import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CorrectionResult {
  original: string;
  corrected: string;
  hasCorrections: boolean;
}

export function useAutoCorrect() {
  const [isChecking, setIsChecking] = useState(false);
  const [pendingCorrection, setPendingCorrection] = useState<CorrectionResult | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedRef = useRef<string>("");

  const correctText = useCallback(async (text: string): Promise<CorrectionResult> => {
    if (!text.trim() || text.length < 3) {
      return { original: text, corrected: text, hasCorrections: false };
    }

    try {
      const { data, error } = await supabase.functions.invoke("spell-check", {
        body: { text },
      });

      if (error) {
        console.error("Auto-correct error:", error);
        return { original: text, corrected: text, hasCorrections: false };
      }

      const corrected = data.correctedText || text;
      const hasCorrections = corrected.trim().toLowerCase() !== text.trim().toLowerCase();

      return { original: text, corrected, hasCorrections };
    } catch (error) {
      console.error("Auto-correct error:", error);
      return { original: text, corrected: text, hasCorrections: false };
    }
  }, []);

  const checkTextDebounced = useCallback((
    text: string,
    onResult: (result: CorrectionResult) => void,
    delay: number = 1500
  ) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Skip if text is too short or same as last checked
    if (!text.trim() || text.length < 10 || text === lastCheckedRef.current) {
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsChecking(true);
      lastCheckedRef.current = text;
      
      const result = await correctText(text);
      
      if (result.hasCorrections) {
        setPendingCorrection(result);
        onResult(result);
      }
      
      setIsChecking(false);
    }, delay);
  }, [correctText]);

  const applyCorrection = useCallback(() => {
    const correction = pendingCorrection;
    setPendingCorrection(null);
    return correction?.corrected || null;
  }, [pendingCorrection]);

  const dismissCorrection = useCallback(() => {
    setPendingCorrection(null);
  }, []);

  const clearPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setPendingCorrection(null);
    lastCheckedRef.current = "";
  }, []);

  return {
    isChecking,
    pendingCorrection,
    correctText,
    checkTextDebounced,
    applyCorrection,
    dismissCorrection,
    clearPending,
  };
}
