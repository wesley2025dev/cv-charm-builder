import { CVData } from "@/types/cv";

interface ArtisticTemplateProps {
  data: CVData;
}

export function ArtisticTemplate({ data }: ArtisticTemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="min-h-full bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Artistic header with geometric shapes */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-20 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full -translate-x-1/2"></div>
        
        <div className="relative p-8 pt-12">
          <h1 className="text-4xl font-light tracking-wide text-rose-900">
            {personalInfo.fullName || "Your Name"}
          </h1>
          
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-rose-700/80">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                {personalInfo.location}
              </span>
            )}
          </div>
          
          {personalInfo.summary && (
            <p className="mt-6 text-rose-800/70 leading-relaxed italic text-lg max-w-2xl">
              "{personalInfo.summary}"
            </p>
          )}
        </div>
      </div>

      <div className="px-8 pb-8 space-y-10">
        {/* Skills as artistic tags */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-rose-400 mb-4">Creative Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 rounded-full text-sm font-medium shadow-sm"
                  style={{
                    transform: `rotate(${(index % 3 - 1) * 2}deg)`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience with artistic timeline */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-6">Creative Journey</h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div 
                    className="absolute left-0 top-0 w-12 h-12 rounded-full opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${index % 2 === 0 ? '#fb7185, #fdba74' : '#fbbf24, #f472b6'})`,
                    }}
                  ></div>
                  <div className="pl-16">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-light text-rose-900">{exp.position}</h3>
                      <span className="text-xs text-rose-400 whitespace-nowrap">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-orange-600 font-medium mt-1">{exp.company}</p>
                    {exp.description && (
                      <p className="text-rose-700/70 mt-3 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education as cards */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4">Education</h2>
            <div className="grid gap-4">
              {education.map((edu, index) => (
                <div 
                  key={edu.id} 
                  className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-100"
                  style={{
                    transform: `rotate(${(index % 2 === 0 ? -0.5 : 0.5)}deg)`,
                  }}
                >
                  <p className="text-rose-900 font-medium">{edu.degree}</p>
                  <p className="text-orange-600 text-sm mt-1">{edu.institution}</p>
                  <p className="text-rose-400 text-xs mt-2">
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decorative footer */}
      <div className="h-4 bg-gradient-to-r from-rose-300 via-orange-300 to-amber-300 opacity-50"></div>
    </div>
  );
}
