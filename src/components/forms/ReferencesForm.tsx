import { useState } from "react";
import { Reference } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";

interface ReferencesFormProps {
  references: Reference[];
  onAdd: (reference: Omit<Reference, "id">) => void;
  onUpdate: (id: string, updates: Partial<Reference>) => void;
  onRemove: (id: string) => void;
}

const emptyReference = {
  name: "",
  position: "",
  company: "",
  email: "",
  phone: "",
  relationship: "",
};

export function ReferencesForm({ references, onAdd, onUpdate, onRemove }: ReferencesFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRef, setNewRef] = useState(emptyReference);

  const handleAdd = () => {
    if (newRef.name.trim() && newRef.position.trim()) {
      onAdd(newRef);
      setNewRef(emptyReference);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">References</h2>
        <p className="text-muted-foreground">Add professional references who can vouch for your work</p>
      </div>

      {/* Existing references */}
      {references.map((ref) => (
        <div key={ref.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">{ref.name || "New Reference"}</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onRemove(ref.id)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={ref.name} onChange={(e) => onUpdate(ref.id, { name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input value={ref.relationship} onChange={(e) => onUpdate(ref.id, { relationship: e.target.value })} placeholder="e.g. Direct Manager" />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input value={ref.position} onChange={(e) => onUpdate(ref.id, { position: e.target.value })} placeholder="VP of Engineering" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={ref.company} onChange={(e) => onUpdate(ref.id, { company: e.target.value })} placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={ref.email} onChange={(e) => onUpdate(ref.id, { email: e.target.value })} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={ref.phone} onChange={(e) => onUpdate(ref.id, { phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </div>
      ))}

      {/* Add new reference */}
      {isAdding ? (
        <div className="rounded-lg border-2 border-dashed border-accent/50 p-4 space-y-4">
          <h3 className="font-semibold text-accent">New Reference</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={newRef.name} onChange={(e) => setNewRef({ ...newRef, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input value={newRef.relationship} onChange={(e) => setNewRef({ ...newRef, relationship: e.target.value })} placeholder="e.g. Direct Manager" />
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input value={newRef.position} onChange={(e) => setNewRef({ ...newRef, position: e.target.value })} placeholder="VP of Engineering" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={newRef.company} onChange={(e) => setNewRef({ ...newRef, company: e.target.value })} placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={newRef.email} onChange={(e) => setNewRef({ ...newRef, email: e.target.value })} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newRef.phone} onChange={(e) => setNewRef({ ...newRef, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} variant="accent" disabled={!newRef.name.trim() || !newRef.position.trim()}>
              Add Reference
            </Button>
            <Button variant="outline" onClick={() => { setIsAdding(false); setNewRef(emptyReference); }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="w-full border-dashed" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reference
        </Button>
      )}

      {/* Tips */}
      <div className="rounded-lg bg-secondary/50 p-4">
        <h4 className="font-medium mb-2">💡 Pro Tips for References</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Always ask permission before listing someone as a reference</li>
          <li>• Include a mix of managers, colleagues, and mentors</li>
          <li>• 2-3 references is typically sufficient</li>
          <li>• Keep contact information up to date</li>
        </ul>
      </div>
    </div>
  );
}
