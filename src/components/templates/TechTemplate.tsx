import { CVData } from "@/types/cv";

interface TechTemplateProps {
  data: CVData;
}

export function TechTemplate({ data }: TechTemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-full font-mono">
      {/* Terminal-style header */}
      <div className="bg-slate-950 p-6 border-b border-emerald-500/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="ml-2 text-slate-500 text-xs">~/resume/{personalInfo.fullName?.toLowerCase().replace(/\s+/g, '-') || 'developer'}.md</span>
        </div>
        
        <div className="space-y-1">
          <p className="text-emerald-400">
            <span className="text-slate-500">$</span> whoami
          </p>
          <h1 className="text-2xl font-bold text-white pl-4">
            {personalInfo.fullName || "Your Name"}
          </h1>
          
          {personalInfo.summary && (
            <>
              <p className="text-emerald-400 mt-4">
                <span className="text-slate-500">$</span> cat about.txt
              </p>
              <p className="text-slate-300 pl-4 text-sm leading-relaxed">
                {personalInfo.summary}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Contact as code comments */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-700/50">
        <p className="text-slate-500 text-xs">// Contact Information</p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          {personalInfo.email && (
            <span className="text-cyan-400">
              <span className="text-slate-500">email:</span> "{personalInfo.email}"
            </span>
          )}
          {personalInfo.phone && (
            <span className="text-cyan-400">
              <span className="text-slate-500">phone:</span> "{personalInfo.phone}"
            </span>
          )}
          {personalInfo.location && (
            <span className="text-cyan-400">
              <span className="text-slate-500">location:</span> "{personalInfo.location}"
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Skills as array */}
        {skills.length > 0 && (
          <div>
            <p className="text-emerald-400 mb-2">
              <span className="text-slate-500">$</span> echo $SKILLS
            </p>
            <div className="pl-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience as git log */}
        {experience.length > 0 && (
          <div>
            <p className="text-emerald-400 mb-3">
              <span className="text-slate-500">$</span> git log --experience
            </p>
            <div className="space-y-4 pl-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-yellow-500/50 pl-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-yellow-400 font-semibold">{exp.position}</p>
                      <p className="text-slate-400 text-sm">@ {exp.company}</p>
                    </div>
                    <span className="text-slate-500 text-xs whitespace-nowrap">
                      {exp.startDate} → {exp.current ? "HEAD" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education as imports */}
        {education.length > 0 && (
          <div>
            <p className="text-emerald-400 mb-3">
              <span className="text-slate-500">$</span> cat education.json
            </p>
            <div className="space-y-3 pl-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
                  <p className="text-purple-400">{edu.degree}</p>
                  <p className="text-slate-400 text-sm">{edu.institution}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs">
          <span className="text-emerald-400">$</span> exit 0
        </p>
      </div>
    </div>
  );
}
