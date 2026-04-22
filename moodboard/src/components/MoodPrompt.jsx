import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MoodPrompt({ onMoodText, accentColor }) {
  const [val, setVal] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!val.trim() || loading) return
    setLoading(true)
    await onMoodText(val.trim())
    setLoading(false)
    setVal('')
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 12, width: '100%', maxWidth: 520 }}>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Describe your vibe… e.g. 'cozy rainy sunday'"
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 14,
          padding: '12px 18px',
          color: '#fff',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = accentColor)}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
      />
      <motion.button
        onClick={submit}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: 14,
          padding: '12px 22px',
          color: '#fff',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
          minWidth: 70,
        }}
      >
        {loading ? '✨' : 'Go →'}
      </motion.button>
    </div>
  )
}
