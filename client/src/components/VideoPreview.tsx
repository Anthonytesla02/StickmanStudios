import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
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
  onDownload?: () => void;
}

export default function VideoPreview({ videoReady = true, onDownload }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState("alloy");

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pause video' : 'Play video');
  };

  const handleDownload = () => {
    console.log('Download video');
    onDownload?.();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Video Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border relative overflow-hidden">
          {videoReady ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
              <Button
                size="icon"
                variant="secondary"
                className="relative z-10 h-16 w-16 rounded-full"
                onClick={togglePlay}
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
            </>
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
