# Design Guidelines: AI Stickman Video Generator SaaS

## Design Approach

**Reference-Based Hybrid Approach**
Drawing inspiration from modern AI creative tools (Runway, Descript, Synthesia) combined with clean SaaS interfaces (Linear, Notion). Focus on intuitive workflow, clear visual hierarchy, and professional credibility while maintaining creative approachability.

**Core Design Principles:**
- Workflow clarity: Guide users seamlessly from script to video
- Visual confidence: Professional aesthetic that builds trust in AI capabilities
- Progressive disclosure: Show complexity only when needed
- Immediate value: Front-load capability demonstration

---

## Typography System

**Font Families:**
- Primary: Inter (Google Fonts) - UI, body text, technical content
- Display: Outfit (Google Fonts) - Headlines, hero sections, feature titles

**Type Scale:**
- Hero Headline: text-6xl md:text-7xl, font-bold
- Section Headings: text-4xl md:text-5xl, font-bold
- Subsection Headings: text-2xl md:text-3xl, font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base, font-normal, leading-relaxed
- UI Labels: text-sm font-medium
- Captions/Meta: text-xs font-normal

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Component padding: p-6 to p-8
- Section padding: py-16 md:py-24 lg:py-32
- Card spacing: gap-6 to gap-8
- Form element spacing: space-y-4

**Grid System:**
- Landing page: max-w-7xl container
- App interface: Full-width with sidebar (w-64) + main content area
- Feature grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Content width: max-w-4xl for script editor

---

## Landing Page Structure

### Hero Section (80vh)
- Left column (60%): Bold headline "Generate Stickman Videos with AI", subheadline explaining the script-to-video workflow, primary CTA "Start Creating Free", secondary CTA "Watch Demo"
- Right column (40%): Embedded video preview showing actual generated stickman video (MP4 autoplay, muted, loop) with subtle shadow and rounded corners (rounded-2xl)
- Background: Clean gradient treatment with subtle grid pattern

### How It Works Section
Three-column grid showcasing workflow:
1. **Write Your Script** - Icon: document/pencil, description of multi-line script editor
2. **AI Generates Scenes** - Icon: sparkles/wand, explain Gemini image generation
3. **Download Video** - Icon: download/video, FFmpeg stitching explanation
Each card with icon (heroicons via CDN), title, description, subtle elevation

### Features Showcase
Two-column alternating layout (image left/right pattern):
- **Intelligent Scene Generation**: Screenshot of Gemini-generated stickman frames, description of AI capabilities
- **Professional Narration**: Waveform visualization, ElevenLabs voice quality details
- **Instant Video Export**: MP4 preview interface, download options
- **Project Management**: Dashboard screenshot, save/organize videos

### Pricing Section
Three-tier card layout (grid-cols-1 md:grid-cols-3):
- Free tier: Basic features highlighted
- Pro tier: Featured with elevated card treatment, "Most Popular" badge
- Enterprise tier: Custom options
Each with clear feature lists, pricing, CTA button

### Social Proof
- Testimonial cards (grid-cols-1 md:grid-cols-2) with user avatars (placeholder circles), quotes, names, roles
- Stats bar: "X videos generated", "Y happy creators", "Z minutes saved"

### Footer
Full-featured with:
- Logo and tagline
- Quick links (Features, Pricing, Documentation, API)
- Social media icons (Twitter, LinkedIn, YouTube)
- Newsletter signup form
- Copyright and legal links

---

## Application Interface

### Layout Structure
**Dashboard View:**
- Fixed top navigation bar (h-16): Logo left, user menu/avatar right
- Left sidebar (w-64, fixed): Project list, "New Project" button, recent videos
- Main content area: Responsive grid for video project cards

### Video Creation Workspace
**Three-Panel Layout:**

**Left Panel (w-1/3):**
- Script editor with line-by-line input
- Textarea with monospace font
- Line counter and character count
- "Generate Video" primary button at bottom

**Center Panel (w-1/3):**
- Generation progress indicator
- Step-by-step status: "Generating images...", "Creating audio...", "Rendering video..."
- Progress bar with percentage
- Stickman frame previews in grid (grid-cols-2 gap-2)
- Real-time generation logs in scrollable container

**Right Panel (w-1/3):**
- Video preview player (16:9 aspect ratio)
- Custom video controls
- Download button (when complete)
- Settings panel: Voice selection (ElevenLabs voices dropdown), video quality options

### Project Card Design
- Thumbnail preview (16:9 ratio, rounded-lg)
- Video title (editable inline)
- Metadata: Duration, created date, status badge
- Action menu: Download, Delete, Duplicate
- Hover state: Slight elevation, play icon overlay

---

## Component Library

### Buttons
- Primary: Solid with strong elevation, font-semibold, px-6 py-3, rounded-lg
- Secondary: Outline style, px-6 py-3, rounded-lg
- Tertiary: Text only with icon, px-4 py-2
- Icon buttons: Square, p-2, rounded-md
- When on images: Backdrop blur (backdrop-blur-md), semi-transparent treatment

### Forms
- Input fields: border, rounded-lg, px-4 py-3, focus ring
- Textareas: Same styling as inputs, min-h-48
- Labels: text-sm font-medium, mb-2
- Helper text: text-xs below fields
- Error states: border treatment and text-red-600 messages

### Cards
- Container: rounded-xl, shadow-sm, border
- Header: p-6, border-b
- Body: p-6
- Hover state on interactive cards: shadow-md transition

### Navigation
- Top nav: Sticky, backdrop-blur-lg, border-b
- Sidebar: Fixed, subtle border-right, scrollable content area
- Active states: Background treatment, font-semibold

### Progress Indicators
- Linear progress bar: h-2, rounded-full, overflow-hidden
- Circular spinner: For loading states
- Step indicator: Numbered circles with connecting lines

### Modals/Overlays
- Backdrop: Semi-transparent overlay with backdrop-blur
- Modal content: max-w-2xl, rounded-2xl, shadow-2xl, p-8
- Close button: Top-right, icon button

---

## Icons
**Library:** Heroicons via CDN
**Usage:**
- Navigation: outline style, w-5 h-5
- Feature cards: solid style, w-8 h-8
- Buttons: w-5 h-5
- Status indicators: w-4 h-4

---

## Images

### Landing Page Images:
1. **Hero Video Preview** (right column): Actual MP4 sample of generated stickman video, autoplay loop, dimensions 720x480, rounded-2xl shadow-2xl
2. **Feature Screenshots** (4 images in How It Works section): 
   - Script editor interface mockup (show textarea with sample script)
   - Generated stickman frames grid (4-6 simple stick figure illustrations)
   - Waveform visualization (audio generation preview)
   - Final video player interface
3. **Social Proof**: User avatar placeholders (circular, 48x48px) in testimonial cards

### Application Images:
- Video thumbnails: 16:9 ratio, generated stickman frame preview
- Empty state illustrations: Simple stick figure holding sign "Start Creating"

---

## Accessibility
- Consistent focus indicators across all interactive elements
- Semantic HTML structure with proper heading hierarchy
- ARIA labels for icon-only buttons
- Keyboard navigation support for video player controls
- High contrast text ensuring WCAG AA compliance
- Form validation with clear error messaging

---

## Animations
**Minimal, Purposeful Motion:**
- Button hover: Subtle transform scale(1.02)
- Card hover: Shadow transition (duration-200)
- Progress bar: Smooth width transitions
- Page transitions: Fade in content (duration-300)
- No scroll-triggered animations
- Video generation: Pulse animation on active status indicators only