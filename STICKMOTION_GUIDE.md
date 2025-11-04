# StickMotion: Comprehensive Technical Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Video Generation Pipeline](#video-generation-pipeline)
4. [Image Generation](#image-generation)
5. [Audio Generation](#audio-generation)
6. [Video Assembly](#video-assembly)
7. [Real-time Progress Updates](#real-time-progress-updates)
8. [API Integrations](#api-integrations)
9. [Technical Stack](#technical-stack)
10. [File Structure](#file-structure)

---

## Overview

**StickMotion** is an AI-powered stickman animation video generator that transforms text scripts into engaging animated videos. It combines Google Gemini AI for intelligent scene generation, ElevenLabs for professional text-to-speech narration, and FFmpeg for video assembly.

### Key Features
- **AI-Powered Scene Generation**: Uses Google Gemini to convert script lines into visual descriptions
- **Procedural Animation**: Generates stickman animations using HTML5 Canvas
- **Professional Narration**: Creates natural-sounding voiceovers with ElevenLabs
- **Real-time Progress**: WebSocket-based live updates during generation
- **Automated Video Assembly**: FFmpeg stitches images and audio together

---

## Architecture

StickMotion follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Script Editor                                        │
│  - WebSocket Client                                     │
│  - Progress Display                                     │
│  - Video Player                                         │
└─────────────────┬───────────────────────────────────────┘
                  │ WebSocket Connection
                  ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Express + Node.js)                │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Video Generation Orchestrator           │  │
│  └─────────────────────────────────────────────────┘  │
│           ↓              ↓              ↓              │
│    ┌──────────┐   ┌──────────┐   ┌──────────┐        │
│    │  Gemini  │   │ ElevenLabs│   │  FFmpeg  │        │
│    │  Service │   │  Service  │   │  Service │        │
│    └──────────┘   └──────────┘   └──────────┘        │
└─────────────────────────────────────────────────────────┘
                  │              │              │
                  ↓              ↓              ↓
         ┌──────────────┐  ┌──────────┐  ┌──────────┐
         │ Google Gemini│  │ElevenLabs│  │ FFmpeg   │
         │     API      │  │   API    │  │ (local)  │
         └──────────────┘  └──────────┘  └──────────┘
```

---

## Video Generation Pipeline

The video generation process follows a **3-stage pipeline**:

### Stage 1: Image Generation
1. **Script Parsing**: Split input script into individual lines
2. **Scene Description**: For each line, call Gemini API to generate visual description
3. **Image Creation**: Draw stickman using Canvas based on description
4. **Rate Limiting**: Wait 15 seconds between Gemini API calls to avoid quota limits

### Stage 2: Audio Generation
1. **Script Combination**: Join all script lines into a single text
2. **Text-to-Speech**: Call ElevenLabs API to generate MP3 audio
3. **Duration Calculation**: Use FFprobe to get total audio duration

### Stage 3: Video Assembly
1. **Frame Timing**: Calculate duration per image (total audio duration / number of images)
2. **Video Creation**: Use FFmpeg to create video from image sequence
3. **Audio Mixing**: Combine video with audio track
4. **Output**: Save final MP4 file to `/public/generated/`

### Complete Workflow Diagram

```
User Input (Script)
       ↓
┌──────────────────────────────────────────┐
│  Split script into lines                 │
│  Example:                                 │
│  Line 1: "Brown eyes protect from sun"   │
│  Line 2: "Blue eyes let more light in"   │
└──────────────────┬───────────────────────┘
                   ↓
        ┌──────────────────────┐
        │  FOR EACH LINE:      │
        │  ┌─────────────────┐ │
        │  │ Gemini API Call │ │ ← Generate visual description
        │  └────────┬────────┘ │   (15 second delay between calls)
        │           ↓          │
        │  ┌─────────────────┐ │
        │  │ Draw Stickman   │ │ ← Create PNG image
        │  │ (Canvas)        │ │
        │  └─────────────────┘ │
        └──────────────────────┘
                   ↓
        All images created (frame_0.png, frame_1.png, ...)
                   ↓
┌──────────────────────────────────────────┐
│  Combine script lines into full text    │
│  Send to ElevenLabs API                  │
│  → Receive MP3 audio file                │
└──────────────────┬───────────────────────┘
                   ↓
        ┌──────────────────────┐
        │  FFprobe: Get audio  │
        │  duration (e.g. 32s) │
        └──────────┬───────────┘
                   ↓
        Calculate: 32s ÷ 13 images = 2.46s per image
                   ↓
┌──────────────────────────────────────────┐
│  FFmpeg Step 1: Create video from images│
│  - Each image displays for 2.46s        │
│  - 25 FPS, 1280x720 resolution          │
│  - Output: video_only.mp4               │
└──────────────────┬───────────────────────┘
                   ↓
┌──────────────────────────────────────────┐
│  FFmpeg Step 2: Merge video + audio     │
│  - Combine video_only.mp4 + audio.mp3   │
│  - Encode audio as AAC                  │
│  - Output: video_[timestamp].mp4        │
└──────────────────┬───────────────────────┘
                   ↓
        ┌──────────────────────┐
        │  Clean up temp files │
        │  Return video URL    │
        └──────────────────────┘
```

---

## Image Generation

### How Images Are Created

StickMotion uses **Gemini AI's native image generation** to create professional stickman illustrations:

#### Technology: Gemini 2.0 Flash with Image Generation
```typescript
import { GoogleGenAI, Modality } from "@google/genai";
```

Gemini 2.0 Flash provides native image generation capabilities, creating high-quality stickman comic panels directly from text prompts.

#### Process Flow

1. **Receive Scene Prompt**: Short visual concept from Gemini text API (max 10 words)
2. **Generate Detailed Image Prompt**: Construct comprehensive prompt with style guidelines
3. **Call Gemini Image API**: Request image generation with specific modalities
4. **Receive Base64 Image**: Get PNG image data encoded in base64
5. **Save to Disk**: Write image buffer to temp directory

#### Image Generation Prompt Structure

```typescript
const imagePrompt = `Create a clean, high-quality stickman comic panel illustration.

Style requirements:
- White or light background
- Minimalist, thin black outlines
- Simple stickman figure (circle head, stick body, arms, legs)
- Subtle colors only for key elements (e.g., brown/blue/green for eyes)
- Include short text labels if relevant (e.g., "BROWN EYES", "DNA")
- NO long captions or bottom text blocks
- Style: educational infographic / simple comic panel
- Professional and clean appearance

Scene to illustrate: ${scenePrompt}`;
```

#### Example Visual Processing

**Input Script Line**: "Brown eyes protect from the sun"

**Stage 1 - Text API Response**: "Stickman with brown eyes shading from bright sun"

**Stage 2 - Image Generation**:
```
1. Construct detailed image prompt with style guidelines
2. Send to Gemini 2.0 Flash with IMAGE modality enabled
3. Receive response with multiple parts:
   - Text part: Optional description from Gemini
   - InlineData part: Base64-encoded PNG image
4. Extract image data and decode from base64
5. Save as PNG: temp_video/frame_0.png
```

**Result**: Professional stickman comic panel showing a figure with brown eyes under the sun, with clean minimalist style and optional "BROWN EYES" label.

#### API Configuration

```typescript
const response = await genAI.models.generateContent({
  model: "gemini-2.0-flash-exp",
  contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
  config: {
    responseModalities: [Modality.TEXT, Modality.IMAGE],
  }
});
```

#### Response Processing

```typescript
for (const part of content.parts) {
  if (part.text) {
    console.log(`Gemini description: ${part.text}`);
  } else if (part.inlineData && part.inlineData.data) {
    const imageData = Buffer.from(part.inlineData.data, "base64");
    await writeFile(outputPath, imageData);
  }
}
```

#### File Output
- **Location**: `temp_video/frame_0.png`, `frame_1.png`, etc.
- **Format**: PNG (Gemini's default resolution, typically ~1024x1024)
- **Quality**: High-quality AI-generated illustrations
- **Style**: Clean educational comic panels
- **Lifecycle**: Created → Used in video → Deleted after video assembly

---

## Audio Generation

### ElevenLabs Text-to-Speech Integration

StickMotion uses **ElevenLabs** for professional-quality narration.

#### API Configuration

```typescript
Voice: "Adam" (pNInz6obpgDQGcFmaJgB)
Model: eleven_monolingual_v1
Settings:
  - Stability: 0.5
  - Similarity Boost: 0.5
```

#### Process Flow

1. **Combine Script**: Join all script lines with periods
   ```
   Input Lines:
   - "Brown eyes protect from sun"
   - "Blue eyes let more light in"
   
   Combined: "Brown eyes protect from sun. Blue eyes let more light in."
   ```

2. **API Request**: POST to ElevenLabs API
   ```typescript
   POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}
   Headers:
     - xi-api-key: [YOUR_API_KEY]
     - Content-Type: application/json
   Body:
     {
       "text": "Full script text...",
       "model_id": "eleven_monolingual_v1",
       "voice_settings": {
         "stability": 0.5,
         "similarity_boost": 0.5
       }
     }
   ```

3. **Response**: Binary MP3 audio data
4. **Save**: Write to `temp_video/audio.mp3`
5. **Duration**: Calculate using FFprobe for frame timing

#### Audio Characteristics
- **Format**: MP3
- **Voice**: Natural-sounding male voice (Adam)
- **Quality**: Optimized for narration
- **Stability**: 0.5 (balanced between consistency and expressiveness)

---

## Video Assembly

### FFmpeg: The Video Stitching Engine

FFmpeg is used to assemble images and audio into a final video file.

#### Two-Step Process

**Step 1: Create Video from Images**

FFmpeg uses a "concat demuxer" to create video from image sequence:

```bash
ffmpeg \
  -f concat \              # Use concat demuxer
  -safe 0 \                # Allow absolute paths
  -i concat.txt \          # Input: list of images with durations
  -vf "fps=25,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=white" \
  -c:v libx264 \           # H.264 video codec
  -pix_fmt yuv420p \       # Pixel format for compatibility
  video_only.mp4           # Output file
```

**concat.txt format**:
```
file '/path/to/frame_0.png'
duration 2.46153846
file '/path/to/frame_1.png'
duration 2.46153846
...
```

**Video Filters Explained**:
- `fps=25`: Set frame rate to 25 FPS
- `scale=1280:720`: Resize to 1280x720 (maintains aspect ratio)
- `pad=1280:720:-1:-1:color=white`: Add white padding if needed
- `libx264`: Industry-standard H.264 codec
- `yuv420p`: Ensures compatibility with most players

**Step 2: Merge Video with Audio**

```bash
ffmpeg \
  -i video_only.mp4 \      # Input: video from step 1
  -i audio.mp3 \           # Input: audio from ElevenLabs
  -c:v copy \              # Copy video stream (no re-encoding)
  -c:a aac \               # Encode audio as AAC
  -shortest \              # Match shortest stream duration
  output.mp4               # Final output
```

**Audio Processing**:
- Original: MP3 from ElevenLabs
- Output: AAC (better compatibility)
- Syncing: `-shortest` ensures video doesn't exceed audio length

#### Frame Duration Calculation

```typescript
// Example with 13-line script and 32.5 second audio
const totalDuration = 32.548563; // seconds (from FFprobe)
const imageCount = 13;
const frameDuration = totalDuration / imageCount;
// Result: 2.503735615 seconds per image

// Each image is displayed for ~2.5 seconds
// 25 FPS × 2.5s = ~63 frames per image
```

#### Output Specifications
- **Format**: MP4 (H.264 video + AAC audio)
- **Resolution**: 1280x720
- **Frame Rate**: 25 FPS
- **Video Codec**: libx264 (H.264)
- **Audio Codec**: AAC
- **Location**: `public/generated/video_[timestamp].mp4`

---

## Real-time Progress Updates

### WebSocket Architecture

StickMotion uses **WebSockets** for live progress updates during video generation.

#### Why WebSockets?

Video generation can take 3-5 minutes. WebSockets provide:
- **Real-time updates**: No polling needed
- **Bi-directional**: Server pushes updates to client
- **Low latency**: Instant notification of progress changes
- **Connection efficiency**: Single persistent connection

#### WebSocket Flow

```
Client (Browser)                Server (Express)
      │                              │
      │  1. Connect to /ws           │
      ├─────────────────────────────→│
      │                              │
      │  2. Send generate request    │
      │  { type: "generate",         │
      │    script: "..." }           │
      ├─────────────────────────────→│
      │                              │
      │                              │  Start video generation
      │                              │  ↓
      │  3. Progress updates         │  For each stage:
      │  { type: "progress",         │
      │    data: {                   │
      │      stage: "images",        │
      │      progress: 23,           │
      │      message: "Generated     │
      │                image 3 of 13"│
      │    }                         │
      │  }                           │
      │←─────────────────────────────┤
      │                              │
      │  (Multiple progress updates) │
      │←─────────────────────────────┤
      │                              │
      │  4. Completion               │
      │  { type: "complete",         │
      │    data: {                   │
      │      videoUrl: "/generated/  │
      │        video_123.mp4",       │
      │      duration: 32.5          │
      │    }                         │
      │  }                           │
      │←─────────────────────────────┤
      │                              │
      │  5. Close connection         │
      │←─────────────────────────────┤
```

#### Message Types

**1. Client → Server: Generate Request**
```typescript
{
  type: "generate",
  script: "Your script text..."
}
```

**2. Server → Client: Progress Update**
```typescript
{
  type: "progress",
  data: {
    stage: "images" | "audio" | "video" | "complete",
    progress: 0-100,
    message: "Human-readable status"
  }
}
```

**3. Server → Client: Completion**
```typescript
{
  type: "complete",
  data: {
    videoUrl: "/generated/video_1234567890.mp4",
    duration: 32.548563
  }
}
```

**4. Server → Client: Error**
```typescript
{
  type: "error",
  message: "Error description"
}
```

#### Frontend Progress Tracking

The frontend displays three stages:

```typescript
Stage 1: "Generating images..."     (0-33% overall progress)
  ↓ Updates: "Generated image 1 of 13", "Generated image 2 of 13", etc.

Stage 2: "Creating audio..."        (33-66% overall progress)
  ↓ Updates: "Converting script to speech...", "Audio generated"

Stage 3: "Rendering video..."       (66-100% overall progress)
  ↓ Updates: "Stitching video together...", "Video created"
```

#### Error Handling

```typescript
// Network errors
ws.onerror = (error) => {
  // Display error toast
  // Disable generating state
}

// API errors (from server)
if (message.type === "error") {
  // Show specific error message
  // e.g., "Gemini API quota exceeded"
}
```

---

## API Integrations

### 1. Google Gemini AI

**Purpose**: Convert script lines into visual scene descriptions

#### Model Used
```
gemini-2.0-flash-exp
```
This is an experimental, fast version of Gemini optimized for quick responses.

#### API Call Flow

```typescript
// For each script line:
Input: "Brown eyes protect from the sun"

Prompt sent to Gemini:
"Convert this script line into a detailed visual description 
for a stickman animation scene: 'Brown eyes protect from the sun'

Respond with only a concise visual description (1-2 sentences) 
that describes what the stickman should be doing in this scene. 
Focus on action, pose, and simple props if needed."

Response from Gemini:
"A stickman wearing sunglasses, standing under a bright sun, 
with one hand shading their eyes."
```

#### Rate Limiting Strategy

**Problem**: Free tier has strict quotas (typically 15 requests per minute)

**Solution**: Aggressive rate limiting
```typescript
RATE_LIMIT_DELAY_MS = 15000  // 15 seconds between requests

// This means:
- 4 requests per minute
- For 13-line script: ~3.25 minutes for image generation alone
```

#### Error Handling

```typescript
// Quota exceeded (429 error)
if (error.code === 429) {
  throw new Error(
    "Gemini API quota exceeded. Wait 5-10 minutes and try again. 
    Check quota at https://aistudio.google.com/app/apikey"
  );
}
```

#### Environment Setup
```bash
# Required environment variable
GOOGLE_AI_API_KEY=AIza...

# Get your key at:
https://aistudio.google.com/app/apikey
```

---

### 2. ElevenLabs Text-to-Speech

**Purpose**: Generate professional narration from script text

#### Voice Configuration

```typescript
Voice ID: "pNInz6obpgDQGcFmaJgB"  // Adam voice
Model: "eleven_monolingual_v1"
```

**Adam Voice Characteristics**:
- Male voice
- Clear, professional narration
- Good for educational/explainer content
- Neutral accent

#### API Call Example

```typescript
POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB

Headers:
  Accept: audio/mpeg
  Content-Type: application/json
  xi-api-key: sk_...

Body:
{
  "text": "Full script text here...",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,        // Consistency vs expressiveness
    "similarity_boost": 0.5  // Voice clarity
  }
}

Response:
  Binary MP3 audio data
```

#### Voice Settings Explained

**Stability (0.5)**:
- Range: 0-1
- 0 = More expressive, variable
- 1 = More consistent, robotic
- 0.5 = Balanced (recommended for narration)

**Similarity Boost (0.5)**:
- Range: 0-1
- Higher = Closer to original voice sample
- 0.5 = Good balance for clarity

#### Pricing & Quotas

ElevenLabs free tier typically includes:
- 10,000 characters per month
- ~5-10 videos depending on script length

#### Environment Setup
```bash
# Required environment variable
ELEVENLABS_API_KEY=sk_...

# Get your key at:
https://elevenlabs.io/
```

---

## Technical Stack

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 20.x |
| **Express** | Web framework | Latest |
| **TypeScript** | Type safety | 5.x |
| **tsx** | TypeScript execution | Latest |
| **ws** | WebSocket server | Latest |
| **@google/genai** | Gemini AI SDK | Latest |
| **canvas** | Server-side image generation | Latest |
| **FFmpeg** | Video processing | System binary |
| **FFprobe** | Audio duration detection | System binary |

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.x |
| **TypeScript** | Type safety | 5.x |
| **Vite** | Build tool & dev server | Latest |
| **Wouter** | Routing | Latest |
| **TanStack Query** | Data fetching | v5 |
| **Tailwind CSS** | Styling | Latest |
| **shadcn/ui** | Component library | Latest |
| **Lucide React** | Icons | Latest |

### Key Dependencies

```json
{
  "dependencies": {
    "@google/genai": "^latest",
    "canvas": "^latest",
    "express": "^latest",
    "ws": "^latest",
    "react": "^18.x",
    "wouter": "^latest",
    "@tanstack/react-query": "^5.x"
  }
}
```

---

## File Structure

```
stickmotion/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx            # Landing page hero section
│   │   │   ├── Features.tsx        # Features showcase
│   │   │   ├── ScriptEditor.tsx    # Text input for scripts
│   │   │   ├── ProgressPanel.tsx   # Real-time progress display
│   │   │   └── VideoPreview.tsx    # Video player component
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   └── Creator.tsx         # Video creation interface
│   │   ├── App.tsx                 # Main app component & routing
│   │   └── main.tsx                # React entry point
│   └── index.html                  # HTML template
│
├── server/                          # Backend Express application
│   ├── services/
│   │   ├── videoGenerator.ts       # 🎬 Main orchestrator
│   │   │                           #    - Coordinates all services
│   │   │                           #    - Manages generation pipeline
│   │   │                           #    - Sends progress updates
│   │   │
│   │   ├── gemini.ts              # 🤖 Gemini AI integration
│   │   │                           #    - Script → visual descriptions
│   │   │                           #    - Rate limiting logic
│   │   │                           #    - Error handling
│   │   │
│   │   ├── imageGenerator.ts       # 🎨 Canvas-based image creation
│   │   │                           #    - Draws stickman figures
│   │   │                           #    - Processes AI descriptions
│   │   │                           #    - Exports PNG files
│   │   │
│   │   ├── elevenlabs.ts          # 🔊 Text-to-speech
│   │   │                           #    - Generates narration
│   │   │                           #    - Voice: Adam
│   │   │
│   │   └── ffmpeg.ts              # 🎞️ Video assembly
│   │                               #    - Images → video
│   │                               #    - Audio mixing
│   │                               #    - Duration calculation
│   │
│   ├── routes.ts                   # API routes & WebSocket
│   ├── index.ts                    # Express server entry
│   └── storage.ts                  # In-memory storage
│
├── shared/
│   └── schema.ts                   # Shared TypeScript types
│
├── public/
│   └── generated/                  # 📹 Final video outputs
│       └── video_[timestamp].mp4
│
├── temp_video/                     # 🗑️ Temporary files (auto-deleted)
│   ├── frame_0.png                 #    - Generated images
│   ├── frame_1.png
│   ├── audio.mp3                   #    - Generated audio
│   └── concat.txt                  #    - FFmpeg input list
│
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite configuration
└── tailwind.config.ts              # Tailwind CSS config
```

### Critical Directories

**`/public/generated/`**
- Stores final MP4 videos
- Publicly accessible via HTTP
- Files persist after generation
- URL format: `/generated/video_[timestamp].mp4`

**`/temp_video/`**
- Temporary workspace for generation
- Files are deleted after video creation
- Includes: images, audio, FFmpeg concat files

---

## Complete Example Walkthrough

Let's trace a complete video generation from start to finish:

### User Input
```
Script (4 lines):
"Brown eyes protect from the sun."
"Blue eyes let more light in."
"Green eyes are the rarest."
"All eye colors are beautiful."
```

### Step-by-Step Execution

#### **Stage 1: Image Generation (0-60 seconds)**

**Line 1: "Brown eyes protect from the sun."**
```
1. Send to Gemini API (wait 0s - first request)
   → Response: "A stickman wearing sunglasses under a bright sun"
   
2. Create canvas 1280x720
3. Draw stickman (standard pose)
4. Add description text at bottom
5. Save: temp_video/frame_0.png
6. Progress: 25% (1 of 4 images)
```

**Line 2: "Blue eyes let more light in."** 
```
1. Wait 15 seconds (rate limiting)
2. Send to Gemini API
   → Response: "A stickman pointing at their eyes with rays of light"
   
3. Create canvas
4. Draw stickman (standard pose)
5. Add description text
6. Save: temp_video/frame_1.png
7. Progress: 50% (2 of 4 images)
```

**Line 3 & 4: Similar process...**
```
Total time: ~45 seconds (3 × 15s delays)
Output: frame_0.png, frame_1.png, frame_2.png, frame_3.png
```

#### **Stage 2: Audio Generation (60-70 seconds)**

```
1. Combine script:
   "Brown eyes protect from the sun. Blue eyes let more light in. 
    Green eyes are the rarest. All eye colors are beautiful."

2. Send to ElevenLabs API
   Request size: ~120 characters
   
3. Receive MP3 audio (~8 seconds long)
   
4. Save: temp_video/audio.mp3

5. Calculate duration with FFprobe:
   → Result: 8.234 seconds

6. Calculate frame timing:
   8.234 seconds ÷ 4 images = 2.0585 seconds per image
```

#### **Stage 3: Video Assembly (70-80 seconds)**

**FFmpeg Step 1: Create video from images**
```
1. Create concat.txt:
   file '/path/temp_video/frame_0.png'
   duration 2.0585
   file '/path/temp_video/frame_1.png'
   duration 2.0585
   file '/path/temp_video/frame_2.png'
   duration 2.0585
   file '/path/temp_video/frame_3.png'
   duration 2.0585

2. Run FFmpeg:
   ffmpeg -f concat -i concat.txt \
     -vf "fps=25,scale=1280:720" \
     -c:v libx264 -pix_fmt yuv420p \
     temp_video/video_only.mp4
     
   Output: 8.234 second video, 25 FPS
   Frames: 8.234 × 25 = ~206 frames
```

**FFmpeg Step 2: Merge with audio**
```
1. Run FFmpeg:
   ffmpeg -i video_only.mp4 -i audio.mp3 \
     -c:v copy -c:a aac -shortest \
     public/generated/video_1762237893202.mp4
     
2. Result:
   - File size: ~1-2 MB
   - Duration: 8.234 seconds
   - Resolution: 1280x720
   - Codecs: H.264 + AAC
```

#### **Cleanup & Response (80-82 seconds)**

```
1. Delete temporary files:
   ✗ temp_video/frame_0.png
   ✗ temp_video/frame_1.png
   ✗ temp_video/frame_2.png
   ✗ temp_video/frame_3.png
   ✗ temp_video/audio.mp3
   ✗ temp_video/concat.txt
   ✗ temp_video/video_only.mp4

2. Send WebSocket message:
   {
     type: "complete",
     data: {
       videoUrl: "/generated/video_1762237893202.mp4",
       duration: 8.234
     }
   }

3. Frontend displays video player
4. User can watch/download video
```

### Final Output

**Video File**: `public/generated/video_1762237893202.mp4`
- **Duration**: 8.23 seconds
- **Resolution**: 1280x720
- **Frame Rate**: 25 FPS
- **Video Codec**: H.264
- **Audio Codec**: AAC
- **File Size**: ~1.5 MB

**Accessible at**: `https://your-app.replit.dev/generated/video_1762237893202.mp4`

---

## Performance Optimization

### Current Bottlenecks

1. **Gemini API Rate Limiting**: 15 seconds per request
   - 10-line script = 2.5 minutes for images alone
   
2. **Sequential Processing**: Images generated one at a time
   - Cannot parallelize due to rate limits

3. **FFmpeg Processing**: ~5-10 seconds for video assembly
   - Relatively fast, not a major bottleneck

### Total Generation Time Examples

| Script Length | Images | Audio | Video | **Total** |
|---------------|--------|-------|-------|-----------|
| 4 lines | 45s | 5s | 8s | **~1 min** |
| 10 lines | 2.5m | 5s | 10s | **~3 min** |
| 20 lines | 5m | 8s | 15s | **~5.5 min** |

### Potential Optimizations

1. **Batch Gemini Requests**: Use Gemini's batch API (if available)
2. **Parallel Audio Generation**: Generate audio while creating images
3. **Caching**: Cache Gemini responses for repeated phrases
4. **Progressive Video**: Show preview after first few frames

---

## Troubleshooting Guide

### Common Issues

#### 1. Gemini API Quota Exceeded
**Error**: "RESOURCE_EXHAUSTED" (429)

**Cause**: Too many API requests too quickly

**Solutions**:
- Wait 5-10 minutes before retrying
- Use shorter scripts (< 5 lines) for testing
- Check quota at https://aistudio.google.com/app/apikey
- Current rate limit is very conservative (15s between requests)

#### 2. ElevenLabs Character Limit
**Error**: "Character limit exceeded"

**Cause**: Script too long for free tier (10,000 chars/month)

**Solutions**:
- Keep scripts under 500 characters
- Monitor monthly usage
- Upgrade to paid plan if needed

#### 3. FFmpeg Not Found
**Error**: "FFmpeg error: command not found"

**Cause**: FFmpeg not installed on system

**Solutions**:
- Replit: Pre-installed, shouldn't occur
- Local dev: Install FFmpeg via package manager

#### 4. WebSocket Connection Failed
**Error**: "WebSocket connection failed"

**Cause**: CORS or network issues

**Solutions**:
- Check server is running on correct port (5000)
- Verify WebSocket endpoint: ws://localhost:5000/ws
- Check browser console for specific errors

---

## Security Considerations

### API Key Management

**Current Setup**: Environment variables
```bash
GOOGLE_AI_API_KEY=AIza...
ELEVENLABS_API_KEY=sk_...
```

**Best Practices**:
✅ Never commit API keys to git
✅ Use Replit Secrets for production
✅ Rotate keys regularly
✅ Monitor usage for abuse

### File Safety

**Temporary Files**: Auto-deleted after generation
- Prevents disk space issues
- No sensitive data persistence

**Output Files**: Publicly accessible
- Consider adding authentication
- Implement file size limits
- Add expiration/cleanup for old videos

---

## Future Enhancements

### Potential Features

1. **Advanced Animation**
   - More complex stickman poses
   - Facial expressions
   - Props and backgrounds

2. **Voice Customization**
   - Multiple voice options
   - Speed/pitch controls
   - Different languages

3. **Video Styles**
   - Color schemes
   - Animation effects
   - Transition animations

4. **Batch Processing**
   - Queue multiple videos
   - Background generation
   - Email notifications

5. **Export Options**
   - Different resolutions
   - GIF output
   - Subtitle support

---

## Conclusion

StickMotion demonstrates a sophisticated integration of modern AI services:

- **Google Gemini**: Intelligent scene interpretation
- **ElevenLabs**: Professional narration
- **FFmpeg**: Robust video processing
- **WebSockets**: Real-time user feedback

The system is designed to be:
- **Scalable**: Modular architecture
- **Maintainable**: Clear separation of concerns
- **User-friendly**: Real-time progress updates
- **Reliable**: Comprehensive error handling

Total generation time scales linearly with script length, with the primary bottleneck being Gemini API rate limits (15 seconds between requests).

---

## Additional Resources

- **Google Gemini API Docs**: https://ai.google.dev/docs
- **ElevenLabs API Docs**: https://elevenlabs.io/docs
- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **Node Canvas**: https://github.com/Automattic/node-canvas
- **WebSocket API**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

**Version**: 1.0  
**Last Updated**: November 4, 2025  
**Author**: StickMotion Development Team
