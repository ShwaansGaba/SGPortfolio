# Shwaans Gaba : Portfolio Website

A personal portfolio built around a **scroll-driven cinematic laptop animation**, Swiss-inspired architectural editorial typography, and a **navy blue translucent curvy theme**.

## Architecture & Visual Mechanics

### 1. Scroll-Driven Cinematic Animation (`js/canvas-animation.js`)
- **HD Frame Sequence**: 240 high-definition PNG frames loaded from `gemini_generated_video_cd0d7216_gwr_video_mvp_frames/gemini_generated_video_cd0d7216_gwr_video_mvp_frames/frame_001.png` to `frame_240.png`.
- **Full-Screen Canvas (`<canvas id="hero-canvas">`)**: Draws frames sequentially based on precise scroll progress through a `420vh` track.
- **Initial Composition**: The closed space-gray laptop sits grounded in the lower viewport against a deep black canvas.
- **Opening & Logo Unfolding**: As user scrolls down, the laptop lid opens smoothly (frames 30–110), revealing the display. The geometric **SG** logo (Shwaans Gaba) then unfolds at the center of the display (frames 110–175).
- **Camera Push-In & Optical Blur**: From frame 175 to 224, the camera conducts a smooth 3D push-in directly toward the display with an optical lens blur effect.
- **Bi-Directional Synchronization**: Scrolling down advances the animation; scrolling up reverses the sequence back to the closed state.
- **Scroll-Based Blur Transitions**: Elements on the page transition smoothly from blur to focus (`filter: blur(14px) -> blur(0px)`) as they enter the viewport.

### 2. Curvy Floating Navbar (`#main-nav`)
- Designed as an architectural floating pill (`border-radius: 9999px`) with `backdrop-filter: blur(28px) saturate(180%)` and a deep navy translucent tint.
- Remains concealed during the opening laptop sequence.
- Glides down with a smooth blur-fade transition once the camera enters the display screen (`progress >= 0.88`).

### 3. Project Showcase & 3D Helical Spiral
- **3D Spiral Scroll Showcase (`#spiral-track`)**: A dedicated helical 3D scroll section preceding the main project showcase. Project cards rotate and travel through perspective 3D space (`perspective: 1200px`) as the user scrolls.
- **Alternating Editorial Layouts (`#work`)**:
  - **Ekman by Ekta** (`ekmanbyekta.com`): Herbal skincare e-commerce startup with inventory management and payment gateway integration. (Text on Left, Image on Right)
  - **Sound Finance Pvt. Ltd.** (`sankalpdigitech.github.io/SoundFinance/`): Commercial vehicle financing and online EMI platform for an RBI-registered NBFC firm in Delhi. (Image on Left, Text on Right)
  - **Grynd** (`sankalpdigitech.github.io/Grynd/`): Prototype online freelance marketplace for student and teen creators. (Text on Left, Image on Right)
  - Direct live links and interactive case study deep-dive drawers for all three builds.

---

## Local Development & Preview

To run the local server:
```bash
node server.js
```
Then navigate to `http://localhost:3000` in any modern web browser.
