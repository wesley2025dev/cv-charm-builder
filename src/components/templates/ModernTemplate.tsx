import { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills, references } = data;

  return (
    <div className="bg-white text-gray-900 shadow-large rounded-lg overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8 text-white">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-slate-300 font-medium">{personalInfo.title}</p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="h-3.5 w-3.5" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-slate-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <p className="text-xs text-slate-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {references && references.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
              References
            </h2>
            <div className="space-y-3">
              {references.map((ref) => (
                <div key={ref.id}>
                  <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                  <p className="text-sm text-slate-600">{ref.position}{ref.company ? `, ${ref.company}` : ""}</p>
                  {ref.relationship && <p className="text-xs text-slate-500">{ref.relationship}</p>}
                  <div className="flex gap-4 text-xs text-slate-500 mt-1">
                    {ref.email && <span>{ref.email}</span>}
                    {ref.phone && <span>{ref.phone}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
