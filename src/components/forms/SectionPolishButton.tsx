import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2, Check, Undo2 } from "lucide-react";
import { useSpellCheck } from "@/hooks/useSpellCheck";
import { toast } from "sonner";

interface SectionPolishButtonProps {
  fields: Array<{ value: string; onUpdate: (value: string) => void }>;
  sectionName: string;
  variant?: "ghost" | "outline";
  size?: "sm" | "default";
}

export function SectionPolishButton({ 
  fields, 
  sectionName,
  variant = "ghost",
  size = "sm"
}: SectionPolishButtonProps) {
  const [isPolishing, setIsPolishing] = useState(false);
  const [justPolished, setJustPolished] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const previousValuesRef = useRef<string[]>([]);
  const { checkAndCorrectText } = useSpellCheck();

  const hasContent = fields.some(f => f.value?.trim());

  const handlePolish = async () => {
    if (!hasContent) {
      toast.info("No content to polish in this section");
      return;
    }

    // Store previous values for undo
    previousValuesRef.current = fields.map(f => f.value);

    setIsPolishing(true);
    setJustPolished(false);
    setCanUndo(false);

    try {
      const corrections = await Promise.all(
        fields.map(async (field) => {
          if (!field.value?.trim()) return field.value;
          return await checkAndCorrectText(field.value);
        })
      );

      // Apply corrections
      let hasChanges = false;
      corrections.forEach((corrected, index) => {
        if (corrected !== fields[index].value) {
          fields[index].onUpdate(corrected);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        toast.success(`${sectionName} polished!`);
        setJustPolished(true);
        setCanUndo(true);
        setTimeout(() => setJustPolished(false), 2000);
      } else {
        toast.info(`${sectionName} looks good already!`);
      }
    } catch (error) {
      console.error("Section polish error:", error);
      toast.error(`Failed to polish ${sectionName}`);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleUndo = () => {
    previousValuesRef.current.forEach((value, index) => {
      if (fields[index]) {
        fields[index].onUpdate(value);
      }
    });
    setCanUndo(false);
    toast.success(`Reverted ${sectionName} changes`);
  };

  if (!hasContent) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={variant}
        size={size}
        onClick={handlePolish}
        disabled={isPolishing}
        className="gap-1.5"
      >
        {isPolishing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Polishing...</span>
          </>
        ) : justPolished ? (
          <>
            <Check className="h-3.5 w-3.5 text-accent" />
            <span>Polished!</span>
          </>
        ) : (
          <>
            <Wand2 className="h-3.5 w-3.5" />
            <span>Polish Section</span>
          </>
        )}
      </Button>
      {canUndo && (
        <Button
          variant="ghost"
          size={size}
          onClick={handleUndo}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Undo2 className="h-3.5 w-3.5" />
          <span>Undo</span>
        </Button>
      )}
    </div>
  );
}
