import { AlertCircle, CheckCircle2, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationResult {
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

interface QualificationValidationFeedbackProps {
  isValidating: boolean;
  result: ValidationResult | null;
  error: string | null;
  onApplyNormalized?: () => void;
  onDismissDuplicate?: () => void;
  hasChanges?: boolean;
}

export function QualificationValidationFeedback({
  isValidating,
  result,
  error,
  onApplyNormalized,
  onDismissDuplicate,
  hasChanges = false,
}: QualificationValidationFeedbackProps) {
  if (!isValidating && !result && !error) {
    return null;
  }

  if (isValidating) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-muted-foreground text-sm animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Validating qualification...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Duplicate warning - highest priority
  if (result.duplicateOf || (result.duplicateSimilarity && result.duplicateSimilarity > 0.7)) {
    return (
      <div className="space-y-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
        <div className="flex items-start gap-2 text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-sm">
              {result.duplicateOf ? "Duplicate Qualification Detected" : "Similar Qualification Found"}
            </p>
            <p className="text-sm opacity-90">
              {result.duplicateMessage || "This appears to be a duplicate of an existing qualification."}
            </p>
          </div>
        </div>
        {onDismissDuplicate && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={onDismissDuplicate}
              className="text-xs px-3 py-1.5 rounded bg-warning/20 hover:bg-warning/30 transition-colors text-warning-foreground"
            >
              Add Anyway
            </button>
          </div>
        )}
      </div>
    );
  }

  // Invalid qualification
  if (!result.isValid) {
    return (
      <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-sm">Invalid Qualification</p>
          <p className="text-sm opacity-90">{result.validationMessage}</p>
        </div>
      </div>
    );
  }

  // Normalization suggestions available
  if (hasChanges && result.confidence > 0.7) {
    return (
      <div className="space-y-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-2 text-accent-foreground">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
          <div className="space-y-2 flex-1">
            <p className="font-medium text-sm">AI-Suggested Improvements</p>
            <div className="text-sm space-y-1 text-muted-foreground">
              {result.normalized.degree && (
                <p>
                  <span className="font-medium">Degree:</span> {result.normalized.degree}
                </p>
              )}
              {result.normalized.field && (
                <p>
                  <span className="font-medium">Field:</span> {result.normalized.field}
                </p>
              )}
              {result.normalized.institution && (
                <p>
                  <span className="font-medium">Institution:</span> {result.normalized.institution}
                </p>
              )}
            </div>
            {onApplyNormalized && (
              <button
                onClick={onApplyNormalized}
                className="text-xs px-3 py-1.5 rounded bg-accent hover:bg-accent/80 transition-colors text-accent-foreground font-medium"
              >
                Apply Suggestions
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // All good
  if (result.isValid && result.confidence > 0.8) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Qualification looks good!</span>
      </div>
    );
  }

  return null;
}
