import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoCorrectSuggestionProps {
  isChecking?: boolean;
  original?: string;
  corrected?: string;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

export function AutoCorrectSuggestion({
  isChecking,
  original,
  corrected,
  onApply,
  onDismiss,
  className,
}: AutoCorrectSuggestionProps) {
  if (isChecking) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground animate-fade-in", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Checking spelling...</span>
      </div>
    );
  }

  if (!corrected || !original) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border border-accent/30 bg-accent/5 p-3 animate-fade-in", className)}>
      <div className="flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-accent mb-1">AI Suggestion</p>
          <p className="text-sm text-foreground leading-relaxed break-words">{corrected}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 ml-6">
        <Button
          size="sm"
          variant="accent"
          className="h-7 text-xs"
          onClick={onApply}
        >
          <Check className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          onClick={onDismiss}
        >
          <X className="h-3 w-3 mr-1" />
          Dismiss
        </Button>
      </div>
    </div>
  );
}
