import { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe, ArrowRight } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export function BoldTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills, references } = data;

  return (
    <div className="bg-white text-gray-900 shadow-large rounded-xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-12 text-white relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-2xl text-blue-100 font-bold">{personalInfo.title}</p>
          )}
          
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {personalInfo.email && (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {personalInfo.website}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {personalInfo.summary && (
          <section className="bg-blue-50 -mx-8 px-8 py-6 border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed text-lg font-medium">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-blue-600 mb-4">
              EXPERIENCE
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-lg text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-bold">{exp.company}</p>
                    </div>
                    <span className="text-sm font-bold text-white bg-blue-500 px-3 py-1 rounded-full">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-blue-600 mb-4">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-5 w-5 text-cyan-500" />
                    <div>
                      <h3 className="font-black text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-blue-600">{edu.institution}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <p className="text-sm font-bold text-cyan-600">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-blue-600 mb-4">
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-black shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {references && references.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-blue-600 mb-4">
              REFERENCES
            </h2>
            <div className="space-y-3">
              {references.map((ref) => (
                <div key={ref.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-black text-gray-900">{ref.name}</h3>
                  <p className="text-blue-600 font-bold">{ref.position}{ref.company ? `, ${ref.company}` : ""}</p>
                  {ref.relationship && <p className="text-sm text-gray-500">{ref.relationship}</p>}
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
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
