import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { MOODS, generateItems } from './moods'
import Header from './components/Header'
import FloatingOrbs from './components/FloatingOrbs'
import MoodPill from './components/MoodPill'
import MoodPrompt from './components/MoodPrompt'
import MasonryGrid from './components/MasonryGrid'

// ─── Replace with your Anthropic API key ─────────────────────────────────────
// Create a .env file: VITE_ANTHROPIC_API_KEY=sk-ant-...
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

export default function App() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('')

  const loadMood = useCallback((mood) => {
    setLoading(true)
    setItems([])
    // Small delay so the exit animation can play
    setTimeout(() => {
      setItems(generateItems(mood.id))
      setLoading(false)
    }, 380)
  }, [])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    loadMood(mood)
    setAiStatus('')
  }

  // Use Claude to match free-text description to a mood
  const handleMoodText = async (text) => {
    setAiStatus('reading vibes…')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 20,
          messages: [
            {
              role: 'user',
              content: `Given this mood description: "${text}"
Pick EXACTLY ONE mood from this list that best matches it: dreamy, golden, coastal, forest, chaos, minimal, romantic, retro.
Reply with ONLY the single word mood id, nothing else.`,
            },
          ],
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)

      const data = await res.json()
      const moodId = data.content?.[0]?.text?.trim().toLowerCase().replace(/[^a-z]/g, '')
      const matched = MOODS.find((m) => m.id === moodId) || MOODS[0]
      setAiStatus(`✦ Matched to "${matched.label}" ${matched.emoji}`)
      setSelectedMood(matched)
      loadMood(matched)
    } catch (err) {
      console.error(err)
      setAiStatus('Couldn\'t read vibes — try picking a mood button!')
    }
  }

  useEffect(() => {
    loadMood(MOODS[0])
  }, [])

  return (
    <>
      {/* Animated background */}
      <motion.div
        key={selectedMood.id + '-bg'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: selectedMood.bg,
        }}
      />

      <FloatingOrbs mood={selectedMood} />
      <Header mood={selectedMood} />

      <div style={{ paddingTop: 90, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* ── Hero / Controls ── */}
        <div style={{ textAlign: 'center', padding: '48px 24px 36px' }}>
          <motion.div
            key={selectedMood.id + '-title'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontSize: 11,
                color: selectedMood.palette[0],
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              ✦ Curated for your mood ✦
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(42px, 6vw, 72px)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                marginBottom: 8,
              }}
            >
              {selectedMood.label}
              <span style={{ color: selectedMood.palette[0] }}> Board</span>
            </h1>

            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 16,
                maxWidth: 400,
                margin: '0 auto 28px',
                lineHeight: 1.6,
              }}
            >
              A visual world crafted around your feeling. Scroll, explore, get lost.
            </p>
          </motion.div>

          {/* Mood pill selectors */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            {MOODS.map((mood) => (
              <MoodPill
                key={mood.id}
                mood={mood}
                selected={selectedMood.id === mood.id}
                onSelect={handleMoodSelect}
              />
            ))}
          </div>

          {/* AI text input */}
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <MoodPrompt onMoodText={handleMoodText} accentColor={selectedMood.palette[0]} />
            <AnimatePresence>
              {aiStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: selectedMood.palette[0],
                    fontWeight: 600,
                  }}
                >
                  {aiStatus}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${selectedMood.palette[0]}44, transparent)`,
            margin: '0 40px 32px',
          }}
        />

        {/* ── Board ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 300,
                gap: 12,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: selectedMood.palette[i],
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={selectedMood.id + '-board'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MasonryGrid items={items} mood={selectedMood} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: 24,
            color: 'rgba(255,255,255,0.2)',
            fontSize: 12,
            letterSpacing: '0.05em',
          }}
        >
          moodboard · powered by AI & Unsplash · your vibe, visualized
        </div>
      </div>
    </>
  )
}
