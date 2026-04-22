# 🎨 Moodboard

A Pinterest-style AI moodboard that curates visuals based on your vibe.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.example .env
# Edit .env and add your Anthropic API key

# 3. Run the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start vibing.

## Project Structure

```
src/
├── App.jsx              # Main app, mood state, Claude API call
├── moods.js             # Mood configs, image queries, URL builder
├── index.css            # Global resets + shimmer animation
├── main.jsx             # React root
└── components/
    ├── Header.jsx        # Scroll-reactive sticky header
    ├── FloatingOrbs.jsx  # Animated ambient background orbs
    ├── MoodPill.jsx      # Mood selector button
    ├── MoodPrompt.jsx    # AI free-text vibe input
    ├── MasonryGrid.jsx   # 3-column Pinterest-style layout
    └── PinCard.jsx       # Individual image card with hover state
```

## Customization

### Swap in Pinterest images
In `src/moods.js`, replace the `getImageUrl()` function with your Pinterest API call:

```js
export const getImageUrl = async (query) => {
  // Call Pinterest API here
  // https://developers.pinterest.com/docs/api/v5/
  const res = await fetch(`https://api.pinterest.com/v5/pins/search?query=${query}`, {
    headers: { Authorization: `Bearer YOUR_PINTEREST_TOKEN` }
  })
  const data = await res.json()
  return data.items[0]?.media?.images?.['600x']?.url
}
```

### Add more moods
In `src/moods.js`, extend `MOODS` and `MOOD_QUERIES`:

```js
{
  id: 'cottagecore',
  label: 'Cottagecore',
  emoji: '🍄',
  palette: ['#a3c77f', '#d4a96a', '#8b5e3c', '#f0e6cc'],
  bg: 'linear-gradient(135deg,#1a2e0a 0%,#2d4a1a 100%)',
}
```

### Deploy to Vercel
```bash
npm run build
# Push to GitHub, then import at vercel.com
# Add VITE_ANTHROPIC_API_KEY in Vercel environment variables
```

## Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion** for all animations
- **Unsplash Source** for images (no key needed)
- **Anthropic Claude API** for mood-to-vibe matching
