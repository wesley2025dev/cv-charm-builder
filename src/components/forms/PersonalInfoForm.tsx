import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CVData } from "@/types/cv";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin } from "lucide-react";

interface PersonalInfoFormProps {
  data: CVData["personalInfo"];
  onUpdate: (field: keyof CVData["personalInfo"], value: string) => void;
}

export function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Let employers know who you are and how to reach you</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Full Name
          </Label>
          <Input
            id="fullName"
            placeholder="John Smith"
            value={data.fullName}
            onChange={(e) => onUpdate("fullName", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            Professional Title
          </Label>
          <Input
            id="title"
            placeholder="Senior Software Engineer"
            value={data.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => onUpdate("phone", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={data.location}
            onChange={(e) => onUpdate("location", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-muted-foreground" />
            LinkedIn (optional)
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johnsmith"
            value={data.linkedin}
            onChange={(e) => onUpdate("linkedin", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Website/Portfolio (optional)
          </Label>
          <Input
            id="website"
            placeholder="https://johnsmith.dev"
            value={data.website}
            onChange={(e) => onUpdate("website", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="Write 2-3 sentences about your professional background, key skills, and what you're looking for..."
            value={data.summary}
            onChange={(e) => onUpdate("summary", e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Tip: Focus on your achievements and what value you bring to employers
          </p>
        </div>
      </div>
    </div>
  );
}
