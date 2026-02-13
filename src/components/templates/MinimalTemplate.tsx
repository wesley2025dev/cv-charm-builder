import { CVData } from "@/types/cv";

interface TemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills, references } = data;

  return (
    <div className="bg-white text-gray-900 shadow-large rounded-lg overflow-hidden p-10" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-4xl font-light tracking-tight mb-2">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-xl text-gray-500 font-light">{personalInfo.title}</p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="space-y-8">
        {personalInfo.summary && (
          <section>
            <p className="text-gray-700 leading-relaxed max-w-2xl">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-400">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-500 mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-500">{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <span>{edu.startDate} — {edu.endDate}</span>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Skills
            </h2>
            <p className="text-gray-700">{skills.join("  ·  ")}</p>
          </section>
        )}

        {references && references.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              References
            </h2>
            <div className="space-y-4">
              {references.map((ref) => (
                <div key={ref.id}>
                  <h3 className="font-medium text-gray-900">{ref.name}</h3>
                  <p className="text-gray-500">{ref.position}{ref.company ? `, ${ref.company}` : ""}</p>
                  {ref.relationship && <p className="text-sm text-gray-400">{ref.relationship}</p>}
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
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
