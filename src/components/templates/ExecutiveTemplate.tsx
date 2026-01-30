import { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Star } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-900 shadow-large rounded-lg overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-10 text-white">
        <h1 className="text-3xl font-bold tracking-wide mb-2 uppercase">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-amber-400 font-medium tracking-wider">{personalInfo.title}</p>
        )}
        
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-300">
          {personalInfo.email && (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              {personalInfo.location}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-6 text-sm text-gray-300">
          {personalInfo.linkedin && (
            <span className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-amber-400" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-400" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {personalInfo.summary && (
          <section>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-gray-700 leading-relaxed italic">{personalInfo.summary}</p>
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider">
              <Briefcase className="h-5 w-5 text-amber-500" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                      <p className="text-amber-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-3 text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider">
              <GraduationCap className="h-5 w-5 text-amber-500" />
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start border-l-2 border-gray-200 pl-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-amber-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider">
              <Star className="h-5 w-5 text-amber-500" />
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm font-medium text-center"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
