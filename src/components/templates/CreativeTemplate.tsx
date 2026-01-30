import { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe, Zap } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-900 shadow-large rounded-xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-yellow-300" />
            <h1 className="text-3xl font-black tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
          </div>
          {personalInfo.title && (
            <p className="text-xl text-purple-200 font-semibold ml-11">{personalInfo.title}</p>
          )}
          
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-purple-100 ml-11">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Mail className="h-3.5 w-3.5" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Phone className="h-3.5 w-3.5" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <MapPin className="h-3.5 w-3.5" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Linkedin className="h-3.5 w-3.5" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Globe className="h-3.5 w-3.5" />
                {personalInfo.website}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {personalInfo.summary && (
          <section className="bg-gradient-to-r from-violet-50 to-purple-50 -mx-8 px-8 py-4">
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-violet-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-violet-600 rounded-full"></span>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-violet-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-violet-100 px-2 py-1 rounded-full">
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
            <h2 className="text-lg font-black text-violet-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-violet-600 rounded-full"></span>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start pl-6 relative">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-violet-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-violet-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-violet-600 rounded-full"></span>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-sm"
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
