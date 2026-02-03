import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SmartInput } from "@/components/ui/smart-input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Lightbulb, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useAutoCorrect } from "@/hooks/useAutoCorrect";
import { useInlineTypingAssist } from "@/hooks/useInlineTypingAssist";
import { toast } from "sonner";

interface SkillsFormProps {
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}

const suggestedSkills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Project Management", "Communication", "Leadership", "Problem Solving",
  "Data Analysis", "Machine Learning", "AWS", "Docker", "Git",
  "Agile/Scrum", "UI/UX Design", "Excel", "Marketing", "Sales"
];

export function SkillsForm({ skills, onAdd, onRemove }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSkillValid, setIsSkillValid] = useState(true);
  const { correctText } = useAutoCorrect();
  const { validateBeforeSave } = useInlineTypingAssist({ fieldType: "skill" });

  const handleAdd = useCallback(async () => {
    if (!newSkill.trim()) return;
    
    setIsValidating(true);

    try {
      // First validate the skill makes sense
      const validation = await validateBeforeSave(newSkill.trim());
      
      if (!validation.isValid) {
        toast.error("Invalid skill entry", {
          description: validation.reason,
        });
        setIsValidating(false);
        return;
      }

      // Then auto-correct spelling
      const result = await correctText(newSkill.trim());
      const finalSkill = result.hasCorrections ? result.corrected : newSkill.trim();
      
      // Check for duplicates
      if (skills.some(s => s.toLowerCase() === finalSkill.toLowerCase())) {
        toast.error("Skill already exists", {
          description: `"${finalSkill}" is already in your skills list.`,
        });
        setIsValidating(false);
        return;
      }

      onAdd(finalSkill);
      setNewSkill("");
      
      if (result.hasCorrections) {
        toast.success(`Added "${finalSkill}"`, {
          description: `Auto-corrected from "${newSkill.trim()}"`,
        });
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      // Still add the skill if validation fails
      onAdd(newSkill.trim());
      setNewSkill("");
    } finally {
      setIsValidating(false);
    }
  }, [newSkill, skills, onAdd, correctText, validateBeforeSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const availableSuggestions = suggestedSkills.filter(
    (skill) => !skills.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Skills</h2>
        <p className="text-muted-foreground">Add your key skills and competencies</p>
      </div>

      {/* Add skill input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SmartInput
              placeholder="Type a skill and press Enter..."
              value={newSkill}
              onChange={setNewSkill}
              onKeyDown={handleKeyDown}
              fieldType="skill"
              onValidationChange={setIsSkillValid}
              className="h-12"
              disabled={isValidating}
              showValidation={true}
            />
          </div>
          <Button 
            onClick={handleAdd} 
            variant="accent" 
            className="h-12 px-6"
            disabled={isValidating || !newSkill.trim() || !isSkillValid}
          >
            {isValidating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Skills are validated and auto-corrected before saving
        </p>
      </div>

      {/* Current skills */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Your Skills ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-medium group cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => onRemove(skill)}
              >
                {skill}
                <X className="ml-2 h-3 w-3 opacity-50 group-hover:opacity-100" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggested skills */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Suggested Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 12).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                onClick={() => onAdd(skill)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-lg bg-secondary/50 p-4">
        <h4 className="font-medium mb-2">💡 Pro Tips for Skills</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Include a mix of technical and soft skills</li>
          <li>• Tailor skills to match the job description</li>
          <li>• Be specific (e.g., "React.js" instead of just "Web Development")</li>
          <li>• Aim for 8-12 relevant skills</li>
        </ul>
      </div>
    </div>
  );
}
