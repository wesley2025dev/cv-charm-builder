export type TemplateId = "modern" | "executive" | "creative" | "minimal" | "bold";

export interface CVTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  colors: {
    header: string;
    headerText: string;
    accent: string;
    sectionTitle: string;
  };
}

export const cvTemplates: CVTemplate[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design with subtle accents",
    preview: "📊",
    colors: {
      header: "bg-gradient-to-r from-slate-800 to-slate-700",
      headerText: "text-white",
      accent: "text-emerald-600",
      sectionTitle: "text-slate-500",
    },
  },
  {
    id: "executive",
    name: "Executive Elite",
    description: "Sophisticated design for senior professionals",
    preview: "👔",
    colors: {
      header: "bg-gradient-to-r from-gray-900 to-gray-800",
      headerText: "text-white",
      accent: "text-amber-500",
      sectionTitle: "text-gray-600",
    },
  },
  {
    id: "creative",
    name: "Creative Edge",
    description: "Stand out with bold colors and modern layout",
    preview: "🎨",
    colors: {
      header: "bg-gradient-to-r from-violet-600 to-purple-600",
      headerText: "text-white",
      accent: "text-violet-600",
      sectionTitle: "text-violet-500",
    },
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Elegant simplicity that lets your content shine",
    preview: "✨",
    colors: {
      header: "bg-white border-b-4 border-gray-900",
      headerText: "text-gray-900",
      accent: "text-gray-700",
      sectionTitle: "text-gray-400",
    },
  },
  {
    id: "bold",
    name: "Bold Impact",
    description: "Make a powerful first impression",
    preview: "🚀",
    colors: {
      header: "bg-gradient-to-r from-blue-600 to-cyan-500",
      headerText: "text-white",
      accent: "text-blue-600",
      sectionTitle: "text-blue-500",
    },
  },
];
