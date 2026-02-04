import * as React from "react";
import { cn } from "@/lib/utils";
import { useInlineTypingAssist } from "@/hooks/useInlineTypingAssist";
import { Loader2, AlertTriangle, Sparkles, Check, X } from "lucide-react";
import { Button } from "./button";

interface SmartInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  fieldType?: "title" | "summary" | "description" | "skill" | "general";
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ className, value, onChange, fieldType = "general", showValidation = true, onValidationChange, ...props }, ref) => {
    const {
      ghostSuggestion,
      isProcessing,
      validationError,
      onTextChange,
      acceptSuggestion,
      dismissSuggestion,
      dismissValidationError,
    } = useInlineTypingAssist({ fieldType, minLengthForSuggestion: 5, debounceMs: 800 });

    const inputRef = React.useRef<HTMLInputElement>(null);

    const onValidationChangeRef = React.useRef(onValidationChange);
    onValidationChangeRef.current = onValidationChange;

    React.useEffect(() => {
      onTextChange(value);
    }, [value]); // Remove onTextChange from deps - it's stable via useCallback

    React.useEffect(() => {
      onValidationChangeRef.current?.(!validationError);
    }, [validationError]); // Use ref to avoid dependency on callback

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && ghostSuggestion) {
        e.preventDefault();
        const newValue = value + ghostSuggestion;
        onChange(newValue);
        dismissSuggestion();
      }
    };

    const handleAcceptSuggestion = () => {
      if (ghostSuggestion) {
        onChange(value + ghostSuggestion);
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
          <input
            ref={ref || inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              validationError && showValidation && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            {...props}
          />
          
          {/* Ghost suggestion overlay */}
          {ghostSuggestion && value && (
            <div className="absolute inset-0 pointer-events-none flex items-center px-3">
              <span className="invisible">{value}</span>
              <span className="text-muted-foreground/40 italic">{ghostSuggestion}</span>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Suggestion hint */}
        {ghostSuggestion && (
          <div className="absolute right-0 -bottom-6 flex items-center gap-1 text-xs text-muted-foreground animate-fade-in">
            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Tab</span>
            <span>to accept</span>
          </div>
        )}

        {/* Validation error */}
        {validationError && showValidation && (
          <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-destructive mb-1">Invalid Entry</p>
                <p className="text-sm text-foreground">{validationError.reason}</p>
                {validationError.suggestion && (
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={handleApplyCorrection}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Use: {validationError.suggestion.slice(0, 30)}{validationError.suggestion.length > 30 ? "..." : ""}
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SmartInput.displayName = "SmartInput";

export { SmartInput };
