import { Link } from "wouter";
import { Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ScriptEditor from "@/components/ScriptEditor";
import ProgressPanel from "@/components/ProgressPanel";
import VideoPreview from "@/components/VideoPreview";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [videoUrl, setVideoUrl] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const handleGenerate = (script: string) => {
    console.log('Starting generation with script:', script);
    setIsGenerating(true);
    setVideoReady(false);
    setVideoUrl("");
    setProgress(0);
    
    // Reset steps
    setSteps([
      { id: "1", title: "Generating images...", status: "pending" },
      { id: "2", title: "Creating audio...", status: "pending" },
      { id: "3", title: "Rendering video...", status: "pending" },
    ]);

    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ type: "generate", script }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "progress") {
        const { stage, progress: progressValue, message: progressMessage } = message.data;
        
        setProgress(progressValue);

        // Update step status based on stage
        setSteps((prevSteps) => {
          const newSteps = [...prevSteps];
          
          if (stage === "images") {
            newSteps[0].status = progressValue < 100 ? "processing" : "completed";
            newSteps[0].title = progressMessage;
            if (progressValue === 100) {
              newSteps[1].status = "processing";
            }
          } else if (stage === "audio") {
            newSteps[0].status = "completed";
            newSteps[1].status = progressValue < 100 ? "processing" : "completed";
            newSteps[1].title = progressMessage;
            if (progressValue === 100) {
              newSteps[2].status = "processing";
            }
          } else if (stage === "video") {
            newSteps[0].status = "completed";
            newSteps[1].status = "completed";
            newSteps[2].status = progressValue < 100 ? "processing" : "completed";
            newSteps[2].title = progressMessage;
          }
          
          return newSteps;
        });
      } else if (message.type === "complete") {
        console.log("Video generation complete:", message.data);
        setVideoUrl(message.data.videoUrl);
        setVideoReady(true);
        setIsGenerating(false);
        setProgress(100);
        
        setSteps([
          { id: "1", title: "Images generated!", status: "completed" },
          { id: "2", title: "Audio created!", status: "completed" },
          { id: "3", title: "Video rendered!", status: "completed" },
        ]);

        toast({
          title: "Success!",
          description: "Your video is ready to download.",
        });

        ws.close();
      } else if (message.type === "error") {
        console.error("Video generation error:", message.message);
        setIsGenerating(false);
        
        toast({
          title: "Error",
          description: message.message || "Failed to generate video",
          variant: "destructive",
        });

        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsGenerating(false);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
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
          <VideoPreview videoReady={videoReady} videoUrl={videoUrl} />
        </div>
      </main>
    </div>
  );
}
