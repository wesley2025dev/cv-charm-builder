import { cvTemplates, TemplateId } from "@/types/templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cvTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            "relative p-4 rounded-xl border-2 transition-all duration-200 text-left group",
            selectedTemplate === template.id
              ? "border-accent bg-accent/5 shadow-glow"
              : "border-border hover:border-accent/50 hover:bg-muted/50"
          )}
        >
          {selectedTemplate === template.id && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-accent-foreground" />
            </div>
          )}
          
          <div className="text-3xl mb-2">{template.preview}</div>
          <h3 className="font-semibold text-sm text-foreground mb-1">{template.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        </button>
      ))}
    </div>
  );
}
