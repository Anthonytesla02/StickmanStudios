import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { generateStickmanPrompt } from "./gemini";
import { generateStickmanImage } from "./imageGenerator";
import { generateAudio } from "./elevenlabs";
import { createVideo, getAudioDuration, type VideoFrame } from "./ffmpeg";

export interface GenerationProgress {
  stage: "images" | "audio" | "video" | "complete";
  progress: number;
  message: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  duration: number;
}

export async function generateVideo(
  script: string,
  onProgress?: (progress: GenerationProgress) => void
): Promise<VideoGenerationResult> {
  // Create output directories
  const outputDir = path.join(process.cwd(), "public", "generated");
  const tempDir = path.join(process.cwd(), "temp_video");
  
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }
  if (!existsSync(tempDir)) {
    await mkdir(tempDir, { recursive: true });
  }

  // Split script into lines
  const scriptLines = script
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (scriptLines.length === 0) {
    throw new Error("Script is empty");
  }

  // Stage 1: Generate images
  onProgress?.({
    stage: "images",
    progress: 0,
    message: "Generating stickman images...",
  });

  const imagePaths: string[] = [];
  for (let i = 0; i < scriptLines.length; i++) {
    const line = scriptLines[i];
    
    // Get visual description from Gemini
    const description = await generateStickmanPrompt(line);
    
    // Generate image
    const imagePath = path.join(tempDir, `frame_${i}.png`);
    await generateStickmanImage(description, imagePath);
    imagePaths.push(imagePath);

    onProgress?.({
      stage: "images",
      progress: ((i + 1) / scriptLines.length) * 100,
      message: `Generated image ${i + 1} of ${scriptLines.length}`,
    });
  }

  // Stage 2: Generate audio
  onProgress?.({
    stage: "audio",
    progress: 0,
    message: "Converting script to speech...",
  });

  const fullScript = scriptLines.join(". ");
  const audioPath = path.join(tempDir, "audio.mp3");
  const audioBuffer = await generateAudio(fullScript);
  await writeFile(audioPath, audioBuffer);

  onProgress?.({
    stage: "audio",
    progress: 100,
    message: "Audio generated successfully",
  });

  // Get audio duration to calculate frame durations
  const totalDuration = await getAudioDuration(audioPath);
  const frameDuration = totalDuration / imagePaths.length;

  // Stage 3: Create video
  onProgress?.({
    stage: "video",
    progress: 0,
    message: "Stitching video together...",
  });

  const frames: VideoFrame[] = imagePaths.map((imagePath) => ({
    imagePath,
    duration: frameDuration,
  }));

  const timestamp = Date.now();
  const outputPath = path.join(outputDir, `video_${timestamp}.mp4`);
  await createVideo(frames, audioPath, outputPath);

  onProgress?.({
    stage: "video",
    progress: 100,
    message: "Video created successfully",
  });

  // Clean up temporary files
  for (const imagePath of imagePaths) {
    await unlink(imagePath).catch(() => {});
  }
  await unlink(audioPath).catch(() => {});

  onProgress?.({
    stage: "complete",
    progress: 100,
    message: "Video generation complete!",
  });

  return {
    videoUrl: `/generated/video_${timestamp}.mp4`,
    duration: totalDuration,
  };
}
