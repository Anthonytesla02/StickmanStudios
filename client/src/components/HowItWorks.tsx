import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Write Your Script",
    description: "Enter your story line by line. Each line becomes a scene in your video with AI-generated stickman animations.",
  },
  {
    icon: Sparkles,
    title: "AI Generates Scenes",
    description: "Google Gemini creates unique stickman illustrations for each scene. ElevenLabs transforms your text into professional narration.",
  },
  {
    icon: Download,
    title: "Download Video",
    description: "Our server stitches images and audio into a polished MP4 video ready to share anywhere.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to create professional stickman animation videos
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border hover-elevate">
              <CardContent className="p-8 space-y-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
