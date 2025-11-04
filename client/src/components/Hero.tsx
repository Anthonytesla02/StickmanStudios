import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import heroBackground from "@assets/generated_images/AI_technology_hero_background_00add4b2.png";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight">
              Generate Stickman Videos with{" "}
              <span className="text-primary">AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Transform your text scripts into engaging stickman animation videos. 
              Powered by Google Gemini for intelligent scene generation and ElevenLabs 
              for professional narration.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/creator">
                <Button size="lg" className="gap-2" data-testid="button-start-creating">
                  Start Creating Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-watch-demo">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
              <img 
                src={heroBackground}
                alt="AI Technology Visualization"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
