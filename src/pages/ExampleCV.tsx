import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "@/components/TemplateRenderer";
import { TemplateSelector } from "@/components/TemplateSelector";
import { usePDFExport } from "@/hooks/usePDFExport";
import { exampleCVData } from "@/data/exampleCV";
import { TemplateId } from "@/types/templates";
import { useState } from "react";
import { ArrowLeft, Download, Sparkles, FileText } from "lucide-react";

export default function ExampleCV() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");
  const { exportToPDF, isExporting } = usePDFExport();

  const handleDownload = () => {
    exportToPDF("cv-preview", `example-cv-${selectedTemplate}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <FileText className="h-6 w-6 text-accent" />
            <span className="font-display font-bold">Back to Home</span>
          </Link>
          
          <div className="flex gap-3">
            <Link to="/builder">
              <Button variant="accent">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your Own CV
              </Button>
            </Link>
            <Button variant="hero" onClick={handleDownload} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Download This CV"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Template Selector */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Choose a Template</h2>
          <TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />
        </div>

        {/* Preview Section */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="mb-4 text-center">
              <h1 className="font-display text-2xl font-bold mb-2">Example Professional CV</h1>
              <p className="text-muted-foreground">This is what your CV could look like. Click "Create Your Own CV" to get started!</p>
            </div>
            
            <div id="cv-preview" className="origin-top">
              <TemplateRenderer data={exampleCVData} templateId={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
