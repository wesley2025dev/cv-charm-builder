import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/cv";
import { Plus, Trash2, GraduationCap, Calendar, Edit2 } from "lucide-react";

interface EducationFormProps {
  education: Education[];
  onAdd: (education: Omit<Education, "id">) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export function EducationForm({ education, onAdd, onUpdate, onRemove }: EducationFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newEdu, setNewEdu] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  });

  const handleAdd = () => {
    if (newEdu.institution && newEdu.degree) {
      onAdd(newEdu);
      setNewEdu({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      });
      setIsAdding(false);
    }
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
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd} variant="accent">
              Add Education
            </Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)}>
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
