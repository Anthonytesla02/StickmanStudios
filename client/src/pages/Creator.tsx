import { Link } from "wouter";
import { Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ScriptEditor from "@/components/ScriptEditor";
import ProgressPanel from "@/components/ProgressPanel";
import VideoPreview from "@/components/VideoPreview";
import { useState } from "react";

type Step = {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed";
};

export default function Creator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", title: "Generating images...", status: "pending" },
    { id: "2", title: "Creating audio...", status: "pending" },
    { id: "3", title: "Rendering video...", status: "pending" },
  ]);
  const [videoReady, setVideoReady] = useState(false);

  const handleGenerate = (script: string) => {
    console.log('Starting generation with script:', script);
    setIsGenerating(true);
    setVideoReady(false);
    setProgress(0);
    
    const newSteps = [...steps];
    newSteps[0].status = "processing";
    setSteps(newSteps);

    setTimeout(() => {
      setProgress(33);
      newSteps[0].status = "completed";
      newSteps[1].status = "processing";
      setSteps([...newSteps]);
    }, 2000);

    setTimeout(() => {
      setProgress(66);
      newSteps[1].status = "completed";
      newSteps[2].status = "processing";
      setSteps([...newSteps]);
    }, 4000);

    setTimeout(() => {
      setProgress(100);
      newSteps[2].status = "completed";
      setSteps([...newSteps]);
      setVideoReady(true);
      setIsGenerating(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-home">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Video className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold font-display">StickMotion</span>
                </div>
              </Link>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display mb-2">Create Your Video</h1>
          <p className="text-muted-foreground">
            Write your script and let AI bring it to life with stickman animations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          <ScriptEditor onGenerate={handleGenerate} disabled={isGenerating} />
          <ProgressPanel 
            steps={steps} 
            progress={progress}
            showFrames={progress > 0}
          />
          <VideoPreview videoReady={videoReady} />
        </div>
      </main>
    </div>
  );
}
