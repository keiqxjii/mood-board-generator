// ─── Mood definitions ─────────────────────────────────────────────────────────
export const MOODS = [
  {
    id: 'dreamy',
    label: 'Dreamy',
    emoji: '🌙',
    palette: ['#c9b8f0', '#f0d8f5', '#8b6fcf', '#e8c4e8'],
    bg: 'linear-gradient(135deg,#1a0533 0%,#2d1b5e 50%,#4a2080 100%)',
  },
  {
    id: 'golden',
    label: 'Golden Hour',
    emoji: '🌅',
    palette: ['#f5c842', '#f5935a', '#e8724a', '#fde68a'],
    bg: 'linear-gradient(135deg,#3d1c02 0%,#7a3b0e 40%,#c4640a 100%)',
  },
  {
    id: 'coastal',
    label: 'Coastal',
    emoji: '🌊',
    palette: ['#7dd3fc', '#38bdf8', '#0ea5e9', '#e0f2fe'],
    bg: 'linear-gradient(135deg,#012b45 0%,#0c4a6e 50%,#075985 100%)',
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌿',
    palette: ['#86efac', '#4ade80', '#16a34a', '#dcfce7'],
    bg: 'linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)',
  },
  {
    id: 'chaos',
    label: 'Chaotic',
    emoji: '⚡',
    palette: ['#f43f5e', '#fb923c', '#facc15', '#a855f7'],
    bg: 'linear-gradient(135deg,#0c0014 0%,#1e003b 40%,#2d0050 100%)',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    emoji: '🤍',
    palette: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#f8fafc'],
    bg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    emoji: '🌸',
    palette: ['#fda4af', '#fb7185', '#e11d48', '#ffe4e6'],
    bg: 'linear-gradient(135deg,#3b0022 0%,#6b0033 40%,#9f1239 100%)',
  },
  {
    id: 'retro',
    label: 'Retro',
    emoji: '📼',
    palette: ['#fcd34d', '#f97316', '#84cc16', '#06b6d4'],
    bg: 'linear-gradient(135deg,#1c0a00 0%,#3b1200 50%,#5a1f00 100%)',
  },
]

// ─── Unsplash queries per mood ─────────────────────────────────────────────────
// Swap these with Pinterest API calls when you're ready
export const MOOD_QUERIES = {
  dreamy:   ['galaxy nebula', 'moon night', 'purple clouds', 'dreamy bokeh', 'lavender field', 'mystical forest'],
  golden:   ['golden hour sunset', 'warm light photography', 'desert dunes', 'autumn leaves', 'sunrise beach', 'golden field'],
  coastal:  ['ocean waves', 'beach aerial', 'blue lagoon', 'sea foam', 'coastal cliff', 'tropical reef'],
  forest:   ['forest sunlight', 'moss green', 'fern macro', 'redwood trees', 'misty woods', 'jungle canopy'],
  chaos:    ['lightning storm', 'neon city', 'graffiti art', 'explosion color', 'electric lights', 'urban chaos'],
  minimal:  ['white marble', 'minimal architecture', 'fog mountain', 'clean texture', 'empty room', 'zen stone'],
  romantic: ['cherry blossom', 'rose petals', 'soft pink light', 'romantic candle', 'flower close-up', 'soft morning'],
  retro:    ['vintage film', 'retro diner', 'old car', 'cassette tape', '80s neon', 'film grain'],
}

// ─── Image URL builder ────────────────────────────────────────────────────────
// Currently uses Unsplash Source (free, no key needed).
// Replace this function with your Pinterest API fetcher when ready.
export const getImageUrl = (query, seed) => {
  const h = Math.floor(Math.random() * 300 + 400)
  return `https://source.unsplash.com/featured/600x${h}?${encodeURIComponent(query)}&sig=${seed}`
}

// ─── Generate board items for a mood ─────────────────────────────────────────
export const generateItems = (moodId) => {
  const queries = MOOD_QUERIES[moodId] || MOOD_QUERIES.dreamy
  const heights = [320, 260, 400, 280, 360, 300, 440, 250, 380, 310, 420, 270]
  return Array.from({ length: 18 }, (_, i) => ({
    id: `${moodId}-${i}`,
    query: queries[i % queries.length],
    url: getImageUrl(queries[i % queries.length], i * 137 + moodId.length * 13),
    height: heights[i % heights.length],
    label: queries[i % queries.length]
      .split(' ')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' '),
    origIndex: i,
  }))
}
