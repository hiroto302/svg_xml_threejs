# Project: svg_xml_threejs

Three.js project exploring SVG/XML integration with loading screen effects.

## Tech Stack

- Vite + Three.js + GSAP
- Vanilla JavaScript (ES Modules)
- SVG for loading UI and particle effects

## Commit Convention

- Format: `<type>: <subject>`
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`
- Subject: imperative mood, lowercase, max 50 chars, no period
- Body (optional): explain "why" not "what", wrap at 72 chars
- Always append `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` trailer
- Write commit messages in English

### Examples

```
feat: add confetti particle effect on loading complete

Spawn SVG-based confetti and spark particles from screen center
when the loading progress reaches 100%, creating a celebration
moment before transitioning to the Three.js scene.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Project Structure

```
src/
  index.html    - Entry HTML with canvas and loading overlay
  main.js       - Three.js scene setup, loading flow, effects
  style.css     - Global styles and overlay layout
  svg/          - SVG assets (loading animations, effects)
static/         - Public static assets
```
