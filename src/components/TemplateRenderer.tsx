import { CVData } from "@/types/cv";
import { TemplateId } from "@/types/templates";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { BoldTemplate } from "./templates/BoldTemplate";

interface TemplateRendererProps {
  data: CVData;
  templateId: TemplateId;
}

export function TemplateRenderer({ data, templateId }: TemplateRendererProps) {
  const { personalInfo, experience, education, skills } = data;
  const hasContent = personalInfo.fullName || experience.length > 0 || education.length > 0 || skills.length > 0;

  if (!hasContent) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-muted/30 rounded-lg p-8">
        <div className="text-center text-muted-foreground">
          <div className="mb-4 text-6xl">📄</div>
          <h3 className="font-semibold mb-2">Your CV Preview</h3>
          <p className="text-sm">Start filling in your details to see your CV come to life!</p>
        </div>
      </div>
    );
  }

  switch (templateId) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "bold":
      return <BoldTemplate data={data} />;
    default:
      return <ModernTemplate data={data} />;
  }
}
