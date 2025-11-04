import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import stickman1 from "@assets/generated_images/Stickman_waving_hello_frame_412aab8a.png";
import stickman2 from "@assets/generated_images/Stickman_walking_frame_6f587a30.png";
import stickman3 from "@assets/generated_images/Stickman_jumping_celebration_749d6d00.png";
import stickman4 from "@assets/generated_images/Stickman_working_at_desk_62a5cf30.png";

type Step = {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed";
};

interface ProgressPanelProps {
  steps?: Step[];
  progress?: number;
  showFrames?: boolean;
}

export default function ProgressPanel({ 
  steps = [
    { id: "1", title: "Generating images...", status: "completed" },
    { id: "2", title: "Creating audio...", status: "processing" },
    { id: "3", title: "Rendering video...", status: "pending" },
  ],
  progress = 45,
  showFrames = true 
}: ProgressPanelProps) {
  const frames = [stickman1, stickman2, stickman3, stickman4];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Generation Progress</CardTitle>
        <Progress value={progress} className="h-2" data-testid="progress-generation" />
        <span className="text-sm text-muted-foreground" data-testid="text-progress-percent">
          {progress}% complete
        </span>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3" data-testid={`status-${step.id}`}>
              {step.status === "completed" && (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              )}
              {step.status === "processing" && (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              )}
              {step.status === "pending" && (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={step.status === "pending" ? "text-muted-foreground" : ""}>
                {step.title}
              </span>
              {step.status === "processing" && (
                <Badge variant="secondary" className="ml-auto">In Progress</Badge>
              )}
            </div>
          ))}
        </div>

        {showFrames && (
          <div>
            <h4 className="text-sm font-medium mb-3">Generated Frames</h4>
            <div className="grid grid-cols-2 gap-3">
              {frames.map((frame, i) => (
                <div 
                  key={i} 
                  className="rounded-lg border bg-card p-2 hover-elevate"
                  data-testid={`frame-${i + 1}`}
                >
                  <img src={frame} alt={`Frame ${i + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
