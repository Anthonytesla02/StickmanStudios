# StickMotion - AI-Powered Stickman Video Generator

## Overview

StickMotion is a SaaS application that transforms text scripts into animated stickman videos using AI. Users write scripts line-by-line, and the system generates corresponding stickman illustrations for each scene using Google Gemini, creates professional narration with ElevenLabs text-to-speech, and assembles everything into a downloadable MP4 video. The application features a landing page showcasing the product and a creator interface for video generation with real-time progress updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and component-based UI
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing (landing page and creator page)
- Component-first architecture with reusable UI elements

**UI Component System**
- shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system uses "new-york" style variant with neutral color palette
- Supports light/dark mode theming via CSS custom properties
- Typography uses Inter (UI/body) and Outfit (display/headlines) from Google Fonts

**State Management**
- TanStack Query (React Query) for server state management and API requests
- Local React state (useState) for UI-specific state
- WebSocket connection for real-time video generation progress updates

**Key Pages**
- Home: Marketing landing page with hero, features, how-it-works, and pricing sections
- Creator: Interactive video generation interface with script editor, progress panel, and video preview

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- Hybrid WebSocket/REST API approach for flexible client communication
- Custom middleware for request logging and JSON body parsing with raw buffer access

**WebSocket Integration**
- Real-time bidirectional communication using the `ws` library
- Progress streaming during video generation (image generation, audio creation, video rendering stages)
- Graceful fallback to REST API endpoint for video generation if needed

**Video Generation Pipeline**
1. Script parsing: Split input into individual scene lines
2. Image generation: Use Gemini to create visual descriptions, then generate stickman images via canvas
3. Audio synthesis: Convert script text to speech using ElevenLabs API
4. Video assembly: Use FFmpeg to combine images and audio into MP4 format

**Static File Serving**
- Generated videos stored in `/public/generated` directory
- Served via Express static middleware at `/generated` route
- Vite handles client asset bundling and serving

### Data Storage Solutions

**In-Memory Storage (Current Implementation)**
- `MemStorage` class implements basic CRUD operations for users
- No persistent database in current state - uses in-memory Map structures
- User schema defined with Drizzle ORM for future PostgreSQL integration

**Database Schema (Prepared for PostgreSQL)**
- Drizzle ORM configured with PostgreSQL dialect
- Schema defines users table with UUID primary keys, username, and password fields
- Connection configured via `DATABASE_URL` environment variable
- Migration files output to `./migrations` directory

**File System Storage**
- Temporary files during video processing stored in `/temp_video` directory
- Final video outputs saved to `/public/generated` for client download access

### Authentication & Authorization

**Current State**
- User schema prepared but authentication not actively implemented
- Basic user storage interface (getUser, getUserByUsername, createUser) exists
- Password field present in schema but no hashing/validation logic implemented

**Prepared Infrastructure**
- Session management via `connect-pg-simple` package (PostgreSQL session store)
- Express session middleware ready for integration
- User validation schemas using Zod via `drizzle-zod`

## External Dependencies

### AI Services

**Google Gemini (via @google/genai)**
- Model: `gemini-2.0-flash-exp`
- Purpose: Converts script lines into detailed visual descriptions for stickman scenes
- Requires `GOOGLE_AI_API_KEY` environment variable
- Configured for non-Vertex AI usage (direct API access)

**ElevenLabs Text-to-Speech**
- Voice ID: `pNInz6obpgDQGcFmaJgB` (Adam voice)
- Model: `eleven_monolingual_v1`
- Purpose: Generates professional narration from script text
- Requires `ELEVENLABS_API_KEY` environment variable
- Returns MP3 audio buffers

### Media Processing

**FFmpeg**
- Used via child_process execFile for video assembly
- Operations: image concatenation, audio mixing, format conversion
- Output: 1280x720 MP4 videos at 25fps with yuv420p pixel format
- Handles frame duration timing and audio synchronization

**Canvas (node-canvas)**
- Server-side image generation for stickman illustrations
- Creates 1280x720 pixel images with programmatic drawing
- Generates basic stickman poses based on keyword detection in scene descriptions
- Alternative to external image generation APIs

### Database (Prepared)

**Neon Database (@neondatabase/serverless)**
- Serverless PostgreSQL provider
- Connection via `DATABASE_URL` environment variable
- Used with Drizzle ORM for type-safe database queries
- Session storage via `connect-pg-simple` for PostgreSQL-backed sessions

### Development Tools

**Replit Integration**
- `@replit/vite-plugin-runtime-error-modal` for development error overlays
- `@replit/vite-plugin-cartographer` for code navigation
- `@replit/vite-plugin-dev-banner` for development environment indicators
- Only loaded in non-production Replit environments

### Build & Deployment

**Production Build**
- Client: Vite builds React app to `/dist/public`
- Server: esbuild bundles Express server to `/dist/index.js` with ESM format
- All dependencies marked as external in server bundle
- Serves pre-built static files in production mode