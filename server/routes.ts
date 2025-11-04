import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import { storage } from "./storage";
import { generateVideo } from "./services/videoGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // WebSocket for real-time progress updates
  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");

    ws.on("message", async (message: any) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "generate") {
          const { script } = data;

          // Generate video with progress updates
          try {
            const result = await generateVideo(script, (progress) => {
              ws.send(JSON.stringify({ type: "progress", data: progress }));
            });

            ws.send(JSON.stringify({ type: "complete", data: result }));
          } catch (error: any) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: error.message || "Video generation failed",
              })
            );
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  // REST API endpoint for video generation (alternative to WebSocket)
  app.post("/api/generate-video", async (req, res) => {
    try {
      const { script } = req.body;

      if (!script || typeof script !== "string") {
        return res.status(400).json({ message: "Script is required" });
      }

      const result = await generateVideo(script);
      res.json(result);
    } catch (error: any) {
      console.error("Video generation error:", error);
      res.status(500).json({ message: error.message || "Video generation failed" });
    }
  });

  return httpServer;
}
