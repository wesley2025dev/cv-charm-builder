import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { ReferencesForm } from "@/components/forms/ReferencesForm";
import { TemplateRenderer } from "@/components/TemplateRenderer";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useCVBuilder } from "@/hooks/useCVBuilder";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useSpellCheck } from "@/hooks/useSpellCheck";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Download, User, Briefcase, GraduationCap, Wrench, FileText, Palette, Wand2, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 0, label: "Personal", icon: User },
  { id: 1, label: "Experience", icon: Briefcase },
  { id: 2, label: "Education", icon: GraduationCap },
  { id: 3, label: "Skills", icon: Wrench },
  { id: 4, label: "References", icon: Users },
  { id: 5, label: "Template", icon: Palette },
];

export default function CVBuilder() {
  const {
    cvData,
    currentStep,
    selectedTemplate,
    setSelectedTemplate,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addReference,
    updateReference,
    removeReference,
    setCVDataDirectly,
    nextStep,
    prevStep,
    goToStep,
  } = useCVBuilder();

  const { exportToPDF, isExporting } = usePDFExport();
  const { correctCVData, isChecking } = useSpellCheck();

  const handleDownload = () => {
    exportToPDF("cv-preview", `my-cv-${selectedTemplate}`);
  };

  const handleAIPolish = async () => {
    const correctedData = await correctCVData(cvData);
    setCVDataDirectly(correctedData);
  };

  const hasContent = cvData.personalInfo.fullName || cvData.experience.length > 0 || cvData.education.length > 0 || cvData.skills.length > 0;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            data={cvData.personalInfo}
            onUpdate={updatePersonalInfo}
          />
        );
      case 1:
        return (
          <ExperienceForm
            experiences={cvData.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        );
      case 2:
        return (
          <EducationForm
            education={cvData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        );
      case 3:
        return (
          <SkillsForm
            skills={cvData.skills}
            onAdd={addSkill}
            onRemove={removeSkill}
          />
        );
      case 4:
        return (
          <ReferencesForm
            references={cvData.references}
            onAdd={addReference}
            onUpdate={updateReference}
            onRemove={removeReference}
          />
        );
      case 5:
        return (
          <div>
            <h2 className="font-display text-xl font-semibold mb-2">Choose Your Template</h2>
            <p className="text-muted-foreground mb-6">Select a professional design that represents you best</p>
            <TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <FileText className="h-6 w-6 text-accent" />
            <span className="font-display font-bold">CV Builder</span>
          </Link>
          
          <div className="flex gap-2">
            {hasContent && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAIPolish}
                disabled={isChecking}
              >
                {isChecking ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                AI Polish
              </Button>
            )}
            <Button 
              variant="hero" 
              size="sm" 
              onClick={handleDownload}
              disabled={isExporting || !hasContent}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    currentStep === step.id
                      ? "bg-accent text-accent-foreground shadow-glow"
                      : currentStep > step.id
                      ? "bg-accent/20 text-accent"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-8 transition-colors",
                      currentStep > step.id ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form section */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
            {renderStepContent()}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button variant="accent" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="hero" 
                  onClick={handleDownload}
                  disabled={isExporting || !hasContent}
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download CV
                </Button>
              )}
            </div>
          </div>

          {/* Preview section */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="h-full overflow-auto rounded-2xl border border-border bg-muted/30 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-semibold text-muted-foreground">Live Preview</h2>
                {hasContent && (
                  <Button variant="ghost" size="sm" onClick={handleAIPolish} disabled={isChecking}>
                    {isChecking ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-1" />
                    )}
                    Polish with AI
                  </Button>
                )}
              </div>
              <div id="cv-preview" className="transform scale-[0.75] origin-top">
                <TemplateRenderer data={cvData} templateId={selectedTemplate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
