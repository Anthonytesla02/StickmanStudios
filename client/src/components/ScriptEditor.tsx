import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface ScriptEditorProps {
  onGenerate?: (script: string) => void;
  disabled?: boolean;
}

export default function ScriptEditor({ onGenerate, disabled }: ScriptEditorProps) {
  const [script, setScript] = useState("");
  const lines = script.split("\n").filter(line => line.trim()).length;
  const charCount = script.length;

  const handleGenerate = () => {
    if (script.trim() && onGenerate) {
      onGenerate(script);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Script Editor
        </CardTitle>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span data-testid="text-line-count">{lines} lines</span>
          <span data-testid="text-char-count">{charCount} characters</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="Enter your script here, one scene per line...&#10;&#10;Example:&#10;A stickman wakes up in the morning&#10;He walks to the kitchen&#10;He makes a cup of coffee"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="flex-1 resize-none font-mono text-sm"
          data-testid="input-script"
        />
        <Button
          onClick={handleGenerate}
          disabled={!script.trim() || disabled}
          className="w-full gap-2"
          data-testid="button-generate-video"
        >
          <Sparkles className="h-4 w-4" />
          Generate Video
        </Button>
      </CardContent>
    </Card>
  );
}
