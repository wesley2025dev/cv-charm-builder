import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/types/cv";
import { Plus, Trash2, Building2, Calendar, Edit2 } from "lucide-react";
import { useAutoCorrect } from "@/hooks/useAutoCorrect";
import { AutoCorrectSuggestion } from "./AutoCorrectSuggestion";

interface ExperienceFormProps {
  experiences: Experience[];
  onAdd: (experience: Omit<Experience, "id">) => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

export function ExperienceForm({ experiences, onAdd, onUpdate, onRemove }: ExperienceFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newExp, setNewExp] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    highlights: [] as string[],
  });

  const { isChecking, pendingCorrection, checkTextDebounced, applyCorrection, dismissCorrection, clearPending } = useAutoCorrect();

  // Check description for corrections when user stops typing
  useEffect(() => {
    if (newExp.description && newExp.description.length > 15) {
      checkTextDebounced(newExp.description, () => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newExp.description]);

  const handleApplyCorrection = () => {
    const corrected = applyCorrection();
    if (corrected) {
      setNewExp({ ...newExp, description: corrected });
    }
  };

  const handleAdd = () => {
    if (newExp.company && newExp.position) {
      onAdd(newExp);
      setNewExp({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        highlights: [],
      });
      setIsAdding(false);
      clearPending();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewExp({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
    });
    clearPending();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Work Experience</h2>
        <p className="text-muted-foreground">Add your relevant work history, starting with the most recent</p>
      </div>

      {/* Existing experiences */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="group relative rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  {exp.description && (
                    <p className="mt-3 text-sm text-muted-foreground">{exp.description}</p>
                  )}
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
                  onClick={() => onRemove(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new experience form */}
      {isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-6 animate-scale-in">
          <h3 className="font-semibold mb-4">Add New Experience</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Google"
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                placeholder="Senior Developer"
                value={newExp.position}
                onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={newExp.startDate}
                onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={newExp.endDate}
                onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                disabled={newExp.current}
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="current"
                checked={newExp.current}
                onCheckedChange={(checked) => setNewExp({ ...newExp, current: !!checked })}
              />
              <Label htmlFor="current" className="text-sm font-normal">
                I currently work here
              </Label>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your key responsibilities and achievements..."
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                className="min-h-[100px]"
              />
              {isChecking && (
                <AutoCorrectSuggestion
                  isChecking={true}
                  onApply={() => {}}
                  onDismiss={() => {}}
                />
              )}
              {pendingCorrection?.hasCorrections && (
                <AutoCorrectSuggestion
                  original={pendingCorrection.original}
                  corrected={pendingCorrection.corrected}
                  onApply={handleApplyCorrection}
                  onDismiss={dismissCorrection}
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd} variant="accent">
              Add Experience
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
          Add Work Experience
        </Button>
      )}
    </div>
  );
}
