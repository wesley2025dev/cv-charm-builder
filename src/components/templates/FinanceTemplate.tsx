import { CVData } from "@/types/cv";

interface FinanceTemplateProps {
  data: CVData;
}

export function FinanceTemplate({ data }: FinanceTemplateProps) {
  const { personalInfo, experience, education, skills, references } = data;

  return (
    <div className="min-h-full bg-white">
      {/* Conservative header with gold accent */}
      <div className="bg-slate-900 text-white px-8 py-8">
        <div className="border-b border-amber-500/30 pb-6">
          <h1 className="text-3xl font-serif font-light tracking-wide">
            {personalInfo.fullName || "Your Name"}
          </h1>
          
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-300">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && (
              <>
                <span className="text-amber-500">|</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-amber-500">|</span>
                <span>{personalInfo.location}</span>
              </>
            )}
          </div>
        </div>
        
        {personalInfo.summary && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 mb-2">Executive Summary</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              {personalInfo.summary}
            </p>
          </div>
        )}
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Core Competencies */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 pb-2 border-b border-slate-200">
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500"></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 pb-2 border-b border-slate-200">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{exp.position}</h3>
                      <p className="text-amber-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-500">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-3 text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-100">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Credentials */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 pb-2 border-b border-slate-200">
              Education & Credentials
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-slate-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {references && references.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 pb-2 border-b border-slate-200">
              References
            </h2>
            <div className="space-y-4">
              {references.map((ref) => (
                <div key={ref.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{ref.name}</p>
                    <p className="text-slate-600">{ref.position}{ref.company ? `, ${ref.company}` : ""}</p>
                    {ref.relationship && <p className="text-sm text-slate-500">{ref.relationship}</p>}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {ref.email && <p>{ref.email}</p>}
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with subtle branding */}
      <div className="px-8 py-4 border-t border-slate-100">
        <div className="flex justify-center">
          <div className="w-12 h-0.5 bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
}
