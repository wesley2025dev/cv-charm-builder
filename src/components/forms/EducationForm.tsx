import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/cv";
import { Plus, Trash2, GraduationCap, Calendar, Edit2 } from "lucide-react";
import { useQualificationValidator } from "@/hooks/useQualificationValidator";
import { QualificationValidationFeedback } from "./QualificationValidationFeedback";
import { toast } from "sonner";

interface EducationFormProps {
  education: Education[];
  onAdd: (education: Omit<Education, "id">) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export function EducationForm({ education, onAdd, onUpdate, onRemove }: EducationFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [duplicateWarningDismissed, setDuplicateWarningDismissed] = useState(false);
  const [newEdu, setNewEdu] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  });

  const { 
    validationState, 
    validateWithDebounce, 
    clearValidation, 
    checkLocalDuplicate 
  } = useQualificationValidator();

  // Trigger validation when key fields change
  useEffect(() => {
    if (isAdding && (newEdu.degree.trim() || newEdu.institution.trim())) {
      setDuplicateWarningDismissed(false);
      validateWithDebounce(newEdu, education);
    }
  }, [newEdu.degree, newEdu.field, newEdu.institution, isAdding, education, validateWithDebounce]);

  // Check if normalized values differ from current input
  const hasNormalizationChanges = useMemo(() => {
    if (!validationState.result?.normalized) return false;
    const { normalized } = validationState.result;
    return (
      normalized.degree !== newEdu.degree ||
      normalized.field !== newEdu.field ||
      normalized.institution !== newEdu.institution
    );
  }, [validationState.result, newEdu]);

  const handleApplyNormalized = () => {
    if (validationState.result?.normalized) {
      const { normalized } = validationState.result;
      setNewEdu((prev) => ({
        ...prev,
        degree: normalized.degree || prev.degree,
        field: normalized.field || prev.field,
        institution: normalized.institution || prev.institution,
      }));
      toast.success("AI suggestions applied!");
    }
  };

  const handleAdd = () => {
    if (!newEdu.institution || !newEdu.degree) {
      toast.error("Please fill in the degree and institution fields");
      return;
    }

    // Check for local duplicates first
    const localDupe = checkLocalDuplicate(newEdu, education);
    if (localDupe && !duplicateWarningDismissed) {
      toast.error("This qualification appears to be a duplicate!");
      return;
    }

    // Check AI validation result for duplicates
    const result = validationState.result;
    if (result?.duplicateOf && !duplicateWarningDismissed) {
      toast.error("Duplicate qualification detected. Dismiss the warning to add anyway.");
      return;
    }

    // Check if qualification is invalid
    if (result && !result.isValid) {
      toast.error(result.validationMessage || "This qualification doesn't appear to be valid.");
      return;
    }

    // Use normalized values if available and high confidence
    const finalEdu = result?.normalized && result.confidence > 0.7
      ? {
          ...newEdu,
          degree: result.normalized.degree || newEdu.degree,
          field: result.normalized.field || newEdu.field,
          institution: result.normalized.institution || newEdu.institution,
        }
      : newEdu;

    onAdd(finalEdu);
    setNewEdu({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    });
    setIsAdding(false);
    clearValidation();
    setDuplicateWarningDismissed(false);
    toast.success("Education added successfully!");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewEdu({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    });
    clearValidation();
    setDuplicateWarningDismissed(false);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Education</h2>
        <p className="text-muted-foreground">Add your educational background</p>
      </div>

      {/* Existing education */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="group relative rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemove(edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new education form */}
      {isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-6 animate-scale-in">
          <h3 className="font-semibold mb-4">Add Education</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="institution">Institution Name</Label>
              <Input
                id="institution"
                placeholder="Stanford University"
                value={newEdu.institution}
                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                placeholder="Bachelor's"
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                placeholder="Computer Science"
                value={newEdu.field}
                onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eduStartDate">Start Date</Label>
              <Input
                id="eduStartDate"
                type="month"
                value={newEdu.startDate}
                onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eduEndDate">End Date</Label>
              <Input
                id="eduEndDate"
                type="month"
                value={newEdu.endDate}
                onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (optional)</Label>
              <Input
                id="gpa"
                placeholder="3.8"
                value={newEdu.gpa}
                onChange={(e) => setNewEdu({ ...newEdu, gpa: e.target.value })}
              />
            </div>
          </div>

          {/* Validation Feedback */}
          <div className="mt-4">
            <QualificationValidationFeedback
              isValidating={validationState.isValidating}
              result={validationState.result}
              error={validationState.error}
              onApplyNormalized={handleApplyNormalized}
              onDismissDuplicate={() => setDuplicateWarningDismissed(true)}
              hasChanges={hasNormalizationChanges}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleAdd} 
              variant="accent"
              disabled={validationState.isValidating}
            >
              Add Education
            </Button>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-14 border-dashed"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Education
        </Button>
      )}
    </div>
  );
}
