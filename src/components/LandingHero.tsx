import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Target, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "Get smart recommendations to make your CV stand out to recruiters.",
  },
  {
    icon: Target,
    title: "ATS-Optimized",
    description: "Beat applicant tracking systems with properly formatted resumes.",
  },
  {
    icon: CheckCircle2,
    title: "Professional Templates",
    description: "Choose from designs that hiring managers love.",
  },
];

const steps = [
  { number: "01", title: "Enter Your Details", description: "Fill in your experience, skills, and education" },
  { number: "02", title: "Choose a Template", description: "Pick a professional design that suits your style" },
  { number: "03", title: "Download & Apply", description: "Export your CV and start landing interviews" },
];

export function LandingHero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="bg-hero relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent-foreground/90 backdrop-blur-sm animate-fade-in">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Create your perfect CV in minutes</span>
            </div>
            
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-fade-up">
              Land Your Dream Job with a{" "}
              <span className="text-gradient">Standout CV</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Build a professional resume that gets you noticed. Our smart CV builder 
              helps you create ATS-friendly resumes that hiring managers actually want to read.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/builder">
                <Button variant="hero" size="xl">
                  Start Building Your CV
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl">
                View Examples
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-primary-foreground/60 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              ✓ Free to use · ✓ No signup required · ✓ Download as PDF
            </p>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Our CV Builder?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to create a resume that gets results
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Create Your CV in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              No complicated process—just a straightforward path to your new resume
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-accent/50 to-accent/10 lg:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gradient text-2xl font-bold text-accent-foreground shadow-medium">
                    {step.number}
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-3xl bg-hero p-12 text-center shadow-large">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
              Ready to Get Hired?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Join thousands who landed their dream jobs with our CV builder
            </p>
            <Link to="/builder">
              <Button variant="hero" size="xl">
                Create Your Free CV Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
