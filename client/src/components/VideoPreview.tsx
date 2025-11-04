import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPreviewProps {
  videoReady?: boolean;
  videoUrl?: string;
  onDownload?: () => void;
}

export default function VideoPreview({ videoReady = false, videoUrl, onDownload }: VideoPreviewProps) {
  const [voice, setVoice] = useState("alloy");

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `stickman-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    onDownload?.();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Video Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border relative overflow-hidden">
          {videoReady && videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              data-testid="video-player"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Video preview will appear here
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger data-testid="select-voice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                <SelectItem value="echo">Echo (Male)</SelectItem>
                <SelectItem value="nova">Nova (Female)</SelectItem>
                <SelectItem value="shimmer">Shimmer (Warm)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full gap-2"
            disabled={!videoReady}
            onClick={handleDownload}
            data-testid="button-download-video"
          >
            <Download className="h-4 w-4" />
            Download Video
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
