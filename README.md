# One Piece Personality Test

Set sail on the Grand Line and find out which *One Piece* character you are. An animated quiz with ocean scenes, a map of your journey and a wanted-poster result you can share.

## Features

- Intro sequence and animated hero with a treasure-chest start button
- Layered background: ocean, fog, light rays, island silhouettes, particles and stars
- Quiz on parchment cards with a Grand Line progress map and sail transitions
- Result reveal with a **wanted poster**, bounty board, stat gauges and a Log Pose chart
- Downloadable share card with a QR code
- English and Arabic (RTL), with optional soundtrack and sound effects

## Stack

React · TypeScript · Vite · Tailwind CSS · Framer Motion · GSAP · Recharts · html-to-image · qrcode.react

## Run it

```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # TypeScript check
npm run build      # production build in dist/
npm run preview    # preview the build
```

## Structure

```
src/
  components/background/  ocean, fog, light rays, particles, stars
  components/hero/        logo reveal, hero, treasure-chest button
  components/quiz/        quiz flow, answer cards, Grand Line map
  components/result/      wanted poster, bounty board, stats, share card
  data/                   questions, lore, translations
```
