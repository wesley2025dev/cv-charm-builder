import * as React from "react";
import { cn } from "@/lib/utils";
import { useInlineTypingAssist } from "@/hooks/useInlineTypingAssist";
import { Loader2, AlertTriangle, Sparkles, X } from "lucide-react";
import { Button } from "./button";

interface SmartTextareaProps extends Omit<React.ComponentProps<"textarea">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  fieldType?: "title" | "summary" | "description" | "skill" | "general";
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const SmartTextarea = React.forwardRef<HTMLTextAreaElement, SmartTextareaProps>(
  ({ className, value, onChange, fieldType = "general", showValidation = true, onValidationChange, ...props }, ref) => {
    const {
      ghostSuggestion,
      isProcessing,
      validationError,
      onTextChange,
      acceptSuggestion,
      dismissSuggestion,
      dismissValidationError,
    } = useInlineTypingAssist({ fieldType, minLengthForSuggestion: 10, debounceMs: 1000 });

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      onTextChange(value);
    }, [value, onTextChange]);

    React.useEffect(() => {
      onValidationChange?.(!validationError);
    }, [validationError, onValidationChange]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab" && ghostSuggestion && !e.shiftKey) {
        e.preventDefault();
        const newValue = value + ghostSuggestion;
        onChange(newValue);
        dismissSuggestion();
      }
    };

    const handleApplyCorrection = () => {
      if (validationError?.suggestion) {
        onChange(validationError.suggestion);
        dismissValidationError();
      }
    };

    return (
      <div className="relative">
        <div className="relative">
          <textarea
            ref={ref || textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
              validationError && showValidation && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            {...props}
          />

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Inline suggestion chip */}
        {ghostSuggestion && (
          <div className="mt-2 flex items-center gap-2 animate-fade-in">
            <div className="flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-1.5">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs text-accent">Suggestion:</span>
              <span className="text-xs font-medium text-foreground">...{ghostSuggestion}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs px-2"
              onClick={() => {
                onChange(value + ghostSuggestion);
                dismissSuggestion();
              }}
            >
              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">Tab</span>
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs px-2"
              onClick={dismissSuggestion}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Validation error */}
        {validationError && showValidation && (
          <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-destructive mb-1">Invalid Content</p>
                <p className="text-sm text-foreground">{validationError.reason}</p>
                {validationError.suggestion && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggested correction:</p>
                    <p className="text-sm bg-background/50 p-2 rounded border text-foreground">
                      {validationError.suggestion.slice(0, 200)}{validationError.suggestion.length > 200 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={handleApplyCorrection}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Apply Correction
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={dismissValidationError}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SmartTextarea.displayName = "SmartTextarea";

export { SmartTextarea };
